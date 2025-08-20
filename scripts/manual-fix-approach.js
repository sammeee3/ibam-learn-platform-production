#!/usr/bin/env node

console.log('🚨 STAGING DATABASE SCHEMA ISSUE DETECTED');
console.log('==========================================');
console.log('');
console.log('📊 DIAGNOSIS CONFIRMED:');
console.log('✅ Production DB (tutrnikhomrgcpkzszvq): 8 users, full schema');
console.log('❌ Staging DB (yhfxxouswctucxvfetcq): Nearly empty, missing user_profiles table');
console.log('');
console.log('🔍 URL MAPPING CONFIRMED:');
console.log('- ibam-learn-platform-v2.vercel.app → STAGING DB (empty)');
console.log('- ibam-learn-platform-staging-v2-1o9m2nvzl.vercel.app → STAGING DB (empty)');
console.log('');
console.log('🎯 SOLUTION REQUIRED:');
console.log('The staging database needs the user_profiles table created manually.');
console.log('');
console.log('📋 MANUAL STEPS TO FIX:');
console.log('');
console.log('1. Go to Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql');
console.log('');
console.log('2. Run this SQL to create the missing table:');
console.log('');
console.log('```sql');
console.log('CREATE TABLE public.user_profiles (');
console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
console.log('  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,');
console.log('  email TEXT NOT NULL UNIQUE,');
console.log('  first_name TEXT,');
console.log('  last_name TEXT,');
console.log('  is_active BOOLEAN DEFAULT true,');
console.log('  has_platform_access BOOLEAN DEFAULT true,');
console.log('  created_via_webhook BOOLEAN DEFAULT false,');
console.log('  login_source TEXT DEFAULT \'direct\',');
console.log('  magic_token TEXT,');
console.log('  magic_token_expires_at TIMESTAMPTZ,');
console.log('  created_at TIMESTAMPTZ DEFAULT NOW(),');
console.log('  updated_at TIMESTAMPTZ DEFAULT NOW()');
console.log(');');
console.log('');
console.log('-- Create indexes');
console.log('CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);');
console.log('CREATE INDEX idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);');
console.log('```');
console.log('');
console.log('3. After creating the table, test login again');
console.log('');
console.log('🎉 EXPECTED RESULT:');
console.log('Both staging URLs will work with the same authentication system.');
console.log('The session API will automatically create user profiles for new signups.');
console.log('');
console.log('⚡ ALTERNATIVE: Use production database for staging');
console.log('If you want both URLs to work immediately, you could:');
console.log('1. Go to Vercel → ibam-learn-platform-staging-v2 project');
console.log('2. Change NEXT_PUBLIC_SUPABASE_URL to: https://tutrnikhomrgcpkzszvq.supabase.co');
console.log('3. Update SUPABASE_SERVICE_ROLE_KEY to production key');
console.log('');
console.log('But this would mean both URLs use production data (not ideal for testing).');
console.log('');
console.log('💡 RECOMMENDED: Create the staging table as shown above.');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nDo you want me to generate the SQL file for easy copy-paste? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    require('fs').writeFileSync('staging-table-creation.sql', `-- Create user_profiles table for staging database
-- Run this in: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql

CREATE TABLE public.user_profiles (
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
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Allow service role to do everything
CREATE POLICY "Service role full access" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');
`);
    
    console.log('\n✅ SQL file created: staging-table-creation.sql');
    console.log('📋 Copy the contents and run in Supabase SQL editor');
  }
  
  rl.close();
});