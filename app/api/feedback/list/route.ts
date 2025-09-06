import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function GET(request: NextRequest) {
  try {
    // Fetch all feedback, ordered by most recent
    const { data: feedback, error } = await supabaseAdmin
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Feedback fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    return NextResponse.json(feedback || [])
    
  } catch (error: any) {
    console.error('Feedback list error:', error)
    return NextResponse.json({ 
      error: 'Failed to list feedback',
      details: error.message 
    }, { status: 500 })
  }
}