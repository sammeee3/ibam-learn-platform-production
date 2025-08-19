import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧹 Clearing all authentication cookies');
  
  // Create response
  const response = NextResponse.json({ 
    success: true, 
    message: 'Authentication session cleared' 
  });

  // Clear all IBAM authentication cookies
  response.cookies.set({
    name: 'ibam_auth',
    value: '',
    expires: new Date(0),
    path: '/'
  });

  response.cookies.set({
    name: 'ibam_auth_server', 
    value: '',
    expires: new Date(0),
    path: '/'
  });

  // Also clear any other potential auth cookies
  response.cookies.set({
    name: 'ibam-auth-email',
    value: '',
    expires: new Date(0), 
    path: '/'
  });

  console.log('✅ Authentication cookies cleared');
  
  return response;
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  return POST(request);
}