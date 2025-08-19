const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmailAuthorization() {
  const emailToCheck = 'vboersma@mtrsd.com';
  
  console.log('🔍 CHECKING EMAIL AUTHORIZATION IN PRODUCTION DATABASE');
  console.log('====================================================');
  console.log('Email to check:', emailToCheck);
  console.log('');
  
  try {
    // Check user_profiles table for the email
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', emailToCheck)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking user_profiles:', profileError);
      return;
    }
    
    if (userProfile) {
      console.log('✅ USER FOUND IN PRODUCTION DATABASE:');
      console.log('-----------------------------------');
      console.log('ID:', userProfile.id);
      console.log('Email:', userProfile.email);
      console.log('First Name:', userProfile.first_name || 'Not set');
      console.log('Last Name:', userProfile.last_name || 'Not set');
      console.log('Login Source:', userProfile.login_source || 'Not set');
      console.log('Created via Webhook:', userProfile.created_via_webhook || false);
      console.log('Has Platform Access:', userProfile.has_platform_access || false);
      console.log('Is Active:', userProfile.is_active || false);
      console.log('Magic Token:', userProfile.magic_token ? 'Present' : 'None');
      console.log('Magic Token Expires:', userProfile.magic_token_expires_at || 'N/A');
      console.log('Created At:', userProfile.created_at);
      console.log('Updated At:', userProfile.updated_at);
      
      // Check if magic token is still valid
      if (userProfile.magic_token_expires_at) {
        const expiresAt = new Date(userProfile.magic_token_expires_at);
        const now = new Date();
        const isValid = expiresAt > now;
        console.log('Magic Token Valid:', isValid ? '✅ YES' : '❌ EXPIRED');
        if (!isValid) {
          console.log('Token expired:', Math.round((now - expiresAt) / (1000 * 60)), 'minutes ago');
        }
      }
      
    } else {
      console.log('❌ USER NOT FOUND IN user_profiles TABLE');
    }
    
    // Also check auth.users table to see if Supabase auth user exists
    console.log('\n🔍 CHECKING AUTH.USERS TABLE:');
    console.log('============================');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === emailToCheck);
    
    if (authUser) {
      console.log('✅ AUTH USER FOUND:');
      console.log('ID:', authUser.id);
      console.log('Email:', authUser.email);
      console.log('Created At:', authUser.created_at);
      console.log('Email Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
      console.log('Last Sign In:', authUser.last_sign_in_at || 'Never');
      console.log('User Metadata:', JSON.stringify(authUser.user_metadata, null, 2));
    } else {
      console.log('❌ NO AUTH USER FOUND');
    }
    
    // Final assessment
    console.log('\n📊 AUTHORIZATION ASSESSMENT:');
    console.log('============================');
    
    if (userProfile && authUser) {
      console.log('✅ FULLY AUTHORIZED: Both profile and auth user exist');
      if (userProfile.has_platform_access) {
        console.log('✅ PLATFORM ACCESS: User has platform access enabled');
      } else {
        console.log('⚠️ LIMITED ACCESS: User exists but platform access disabled');
      }
      if (userProfile.is_active) {
        console.log('✅ ACTIVE STATUS: User account is active');
      } else {
        console.log('⚠️ INACTIVE: User account is not active');
      }
      if (userProfile.magic_token) {
        const expiresAt = new Date(userProfile.magic_token_expires_at);
        const now = new Date();
        const isValid = expiresAt > now;
        if (isValid) {
          console.log('✅ TOKEN VALID: Can use SSO access');
        } else {
          console.log('❌ TOKEN EXPIRED: Needs new magic token for SSO');
        }
      } else {
        console.log('⚠️ NO TOKEN: Direct login only');
      }
    } else if (userProfile && !authUser) {
      console.log('⚠️ PARTIAL AUTHORIZATION: Profile exists but no auth user');
      console.log('🔧 This might cause SSO issues');
    } else if (!userProfile && authUser) {
      console.log('⚠️ PARTIAL AUTHORIZATION: Auth user exists but no profile');
      console.log('🔧 Profile might be created on first SSO attempt');
    } else {
      console.log('❌ NOT AUTHORIZED: No user account found');
      console.log('🔧 User needs to be added to the system');
    }
    
  } catch (error) {
    console.error('💥 Error checking email authorization:', error);
  }
}

// Run the check
checkEmailAuthorization()
  .then(() => {
    console.log('\n✅ Email authorization check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });