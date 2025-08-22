/**
 * 📋 Admin Tasks API
 * Returns tasks from the admin_tasks table for management interface
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching admin tasks')

    // Get all tasks, ordered by creation date
    const { data: tasks, error } = await supabase
      .from('admin_tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Failed to fetch tasks:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch tasks',
        details: error.message
      }, { status: 500 })
    }

    console.log(`✅ Successfully fetched ${tasks?.length || 0} tasks`)

    return NextResponse.json(tasks || [])

  } catch (error: any) {
    console.error('❌ Admin tasks API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error.message
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { taskId, status, priority } = await request.json()
    
    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 })
    }

    console.log(`📋 Updating task ${taskId}:`, { status, priority })

    // Update task
    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    
    // Add completion timestamp if marking as completed
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: updatedTask, error } = await supabase
      .from('admin_tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to update task:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to update task',
        details: error.message
      }, { status: 500 })
    }

    console.log(`✅ Successfully updated task ${taskId}`)

    return NextResponse.json({
      success: true,
      task: updatedTask
    })

  } catch (error: any) {
    console.error('❌ Task update error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update task',
      message: error.message
    }, { status: 500 })
  }
}