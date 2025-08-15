const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test configuration
const TEST_EMAILS = ['sammeee@yahoo.com', 'jsamuelson@ibam.org'];
const SSO_URL = 'https://ibam-learn-platform-v3.vercel.app/api/auth/sso';
const TOKEN = 'ibam-systeme-secret-2025';

function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'AutomatedSSO-Test/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          redirectLocation: res.headers.location
        });
      });
    }).on('error', reject);
  });
}

async function testSSO(email) {
  console.log(`\n🧪 Testing SSO for: ${email}`);
  
  try {
    const testUrl = `${SSO_URL}?email=${encodeURIComponent(email)}&token=${TOKEN}`;
    console.log(`   URL: ${testUrl}`);
    
    const response = await makeHttpRequest(testUrl);
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Redirect: ${response.redirectLocation || 'None'}`);
    
    // Check if successful (redirects to dashboard)
    if (response.redirectLocation && response.redirectLocation.includes('/dashboard')) {
      console.log(`   ✅ SUCCESS: Redirected to dashboard`);
      return { success: true, email, redirect: response.redirectLocation };
    } else if (response.redirectLocation && response.redirectLocation.includes('/auth/login')) {
      console.log(`   ❌ FAILED: Redirected to login page`);
      return { success: false, email, redirect: response.redirectLocation, reason: 'redirected_to_login' };
    } else {
      console.log(`   ❌ UNEXPECTED: ${response.statusCode} - ${response.redirectLocation}`);
      return { success: false, email, reason: 'unexpected_response', statusCode: response.statusCode };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { success: false, email, reason: 'request_error', error: error.message };
  }
}

async function checkUserData(email) {
  console.log(`\n🔍 Checking database for: ${email}`);
  
  // Check user_profiles
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  // Check auth.users
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers?.users?.find(u => u.email === email);
  
  console.log(`   Profile exists: ${profile ? '✅' : '❌'}`);
  console.log(`   Auth user exists: ${authUser ? '✅' : '❌'}`);
  
  return {
    email,
    hasProfile: !!profile,
    hasAuthUser: !!authUser,
    profileId: profile?.id,
    authUserId: authUser?.id
  };
}

async function createMissingProfile(email, authUserId) {
  console.log(`\n🔧 Creating missing profile for: ${email}`);
  
  try {
    const { data: newProfile, error } = await supabase
      .from('user_profiles')
      .insert({
        auth_user_id: authUserId,
        email: email,
        first_name: 'AutoCreated',
        last_name: 'User',
        has_platform_access: true,
        is_active: true,
        member_type_key: 'course_student',
        subscription_status: 'active',
        primary_role_key: 'course_student',
        location_country: 'USA',
        created_via_webhook: false,
        tier_level: 1,
        current_level: 1,
        login_count: 0
      })
      .select()
      .single();
    
    if (error) {
      console.log(`   ❌ Failed to create profile: ${error.message}`);
      return false;
    }
    
    console.log(`   ✅ Profile created: ${newProfile.id}`);
    return true;
  } catch (error) {
    console.log(`   ❌ Error creating profile: ${error.message}`);
    return false;
  }
}

async function runAutomatedTests() {
  console.log('🤖 AUTOMATED SSO TESTING & FIXING\n');
  console.log('='.repeat(50));
  
  let allPassed = true;
  const results = [];
  
  // Step 1: Check current database state
  console.log('\n📊 STEP 1: Database Analysis');
  for (const email of TEST_EMAILS) {
    const userData = await checkUserData(email);
    results.push(userData);
    
    // Auto-fix missing profiles
    if (!userData.hasProfile && userData.hasAuthUser) {
      console.log(`   🔧 Auto-fixing missing profile for ${email}...`);
      await createMissingProfile(email, userData.authUserId);
    }
  }
  
  // Step 2: Wait for any deployments
  console.log('\n⏳ STEP 2: Waiting for deployment (30s)...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Step 3: Test SSO endpoints
  console.log('\n🧪 STEP 3: SSO Testing');
  for (const email of TEST_EMAILS) {
    const result = await testSSO(email);
    
    if (!result.success) {
      allPassed = false;
      console.log(`   🔧 Attempting auto-fix for ${email}...`);
      
      // Try to fix by ensuring profile exists
      const userData = await checkUserData(email);
      if (!userData.hasProfile && userData.hasAuthUser) {
        await createMissingProfile(email, userData.authUserId);
        
        // Re-test after fix
        console.log(`   🧪 Re-testing after fix...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const retestResult = await testSSO(email);
        
        if (retestResult.success) {
          console.log(`   ✅ Auto-fix successful for ${email}!`);
        } else {
          console.log(`   ❌ Auto-fix failed for ${email}`);
        }
      }
    }
  }
  
  // Step 4: Final results
  console.log('\n📋 STEP 4: Final Results');
  console.log('='.repeat(50));
  
  let finalResults = [];
  for (const email of TEST_EMAILS) {
    const finalTest = await testSSO(email);
    finalResults.push(finalTest);
    
    if (finalTest.success) {
      console.log(`✅ ${email}: WORKING`);
    } else {
      console.log(`❌ ${email}: FAILED - ${finalTest.reason}`);
    }
  }
  
  const successCount = finalResults.filter(r => r.success).length;
  
  console.log(`\n🎯 SUMMARY: ${successCount}/${TEST_EMAILS.length} tests passing`);
  
  if (successCount === TEST_EMAILS.length) {
    console.log('🎉 ALL TESTS PASSED! SSO is working for all users.');
    return true;
  } else {
    console.log('⚠️  Some tests still failing. Manual intervention may be needed.');
    return false;
  }
}

// Run the automated test suite
runAutomatedTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Automated testing failed:', error);
    process.exit(1);
  });