import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'
import { MEMBERSHIP_CONFIG, MembershipUtils } from '@/lib/membership-config'
import crypto from 'crypto'

// Generate secure magic token
function generateMagicToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // const isAdmin = await checkAdminAuth(request)
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    const { email, firstName, lastName, membershipLevel, sendWelcomeEmail } = await request.json()
    
    // Validate required fields
    if (!email || !firstName || !membershipLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get membership configuration
    const membershipConfig = MembershipUtils.getTierByKey(membershipLevel)
    if (!membershipConfig) {
      return NextResponse.json(
        { error: 'Invalid membership level' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = authUsers?.users?.find((user: any) => user.email === email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create auth user
    const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        created_by: 'admin',
        membership_level: membershipLevel
      }
    })
    
    if (authError) {
      console.error('Auth user creation failed:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }
    
    // Generate magic token for passwordless login
    const magicToken = generateMagicToken()
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days for admin-created accounts
    
    // Create user profile
    const profileData = {
      auth_user_id: newAuthUser.user.id,
      email: email,
      first_name: firstName,
      last_name: lastName || '',
      has_platform_access: true,
      is_active: true,
      created_via: 'admin',
      login_source: 'direct',
      membership_level: membershipLevel,
      membership_features: membershipConfig.features,
      magic_token: magicToken,
      magic_token_expires_at: tokenExpiry.toISOString(),
      password_set: false, // Important: Track that password needs to be set
      trial_ends_at: membershipLevel === 'trial' 
        ? MembershipUtils.getTrialEndDate(membershipLevel).toISOString()
        : null,
      auto_renew: false, // Admin-created users don't auto-renew by default
      subscription_status: 'active'
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert(profileData)
    
    if (profileError) {
      console.error('Profile creation failed:', profileError)
      // Try to clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(newAuthUser.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }
    
    // Generate magic link for first login
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const magicLink = `${baseUrl}/api/auth/magic-token?token=${magicToken}&email=${encodeURIComponent(email)}&setup=true`
    
    // Send welcome email if requested
    if (sendWelcomeEmail) {
      // TODO: Implement email sending
      console.log(`Welcome email would be sent to ${email} with magic link: ${magicLink}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        membershipLevel: membershipLevel
      },
      magicLink: magicLink,
      instructions: 'User can click the magic link to log in and will be prompted to set a password on first access.'
    })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}