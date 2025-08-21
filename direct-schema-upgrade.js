const { createClient } = require('@supabase/supabase-js');

const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function addColumnsSafely() {
  console.log('🔧 ADDING PRODUCTION COLUMNS TO STAGING');
  console.log('=' .repeat(50));

  // Production columns to add with their types and defaults
  const columnsToAdd = [
    { name: 'member_type_key', type: 'TEXT', default: "'impact_member'" },
    { name: 'subscription_status', type: 'TEXT', default: "'active'" },
    { name: 'tier_level', type: 'INTEGER', default: '1' },
    { name: 'login_count', type: 'INTEGER', default: '0' },
    { name: 'current_level', type: 'INTEGER', default: '1' },
    { name: 'location_country', type: 'TEXT', default: "'USA'" },
    { name: 'primary_role_key', type: 'TEXT', default: "'course_student'" },
    { name: 'systeme_tags', type: 'TEXT[]', default: "ARRAY[]::TEXT[]" },
    { name: 'systeme_customer_id', type: 'TEXT', default: null },
    { name: 'monthly_amount', type: 'DECIMAL(10,2)', default: null }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const column of columnsToAdd) {
    try {
      console.log(`\n➕ Adding column: ${column.name} (${column.type})`);
      
      // First check if column already exists by trying to select it
      try {
        await stagingSupabase.from('user_profiles').select(column.name).limit(1);
        console.log(`   ℹ️  Column ${column.name} already exists, skipping`);
        continue;
      } catch (selectError) {
        // Column doesn't exist, proceed with adding it
      }

      // Try to add the column by doing an insert with the new column
      // This is a workaround since we can't execute DDL directly
      
      console.log(`   ⚠️  Cannot add column ${column.name} via API - requires manual addition`);
      errorCount++;
      
    } catch (error) {
      console.log(`   ❌ Error with ${column.name}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 COLUMN ADDITION SUMMARY:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📋 Total attempted: ${columnsToAdd.length}`);

  if (errorCount > 0) {
    console.log(`\n⚠️  MANUAL SCHEMA UPGRADE STILL REQUIRED`);
    console.log(`Please use Supabase Dashboard SQL Editor to apply the schema changes`);
    return false;
  }

  return successCount > 0;
}

async function testCurrentSchema() {
  console.log('\n🔍 TESTING CURRENT STAGING SCHEMA');
  console.log('-' .repeat(40));

  try {
    // Get current user data to see what columns exist
    const { data: users } = await stagingSupabase.from('user_profiles').select('*').limit(1);
    
    if (users.length === 0) {
      console.log('❌ No users found to test schema');
      return false;
    }

    const currentColumns = Object.keys(users[0]).sort();
    console.log(`📊 Current columns in staging (${currentColumns.length}):`);
    
    // Check for key production columns
    const keyColumns = ['member_type_key', 'subscription_status', 'tier_level', 'systeme_tags'];
    const productionColumns = [];
    const missingColumns = [];
    
    keyColumns.forEach(col => {
      if (currentColumns.includes(col)) {
        productionColumns.push(col);
        console.log(`   ✅ ${col}`);
      } else {
        missingColumns.push(col);
        console.log(`   ❌ ${col} (missing)`);
      }
    });

    console.log(`\n📈 PRODUCTION COMPATIBILITY:`);
    console.log(`   Present: ${productionColumns.length}/${keyColumns.length} key columns`);
    console.log(`   Missing: ${missingColumns.length} key columns`);

    if (missingColumns.length === 0) {
      console.log(`\n🎉 STAGING SCHEMA IS PRODUCTION-COMPATIBLE!`);
      return true;
    } else {
      console.log(`\n📋 MISSING COLUMNS THAT NEED TO BE ADDED:`);
      missingColumns.forEach(col => console.log(`   - ${col}`));
      return false;
    }

  } catch (error) {
    console.log(`❌ Schema test failed: ${error.message}`);
    return false;
  }
}

async function showManualInstructions() {
  console.log('\n📋 MANUAL SCHEMA UPGRADE INSTRUCTIONS');
  console.log('=' .repeat(50));
  
  console.log('\n🌐 OPTION 1: Supabase Dashboard (Recommended)');
  console.log('1. Open: https://app.supabase.com/project/yhfxxouswctucxvfetcq/sql');
  console.log('2. Copy the content of: staging-upgrade-1755801606250.sql');
  console.log('3. Paste into SQL Editor and click "Run"');
  console.log('4. Wait for execution to complete');
  
  console.log('\n💻 OPTION 2: Supabase CLI (if network allows)');
  console.log('1. Run: supabase db push --linked');
  console.log('2. The migration file is ready in supabase/migrations/');
  
  console.log('\n🔧 OPTION 3: Manual Column Addition');
  console.log('Add these key columns via Dashboard Table Editor:');
  console.log('• member_type_key (TEXT, default: impact_member)');
  console.log('• subscription_status (TEXT, default: active)');
  console.log('• tier_level (INTEGER, default: 1)');
  console.log('• systeme_tags (TEXT[], default: [])');
  
  console.log('\n✅ After applying changes, run this script again to verify!');
}

async function runDirectSchemaUpgrade() {
  console.log('🎯 DIRECT STAGING SCHEMA UPGRADE');
  console.log('=' .repeat(60));

  // Test current schema first
  const isCompatible = await testCurrentSchema();
  
  if (isCompatible) {
    console.log('\n🎉 SCHEMA IS ALREADY PRODUCTION-COMPATIBLE!');
    console.log('✅ No upgrade needed, proceeding to next steps...');
    return true;
  }

  // Try to add columns programmatically
  const success = await addColumnsSafely();
  
  if (success) {
    // Test again after additions
    const nowCompatible = await testCurrentSchema();
    if (nowCompatible) {
      console.log('\n🎉 SCHEMA UPGRADE SUCCESSFUL!');
      return true;
    }
  }

  // Show manual instructions
  await showManualInstructions();
  
  console.log('\n⏳ WAITING FOR MANUAL SCHEMA UPGRADE');
  console.log('Please apply the schema changes and run: node verify-schema-upgrade.js');
  
  return false;
}

// Run direct schema upgrade
runDirectSchemaUpgrade();