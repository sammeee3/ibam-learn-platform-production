#!/usr/bin/env node
// STAGING DATA RESTORE SCRIPT
// Generated: 2025-08-21T18:40:59.241Z
// Backup file: staging-backup-1755801659238.json

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
    const backup = JSON.parse(fs.readFileSync('staging-backup-1755801659238.json', 'utf8'));
    
    // Clear existing data (DANGEROUS - use with caution)
    console.log('⚠️  WARNING: This will DELETE existing data');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (const [table, tableData] of Object.entries(backup.tables)) {
      if (tableData.data && tableData.data.length > 0) {
        console.log(`🔄 Restoring ${table} (${tableData.count} records)...`);
        
        // Delete existing data
        await stagingSupabase.from(table).delete().neq('id', 0);
        
        // Insert backup data
        const { error } = await stagingSupabase.from(table).insert(tableData.data);
        
        if (error) {
          console.log(`❌ Error restoring ${table}: ${error.message}`);
        } else {
          console.log(`✅ Restored ${table} successfully`);
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
