import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  console.log('Direct auth attempt for:', email);
  
  if (!email || token !== 'ibam-systeme-secret-2025') {
    console.log('Invalid token or missing email');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify user exists
  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (!userProfile) {
    console.log('User not found:', email);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('User found, setting cookie and redirecting');

  // CRITICAL: Set cookie using Next.js cookies() function
  const cookieStore = cookies();
  
  // Set the ibam_auth cookie that middleware expects
  cookieStore.set('ibam_auth', email, {
    httpOnly: false,  // Allow client access
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
  
  // Also set backup cookies for redundancy
  cookieStore.set('ibam_user_email', email, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  console.log('Cookies set, redirecting to dashboard');
  
  // Redirect to clean dashboard (no token in URL needed now)
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}