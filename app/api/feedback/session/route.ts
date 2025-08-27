import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if feedback already exists for this user/session
    const { data: existing } = await supabase
      .from('session_feedback')
      .select('id')
      .eq('user_id', body.user_id)
      .eq('session_id', body.session_id)
      .single();

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: 'Feedback already submitted for this session' 
      });
    }

    // Insert new feedback
    const { data, error } = await supabase
      .from('session_feedback')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Session feedback submission error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId || !sessionId) {
      return NextResponse.json({ hasSubmitted: false });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('session_feedback')
      .select('id')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();

    return NextResponse.json({ hasSubmitted: !!data });
  } catch (error) {
    return NextResponse.json({ hasSubmitted: false });
  }
}