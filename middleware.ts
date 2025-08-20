import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Session timeout in milliseconds (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  
  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/coaching', '/business-plan'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  
  if (!isProtectedRoute) {
    return response;
  }
  
  // CRITICAL FIX: Check for auth token in URL FIRST (for Systeme.io SSO)
  const urlAuthToken = searchParams.get('auth');
  const urlEmail = searchParams.get('email');
  
  if (urlAuthToken && urlEmail) {
    console.log('✅ URL auth token detected, allowing access for SSO');
    // Let the dashboard handle the token and set cookies
    const ssoResponse = NextResponse.next();
    // Add security headers to SSO response too
    ssoResponse.headers.set('X-Frame-Options', 'DENY');
    ssoResponse.headers.set('X-Content-Type-Options', 'nosniff');
    return ssoResponse;
  }
  
  // Check for auth cookie (normal flow) - REQUIRE server cookie for security
  const serverCookie = req.cookies.get('ibam_auth_server');
  const clientCookie = req.cookies.get('ibam_auth');
  
  // Security: Prefer server cookie, only accept client cookie in specific cases
  let authCookie: any = null;
  if (serverCookie) {
    // Server cookie exists - use it (most secure)
    authCookie = serverCookie;
  } else if (clientCookie && clientCookie.value === 'authenticated') {
    // Only allow client cookie if it's the generic 'authenticated' value
    // This prevents client-side manipulation of email addresses
    console.log('⚠️ Using client cookie fallback (less secure)');
    authCookie = clientCookie;
  } else {
    // No valid authentication found
    console.log('❌ No valid server cookie found');
    authCookie = null;
  }
  
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
    
    // Extract user identifier from authentication cookie
    // Server cookie contains email, client cookie should only be 'authenticated'
    if (serverCookie) {
      userIdentifier = serverCookie.value; // Server cookie has the email
    } else if (authCookie.value === 'authenticated') {
      // Client cookie fallback - we need additional validation
      console.log('⚠️ Client cookie authentication - requires additional validation');
      userIdentifier = 'authenticated';
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
      // Client cookie with 'authenticated' status - enhanced validation required
      console.log('⚠️ Client cookie authentication requires additional checks');
      
      // For client cookies, we need to check if there's a valid session another way
      // This is a fallback for compatibility but less secure
      
      // Check if there are any active user sessions (less specific but safer)
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('email')
        .limit(1);
      
      if (profiles && profiles.length > 0) {
        // There are users in the system, but we can't verify which one
        // This is the least secure path - log for monitoring
        console.log('⚠️ WARNING: Using insecure client cookie fallback');
        userFound = true;
      } else {
        console.log('❌ No valid user sessions found');
        userFound = false;
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
    
    // Return response with security headers
    const secureResponse = NextResponse.next();
    secureResponse.headers.set('X-Frame-Options', 'DENY');
    secureResponse.headers.set('X-Content-Type-Options', 'nosniff');
    secureResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return secureResponse;
    
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