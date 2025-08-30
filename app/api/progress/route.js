import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_session_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createClient();
  const { sessionId, videoWatched, quizCompleted, quizScore } = await request.json();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_session_progress')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        video_watch_percentage: videoWatched ? 100 : 0,
        assessment_completed: quizCompleted,
        quiz_score: quizScore,
        completed_at: (videoWatched && quizCompleted) ? new Date().toISOString() : null,
        last_accessed: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}