import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  console.log('SSO attempt for:', email);
  
  if (!email || token !== 'ibam-systeme-secret-2025') {
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
  
  // Set the cookie
  response.cookies.set({
    name: 'ibam_auth',
    value: email,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  return response;
}