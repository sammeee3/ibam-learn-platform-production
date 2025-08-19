const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSingleEmail(emailToCheck) {
  console.log(`\n🔍 CHECKING: ${emailToCheck}`);
  console.log('='.repeat(50));
  
  try {
    // Check user_profiles table for the email
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', emailToCheck)
      .single();
    
    let profileFound = false;
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking user_profiles:', profileError);
      return;
    }
    
    if (userProfile) {
      profileFound = true;
      console.log('✅ USER PROFILE FOUND:');
      console.log(`   Name: ${userProfile.first_name || 'N/A'} ${userProfile.last_name || 'N/A'}`);
      console.log(`   Login Source: ${userProfile.login_source || 'Not set'}`);
      console.log(`   Created via Webhook: ${userProfile.created_via_webhook || false}`);
      console.log(`   Platform Access: ${userProfile.has_platform_access || false}`);
      console.log(`   Active: ${userProfile.is_active || false}`);
      console.log(`   Magic Token: ${userProfile.magic_token ? 'Present' : 'None'}`);
      
      // Check if magic token is still valid
      if (userProfile.magic_token_expires_at) {
        const expiresAt = new Date(userProfile.magic_token_expires_at);
        const now = new Date();
        const isValid = expiresAt > now;
        console.log(`   Token Valid: ${isValid ? '✅ YES' : '❌ EXPIRED'}`);
      }
      console.log(`   Created: ${userProfile.created_at}`);
    } else {
      console.log('❌ NO USER PROFILE FOUND');
    }
    
    // Check auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === emailToCheck);
    let authFound = false;
    
    if (authUser) {
      authFound = true;
      console.log('✅ AUTH USER FOUND:');
      console.log(`   Auth ID: ${authUser.id}`);
      console.log(`   Email Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Last Sign In: ${authUser.last_sign_in_at || 'Never'}`);
      console.log(`   Created: ${authUser.created_at}`);
    } else {
      console.log('❌ NO AUTH USER FOUND');
    }
    
    // Quick status summary
    if (profileFound && authFound) {
      if (userProfile.has_platform_access && userProfile.is_active) {
        console.log('🎯 STATUS: ✅ FULLY AUTHORIZED & ACTIVE');
      } else {
        console.log('🎯 STATUS: ⚠️ EXISTS BUT LIMITED ACCESS');
      }
    } else if (profileFound || authFound) {
      console.log('🎯 STATUS: ⚠️ PARTIAL AUTHORIZATION');
    } else {
      console.log('🎯 STATUS: ❌ NOT AUTHORIZED');
    }
    
  } catch (error) {
    console.error('💥 Error checking email:', error);
  }
}

async function checkMultipleEmails() {
  const emailsToCheck = [
    'jkramer2194@gmail.com',
    'sadams@ibam.org', 
    'sadams@tiger.pi'
  ];
  
  console.log('🔍 CHECKING MULTIPLE EMAIL AUTHORIZATIONS');
  console.log('==========================================');
  console.log('Checking emails:', emailsToCheck.join(', '));
  
  for (const email of emailsToCheck) {
    await checkSingleEmail(email);
  }
  
  console.log('\n📊 SUMMARY OF ALL CHECKS:');
  console.log('=========================');
  
  // Get summary data for all emails
  for (const email of emailsToCheck) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('has_platform_access, is_active, login_source')
        .eq('email', email)
        .single();
      
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers.users.find(user => user.email === email);
      
      let status = '❌ Not Found';
      if (profile && authUser) {
        if (profile.has_platform_access && profile.is_active) {
          status = '✅ Active';
        } else {
          status = '⚠️ Limited';
        }
      } else if (profile || authUser) {
        status = '⚠️ Partial';
      }
      
      console.log(`${email.padEnd(25)} → ${status}`);
    } catch (error) {
      console.log(`${email.padEnd(25)} → ❌ Error checking`);
    }
  }
}

// Run the check
checkMultipleEmails()
  .then(() => {
    console.log('\n✅ Multiple email authorization check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });