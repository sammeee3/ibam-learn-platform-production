const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebhookUser() {
  console.log('🔍 Checking webhook test user...');
  
  const email = 'webhook-test@example.com';
  
  try {
    // Check user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profile) {
      console.log('✅ User profile found:');
      console.log('   ID:', profile.id);
      console.log('   Email:', profile.email);
      console.log('   Name:', profile.first_name, profile.last_name);
      console.log('   Platform Access:', profile.has_platform_access);
      console.log('   Active:', profile.is_active);
      console.log('   Created via webhook:', profile.created_via_webhook);
      console.log('   Notes:', profile.notes);
      
      if (profile.notes) {
        try {
          const notes = JSON.parse(profile.notes);
          console.log('   Magic Token:', notes.magic_token ? notes.magic_token.substring(0, 8) + '...' : 'None');
          console.log('   Token Expires:', notes.token_expires);
          console.log('   Assigned Course:', notes.assigned_course);
          console.log('   Course Name:', notes.course_name);
        } catch (e) {
          console.log('   ❌ Invalid JSON in notes');
        }
      }
    } else {
      console.log('❌ User profile not found:', profileError?.message);
    }
    
    // Check auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find(u => u.email === email);
    
    if (authUser) {
      console.log('✅ Auth user found:');
      console.log('   ID:', authUser.id);
      console.log('   Email:', authUser.email);
      console.log('   Created:', authUser.created_at);
      console.log('   Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
    } else {
      console.log('❌ Auth user not found');
    }
    
  } catch (error) {
    console.error('💥 Error checking user:', error);
  }
}

checkWebhookUser()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });