import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Support both GET (for SYNC) and POST (for submitting feedback)
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get feedback from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: feedback, error } = await supabase
      .from('user_feedback')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feedback:', error)
      return NextResponse.json({ feedback: [] })
    }

    return NextResponse.json({ 
      feedback: feedback || [],
      count: feedback?.length || 0,
      environment: process.env.VERCEL_ENV || 'development'
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ feedback: [], error: 'Failed to fetch feedback' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, description, priority, user_email, page_url } = body

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Type and description are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('user_feedback')
      .insert([{
        type, // 'bug', 'feature', 'improvement'
        title: title || `${type}: ${description.substring(0, 50)}...`,
        description,
        priority: priority || 'medium', // 'critical', 'high', 'medium', 'low'
        user_email: user_email || 'anonymous',
        page_url: page_url || request.headers.get('referer'),
        environment: process.env.VERCEL_ENV || 'development',
        status: 'new'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error saving feedback:', error)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      feedback: data,
      message: 'Thank you for your feedback!'
    })
  } catch (error) {
    console.error('Feedback POST error:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}