const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
);

async function deepCheck() {
  console.log('🔍 DEEP ANALYSIS: Module 1 Session 4\n');
  
  // 1. Check if session 4 exists at all
  console.log('1. Checking if Session 4 exists in any form...');
  const { data: anySession4 } = await supabase
    .from('sessions')
    .select('module_id, session_number, title, content')
    .eq('module_id', 1)
    .eq('session_number', 4);
    
  console.log('   Result:', anySession4 ? `Found ${anySession4.length} records` : 'No records');
  
  // 2. Check ALL Module 1 sessions
  console.log('\n2. Checking ALL Module 1 sessions...');
  const { data: allSessions } = await supabase
    .from('sessions')
    .select('session_number, title, created_at')
    .eq('module_id', 1)
    .order('session_number');
    
  if (allSessions) {
    allSessions.forEach(s => {
      console.log(`   Session ${s.session_number}: ${s.title} (created: ${s.created_at})`);
    });
  }
  
  // 3. Try to fetch exactly what the page would fetch
  console.log('\n3. Attempting exact query the page uses (.single())...');
  const { data: session4Single, error: singleError } = await supabase
    .from('sessions')
    .select('*')
    .eq('module_id', 1)
    .eq('session_number', 4)
    .single();
    
  if (singleError) {
    console.log('   ❌ ERROR:', singleError.message);
    console.log('   Error code:', singleError.code);
    console.log('   This is likely the JSON error users see!');
  } else if (session4Single) {
    console.log('   ✅ Session 4 found!');
    console.log('   Title:', session4Single.title);
    console.log('   Has content:', !!session4Single.content);
    
    // Check if content is valid JSON
    if (session4Single.content) {
      try {
        const parsed = typeof session4Single.content === 'string' 
          ? JSON.parse(session4Single.content) 
          : session4Single.content;
        console.log('   Content is valid JSON:', Object.keys(parsed).join(', '));
      } catch (e) {
        console.log('   ⚠️ Content is NOT valid JSON!', e.message);
      }
    }
  }
  
  // 4. Check for duplicate sessions
  console.log('\n4. Checking for duplicates...');
  const { data: duplicates } = await supabase
    .from('sessions')
    .select('id, module_id, session_number, title')
    .eq('module_id', 1)
    .eq('session_number', 4);
    
  if (duplicates && duplicates.length > 1) {
    console.log('   ⚠️ FOUND DUPLICATES! This causes .single() to fail!');
    duplicates.forEach(d => {
      console.log(`   - ID: ${d.id}, Title: ${d.title}`);
    });
  } else {
    console.log('   No duplicates found');
  }
}

deepCheck();
