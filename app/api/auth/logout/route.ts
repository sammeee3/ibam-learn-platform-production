import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set('ibam-session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
  
  response.cookies.set('ibam-user', '', {
    secure: true,
    sameSite: 'lax', 
    path: '/',
    maxAge: 0
  })

  return response
}
