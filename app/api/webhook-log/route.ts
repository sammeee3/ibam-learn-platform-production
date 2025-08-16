import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Webhook Activity Log',
    status: 'No webhooks received yet',
    note: 'When System.io sends webhooks, they will appear here',
    timestamp: new Date().toISOString()
  })
}
