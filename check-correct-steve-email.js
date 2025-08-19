const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCorrectSteveEmail() {
  const correctEmail = 'sadams@tigerpi.com'; // From the System.io screenshot
  
  console.log('🔍 CHECKING CORRECT STEVE ADAMS EMAIL');
  console.log('=====================================');
  console.log('Email to check:', correctEmail);
  console.log('(From System.io screenshot: sadams@tigerpi.com)');
  console.log('');
  
  try {
    // Check user_profiles table for the email
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', correctEmail)
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
      console.log('');
      console.log('🤔 POSSIBLE REASONS:');
      console.log('1. Webhook hasn\'t triggered yet for this email');
      console.log('2. Tag wasn\'t properly applied in System.io');
      console.log('3. Email needs to be re-tagged with "IBAM Impact Members"');
    }
    
    // Also check auth.users table to see if Supabase auth user exists
    console.log('\n🔍 CHECKING AUTH.USERS TABLE:');
    console.log('============================');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === correctEmail);
    
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
      if (userProfile.has_platform_access && userProfile.is_active) {
        console.log('🎯 STATUS: ✅ READY TO ACCESS PLATFORM');
        console.log('💡 USER CAN: Use System.io button to login immediately');
      } else {
        console.log('🎯 STATUS: ⚠️ EXISTS BUT LIMITED ACCESS');
      }
    } else if (userProfile || authUser) {
      console.log('🎯 STATUS: ⚠️ PARTIAL AUTHORIZATION');
    } else {
      console.log('🎯 STATUS: ❌ NOT AUTHORIZED YET');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('1. Go to System.io contact: sadams@tigerpi.com');
      console.log('2. Add tag: "IBAM Impact Members"');
      console.log('3. Wait 30 seconds for webhook to trigger');
      console.log('4. Check again with this script');
    }
    
  } catch (error) {
    console.error('💥 Error checking email authorization:', error);
  }
}

// Run the check
checkCorrectSteveEmail()
  .then(() => {
    console.log('\n✅ Steve Adams email check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });