const { createClient } = require('@supabase/supabase-js');

// Test the exact user creation flow that the webhook should use
const supabaseUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate what the webhook should do
async function simulateWebhookUserCreation() {
  console.log('🔧 SIMULATING WEBHOOK USER CREATION');
  console.log('=' .repeat(50));

  // Test with one of the users that failed to create
  const courseAssignment = {
    email: 'pastor.john@testchurch.com',
    name: 'John Pastor',
    assignedCourse: {
      courseId: 'church-leadership-101',
      courseName: 'Church Leadership Fundamentals'
    }
  };

  try {
    console.log('🔄 Starting user creation process...');
    console.log(`📧 Email: ${courseAssignment.email}`);
    console.log(`👤 Name: ${courseAssignment.name}`);

    // Step 1: Check if auth user exists
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    let authUser = authUsers.users.find(user => user.email === courseAssignment.email);

    if (!authUser) {
      console.log('1️⃣ Creating auth user...');
      
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email: courseAssignment.email,
        email_confirm: true,
        user_metadata: {
          name: courseAssignment.name,
          created_via_webhook: true,
          course: courseAssignment.assignedCourse.courseName
        }
      });

      if (authError) {
        console.log('❌ Auth user creation failed:', authError);
        return false;
      }

      authUser = newAuthUser.user;
      console.log('✅ Auth user created:', authUser.id);
    } else {
      console.log('ℹ️  Auth user already exists:', authUser.id);
    }

    // Step 2: Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', courseAssignment.email)
      .single();

    if (!existingProfile) {
      console.log('2️⃣ Creating user profile...');

      // Generate magic token
      const crypto = require('crypto');
      const magicToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create profile with minimal required fields
      const profileData = {
        auth_user_id: authUser.id,
        email: courseAssignment.email,
        first_name: courseAssignment.name.split(' ')[0] || 'User',
        last_name: courseAssignment.name.split(' ').slice(1).join(' ') || '',
        has_platform_access: true,
        is_active: true,
        created_via_webhook: true,
        login_source: 'systemio',
        magic_token: magicToken,
        magic_token_expires_at: tokenExpiry.toISOString()
      };

      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.log('❌ Profile creation failed:', profileError);
        return false;
      }

      console.log('✅ Profile created:', newProfile.id);
      console.log('🎫 Magic token:', magicToken.substring(0, 16) + '...');

    } else {
      console.log('ℹ️  Profile already exists:', existingProfile.id);
    }

    console.log('✅ User creation process completed successfully!');
    return true;

  } catch (error) {
    console.log('💥 User creation failed:', error);
    return false;
  }
}

async function fixAllPendingUsers() {
  console.log('\n🔧 FIXING ALL PENDING WEBHOOK USERS');
  console.log('=' .repeat(50));

  const pendingUsers = [
    { email: 'pastor.john@testchurch.com', name: 'John Pastor' },
    { email: 'member.sarah@ibamtest.com', name: 'Sarah Entrepreneur' },
    { email: 'staging.test@webhook.demo', name: 'Staging Tester' }
  ];

  for (const user of pendingUsers) {
    console.log(`\n👤 Processing: ${user.name} (${user.email})`);
    
    const success = await simulateWebhookUserCreation({
      email: user.email,
      name: user.name,
      assignedCourse: { courseName: 'Test Course' }
    });

    if (success) {
      console.log(`✅ ${user.email} - User created successfully`);
    } else {
      console.log(`❌ ${user.email} - User creation failed`);
    }
  }

  // Final verification
  const { data: allUsers } = await supabase.from('user_profiles').select('email, first_name, last_name, created_via_webhook');
  
  console.log('\n📊 FINAL USER LIST:');
  allUsers.forEach((user, i) => {
    const source = user.created_via_webhook ? '🤖 Webhook' : '👤 Direct';
    console.log(`${i + 1}. ${user.email} - ${user.first_name || 'No'} ${user.last_name || 'name'} ${source}`);
  });
}

// Run the fix
simulateWebhookUserCreation().then(() => {
  console.log('\nNow fixing all pending users...');
  return fixAllPendingUsers();
});