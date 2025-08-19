const { createClient } = require('@supabase/supabase-js');

// Production database credentials
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDashboardData() {
  console.log('🔍 CHECKING DASHBOARD DATA SOURCES');
  console.log('==================================');
  
  try {
    // Test user details
    const testEmail = 'sj614+prodtest@proton.me';
    const testAuthId = '6b559c46-1d01-4322-b589-882b9084ccb2';
    
    console.log('Target user:', testEmail);
    console.log('Target auth ID:', testAuthId);
    console.log('');
    
    // 1. Check user_progress table for ANY data
    console.log('🔍 1. CHECKING user_progress TABLE:');
    const { data: allProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(10);
    
    if (progressError) {
      console.log('❌ Error:', progressError.message);
    } else {
      console.log(`Found ${allProgress.length} total progress records`);
      if (allProgress.length > 0) {
        console.log('First record structure:', Object.keys(allProgress[0]));
        
        // Check if any records match our user
        const matchingProgress = allProgress.filter(p => 
          p.user_id === testAuthId || p.user_id === testEmail
        );
        
        if (matchingProgress.length > 0) {
          console.log('⚠️ FOUND MATCHING PROGRESS:', matchingProgress);
        } else {
          console.log('✅ No progress data for test user (expected)');
        }
      }
    }
    
    // 2. Check user_session_progress table
    console.log('\n🔍 2. CHECKING user_session_progress TABLE:');
    const { data: sessionProgress, error: sessionError } = await supabase
      .from('user_session_progress')
      .select('*')
      .limit(10);
    
    if (sessionError) {
      console.log('❌ Error:', sessionError.message);
    } else {
      console.log(`Found ${sessionProgress.length} total session progress records`);
      if (sessionProgress.length > 0) {
        console.log('First record structure:', Object.keys(sessionProgress[0]));
        
        // Check if any records match our user
        const matchingSessionProgress = sessionProgress.filter(p => 
          p.user_id === testAuthId || p.user_id === testEmail
        );
        
        if (matchingSessionProgress.length > 0) {
          console.log('⚠️ FOUND MATCHING SESSION PROGRESS:', matchingSessionProgress);
        } else {
          console.log('✅ No session progress data for test user (expected)');
        }
      }
    }
    
    // 3. Check what the dashboard's getCurrentUserId would return
    console.log('\n🔍 3. SIMULATING DASHBOARD getCurrentUserId():');
    console.log('Dashboard calls: await supabase.auth.getUser()');
    console.log('This should return auth ID:', testAuthId);
    console.log('But since we use service role, we cannot test this directly');
    
    // 4. Check mock data vs real data logic
    console.log('\n🔍 4. DASHBOARD LOGIC ANALYSIS:');
    console.log('Dashboard loadDashboardData() function:');
    console.log('1. Calls getCurrentUserId() -> should return:', testAuthId);
    console.log('2. Queries user_progress with user_id =', testAuthId);
    console.log('3. If no data found, should use mock data');
    console.log('4. Mock data shows Module 1 = 100%, Module 2 = 50%');
    
    // 5. Check what sessions exist in database
    console.log('\n🔍 5. CHECKING SESSIONS TABLE:');
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(5);
    
    if (sessionsError) {
      console.log('❌ Error:', sessionsError.message);
    } else {
      console.log(`Found ${sessions.length} sessions in database`);
      if (sessions.length > 0) {
        console.log('First session:', sessions[0]);
      } else {
        console.log('⚠️ NO SESSIONS IN DATABASE - Dashboard will use mock data!');
      }
    }
    
    // 6. The real issue diagnosis
    console.log('\n🎯 DIAGNOSIS:');
    if (sessions.length === 0) {
      console.log('❌ ROOT CAUSE: Sessions table is empty');
      console.log('Dashboard code says: "No sessions found in database, using mock data"');
      console.log('Mock data shows completed modules, which is why user sees progress');
      console.log('');
      console.log('🔧 SOLUTION: Either:');
      console.log('1. Add real session data to database, OR');
      console.log('2. Modify mock data to show 0% completion for new users');
    } else {
      console.log('Sessions exist, issue might be elsewhere');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkDashboardData()
  .then(() => {
    console.log('\n✅ Dashboard data check complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });