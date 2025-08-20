import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration with staging fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhfxxouswctucxvfetcq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDI1ODA1MywiZXhwIjoyMDM5ODM0MDUzfQ.VFU7vCVXxnLWrkqx_iwJjBaKzHl5iKJOS1q5J9jpPsg';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secret } = body;

    // Use environment variable with fallback for backward compatibility
    const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'ibam-systeme-secret-2025';
    
    if (secret !== SYSTEME_SECRET) {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    // Verify user exists
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Generate magic link that goes through YOUR callback
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: 'https://ibam-learn-platform-v3.vercel.app/auth/callback?next=/dashboard'
      }
    });

    if (error || !data?.properties?.action_link) {
      return NextResponse.json({ success: false, error: 'Failed to create magic link' }, { status: 500 });
    }

    console.log('Generated magic link for:', email);

    const response = NextResponse.json({
      success: true,
      loginUrl: data.properties.action_link
    });

    response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('Token login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}