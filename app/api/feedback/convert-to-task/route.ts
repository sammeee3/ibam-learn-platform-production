/**
 * 🔄 Staging Feedback to Task Converter
 * Converts individual staging feedback items to staging admin tasks
 * Allows staging bugs to enter the task management workflow
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export async function POST(request: NextRequest) {
  try {
    const { feedbackId } = await request.json()
    
    if (!feedbackId) {
      return NextResponse.json({
        success: false,
        error: 'Feedback ID is required'
      }, { status: 400 })
    }

    console.log('🔄 Converting staging feedback to task:', feedbackId)

    // Get the feedback item from staging database
    const { data: feedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('*')
      .eq('id', feedbackId)
      .single()

    if (feedbackError || !feedback) {
      return NextResponse.json({
        success: false,
        error: 'Feedback item not found',
        details: feedbackError?.message
      }, { status: 404 })
    }

    // Check if task already exists for this feedback
    const { data: existingTask } = await supabase
      .from('admin_tasks')
      .select('id')
      .eq('source', 'staging_feedback')
      .eq('source_id', feedbackId)
      .single()

    if (existingTask) {
      return NextResponse.json({
        success: false,
        error: 'Task already exists for this feedback item',
        taskId: existingTask.id
      }, { status: 409 })
    }

    // Create task from feedback
    const task = {
      title: `${feedback.type === 'bug' ? '🐛 STAGING BUG' : '💡 STAGING FEATURE'}: ${feedback.description.slice(0, 100)}${feedback.description.length > 100 ? '...' : ''}`,
      description: `**Staging User Feedback** (ID: ${feedback.id})

**Type**: ${feedback.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}
**Description**: ${feedback.description}
**User**: ${feedback.user_email || 'Anonymous'}
**Page**: ${feedback.page_url || 'Unknown'}
**Browser**: ${feedback.user_agent || 'Unknown'}
**Screenshot**: ${feedback.screenshot_data ? '📸 Yes (base64 data available)' : '❌ No'}
**Submitted**: ${new Date(feedback.created_at).toLocaleString()}

**Resolution Steps**:
1. Reproduce issue in staging environment
2. Develop fix locally
3. Test fix thoroughly
4. Commit and deploy fix
5. Mark task as completed`,
      type: feedback.type === 'bug' ? 'bug_fix' : 'feature_request',
      status: 'pending',
      priority: feedback.type === 'bug' ? 'high' : 'medium',
      source: 'staging_feedback',
      source_id: feedbackId,
      metadata: {
        staging_feedback_id: feedbackId,
        user_email: feedback.user_email,
        page_url: feedback.page_url,
        user_agent: feedback.user_agent,
        has_screenshot: Boolean(feedback.screenshot_data),
        created_at: feedback.created_at
      }
    }

    // Insert the new task
    const { data: newTask, error: taskError } = await supabase
      .from('admin_tasks')
      .insert([task])
      .select()
      .single()

    if (taskError) {
      console.error('❌ Failed to create task:', taskError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create task',
        details: taskError.message
      }, { status: 500 })
    }

    console.log(`✅ Created staging task for feedback ${feedbackId}:`, newTask.id)

    // Update feedback status to indicate it's been processed
    await supabase
      .from('user_feedback')
      .update({ status: 'converted_to_task' })
      .eq('id', feedbackId)

    return NextResponse.json({
      success: true,
      message: 'Feedback successfully converted to task',
      feedbackId,
      taskId: newTask.id,
      taskTitle: task.title
    })

  } catch (error: any) {
    console.error('❌ Staging feedback conversion error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to convert feedback to task',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * GET: Bulk convert all unprocessed staging feedback to tasks
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Bulk converting all unprocessed staging feedback to tasks')

    // Get all feedback that hasn't been converted to tasks yet
    const { data: unprocessedFeedback, error: feedbackError } = await supabase
      .from('user_feedback')
      .select('*')
      .neq('status', 'converted_to_task')

    if (feedbackError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch unprocessed feedback',
        details: feedbackError.message
      }, { status: 500 })
    }

    if (!unprocessedFeedback || unprocessedFeedback.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unprocessed feedback to convert',
        processed: 0,
        created: 0
      })
    }

    let created = 0
    let errors = 0
    const results = []

    for (const feedback of unprocessedFeedback) {
      // Check if task already exists
      const { data: existingTask } = await supabase
        .from('admin_tasks')
        .select('id')
        .eq('source', 'staging_feedback')
        .eq('source_id', feedback.id)
        .single()

      if (existingTask) {
        results.push({ feedbackId: feedback.id, status: 'already_exists', taskId: existingTask.id })
        continue
      }

      // Create task
      const task = {
        title: `${feedback.type === 'bug' ? '🐛 STAGING BUG' : '💡 STAGING FEATURE'}: ${feedback.description.slice(0, 100)}${feedback.description.length > 100 ? '...' : ''}`,
        description: `**Staging User Feedback** (ID: ${feedback.id})

**Type**: ${feedback.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}
**Description**: ${feedback.description}
**User**: ${feedback.user_email || 'Anonymous'}
**Page**: ${feedback.page_url || 'Unknown'}
**Browser**: ${feedback.user_agent || 'Unknown'}
**Screenshot**: ${feedback.screenshot_data ? '📸 Yes (base64 data available)' : '❌ No'}
**Submitted**: ${new Date(feedback.created_at).toLocaleString()}

**Resolution Steps**:
1. Reproduce issue in staging environment
2. Develop fix locally  
3. Test fix thoroughly
4. Commit and deploy fix
5. Mark task as completed`,
        type: feedback.type === 'bug' ? 'bug_fix' : 'feature_request',
        status: 'pending',
        priority: feedback.type === 'bug' ? 'high' : 'medium',
        source: 'staging_feedback',
        source_id: feedback.id
      }

      const { data: newTask, error: taskError } = await supabase
        .from('admin_tasks')
        .insert([task])
        .select()
        .single()

      if (taskError) {
        console.error(`❌ Failed to create task for feedback ${feedback.id}:`, taskError)
        errors++
        results.push({ feedbackId: feedback.id, status: 'error', error: taskError.message })
      } else {
        console.log(`✅ Created staging task for feedback ${feedback.id}`)
        created++
        results.push({ feedbackId: feedback.id, status: 'created', taskId: newTask.id })
        
        // Update feedback status
        await supabase
          .from('user_feedback')
          .update({ status: 'converted_to_task' })
          .eq('id', feedback.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${unprocessedFeedback.length} feedback items. Created ${created} tasks, ${errors} errors.`,
      processed: unprocessedFeedback.length,
      created,
      errors,
      results
    })

  } catch (error: any) {
    console.error('❌ Bulk staging feedback conversion error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Bulk conversion failed',
      message: error.message
    }, { status: 500 })
  }
}