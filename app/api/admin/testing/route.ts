import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Check if user is super admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'sammeee3@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, moduleId, sessionId, progressPercent } = body;

    switch (action) {
      case 'setProgress': {
        const sessionIdStr = `${moduleId}-${sessionId}`;
        
        // Calculate what sections should be complete
        const lookbackCompleted = progressPercent >= 25;
        const lookupCompleted = progressPercent >= 50;
        const lookforwardCompleted = progressPercent >= 100;
        const quizCompleted = progressPercent >= 75;
        
        let completedSections: string[] = [];
        if (progressPercent >= 25) completedSections.push('introduction');
        if (progressPercent >= 50) completedSections.push('reading');
        if (progressPercent >= 75) completedSections.push('video');
        if (progressPercent === 100) completedSections.push('quiz');

        // Update session progress
        const { error } = await supabase
          .from('session_progress')
          .upsert({
            user_id: userId,
            session_id: sessionIdStr,
            module_id: moduleId,
            completed_sections: completedSections,
            lookback_completed: lookbackCompleted,
            lookup_completed: lookupCompleted,
            lookforward_completed: lookforwardCompleted,
            quiz_completed: quizCompleted,
            overall_progress: progressPercent,
            last_activity: new Date().toISOString(),
          }, {
            onConflict: 'user_id,session_id'
          });

        if (error) throw error;

        // Also bypass pre-assessment
        await supabase
          .from('user_profiles')
          .update({ pre_assessment_completed: true })
          .eq('id', userId);

        await supabase
          .from('assessment_responses')
          .upsert({
            user_id: userId,
            assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7',
            responses: [{ question_id: 1, answer_index: 0, answer_text: 'ADMIN_TEST_BYPASS' }],
            total_score: 999,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,assessment_id'
          });

        return NextResponse.json({ success: true, message: `User set to ${progressPercent}%` });
      }

      case 'clearProgress': {
        // Delete all progress
        await supabase.from('session_progress').delete().eq('user_id', userId);
        await supabase.from('assessment_responses').delete().eq('user_id', userId);
        await supabase.from('session_feedback').delete().eq('user_id', userId);
        
        await supabase
          .from('user_profiles')
          .update({ pre_assessment_completed: false })
          .eq('id', userId);

        return NextResponse.json({ success: true, message: 'Progress cleared' });
      }

      case 'skipAssessment': {
        await supabase
          .from('user_profiles')
          .update({ pre_assessment_completed: true })
          .eq('id', userId);

        await supabase
          .from('assessment_responses')
          .upsert({
            user_id: userId,
            assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7',
            responses: [{ question_id: 1, answer_index: 0, answer_text: 'ADMIN_SKIP' }],
            total_score: 999,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,assessment_id'
          });

        return NextResponse.json({ success: true, message: 'Assessment skipped' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Check if user is super admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'sammeee3@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get list of test users
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id, email, created_at, pre_assessment_completed')
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}