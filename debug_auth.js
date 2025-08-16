// Debug authentication state
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function debugAuth() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('🔍 Debugging authentication for demo-user@test.com...');
    
    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'demo-user@test.com')
      .single();
    
    if (profileError) {
      console.error('❌ Profile error:', profileError);
      return;
    }
    
    console.log('✅ User profile found:');
    console.log('   - Email:', profile.email);
    console.log('   - First Name:', profile.first_name);
    console.log('   - Login Source:', profile.login_source);
    console.log('   - Auth User ID:', profile.auth_user_id);
    
    // Check auth user
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers.users.find(u => u.id === profile.auth_user_id);
    
    if (authUser) {
      console.log('✅ Auth user found:');
      console.log('   - Email:', authUser.email);
      console.log('   - Created:', authUser.created_at);
      console.log('   - Email confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
    } else {
      console.log('❌ Auth user NOT found for ID:', profile.auth_user_id);
    }
    
  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

debugAuth();