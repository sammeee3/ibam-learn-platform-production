const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSamUser() {
  const email = 'sj614+sam@proton.me';
  console.log('🔍 CHECKING USER:', email);
  
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (profile) {
    console.log('✅ USER FOUND:', profile.first_name, profile.last_name);
    console.log('   Magic Token:', profile.magic_token ? 'YES' : 'NO');
    console.log('   Active:', profile.is_active);
  } else {
    console.log('❌ USER NOT FOUND');
  }
}

checkSamUser();