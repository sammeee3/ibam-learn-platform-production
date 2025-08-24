const { createClient } = require('@supabase/supabase-js');

// Staging database
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
);

// Production database  
const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
);

async function compare() {
  console.log('📊 DATABASE COMPARISON\n');
  
  const { count: stagingCount } = await stagingSupabase
    .from('sessions')
    .select('*', { count: 'exact', head: true });
    
  const { count: productionCount } = await productionSupabase
    .from('sessions')
    .select('*', { count: 'exact', head: true });
    
  console.log(`STAGING: ${stagingCount} sessions`);
  console.log(`PRODUCTION: ${productionCount} sessions`);
  console.log(`\n⚠️  STAGING IS MISSING ${productionCount - stagingCount} SESSIONS!\n`);
  
  // The user reported error happens in production
  console.log('USER ERROR CONTEXT:');
  console.log('- User is on PRODUCTION site (ibam-learn-platform-v2.vercel.app)');
  console.log('- Going from Module 1 Session 3 to Session 4');
  console.log('- Session 4 EXISTS in production database');
  console.log('\nSo the JSON error is NOT from missing data...');
  console.log('It must be something else! Maybe corrupted content?');
  
  // Check if Session 4 content is valid JSON
  console.log('\n\nCHECKING SESSION 4 CONTENT VALIDITY:');
  const { data: session4 } = await productionSupabase
    .from('sessions')
    .select('content')
    .eq('module_id', 1)  
    .eq('session_number', 4)
    .single();
    
  if (session4 && session4.content) {
    try {
      // Check if it's valid JSON
      const parsed = typeof session4.content === 'string' 
        ? JSON.parse(session4.content)
        : session4.content;
      console.log('✅ Content is valid JSON');
      console.log('Content keys:', Object.keys(parsed).join(', '));
    } catch (e) {
      console.log('❌ CONTENT IS INVALID JSON!');
      console.log('Error:', e.message);
      console.log('This causes the JSON error!');
    }
  }
}

compare();
