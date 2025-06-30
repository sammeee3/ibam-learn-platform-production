// app/api/webhooks/systeme-membership/route.ts
// CORRECTED for YOUR database schema

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to prevent build-time initialization
async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase credentials`);
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Map System.io tags to YOUR subscription tiers
const TIER_MAPPING = {
  'impact_member_v3': { 
    subscription_tier: 'impact_member', 
    tier_level: 1,
    monthly_amount: 10.00,
    trial_days: 0
  },
  'startup_business_v3': { 
    subscription_tier: 'startup_business', 
    tier_level: 2,
    monthly_amount: 59.00,
    trial_days: 7
  },
  'advanced_business_v3': { 
    subscription_tier: 'advanced_business', 
    tier_level: 3,
    monthly_amount: 59.00,
    trial_days: 7
  },
  'church_leader_small_v3': { 
    subscription_tier: 'church_small', 
    tier_level: 4,
    monthly_amount: 29.00,
    trial_days: 30
  },
  'church_leader_medium_v3': { 
    subscription_tier: 'church_medium', 
    tier_level: 5,
    monthly_amount: 79.00,
    trial_days: 30
  },
  'church_leader_large_v3': { 
    subscription_tier: 'church_large', 
    tier_level: 6,
    monthly_amount: 149.00,
    trial_days: 30
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 IBAM Webhook received');
    
    const supabase = await getSupabaseClient();
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    console.log('📥 Webhook payload:', JSON.stringify(payload, null, 2));
    
    // Extract customer data
    const customer = payload.customer || payload;
    
    if (!customer?.email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }
    
    const email = customer.email;
    const firstName = customer.first_name || '';
    const lastName = customer.last_name || '';
    
    // Determine tier from tags
    let tierInfo = TIER_MAPPING['impact_member_v3']; // default
    const tags = payload.tags || customer.tags || [];
    const tagName = payload.tag_name || '';
    
    // Check tag_name first, then tags array
    if (tagName && TIER_MAPPING[tagName]) {
      tierInfo = TIER_MAPPING[tagName];
    } else {
      for (const tag of tags) {
        if (TIER_MAPPING[tag]) {
          tierInfo = TIER_MAPPING[tag];
          break;
        }
      }
    }
    
    console.log(`Processing ${email} with tier: ${tierInfo.subscription_tier}`);
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      console.log('User exists, updating...');
      
      // Update existing user
      const updateData: any = {
        subscription_tier: tierInfo.subscription_tier,
        tier_level: tierInfo.tier_level,
        monthly_amount: tierInfo.monthly_amount,
        updated_at: new Date().toISOString()
      };
      
      // Handle trial
      if (tierInfo.trial_days > 0 && payload.order?.is_trial) {
        updateData.is_trial = true;
        updateData.subscription_status = 'trial';
        updateData.trial_start_date = new Date().toISOString().split('T')[0];
        updateData.trial_end_date = new Date(Date.now() + tierInfo.trial_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        updateData.trial_started_at = new Date().toISOString();
        updateData.trial_ends_at = new Date(Date.now() + tierInfo.trial_days * 24 * 60 * 60 * 1000).toISOString();
      } else {
        updateData.is_trial = false;
        updateData.subscription_status = 'active';
        updateData.subscription_start_date = new Date().toISOString().split('T')[0];
      }
      
      await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('email', email);
      
      return NextResponse.json({
        success: true,
        message: 'User updated',
        subscription_tier: tierInfo.subscription_tier
      });
    }
    
    // Create new user
    console.log('Creating new user...');
    
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        subscription_tier: tierInfo.subscription_tier
      }
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }
    
    // Create user profile with YOUR schema
    const profileData: any = {
      auth_user_id: authData.user.id, // YOUR schema uses auth_user_id
      email: email,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`.trim(),
      subscription_tier: tierInfo.subscription_tier,
      tier_level: tierInfo.tier_level,
      monthly_amount: tierInfo.monthly_amount,
      member_type_key: 'impact_business_startup', // adjust as needed
      primary_role_key: 'course_student',
      created_via_webhook: true,
      last_webhook_update: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Handle trial vs paid
    if (tierInfo.trial_days > 0 && payload.order?.is_trial !== false) {
      profileData.is_trial = true;
      profileData.subscription_status = 'trial';
      profileData.trial_start_date = new Date().toISOString().split('T')[0];
      profileData.trial_end_date = new Date(Date.now() + tierInfo.trial_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      profileData.trial_started_at = new Date().toISOString();
      profileData.trial_ends_at = new Date(Date.now() + tierInfo.trial_days * 24 * 60 * 60 * 1000).toISOString();
    } else {
      profileData.is_trial = false;
      profileData.subscription_status = 'active';
      profileData.subscription_start_date = new Date().toISOString().split('T')[0];
    }
    
    // Add System.io IDs if provided
    if (payload.id) profileData.systeme_customer_id = payload.id;
    if (payload.contact_id) profileData.systemio_contact_id = payload.contact_id;
    if (payload.subscription_id) profileData.systemio_subscription_id = payload.subscription_id;
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData);
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    
    console.log('✅ User created successfully');
    
    return NextResponse.json({
      success: true,
      message: 'User created',
      user_id: authData.user.id,
      subscription_tier: tierInfo.subscription_tier,
      trial: profileData.is_trial,
      trial_days: profileData.is_trial ? tierInfo.trial_days : 0
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({
      error: 'webhook_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      message: '🚀 IBAM Webhook - Ready with YOUR schema!',
      status: 'operational',
      database_connected: !error,
      total_users: count || 0,
      schema_fields: {
        auth_field: 'auth_user_id',
        tier_field: 'subscription_tier',
        level_field: 'tier_level'
      },
      tier_mapping: TIER_MAPPING,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}// Deployment timestamp: Mon Jun 30 11:31:23 PDT 2025
