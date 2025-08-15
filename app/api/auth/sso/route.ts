import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  console.log('SSO attempt for:', email);
  
  // Use environment variable with fallback to current secret for backward compatibility
  const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'ibam-systeme-secret-2025';
  
  if (!email || token !== SYSTEME_SECRET) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify user exists
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (!userProfile) {
    console.log('User not found:', email);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('User verified, setting cookie and redirecting');

  // Create the dashboard URL
  const dashboardUrl = new URL('/dashboard', request.url);
  
  // Create the response with redirect
  const response = NextResponse.redirect(dashboardUrl);
  
  // HYBRID COOKIE STRATEGY: Set both server-side and client-side cookies
  // Server cookie (secure, httpOnly) for authentication validation
  response.cookies.set({
    name: 'ibam_auth_server',
    value: email,
    httpOnly: true, // Secure server-side validation
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  // Client cookie (readable by JS) for UI state - minimal data only
  response.cookies.set({
    name: 'ibam_auth',
    value: 'authenticated', // Only status, no sensitive data
    httpOnly: false, // Client-side readable for UI
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  return response;
}