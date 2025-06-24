import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const email = searchParams.get('email') || 'test@ibam.org'
    const firstName = searchParams.get('first') || 'Test'
    const lastName = searchParams.get('last') || 'User'
    const userId = searchParams.get('userid') || 'test-123'
    
    console.log('Bridge received:', { email, firstName, lastName, userId })

    const sessionSecret = 'ibam_super_secret_key_2025_jwt_authentication_system'
    
    const tokenData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      systemIOUserId: userId,
      subscriptionStatus: 'active',
      courseAccess: ['ibam-fundamentals'],
      iss: 'system.io',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }

    const token = jwt.sign(tokenData, sessionSecret)
    
    const ssoUrl = new URL('/api/auth/sso', request.url)
    ssoUrl.searchParams.set('token', token)
    
    return NextResponse.redirect(ssoUrl)

  } catch (error) {
    console.error('Bridge Error:', error)
    return NextResponse.json({ 
      error: 'Bridge endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
