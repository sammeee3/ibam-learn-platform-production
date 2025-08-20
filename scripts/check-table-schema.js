#!/usr/bin/env node

// Check user_profiles table structure
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking user_profiles table structure...');
  
  try {
    // Try to get sample record to see columns
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Table query failed:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Sample record structure:');
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample data:', data[0]);
    } else {
      console.log('⚠️ No records found in user_profiles table');
      
      // Try to insert a test record to see what columns are expected
      console.log('🧪 Testing table structure with minimal insert...');
      
      const { data: insertTest, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          email: 'test-schema@example.com',
          auth_user_id: 'test-123',
          is_active: true,
          has_platform_access: true
        })
        .select()
        .single();
        
      if (insertError) {
        console.log('❌ Insert test failed - this shows missing required columns:');
        console.log(insertError.message);
      } else {
        console.log('✅ Insert test succeeded:', insertTest);
        
        // Clean up test record
        await supabase
          .from('user_profiles')
          .delete()
          .eq('email', 'test-schema@example.com');
      }
    }
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

checkSchema().catch(console.error);