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
  
  // Check for auth cookie (normal flow)
  const authCookie = req.cookies.get('ibam_auth');
  
  if (!authCookie) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Validate user exists in SUPABASE AUTH (not profiles table)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check auth.users table instead of profiles table
    const { data: { user }, error } = await supabase.auth.admin.getUserById(authCookie.value);
    
    if (error || !user) {
      console.log('❌ User not found in auth system, blocking access');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('✅ User validated in auth system, allowing access');
    return NextResponse.next();
    
  } catch (error) {
    console.error('Auth validation error:', error);
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('error', 'validation_failed');
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/coaching/:path*', '/business-plan/:path*'],
};