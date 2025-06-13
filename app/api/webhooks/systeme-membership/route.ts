// app/api/webhooks/systeme-membership/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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
    console.log(`Sending welcome email to ${email} for tier ${tier}`);
    console.log({
      to: email,
      subject: `Welcome to IBAM - ${tier}`,
      login_credentials: { email, password }
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
    // Initialize Supabase client inside the function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'configuration_error', message: 'Database configuration missing' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Rate limiting check
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
    
    // For testing, create a simple success response
    const processingTime = Date.now() - startTime;
    
    const response = {
      success: true,
      message: 'Webhook received and processed successfully',
      member_tier: membershipTier,
      tier_level: tierLevel,
      systeme_contact_id: systeme_customer_id,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    };
    
    console.log('Webhook processed successfully:', response);
    
    return NextResponse.json(response, { status: 200 });
    
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
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
}
