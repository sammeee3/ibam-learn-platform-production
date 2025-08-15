import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  console.log('🔐 Magic token authentication attempt:', token?.substring(0, 8) + '...');
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Find user profile with matching magic token in notes field
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .not('notes', 'is', null);
    
    if (profileError || !profiles) {
      console.log('❌ Error fetching profiles:', profileError?.message);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Find profile with matching token
    let validProfile: any = null;
    for (const profile of profiles) {
      try {
        const notes = JSON.parse(profile.notes || '{}');
        if (notes.magic_token === token) {
          // Check if token is still valid (not expired)
          if (notes.token_expires && new Date(notes.token_expires) > new Date()) {
            validProfile = profile;
            break;
          }
        }
      } catch (e) {
        // Skip profiles with invalid JSON in notes
        continue;
      }
    }
    
    if (!validProfile) {
      console.log('❌ Invalid or expired token');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    const email = validProfile.email;
    console.log('✅ Valid token for:', email);
    
    // Create the dashboard URL
    const dashboardUrl = new URL('/dashboard', request.url);
    
    // Set authentication cookies
    const response = NextResponse.redirect(dashboardUrl);
    
    // Server cookie (secure, httpOnly) for authentication validation
    response.cookies.set({
      name: 'ibam_auth_server',
      value: email,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    // Client cookie (readable by JS) for UI state
    response.cookies.set({
      name: 'ibam_auth',
      value: 'authenticated',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    console.log('✅ Magic token authentication successful, redirecting to dashboard');
    return response;
    
  } catch (error: any) {
    console.log('❌ Magic token authentication error:', error.message);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}