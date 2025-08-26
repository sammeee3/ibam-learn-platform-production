const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
  try {
    console.log('🚀 Setting up test user sj614+staging@proton.me...');
    
    // Step 1: Check if auth user exists, create if not
    console.log('📧 Checking for existing auth user...');
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let userId;
    let authUser = existingUsers?.users?.find(u => u.email === 'sj614+staging@proton.me');
    
    if (authUser) {
      userId = authUser.id;
      console.log('✅ Auth user already exists with ID:', userId);
    } else {
      console.log('📧 Creating new auth user...');
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'sj614+staging@proton.me',
        email_confirm: true,
        user_metadata: {
          name: 'Test User',
          created_for_testing: true
        }
      });
      
      if (authError) {
        console.error('❌ Auth user creation failed:', authError);
        return;
      }
      
      userId = newAuthUser.user.id;
      console.log('✅ Auth user created with ID:', userId);
    }
    
    // Step 2: Create or update user profile
    console.log('👤 Creating/updating user profile...');
    
    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', 'sj614+staging@proton.me')
      .single();
    
    let profileId;
    const profileData = {
      auth_user_id: userId,
      email: 'sj614+staging@proton.me',
      first_name: 'Test',
      last_name: 'User',
      login_source: 'staging_test',
      updated_at: new Date().toISOString(),
      magic_token: 'test-token-' + Math.random().toString(36).substring(7),
      magic_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    if (existingProfile) {
      profileId = existingProfile.id;
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', profileId);
      
      if (updateError) {
        console.error('❌ Profile update failed:', updateError);
        return;
      }
      console.log('✅ User profile updated with ID:', profileId);
    } else {
      profileData.created_at = new Date().toISOString();
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        return;
      }
      profileId = newProfile.id;
      console.log('✅ User profile created with ID:', profileId);
    }
    
    // Step 3: Create session progress for Module 5, Session 3
    console.log('📚 Creating session progress...');
    const { error: progressError } = await supabase.from('user_sessions').upsert({
      user_id: profileId,
      module_id: 5,
      session_id: 3,
      completion_percentage: 65,
      last_accessed: new Date().toISOString(),
      time_spent_minutes: 45,
      last_section: 'content',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (progressError) {
      console.error('❌ Progress creation failed:', progressError);
      return;
    }
    console.log('✅ Session progress created for Module 5, Session 3');
    
    // Step 4: Add progress for previous modules
    console.log('📈 Adding previous module progress...');
    const previousProgress = [];
    
    // Module 1 - Complete
    for (let session = 1; session <= 4; session++) {
      previousProgress.push({
        user_id: profileId,
        module_id: 1,
        session_id: session,
        completion_percentage: 100,
        last_accessed: new Date(Date.now() - (10 - session) * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Module 2 - Complete
    for (let session = 1; session <= 4; session++) {
      previousProgress.push({
        user_id: profileId,
        module_id: 2,
        session_id: session,
        completion_percentage: 100,
        last_accessed: new Date(Date.now() - (6 - session) * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Module 3 - Complete
    for (let session = 1; session <= 5; session++) {
      previousProgress.push({
        user_id: profileId,
        module_id: 3,
        session_id: session,
        completion_percentage: 100,
        last_accessed: new Date(Date.now() - (4 - Math.floor(session/2)) * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Module 4 - Complete
    for (let session = 1; session <= 4; session++) {
      previousProgress.push({
        user_id: profileId,
        module_id: 4,
        session_id: session,
        completion_percentage: 100,
        last_accessed: new Date(Date.now() - (2 - Math.floor(session/2)) * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Module 5 - In Progress
    previousProgress.push({
      user_id: profileId,
      module_id: 5,
      session_id: 1,
      completion_percentage: 100,
      last_accessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    });
    previousProgress.push({
      user_id: profileId,
      module_id: 5,
      session_id: 2,
      completion_percentage: 100,
      last_accessed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    });
    
    const { error: batchError } = await supabase.from('user_sessions').upsert(previousProgress);
    if (batchError) {
      console.error('❌ Batch progress creation failed:', batchError);
      return;
    }
    console.log('✅ Previous module progress added');
    
    // Step 5: Add action steps
    console.log('🎯 Adding action steps...');
    const { error: actionError } = await supabase.from('user_action_steps').insert([
      {
        user_id: profileId,
        module_id: 5,
        session_id: 2,
        action_type: 'business',
        specific_action: 'Review financial projections',
        generated_statement: 'I will review financial projections by Friday',
        completed: true,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id: profileId,
        module_id: 5,
        session_id: 3,
        action_type: 'faith',
        specific_action: 'Pray about business direction',
        generated_statement: 'I will pray about business direction this week',
        completed: false,
        created_at: new Date().toISOString()
      }
    ]);
    
    if (actionError) {
      console.error('❌ Action steps creation failed:', actionError);
      return;
    }
    console.log('✅ Action steps added');
    
    // Step 6: Add module completion tracking
    console.log('📊 Adding module completion tracking...');
    const moduleCompletions = [
      { user_id: profileId, module_id: 1, completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), completion_percentage: 100 },
      { user_id: profileId, module_id: 2, completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), completion_percentage: 100 },
      { user_id: profileId, module_id: 3, completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), completion_percentage: 100 },
      { user_id: profileId, module_id: 4, completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), completion_percentage: 100 },
      { user_id: profileId, module_id: 5, completed_at: null, completion_percentage: 67 }
    ];
    
    const { error: completionError } = await supabase.from('module_completion').upsert(moduleCompletions);
    if (completionError) {
      console.error('❌ Module completion tracking failed:', completionError);
      return;
    }
    console.log('✅ Module completion tracking added');
    
    console.log('\n🎉 Test user created successfully!');
    console.log('📧 Email: sj614+staging@proton.me');
    console.log('📚 Current Progress: Module 5, Session 3 (65% complete)');
    console.log('🏁 Modules Completed: 1-4');
    console.log('🔑 User ID:', userId);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

createTestUser();