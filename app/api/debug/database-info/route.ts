import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
        supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
        supabaseKey: supabaseKey ? 'Present' : 'Missing'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Extract project ID from URL
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
    const projectId = urlMatch ? urlMatch[1] : 'Unknown'

    // Get database info
    const [userCount, profileCount, authUsers] = await Promise.all([
      // Count users in auth.users
      supabase.from('auth.users').select('*', { count: 'exact', head: true }),
      
      // Count user profiles
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      
      // Get recent users for verification
      supabase.from('user_profiles')
        .select('id, first_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Determine environment based on project ID
    let environment = 'UNKNOWN'
    let expectedDB = 'UNKNOWN'
    
    if (projectId === 'yhfxxouswctucxvfetcq') {
      environment = 'STAGING'
      expectedDB = 'staging'
    } else if (projectId === 'tutrnikhomrgcpkzszvq') {
      environment = 'PRODUCTION'
      expectedDB = 'production'
    }

    // Check for environment mismatch
    const hostname = process.env.VERCEL_URL || 'localhost'
    let deploymentEnvironment = 'LOCAL'
    
    if (hostname.includes('staging')) {
      deploymentEnvironment = 'STAGING'
    } else if (hostname.includes('production')) {
      deploymentEnvironment = 'PRODUCTION'
    }

    const environmentMatch = environment === deploymentEnvironment

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: {
        projectId,
        environment,
        expectedDB,
        supabaseUrl: supabaseUrl.replace(/https:\/\//, '').split('.')[0] + '.supabase.co',
        connectionStatus: 'Connected'
      },
      deployment: {
        hostname,
        deploymentEnvironment,
        environmentMatch,
        warning: environmentMatch ? null : '⚠️ ENVIRONMENT MISMATCH DETECTED!'
      },
      statistics: {
        authUsersCount: userCount.count || 0,
        userProfilesCount: profileCount.count || 0,
        lastError: userCount.error || profileCount.error || authUsers.error
      },
      recentUsers: authUsers.data || [],
      debug: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        timestamp: Date.now()
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Database connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}