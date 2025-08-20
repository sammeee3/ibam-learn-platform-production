import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';
import { getSecureConfig, secureLog } from '@/lib/config/security';
import { validateInput, SSORequestSchema, sanitizeUserInput } from '@/lib/validation/schemas';
import { withCorsMiddleware, validateOrigin } from '@/lib/security/cors';

async function handleSSO(request: NextRequest) {
  // Validate origin for security
  if (!validateOrigin(request)) {
    secureLog('🚨 SSO request from unauthorized origin', true);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  
  // Sanitize and validate input
  const rawData = {
    email: searchParams.get('email'),
    token: searchParams.get('token'),
    source: searchParams.get('source'),
    clearSession: searchParams.get('clearSession')
  };
  
  const sanitizedData = sanitizeUserInput(rawData);
  
  // Validate input schema
  const validation = await validateInput(SSORequestSchema)({
    email: sanitizedData.email,
    token: sanitizedData.token,
    source: sanitizedData.source,
    clearSession: sanitizedData.clearSession
  });
  
  if (!validation.success) {
    secureLog(`🚨 SSO validation failed: ${validation.error}`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  const { email, token, source, clearSession } = validation.data;
  
  // Get secure configuration
  const config = getSecureConfig();
  const SYSTEME_SECRET = config.auth.systemeSecret;
  
  console.log('🔍 Enhanced SSO attempt for:', email);
  // SECURITY: Never log sensitive tokens or secrets
  console.log('🔍 Token provided:', !!token);
  console.log('🔍 All URL params:', Object.fromEntries(searchParams.entries()));
  console.log('🔍 Email check:', !email ? 'NO EMAIL' : 'EMAIL OK');
  console.log('🔍 Token check:', token !== SYSTEME_SECRET ? 'TOKEN MISMATCH' : 'TOKEN OK');
  
  // Special handling for System.io merge tag failures
  if (email === '[Email]' || !email) {
    console.log('⚠️ System.io merge tag not replaced - redirecting to login');
    // In production, don't use fallback emails - redirect to proper login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (!email || token !== SYSTEME_SECRET) {
    console.log('❌ SSO failed - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = supabaseAdmin;
  
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
        console.log('⚠️ User not found in auth.users, creating new user:', email);
        
        // Create completely new user in auth.users first
        const { data: newAuthUser, error: authCreateError } = await supabase.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: {
            first_name: 'User',
            last_name: '',
            login_source: 'systemio'
          }
        });
        
        if (authCreateError) {
          console.log('❌ Failed to create auth user:', authCreateError.message);
          return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        
        console.log('✅ Created new auth user:', newAuthUser.user?.id);
        
        // Now create the profile for the new user
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            auth_user_id: newAuthUser.user?.id,
            email: email,
            first_name: 'User',
            last_name: '',
            has_platform_access: true,
            is_active: true,
            member_type_key: 'impact_member',
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
          console.log('❌ Create profile error:', createError.message);
          return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        
        console.log('✅ Profile created for new user!', newProfile?.id);
      }
    }
    
  } catch (error: any) {
    console.log('❌ Exception:', error.message);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  console.log('✅ User verified, setting cookie and redirecting to dashboard');

  // Create the dashboard URL with localStorage setup
  const dashboardUrl = new URL('/dashboard', request.url);
  
  // Add email as URL parameter so dashboard can set localStorage
  dashboardUrl.searchParams.set('email', email);
  
  // Create the response with redirect
  const response = NextResponse.redirect(dashboardUrl);
  
  // Set the simple cookie like the working version
  response.cookies.set({
    name: 'ibam_auth',
    value: email,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  // ALSO set the server cookie that user identification expects
  response.cookies.set({
    name: 'ibam_auth_server',
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
  
  return response;
}

// Export the secured handler
export const GET = withCorsMiddleware(handleSSO);