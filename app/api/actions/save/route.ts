import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleId, sessionId, action, sharingCommitment } = body;
    
    // Validate required fields
    if (!userId || !moduleId || !sessionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, moduleId, sessionId, action' }, 
        { status: 400 }
      );
    }
    
    console.log('💾 API: Saving action for user:', userId);
    
    // Generate complete action sentence
    const what = action.smartData?.specific || 'complete action';
    const measurable = action.smartData?.measurable || '';
    const time = action.smartData?.timed || 'soon';
    const completeSentence = `I will ${what} ${measurable} ${time}`.trim().replace(/\s+/g, ' ');

    // Use admin client for database write
    const { error } = await supabaseAdmin.from('user_action_steps').upsert({
      user_id: userId,
      module_id: moduleId,
      session_id: sessionId,
      action_type: action.type,
      specific_action: action.smartData?.specific || action.generatedStatement || 'No description',
      timed: action.smartData?.timed || 'No time specified',
      generated_statement: completeSentence,
      person_to_tell: sharingCommitment || 'No one specified',
      completed: false,
      created_at: new Date().toISOString()
    });
    
    if (error) {
      console.error('❌ Database save error:', error);
      return NextResponse.json(
        { error: 'Database save failed', details: error.message }, 
        { status: 500 }
      );
    }
    
    console.log('✅ Action saved successfully');
    return NextResponse.json({ success: true, message: 'Action saved successfully' });
    
  } catch (err) {
    console.error('❌ API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message }, 
      { status: 500 }
    );
  }
}