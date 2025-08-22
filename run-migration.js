/**
 * 🗄️ Database Migration Runner
 * Safely runs the feedback system migration on staging database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Staging database credentials
const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDExNzgxMCwiZXhwIjoyMDM5NjkzODEwfQ.FxJWkqR7nIXiIrfYSHUJGKHJF-lIgqbPaOKgNH_J6VA'
);

async function runMigration() {
  try {
    console.log('🗄️ Starting database migration for feedback system...');
    
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('./database-migration-feedback.sql', 'utf8');
    
    console.log('📄 Migration file loaded, executing SQL...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      
      // Try alternative approach - split into individual statements
      console.log('🔄 Trying alternative approach...');
      await runMigrationStatements(migrationSQL);
      
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('📋 Feedback system tables created:');
      console.log('   • user_feedback (for production user submissions)');
      console.log('   • admin_tasks (for staging task management)');
      console.log('   • Indexes and triggers added');
    }
    
  } catch (error) {
    console.error('❌ Migration script failed:', error.message);
    console.log('\n📋 MANUAL FALLBACK OPTION:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Select staging project (yhfxxouswctucxvfetcq)');
    console.log('3. Copy/paste contents of: database-migration-feedback.sql');
    console.log('4. Click "Run" to execute the migration');
  }
}

async function runMigrationStatements(sql) {
  try {
    // Split SQL into individual statements and execute one by one
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔄 Executing ${statements.length} individual SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (error) {
            console.log(`⚠️ Statement ${i + 1} failed: ${error.message}`);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️ Statement ${i + 1} error: ${err.message}`);
        }
      }
    }
    
    console.log('🎯 Migration attempt completed!');
    
  } catch (error) {
    console.error('❌ Alternative migration approach failed:', error);
  }
}

// Health check function
async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 IBAM Feedback System Migration Tool');
  console.log('📍 Target: Staging Database (yhfxxouswctucxvfetcq)');
  console.log('');
  
  // Check connection first
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.log('❌ Cannot connect to staging database. Aborting migration.');
    process.exit(1);
  }
  
  // Run migration
  await runMigration();
  
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Test feedback system: Visit staging.../admin/feedback');
  console.log('2. Test SYNC command: Type "SYNC" in Claude');
  console.log('3. Test production feedback: Submit via 💬 BETA button');
}

main();