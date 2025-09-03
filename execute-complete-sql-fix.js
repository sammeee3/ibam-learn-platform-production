// Execute the complete SQL fix to add ALL missing columns
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'sb_secret_7qGEl5QH2rI90yV9mLwumA_XP040VQx'
);

async function executeCompleteFix() {
  console.log('🔧 EXECUTING COMPLETE SQL FIX...');
  
  const sqlCommands = [
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS person_to_tell TEXT;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS generated_statement TEXT;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS timed TEXT;", // THE MISSING ONE!
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS specific_action TEXT;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred_at TIMESTAMP;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;",
    "ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancel_reason TEXT;"
  ];
  
  for (let i = 0; i < sqlCommands.length; i++) {
    const sql = sqlCommands[i];
    console.log(`Executing ${i + 1}/${sqlCommands.length}: ${sql}`);
    
    try {
      const { error } = await supabase.rpc('exec', { sql });
      if (error) {
        console.log(`❌ Command failed: ${error.message}`);
      } else {
        console.log('✅ Success');
      }
    } catch (err) {
      // Try alternative method since RPC might not exist
      console.log('RPC failed, trying direct approach...');
      // We'll need to run these manually in Supabase
    }
  }
  
  console.log('\n🧪 Testing insert again...');
  const testData = {
    user_id: 4,
    module_id: 1,
    session_id: 1,
    action_type: 'discipleship',
    specific_action: 'I will test',
    timed: 'today',
    generated_statement: 'I will test today',
    person_to_tell: 'John',
    completed: false,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('user_action_steps')
    .upsert(testData)
    .select();
    
  if (error) {
    console.error('❌ Still failing:', error.message);
  } else {
    console.log('✅ SUCCESS! Insert worked:', data);
  }
}

executeCompleteFix().catch(console.error);