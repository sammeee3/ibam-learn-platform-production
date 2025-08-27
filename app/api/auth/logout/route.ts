import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Processing logout request')
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Supabase signOut error:', error)
    }
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    
    // Clear all auth cookies comprehensively
    const cookiesToClear = [
      'ibam_auth',
      'ibam_auth_server',
      'ibam-auth-token',
      'ibam-session',
      'ibam-user',
      'sb-access-token',
      'sb-refresh-token'
    ]
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: false, // Allow both httpOnly and regular cookies
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      })
    })
    
    console.log('✅ Logout successful - all sessions cleared')
    
    return response
  } catch (error: any) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Support GET method for direct navigation
  return POST(request)
}
