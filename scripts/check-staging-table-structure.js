#!/usr/bin/env node

// Check what columns exist in staging user_profiles table
const { createClient } = require('@supabase/supabase-js');

const stagingUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const staging = createClient(stagingUrl, stagingKey);

async function checkTableStructure() {
  console.log('🔍 Checking staging table structure...');
  
  try {
    // Try to select from table to see what columns exist
    const { data, error } = await staging
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      
      // If table doesn't exist, try to get info from information_schema
      console.log('\n🔍 Checking if table exists via information_schema...');
      
      const { data: columns, error: columnError } = await staging
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'user_profiles');
      
      if (columnError) {
        console.error('❌ Information schema error:', columnError.message);
      } else if (columns && columns.length > 0) {
        console.log('✅ Table exists with columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type}`);
        });
      } else {
        console.log('❌ Table does not exist');
      }
      
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Table exists with sample data:');
      console.log('📋 Columns:', Object.keys(data[0]));
      console.log('📋 Sample record:', data[0]);
    } else {
      console.log('✅ Table exists but is empty');
      console.log('📋 Will need to add sample record to see structure');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

async function addTestRecord() {
  console.log('\n🔧 Adding test record to see table structure...');
  
  try {
    const { data, error } = await staging
      .from('user_profiles')
      .insert({
        email: 'test-structure-check@example.com',
        is_active: true,
        has_platform_access: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert failed:', error.message);
      console.log('This helps us understand what columns are missing or incorrectly named');
    } else {
      console.log('✅ Test record created:');
      console.log('📋 Available columns:', Object.keys(data));
      
      // Clean up test record
      await staging
        .from('user_profiles')
        .delete()
        .eq('email', 'test-structure-check@example.com');
      
      console.log('🧹 Test record cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test record failed:', error.message);
  }
}

async function main() {
  console.log('🚀 STAGING TABLE STRUCTURE ANALYSIS');
  console.log('====================================');
  
  await checkTableStructure();
  await addTestRecord();
}

main().catch(console.error);