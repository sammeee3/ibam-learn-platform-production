// Check if login_source column exists
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkColumn() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('🔍 Checking if login_source column exists...');
    
    // Try to select the column - if it fails, column doesn't exist
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email, login_source')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "login_source" does not exist')) {
        console.log('❌ Column login_source does NOT exist');
        console.log('📝 You need to add it manually in Supabase dashboard:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/tutrnikhomrgcpkzszvq/editor');
        console.log('   2. Click user_profiles table');
        console.log('   3. Add column: name=login_source, type=text, default=direct');
        return false;
      } else {
        console.log('❓ Other error:', error.message);
        return false;
      }
    } else {
      console.log('✅ Column login_source already EXISTS!');
      console.log('📊 Sample data:', data);
      return true;
    }
    
  } catch (err) {
    console.error('💥 Exception:', err.message);
    return false;
  }
}

checkColumn();