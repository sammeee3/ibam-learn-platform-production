#!/usr/bin/env node

// Migrate specific user from production to staging
const { createClient } = require('@supabase/supabase-js');

// Database connections
const stagingUrl = 'https://yhfxxouswctucxvfetcq.supabase.co';
const stagingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM';

const productionUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const productionKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';

const staging = createClient(stagingUrl, stagingKey);
const production = createClient(productionUrl, productionKey);

async function migrateUser(email) {
  console.log(`🔄 Migrating user ${email} from production to staging...`);
  
  try {
    // Get user from production
    const { data: prodUser, error: prodError } = await production
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (prodError || !prodUser) {
      console.log(`❌ User not found in production: ${email}`);
      return false;
    }
    
    console.log(`✅ Found user in production:`, {
      email: prodUser.email,
      first_name: prodUser.first_name,
      is_active: prodUser.is_active,
      has_platform_access: prodUser.has_platform_access
    });
    
    // Create minimal user profile in staging
    const { data: newUser, error: createError } = await staging
      .from('user_profiles')
      .insert({
        auth_user_id: prodUser.auth_user_id,
        email: prodUser.email,
        first_name: prodUser.first_name || 'User',
        last_name: prodUser.last_name || '',
        is_active: true,
        has_platform_access: true,
        created_via_webhook: false,
        login_source: 'migrated_from_production'
      })
      .select()
      .single();
    
    if (createError) {
      console.error(`❌ Failed to create user in staging:`, createError.message);
      return false;
    }
    
    console.log(`✅ User migrated to staging successfully!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Migration failed:`, error.message);
    return false;
  }
}

async function main() {
  const email = process.argv[2] || 'sj614+prodtest@proton.me';
  console.log(`🚀 Starting migration for: ${email}`);
  
  const success = await migrateUser(email);
  
  if (success) {
    console.log(`\n🎉 Migration complete! User ${email} can now login to staging.`);
  } else {
    console.log(`\n❌ Migration failed for ${email}`);
  }
}

main().catch(console.error);