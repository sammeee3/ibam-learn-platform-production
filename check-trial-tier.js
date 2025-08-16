const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkTrialTier() {
  console.log('🔍 Checking if trial tier exists...\n')
  
  const { data, error } = await supabase
    .from('member_types')
    .select('tier_key, display_name, monthly_price')
    .eq('tier_key', 'trial')
  
  if (error) {
    console.log('❌ Error checking trial tier:', error.message)
  } else if (data && data.length > 0) {
    console.log('✅ Trial tier exists:', data[0])
  } else {
    console.log('❌ Trial tier NOT FOUND!')
    console.log('This is likely why signup fails!')
    
    // Show available tiers
    const { data: allTiers } = await supabase
      .from('member_types')
      .select('tier_key, display_name')
    
    console.log('\n📋 Available tiers:')
    allTiers?.forEach(tier => console.log(`  - ${tier.tier_key}: ${tier.display_name}`))
  }
}

checkTrialTier()
