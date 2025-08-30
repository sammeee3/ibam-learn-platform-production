// Execute database schema fixes for action system
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'sb_secret_7qGEl5QH2rI90yV9mLwumA_XP040VQx'
);

async function executeSchemaFixes() {
  console.log('🔧 EXECUTING DATABASE SCHEMA FIXES IN STAGING');
  console.log('🎯 Database: yhfxxouswctucxvfetcq.supabase.co (STAGING)');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  const fixes = [
    {
      name: 'Add person_to_tell column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS person_to_tell TEXT;`
    },
    {
      name: 'Add generated_statement column', 
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS generated_statement TEXT;`
    },
    {
      name: 'Add completed_at column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;`
    },
    {
      name: 'Add deferred column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred BOOLEAN DEFAULT FALSE;`
    },
    {
      name: 'Add deferred_at column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred_at TIMESTAMP;`
    },
    {
      name: 'Add cancelled column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled BOOLEAN DEFAULT FALSE;`
    },
    {
      name: 'Add cancelled_at column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;`
    },
    {
      name: 'Add cancel_reason column',
      sql: `ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancel_reason TEXT;`
    }
  ];
  
  console.log(`\n📋 Executing ${fixes.length} schema fixes...`);
  
  for (const fix of fixes) {
    console.log(`\n🔨 ${fix.name}...`);
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: fix.sql
    });
    
    if (error) {
      console.error(`❌ Failed: ${error.message}`);
    } else {
      console.log(`✅ Success`);
    }
  }
  
  // Verify table structure after changes
  console.log('\n🔍 Verifying table structure...');
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'user_action_steps' 
          ORDER BY ordinal_position;`
  });
  
  if (error) {
    console.error('❌ Schema verification failed:', error);
  } else {
    console.log('📊 Final schema:');
    console.table(data);
  }
}

executeSchemaFixes().catch(console.error);