#!/usr/bin/env node

// Create user profile for existing auth user
const { createClient } = require('@supabase/supabase-js');

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const production = createClient(productionUrl, productionKey);

async function createProfileForExistingUser(email) {
  console.log(`🔧 Creating profile for existing auth user: ${email}`);
  
  try {
    // Get auth user
    const { data: authUsers } = await production.auth.admin.listUsers();
    const authUser = authUsers.users.find(u => u.email === email);
    
    if (!authUser) {
      console.log(`❌ Auth user not found: ${email}`);
      return false;
    }
    
    console.log(`✅ Found auth user: ${authUser.id}`);
    console.log(`   Email confirmed: ${!!authUser.email_confirmed_at}`);
    
    // Check if profile already exists
    const { data: existingProfile } = await production
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log(`✅ User profile already exists: ${existingProfile.id}`);
      return true;
    }
    
    // Create user profile
    const { data: newProfile, error: profileError } = await production
      .from('user_profiles')
      .insert({
        auth_user_id: authUser.id,
        email: email,
        first_name: 'Jeff',
        last_name: 'ProdTest',
        is_active: true,
        has_platform_access: true,
        created_via_webhook: false,
        login_source: 'test_signup'
      })
      .select()
      .single();
    
    if (profileError) {
      console.error(`❌ Profile creation failed:`, profileError.message);
      return false;
    }
    
    console.log(`✅ User profile created: ${newProfile.id}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return false;
  }
}

async function main() {
  const email = 'sj614+prodtest@proton.me';
  const success = await createProfileForExistingUser(email);
  
  if (success) {
    console.log(`\n🎉 Profile created! User can now login to production URLs.`);
    console.log(`Next step: Create user in staging database for staging URLs.`);
  }
}

main().catch(console.error);