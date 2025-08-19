const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkUserProfiles() {
  console.log('🔍 Testing user_profiles insert with minimal data...\n')
  
  try {
    const testData = {
      email: 'test@example.com',
      full_name: 'Test User'
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(testData)
      .select()
    
    if (error) {
      console.log('❌ Insert failed:', error.message)
      console.log('Details:', error.details)
    } else {
      console.log('✅ Insert succeeded!')
      console.log('user_profiles columns:', Object.keys(data[0]))
      
      // Clean up
      await supabase.from('user_profiles').delete().eq('email', 'test@example.com')
      console.log('Test record cleaned up')
    }
  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

checkUserProfiles()
