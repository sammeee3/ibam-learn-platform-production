import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  // Use environment variable with fallback to current secret for backward compatibility
  const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'ibam-systeme-secret-2025';
  
  console.log('🔍 Enhanced SSO attempt for:', email);
  console.log('🔑 Token received:', token);
  console.log('🔑 Expected token:', SYSTEME_SECRET);
  
  if (!email || token !== SYSTEME_SECRET) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // SIMPLE FIX: Just try to create profile for any authenticated user
  try {
    console.log('🔍 Checking for user:', email);
    
    // Step 1: Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log('✅ User profile exists:', email);
    } else {
      console.log('⚠️ Profile not found, checking auth.users...', profileError?.message);
      
      // Step 2: Get all auth users and find this one
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log('❌ Auth error:', authError.message);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      const userAuth = authUsers.users.find(user => user.email === email);
      
      if (userAuth) {
        console.log('✅ Found in auth.users, creating profile for:', email);
        
        // Create the missing profile with valid member type
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            auth_user_id: userAuth.id,
            email: email,
            first_name: 'User',
            last_name: '',
            has_platform_access: true,
            is_active: true,
            member_type_key: 'impact_member',  // Use valid key from database
            subscription_status: 'active',
            primary_role_key: 'course_student',
            location_country: 'USA',
            created_via_webhook: false,
            login_source: 'systemio',
            tier_level: 1,
            current_level: 1,
            login_count: 0
          })
          .select()
          .single();
        
        if (createError) {
          console.log('❌ Create error:', createError.message);
          return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        
        console.log('✅ Profile created!', newProfile?.id);
      } else {
        console.log('❌ User not found in auth.users:', email);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
    
  } catch (error: any) {
    console.log('❌ Exception:', error.message);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('✅ User verification complete, setting cookie and redirecting to dashboard');

  // Create the auth success URL (which will set localStorage and redirect to dashboard)
  const dashboardUrl = new URL('/auth/success', request.url);
  
  // Simple redirect - works perfectly for new window/tab opens
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