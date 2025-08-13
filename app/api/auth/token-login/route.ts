import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secret } = body;

    console.log('Token login attempt for:', email);

    if (secret !== 'ibam-systeme-secret-2025') {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    // Verify user exists
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      console.error('User not found:', email);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Generate ONE-TIME PASSWORD (OTP) magic link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: 'https://ibam-learn-platform-v3.vercel.app/dashboard'
      }
    });

    if (error || !data?.properties?.action_link) {
      console.error('Failed to create magic link:', error);
      return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
    }

    // Return the magic link URL
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