const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test configuration
const WEBHOOK_URL = 'https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio';
const MAGIC_TOKEN_URL = 'https://ibam-learn-platform-v3.vercel.app/api/auth/get-magic-token';
const TEST_EMAIL = 'webhook-test@example.com';

function makeHttpRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Webhook-Test/1.0',
        'x-webhook-event': 'CONTACT_TAG_ADDED'  // Required for System.io webhook
      }
    };

    if (method === 'POST' && data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData,
          redirectLocation: res.headers.location
        });
      });
    });

    req.on('error', reject);
    
    if (method === 'POST' && data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function simulateSystemIOWebhook(email, tag) {
  console.log(`\n🎯 Simulating System.io webhook for: ${email} with tag: ${tag}`);
  
  const webhookPayload = {
    contact: {
      email: email,
      fields: [
        { slug: 'first_name', value: 'Webhook' },
        { slug: 'surname', value: 'Test' }
      ],
      tags: [{ name: tag }]
    },
    tag: {
      name: tag
    }
  };
  
  try {
    const response = await makeHttpRequest(
      WEBHOOK_URL,
      'POST',
      JSON.stringify(webhookPayload)
    );
    
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      const responseBody = JSON.parse(response.body);
      console.log(`   ✅ Webhook processed successfully`);
      console.log(`   Course assigned: ${responseBody.courseAssigned ? 'Yes' : 'No'}`);
      console.log(`   Message: ${responseBody.message}`);
      return { success: true, response: responseBody };
    } else {
      console.log(`   ❌ Webhook failed: ${response.body}`);
      return { success: false, error: response.body };
    }
  } catch (error) {
    console.log(`   ❌ Webhook error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMagicTokenRetrieval(email) {
  console.log(`\n🔑 Testing magic token retrieval for: ${email}`);
  
  try {
    const response = await makeHttpRequest(
      `${MAGIC_TOKEN_URL}?email=${encodeURIComponent(email)}`
    );
    
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      const tokenData = JSON.parse(response.body);
      if (tokenData.success) {
        console.log(`   ✅ Magic token retrieved successfully`);
        console.log(`   Token: ${tokenData.token.substring(0, 8)}...`);
        console.log(`   Course: ${tokenData.course_name}`);
        console.log(`   Expires: ${tokenData.expires_at}`);
        return { success: true, token: tokenData.token };
      } else {
        console.log(`   ❌ Token retrieval failed: ${tokenData.message}`);
        return { success: false, error: tokenData.message };
      }
    } else {
      console.log(`   ❌ Request failed: ${response.body}`);
      return { success: false, error: response.body };
    }
  } catch (error) {
    console.log(`   ❌ Token retrieval error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMagicTokenAuthentication(token) {
  console.log(`\n🚀 Testing magic token authentication`);
  
  try {
    const response = await makeHttpRequest(
      `https://ibam-learn-platform-v3.vercel.app/api/auth/magic-token?token=${token}`
    );
    
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Redirect: ${response.redirectLocation || 'None'}`);
    
    if (response.redirectLocation && response.redirectLocation.includes('/dashboard')) {
      console.log(`   ✅ Magic token authentication successful - redirected to dashboard`);
      return { success: true };
    } else if (response.redirectLocation && response.redirectLocation.includes('/auth/login')) {
      console.log(`   ❌ Magic token authentication failed - redirected to login`);
      return { success: false, error: 'redirected_to_login' };
    } else {
      console.log(`   ❌ Unexpected response: ${response.statusCode}`);
      return { success: false, error: 'unexpected_response' };
    }
  } catch (error) {
    console.log(`   ❌ Authentication error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function cleanupTestUser(email) {
  console.log(`\n🧹 Cleaning up test user: ${email}`);
  
  try {
    // Delete from user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('email', email);
    
    if (profileError) {
      console.log(`   ⚠️ Profile cleanup warning: ${profileError.message}`);
    } else {
      console.log(`   ✅ Profile cleaned up`);
    }
    
    // Delete from auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find(u => u.email === email);
    
    if (authUser) {
      const { error: authError } = await supabase.auth.admin.deleteUser(authUser.id);
      if (authError) {
        console.log(`   ⚠️ Auth user cleanup warning: ${authError.message}`);
      } else {
        console.log(`   ✅ Auth user cleaned up`);
      }
    }
    
  } catch (error) {
    console.log(`   ⚠️ Cleanup error: ${error.message}`);
  }
}

async function runSecureWebhookTest() {
  console.log('🔐 SECURE WEBHOOK FLOW TESTING');
  console.log('='.repeat(50));
  
  let allPassed = true;
  
  try {
    // Step 1: Clean up any existing test data
    await cleanupTestUser(TEST_EMAIL);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for cleanup
    
    // Step 2: Simulate System.io webhook (user gets tagged with course)
    console.log('\n📡 STEP 1: Simulating System.io Course Assignment Webhook');
    const webhookResult = await simulateSystemIOWebhook(TEST_EMAIL, 'IBAM Impact Members');
    
    if (!webhookResult.success) {
      allPassed = false;
      console.log('❌ Webhook simulation failed');
      return false;
    }
    
    // Wait for webhook processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 3: Test magic token retrieval
    console.log('\n🔑 STEP 2: Testing Magic Token Retrieval');
    const tokenResult = await testMagicTokenRetrieval(TEST_EMAIL);
    
    if (!tokenResult.success) {
      allPassed = false;
      console.log('❌ Magic token retrieval failed');
      return false;
    }
    
    // Step 4: Test magic token authentication
    console.log('\n🚀 STEP 3: Testing Magic Token Authentication');
    const authResult = await testMagicTokenAuthentication(tokenResult.token);
    
    if (!authResult.success) {
      allPassed = false;
      console.log('❌ Magic token authentication failed');
      return false;
    }
    
    // Step 5: Test with invalid token
    console.log('\n🔒 STEP 4: Testing Invalid Token Protection');
    const invalidAuthResult = await testMagicTokenAuthentication('invalid-token-12345');
    
    if (invalidAuthResult.success) {
      allPassed = false;
      console.log('❌ Security vulnerability: invalid token was accepted!');
      return false;
    } else {
      console.log('✅ Invalid token correctly rejected');
    }
    
  } finally {
    // Cleanup
    await cleanupTestUser(TEST_EMAIL);
  }
  
  // Final results
  console.log('\n📋 FINAL RESULTS');
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Secure webhook flow is working correctly.');
    console.log('\n✅ Security Features Verified:');
    console.log('   - Webhook creates secure user accounts');
    console.log('   - Magic tokens are generated and stored');
    console.log('   - Token-based authentication works');
    console.log('   - Invalid tokens are rejected');
    console.log('   - No manual email entry required');
    return true;
  } else {
    console.log('⚠️  Some tests failed. The secure webhook flow needs attention.');
    return false;
  }
}

// Run the secure webhook test
runSecureWebhookTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Testing failed:', error);
    process.exit(1);
  });