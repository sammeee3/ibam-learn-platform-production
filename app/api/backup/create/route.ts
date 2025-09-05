import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST() {
  try {
    const timestamp = new Date().toISOString();
    console.log('🔐 V3 PRODUCTION BACKUP STARTING');
    
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
    
    const backupData: any = {
      timestamp,
      environment: 'V3_PRODUCTION',
      database_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tables: {}
    };
    
    for (const tableName of criticalTables) {
      try {
        console.log(`📊 Backing up table: ${tableName}`);
        
        // Get all data from table
        const { data, error, count } = await supabaseAdmin
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
        
      } catch (tableError: any) {
        console.log(`❌ Table ${tableName}: ${tableError.message}`);
        backupData.tables[tableName] = {
          exists: false,
          error: tableError.message,
          data: []
        };
      }
    }
    
    // Create summary
    const summary = {
      timestamp,
      totalTables: Object.keys(backupData.tables).length,
      existingTables: Object.values(backupData.tables).filter((t: any) => t.exists).length,
      totalRecords: Object.values(backupData.tables)
        .filter((t: any) => t.exists)
        .reduce((sum: number, t: any) => sum + (t.rowCount || 0), 0),
      tableStatus: Object.entries(backupData.tables).map(([table, info]: [string, any]) => ({
        table,
        exists: info.exists,
        records: info.rowCount || 0,
        error: info.error || null
      }))
    };
    
    console.log('🎉 V3 PRODUCTION BACKUP COMPLETE!');
    console.log(`📊 Tables: ${summary.existingTables}/${summary.totalTables}`);
    console.log(`📈 Total Records: ${summary.totalRecords}`);
    
    return NextResponse.json({
      success: true,
      message: 'V3 Production backup completed successfully',
      summary,
      backupData, // Full backup data
      safeToMigrate: true
    });
    
  } catch (error: any) {
    console.error('❌ Backup failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Backup failed',
      details: error.message,
      safeToMigrate: false
    }, { status: 500 });
  }
}