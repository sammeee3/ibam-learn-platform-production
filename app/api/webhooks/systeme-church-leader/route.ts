// app/api/webhooks/church-provisioning/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log(`Church webhook request at ${new Date().toISOString()}`);
    
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    console.log('Church webhook payload received:', JSON.stringify(payload, null, 2));
    
    const processingTime = Date.now() - startTime;
    
    const response = {
      success: true,
      message: 'Church webhook processed successfully',
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Church webhook processing error:', error);
    
    return NextResponse.json(
      {
        error: 'internal_error',
        message: 'Church webhook processing failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'IBAM Church Provisioning Webhook Endpoint Active',
    version: '3.1.0',
    timestamp: new Date().toISOString(),
    status: 'operational'
  });
}
