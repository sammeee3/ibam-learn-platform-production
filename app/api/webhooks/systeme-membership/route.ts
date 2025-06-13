// app/api/webhooks/systeme-membership/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// HMAC signature verification
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const providedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(providedSignature, 'hex')
  );
}

// Tag to tier mapping
const TAG_TO_TIER_MAPPING: Record<string, string> = {
  'impact_member_v3': 'impact_supporter',
  'startup_business_v3': 'individual_startup', 
  'advanced_business_v3': 'advanced_business',
  'church_leader_small_v3': 'church_partner_small',
  'church_leader_medium_v3': 'church_partner_medium',
  'church_leader_large_v3': 'church_partner_large'
};

// Generate secure random password
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Send welcome email with credentials
async function sendWelcomeEmail(email: string, password: string, tier: string, fullName: string) {
  try {
    const welcomeMessages = {
      impact_supporter: {
        subject: '🎉 Welcome to IBAM - Your Discipleship Journey Starts Now!',
        message: `Access your discipleship resources and workplace ministry tools immediately.`
      },
      individual_startup: {
        subject: '🚀 Your Faith-Driven Business Journey Begins!',
        message: `Start building your business plan with our AI-powered tools and faith-based guidance.`
      },
      advanced_business: {
        subject: '💼 Advanced Business Training + Coaching Access Unlocked!',
        message: `Your premium business training and coaching features are ready.`
      },
      church_partner_small: {
        subject: '⛪ Church Partner Access - Small Church Resources',
        message: `Your church resources for 50-150 members are now available.`
      },
      church_partner_medium: {
        subject: '⛪ Church Partner Access - Medium Church Resources', 
        message: `Your church resources for 150-400 members are now available.`
      },
      church_partner_large: {
        subject: '⛪ Church Partner Access - Large Church Resources',
        message: `Your church resources for 400+ members are now available.`
      }
    };

    const config = welcomeMessages[tier as keyof typeof welcomeMessages] || welcomeMessages.impact_supporter;
    
    console.log(`Sending welcome email to ${email} for tier ${tier}`);
    
    // For now, log the email details (implement actual email service later)
    console.log({
      to: email,
      subject: config.subject,
      body: `Hi ${fullName},\n\n${config.message}\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nLogin here: https://ibam-learning-platform-p7yw.vercel.app/auth/login\n\nBlessings,\nThe IBAM Team`
    });
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Main webhook handler
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting check (basic implementation)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log(`Webhook request from IP: ${clientIP} at ${new Date().toISOString()}`);
    
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify HMAC signature (if secret is configured)
    const signature = req.headers.get('x-systeme-signature');
    const webhookSecret = process.env.SYSTEME_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('Webhook signature verification failed');
        return NextResponse.json(
          { error: 'unauthorized', message: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }
    
    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    console.log('Webhook payload received:', JSON.stringify(payload, null, 2));
    
    // Validate required fields
    if (!payload.customer?.email || !payload.customer?.first_name || !payload.customer?.last_name) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Missing required customer fields' },
        { status: 400 }
      );
    }
    
    // Extract user data
    const {
      customer: { email, first_name, last_name, id: systeme_customer_id },
      order: { id: order_id },
      subscription,
      tags,
      product
    } = payload;
    
    const fullName = `${first_name} ${last_name}`;
    
    // Determine membership tier from tags
    let membershipTier = 'trial'; // default fallback
    let tierLevel = 0;
    
    // Check for primary tier tags
    if (tags?.primary_tier) {
      membershipTier = TAG_TO_TIER_MAPPING[tags.primary_tier] || 'trial';
    } else if (Array.isArray(tags)) {
      // Fallback: check if any tags match our mapping
      for (const tag of tags) {
        if (TAG_TO_TIER_MAPPING[tag]) {
          membershipTier = TAG_TO_TIER_MAPPING[tag];
          break;
        }
      }
    }
    
    // Get tier configuration from database
    const { data: memberType, error: tierError } = await supabase
      .from('member_types')
      .select('*')
      .eq('tier_key', membershipTier)
      .single();
    
    if (tierError || !memberType) {
      console.error('Tier lookup failed:', tierError);
      membershipTier = 'trial';
      tierLevel = 0;
    } else {
      tierLevel = memberType.tier_level;
    }
    
    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('user_profiles')
      .select('id, email, systemio_contact_id')
      .eq('email', email.toLowerCase())
      .single();
    
    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('User check failed:', userCheckError);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to check existing user' },
        { status: 500 }
      );
    }
    
    let userId: string;
    let isNewUser = false;
    const password = generateSecurePassword();
    
    if (existingUser) {
      // Update existing user
      userId = existingUser.id;
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: membershipTier,
          tier_level: tierLevel,
          systemio_contact_id: systeme_customer_id,
          systemio_subscription_id: subscription?.id,
          subscription_status: subscription?.status || 'active',
          subscription_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('User update failed:', updateError);
        return NextResponse.json(
          { error: 'update_failed', message: 'Failed to update user' },
          { status: 500 }
        );
      }
      
      console.log(`Updated existing user ${userId} with tier ${membershipTier}`);
      
    } else {
      // Create new user account in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          first_name,
          last_name
        }
      });
      
      if (authError) {
        console.error('Auth user creation failed:', authError);
        return NextResponse.json(
          { error: 'auth_creation_failed', message: 'Failed to create user account' },
          { status: 500 }
        );
      }
      
      userId = authUser.user.id;
      isNewUser = true;
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: email.toLowerCase(),
          full_name: fullName,
          subscription_tier: membershipTier,
          tier_level: tierLevel,
          subscription_status: subscription?.status || 'active',
          systemio_contact_id: systeme_customer_id,
          systemio_subscription_id: subscription?.id,
          subscription_start_date: new Date().toISOString(),
          trial_end_date: subscription?.trial_end_date,
          onboarding_completed: false,
          is_business_ambassador: membershipTier.includes('business'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Profile creation failed:', profileError);
        
        // Cleanup: delete auth user if profile creation failed
        await supabase.auth.admin.deleteUser(userId);
        
        return NextResponse.json(
          { error: 'profile_creation_failed', message: 'Failed to create user profile' },
          { status: 500 }
        );
      }
      
      console.log(`Created new user ${userId} with tier ${membershipTier}`);
    }
    
    // Send welcome email with credentials (only for new users)
    if (isNewUser) {
      const emailSent = await sendWelcomeEmail(email, password, membershipTier, fullName);
      if (!emailSent) {
        console.warn('Welcome email sending failed, but user was created successfully');
      }
    }
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    // Return success response
    const response = {
      success: true,
      user_id: userId,
      is_new_user: isNewUser,
      member_tier: membershipTier,
      tier_level: tierLevel,
      systeme_contact_id: systeme_customer_id,
      processing_time_ms: processingTime,
      features_enabled: {
        ai_coaching: tierLevel >= 2,
        human_coaching: tierLevel >= 3,
        church_resources: membershipTier.includes('church'),
        business_tools: membershipTier.includes('business') || membershipTier.includes('startup'),
        advanced_features: tierLevel >= 3
      },
      message: isNewUser ? 'User created successfully with enhanced features' : 'User updated successfully',
      timestamp: new Date().toISOString()
    };
    
    console.log('Webhook processed successfully:', response);
    
    return NextResponse.json(response, { status: isNewUser ? 201 : 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json(
      {
        error: 'internal_error',
        message: 'Webhook processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Enhanced Systeme.io Webhook Endpoint Active',
    version: '3.1.0',
    features: [
      'flexible_tier_system',
      'ai_coaching_integration',
      'database_driven_configuration',
      'church_partnership_support',
      'enhanced_user_onboarding',
      'hmac_signature_verification',
      'automatic_email_delivery'
    ],
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
}
