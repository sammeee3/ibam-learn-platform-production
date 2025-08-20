#!/usr/bin/env node

// Try to create table via direct API call
const https = require('https');

const stagingUrl = 'yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

async function createTableViaAPI() {
  console.log('🔧 Attempting to create table via REST API...');
  
  const postData = JSON.stringify({
    query: `
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        auth_user_id UUID,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT,
        last_name TEXT,
        is_active BOOLEAN DEFAULT true,
        has_platform_access BOOLEAN DEFAULT true,
        created_via_webhook BOOLEAN DEFAULT false,
        login_source TEXT DEFAULT 'direct',
        magic_token TEXT,
        magic_token_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  
  const options = {
    hostname: stagingUrl,
    port: 443,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${stagingKey}`,
      'apikey': stagingKey,
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('API Response Status:', res.statusCode);
        console.log('API Response:', data);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Table creation via API succeeded!');
          resolve(true);
        } else {
          console.log('❌ Table creation via API failed');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ API request failed:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function testTableExists() {
  console.log('🔍 Testing if table exists...');
  
  const options = {
    hostname: stagingUrl,
    port: 443,
    path: '/rest/v1/user_profiles?select=count&limit=1',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${stagingKey}`,
      'apikey': stagingKey
    }
  };
  
  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Table test status:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ user_profiles table exists and is accessible!');
          resolve(true);
        } else {
          console.log('❌ user_profiles table does not exist or is not accessible');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Table test failed:', error.message);
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('🚀 AUTOMATED TABLE CREATION ATTEMPT');
  console.log('===================================');
  
  // First check if table already exists
  const tableExists = await testTableExists();
  
  if (tableExists) {
    console.log('\n🎉 Table already exists! Authentication should work now.');
    return;
  }
  
  // Try to create the table
  const created = await createTableViaAPI();
  
  if (created) {
    // Verify it was created
    const verified = await testTableExists();
    if (verified) {
      console.log('\n🎉 SUCCESS! Table created and verified.');
      console.log('✅ Both staging URLs should now work with authentication.');
    }
  } else {
    console.log('\n❌ AUTOMATED CREATION FAILED');
    console.log('📋 Please use manual approach:');
    console.log('1. Go to: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql');
    console.log('2. Run the SQL from staging-table-creation.sql file');
  }
}

main().catch(console.error);