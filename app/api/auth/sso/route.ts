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

    // Create session data
    const sessionData = {
      userId: decoded.systemIOUserId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      subscriptionStatus: decoded.subscriptionStatus,
      courseAccess: decoded.courseAccess
    }

    // Create session token
    const sessionToken = jwt.sign(sessionData, process.env.NEXTAUTH_SECRET!, {
      expiresIn: '7d',
      issuer: 'ibam.org'
    })

    // Create response with redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    
    // Set session cookies
    response.cookies.set('ibam-session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
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
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
