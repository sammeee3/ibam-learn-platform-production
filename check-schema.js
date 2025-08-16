const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 CHECKING USER_PROFILES SCHEMA');
  
  // Get any existing profile to see schema
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (profiles && profiles.length > 0) {
    console.log('📋 Available columns:');
    console.log(Object.keys(profiles[0]).sort());
  } else {
    console.log('📋 No existing profiles found');
  }
}

checkSchema().catch(console.error);