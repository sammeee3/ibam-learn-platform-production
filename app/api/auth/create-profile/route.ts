import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-config'

export async function POST(request: NextRequest) {
  try {
    const { email, auth_user_id } = await request.json()

    // Validate required fields
    if (!email || !auth_user_id) {
      return NextResponse.json(
        { error: 'Email and auth_user_id are required' },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists', profileId: existingProfile.id },
        { status: 200 }
      )
    }

    // Create user profile for signup users with minimal required fields
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        auth_user_id,
        email,
        is_active: true,
        has_platform_access: true,
        created_via_webhook: false
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      console.error('Profile error details:', JSON.stringify(profileError, null, 2))
      return NextResponse.json(
        { 
          error: 'Failed to create user profile',
          details: profileError.message || 'Unknown database error',
          code: profileError.code
        },
        { status: 500 }
      )
    }

    console.log(`✅ User profile created for signup: ${email}`)

    return NextResponse.json(
      { 
        message: 'Profile created successfully',
        profileId: newProfile.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}