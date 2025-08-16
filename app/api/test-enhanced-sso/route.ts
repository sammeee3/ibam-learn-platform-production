import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email') || 'sammeee@yahoo.com';
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test the enhanced logic
    console.log('🧪 Testing enhanced SSO logic for:', email);
    
    // Step 1: Check user_profiles table first
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        source: 'user_profiles',
        message: 'User found in profiles',
        profile: existingProfile
      });
    }
    
    console.log('Profile error:', profileError?.message);
    
    // Step 2: Check auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Auth error: ' + authError.message
      });
    }
    
    const userAuth = authUsers.users.find(user => user.email === email);
    
    if (userAuth) {
      return NextResponse.json({
        success: true,
        source: 'auth_users',
        message: 'User found in auth, would create profile',
        authUser: {
          id: userAuth.id,
          email: userAuth.email,
          created_at: userAuth.created_at,
          last_sign_in_at: userAuth.last_sign_in_at
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'User not found in either table',
      checkedEmail: email
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Exception: ' + error.message,
      stack: error.stack
    });
  }
}