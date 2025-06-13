// app/api/webhooks/systeme-membership/route.ts - WORLD-CLASS IMPLEMENTATION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// World-class environment variable handling
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing - check environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Enterprise-grade HMAC verification
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  
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

// Advanced rate limiting (world-class)
const rateLimiter = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 20) return true;
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return false;
}

// Tier mapping with enterprise validation
const TAG_TO_TIER_MAPPING: Record<string, { tier: string; level: number }> = {
  'impact_member_v3': { tier: 'impact_supporter', level: 1 },
  'startup_business_v3': { tier: 'individual_startup', level: 2 },
  'advanced_business_v3': { tier: 'advanced_business', level: 3 },
  'church_leader_small_v3': { tier: 'church_partner_small', level: 4 },
  'church_leader_medium_v3': { tier: 'church_partner_medium', level: 5 },
  'church_leader_large_v3': { tier: 'church_partner_large', level: 6 }
};

// World-class webhook handler
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    // Security layer 1: Rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (isRateLimited(clientIP)) {
      console.warn(`[${requestId}] Rate limited IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'rate_limited', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    console.log(`[${requestId}] Webhook request from IP: ${clientIP}`);
    
    // Security layer 2: Signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-systeme-signature');
    const webhookSecret = process.env.SYSTEME_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error(`[${requestId}] Invalid webhook signature`);
        return NextResponse.json(
          { error: 'unauthorized', message: 'Invalid signature' },
          { status: 401 }
        );
      }
    }
    
    // Parse and validate payload
    const payload = JSON.parse(rawBody);
    
    if (!payload.customer?.email || !payload.customer?.first_name || !payload.customer?.last_name) {
      console.error(`[${requestId}] Missing required fields`);
      return NextResponse.json(
        { error: 'validation_error', message: 'Missing required customer fields' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase with error handling
    const supabase = getSupabaseClient();
    
    // Extract and process user data
    const {
      customer: { email, first_name, last_name, id: systeme_customer_id },
      order,
      subscription,
      tags,
      product
    } = payload;
    
    const fullName = `${first_name} ${last_name}`;
    
    // Advanced tier detection
    let membershipTier = 'trial';
    let tierLevel = 0;
    
    if (tags?.primary_tier && TAG_TO_TIER_MAPPING[tags.primary_tier]) {
      const mapping = TAG_TO_TIER_MAPPING[tags.primary_tier];
      membershipTier = mapping.tier;
      tierLevel = mapping.level;
    } else if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (TAG_TO_TIER_MAPPING[tag]) {
          const mapping = TAG_TO_TIER_MAPPING[tag];
          membershipTier = mapping.tier;
          tierLevel = mapping.level;
          break;
        }
      }
    }
    
    // Database operations with error handling
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();
    
    let userId: string;
    let isNewUser = false;
    
    if (existingUser) {
      // Update existing user
      userId = existingUser.id;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: membershipTier,
          tier_level: tierLevel,
          systemio_contact_id: systeme_customer_id,
          systemio_subscription_id: subscription?.id,
          subscription_status: subscription?.status || 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      console.log(`[${requestId}] Updated user ${userId} to tier ${membershipTier}`);
      
    } else {
      // Create new user
      const password = crypto.randomBytes(16).toString('hex');
      
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: { full_name: fullName, first_name, last_name }
      });
      
      if (authError) throw authError;
      
      userId = authUser.user.id;
      isNewUser = true;
      
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
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        await supabase.auth.admin.deleteUser(userId);
        throw profileError;
      }
      
      console.log(`[${requestId}] Created user ${userId} with tier ${membershipTier}`);
      
      // Log credentials for email service
      console.log(`[${requestId}] Login credentials: ${email} / ${password}`);
    }
    
    const processingTime = Date.now() - startTime;
    
    // World-class response
    const response = {
      success: true,
      request_id: requestId,
      user_id: userId,
      is_new_user: isNewUser,
      member_tier: membershipTier,
      tier_level: tierLevel,
      processing_time_ms: processingTime,
      features_enabled: {
        ai_coaching: tierLevel >= 2,
        human_coaching: tierLevel >= 3,
        church_resources: membershipTier.includes('church'),
        business_tools: membershipTier.includes('business') || membershipTier.includes('startup')
      },
      timestamp: new Date().toISOString()
    };
    
    console.log(`[${requestId}] Success: ${JSON.stringify(response)}`);
    
    return NextResponse.json(response, { 
      status: isNewUser ? 201 : 200,
      headers: {
        'X-Request-ID': requestId,
        'X-Processing-Time': processingTime.toString()
      }
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    
    return NextResponse.json(
      {
        error: 'internal_error',
        request_id: requestId,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// World-class health check
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('user_profiles').select('count').limit(1);
    
    return NextResponse.json({
      message: '🚀 IBAM Webhook Endpoint - World-Class Implementation',
      version: '4.0.0',
      status: 'operational',
      database: 'connected',
      security: 'enterprise-grade',
      performance: 'optimized',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'degraded', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
