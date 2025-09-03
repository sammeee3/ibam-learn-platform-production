import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import { MEMBERSHIP_CONFIG, MembershipUtils } from '@/lib/membership-config'
import { sendWelcomeEmail } from '@/lib/email-service'
import crypto from 'crypto'

function generateMagicToken(): string {
  return crypto.randomBytes(32).toString('hex')
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
    console.log('📧 QUICK ADD DEBUG: About to send email to:', email, 'with name:', firstName)
    const emailResult = await sendWelcomeEmail(email, firstName, magicLink)
    console.log('📬 QUICK ADD DEBUG: Email send result:', emailResult)
    
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