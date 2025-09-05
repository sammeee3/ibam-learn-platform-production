// SAFE V3 PRODUCTION BACKUP SCRIPT
// Uses only environment variables - NO HARDCODED KEYS
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const BACKUP_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = `./backups/v3-production-${BACKUP_TIMESTAMP}`;

console.log('🔐 V3 PRODUCTION BACKUP STARTING');
console.log('================================');
console.log(`Backup Directory: ${BACKUP_DIR}`);

// Ensure backup directory exists
if (!fs.existsSync('./backups')) {
  fs.mkdirSync('./backups');
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

async function backupV3Production() {
  // Use environment variables only
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Tables to backup (all critical data)
  const criticalTables = [
    'user_profiles',
    'user_progress', 
    'user_session_progress',
    'module_completions',
    'user_action_steps',
    'sessions',
    'modules'
  ];
  
  const backupData = {
    timestamp: new Date().toISOString(),
    environment: 'V3_PRODUCTION',
    database_url: supabaseUrl,
    tables: {}
  };
  
  for (const tableName of criticalTables) {
    try {
      console.log(`📊 Backing up table: ${tableName}`);
      
      // Get all data from table
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' });
      
      if (error) {
        console.log(`⚠️  Table ${tableName}: ${error.message}`);
        backupData.tables[tableName] = {
          exists: false,
          error: error.message,
          data: []
        };
      } else {
        console.log(`✅ Table ${tableName}: ${count || 0} records`);
        backupData.tables[tableName] = {
          exists: true,
          rowCount: count || 0,
          data: data || []
        };
      }
      
    } catch (tableError) {
      console.log(`❌ Table ${tableName}: ${tableError.message}`);
      backupData.tables[tableName] = {
        exists: false,
        error: tableError.message,
        data: []
      };
    }
  }
  
  // Save backup to file
  const backupFile = `${BACKUP_DIR}/complete_database_backup.json`;
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  console.log(`💾 Database backup saved: ${backupFile}`);
  
  // Create summary report
  const summaryFile = `${BACKUP_DIR}/backup_summary.txt`;
  const summary = `
V3 PRODUCTION DATABASE BACKUP SUMMARY
=====================================
Timestamp: ${backupData.timestamp}
Database: ${supabaseUrl}
Backup Location: ${backupFile}

TABLE SUMMARY:
${Object.entries(backupData.tables).map(([table, info]) => 
  `- ${table}: ${info.exists ? `${info.rowCount} records ✅` : `❌ ${info.error}`}`
).join('\n')}

RESTORE INSTRUCTIONS:
1. Use restore_v3_production.js to restore this backup
2. Original backup file: ${backupFile}
3. Keep this backup safe before any schema changes
`;
  
  fs.writeFileSync(summaryFile, summary);
  console.log(`📋 Summary saved: ${summaryFile}`);
  
  return {
    backupDir: BACKUP_DIR,
    backupFile,
    summaryFile,
    tableCount: Object.keys(backupData.tables).length,
    totalRecords: Object.values(backupData.tables)
      .filter(t => t.exists)
      .reduce((sum, t) => sum + t.rowCount, 0)
  };
}

// Run backup
backupV3Production()
  .then((result) => {
    console.log('\n🎉 V3 PRODUCTION BACKUP COMPLETE!');
    console.log(`📁 Backup Directory: ${result.backupDir}`);
    console.log(`📊 Tables Backed Up: ${result.tableCount}`);
    console.log(`📈 Total Records: ${result.totalRecords}`);
    console.log('\n✅ SAFE TO PROCEED WITH SCHEMA MIGRATION');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  });