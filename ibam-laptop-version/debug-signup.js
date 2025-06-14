const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testSignupFlow() {
  console.log('🔍 Testing complete signup flow...\n')
  
  try {
    console.log('1. Testing Supabase Auth signup...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'debugtest@example.com',
      password: 'testpass123'
    })
    
    if (authError) {
      console.log('❌ Auth signup failed:', authError.message)
      return
    }
    
    console.log('✅ Auth signup successful')
    console.log('User ID:', authData.user?.id)
    
    if (authData.user) {
      console.log('\n2. Testing user profile creation...')
      const profileData = {
        id: authData.user.id,
        email: 'debugtest@example.com',
        full_name: 'Debug Test User',
        subscription_tier: 'trial'
      }
      
      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
      
      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message)
        console.log('Full error:', JSON.stringify(profileError, null, 2))
      } else {
        console.log('✅ Profile creation successful!')
        console.log('Profile created:', profileResult)
      }
    }
    
  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

testSignupFlow()
