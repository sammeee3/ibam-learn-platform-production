const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSSO(email) {
  console.log(`🔍 Testing SSO logic for: ${email}`);
  
  try {
    // Step 1: Check user_profiles table first (preferred)
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log('✅ User found in user_profiles:', email);
      console.log('   Profile ID:', existingProfile.id);
      return { success: true, source: 'user_profiles', profile: existingProfile };
    } else {
      console.log('❌ User not found in user_profiles:', profileError?.message);
      
      // Step 2: Check auth.users table as fallback
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log('❌ Error checking auth.users:', authError.message);
        return { success: false, error: authError.message };
      }
      
      const userAuth = authUsers.users.find(user => user.email === email);
      
      if (userAuth) {
        console.log('✅ User found in auth.users, would create profile...', email);
        console.log('   Auth ID:', userAuth.id);
        console.log('   Created:', userAuth.created_at);
        console.log('   Last Sign In:', userAuth.last_sign_in_at);
        
        // Simulate the profile creation (don't actually create to avoid duplicates)
        console.log('📝 Would create profile with data:');
        console.log('   auth_user_id:', userAuth.id);
        console.log('   email:', email);
        console.log('   first_name:', userAuth.user_metadata?.full_name?.split(' ')[0] || 'User');
        
        return { success: true, source: 'auth_users_auto_create', userAuth };
      } else {
        console.log('❌ User not found in auth.users either:', email);
        return { success: false, error: 'User not found in either table' };
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🧪 TESTING SSO LOGIC LOCALLY\n');
  
  const result1 = await testSSO('sammeee@yahoo.com');
  console.log('\n' + '='.repeat(50) + '\n');
  const result2 = await testSSO('jsamuelson@ibam.org');
  
  console.log('\n📊 SUMMARY:');
  console.log('sammeee@yahoo.com:', result1.success ? '✅ Would succeed' : '❌ Would fail');
  console.log('jsamuelson@ibam.org:', result2.success ? '✅ Would succeed' : '❌ Would fail');
  
  if (result1.success && result1.source === 'auth_users_auto_create') {
    console.log('\n🚨 ISSUE: The enhanced SSO should have worked!');
    console.log('   Either the deployment failed or there\'s a production issue.');
  }
}

main();