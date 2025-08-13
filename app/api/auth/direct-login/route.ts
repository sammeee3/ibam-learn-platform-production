import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Verify token
  const { data: userProfile } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .eq('magic_token', token)
    .single();

  if (!userProfile) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Check token expiry
  if (userProfile.magic_token_expires_at && 
      new Date(userProfile.magic_token_expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Clear the token
  await supabaseAdmin
    .from('user_profiles')
    .update({ 
      magic_token: null,
      magic_token_expires_at: null 
    })
    .eq('email', email);

  // Generate a new magic link that will auto-sign in the user
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: email,
    options: {
      redirectTo: '/dashboard'
    }
  });

  if (error || !data.properties?.action_link) {
    console.error('Failed to generate magic link:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to the magic link which will authenticate the user
  return NextResponse.redirect(data.properties.action_link);
}