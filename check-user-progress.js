const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProgress() {
  console.log('🔍 CHECKING USER PROGRESS DATA CONTAMINATION');
  console.log('============================================');
  
  try {
    // Get our test user profile
    const { data: testUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'sj614+prodtest@proton.me')
      .single();
    
    if (userError || !testUser) {
      console.error('❌ Test user not found:', userError);
      return;
    }
    
    console.log('✅ TEST USER FOUND:');
    console.log('ID:', testUser.id);
    console.log('Auth User ID:', testUser.auth_user_id);
    console.log('Email:', testUser.email);
    console.log('Name:', testUser.first_name, testUser.last_name);
    console.log('Created:', testUser.created_at);
    
    // Check user_progress table for this user
    console.log('\n🔍 CHECKING USER_PROGRESS TABLE:');
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .or(`user_profile_id.eq.${testUser.id},user_id.eq.${testUser.id},user_id.eq.${testUser.auth_user_id}`);
    
    if (progressError) {
      console.error('❌ Error checking user_progress:', progressError);
    } else if (progressData && progressData.length > 0) {
      console.log('⚠️ FOUND PROGRESS DATA:');
      progressData.forEach((p, i) => {
        console.log(`${i + 1}. Session ID: ${p.session_id}, User ID: ${p.user_id || p.user_profile_id}, Completion: ${p.completion_percentage}%`);
      });
    } else {
      console.log('✅ NO PROGRESS DATA FOUND (Expected for new user)');
    }
    
    // Check user_session_progress table
    console.log('\n🔍 CHECKING USER_SESSION_PROGRESS TABLE:');
    const { data: sessionProgress, error: sessionError } = await supabase
      .from('user_session_progress')
      .select('*')
      .or(`user_id.eq.${testUser.id},user_id.eq.${testUser.auth_user_id}`);
    
    if (sessionError) {
      console.error('❌ Error checking user_session_progress:', sessionError);
    } else if (sessionProgress && sessionProgress.length > 0) {
      console.log('⚠️ FOUND SESSION PROGRESS DATA:');
      sessionProgress.forEach((p, i) => {
        console.log(`${i + 1}. Module: ${p.module_id}, Session: ${p.session_id}, User ID: ${p.user_id}, Completion: ${p.completion_percentage}%`);
      });
    } else {
      console.log('✅ NO SESSION PROGRESS DATA FOUND (Expected for new user)');
    }
    
    // Check if there are other users with similar data
    console.log('\n🔍 CHECKING FOR DATA CONTAMINATION:');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('user_profiles')
      .select('id, auth_user_id, email, first_name, created_at')
      .ilike('email', 'sj614%');
    
    if (allUsersError) {
      console.error('❌ Error checking all users:', allUsersError);
    } else {
      console.log(`📊 FOUND ${allUsers.length} USERS WITH SIMILAR EMAILS:`);
      allUsers.forEach((user, i) => {
        const isTestUser = user.email === 'sj614+prodtest@proton.me';
        console.log(`${i + 1}. ${isTestUser ? '👤 TEST USER:' : 'Other:'} ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Auth ID: ${user.auth_user_id}`);
        console.log(`   Name: ${user.first_name || 'N/A'}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
    }
    
    // Check auth.users table for multiple users
    console.log('\n🔍 CHECKING AUTH.USERS FOR SIMILAR EMAILS:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error checking auth users:', authError);
    } else {
      const similarAuthUsers = authUsers.users.filter(user => 
        user.email && user.email.includes('sj614')
      );
      
      console.log(`📊 FOUND ${similarAuthUsers.length} AUTH USERS WITH SIMILAR EMAILS:`);
      similarAuthUsers.forEach((user, i) => {
        const isTestUser = user.email === 'sj614+prodtest@proton.me';
        console.log(`${i + 1}. ${isTestUser ? '👤 TEST USER:' : 'Other:'} ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${user.created_at}`);
        console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('💥 Error checking user progress:', error);
  }
}

// Run the check
checkUserProgress()
  .then(() => {
    console.log('\n✅ User progress check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });