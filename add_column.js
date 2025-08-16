// Direct Supabase database column addition
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function addLoginSourceColumn() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('🔧 Adding login_source column to user_profiles...');
    
    // Add the column using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS login_source text DEFAULT 'direct';`
    });
    
    if (error) {
      console.error('❌ Error:', error);
      // Try alternative method
      console.log('🔄 Trying alternative method...');
      const { data: altData, error: altError } = await supabase
        .from('user_profiles')
        .select('login_source')
        .limit(1);
        
      if (altError && altError.message.includes('column "login_source" does not exist')) {
        console.log('✅ Column needs to be added manually in Supabase dashboard');
        console.log('Go to: https://supabase.com/dashboard/project/tutrnikhomrgcpkzszvq/editor');
        console.log('Add column: login_source, type: text, default: direct');
      } else {
        console.log('✅ Column may already exist or check failed');
      }
    } else {
      console.log('✅ Column added successfully!');
    }
    
  } catch (err) {
    console.error('💥 Exception:', err.message);
  }
}

addLoginSourceColumn();