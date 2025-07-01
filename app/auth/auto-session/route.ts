import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Create a special one-time token
  const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  
  // Redirect to dashboard with special token
  const dashboardUrl = new URL(redirect, request.url);
  dashboardUrl.searchParams.set('authToken', token);
  dashboardUrl.searchParams.set('userId', userId);
  
  return NextResponse.redirect(dashboardUrl);
}
