import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Try to get email from multiple sources
  let email: string | null = null;
  
  // Method 1: URL parameter (if System.io passes it)
  email = searchParams.get('email') || searchParams.get('user_email');
  
  // Method 2: Check for System.io user identification
  const systemioUserId = searchParams.get('contact_id') || searchParams.get('user_id');
  
  console.log('🔍 Auto-login attempt:', { email, systemioUserId });
  
  if (!email && !systemioUserId) {
    // Redirect to a "login help" page that explains the process
    return NextResponse.redirect(new URL('/auth/systemio-help', request.url));
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    let profile: any = null;
    
    // Try to find user by email first
    if (email) {
      const { data: profileByEmail } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      profile = profileByEmail;
    }
    
    // Try to find user by System.io contact ID
    if (!profile && systemioUserId) {
      const { data: profileById } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('systemio_contact_id', systemioUserId)
        .single();
      
      profile = profileById;
    }
    
    if (!profile) {
      console.log('❌ User not found, redirecting to enrollment info');
      return NextResponse.redirect(new URL('/auth/not-enrolled', request.url));
    }
    
    // Check if user has platform access
    if (!profile.has_platform_access || !profile.is_active) {
      console.log('❌ User does not have platform access');
      return NextResponse.redirect(new URL('/auth/access-denied', request.url));
    }
    
    // Check if user has a valid magic token
    if (!profile.magic_token) {
      console.log('❌ No magic token found, creating new one...');
      
      // Generate new magic token
      const crypto = require('crypto');
      const magicToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          magic_token: magicToken,
          magic_token_expires_at: tokenExpiry.toISOString()
        })
        .eq('id', profile.id);
      
      if (updateError) {
        console.error('❌ Failed to create magic token:', updateError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      profile.magic_token = magicToken;
      profile.magic_token_expires_at = tokenExpiry.toISOString();
    }
    
    // Check if token is expired
    if (profile.magic_token_expires_at && new Date(profile.magic_token_expires_at) <= new Date()) {
      console.log('❌ Magic token expired, creating new one...');
      
      // Generate new magic token
      const crypto = require('crypto');
      const magicToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          magic_token: magicToken,
          magic_token_expires_at: tokenExpiry.toISOString()
        })
        .eq('id', profile.id);
      
      if (updateError) {
        console.error('❌ Failed to refresh magic token:', updateError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      profile.magic_token = magicToken;
    }
    
    console.log('✅ Auto-login successful for:', profile.email);
    
    // Redirect to magic token authentication
    const magicTokenUrl = new URL('/api/auth/magic-token', request.url);
    magicTokenUrl.searchParams.set('token', profile.magic_token);
    
    return NextResponse.redirect(magicTokenUrl);
    
  } catch (error: any) {
    console.error('❌ Auto-login error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}