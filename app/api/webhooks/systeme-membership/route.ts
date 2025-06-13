// app/api/webhooks/systeme-membership/route.ts
// 💥 EXTREME DANGER: SERVICE_ROLE KEY HARD-CODED
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// 🚨 NUCLEAR OPTION - FULL DATABASE ACCESS
const SUPABASE_URL = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

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

// Main webhook handler
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Initialize Supabase with SERVICE_ROLE key (FULL POWER)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log(`🔥 WEBHOOK REQUEST from IP: ${clientIP} at ${new Date().toISOString()}`);
    
    // Get raw body
    const rawBody = await req.text();
    
    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    console.log('📥 WEBHOOK PAYLOAD:', JSON.stringify(payload, null, 2));
    
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
      order,
      subscription,
      tags,
      product
    } = payload;
    
    const fullName = `${first_name} ${last_name}`;
    
    // Determine membership tier from tags
    let membershipTier = 'trial';
    let tierLevel = 0;
    
    // Check for primary tier tags
    if (tags?.primary_tier) {
      membershipTier = TAG_TO_TIER_MAPPING[tags.primary_tier] || 'trial';
    } else if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (TAG_TO_TIER_MAPPING[tag]) {
          membershipTier = TAG_TO_TIER_MAPPING[tag];
          break;
        }
      }
    }
    
    // Get tier level from database
    try {
      const { data: memberType } = await supabase
        .from('member_types')
        .select('tier_level')
        .eq('tier_key', membershipTier)
        .single();
      
      if (memberType) {
        tierLevel = memberType.tier_level;
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch tier level:', error);
    }
    
    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('user_profiles')
      .select('id, email, systemio_contact_id')
      .eq('email', email.toLowerCase())
      .single();
    
    let userId: string;
    let isNewUser = false;
    const password = generateSecurePassword();
    
    if (existingUser && !userCheckError) {
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
        console.error('❌ User update failed:', updateError);
        return NextResponse.json(
          { error: 'update_failed', message: updateError.message },
          { status: 500 }
        );
      }
      
      console.log(`✅ Updated existing user ${userId} with tier ${membershipTier}`);
      
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
        console.error('❌ Auth user creation failed:', authError);
        return NextResponse.json(
          { error: 'auth_creation_failed', message: authError.message },
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
        console.error('❌ Profile creation failed:', profileError);
        
        // Cleanup: delete auth user if profile creation failed
        await supabase.auth.admin.deleteUser(userId);
        
        return NextResponse.json(
          { error: 'profile_creation_failed', message: profileError.message },
          { status: 500 }
        );
      }
      
      console.log(`🎉 Created new user ${userId} with tier ${membershipTier}`);
    }
    
    // Log welcome email credentials (implement actual email service later)
    if (isNewUser) {
      console.log({
        action: '�� WELCOME EMAIL CREDENTIALS',
        to: email,
        subject: `🎉 Welcome to IBAM - Your ${membershipTier} Access is Ready!`,
        login_credentials: {
          email: email,
          password: password,
          login_url: 'https://ibam-learning-platform-p7yw.vercel.app/auth/login'
        },
        tier_info: {
          tier: membershipTier,
          level: tierLevel,
          features_unlocked: {
            ai_coaching: tierLevel >= 2,
            human_coaching: tierLevel >= 3,
            church_resources: membershipTier.includes('church'),
            business_tools: membershipTier.includes('business') || membershipTier.includes('startup')
          }
        }
      });
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
      message: isNewUser ? '🎉 User created successfully with full database access!' : '✅ User updated successfully',
      timestamp: new Date().toISOString(),
      nuclear_option: true
    };
    
    console.log('🚀 WEBHOOK PROCESSED SUCCESSFULLY:', response);
    
    return NextResponse.json(response, { status: isNewUser ? 201 : 200 });
    
  } catch (error) {
    console.error('💥 WEBHOOK PROCESSING ERROR:', error);
    
    return NextResponse.json(
      {
        error: 'internal_error',
        message: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: '🚀 IBAM Webhook Endpoint LIVE with FULL DATABASE ACCESS',
    version: '3.1.0',
    timestamp: new Date().toISOString(),
    status: 'operational',
    nuclear_option: true,
    warning: '🚨 SERVICE_ROLE KEY ACTIVE - EXTREME SECURITY RISK!'
  });
}
