import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to prevent build-time initialization
async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase credentials: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`);
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Webhook starting - checking environment variables...');
    
    // Initialize Supabase at runtime (not build time)
    const supabase = await getSupabaseClient();
    
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    console.log('📥 Webhook payload received');
    
    // Basic validation
    if (!payload.customer?.email) {
      return NextResponse.json(
        { error: 'Missing customer email' },
        { status: 400 }
      );
    }
    
    const { customer } = payload;
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection failed:', testError);
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Database connection successful');
    
    return NextResponse.json({
      success: true,
      message: '🎉 ENVIRONMENT VARIABLES WORKING!',
      customer_email: customer.email,
      database_connected: true,
      nuclear_option: 'NOT_NEEDED',
      environment_check: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json({
      error: 'webhook_failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      environment_debug: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    
    return NextResponse.json({
      message: '🚀 IBAM Webhook - Environment Variables Working!',
      status: 'operational',
      nuclear_option: 'DEACTIVATED',
      environment_variables: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      nuclear_option: 'MIGHT_BE_NEEDED'
    }, { status: 500 });
  }
}
