import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    console.log('🔍 Dashboard API: Fetching data for user:', userId);

    // Use admin client to bypass RLS
    const supabase = supabaseAdmin;

    // Get sessions data (needed for progress calculation)
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id, module_id, session_number, title, subtitle');

    if (sessionsError) {
      console.error('❌ Sessions query error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Get user progress data
    const { data: progress, error: progressError } = await supabase
      .from('user_session_progress')
      .select('session_id, completion_percentage, last_accessed, module_id')
      .eq('user_id', userId); // FIX: Use UUID string directly, not parseInt()

    if (progressError) {
      console.error('❌ Progress query error:', progressError);
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    // Get last accessed session for Continue Session button
    const { data: lastSession, error: lastSessionError } = await supabase
      .from('user_session_progress')
      .select('module_id, session_id, completion_percentage, last_accessed, last_section')
      .eq('user_id', userId) // FIX: Use UUID string directly, not parseInt()
      .order('last_accessed', { ascending: false })
      .limit(1)
      .single();

    console.log('✅ Dashboard data fetched:', {
      sessionsCount: sessions?.length || 0,
      progressCount: progress?.length || 0,
      lastSession: lastSession?.module_id ? `${lastSession.module_id}-${lastSession.session_id}` : 'none'
    });

    return NextResponse.json({
      sessions: sessions || [],
      progress: progress || [],
      lastSession: lastSession || null
    });

  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}