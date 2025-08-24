const { createClient } = require('@supabase/supabase-js');

// Production database
const supabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
);

async function searchAll() {
  console.log('🔍 FULL SQL SEARCH - ALL SESSIONS IN PRODUCTION\n');
  
  // Get EVERYTHING from sessions table
  const { data: allSessions, error } = await supabase
    .from('sessions')
    .select('id, module_id, session_number, title')
    .order('module_id, session_number');
    
  if (error) {
    console.log('Error:', error);
    return;
  }
  
  console.log(`TOTAL SESSIONS: ${allSessions.length}\n`);
  
  // Group by module
  const modules = {};
  allSessions.forEach(s => {
    if (!modules[s.module_id]) modules[s.module_id] = [];
    modules[s.module_id].push(s);
  });
  
  // Show all
  Object.keys(modules).sort((a,b) => a-b).forEach(mod => {
    console.log(`\nMODULE ${mod} (${modules[mod].length} sessions):`);
    modules[mod].forEach(s => {
      console.log(`  [ID:${s.id}] Session ${s.session_number}: ${s.title}`);
    });
  });
  
  // Look for duplicates or numbering issues
  console.log('\n\n🔍 CHECKING FOR DUPLICATE SESSION NUMBERS:');
  Object.keys(modules).forEach(mod => {
    const sessionNumbers = modules[mod].map(s => s.session_number);
    const duplicates = sessionNumbers.filter((item, index) => sessionNumbers.indexOf(item) !== index);
    if (duplicates.length > 0) {
      console.log(`  Module ${mod} has DUPLICATE session numbers: ${duplicates.join(', ')}`);
      
      // Show which ones are duplicated
      modules[mod].forEach(s => {
        if (duplicates.includes(s.session_number)) {
          console.log(`    - [ID:${s.id}] Session ${s.session_number}: ${s.title}`);
        }
      });
    }
  });
  
  // Check for AVODAH sessions
  console.log('\n\n🔍 SEARCHING FOR "AVODAH" SESSIONS:');
  allSessions.filter(s => s.title.includes('AVODAH')).forEach(s => {
    console.log(`  [ID:${s.id}] Module ${s.module_id} Session ${s.session_number}: ${s.title}`);
  });
}

searchAll();
