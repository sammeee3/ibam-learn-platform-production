// app/auth/auto-session/route.ts - TEST VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  // TEST MODE - CHANGE THIS EMAIL TO YOUR EMAIL
  const TEST_EMAILS = ['statements61-junk@yahoo.com']; // <-- PUT YOUR EMAIL HERE
  const isTestMode = TEST_EMAILS.includes(email || '');
  
  console.log(`🔍 Auto-session attempt for: ${email}, Test mode: ${isTestMode}`);
  
  if (!email || token !== 'ibam-systeme-secret-2025') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('auth_user_id, subscription_tier, tier_level')
      .eq('email', email)
      .single();
    
    if (error || !profile) {
      console.error('User not found:', email);
      return NextResponse.redirect(new URL('/auth/login?error=user_not_found', request.url));
    }
    
    // TEST MODE: You go to real dashboard, others go to direct-access
    const redirectPath = isTestMode ? '/dashboard' : '/direct-access';
    console.log(`➡️ Redirecting to: ${redirectPath}`);
    
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    
    // Set the auth cookie that middleware expects
    response.cookies.set('ibam_auth', profile.auth_user_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Set tier info for future use
    response.cookies.set('ibam_tier', profile.subscription_tier || 'beta', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    
    console.log(`✅ Cookies set for ${email}, redirecting to ${redirectPath}`);
    
    return response;
    
  } catch (error) {
    console.error('Auto-session error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=auto_session_failed', request.url));
  }
}