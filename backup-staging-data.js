const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function backupStagingData() {
  console.log('💾 BACKING UP STAGING DATA');
  console.log('=' .repeat(50));

  const backup = {
    timestamp: new Date().toISOString(),
    database: 'staging (yhfxxouswctucxvfetcq)',
    purpose: 'Pre-schema-upgrade backup',
    tables: {}
  };

  const tablesToBackup = ['user_profiles', 'sessions', 'modules', 'assessments', 'business_plans'];

  for (const table of tablesToBackup) {
    try {
      console.log(`📋 Backing up ${table}...`);
      
      const { data, error, count } = await stagingSupabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`❌ Error backing up ${table}: ${error.message}`);
        backup.tables[table] = {
          error: error.message,
          data: [],
          count: 0
        };
      } else {
        console.log(`✅ Backed up ${table}: ${count} records`);
        backup.tables[table] = {
          data: data || [],
          count: count || 0,
          schema: data && data.length > 0 ? Object.keys(data[0]) : []
        };
      }

    } catch (e) {
      console.log(`💥 Exception backing up ${table}: ${e.message}`);
      backup.tables[table] = {
        error: e.message,
        data: [],
        count: 0
      };
    }
  }

  // Save backup to file
  const timestamp = Date.now();
  const backupFilename = `staging-backup-${timestamp}.json`;
  
  try {
    fs.writeFileSync(backupFilename, JSON.stringify(backup, null, 2));
    console.log(`\n💾 BACKUP SAVED TO: ${backupFilename}`);
    
    // Create summary
    const totalRecords = Object.values(backup.tables).reduce((sum, table) => sum + (table.count || 0), 0);
    console.log(`📊 BACKUP SUMMARY:`);
    console.log(`   Total records backed up: ${totalRecords}`);
    console.log(`   File size: ${Math.round(fs.statSync(backupFilename).size / 1024)} KB`);
    
    Object.entries(backup.tables).forEach(([table, data]) => {
      console.log(`   ${table}: ${data.count} records`);
    });

    // Show critical user data
    const userProfiles = backup.tables.user_profiles;
    if (userProfiles && userProfiles.data.length > 0) {
      console.log(`\n👥 CRITICAL USER DATA BACKED UP:`);
      console.log(`   Users: ${userProfiles.count}`);
      console.log(`   Webhook users: ${userProfiles.data.filter(u => u.created_via_webhook).length}`);
      console.log(`   Users with magic tokens: ${userProfiles.data.filter(u => u.magic_token).length}`);
    }

    return backupFilename;

  } catch (error) {
    console.log(`❌ Failed to save backup: ${error.message}`);
    return null;
  }
}

async function validateBackup(backupFilename) {
  console.log('\n🔍 VALIDATING BACKUP');
  console.log('-' .repeat(30));

  if (!backupFilename || !fs.existsSync(backupFilename)) {
    console.log('❌ Backup file not found');
    return false;
  }

  try {
    const backup = JSON.parse(fs.readFileSync(backupFilename, 'utf8'));
    
    console.log('✅ Backup file is valid JSON');
    console.log(`📅 Backup timestamp: ${backup.timestamp}`);
    console.log(`🎯 Purpose: ${backup.purpose}`);
    console.log(`🗄️  Database: ${backup.database}`);
    
    // Validate each table
    let isValid = true;
    Object.entries(backup.tables).forEach(([table, data]) => {
      if (data.error) {
        console.log(`⚠️  ${table}: Has error - ${data.error}`);
      } else if (data.count > 0) {
        console.log(`✅ ${table}: ${data.count} records, ${data.schema?.length || 0} columns`);
      } else {
        console.log(`ℹ️  ${table}: Empty table`);
      }
    });

    return isValid;

  } catch (error) {
    console.log(`❌ Invalid backup file: ${error.message}`);
    return false;
  }
}

async function createRestoreScript(backupFilename) {
  console.log('\n📝 CREATING RESTORE SCRIPT');
  console.log('-' .repeat(30));

  if (!backupFilename) {
    console.log('❌ No backup file to create restore script from');
    return;
  }

  const restoreScript = `#!/usr/bin/env node
// STAGING DATA RESTORE SCRIPT
// Generated: ${new Date().toISOString()}
// Backup file: ${backupFilename}

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function restoreData() {
  console.log('🔄 RESTORING STAGING DATA FROM BACKUP');
  console.log('=' .repeat(50));
  
  try {
    const backup = JSON.parse(fs.readFileSync('${backupFilename}', 'utf8'));
    
    // Clear existing data (DANGEROUS - use with caution)
    console.log('⚠️  WARNING: This will DELETE existing data');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (const [table, tableData] of Object.entries(backup.tables)) {
      if (tableData.data && tableData.data.length > 0) {
        console.log(\`🔄 Restoring \${table} (\${tableData.count} records)...\`);
        
        // Delete existing data
        await stagingSupabase.from(table).delete().neq('id', 0);
        
        // Insert backup data
        const { error } = await stagingSupabase.from(table).insert(tableData.data);
        
        if (error) {
          console.log(\`❌ Error restoring \${table}: \${error.message}\`);
        } else {
          console.log(\`✅ Restored \${table} successfully\`);
        }
      }
    }
    
    console.log('✅ DATA RESTORE COMPLETE');
    
  } catch (error) {
    console.log('❌ Restore failed:', error.message);
  }
}

// Uncomment to run restore
// restoreData();

console.log('🚨 RESTORE SCRIPT READY');
console.log('Uncomment the last line and run: node restore-staging-data.js');
`;

  const restoreFilename = `restore-staging-data-${Date.now()}.js`;
  fs.writeFileSync(restoreFilename, restoreScript);
  
  console.log(`📝 Restore script created: ${restoreFilename}`);
  console.log(`⚠️  Use this script ONLY if schema upgrade fails`);
}

async function runStagingBackup() {
  console.log('🛡️  STAGING DATABASE BACKUP PROCESS');
  console.log('=' .repeat(60));

  // Create backup
  const backupFile = await backupStagingData();
  
  if (!backupFile) {
    console.log('❌ Backup failed - ABORTING schema upgrade');
    return false;
  }

  // Validate backup
  const isValid = await validateBackup(backupFile);
  
  if (!isValid) {
    console.log('❌ Backup validation failed - ABORTING schema upgrade');
    return false;
  }

  // Create restore script
  await createRestoreScript(backupFile);

  console.log('\n✅ STAGING BACKUP COMPLETE');
  console.log('🚀 Ready for schema upgrade!');
  
  return true;
}

// Run backup
runStagingBackup();