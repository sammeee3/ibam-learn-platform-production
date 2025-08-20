import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(req: NextRequest) {
  try {
    // Check for authentication cookies
    const cookieStore = cookies();
    const authCookie = cookieStore.get('ibam_auth');
    const authServerCookie = cookieStore.get('ibam_auth_server');
    
    // Must have at least one valid authentication cookie
    if (!authCookie && !authServerCookie) {
      return NextResponse.json(
        { error: 'No authentication session found' }, 
        { status: 401 }
      );
    }

    // Get email from cookies (server cookie takes precedence)
    const email = authServerCookie?.value || authCookie?.value;
    
    if (!email || email === 'undefined' || email === 'null') {
      return NextResponse.json(
        { error: 'Invalid authentication session' }, 
        { status: 401 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email in session' }, 
        { status: 401 }
      );
    }

    // SECURITY FIX: Verify user actually exists in database
    console.log('🔐 Validating user exists in database:', email);
    
    try {
      // Check if user exists in user_profiles table (created by webhooks and signups)
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, email, is_active, has_platform_access, auth_user_id')
        .eq('email', email)
        .single();

      if (profileError || !userProfile) {
        console.log('❌ User not found in user_profiles:', email);
        return NextResponse.json(
          { error: 'User account not found' }, 
          { status: 401 }
        );
      }

      // Check if user is active and has platform access
      if (!userProfile.is_active || !userProfile.has_platform_access) {
        console.log('❌ User account inactive or access denied:', email);
        return NextResponse.json(
          { error: 'Account access denied' }, 
          { status: 401 }
        );
      }

      console.log('✅ User validated in database:', email);

      // Return valid session with user info
      return NextResponse.json({
        authenticated: true,
        email: email,
        userId: userProfile.auth_user_id,
        source: authServerCookie ? 'server_cookie' : 'client_cookie',
        accountStatus: 'active'
      });

    } catch (dbError) {
      console.error('Database validation error:', dbError);
      return NextResponse.json(
        { error: 'Session validation failed' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Session validation failed' }, 
      { status: 500 }
    );
  }
}