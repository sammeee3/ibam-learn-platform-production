const { createClient } = require('@supabase/supabase-js');

const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

// Production database for comparison
const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

async function verifySchemaUpgradeStatus() {
  console.log('🔍 VERIFYING SCHEMA UPGRADE STATUS');
  console.log('=' .repeat(50));

  try {
    // Get fresh data from both databases
    const { data: stagingUsers } = await stagingSupabase.from('user_profiles').select('*').limit(1);
    const { data: productionUsers } = await productionSupabase.from('user_profiles').select('*').limit(1);

    if (stagingUsers.length === 0 || productionUsers.length === 0) {
      console.log('❌ Cannot compare schemas - missing data in one database');
      return false;
    }

    const stagingColumns = Object.keys(stagingUsers[0]).sort();
    const productionColumns = Object.keys(productionUsers[0]).sort();

    console.log(`\n📊 CURRENT SCHEMA COMPARISON:`);
    console.log(`   🟢 Production: ${productionColumns.length} columns`);
    console.log(`   🟡 Staging: ${stagingColumns.length} columns`);
    console.log(`   📈 Difference: ${productionColumns.length - stagingColumns.length} columns`);

    // Find missing columns
    const missingInStaging = productionColumns.filter(col => !stagingColumns.includes(col));
    const extraInStaging = stagingColumns.filter(col => !productionColumns.includes(col));

    console.log(`\n🔍 SCHEMA DIFFERENCES:`);
    console.log(`   ❌ Missing in staging: ${missingInStaging.length} columns`);
    console.log(`   ➕ Extra in staging: ${extraInStaging.length} columns`);

    // Check webhook-critical columns
    const webhookCriticalColumns = [
      'member_type_key',
      'subscription_status',
      'primary_role_key',
      'systeme_tags',
      'systeme_customer_id',
      'tier_level',
      'login_count',
      'location_country'
    ];

    console.log(`\n🎯 WEBHOOK-CRITICAL COLUMNS CHECK:`);
    let webhookReady = true;
    
    webhookCriticalColumns.forEach(col => {
      const hasColumn = stagingColumns.includes(col);
      console.log(`   ${hasColumn ? '✅' : '❌'} ${col}`);
      if (!hasColumn) webhookReady = false;
    });

    if (webhookReady) {
      console.log(`\n🎉 WEBHOOK COMPATIBILITY: ✅ READY`);
    } else {
      console.log(`\n⚠️  WEBHOOK COMPATIBILITY: ❌ NOT READY`);
    }

    // Show missing critical columns
    if (missingInStaging.length > 0) {
      console.log(`\n📋 TOP MISSING COLUMNS (first 10):`);
      missingInStaging.slice(0, 10).forEach(col => {
        const isCritical = webhookCriticalColumns.includes(col);
        console.log(`   ${isCritical ? '🔴' : '🟡'} ${col} ${isCritical ? '(CRITICAL)' : ''}`);
      });
    }

    // Overall assessment
    const compatibilityPercent = Math.round(((productionColumns.length - missingInStaging.length) / productionColumns.length) * 100);
    
    console.log(`\n📊 SCHEMA COMPATIBILITY ASSESSMENT:`);
    console.log(`   🎯 Compatibility: ${compatibilityPercent}%`);
    
    if (compatibilityPercent >= 90) {
      console.log(`   ✅ Status: EXCELLENT - Nearly production ready`);
    } else if (compatibilityPercent >= 70) {
      console.log(`   🟡 Status: GOOD - Some columns missing`);
    } else if (compatibilityPercent >= 50) {
      console.log(`   ⚠️  Status: FAIR - Significant gaps exist`);
    } else {
      console.log(`   ❌ Status: POOR - Major schema differences`);
    }

    return {
      isWebhookReady: webhookReady,
      compatibilityPercent,
      missingColumns: missingInStaging.length,
      stagingColumns: stagingColumns.length,
      productionColumns: productionColumns.length
    };

  } catch (error) {
    console.log(`❌ Schema verification failed: ${error.message}`);
    return null;
  }
}

async function testWebhookCompatibility() {
  console.log('\n🤖 TESTING WEBHOOK COMPATIBILITY');
  console.log('-' .repeat(40));

  try {
    // Test if we can create a user with production-style data
    const testUser = {
      email: 'schema.test@webhook.verify',
      first_name: 'Schema',
      last_name: 'Test',
      created_via_webhook: true,
      login_source: 'systemio',
      is_active: true,
      has_platform_access: true
    };

    // Try to add production-specific fields if they exist
    const productionFields = {
      member_type_key: 'impact_member',
      subscription_status: 'active',
      tier_level: 1,
      login_count: 0,
      location_country: 'USA',
      primary_role_key: 'course_student'
    };

    const testUserData = { ...testUser, ...productionFields };

    console.log('🧪 Testing user creation with production fields...');
    
    const { data: newUser, error } = await stagingSupabase
      .from('user_profiles')
      .insert(testUserData)
      .select()
      .single();

    if (error) {
      console.log(`❌ Webhook compatibility test FAILED:`);
      console.log(`   Error: ${error.message}`);
      
      // Try with basic fields only
      console.log(`\n🔄 Trying with basic fields only...`);
      const { data: basicUser, error: basicError } = await stagingSupabase
        .from('user_profiles')
        .insert(testUser)
        .select()
        .single();

      if (basicError) {
        console.log(`❌ Even basic user creation failed: ${basicError.message}`);
        return false;
      } else {
        console.log(`✅ Basic user creation works, but production fields missing`);
        return false;
      }

    } else {
      console.log(`✅ Webhook compatibility test PASSED!`);
      console.log(`   User created with ID: ${newUser.id}`);
      console.log(`   All production fields accepted`);

      // Clean up test user
      await stagingSupabase.from('user_profiles').delete().eq('id', newUser.id);
      console.log(`🧹 Test user cleaned up`);
      
      return true;
    }

  } catch (error) {
    console.log(`💥 Webhook compatibility test error: ${error.message}`);
    return false;
  }
}

async function generateNextSteps(verificationResult) {
  console.log('\n📋 NEXT STEPS RECOMMENDATIONS');
  console.log('-' .repeat(40));

  if (!verificationResult) {
    console.log('❌ Cannot generate recommendations - verification failed');
    return;
  }

  const { isWebhookReady, compatibilityPercent, missingColumns } = verificationResult;

  if (isWebhookReady && compatibilityPercent >= 90) {
    console.log('🎉 EXCELLENT! Ready to proceed:');
    console.log('   ✅ 1. Schema is webhook-compatible');
    console.log('   ✅ 2. High compatibility with production');
    console.log('   🚀 3. Continue with content import');
    console.log('   🧪 4. Run webhook integration tests');
  } else if (isWebhookReady) {
    console.log('🟡 GOOD! Webhook-ready but can be improved:');
    console.log('   ✅ 1. Webhooks will work');
    console.log('   📋 2. Consider adding remaining columns for full compatibility');
    console.log('   🚀 3. Can proceed with content import');
  } else {
    console.log('⚠️  ATTENTION NEEDED:');
    console.log('   ❌ 1. Webhooks may fail without critical columns');
    console.log('   🔧 2. Apply schema upgrade immediately');
    console.log('   ⏳ 3. Do NOT proceed until webhook compatibility is achieved');
    
    console.log('\n🚨 CRITICAL: Apply schema upgrade now!');
    console.log('Use Supabase Dashboard SQL Editor with staging-upgrade-1755801606250.sql');
  }
}

async function runSchemaVerification() {
  console.log('🎯 SCHEMA UPGRADE VERIFICATION');
  console.log('=' .repeat(60));

  // Verify schema status
  const result = await verifySchemaUpgradeStatus();
  
  // Test webhook compatibility
  const webhookReady = await testWebhookCompatibility();
  
  // Update result with webhook test
  if (result) {
    result.webhookTestPassed = webhookReady;
  }

  // Generate recommendations
  await generateNextSteps(result);

  console.log('\n✅ SCHEMA VERIFICATION COMPLETE');
  
  return result && result.isWebhookReady && result.compatibilityPercent >= 70;
}

// Run verification
runSchemaVerification();