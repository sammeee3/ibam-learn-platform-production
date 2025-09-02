import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 Syncing missing user profiles in staging...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      throw new Error(`Failed to get auth users: ${authError.message}`)
    }

    // Get existing user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email')

    if (profilesError) {
      console.error('Profile query error:', profilesError)
      throw new Error(`Failed to get profiles: ${profilesError.message}`)
    }

    console.log(`Found ${profiles?.length || 0} existing profiles in database`)

    const existingProfileEmails = new Set(profiles?.map(p => p.email) || [])
    const authUsers = authData?.users || []
    
    console.log(`Found ${authUsers.length} auth users, ${profiles?.length || 0} existing profiles`)

    // Find users missing profiles - FORCE CREATION FOR TESTING
    const missingProfileUsers = authUsers.filter(user => 
      user.email && !existingProfileEmails.has(user.email)
    )

    // Create all missing profiles normally

    console.log(`Missing profiles: ${missingProfileUsers.length}`)
    console.log(`First few missing:`, missingProfileUsers.slice(0, 3).map(u => u.email))

    console.log(`Creating ${missingProfileUsers.length} missing profiles...`)

    const results: Array<{
      email: string | undefined
      status: string
      error?: string
      membership?: string
    }> = []

    // Create missing profiles
    for (const user of missingProfileUsers) {
      console.log(`Creating profile for: ${user.email}`)
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.email === 'sammeee@yahoo.com' ? 'Jeff Samuelson' : 
                    user.email?.includes('test') ? `Test User (${user.email})` :
                    `User (${user.email})`,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error(`Failed to create profile for ${user.email}:`, insertError.message)
        results.push({
          email: user.email,
          status: 'failed',
          error: insertError.message
        })
      } else {
        console.log(`✅ Created profile for ${user.email}`)
        results.push({
          email: user.email,
          status: 'created'
        })
      }
    }

    const successCount = results.filter(r => r.status === 'created').length
    const failCount = results.filter(r => r.status === 'failed').length

    console.log(`🎉 Profile sync complete: ${successCount} created, ${failCount} failed`)
    
    return NextResponse.json({
      success: true,
      message: `Profile sync complete: ${successCount} profiles created, ${failCount} failed`,
      summary: {
        totalAuthUsers: authUsers.length,
        existingProfiles: profiles?.length || 0,
        missingProfiles: missingProfileUsers.length,
        profilesCreated: successCount,
        failed: failCount
      },
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Profile sync failed:', error)
    return NextResponse.json(
      { 
        error: 'Profile sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}