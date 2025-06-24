const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function replicateSignupPage() {
  console.log('🔍 Replicating signup page flow exactly...\n')
  
  try {
    // Step 1: Replicate enhanced-auth signUp method
    console.log('1. Testing enhanced-auth signUp method...')
    const email = `test${Date.now()}@gmail.com`
    const password = 'TestPass123!'
    const metadata = { full_name: 'Test User Name' }
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    
    if (signUpError) {
      console.log('❌ SignUp failed:', signUpError.message)
      return
    }
    
    console.log('✅ SignUp successful')
    console.log('User ID:', data.user?.id)
    console.log('User email:', data.user?.email)
    console.log('User metadata:', data.user?.user_metadata)
    
    // Step 2: Test createUserProfile exactly like signup page
    if (data.user) {
      console.log('\n2. Testing createUserProfile with exact same data...')
      
      // Replicate the enhanced-auth createUserProfile function exactly
      const authUser = data.user
      const tierKey = 'trial'
      
      console.log('Auth user object:', {
        id: authUser.id,
        email: authUser.email,
        user_metadata: authUser.user_metadata
      })
      
      const profileData = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        subscription_tier: tierKey,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        onboarding_completed: false,
        assessment_completed: false,
        current_course_module: 1,
        ai_interaction_count: 0,
        coaching_preferences: {},
        tier_config_cache: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('Profile data to insert:', profileData)
      
      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message)
        console.log('Error code:', profileError.code)
        console.log('Full error:', JSON.stringify(profileError, null, 2))
      } else {
        console.log('✅ Profile creation successful!')
        console.log('Profile ID:', profileResult.id)
        console.log('Profile data:', profileResult)
      }
    }
    
  } catch (err) {
    console.log('❌ Test failed:', err.message)
    console.log('Stack trace:', err.stack)
  }
}

replicateSignupPage()
