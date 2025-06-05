import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 })
  }

  try {
    console.log('1. Token received:', token.substring(0, 50) + '...')
    
    // Check environment variables
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    console.log('2. NEXTAUTH_SECRET exists:', !!nextAuthSecret)
    
    if (!nextAuthSecret) {
      return NextResponse.json({ error: 'Missing NEXTAUTH_SECRET environment variable' }, { status: 500 })
    }

    const decoded = jwt.decode(token) as any
    console.log('3. Token decoded:', !!decoded)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }

    console.log('4. Decoded user:', decoded.email, decoded.firstName)

    // Create session data
    const sessionData = {
      userId: decoded.systemIOUserId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      subscriptionStatus: decoded.subscriptionStatus,
      courseAccess: decoded.courseAccess
    }

    console.log('5. Creating session token...')

    // Create session token
    const sessionToken = jwt.sign(sessionData, nextAuthSecret, {
      expiresIn: '7d',
      issuer: 'ibam.org'
    })

    console.log('6. Session token created successfully')

    // For now, return JSON instead of redirect to test
    return NextResponse.json({
      message: 'Authentication successful!',
      user: sessionData,
      status: 'success'
    })

  } catch (error) {
    console.error('SSO Error details:', error)
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 })
  }
}
