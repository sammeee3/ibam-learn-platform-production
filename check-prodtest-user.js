const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProdTestUser() {
  console.log('🔍 CHECKING PRODUCTION DATABASE FOR PRODTEST USER');
  console.log('Email to check: sj614+prodtest@proton.me');
  console.log('=====================================');
  
  try {
    // Check user_profiles table for the test user
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'sj614+prodtest@proton.me')
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
      console.log('Login Source:', userProfile.login_source);
      console.log('Created via Webhook:', userProfile.created_via_webhook);
      console.log('Magic Token:', userProfile.magic_token ? 'Present' : 'None');
      console.log('Magic Token Expires:', userProfile.magic_token_expires_at);
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
      console.log('❌ USER NOT FOUND IN PRODUCTION DATABASE');
      console.log('This means the webhook did NOT create the user');
    }
    
    // Also check auth.users table to see if Supabase auth user exists
    console.log('\n🔍 CHECKING AUTH.USERS TABLE:');
    console.log('============================');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === 'sj614+prodtest@proton.me');
    
    if (authUser) {
      console.log('✅ AUTH USER FOUND:');
      console.log('ID:', authUser.id);
      console.log('Email:', authUser.email);
      console.log('Created At:', authUser.created_at);
      console.log('Email Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
      console.log('Last Sign In:', authUser.last_sign_in_at || 'Never');
    } else {
      console.log('❌ NO AUTH USER FOUND');
    }
    
    // Final assessment
    console.log('\n📊 ASSESSMENT:');
    console.log('===============');
    
    if (userProfile && authUser) {
      console.log('✅ WEBHOOK WORKED: Both profile and auth user exist');
      console.log('✅ SSO should work with existing user');
    } else if (userProfile && !authUser) {
      console.log('⚠️ PARTIAL: Profile exists but no auth user');
      console.log('🔧 This might cause SSO issues');
    } else if (!userProfile && authUser) {
      console.log('⚠️ PARTIAL: Auth user exists but no profile');
      console.log('🔧 Profile might be created on first SSO attempt');
    } else {
      console.log('❌ WEBHOOK FAILED: No user created at all');
      console.log('🔧 Need to check webhook integration');
    }
    
  } catch (error) {
    console.error('💥 Error checking database:', error);
  }
}

// Run the check
checkProdTestUser()
  .then(() => {
    console.log('\n✅ Database check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });