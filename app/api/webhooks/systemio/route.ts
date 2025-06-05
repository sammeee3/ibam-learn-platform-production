import { NextRequest, NextResponse } from 'next/server'

// In-memory log storage (for development)
const webhookLogs: any[] = []

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Webhook Endpoint is LIVE!',
    status: 'ready',
    timestamp: new Date().toISOString(),
    totalReceived: webhookLogs.length,
    recentWebhooks: webhookLogs.slice(-3).reverse(),
    note: 'This endpoint receives System.io webhooks via POST requests'
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text()
    const timestamp = new Date().toISOString()
    
    // Parse JSON if possible
    let parsedBody
    try {
      parsedBody = JSON.parse(body)
    } catch {
      parsedBody = { raw: body }
    }
    
    // Get headers
    const headers = Object.fromEntries(request.headers.entries())
    
    // Log everything
    const logEntry = {
      timestamp,
      headers,
      body: parsedBody,
      rawBody: body,
      method: request.method,
      url: request.url
    }
    
    webhookLogs.push(logEntry)
    
    // Keep only last 50 entries
    if (webhookLogs.length > 50) {
      webhookLogs.shift()
    }
    
    console.log('🎯 WEBHOOK RECEIVED:', logEntry)
    
    // Process the webhook data
    if (parsedBody.event_type) {
      console.log(`📨 Event: ${parsedBody.event_type}`)
      
      if (parsedBody.event_type === 'contact.tag_added') {
        console.log(`🏷️ Tag "${parsedBody.tag?.name}" added to ${parsedBody.contact?.email}`)
      }
    }
    
    // Always return 200 OK quickly
    return NextResponse.json({ 
      success: true, 
      received: timestamp,
      message: 'Webhook processed successfully'
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Webhook Error:', error)
    
    // Log the error too
    webhookLogs.push({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      headers: Object.fromEntries(request.headers.entries())
    })
    
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
