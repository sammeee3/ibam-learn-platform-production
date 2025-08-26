import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import { MEMBERSHIP_CONFIG, MembershipUtils } from '@/lib/membership-config'
import crypto from 'crypto'

function generateMagicToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Simple email sending function (you can replace with your email service)
async function sendWelcomeEmail(email: string, name: string, magicLink: string) {
  // TODO: Replace with actual email service (SendGrid, Resend, etc.)
  console.log(`
    📧 WELCOME EMAIL WOULD BE SENT:
    To: ${email}
    Subject: Welcome to IBAM - Your Access is Ready!
    
    Hi ${name},
    
    You've been granted access to the IBAM learning platform!
    
    Click here to get started: ${magicLink}
    
    This link will:
    1. Log you in automatically
    2. Let you set your password
    3. Give you full access to your membership
    
    The link expires in 7 days.
    
    Welcome aboard!
    The IBAM Team
  `)
  
  // For now, return success
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, membershipLevel } = await request.json()
    
    // Get membership configuration
    const membershipConfig = MembershipUtils.getTierByKey(membershipLevel)
    if (!membershipConfig) {
      return NextResponse.json({ error: 'Invalid membership level' }, { status: 400 })
    }
    
    // Check if user exists
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = authUsers?.users?.find((user: any) => user.email === email)
    
    if (existingUser) {
      // User exists - just update their membership
      await supabaseAdmin
        .from('user_profiles')
        .update({
          membership_level: membershipLevel,
          membership_features: membershipConfig.features,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
      
      return NextResponse.json({
        success: true,
        message: 'User already exists - membership updated'
      })
    }
    
    // Create new auth user
    const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        created_by: 'admin_quick_add'
      }
    })
    
    if (authError) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }
    
    // Generate magic token
    const magicToken = generateMagicToken()
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    // Create user profile
    const profileData = {
      auth_user_id: newAuthUser.user.id,
      email: email,
      first_name: firstName,
      last_name: lastName || '',
      has_platform_access: true,
      is_active: true,
      created_via: 'admin_quick_add',
      login_source: 'direct',
      membership_level: membershipLevel,
      membership_features: membershipConfig.features,
      magic_token: magicToken,
      magic_token_expires_at: tokenExpiry.toISOString(),
      password_set: false,
      subscription_status: 'active',
      // Set trial end date if applicable
      trial_ends_at: membershipConfig.trialDays 
        ? MembershipUtils.getTrialEndDate(membershipLevel).toISOString()
        : null
    }
    
    await supabaseAdmin.from('user_profiles').insert(profileData)
    
    // Generate magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ibam-learn-platform-staging-v2.vercel.app'
    const magicLink = `${baseUrl}/api/auth/magic-token?token=${magicToken}&email=${encodeURIComponent(email)}&setup=true`
    
    // Send welcome email
    await sendWelcomeEmail(email, firstName, magicLink)
    
    return NextResponse.json({
      success: true,
      message: 'User added successfully! Email sent.',
      magicLink: magicLink // Include for testing purposes
    })
    
  } catch (error) {
    console.error('Error in quick-add user:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}