// test-supabase.js
// Simple test to verify Supabase connection and user_profiles table

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection for IBAM...')
console.log('URL configured:', !!supabaseUrl)
console.log('Key configured:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables!')
  console.log('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  try {
    // Test 1: Check if user_profiles table exists
    console.log('\n1. Testing user_profiles table...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database error:', error.message)
      console.log('Error code:', error.code)
      console.log('Error details:', error.details)
      
      if (error.message.includes('relation "user_profiles" does not exist')) {
        console.log('\n🎯 ISSUE FOUND: user_profiles table does not exist!')
        console.log('This explains why signup is failing.')
        console.log('You need to create the table in Supabase first.')
      }
      
      if (error.code === 'PGRST116') {
        console.log('\n🎯 ISSUE FOUND: Table exists but has no columns or wrong permissions!')
      }
      
      return false
    } else {
      console.log('✅ user_profiles table exists and is accessible!')
      return true
    }
    
  } catch (err) {
    console.log('❌ Connection test failed:', err.message)
    return false
  }
}

async function testMemberTypes() {
  try {
    console.log('\n2. Testing member_types table...')
    const { data, error } = await supabase
      .from('member_types')
      .select('tier_key, display_name')
      .limit(3)
    
    if (error) {
      console.log('❌ member_types error:', error.message)
      if (error.message.includes('relation "member_types" does not exist')) {
        console.log('🎯 member_types table also missing!')
      }
    } else {
      console.log('✅ member_types table exists!')
      if (data && data.length > 0) {
        console.log('Available tiers:', data.map(t => t.tier_key).join(', '))
      }
    }
  } catch (err) {
    console.log('❌ member_types test failed:', err.message)
  }
}

async function runAllTests() {
  console.log('🚀 Running IBAM Database Tests...\n')
  
  const userProfilesExists = await testDatabase()
  await testMemberTypes()
  
  console.log('\n📋 SUMMARY:')
  if (!userProfilesExists) {
    console.log('❌ CRITICAL: user_profiles table missing - this is why signup fails!')
    console.log('✅ NEXT STEP: Create the user_profiles table in Supabase SQL Editor')
  } else {
    console.log('✅ Database tables exist - check your signup code for other issues')
  }
}

runAllTests()