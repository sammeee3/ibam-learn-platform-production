#!/usr/bin/env node

// Compare staging and production database schemas
const { createClient } = require('@supabase/supabase-js');

// Database connections
const stagingUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const staging = createClient(stagingUrl, stagingKey);
const production = createClient(productionUrl, productionKey);

async function getTables(client, dbName) {
  console.log(`\n🔍 Checking ${dbName} database...`);
  
  try {
    // Get all tables in public schema
    const { data: tables, error } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.error(`❌ Failed to get tables from ${dbName}:`, error.message);
      return [];
    }
    
    console.log(`📊 ${dbName} has ${tables.length} tables:`);
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    
    return tables.map(t => t.table_name);
  } catch (error) {
    console.error(`❌ Error accessing ${dbName}:`, error.message);
    return [];
  }
}

async function getTableColumns(client, tableName, dbName) {
  try {
    const { data: columns, error } = await client
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .order('ordinal_position');
    
    if (error) {
      console.error(`❌ Failed to get columns for ${tableName} in ${dbName}:`, error.message);
      return [];
    }
    
    return columns;
  } catch (error) {
    console.error(`❌ Error getting columns for ${tableName} in ${dbName}:`, error.message);
    return [];
  }
}

async function checkUserProfilesTable(client, dbName) {
  console.log(`\n🔍 Checking user_profiles table in ${dbName}...`);
  
  try {
    // Check if table exists and get sample data
    const { data, error, count } = await client
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .limit(3);
    
    if (error) {
      console.log(`❌ user_profiles table issue in ${dbName}:`, error.message);
      return;
    }
    
    console.log(`✅ user_profiles table in ${dbName}: ${count} records`);
    if (data && data.length > 0) {
      console.log(`📋 Sample columns: ${Object.keys(data[0]).join(', ')}`);
      console.log(`📋 Sample record: ${data[0].email || 'No email'}`);
    } else {
      console.log(`⚠️ No data in user_profiles table`);
    }
  } catch (error) {
    console.error(`❌ Error checking user_profiles in ${dbName}:`, error.message);
  }
}

async function checkSpecificUser(client, email, dbName) {
  console.log(`\n🔍 Checking for user ${email} in ${dbName}...`);
  
  try {
    const { data: profile } = await client
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profile) {
      console.log(`✅ User found in ${dbName}:`, {
        id: profile.id,
        email: profile.email,
        is_active: profile.is_active,
        has_platform_access: profile.has_platform_access,
        created_via_webhook: profile.created_via_webhook
      });
    } else {
      console.log(`❌ User NOT found in ${dbName}`);
    }
  } catch (error) {
    console.log(`❌ User check failed in ${dbName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Comparing Staging vs Production Databases');
  console.log('==========================================');
  
  // Get tables from both databases
  const stagingTables = await getTables(staging, 'STAGING');
  const productionTables = await getTables(production, 'PRODUCTION');
  
  // Compare table counts
  console.log(`\n📊 COMPARISON SUMMARY:`);
  console.log(`📈 Staging: ${stagingTables.length} tables`);
  console.log(`📈 Production: ${productionTables.length} tables`);
  
  // Find missing tables
  const missingInStaging = productionTables.filter(t => !stagingTables.includes(t));
  const missingInProduction = stagingTables.filter(t => !productionTables.includes(t));
  
  if (missingInStaging.length > 0) {
    console.log(`\n⚠️ MISSING IN STAGING (${missingInStaging.length} tables):`);
    missingInStaging.forEach(table => console.log(`  - ${table}`));
  }
  
  if (missingInProduction.length > 0) {
    console.log(`\n⚠️ MISSING IN PRODUCTION (${missingInProduction.length} tables):`);
    missingInProduction.forEach(table => console.log(`  - ${table}`));
  }
  
  // Check user_profiles table specifically
  await checkUserProfilesTable(staging, 'STAGING');
  await checkUserProfilesTable(production, 'PRODUCTION');
  
  // Check for the specific user
  await checkSpecificUser(staging, 'sj614+prodtest@proton.me', 'STAGING');
  await checkSpecificUser(production, 'sj614+prodtest@proton.me', 'PRODUCTION');
  
  console.log('\n✅ Database comparison complete!');
}

main().catch(console.error);