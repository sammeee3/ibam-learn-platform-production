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
  
  // ENHANCED USER VERIFICATION: Check profiles first, then auth with auto-creation
  let userProfile: any = null;
  let userAuth: any = null;
  
  // Step 1: Check user_profiles table first (preferred)
  const { data: existingProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (existingProfile) {
    console.log('✅ User found in user_profiles:', email);
    userProfile = existingProfile;
  } else {
    console.log('❌ User not found in user_profiles, checking auth.users...', profileError?.message);
    
    // Step 2: Check auth.users table as fallback
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error checking auth.users:', authError.message);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    userAuth = authUsers.users.find(user => user.email === email) || null;
    
    if (userAuth) {
      console.log('✅ User found in auth.users, creating profile...', email);
      
      // Step 3: Auto-create missing profile
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: userAuth.id,
          email: email,
          first_name: userAuth.user_metadata?.full_name?.split(' ')[0] || 'User',
          last_name: userAuth.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          has_platform_access: true,
          is_active: true,
          member_type_key: 'course_student',
          subscription_status: 'active',
          primary_role_key: 'course_student',
          location_country: 'USA',
          created_via_webhook: false,
          tier_level: 1,
          current_level: 1,
          login_count: 0,
          ai_interaction_count: 0,
          total_points: 0,
          current_streak: 0,
          badges_earned: [],
          coaching_preferences: {},
          tier_config_cache: {},
          additional_roles: [],
          systeme_tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_activity: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.log('❌ Error creating profile:', createError.message);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      
      console.log('✅ Profile created successfully for:', email);
      userProfile = newProfile;
    } else {
      console.log('❌ User not found in auth.users either:', email);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  console.log('User verified, setting cookie and redirecting');
  console.log('Final user profile:', userProfile?.email);

  // Create the dashboard URL
  const dashboardUrl = new URL('/dashboard', request.url);
  
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