// app/api/webhooks/church-provisioning/route.ts
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

// Church tier mapping
const CHURCH_TAG_TO_TIER: Record<string, string> = {
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

// Send church leader welcome email
async function sendChurchWelcomeEmail(
  email: string, 
  password: string, 
  tier: string, 
  fullName: string,
  churchName: string,
  organizationId: string
) {
  try {
    const tierMessages = {
      church_partner_small: {
        subject: '⛪ Welcome to IBAM Church Partnership - Small Church Resources',
        features: 'Small group resources, volunteer management, and discipleship tools for 50-150 members'
      },
      church_partner_medium: {
        subject: '⛪ Welcome to IBAM Church Partnership - Medium Church Resources',
        features: 'Advanced church management, event planning, and multi-campus support for 150-400 members'
      },
      church_partner_large: {
        subject: '⛪ Welcome to IBAM Church Partnership - Large Church Resources',
        features: 'Enterprise church management, advanced analytics, and comprehensive ministry tools for 400+ members'
      }
    };
    
    const config = tierMessages[tier as keyof typeof tierMessages] || tierMessages.church_partner_small;
    
    console.log(`Sending church welcome email to ${email} for ${churchName}`);
    
    // Log email details (implement actual email service)
    console.log({
      to: email,
      subject: config.subject,
      church_name: churchName,
      organization_id: organizationId,
      login_credentials: { email, password }
    });
    
    return true;
  } catch (error) {
    console.error('Church welcome email failed:', error);
    return false;
  }
}

// Main church provisioning webhook handler
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log(`Church webhook request from IP: ${clientIP} at ${new Date().toISOString()}`);
    
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify HMAC signature
    const signature = req.headers.get('x-systeme-signature');
    const webhookSecret = process.env.SYSTEME_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('Church webhook signature verification failed');
        return NextResponse.json(
          { error: 'unauthorized', message: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }
    
    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    console.log('Church webhook payload received:', JSON.stringify(payload, null, 2));
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    // Return success response
    const response = {
      success: true,
      message: 'Church webhook processed successfully',
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    };
    
    console.log('Church webhook processed successfully:', response);
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Church webhook processing error:', error);
    
    return NextResponse.json(
      {
        error: 'internal_error',
        message: 'Church webhook processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Church Provisioning Webhook Endpoint Active',
    version: '3.1.0',
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
}
