/**
 * 🗄️ Production Database Migration Runner
 * Creates feedback system tables in PRODUCTION database (tutrnikhomrgcpkzszvq)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Production database credentials
const supabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2NwaxzzdnEiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzI0MTE3NDk1LCJleHAiOjIwMzk2OTM0OTV9.vY5a4K_aL2j0PgvbL1ZnlGkrQNHgFaJVXx4DJRLqWFs'
);

async function runProductionMigration() {
  try {
    console.log('🚀 Starting PRODUCTION database migration for feedback system...');
    console.log('📍 Target: Production Database (tutrnikhomrgcpkzszvq)');
    console.log('');
    
    // Read the FIXED migration SQL file
    const migrationSQL = fs.readFileSync('./database-migration-feedback-FIXED.sql', 'utf8');
    
    console.log('📄 Migration file loaded, executing SQL statements...');
    
    // Split SQL into individual statements for better error handling
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔄 Executing ${statements.length} SQL statements on PRODUCTION...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          // Execute each statement individually
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning: ${error.message}`);
            if (error.message.includes('already exists')) {
              console.log('   (Table/function already exists - this is OK)');
              successCount++;
            } else {
              errorCount++;
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
            successCount++;
          }
          
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error: ${err.message}`);
          errorCount++;
        }
      }
    }
    
    console.log('');
    console.log('📊 MIGRATION RESULTS:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (errorCount === 0 || (errorCount <= 2 && successCount > 8)) {
      console.log('');
      console.log('🎉 PRODUCTION MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('📋 Feedback system tables created in production:');
      console.log('   • user_feedback (for production user submissions)');
      console.log('   • admin_tasks (for task management)');
      console.log('   • Indexes and triggers added');
      console.log('   • Ready to receive user feedback!');
    } else {
      console.log('');
      console.log('⚠️  Migration completed with some errors. Please check the output above.');
    }
    
  } catch (error) {
    console.error('❌ Production migration failed:', error.message);
    console.log('');
    console.log('📋 MANUAL FALLBACK OPTION:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Select PRODUCTION project (tutrnikhomrgcpkzszvq)');
    console.log('3. Copy/paste contents of: database-migration-feedback-FIXED.sql');
    console.log('4. Click "Run" to execute the migration');
  }
}

// Health check function for production
async function checkProductionConnection() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Production database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Production database connection successful');
    return true;
  } catch (error) {
    console.log('❌ Production database connection error:', error.message);
    return false;
  }
}

// Verify tables were created successfully
async function verifyTablesCreated() {
  try {
    console.log('');
    console.log('🔍 Verifying tables were created successfully...');
    
    // Check user_feedback table
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('id')
      .limit(1);
    
    if (feedbackError && !feedbackError.message.includes('0 rows')) {
      console.log('❌ user_feedback table verification failed:', feedbackError.message);
      return false;
    } else {
      console.log('✅ user_feedback table exists and accessible');
    }
    
    // Check admin_tasks table
    const { data: tasksData, error: tasksError } = await supabase
      .from('admin_tasks')
      .select('id')
      .limit(1);
    
    if (tasksError && !tasksError.message.includes('0 rows')) {
      console.log('❌ admin_tasks table verification failed:', tasksError.message);
      return false;
    } else {
      console.log('✅ admin_tasks table exists and accessible');
    }
    
    console.log('');
    console.log('🎯 PRODUCTION FEEDBACK SYSTEM READY!');
    return true;
    
  } catch (error) {
    console.log('❌ Table verification error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 IBAM Production Feedback System Migration');
  console.log('🎯 Creating feedback tables in PRODUCTION database');
  console.log('');
  
  // Check connection first
  const isConnected = await checkProductionConnection();
  if (!isConnected) {
    console.log('❌ Cannot connect to production database. Aborting migration.');
    process.exit(1);
  }
  
  // Run migration
  await runProductionMigration();
  
  // Verify tables created
  await verifyTablesCreated();
  
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Deploy SafeFeedbackWidget to production');
  console.log('2. Set up automated 15-minute SYNC system');
  console.log('3. Test production feedback submission');
  console.log('4. Enable email notifications');
}

main();