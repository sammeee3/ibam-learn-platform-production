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
  
  // Check for auth cookie (normal flow) - Prefer server cookie for security
  const serverCookie = req.cookies.get('ibam_auth_server');
  const clientCookie = req.cookies.get('ibam_auth');
  
  // Use server cookie if available, otherwise use client cookie
  const authCookie = serverCookie || clientCookie;
  
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
    
    // Extract email from authentication cookie
    const userEmail = authCookie.value;
    
    // Validate email format
    if (!userEmail.includes('@')) {
      console.log('❌ Invalid email format in cookie:', userEmail);
      userFound = false;
    } else {
      // Check if user exists in user_profiles table
      console.log('🔍 Checking user by email:', userEmail);
      
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (userProfile) {
        userFound = true;
        console.log('✅ User validated in profiles table');
      } else {
        console.log('❌ User not found in profiles table');
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