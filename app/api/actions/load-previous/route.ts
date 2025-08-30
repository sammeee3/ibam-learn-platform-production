import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleId = searchParams.get('moduleId');
    const sessionId = searchParams.get('sessionId');
    
    // Validate required parameters
    if (!userId || !moduleId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, moduleId, sessionId' }, 
        { status: 400 }
      );
    }
    
    console.log('🔍 API: Loading previous actions for user:', userId, 'module:', moduleId, 'session:', sessionId);
    
    // Use admin client for database read
    const { data: actions, error } = await supabaseAdmin
      .from('user_action_steps')
      .select('*')
      .eq('user_id', parseInt(userId))
      .eq('module_id', parseInt(moduleId))
      .eq('session_id', parseInt(sessionId));
    
    if (error) {
      console.error('❌ Database query error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message }, 
        { status: 500 }
      );
    }
    
    console.log('✅ Found', actions?.length || 0, 'previous actions');
    return NextResponse.json({ actions: actions || [] });
    
  } catch (err) {
    console.error('❌ API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message }, 
      { status: 500 }
    );
  }
}