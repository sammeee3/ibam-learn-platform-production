import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleId, sessionId, actions, sharingCommitment } = body;
    
    // Validate required fields
    if (!userId || !moduleId || !sessionId || !actions) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, moduleId, sessionId, actions' }, 
        { status: 400 }
      );
    }
    
    console.log('💾 API: Bulk saving', actions.length, 'actions for user:', userId);
    
    // Prepare bulk insert data
    const actionRecords = actions.map(action => ({
      user_id: userId,
      module_id: moduleId,
      session_id: sessionId,
      action_type: action.type,
      specific_action: action.smartData?.specific || action.generatedStatement || 'No description',
      timed: action.smartData?.timed || 'No time specified',
      generated_statement: action.generatedStatement,
      person_to_tell: sharingCommitment,
      completed: false,
      created_at: new Date().toISOString()
    }));
    
    // Use admin client for bulk database write
    const { error } = await supabaseAdmin.from('user_action_steps').upsert(actionRecords);
    
    if (error) {
      console.error('❌ Bulk save error:', error);
      return NextResponse.json(
        { error: 'Bulk save failed', details: error.message }, 
        { status: 500 }
      );
    }
    
    console.log('✅ Bulk save successful');
    return NextResponse.json({ 
      success: true, 
      message: `${actions.length} actions saved successfully` 
    });
    
  } catch (err) {
    console.error('❌ API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message }, 
      { status: 500 }
    );
  }
}