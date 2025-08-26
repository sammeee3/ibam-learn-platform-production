import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import crypto from 'crypto'

function generateMagicToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Email sending (replace with your service)
async function sendMagicLinkEmail(email: string, name: string, magicLink: string) {
  console.log(`
    📧 MAGIC LINK EMAIL:
    To: ${email}
    Subject: Your IBAM Login Link
    
    Hi ${name || 'there'},
    
    Click here to log in to IBAM:
    ${magicLink}
    
    This link expires in 24 hours.
    
    If you didn't request this, please ignore this email.
    
    The IBAM Team
  `)
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    
    // Check if user exists
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (!profile) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }
    
    // Generate new magic token
    const magicToken = generateMagicToken()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Update profile with new token
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        magic_token: magicToken,
        magic_token_expires_at: tokenExpiry.toISOString(),
        last_magic_link_sent: new Date().toISOString()
      })
      .eq('email', email)
    
    if (updateError) {
      console.error('Failed to update magic token:', updateError)
      return NextResponse.json({ error: 'Failed to generate login link' }, { status: 500 })
    }
    
    // Generate magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ibam-learn-platform-staging-v2.vercel.app'
    const magicLink = `${baseUrl}/api/auth/magic-token?token=${magicToken}&email=${encodeURIComponent(email)}`
    
    // Send email
    await sendMagicLinkEmail(
      email,
      `${profile.first_name} ${profile.last_name}`.trim(),
      magicLink
    )
    
    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    })
    
  } catch (error) {
    console.error('Error sending magic link:', error)
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 })
  }
}