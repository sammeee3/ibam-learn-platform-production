import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Get current user from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const url = new URL('/auth/login', request.url);
      return NextResponse.redirect(url);
    }

    // Mark pre-assessment as completed for this user
    // First, check if assessment_responses table exists
    const { error: insertError } = await supabase
      .from('assessment_responses')
      .upsert({
        user_id: user.id,
        assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7', // Pre-assessment ID
        responses: [{ question_id: 1, answer_index: 0, answer_text: 'SKIPPED' }],
        total_score: 999, // Special score to indicate skip
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,assessment_id'
      });

    if (insertError) {
      console.error('Skip assessment error:', insertError);
      // Try alternative: update user profile directly
      await supabase
        .from('user_profiles')
        .update({ pre_assessment_completed: true })
        .eq('id', user.id);
    }

    // Redirect to modules with absolute URL
    const url = new URL('/modules/1', request.url);
    return NextResponse.redirect(url);
    
  } catch (error) {
    console.error('Skip assessment error:', error);
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
}