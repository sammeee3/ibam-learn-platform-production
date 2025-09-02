import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🧪 Testing profile creation...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Try to create a test profile with minimal data
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        email: 'sammeee@yahoo.com',
        full_name: 'Jeff Samuelson'
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({
        success: false,
        error: insertError.message,
        details: insertError
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Test profile created successfully'
    })

  } catch (error) {
    console.error('❌ Test error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}