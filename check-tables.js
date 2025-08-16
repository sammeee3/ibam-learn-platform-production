const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkTableStructure() {
  console.log('🔍 Checking IBAM Database Table Structures...\n')
  
  try {
    console.log('1. user_profiles table structure:')
    const { data: userProfiles, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (userError) {
      console.log('❌ Error accessing user_profiles:', userError.message)
    } else {
      if (userProfiles && userProfiles.length > 0) {
        console.log('✅ user_profiles columns:', Object.keys(userProfiles[0]))
      } else {
        console.log('✅ user_profiles table exists but is empty (normal)')
      }
    }
  } catch (err) {
    console.log('❌ user_profiles check failed:', err.message)
  }
  
  try {
    console.log('\n2. member_types table structure:')
    const { data: memberTypes, error: memberError } = await supabase
      .from('member_types')
      .select('*')
      .limit(1)
    
    if (memberError) {
      console.log('❌ Error accessing member_types:', memberError.message)
      console.log('   This is likely why signup fails!')
    } else {
      if (memberTypes && memberTypes.length > 0) {
        console.log('✅ member_types columns:', Object.keys(memberTypes[0]))
      } else {
        console.log('✅ member_types table exists but is empty')
      }
    }
  } catch (err) {
    console.log('❌ member_types check failed:', err.message)
  }
}

checkTableStructure()
