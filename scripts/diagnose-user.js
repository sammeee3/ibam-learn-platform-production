#!/usr/bin/env node

// Quick diagnostic script to check user state
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('SUPABASE_URL exists:', !!supabaseUrl);
  console.log('SUPABASE_KEY exists:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseUser(email) {
  console.log(`🔍 Diagnosing user: ${email}`);
  
  // Check auth users
  try {
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers.users.find(u => u.email === email);
    
    if (authUser) {
      console.log('✅ Auth user exists:', {
        id: authUser.id,
        email: authUser.email,
        email_confirmed_at: authUser.email_confirmed_at,
        created_at: authUser.created_at
      });
    } else {
      console.log('❌ Auth user NOT found');
    }
  } catch (error) {
    console.error('❌ Auth user check failed:', error.message);
  }
  
  // Check user profiles
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profile) {
      console.log('✅ User profile exists:', {
        id: profile.id,
        email: profile.email,
        is_active: profile.is_active,
        has_platform_access: profile.has_platform_access,
        created_via_webhook: profile.created_via_webhook,
        auth_user_id: profile.auth_user_id
      });
    } else {
      console.log('❌ User profile NOT found');
      if (error) console.log('Profile error:', error.message);
    }
  } catch (error) {
    console.error('❌ Profile check failed:', error.message);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node diagnose-user.js <email>');
  process.exit(1);
}

diagnoseUser(email).catch(console.error);