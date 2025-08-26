import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email, name, magicLink } = await request.json()
    
    if (!email || !name || !magicLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const result = await sendWelcomeEmail(email, name, magicLink)
    
    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      console.error('Email send failed:', result.error)
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send welcome email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}