#!/usr/bin/env node

// Create test user in both staging and production
const { createClient } = require('@supabase/supabase-js');

const stagingUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const staging = createClient(stagingUrl, stagingKey);
const production = createClient(productionUrl, productionKey);

async function createTestUser(client, dbName, email, password = 'test123456') {
  console.log(`\n🔧 Creating test user in ${dbName}...`);
  
  try {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await client.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: 'Jeff ProdTest',
        created_for_testing: true
      }
    });
    
    if (authError) {
      console.error(`❌ Auth user creation failed in ${dbName}:`, authError.message);
      return false;
    }
    
    console.log(`✅ Auth user created in ${dbName}: ${authData.user.id}`);
    
    // Step 2: Create user profile
    const { data: profile, error: profileError } = await client
      .from('user_profiles')
      .insert({
        auth_user_id: authData.user.id,
        email: email,
        first_name: 'Jeff',
        last_name: 'ProdTest',
        is_active: true,
        has_platform_access: true,
        created_via_webhook: false,
        login_source: 'test_user'
      })
      .select()
      .single();
    
    if (profileError) {
      console.error(`❌ Profile creation failed in ${dbName}:`, profileError.message);
      return false;
    }
    
    console.log(`✅ User profile created in ${dbName}: ${profile.id}`);
    return true;
    
  } catch (error) {
    console.error(`❌ User creation failed in ${dbName}:`, error.message);
    return false;
  }
}

async function main() {
  const email = 'sj614+prodtest@proton.me';
  console.log(`🚀 Creating test user: ${email}`);
  console.log(`🔑 Password: test123456`);
  
  // Create in both databases
  const stagingSuccess = await createTestUser(staging, 'STAGING', email);
  const productionSuccess = await createTestUser(production, 'PRODUCTION', email);
  
  console.log(`\n📊 CREATION SUMMARY:`);
  console.log(`   Staging: ${stagingSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`   Production: ${productionSuccess ? '✅ Success' : '❌ Failed'}`);
  
  if (stagingSuccess || productionSuccess) {
    console.log(`\n🎉 Test user created! You can now login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: test123456`);
  }
}

main().catch(console.error);