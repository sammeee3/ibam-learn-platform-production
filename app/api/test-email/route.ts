import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email-service'

export async function GET(request: NextRequest) {
  try {
    // Get email from query params
    const url = new URL(request.url)
    const email = url.searchParams.get('email') || 'test@example.com'
    const name = url.searchParams.get('name') || 'Test User'
    const magicLink = 'https://example.com/test-link'

    console.log('🧪 Testing email service with:', { email, name })

    // Check environment variables
    const hasResendKey = !!process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM
    const emailReplyTo = process.env.EMAIL_REPLY_TO

    console.log('📧 Email service config:', {
      hasResendKey,
      emailFrom,
      emailReplyTo,
      nodeEnv: process.env.NODE_ENV
    })

    if (!hasResendKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured',
        config: { hasResendKey, emailFrom, emailReplyTo }
      }, { status: 500 })
    }

    // Send test email
    const result = await sendWelcomeEmail(email, name, magicLink)
    
    console.log('📬 Email send result:', result)

    return NextResponse.json({
      success: true,
      result,
      config: { hasResendKey, emailFrom, emailReplyTo }
    })

  } catch (error) {
    console.error('❌ Email test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    const result = await sendWelcomeEmail(
      email || 'test@example.com', 
      name || 'Test User', 
      'https://example.com/test-link'
    )
    
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}