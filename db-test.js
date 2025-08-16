const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testTables() {
  console.log('🔍 Testing database tables...\n');
  
  const tables = ['modules', 'sessions', 'user_profiles', 'discipleship_responses', 'scripture_verses'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table}: DOES NOT EXIST`);
      } else {
        console.log(`✅ ${table}: EXISTS`);
        if (data.length > 0) {
          console.log(`   📊 Has data: ${data.length} rows found`);
        } else {
          console.log(`   📋 Table is empty`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`);
    }
  }
}

testTables();
