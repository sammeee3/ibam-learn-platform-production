import { NextResponse } from 'next/server';
import { getSecureConfig } from '@/lib/config/security';

export async function GET() {
  try {
    const config = getSecureConfig();
    
    return NextResponse.json({
      status: 'Security framework operational',
      environment: config.security.environment,
      corsOrigins: config.security.corsOrigins.length,
      rateLimiting: config.security.rateLimiting,
      timestamp: new Date().toISOString(),
      deployment: 'staging',
      framework: {
        validation: 'enabled',
        cors: 'enabled', 
        monitoring: 'enabled',
        secretManagement: 'enabled'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Security framework error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}