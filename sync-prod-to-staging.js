const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Production database (SOURCE)
const prodSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

// Staging database (DESTINATION) - need service role for write access
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
);

async function syncDatabases() {
  console.log('🔄 SYNCING PRODUCTION → STAGING\n');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Export sessions from production
    console.log('\n📥 EXPORTING FROM PRODUCTION:');
    const { data: prodSessions, error: exportError } = await prodSupabase
      .from('sessions')
      .select('*')
      .order('module_id, session_number');
      
    if (exportError) {
      console.error('❌ Export error:', exportError);
      return;
    }
    
    console.log(`✅ Exported ${prodSessions.length} sessions`);
    
    // Show what we're copying
    const moduleCounts = {};
    prodSessions.forEach(s => {
      if (!moduleCounts[s.module_id]) moduleCounts[s.module_id] = 0;
      moduleCounts[s.module_id]++;
    });
    
    console.log('\n📊 Sessions per module:');
    Object.keys(moduleCounts).sort().forEach(mod => {
      console.log(`   Module ${mod}: ${moduleCounts[mod]} sessions`);
    });
    
    // Step 2: Check staging current state
    console.log('\n📤 STAGING CURRENT STATE:');
    const { count: stagingCount } = await stagingSupabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Currently has ${stagingCount || 0} sessions`);
    
    // Step 3: Since we can't delete with anon key, let's try to upsert
    console.log('\n🔄 SYNCING TO STAGING:');
    console.log('   Note: Using anon key, can only insert new records');
    
    // Try to insert sessions that don't exist
    let inserted = 0;
    let skipped = 0;
    
    for (const session of prodSessions) {
      // Check if it exists
      const { data: existing } = await stagingSupabase
        .from('sessions')
        .select('id')
        .eq('id', session.id)
        .single();
      
      if (!existing) {
        // Try to insert
        const { error: insertError } = await stagingSupabase
          .from('sessions')
          .insert(session);
        
        if (!insertError) {
          inserted++;
          console.log(`   ✅ Added: Module ${session.module_id} Session ${session.session_number}`);
        } else {
          console.log(`   ⚠️ Failed to add session ${session.id}: ${insertError.message}`);
        }
      } else {
        skipped++;
      }
    }
    
    console.log(`\n📊 SYNC RESULTS:`);
    console.log(`   ✅ Inserted: ${inserted} new sessions`);
    console.log(`   ⏭️ Skipped: ${skipped} existing sessions`);
    
    // Verify final state
    const { count: finalCount } = await stagingSupabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n✅ STAGING NOW HAS ${finalCount} SESSIONS`);
    
    if (finalCount === prodSessions.length) {
      console.log('🎉 PERFECT! Staging matches production!');
    } else {
      console.log(`⚠️ Note: Staging has ${finalCount} but production has ${prodSessions.length}`);
      console.log('   This may be due to permission limitations with anon key.');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

syncDatabases();
