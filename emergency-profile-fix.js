// EMERGENCY: Fix profile for sammeee@yahoo.com in staging
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'sb_secret_7qGEl5QH2rI90yV9mLwumA_XP040VQx'
);

async function emergencyProfileFix() {
  console.log('🚨 EMERGENCY: Fixing profile for sammeee@yahoo.com');
  
  const authUserId = '3dd84c3a-6f72-4232-b4ef-b121f09e4f6d';
  const userEmail = 'sammeee@yahoo.com';
  
  try {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', userEmail)
      .single();
      
    if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile.id);
      console.log('🎯 Profile ID for getUserProfileId:', existingProfile.id);
      return;
    }
    
    // Profile doesn't exist, create it
    const { data: newProfile, error } = await supabase
      .from('user_profiles')
      .insert({
        auth_user_id: authUserId,
        email: userEmail,
        first_name: 'Sammeee',
        last_name: 'Admin',
        membership_level: 'entrepreneur',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Profile creation failed:', error);
      return;
    }
    
    console.log('✅ Profile created:', newProfile.id);
    console.log('🎯 Profile ID for getUserProfileId:', newProfile.id);
    
  } catch (error) {
    console.error('❌ Emergency profile fix failed:', error);
  }
}

emergencyProfileFix().catch(console.error);