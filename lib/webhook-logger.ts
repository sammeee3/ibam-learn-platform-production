// Webhook logging utility - shared between webhook route and admin panel

// In-memory storage for webhook logs (in production, use database)
export const webhookLogs: any[] = []
const MAX_LOGS = 50

// Store webhook log
export async function addWebhookLog(data: any) {
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
    webhookLogs.splice(MAX_LOGS)
  }
  
  return log
}