#!/usr/bin/env node

/**
 * List all users in the staging database
 * This script queries both user_profiles and auth.users tables
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please check .env.local file has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllUsers() {
  console.log('🔍 Querying staging database for all users...');
  console.log('Database:', supabaseUrl);
  console.log('=====================================\n');

  try {
    // Query user_profiles table
    console.log('📋 USER PROFILES TABLE:');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        email, 
        first_name,
        last_name,
        member_type_key,
        primary_role_key,
        has_platform_access,
        is_active,
        created_at,
        magic_token
      `)
      .order('created_at', { ascending: false });

    if (profileError) {
      console.error('Error querying user_profiles:', profileError);
    } else if (profiles && profiles.length > 0) {
      console.log(`Found ${profiles.length} users in user_profiles:`);
      
      profiles.forEach((user, index) => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name';
        const magicToken = user.magic_token ? 'Yes' : 'No';
        const access = user.has_platform_access ? 'Yes' : 'No';
        const active = user.is_active ? 'Active' : 'Inactive';
        
        console.log(`${index + 1}. ${fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Type: ${user.member_type_key || 'Unknown'}`);
        console.log(`   Role: ${user.primary_role_key || 'Unknown'}`);
        console.log(`   Access: ${access} | Status: ${active}`);
        console.log(`   Magic Token: ${magicToken}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log('   ---');
      });
    } else {
      console.log('No users found in user_profiles table');
    }

    console.log('\n=====================================');

    // Query auth.users table (service role required)
    console.log('👤 AUTH USERS TABLE:');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error querying auth.users:', authError);
    } else if (authUsers?.users && authUsers.users.length > 0) {
      console.log(`Found ${authUsers.users.length} users in auth.users:`);
      
      authUsers.users.forEach((user, index) => {
        const email = user.email || 'No email';
        const confirmed = user.email_confirmed_at ? 'Confirmed' : 'Unconfirmed';
        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';
        
        console.log(`${index + 1}. ${email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Status: ${confirmed}`);
        console.log(`   Last Sign In: ${lastSignIn}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log('   ---');
      });
    } else {
      console.log('No users found in auth.users table');
    }

    console.log('\n=====================================');

    // Summary
    const profileCount = profiles ? profiles.length : 0;
    const authCount = authUsers?.users ? authUsers.users.length : 0;
    
    console.log('📊 SUMMARY:');
    console.log(`User Profiles: ${profileCount}`);
    console.log(`Auth Users: ${authCount}`);
    
    if (profileCount !== authCount) {
      console.log('⚠️  Mismatch detected between user_profiles and auth.users');
      console.log('   This may indicate incomplete user accounts or cleanup needed');
    } else {
      console.log('✅ User counts match between tables');
    }

  } catch (error) {
    console.error('❌ Database query failed:', error);
    process.exit(1);
  }
}

// Run the query
listAllUsers().then(() => {
  console.log('\n✅ User listing complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});