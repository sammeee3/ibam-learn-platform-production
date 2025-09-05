import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function GET() {
  try {
    const supabase = supabaseAdmin

    // Check progress tables - THE CRITICAL ISSUE
    const criticalTables = ['user_progress', 'user_session_progress', 'user_profiles'];
    const schemaInfo: any = {};
    
    for (const tableName of criticalTables) {
      try {
        // Try to get first record to understand schema
        const { data: firstRecord, error: firstError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
          .single();

        // Get row count
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        schemaInfo[tableName] = {
          exists: !firstError || firstError.code !== 'PGRST116', // PGRST116 = table not found
          rowCount: count || 0,
          availableColumns: firstRecord ? Object.keys(firstRecord) : [],
          firstRecordSample: firstRecord,
          error: firstError?.message,
          countError: countError?.message
        };

      } catch (tableError: any) {
        schemaInfo[tableName] = { 
          exists: false, 
          error: tableError.message 
        };
      }
    }

    // Test the exact API call that's failing
    let progressAPITest = 'untested';
    try {
      // This is the exact query from the failing progress API
      const { data: testProgress } = await supabase
        .from('user_session_progress')
        .select('*')
        .eq('user_id', 'a8029106-99b4-4eeb-8e33-bb88c1d4d796')
        .eq('module_id', 1)
        .eq('session_id', 1)
        .single();
      
      progressAPITest = 'user_session_progress_works';
    } catch (sessionError: any) {
      try {
        // This is the fallback query that's failing with "module_id column not found"
        const { data: testFallback } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', 'a8029106-99b4-4eeb-8e33-bb88c1d4d796')
          .eq('module_id', '1') // Try as string
          .eq('session_id', '1')
          .single();
        
        progressAPITest = 'user_progress_fallback_works';
      } catch (fallbackError: any) {
        progressAPITest = `BOTH_FAILED - session: ${sessionError.message} | fallback: ${fallbackError.message}`;
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      environment: 'V3_PRODUCTION',
      critical_tables: schemaInfo,
      progress_api_test: progressAPITest,
      diagnosis: {
        likely_issue: "user_progress table missing module_id column or user_session_progress table doesn't exist",
        next_step: "Check if migration was actually applied to V3 production"
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'V3 Production schema analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}