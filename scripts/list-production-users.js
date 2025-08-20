#!/usr/bin/env node

// List all users in production database
const { createClient } = require('@supabase/supabase-js');

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const production = createClient(productionUrl, productionKey);

async function listUsers() {
  console.log('📋 Production Database Users:');
  console.log('=============================');
  
  try {
    const { data: users, error } = await production
      .from('user_profiles')
      .select('email, first_name, last_name, is_active, has_platform_access, login_source, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log(`📊 Total users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.first_name} ${user.last_name}`);
      console.log(`   Active: ${user.is_active}, Access: ${user.has_platform_access}`);
      console.log(`   Source: ${user.login_source || 'unknown'}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Failed to list users:', error.message);
  }
}

listUsers().catch(console.error);