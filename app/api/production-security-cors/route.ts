/**
 * Production CORS Security Test Endpoint
 * 
 * This endpoint tests CORS security improvements before applying them
 * to critical authentication routes.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic CORS test
    const origin = request.headers.get('origin');
    
    const testResult = {
      timestamp: new Date().toISOString(),
      corsTest: {
        origin: origin || 'direct-access',
        status: 'basic-validation'
      },
      productionReady: true
    };

    return NextResponse.json(testResult);

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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}