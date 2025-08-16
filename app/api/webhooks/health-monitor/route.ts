// app/api/webhooks/health-monitor/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Webhook Health Monitor Active',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.1.0'
  });
}
