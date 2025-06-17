import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/coaching', '/business-plan'];
  
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirect', pathname); // Return user to original page after login
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/coaching/:path*', '/business-plan/:path*'],
};
