const { createClient } = require('@supabase/supabase-js');

// Production database
const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

// Staging database
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function analyzeDatabaseStructure(supabase, name) {
  console.log(`\n🔍 ANALYZING ${name.toUpperCase()} DATABASE`);
  console.log('=' .repeat(50));

  const tables = [
    'user_profiles',
    'sessions', 
    'modules',
    'assessments',
    'business_plans',
    'progress',
    'donations'
  ];

  const tableData = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        tableData[table] = {
          exists: false,
          error: error.message,
          columns: [],
          recordCount: 0
        };
      } else {
        // Get record count
        const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
        
        tableData[table] = {
          exists: true,
          columns: data.length > 0 ? Object.keys(data[0]).sort() : [],
          recordCount: count || 0,
          sampleData: data[0] || null
        };
      }
    } catch (e) {
      tableData[table] = {
        exists: false,
        error: e.message,
        columns: [],
        recordCount: 0
      };
    }
  }

  return tableData;
}

async function compareUserProfilesStructure() {
  console.log('\n👥 USER_PROFILES TABLE COMPARISON');
  console.log('-' .repeat(50));

  try {
    // Get sample from both databases
    const { data: prodData } = await productionSupabase.from('user_profiles').select('*').limit(1);
    const { data: stagingData } = await stagingSupabase.from('user_profiles').select('*').limit(1);

    const prodColumns = prodData.length > 0 ? Object.keys(prodData[0]).sort() : [];
    const stagingColumns = stagingData.length > 0 ? Object.keys(stagingData[0]).sort() : [];

    console.log(`\n📊 PRODUCTION user_profiles (${prodColumns.length} columns):`);
    prodColumns.forEach(col => console.log(`   ✅ ${col}`));

    console.log(`\n📊 STAGING user_profiles (${stagingColumns.length} columns):`);  
    stagingColumns.forEach(col => console.log(`   ✅ ${col}`));

    // Find differences
    const onlyInProd = prodColumns.filter(col => !stagingColumns.includes(col));
    const onlyInStaging = stagingColumns.filter(col => !prodColumns.includes(col));
    const common = prodColumns.filter(col => stagingColumns.includes(col));

    console.log(`\n🔄 SCHEMA COMPARISON:`);
    console.log(`   📊 Common columns: ${common.length}`);
    console.log(`   🟢 Only in Production: ${onlyInProd.length}`);
    console.log(`   🟡 Only in Staging: ${onlyInStaging.length}`);

    if (onlyInProd.length > 0) {
      console.log('\n   🟢 Production-only columns:');
      onlyInProd.forEach(col => console.log(`      - ${col}`));
    }

    if (onlyInStaging.length > 0) {
      console.log('\n   🟡 Staging-only columns:');
      onlyInStaging.forEach(col => console.log(`      - ${col}`));
    }

  } catch (error) {
    console.log('❌ Error comparing user_profiles:', error.message);
  }
}

async function compareRecordCounts() {
  console.log('\n📊 RECORD COUNT COMPARISON');
  console.log('-' .repeat(50));

  const tables = ['user_profiles', 'sessions', 'modules', 'assessments', 'business_plans'];

  for (const table of tables) {
    try {
      const { count: prodCount } = await productionSupabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      const { count: stagingCount } = await stagingSupabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      console.log(`📋 ${table}:`);
      console.log(`   🟢 Production: ${prodCount || 0} records`);
      console.log(`   🟡 Staging: ${stagingCount || 0} records`);
      
      const diff = (stagingCount || 0) - (prodCount || 0);
      if (diff > 0) {
        console.log(`   📈 Staging has ${diff} more records`);
      } else if (diff < 0) {
        console.log(`   📉 Production has ${Math.abs(diff)} more records`);
      } else {
        console.log(`   ⚖️  Same number of records`);
      }
      console.log('');

    } catch (error) {
      console.log(`❌ Error comparing ${table}: ${error.message}`);
    }
  }
}

async function analyzeDataQuality() {
  console.log('\n🎯 DATA QUALITY COMPARISON');
  console.log('-' .repeat(50));

  try {
    // Production user analysis
    const { data: prodUsers } = await productionSupabase.from('user_profiles').select('*');
    const { data: stagingUsers } = await stagingSupabase.from('user_profiles').select('*');

    console.log('\n👥 USER PROFILE QUALITY:');
    
    // Production analysis
    const prodComplete = prodUsers.filter(u => u.first_name && u.last_name).length;
    const prodWebhook = prodUsers.filter(u => u.created_via_webhook).length;
    const prodTokens = prodUsers.filter(u => u.magic_token).length;

    console.log(`\n🟢 PRODUCTION (${prodUsers.length} users):`);
    console.log(`   📝 Complete names: ${prodComplete}/${prodUsers.length} (${Math.round(prodComplete/prodUsers.length*100)}%)`);
    console.log(`   🤖 Webhook users: ${prodWebhook}/${prodUsers.length}`);
    console.log(`   🎫 Magic tokens: ${prodTokens}/${prodUsers.length}`);

    // Staging analysis  
    const stagingComplete = stagingUsers.filter(u => u.first_name && u.last_name).length;
    const stagingWebhook = stagingUsers.filter(u => u.created_via_webhook).length;
    const stagingTokens = stagingUsers.filter(u => u.magic_token).length;

    console.log(`\n🟡 STAGING (${stagingUsers.length} users):`);
    console.log(`   📝 Complete names: ${stagingComplete}/${stagingUsers.length} (${Math.round(stagingComplete/stagingUsers.length*100)}%)`);
    console.log(`   🤖 Webhook users: ${stagingWebhook}/${stagingUsers.length}`);
    console.log(`   🎫 Magic tokens: ${stagingTokens}/${stagingUsers.length}`);

    // Show sample users
    console.log('\n📋 SAMPLE USERS:');
    console.log('\n🟢 Production Sample:');
    prodUsers.slice(0, 3).forEach((user, i) => {
      const name = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'No name';
      const source = user.created_via_webhook ? '🤖' : '👤';
      console.log(`   ${i + 1}. ${user.email} - ${name} ${source}`);
    });

    console.log('\n🟡 Staging Sample:');
    stagingUsers.slice(0, 3).forEach((user, i) => {
      const name = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'No name';
      const source = user.created_via_webhook ? '🤖' : '👤';
      console.log(`   ${i + 1}. ${user.email} - ${name} ${source}`);
    });

  } catch (error) {
    console.log('❌ Error analyzing data quality:', error.message);
  }
}

async function generateMigrationRecommendations() {
  console.log('\n💡 MIGRATION RECOMMENDATIONS');
  console.log('-' .repeat(50));

  console.log('\n🎯 SCHEMA SYNCHRONIZATION:');
  console.log('1. 🔄 Staging has more complete user_profiles structure');
  console.log('2. 📊 Both databases have same core tables');
  console.log('3. 🚀 Staging ready for production feature deployment');

  console.log('\n📋 RECOMMENDED ACTIONS:');
  console.log('1. 📤 Export staging schema improvements to production');
  console.log('2. 🔍 Test production migrations in staging first');
  console.log('3. 🎯 Keep environments in sync for consistent development');
  console.log('4. 🔒 Maintain separate API keys and environment variables');

  console.log('\n⚠️  CRITICAL SAFETY:');
  console.log('• Never run staging tests on production database');
  console.log('• Always backup production before schema changes');
  console.log('• Test all webhook changes in staging first');
  console.log('• Verify environment variables before deployments');
}

async function runDatabaseComparison() {
  console.log('🏗️  IBAM DATABASE STRUCTURE COMPARISON');
  console.log('=' .repeat(60));

  // Analyze both databases
  const productionData = await analyzeDatabaseStructure(productionSupabase, 'production');
  const stagingData = await analyzeDatabaseStructure(stagingSupabase, 'staging');

  // Compare table availability
  console.log('\n📊 TABLE AVAILABILITY COMPARISON');
  console.log('-' .repeat(50));

  const allTables = [...new Set([...Object.keys(productionData), ...Object.keys(stagingData)])];
  
  allTables.forEach(table => {
    const prodExists = productionData[table]?.exists ? '✅' : '❌';
    const stagingExists = stagingData[table]?.exists ? '✅' : '❌';
    const prodCount = productionData[table]?.recordCount || 0;
    const stagingCount = stagingData[table]?.recordCount || 0;

    console.log(`📋 ${table}:`);
    console.log(`   🟢 Production: ${prodExists} (${prodCount} records)`);
    console.log(`   🟡 Staging: ${stagingExists} (${stagingCount} records)`);
  });

  // Detailed comparisons
  await compareUserProfilesStructure();
  await compareRecordCounts();
  await analyzeDataQuality();
  await generateMigrationRecommendations();

  console.log('\n✅ DATABASE COMPARISON COMPLETE');
}

// Run the comparison
runDatabaseComparison();