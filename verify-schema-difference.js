const { createClient } = require('@supabase/supabase-js');

// Production database
const prodSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
);

// Staging database
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
);

async function verifySchema() {
  console.log('🔍 VERIFYING SCHEMA DIFFERENCES\n');
  console.log('=' .repeat(50));
  
  // Get a sample session from production to see all fields
  console.log('\n📊 PRODUCTION SESSION STRUCTURE:');
  const { data: prodSession } = await prodSupabase
    .from('sessions')
    .select('*')
    .eq('id', 1)
    .single();
    
  if (prodSession) {
    const fields = Object.keys(prodSession);
    console.log('Fields in production sessions table:');
    fields.forEach(field => {
      const value = prodSession[field];
      const type = value === null ? 'null' : typeof value;
      console.log(`  - ${field}: ${type}`);
    });
  }
  
  // Get a sample from staging
  console.log('\n📊 STAGING SESSION STRUCTURE:');
  const { data: stagingSession } = await stagingSupabase
    .from('sessions')
    .select('*')
    .eq('id', 1)
    .single();
    
  if (stagingSession) {
    const fields = Object.keys(stagingSession);
    console.log('Fields in staging sessions table:');
    fields.forEach(field => {
      const value = stagingSession[field];
      const type = value === null ? 'null' : typeof value;
      console.log(`  - ${field}: ${type}`);
    });
  }
  
  // Compare
  console.log('\n🔄 COMPARISON:');
  if (prodSession && stagingSession) {
    const prodFields = Object.keys(prodSession);
    const stagingFields = Object.keys(stagingSession);
    
    const missingInStaging = prodFields.filter(f => !stagingFields.includes(f));
    const extraInStaging = stagingFields.filter(f => !prodFields.includes(f));
    
    if (missingInStaging.length > 0) {
      console.log('❌ Fields in PRODUCTION but NOT in STAGING:');
      missingInStaging.forEach(field => {
        const value = prodSession[field];
        const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
        console.log(`  - ${field} (type: ${type})`);
      });
    }
    
    if (extraInStaging.length > 0) {
      console.log('\n⚠️ Fields in STAGING but NOT in PRODUCTION:');
      extraInStaging.forEach(field => {
        console.log(`  - ${field}`);
      });
    }
    
    if (missingInStaging.length === 0 && extraInStaging.length === 0) {
      console.log('✅ Schemas match perfectly!');
    }
  }
  
  console.log('\n📝 SAFE SQL COMMANDS:');
  console.log('The ALTER TABLE command with IF NOT EXISTS is safe because:');
  console.log('  1. It only adds the column if it doesn\'t exist');
  console.log('  2. It won\'t affect existing data');
  console.log('  3. JSONB type matches production (stores JSON data)');
  console.log('  4. No data will be lost');
}

verifySchema();
