import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET() {
  return checkColumns();
}

export async function POST() {
  return checkColumns();
}

async function checkColumns() {
  try {
    console.log('🔧 Checking and adding missing subsection columns...');
    
    // First, let's check what columns currently exist
    const { data: existingRecord, error: selectError } = await supabaseAdmin
      .from('user_session_progress')
      .select('*')
      .limit(1)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error checking existing columns:', selectError);
      return NextResponse.json({ 
        error: 'Failed to check existing columns', 
        details: selectError.message 
      }, { status: 500 });
    }
    
    const existingColumns = existingRecord ? Object.keys(existingRecord) : [];
    console.log('📋 Existing columns:', existingColumns);
    
    const needsLookingUp = !existingColumns.includes('looking_up_subsections');
    const needsLookingForward = !existingColumns.includes('looking_forward_subsections');
    
    console.log(`🔍 Missing columns: looking_up_subsections=${needsLookingUp}, looking_forward_subsections=${needsLookingForward}`);
    
    // Try to update a record to test if columns exist, if not we'll get an error
    if (needsLookingUp || needsLookingForward) {
      const testUpdate = {
        ...(needsLookingUp && { looking_up_subsections: {} }),
        ...(needsLookingForward && { looking_forward_subsections: {} })
      };
      
      // Try to update a record with the new columns to see if they exist
      const { error: testError } = await supabaseAdmin
        .from('user_session_progress')
        .update(testUpdate)
        .eq('id', -1); // Non-existent ID, just to test column existence
      
      if (testError && testError.message.includes('column') && testError.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Missing database columns - manual migration required',
          details: testError.message,
          missingColumns: {
            looking_up_subsections: needsLookingUp,
            looking_forward_subsections: needsLookingForward
          },
          sqlMigration: `
            ALTER TABLE user_session_progress 
            ADD COLUMN IF NOT EXISTS looking_up_subsections JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS looking_forward_subsections JSONB DEFAULT '{}';
          `
        }, { status: 500 });
      }
    }
    
    console.log('✅ All required columns exist');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All subsection columns exist',
      existingColumns,
      columnsChecked: {
        looking_up_subsections: !needsLookingUp,
        looking_forward_subsections: !needsLookingForward
      }
    });
    
  } catch (error) {
    console.error('❌ Column check error:', error);
    return NextResponse.json({ 
      error: 'Column check failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}