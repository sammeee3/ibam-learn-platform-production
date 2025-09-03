import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG EMAIL: Starting email debug test')
    
    const body = await request.json()
    const { email, firstName } = body
    
    console.log('📝 DEBUG EMAIL: Request data:', { email, firstName })
    
    // Check environment variables
    const hasResendKey = !!process.env.RESEND_API_KEY
    const emailFrom = process.env.EMAIL_FROM?.trim()
    const emailReplyTo = process.env.EMAIL_REPLY_TO?.trim()
    
    console.log('⚙️ DEBUG EMAIL: Environment check:', {
      hasResendKey,
      emailFrom: emailFrom ? `"${emailFrom}"` : 'NOT SET',
      emailReplyTo: emailReplyTo ? `"${emailReplyTo}"` : 'NOT SET',
      resendKeyLength: process.env.RESEND_API_KEY?.length || 0
    })
    
    if (!hasResendKey) {
      console.error('❌ DEBUG EMAIL: RESEND_API_KEY missing')
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured',
        debug: { hasResendKey, emailFrom, emailReplyTo }
      }, { status: 500 })
    }
    
    // Test magic link
    const magicLink = `https://staging.example.com/test-link`
    
    console.log('📧 DEBUG EMAIL: About to send email...')
    console.log('📧 DEBUG EMAIL: Parameters:', {
      to: email,
      name: firstName,
      magicLink: magicLink
    })
    
    // Send email
    const result = await sendWelcomeEmail(email, firstName, magicLink)
    
    console.log('✉️ DEBUG EMAIL: Send result:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: true,
      result,
      debug: {
        hasResendKey,
        emailFrom,
        emailReplyTo,
        parameters: { email, firstName, magicLink }
      }
    })
    
  } catch (error) {
    console.error('💥 DEBUG EMAIL: Catch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Quick GET test
  return NextResponse.json({
    message: 'Email debug endpoint active',
    timestamp: new Date().toISOString()
  })
}