import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, membershipTier } = await request.json()
    
    console.log(`🔄 Updating membership tier for: ${email} to ${membershipTier}`)
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update user profile with correct membership tier
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        membership_tier: membershipTier,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({
        success: false,
        error: updateError.message
      })
    }

    console.log(`✅ Updated ${email} to ${membershipTier}`)
    
    return NextResponse.json({
      success: true,
      message: `Updated ${email} to ${membershipTier}`
    })

  } catch (error) {
    console.error('❌ Update failed:', error)
    return NextResponse.json(
      { 
        error: 'Update failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}