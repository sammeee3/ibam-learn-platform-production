import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { webhookLogs, addWebhookLog } from '@/lib/webhook-logger'

// GET webhook logs
export async function GET(request: NextRequest) {
  try {
    // Also fetch recent webhook activity from database
    const { data: recentUsers } = await supabase
      .from('user_profiles')
      .select('email, created_at, membership_level, created_via')
      .or('created_via.eq.webhook,created_via.eq.systemio_webhook')
      .order('created_at', { ascending: false })
      .limit(10)
    
    return NextResponse.json({
      logs: webhookLogs,
      recentUsers: recentUsers || []
    })
  } catch (error) {
    console.error('Error fetching webhook logs:', error)
    return NextResponse.json({ logs: webhookLogs, recentUsers: [] })
  }
}

// DELETE webhook logs (clear)
export async function DELETE(request: NextRequest) {
  webhookLogs.length = 0
  return NextResponse.json({ success: true })
}