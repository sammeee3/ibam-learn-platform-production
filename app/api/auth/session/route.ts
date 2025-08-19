import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Check for authentication cookies
    const cookieStore = cookies();
    const authCookie = cookieStore.get('ibam_auth');
    const authServerCookie = cookieStore.get('ibam_auth_server');
    
    // Must have at least one valid authentication cookie
    if (!authCookie && !authServerCookie) {
      return NextResponse.json(
        { error: 'No authentication session found' }, 
        { status: 401 }
      );
    }

    // Get email from cookies (server cookie takes precedence)
    const email = authServerCookie?.value || authCookie?.value;
    
    if (!email || email === 'undefined' || email === 'null') {
      return NextResponse.json(
        { error: 'Invalid authentication session' }, 
        { status: 401 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email in session' }, 
        { status: 401 }
      );
    }

    // Return valid session
    return NextResponse.json({
      authenticated: true,
      email: email,
      source: authServerCookie ? 'server_cookie' : 'client_cookie'
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Session validation failed' }, 
      { status: 500 }
    );
  }
}