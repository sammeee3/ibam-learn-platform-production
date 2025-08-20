import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  console.log('🔐 Magic token authentication attempt:', token?.substring(0, 8) + '...');
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = supabaseAdmin;
  
  try {
    // Find user profile with matching magic token
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('magic_token', token)
      .single();
    
    if (profileError || !profile) {
      console.log('❌ Invalid token or user not found:', profileError?.message);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Check if token is still valid (not expired)
    if (profile.magic_token_expires_at && new Date(profile.magic_token_expires_at) <= new Date()) {
      console.log('❌ Token expired');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    const email = profile.email;
    console.log('✅ Valid token for:', email);
    
    // Create the dashboard URL
    const dashboardUrl = new URL('/dashboard', request.url);
    
    // Set authentication cookies
    const response = NextResponse.redirect(dashboardUrl);
    
    // Server cookie (secure, httpOnly) for authentication validation
    response.cookies.set({
      name: 'ibam_auth_server',
      value: email,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    // Client cookie (readable by JS) for UI state
    response.cookies.set({
      name: 'ibam_auth',
      value: 'authenticated',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    console.log('✅ Magic token authentication successful, redirecting to dashboard');
    return response;
    
  } catch (error: any) {
    console.log('❌ Magic token authentication error:', error.message);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}