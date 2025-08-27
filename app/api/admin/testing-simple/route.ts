import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { userId, moduleId, sessionId, progressPercent } = body;

    // Direct database update without auth checks
    const sessionIdStr = `${moduleId}-${sessionId}`;
    
    // Calculate sections
    const lookbackCompleted = progressPercent >= 25;
    const lookupCompleted = progressPercent >= 50;
    const lookforwardCompleted = progressPercent >= 100;
    const quizCompleted = progressPercent >= 75;
    
    let completedSections: string[] = [];
    if (progressPercent >= 25) completedSections.push('introduction');
    if (progressPercent >= 50) completedSections.push('reading');
    if (progressPercent >= 75) completedSections.push('video');
    if (progressPercent === 100) completedSections.push('quiz');

    // Update progress
    await supabase
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

    // Bypass assessment
    await supabase
      .from('user_profiles')
      .update({ pre_assessment_completed: true })
      .eq('id', userId);

    await supabase
      .from('assessment_responses')
      .upsert({
        user_id: userId,
        assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7',
        responses: [{ question_id: 1, answer_index: 0, answer_text: 'ADMIN_TEST' }],
        total_score: 999,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,assessment_id'
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}