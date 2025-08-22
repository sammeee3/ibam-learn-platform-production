import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { type, description, userAgent, url, userEmail, screenshot } = await request.json()
    
    // Get user info if available
    const user = userEmail || 'Anonymous'
    
    // Create feedback entry in database
    const feedbackEntry = {
      type, // 'bug' or 'feature'
      description,
      user_email: user,
      page_url: url || 'Unknown',
      user_agent: userAgent || 'Unknown',
      screenshot_data: screenshot || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      priority: type === 'bug' ? 'high' : 'medium'
    }

    // Save to feedback table
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .insert([feedbackEntry])
      .select()
      .single()

    if (feedbackError) {
      console.error('Feedback save error:', feedbackError)
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    // Create task list entry automatically
    const taskDescription = `${type === 'bug' ? '🐛 BUG' : '💡 FEATURE'}: ${description} (ID: ${feedback.id})`
    
    const { error: taskError } = await supabase
      .from('admin_tasks')
      .insert([{
        title: taskDescription,
        description: `User: ${user}\nPage: ${url}\nType: ${type}\nFeedback ID: ${feedback.id}`,
        type: type === 'bug' ? 'bug_fix' : 'feature_request',
        status: 'pending',
        priority: type === 'bug' ? 'high' : 'medium',
        source: 'user_feedback',
        source_id: feedback.id,
        created_at: new Date().toISOString()
      }])

    if (taskError) {
      console.error('Task creation error:', taskError)
      // Don't fail the request if task creation fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedbackId: feedback.id
    })
    
  } catch (error: any) {
    console.error('Feedback submission error:', error)
    return NextResponse.json({ 
      error: 'Failed to submit feedback',
      details: error.message 
    }, { status: 500 })
  }
}