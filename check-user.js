const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email) {
  console.log(`🔍 Checking for user: ${email}`);
  
  try {
    // Check user_profiles table
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profileError) {
      console.log('❌ Error checking user_profiles:', profileError.message);
      
      // Also check if user exists but query failed
      const { data: allUsers, error: allError } = await supabase
        .from('user_profiles')
        .select('email')
        .limit(10);
        
      if (allError) {
        console.log('❌ Error fetching any users:', allError.message);
      } else {
        console.log('✅ Sample users in database:');
        allUsers.forEach(user => console.log(`   - ${user.email}`));
      }
    } else {
      console.log('✅ User found in user_profiles:');
      console.log('   ID:', userProfile.id);
      console.log('   Email:', userProfile.email);
      console.log('   Created:', userProfile.created_at);
      console.log('   Full data:', userProfile);
    }
    
    // Also check auth.users table for comparison
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error checking auth.users:', authError.message);
    } else {
      const authUser = authUsers.users.find(user => user.email === email);
      if (authUser) {
        console.log('✅ User also found in auth.users:');
        console.log('   Auth ID:', authUser.id);
        console.log('   Email:', authUser.email);
      } else {
        console.log('❌ User NOT found in auth.users');
      }
    }
    
  } catch (error) {
    console.log('❌ Script error:', error.message);
  }
}

// Check both users
async function main() {
  console.log('🔍 SUPABASE DATABASE CHECK\n');
  
  await checkUser('sammeee@yahoo.com');
  console.log('\n' + '='.repeat(50) + '\n');
  await checkUser('jsamuelson@ibam.org');
  
  console.log('\n✅ Database check complete');
}

main();