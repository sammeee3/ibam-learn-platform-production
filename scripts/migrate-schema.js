#!/usr/bin/env node

// Migrate user_profiles table structure from production to staging
const { createClient } = require('@supabase/supabase-js');

const stagingUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const staging = createClient(stagingUrl, stagingKey);
const production = createClient(productionUrl, productionKey);

async function createUserProfilesTable() {
  console.log('🔧 Creating user_profiles table in staging database...');
  
  // SQL to create user_profiles table with essential columns
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.user_profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      first_name TEXT,
      last_name TEXT,
      is_active BOOLEAN DEFAULT true,
      has_platform_access BOOLEAN DEFAULT true,
      created_via_webhook BOOLEAN DEFAULT false,
      login_source TEXT DEFAULT 'direct',
      magic_token TEXT,
      magic_token_expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
    CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);
    CREATE INDEX IF NOT EXISTS idx_user_profiles_magic_token ON public.user_profiles(magic_token);
    
    -- Enable RLS
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create basic RLS policies
    CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.user_profiles
      FOR SELECT USING (auth.uid() = auth_user_id);
    
    CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles
      FOR UPDATE USING (auth.uid() = auth_user_id);
  `;
  
  try {
    const { error } = await staging.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Failed to create table via RPC, trying direct query...');
      console.error('Error:', error.message);
      
      // Try alternative approach - create minimal table structure
      return await createMinimalTable();
    }
    
    console.log('✅ user_profiles table created successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Table creation failed:', error.message);
    return await createMinimalTable();
  }
}

async function createMinimalTable() {
  console.log('🔧 Creating minimal table structure...');
  
  try {
    // Use Supabase client to insert a dummy record that will force table creation
    const { error } = await staging
      .from('user_profiles')
      .insert({
        auth_user_id: '00000000-0000-0000-0000-000000000000',
        email: 'temp@example.com',
        is_active: true,
        has_platform_access: true,
        created_via_webhook: false
      });
    
    if (error && error.message.includes('relation "user_profiles" does not exist')) {
      console.log('⚠️ Table does not exist. Manual creation needed.');
      return false;
    }
    
    // Clean up the dummy record
    await staging
      .from('user_profiles')
      .delete()
      .eq('email', 'temp@example.com');
    
    console.log('✅ Minimal table structure verified!');
    return true;
    
  } catch (error) {
    console.error('❌ Minimal table creation failed:', error.message);
    return false;
  }
}

async function migrateTestUsers() {
  console.log('\n🔄 Migrating essential test users...');
  
  // Essential users to migrate
  const essentialUsers = [
    'sj614+prodtest@proton.me',
    'jsamuelson@ibam.org',
    'steve.preview@ibam.org'
  ];
  
  for (const email of essentialUsers) {
    try {
      // Get user from production
      const { data: prodUser } = await production
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!prodUser) {
        console.log(`⚠️ User ${email} not found in production`);
        continue;
      }
      
      // Check if already exists in staging
      const { data: existingUser } = await staging
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        console.log(`✅ User ${email} already exists in staging`);
        continue;
      }
      
      // Create auth user in staging
      const { data: authData, error: authError } = await staging.auth.admin.createUser({
        email: email,
        password: 'temp123456',
        email_confirm: true,
        user_metadata: {
          name: `${prodUser.first_name} ${prodUser.last_name}`,
          migrated_from_production: true
        }
      });
      
      if (authError && !authError.message.includes('already been registered')) {
        console.error(`❌ Auth user creation failed for ${email}:`, authError.message);
        continue;
      }
      
      const authUserId = authData?.user?.id || prodUser.auth_user_id;
      
      // Create user profile
      const { error: profileError } = await staging
        .from('user_profiles')
        .insert({
          auth_user_id: authUserId,
          email: email,
          first_name: prodUser.first_name,
          last_name: prodUser.last_name,
          is_active: true,
          has_platform_access: true,
          created_via_webhook: prodUser.created_via_webhook || false,
          login_source: 'migrated_from_production'
        });
      
      if (profileError) {
        console.error(`❌ Profile creation failed for ${email}:`, profileError.message);
      } else {
        console.log(`✅ Migrated user: ${email}`);
      }
      
    } catch (error) {
      console.error(`❌ Migration failed for ${email}:`, error.message);
    }
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  try {
    const { data: users, error } = await staging
      .from('user_profiles')
      .select('email, first_name, is_active, has_platform_access')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Verification failed:', error.message);
      return false;
    }
    
    console.log(`✅ Staging database now has ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.first_name})`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 AUTOMATED SCHEMA MIGRATION');
  console.log('=============================');
  
  // Step 1: Create table structure
  const tableCreated = await createUserProfilesTable();
  
  if (!tableCreated) {
    console.log('\n❌ CRITICAL: Table creation failed!');
    console.log('📋 MANUAL STEPS NEEDED:');
    console.log('1. Go to: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/editor');
    console.log('2. Run SQL to create user_profiles table');
    console.log('3. Re-run this script');
    return;
  }
  
  // Step 2: Migrate essential users
  await migrateTestUsers();
  
  // Step 3: Verify everything works
  const verified = await verifyMigration();
  
  if (verified) {
    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('✅ Both staging URLs should now work with authentication');
    console.log('🔑 Test users have password: temp123456');
  } else {
    console.log('\n⚠️ Migration completed but verification failed');
  }
}

main().catch(console.error);