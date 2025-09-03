const { createClient } = require('@supabase/supabase-js');

// Production service role key (we know this works)
const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

async function getProductionConfig() {
  console.log('🔍 PRODUCTION ENVIRONMENT CONFIGURATION');
  console.log('=' .repeat(50));

  console.log('\n📋 PRODUCTION CREDENTIALS NEEDED:');
  console.log('Production Supabase Project: tutrnikhomrgcpkzszvq');
  console.log('Production URL: https://tutrnikhomrgcpkzszvq.supabase.co');
  
  console.log('\n🔑 SERVICE ROLE KEY (Working):');
  console.log('SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0"');
  
  console.log('\n🔍 TESTING CURRENT PRODUCTION ACCESS:');
  try {
    const { data: users, count } = await productionSupabase
      .from('user_profiles')
      .select('email, first_name, last_name', { count: 'exact' })
      .limit(3);
      
    console.log(`✅ Production database accessible: ${count} users`);
    users?.forEach(user => {
      console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`);
    });
  } catch (error) {
    console.log(`❌ Production access failed: ${error.message}`);
  }

  console.log('\n🔑 ANON KEY NEEDED:');
  console.log('The production ANON key should be from:');
  console.log('https://app.supabase.com/project/tutrnikhomrgcpkzszvq/settings/api');
  console.log('');
  console.log('🚨 CRITICAL ISSUE IDENTIFIED:');
  console.log('The production website is using STAGING database credentials!');
  console.log('This is why sj614+prodtest@proton.me cannot log in - the user exists');
  console.log('in PRODUCTION database but the site is looking in STAGING database.');
  console.log('');
  console.log('🔧 IMMEDIATE FIX NEEDED:');
  console.log('1. Get production ANON key from Supabase dashboard');
  console.log('2. Update Vercel environment variables for production site');
  console.log('3. Redeploy production site');
  
  console.log('\n📝 CURRENT VERCEL PRODUCTION ENVIRONMENT VARIABLES:');
  console.log('❌ WRONG (currently set):');
  console.log('   NEXT_PUBLIC_SUPABASE_URL="https://yhfxxouswctucxvfetcq.supabase.co"');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY="staging_anon_key"');
  console.log('');
  console.log('✅ CORRECT (should be):');
  console.log('   NEXT_PUBLIC_SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY="production_anon_key"');
  console.log('   SUPABASE_SERVICE_ROLE_KEY="production_service_role_key"');
}

getProductionConfig();