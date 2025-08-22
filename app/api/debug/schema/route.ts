import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function GET() {
  try {
    const supabase = supabaseAdmin

    // Get specific user for testing
    const { data: specificUser, error: specificError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'sj614+444@proton.me')
      .single()

    // Get table schema information
    const { data: schemaInfo, error: schemaError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)

    // Get all column names by checking the first record
    const { data: firstRecord, error: firstError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
      .single()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      specificUserTest: {
        email: 'sj614+444@proton.me',
        found: !specificError,
        data: specificUser,
        error: specificError?.message
      },
      schemaAnalysis: {
        availableColumns: firstRecord ? Object.keys(firstRecord) : [],
        firstRecordData: firstRecord,
        schemaError: schemaError?.message || firstError?.message
      },
      expectedColumns: [
        'first_name', 'last_name', 'email', 'login_source', 'learning_path', 'learning_mode'
      ]
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Schema analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}