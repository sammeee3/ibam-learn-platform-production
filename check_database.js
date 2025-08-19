const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSession() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('module_id', 1)
    .eq('session_number', 1)
    .single();
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log('📊 Current Session 1.1 Data:');
  console.log('Title:', data.title);
  console.log('Fast Track Summary length:', data.fast_track_summary?.length || 'NULL');
  console.log('Content structure:', Object.keys(data.content || {}));
  console.log('Case Study length:', data.case_study?.length || 'NULL');
  console.log('Has quiz questions:', !!data.content?.quiz_questions);
  console.log('Has FAQ questions:', !!data.content?.faq_questions);
}

checkSession();
