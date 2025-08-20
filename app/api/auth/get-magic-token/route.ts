import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  
  console.log('🔍 Magic token request for:', email);
  
  if (!email) {
    return NextResponse.json({
      success: false,
      message: 'Email is required'
    }, { status: 400 });
  }

  const supabase = supabaseAdmin;
  
  try {
    // Find user profile with magic token
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profileError || !profile) {
      console.log('❌ Profile not found for:', email);
      return NextResponse.json({
        success: false,
        message: 'User not found or not enrolled in any course'
      }, { status: 404 });
    }
    
    // Check if user has platform access
    if (!profile.has_platform_access || !profile.is_active) {
      console.log('❌ User does not have platform access:', email);
      return NextResponse.json({
        success: false,
        message: 'User does not have active platform access'
      }, { status: 403 });
    }
    
    // Check magic token
    if (!profile.magic_token) {
      console.log('❌ No magic token found for:', email);
      return NextResponse.json({
        success: false,
        message: 'No access token found. Please contact support.'
      }, { status: 404 });
    }
    
    // Check if token is still valid
    if (profile.magic_token_expires_at && new Date(profile.magic_token_expires_at) <= new Date()) {
      console.log('❌ Expired token for:', email);
      return NextResponse.json({
        success: false,
        message: 'Access token has expired. Please contact support for a new token.'
      }, { status: 403 });
    }
    
    console.log('✅ Valid magic token found for:', email);
    
    return NextResponse.json({
      success: true,
      token: profile.magic_token,
      course_name: 'IBAM Course',
      expires_at: profile.magic_token_expires_at
    });
    
  } catch (error: any) {
    console.error('❌ Magic token retrieval error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}