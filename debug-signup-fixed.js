const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testSignupFlow() {
  console.log('🔍 Testing complete signup flow...\n')
  
  try {
    // Use a more realistic email that Supabase will accept
    const testEmail = `test${Date.now()}@gmail.com`
    console.log('Testing with email:', testEmail)
    
    console.log('\n1. Testing Supabase Auth signup...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPass123!'
    })
    
    if (authError) {
      console.log('❌ Auth signup failed:', authError.message)
      console.log('Error details:', authError)
      return
    }
    
    console.log('✅ Auth signup successful')
    console.log('User ID:', authData.user?.id)
    console.log('Email confirmation required:', !authData.session)
    
    if (authData.user) {
      console.log('\n2. Testing user profile creation with correct table...')
      const profileData = {
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test User',
        subscription_tier: 'trial'
      }
      
      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')  // Using correct table name
        .insert(profileData)
        .select()
      
      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message)
        console.log('Error code:', profileError.code)
        console.log('Full error:', JSON.stringify(profileError, null, 2))
      } else {
        console.log('✅ Profile creation successful!')
        console.log('Profile ID:', profileResult[0]?.id)
        
        // Clean up test record
        await supabase.from('user_profiles').delete().eq('email', testEmail)
        console.log('Test record cleaned up')
      }
    }
    
  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

testSignupFlow()
