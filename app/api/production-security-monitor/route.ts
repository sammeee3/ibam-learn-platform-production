/**
 * Production Security Monitoring Endpoint
 * 
 * NON-INTRUSIVE: This endpoint only provides security monitoring without
 * modifying any existing production code paths.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic security access check
    const authHeader = request.headers.get('authorization');
    const isLocalhost = request.headers.get('host')?.includes('localhost');
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Allow access in development or with proper auth
    if (!isDevelopment && !isLocalhost && !authHeader?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized access to security monitoring' },
        { status: 401 }
      );
    }

    // Get basic security status
    const securityStatus = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      monitoring: {
        active: true,
        version: '1.0.0',
        lastCheck: new Date().toISOString()
      },
      healthChecks: {
        database: await testDatabaseConnection(),
        environment: testEnvironmentVariables(),
        security: {
          httpsEnabled: request.url.startsWith('https'),
          headersPresent: !!request.headers.get('user-agent')
        }
      }
    };

    return NextResponse.json(securityStatus);

  } catch (error) {
    console.error('Production security monitor error:', error);
    return NextResponse.json(
      { 
        error: 'Security monitoring failed', 
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function testDatabaseConnection(): Promise<{ status: string; message: string }> {
  try {
    // Basic check for required environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!hasUrl || !hasKey) {
      return { status: 'error', message: 'Missing database configuration' };
    }
    
    return { status: 'ok', message: 'Database configuration present' };
  } catch (error) {
    return { status: 'error', message: 'Database check failed' };
  }
}

function testEnvironmentVariables(): { status: string; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'IBAM_SYSTEME_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  return {
    status: missing.length === 0 ? 'ok' : 'warning',
    missing
  };
}