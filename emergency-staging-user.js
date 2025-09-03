// EMERGENCY: Create staging user for sammeee@yahoo.com
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'sb_secret_7qGEl5QH2rI90yV9mLwumA_XP040VQx'
);

async function emergencyUserSetup() {
  console.log('🚨 EMERGENCY: Creating staging user for sammeee@yahoo.com');
  console.log('🎯 Database: yhfxxouswctucxvfetcq.supabase.co (STAGING)');
  
  try {
    // 1. Create auth user if doesn't exist
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'sammeee@yahoo.com',
      email_confirm: true,
      password: 'TempPassword123!',
      user_metadata: {
        first_name: 'Sammeee',
        last_name: 'Admin'
      }
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.error('❌ Auth creation failed:', authError);
      return;
    }
    
    const userId = authUser?.user?.id || '3dd84c3a-6f72-4232-b4ef-b121f09e4f6d';
    console.log('✅ Auth user ready:', userId);
    
    // 2. Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        auth_user_id: userId,
        email: 'sammeee@yahoo.com',
        first_name: 'Sammeee',
        last_name: 'Admin',
        membership_level: 'entrepreneur',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'auth_user_id'
      })
      .select()
      .single();
      
    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return;
    }
    
    console.log('✅ User profile created:', profile.id);
    
    // 3. Test getUserProfileId logic
    const { data: testProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth_user_id', userId)
      .single();
      
    console.log('✅ getUserProfileId test result:', testProfile?.id);
    
    console.log('🎉 EMERGENCY SETUP COMPLETE!');
    console.log('👤 Email: sammeee@yahoo.com');
    console.log('🔑 Password: TempPassword123!');
    console.log('🆔 Profile ID:', testProfile?.id);
    
  } catch (error) {
    console.error('❌ Emergency setup failed:', error);
  }
}

emergencyUserSetup().catch(console.error);