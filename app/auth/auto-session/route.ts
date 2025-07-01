import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Create a response that redirects to dashboard
  const response = NextResponse.redirect(new URL(redirect, request.url));
  
  // Set a simple session cookie that marks them as logged in
  response.cookies.set('ibam-user-id', userId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  response.cookies.set('ibam-auth-status', 'authenticated', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}
