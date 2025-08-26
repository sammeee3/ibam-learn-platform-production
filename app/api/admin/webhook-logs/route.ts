import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// In-memory storage for webhook logs (in production, use database)
let webhookLogs: any[] = []
const MAX_LOGS = 50

// Store webhook log
export async function logWebhook(data: any) {
  const log = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    timestamp: new Date().toISOString(),
    event_type: data.event_type || 'UNKNOWN',
    email: data.contact?.email || data.email || 'N/A',
    tags: data.contact?.tags || data.tags || [],
    membership_detected: data.membership_detected || null,
    user_created: data.user_created || false,
    error: data.error || null,
    raw_data: data
  }
  
  webhookLogs.unshift(log)
  if (webhookLogs.length > MAX_LOGS) {
    webhookLogs = webhookLogs.slice(0, MAX_LOGS)
  }
  
  return log
}

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
  webhookLogs = []
  return NextResponse.json({ success: true })
}

// Export for use in webhook route
export { webhookLogs }