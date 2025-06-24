import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 })
  }

  try {
    const decoded = jwt.decode(token) as any
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }

    // Hardcoded secrets for launch (secure - server-side only)
    const sessionSecret = process.env.NEXTAUTH_SECRET || 'ibam_super_secret_key_2025_jwt_authentication_system'

    const sessionData = {
      userId: decoded.systemIOUserId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      subscriptionStatus: decoded.subscriptionStatus,
      courseAccess: decoded.courseAccess
    }

    const sessionToken = jwt.sign(sessionData, sessionSecret, {
      expiresIn: '7d',
      issuer: 'ibam.org'
    })

    // Create redirect response to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Set secure session cookies
    response.cookies.set('ibam-session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    response.cookies.set('ibam-user', decoded.firstName, {
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    console.log(`SSO Success: ${decoded.email} authenticated from System.io`)
    return response

  } catch (error) {
    console.error('SSO Error:', error)
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 })
  }
}
