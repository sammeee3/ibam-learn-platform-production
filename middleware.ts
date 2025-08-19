import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/coaching', '/business-plan'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // CRITICAL FIX: Check for auth token in URL FIRST (for Systeme.io SSO)
  const urlAuthToken = searchParams.get('auth');
  const urlEmail = searchParams.get('email');
  
  if (urlAuthToken && urlEmail) {
    console.log('✅ URL auth token detected, allowing access for SSO');
    // Let the dashboard handle the token and set cookies
    return NextResponse.next();
  }
  
  // Check for auth cookie (normal flow) - Use server cookie for security
  const authCookie = req.cookies.get('ibam_auth_server') || req.cookies.get('ibam_auth'); // Fallback for compatibility
  
  if (!authCookie) {
    console.log('❌ No auth cookie found, redirecting to login');
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Validate user exists
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Initialize as undefined to handle both types
    let userFound = false;
    
    // Determine cookie type and extract user identifier
    let userIdentifier = authCookie.value;
    
    // If using server cookie, it contains email; if client cookie, need to get from server cookie
    const serverCookie = req.cookies.get('ibam_auth_server');
    if (serverCookie) {
      userIdentifier = serverCookie.value; // Server cookie has the email
    }
    
    // Check if the cookie value is an email (SSO users) or a user ID (regular users)
    if (userIdentifier.includes('@')) {
      // It's an email from SSO - check user_profiles table
      console.log('🔍 Checking SSO user by email:', userIdentifier);
      
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userIdentifier)
        .single();
      
      if (userProfile) {
        // User exists in profiles table - they're authenticated
        userFound = true;
        console.log('✅ SSO user validated in profiles table');
      } else {
        console.log('❌ SSO user not found in profiles table');
      }
      
    } else if (userIdentifier !== 'authenticated') {
      // It's a regular user ID - check auth.users table
      console.log('🔍 Checking regular user by ID:', userIdentifier);
      
      try {
        const { data: authData } = await supabase.auth.admin.getUserById(userIdentifier);
        
        if (authData?.user) {
          userFound = true;
          console.log('✅ Regular user validated in auth system');
        } else {
          console.log('❌ Regular user not found in auth system');
        }
      } catch (e) {
        // getUserById might fail if it's not a valid UUID
        console.log('❌ Invalid user ID format');
      }
    } else {
      // Client cookie with 'authenticated' status - validate server cookie exists
      if (serverCookie && serverCookie.value.includes('@')) {
        userFound = true;
        console.log('✅ Client cookie validated with server cookie');
      } else {
        console.log('❌ Client cookie present but no valid server cookie');
      }
    }
    
    // If no user found, redirect to login
    if (!userFound) {
      console.log('❌ User validation failed, redirecting to login');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('error', 'unauthorized');
      
      // Clear the invalid cookie
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('ibam_auth');
      return response;
    }
    
    console.log('✅ User validated, allowing access to protected route');
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware error:', error);
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('error', 'validation_failed');
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/coaching/:path*', '/business-plan/:path*'],
};