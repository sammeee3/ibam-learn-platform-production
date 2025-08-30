import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function POST() {
  try {
    const supabase = supabaseAdmin

    console.log('🔧 EXECUTING ACTION SCHEMA MIGRATION IN STAGING')
    console.log('🎯 Timestamp:', new Date().toISOString())

    const migrations = [
      {
        name: 'Add person_to_tell column',
        check_column: 'person_to_tell',
        description: 'Column to store who the user commits to share insights with'
      },
      {
        name: 'Add generated_statement column',
        check_column: 'generated_statement', 
        description: 'AI-generated statement for the action commitment'
      },
      {
        name: 'Add completed_at column',
        check_column: 'completed_at',
        description: 'Timestamp when action was marked complete'
      },
      {
        name: 'Add deferred column',
        check_column: 'deferred',
        description: 'Boolean flag if action was deferred'
      },
      {
        name: 'Add deferred_at column',
        check_column: 'deferred_at',
        description: 'Timestamp when action was deferred'
      },
      {
        name: 'Add cancelled column', 
        check_column: 'cancelled',
        description: 'Boolean flag if action was cancelled'
      },
      {
        name: 'Add cancelled_at column',
        check_column: 'cancelled_at',
        description: 'Timestamp when action was cancelled'
      },
      {
        name: 'Add cancel_reason column',
        check_column: 'cancel_reason',
        description: 'Text reason why action was cancelled'
      }
    ]

    const results: any[] = []

    // Check current schema first
    const { data: currentData, error: currentError } = await supabase
      .from('user_action_steps')
      .select('*')
      .limit(1)

    const currentColumns = currentData?.[0] ? Object.keys(currentData[0]) : []
    
    console.log('📊 Current columns:', currentColumns)

    // Process each migration
    for (const migration of migrations) {
      const hasColumn = currentColumns.includes(migration.check_column)
      
      if (hasColumn) {
        results.push({
          migration: migration.name,
          status: 'skipped',
          reason: 'Column already exists',
          column: migration.check_column
        })
        console.log(`✅ ${migration.name} - Column already exists`)
      } else {
        // Try to create a test record with the new column to trigger schema update
        // This is a workaround since we can't execute raw SQL
        try {
          const testData = {
            user_id: 999999999, // Test ID that won't conflict
            session_id: 'migration-test',
            step_number: 1,
            [migration.check_column]: migration.check_column === 'deferred' || migration.check_column === 'cancelled' 
              ? false 
              : migration.check_column.includes('_at') 
                ? null 
                : 'test_value'
          }

          // This will fail but might reveal what columns are actually expected
          const { error: insertError } = await supabase
            .from('user_action_steps')
            .insert(testData)

          results.push({
            migration: migration.name,
            status: 'attempted',
            error: insertError?.message || 'Unknown error',
            column: migration.check_column,
            note: 'Cannot execute raw SQL through Supabase client - manual SQL execution required'
          })
          
          console.log(`❌ ${migration.name} - Manual SQL required: ${insertError?.message}`)
          
        } catch (error: any) {
          results.push({
            migration: migration.name,
            status: 'failed',
            error: error.message,
            column: migration.check_column
          })
        }
      }
    }

    // Generate the SQL that needs to be run manually
    const manualSQL = `
-- CRITICAL DATABASE FIX - Run in Supabase SQL Editor
-- Add missing columns to user_action_steps table

ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS person_to_tell TEXT;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS generated_statement TEXT;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred BOOLEAN DEFAULT FALSE;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS deferred_at TIMESTAMP;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled BOOLEAN DEFAULT FALSE;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
ALTER TABLE user_action_steps ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_action_steps' 
ORDER BY ordinal_position;
`

    return NextResponse.json({
      success: false,
      message: 'Schema migration requires manual SQL execution',
      timestamp: new Date().toISOString(),
      database: 'yhfxxouswctucxvfetcq.supabase.co (STAGING)',
      current_columns: currentColumns,
      migration_results: results,
      required_manual_sql: manualSQL,
      instructions: [
        '1. Copy the SQL from required_manual_sql',
        '2. Go to Supabase Dashboard > SQL Editor', 
        '3. Paste and execute the SQL',
        '4. Verify columns were added',
        '5. Test action creation functionality'
      ]
    })

  } catch (error: any) {
    console.error('Migration failed:', error)
    return NextResponse.json({
      error: 'Migration failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}