import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('ibam-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const decoded = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET!)
    return NextResponse.json(decoded)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
