import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  
  // Handle NEW magic link format (code parameter)
  const code = requestUrl.searchParams.get('code');
  
  // Handle OLD format (token_hash) as fallback
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  
  // Get redirect destination
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect_to') || '/dashboard';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Handle NEW magic link code exchange
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        console.log('Successfully authenticated with code');
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      } else {
        console.error('Code exchange error:', error);
      }
    } catch (err) {
      console.error('Code exchange failed:', err);
    }
  }
  
  // Handle OLD OTP format (fallback)
  if (token_hash && type) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });
      
      if (!error) {
        console.log('Successfully authenticated with OTP');
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      } else {
        console.error('OTP verification error:', error);
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  }

  // If we get here, authentication failed
  console.error('Authentication failed - no valid code or token_hash');
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}