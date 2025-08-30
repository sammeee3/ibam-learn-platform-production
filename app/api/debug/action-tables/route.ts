import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function GET() {
  try {
    const supabase = supabaseAdmin

    // Test user_action_steps table structure
    const { data: actionStepsData, error: actionStepsError } = await supabase
      .from('user_action_steps')
      .select('*')
      .limit(1)

    // Get basic info about the table
    const { count: actionStepsCount, error: countError } = await supabase
      .from('user_action_steps')
      .select('*', { count: 'exact', head: true })

    // Test what happens when we try to insert with different user_id formats
    const testResults = {
      table_exists: !actionStepsError,
      table_error: actionStepsError?.message,
      record_count: actionStepsCount || 0,
      sample_record: actionStepsData?.[0] || null,
      schema_columns: actionStepsData?.[0] ? Object.keys(actionStepsData[0]) : [],
    }

    // Try to determine the expected schema by looking at related tables
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, auth_user_id')
      .limit(1)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      user_action_steps: testResults,
      user_profiles_sample: {
        data: userProfiles?.[0] || null,
        error: profileError?.message
      },
      analysis: {
        table_accessible: !actionStepsError,
        likely_user_id_type: userProfiles?.[0] ? typeof userProfiles[0].id : 'unknown',
        auth_user_id_type: userProfiles?.[0] ? typeof userProfiles[0].auth_user_id : 'unknown'
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Action table analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}