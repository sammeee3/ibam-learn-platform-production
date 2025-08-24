const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Production database (SOURCE) - with service role key
const prodSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

// Staging database (DESTINATION) - Service role key confirmed working
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function importProductionToStaging() {
  console.log('🚀 IMPORTING PRODUCTION DATA TO NEW STAGING TABLE\n');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Export all sessions from production
    console.log('\n📥 STEP 1: Exporting from production...');
    const { data: prodSessions, error: exportError } = await prodSupabase
      .from('sessions')
      .select('*')
      .order('module_id, session_number');
      
    if (exportError) {
      console.error('❌ Export error:', exportError);
      return;
    }
    
    console.log(`✅ Exported ${prodSessions.length} sessions from production`);
    
    // Show what we're importing
    const moduleCounts = {};
    prodSessions.forEach(s => {
      if (!moduleCounts[s.module_id]) moduleCounts[s.module_id] = 0;
      moduleCounts[s.module_id]++;
    });
    
    console.log('\n📊 Sessions to import:');
    Object.keys(moduleCounts).sort().forEach(mod => {
      console.log(`   Module ${mod}: ${moduleCounts[mod]} sessions`);
    });
    
    // Step 2: Check new staging table is empty
    console.log('\n📤 STEP 2: Checking staging is ready...');
    const { count: stagingCount } = await stagingSupabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    if (stagingCount > 0) {
      console.log(`⚠️  Warning: Staging already has ${stagingCount} sessions`);
      console.log('   These will be preserved, adding production data...');
    } else {
      console.log('✅ Staging table is empty and ready');
    }
    
    // Step 3: Import to staging
    console.log('\n📥 STEP 3: Importing to staging...');
    const { data: imported, error: importError } = await stagingSupabase
      .from('sessions')
      .insert(prodSessions);
      
    if (importError) {
      console.error('❌ Import error:', importError);
      console.log('\n💡 TIP: You need the staging SERVICE ROLE key, not anon key');
      console.log('   Get it from: Supabase Dashboard > Settings > API > service_role');
      return;
    }
    
    console.log(`✅ Successfully imported ${prodSessions.length} sessions!`);
    
    // Step 4: Verify
    console.log('\n✅ STEP 4: Verifying import...');
    const { count: finalCount } = await stagingSupabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Final count: ${finalCount} sessions in staging`);
    
    if (finalCount === prodSessions.length) {
      console.log('\n🎉 PERFECT! Staging now matches production exactly!');
      console.log('✅ You can now test everything in staging before deploying to production');
    }
    
    // Step 5: Show backup table info
    console.log('\n📦 BACKUP INFO:');
    console.log('Your old staging data is preserved in: sessions_old_backup_aug24_2025');
    console.log('You can query it anytime with:');
    console.log('SELECT * FROM sessions_old_backup_aug24_2025;');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the import
importProductionToStaging();

/* 
INSTRUCTIONS:
1. First run the SQL script: STAGING-NUCLEAR-RESET-SAFE.sql
2. Get your staging SERVICE ROLE key from Supabase dashboard
3. Replace YOUR_STAGING_SERVICE_ROLE_KEY_HERE above
4. Run: node import-production-to-staging.js
*/