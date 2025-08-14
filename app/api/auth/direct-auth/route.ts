import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  // Generate a one-time token
  const authToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  
  // Store token in database temporarily
  await supabase
    .from('user_profiles')
    .update({ 
      magic_token: authToken,
      magic_token_expires_at: new Date(Date.now() + 60000).toISOString() // 1 minute
    })
    .eq('email', email);

  // CRITICAL: Redirect to dashboard WITH TOKEN IN URL
  const dashboardUrl = `${request.nextUrl.origin}/dashboard?auth=${authToken}&email=${encodeURIComponent(email)}`;
  
  console.log('Redirecting to:', dashboardUrl);
  
  return NextResponse.redirect(dashboardUrl);
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}