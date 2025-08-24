const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Production database
const prodSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

// Staging database - using service role key for full access
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.Tr5PlIRQuTxz3K7ShN1iHFvr-9W3RtIvU6BUmBRkPWc'
);

async function mirrorDatabases() {
  console.log('📋 MIRRORING PRODUCTION TO STAGING\n');
  
  try {
    // Step 1: Export all sessions from production
    console.log('1️⃣ Exporting sessions from production...');
    const { data: prodSessions, error: exportError } = await prodSupabase
      .from('sessions')
      .select('*')
      .order('module_id, session_number');
      
    if (exportError) {
      console.error('Export error:', exportError);
      return;
    }
    
    console.log(`   ✅ Exported ${prodSessions.length} sessions from production\n`);
    
    // Step 2: Clear staging sessions
    console.log('2️⃣ Clearing staging sessions...');
    const { error: deleteError } = await stagingSupabase
      .from('sessions')
      .delete()
      .gte('id', 0); // Delete all
      
    if (deleteError) {
      console.error('Delete error:', deleteError);
      return;
    }
    console.log('   ✅ Cleared staging sessions\n');
    
    // Step 3: Import to staging
    console.log('3️⃣ Importing sessions to staging...');
    const { data: imported, error: importError } = await stagingSupabase
      .from('sessions')
      .insert(prodSessions);
      
    if (importError) {
      console.error('Import error:', importError);
      return;
    }
    
    console.log(`   ✅ Imported ${prodSessions.length} sessions to staging\n`);
    
    // Step 4: Verify
    console.log('4️⃣ Verifying staging database...');
    const { count: stagingCount } = await stagingSupabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
      
    console.log(`   Staging now has ${stagingCount} sessions\n`);
    
    // Show module breakdown
    console.log('📊 Module Breakdown:');
    for (let mod = 1; mod <= 5; mod++) {
      const { count } = await stagingSupabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', mod);
      console.log(`   Module ${mod}: ${count} sessions`);
    }
    
    console.log('\n✅ MIRRORING COMPLETE! Staging now matches production.');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

mirrorDatabases();
