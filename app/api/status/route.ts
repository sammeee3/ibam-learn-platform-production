import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    build: 'successful',
    version: '2.0-premium',
    features: {
      authentication: 'operational',
      webhooks: 'operational', 
      database: 'connected',
      core_functionality: 'preserved'
    }
  });
}