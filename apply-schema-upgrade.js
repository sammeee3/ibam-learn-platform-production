const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function executeSQL(sql, description) {
  try {
    console.log(`🔧 ${description}...`);
    
    // Using a raw SQL execution approach via REST API
    const response = await fetch('https://yhfxxouswctucxvfetcq.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    console.log(`✅ ${description} completed successfully`);
    return result;

  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    throw error;
  }
}

async function applySchemaUpgradeManually() {
  console.log('🔧 APPLYING SCHEMA UPGRADE MANUALLY');
  console.log('=' .repeat(50));

  try {
    // Get current column count
    const { data: beforeData } = await stagingSupabase.from('user_profiles').select('*').limit(1);
    const beforeColumns = beforeData.length > 0 ? Object.keys(beforeData[0]).length : 0;
    console.log(`📊 Before upgrade: ${beforeColumns} columns`);

    // Since direct SQL execution via API doesn't work, we'll use a different approach
    // Apply columns one by one using direct database operations

    console.log('\n🔧 Adding missing production columns manually...');
    
    // Test a simple column addition
    console.log('Testing column addition approach...');
    
    // Since we can't execute DDL directly via the REST API, we need to use migrations
    console.log('\n⚠️  MANUAL SCHEMA UPGRADE REQUIRED');
    console.log('The staging database schema upgrade needs to be applied via Supabase Dashboard or CLI');
    console.log('\nSQL file ready: staging-upgrade-1755801606250.sql');
    
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('1. Open Supabase Dashboard: https://app.supabase.com/project/yhfxxouswctucxvfetcq');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the content of staging-upgrade-1755801606250.sql');
    console.log('4. Execute the SQL');
    console.log('5. Verify the schema upgrade worked');

    // Let's try a different approach - add columns via a migration file
    const migrationSQL = fs.readFileSync('staging-upgrade-1755801606250.sql', 'utf8');
    
    // Save as a proper migration
    const timestamp = Date.now();
    const migrationFile = `supabase/migrations/${timestamp}_upgrade_user_profiles_to_production_schema.sql`;
    
    // Create migrations directory if it doesn't exist
    if (!fs.existsSync('supabase/migrations')) {
      fs.mkdirSync('supabase/migrations', { recursive: true });
    }
    
    fs.writeFileSync(migrationFile, migrationSQL);
    console.log(`\n💾 Migration saved as: ${migrationFile}`);
    
    return false; // Manual intervention required

  } catch (error) {
    console.log(`💥 Schema upgrade failed: ${error.message}`);
    return false;
  }
}

async function verifySchemaUpgrade() {
  console.log('\n🔍 VERIFYING SCHEMA UPGRADE');
  console.log('-' .repeat(30));

  try {
    const { data: afterData } = await stagingSupabase.from('user_profiles').select('*').limit(1);
    
    if (afterData.length === 0) {
      console.log('ℹ️  No users found to check schema');
      return false;
    }

    const afterColumns = Object.keys(afterData[0]).sort();
    console.log(`📊 After upgrade: ${afterColumns.length} columns`);

    // Check for key production columns
    const keyProductionColumns = [
      'member_type_key',
      'subscription_status', 
      'systeme_tags',
      'tier_level',
      'login_count',
      'current_level'
    ];

    console.log('\n🔍 Checking key production columns:');
    let allPresent = true;
    
    keyProductionColumns.forEach(col => {
      const present = afterColumns.includes(col);
      console.log(`   ${present ? '✅' : '❌'} ${col}`);
      if (!present) allPresent = false;
    });

    if (allPresent) {
      console.log('\n✅ SCHEMA UPGRADE SUCCESSFUL!');
      console.log(`🎯 Staging now has production-compatible schema with ${afterColumns.length} columns`);
      return true;
    } else {
      console.log('\n⚠️  SCHEMA UPGRADE INCOMPLETE');
      console.log('Some production columns are still missing');
      return false;
    }

  } catch (error) {
    console.log(`❌ Schema verification failed: ${error.message}`);
    return false;
  }
}

async function runSchemaUpgrade() {
  console.log('🚀 STAGING SCHEMA UPGRADE PROCESS');
  console.log('=' .repeat(60));

  // Attempt automatic upgrade
  const success = await applySchemaUpgradeManually();
  
  if (success) {
    // Verify upgrade
    const verified = await verifySchemaUpgrade();
    
    if (verified) {
      console.log('\n🎉 SCHEMA UPGRADE COMPLETE AND VERIFIED!');
      console.log('✅ Staging database now matches production schema');
    } else {
      console.log('\n⚠️  Schema upgrade verification failed');
    }
  } else {
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Apply the migration manually via Supabase Dashboard');
    console.log('2. Run this script again to verify the upgrade');
    console.log('3. Continue with content import and testing');
  }

  return success;
}

// Run schema upgrade
runSchemaUpgrade();