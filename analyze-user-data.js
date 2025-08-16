const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeUserData() {
  console.log('🔍 COMPREHENSIVE USER DATA ANALYSIS\n');
  
  try {
    // 1. Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;
    
    // 2. Get all profile users
    const { data: profileUsers, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');
    if (profileError) throw profileError;
    
    console.log('📊 DATA OVERVIEW:');
    console.log(`   Auth Users: ${authUsers.users.length}`);
    console.log(`   Profile Users: ${profileUsers.length}\n`);
    
    // 3. Find mismatches
    console.log('🔍 MISMATCH ANALYSIS:\n');
    
    // Users in auth but not in profiles
    const authOnly = authUsers.users.filter(authUser => 
      !profileUsers.find(profileUser => profileUser.email === authUser.email)
    );
    
    console.log(`❌ Users in AUTH but NOT in PROFILES (${authOnly.length}):`);
    authOnly.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id})`);
      console.log(`     Created: ${user.created_at}`);
      console.log(`     Last Sign In: ${user.last_sign_in_at || 'Never'}`);
      console.log(`     Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    });
    
    // Users in profiles but not in auth
    const profileOnly = profileUsers.filter(profileUser => 
      !authUsers.users.find(authUser => authUser.email === profileUser.email)
    );
    
    console.log(`\n❌ Users in PROFILES but NOT in AUTH (${profileOnly.length}):`);
    profileOnly.forEach(user => {
      console.log(`   - ${user.email} (Profile ID: ${user.id})`);
      console.log(`     Auth User ID: ${user.auth_user_id}`);
      console.log(`     Created: ${user.created_at}`);
    });
    
    // 4. Check specific problematic user
    console.log('\n🎯 SPECIFIC USER ANALYSIS: sammeee@yahoo.com\n');
    
    const sammeeAuth = authUsers.users.find(u => u.email === 'sammeee@yahoo.com');
    if (sammeeAuth) {
      console.log('✅ Found in auth.users:');
      console.log(`   ID: ${sammeeAuth.id}`);
      console.log(`   Email: ${sammeeAuth.email}`);
      console.log(`   Created: ${sammeeAuth.created_at}`);
      console.log(`   Confirmed: ${sammeeAuth.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   Last Sign In: ${sammeeAuth.last_sign_in_at || 'Never'}`);
      console.log(`   Provider: ${sammeeAuth.app_metadata?.provider || 'Unknown'}`);
      console.log(`   Full metadata:`, sammeeAuth.user_metadata);
    }
    
    // 5. Check for similar emails in profiles
    const similarProfiles = profileUsers.filter(user => 
      user.email.includes('sammee') || user.email.includes('yahoo')
    );
    
    console.log('\n🔍 Similar emails in profiles:');
    if (similarProfiles.length === 0) {
      console.log('   None found');
    } else {
      similarProfiles.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }
    
    // 6. Recommend solution
    console.log('\n🎯 RECOMMENDED SOLUTION:\n');
    
    if (authOnly.length > 0) {
      console.log('💡 ISSUE: You have authenticated users without profiles.');
      console.log('   This happens when users sign up but profiles aren\'t created.');
      console.log('\n📋 SOLUTIONS:');
      console.log('   1. CREATE MISSING PROFILES: Add profiles for auth-only users');
      console.log('   2. UPDATE SSO LOGIC: Check auth.users first, then user_profiles');
      console.log('   3. SYNC MECHANISM: Create automatic profile creation on signup');
      
      console.log('\n🔧 IMMEDIATE FIX for sammeee@yahoo.com:');
      console.log('   Option A: Add to user_profiles table');
      console.log('   Option B: Update SSO to check auth.users table');
      
      console.log('\n🏗️ LONG-TERM FIX:');
      console.log('   - Implement profile auto-creation on user signup');
      console.log('   - Add database trigger or application logic');
      console.log('   - Ensure all auth users have corresponding profiles');
    }
    
    // 7. Show what needs to be created
    if (sammeeAuth && !profileUsers.find(p => p.email === 'sammeee@yahoo.com')) {
      console.log('\n📝 PROFILE DATA NEEDED for sammeee@yahoo.com:');
      console.log('   auth_user_id:', sammeeAuth.id);
      console.log('   email: sammeee@yahoo.com');
      console.log('   has_platform_access: true');
      console.log('   is_active: true');
      console.log('   (other fields can be defaults)');
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  }
}

analyzeUserData();