import { NextRequest, NextResponse } from 'next/server';

/**
 * HEALTH CHECK ENDPOINT
 * Used by session recovery service to test network connectivity
 * Minimal overhead endpoint for frequent polling
 */
export async function GET(request: NextRequest) {
  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}