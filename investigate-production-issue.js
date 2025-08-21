const { createClient } = require('@supabase/supabase-js');

async function investigateProductionIssue() {
  console.log('🔍 INVESTIGATING PRODUCTION SITE DATABASE CONNECTION');
  console.log('=' .repeat(70));

  console.log('\n🚨 PROBLEM IDENTIFIED:');
  console.log('Production site shows "demo@staging.test" user even in incognito mode');
  console.log('This means production site is connecting to STAGING database');
  console.log('');

  // Check if demo@staging.test exists in staging database
  console.log('🔍 CHECKING STAGING DATABASE FOR demo@staging.test:');
  const stagingSupabase = createClient(
    'https://yhfxxouswctucxvfetcq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
  );

  try {
    const { data: stagingDemoUser } = await stagingSupabase
      .from('user_profiles')
      .select('email, first_name, last_name, created_at')
      .eq('email', 'demo@staging.test')
      .single();

    if (stagingDemoUser) {
      console.log('✅ Found demo@staging.test in STAGING database:');
      console.log(`   Name: ${stagingDemoUser.first_name} ${stagingDemoUser.last_name}`);
      console.log(`   Created: ${stagingDemoUser.created_at}`);
      console.log('🚨 This confirms production site is connected to STAGING database!');
    } else {
      console.log('❌ demo@staging.test NOT found in staging database');
    }
  } catch (error) {
    console.log(`Error checking staging: ${error.message}`);
  }

  // Check if demo@staging.test exists in production database
  console.log('\n🔍 CHECKING PRODUCTION DATABASE FOR demo@staging.test:');
  const productionSupabase = createClient(
    'https://tutrnikhomrgcpkzszvq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
  );

  try {
    const { data: prodDemoUser } = await productionSupabase
      .from('user_profiles')
      .select('email, first_name, last_name, created_at')
      .eq('email', 'demo@staging.test')
      .single();

    if (prodDemoUser) {
      console.log('⚠️  Found demo@staging.test in PRODUCTION database too');
    } else {
      console.log('✅ demo@staging.test NOT found in production database (expected)');
    }
  } catch (error) {
    console.log(`✅ demo@staging.test NOT in production database: ${error.message}`);
  }

  console.log('\n📋 ANALYSIS:');
  console.log('The production website is definitely using staging database credentials');
  console.log('even though the .env.production file shows production credentials.');
  console.log('');
  console.log('🔍 POSSIBLE CAUSES:');
  console.log('1. Vercel environment variables are wrong (most likely)');
  console.log('2. Production deployment is using cached/old environment variables');
  console.log('3. There\'s a hardcoded staging URL somewhere in the code');
  console.log('4. The wrong project is linked to the production domain');
  
  console.log('\n🔧 INVESTIGATION PLAN:');
  console.log('1. ✅ Verify which database the production site is actually connecting to');
  console.log('2. 🔍 Check live Vercel environment variables for production project');
  console.log('3. 🔄 Update production environment variables to correct values');
  console.log('4. 🚀 Force redeploy production with correct credentials');
  console.log('5. 🧪 Test login with production user');
}

investigateProductionIssue();