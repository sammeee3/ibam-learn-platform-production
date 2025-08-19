const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProgressConfusion() {
  console.log('🔍 INVESTIGATING PROGRESS DATA CONFUSION');
  console.log('=========================================');
  
  try {
    // Check user_progress table structure first
    console.log('📊 USER_PROGRESS TABLE STRUCTURE:');
    const { data: progressColumns, error: structureError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_progress' })
      .catch(() => null);
    
    // Try getting all progress data to see the structure
    const { data: allProgress, error: allProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(5);
    
    if (allProgressError) {
      console.error('❌ Error checking user_progress:', allProgressError);
    } else if (allProgress && allProgress.length > 0) {
      console.log('✅ FOUND USER_PROGRESS DATA:');
      console.log('Columns:', Object.keys(allProgress[0]));
      allProgress.forEach((p, i) => {
        console.log(`${i + 1}.`, JSON.stringify(p, null, 2));
      });
    } else {
      console.log('ℹ️ No user_progress data found');
    }
    
    // Get the current logged-in user from Supabase auth
    console.log('\n🔍 CHECKING CURRENT AUTH STATE:');
    
    // Check all progress data that might be associated with our users
    console.log('\n🔍 CHECKING PROGRESS FOR ALL SJ614 USERS:');
    
    // Get all sj614 user IDs (both profile IDs and auth IDs)
    const { data: sj614Users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, auth_user_id, email, first_name')
      .ilike('email', 'sj614%');
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError);
      return;
    }
    
    console.log(`Found ${sj614Users.length} users:`);
    sj614Users.forEach(user => {
      console.log(`- ${user.email}: Profile ID = ${user.id}, Auth ID = ${user.auth_user_id}`);
    });
    
    // Check progress data for each possible user ID
    for (const user of sj614Users) {
      console.log(`\n🔍 Checking progress for ${user.email}:`);
      
      // Try different user ID field combinations
      const possibleFields = ['user_id'];
      
      for (const field of possibleFields) {
        // Try with profile ID
        let { data: progressByProfileId, error: error1 } = await supabase
          .from('user_progress')
          .select('*')
          .eq(field, user.id);
        
        if (!error1 && progressByProfileId && progressByProfileId.length > 0) {
          console.log(`  ✅ Found progress by ${field} = profile ID (${user.id}):`);
          progressByProfileId.forEach(p => {
            console.log(`     Session ${p.session_id}: ${p.completion_percentage}%`);
          });
        }
        
        // Try with auth ID
        if (user.auth_user_id) {
          let { data: progressByAuthId, error: error2 } = await supabase
            .from('user_progress')
            .select('*')
            .eq(field, user.auth_user_id);
          
          if (!error2 && progressByAuthId && progressByAuthId.length > 0) {
            console.log(`  ✅ Found progress by ${field} = auth ID (${user.auth_user_id}):`);
            progressByAuthId.forEach(p => {
              console.log(`     Session ${p.session_id}: ${p.completion_percentage}%`);
            });
          }
        }
      }
    }
    
    // Check the dashboard's getCurrentUserId function logic
    console.log('\n🔧 TESTING DASHBOARD LOGIN LOGIC:');
    
    // The dashboard uses supabase.auth.getUser() - let's see what that returns
    // But since we're using service role, we can't test this directly
    console.log('Dashboard uses supabase.auth.getUser() which we cannot test with service role');
    console.log('The issue might be:');
    console.log('1. Dashboard is getting the wrong user ID from auth');
    console.log('2. Progress data exists for a different user');
    console.log('3. LocalStorage contains wrong email but auth has different user');
    
    // Let's check what happens when someone logs in with sj614+prodtest@proton.me
    console.log('\n🔍 WHAT SHOULD HAPPEN WITH CORRECT LOGIN:');
    console.log('1. User logs in via SSO with magic token');
    console.log('2. Auth should return user ID: 6b559c46-1d01-4322-b589-882b9084ccb2');
    console.log('3. Dashboard should find NO progress data for this user ID');
    console.log('4. Dashboard should show 0% completion for all modules');
    
  } catch (error) {
    console.error('💥 Error in progress check:', error);
  }
}

// Run the check
checkProgressConfusion()
  .then(() => {
    console.log('\n✅ Progress confusion check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });