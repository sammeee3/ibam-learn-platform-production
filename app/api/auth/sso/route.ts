import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 })
  }

  try {
    // Simple test first - just decode without full validation
    const decoded = jwt.decode(token) as any
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }

    // For now, just return success to test the endpoint
    return NextResponse.json({ 
      message: 'SSO endpoint working!',
      user: {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      },
      status: 'success'
    })

  } catch (error) {
    console.error('SSO Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
