// Create a test user to see the new features
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createTestUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('🧪 Creating test user to demo new features...');
    
    const testEmail = 'demo-user@test.com';
    const testName = 'John Demo';
    
    // Check if auth user exists
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    let authUser = authUsers.users.find(user => user.email === testEmail);
    
    if (!authUser) {
      console.log('👤 Creating auth user...');
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        email_confirm: true,
        user_metadata: { name: testName }
      });
      
      if (authError) {
        console.error('❌ Auth error:', authError);
        return;
      }
      authUser = newAuthUser.user;
    }
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (!existingProfile) {
      console.log('📋 Creating user profile...');
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: authUser.id,
          email: testEmail,
          first_name: 'John',
          last_name: 'Demo', 
          login_source: 'systemio',
          has_platform_access: true,
          is_active: true,
          member_type_key: 'impact_member',
          subscription_status: 'active',
          primary_role_key: 'course_student'
        })
        .select()
        .single();
        
      if (profileError) {
        console.error('❌ Profile error:', profileError);
        return;
      }
      console.log('✅ Profile created:', newProfile.email);
    } else {
      console.log('✅ Profile already exists:', existingProfile.email);
    }
    
    console.log('🎯 Test user ready!');
    console.log('📧 Email:', testEmail);
    console.log('👤 Name: John Demo');
    console.log('🔑 Login source: systemio');
    console.log('');
    console.log('🧪 Test the SSO login:');
    console.log(`http://localhost:3000/api/auth/sso?email=${testEmail}&token=ibam-systeme-secret-2025`);
    
  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

createTestUser();