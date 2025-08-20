/**
 * Production CORS Security Test Endpoint
 * 
 * This endpoint tests CORS security improvements before applying them
 * to critical authentication routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { corsHeaders, validateOrigin } from '@/lib/security/cors';

export async function GET(request: NextRequest) {
  try {
    // Test CORS validation
    const origin = request.headers.get('origin');
    const isValidOrigin = origin ? validateOrigin(request) : true; // Allow direct access like SSO
    
    const corsHeadersTest = corsHeaders(request);
    
    const testResult = {
      timestamp: new Date().toISOString(),
      corsTest: {
        origin: origin || 'direct-access',
        isValidOrigin,
        headers: corsHeadersTest,
        status: isValidOrigin ? 'allowed' : 'blocked'
      },
      productionReady: true
    };

    const response = NextResponse.json(testResult);
    
    // Apply CORS headers
    Object.entries(corsHeadersTest).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;

  } catch (error) {
    console.error('CORS test error:', error);
    return NextResponse.json(
      { error: 'CORS test failed', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight requests
  const corsHeadersTest = corsHeaders(request);
  return new NextResponse(null, {
    status: 200,
    headers: corsHeadersTest
  });
}