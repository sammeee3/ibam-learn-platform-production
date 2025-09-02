import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('📋 Listing all users in staging database...')
    
    // Connect to staging database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all user profiles
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, membership_tier, created_at')
      .order('created_at', { ascending: false })

    if (profileError) {
      console.error('Error fetching user profiles:', profileError)
    }

    // Get auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error fetching auth users:', authError)
    }

    console.log(`Found ${userProfiles?.length || 0} user profiles`)
    console.log(`Found ${authData?.users?.length || 0} auth users`)
    
    return NextResponse.json({
      success: true,
      userProfiles: userProfiles || [],
      authUsers: authData?.users?.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        provider: user.app_metadata?.provider
      })) || [],
      counts: {
        profiles: userProfiles?.length || 0,
        authUsers: authData?.users?.length || 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error listing users:', error)
    return NextResponse.json(
      { 
        error: 'Failed to list users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}