const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function analyzeOnboardingGaps() {
  console.log('🔍 ANALYZING USER ONBOARDING GAPS');
  console.log('=' .repeat(50));

  const { data: users } = await supabase.from('user_profiles').select('*');

  // Analyze onboarding completion
  const incompleteProfiles = users.filter(u => !u.first_name || !u.last_name);
  const noBusinessInfo = users.filter(u => !u.business_name && !u.goals);
  const noOnboarding = users.filter(u => !u.onboarding_completed);

  console.log(`\n📊 ONBOARDING ANALYSIS (${users.length} total users):`);
  console.log(`❌ Incomplete names: ${incompleteProfiles.length} (${Math.round(incompleteProfiles.length/users.length*100)}%)`);
  console.log(`💼 No business info: ${noBusinessInfo.length} (${Math.round(noBusinessInfo.length/users.length*100)}%)`);
  console.log(`📋 Incomplete onboarding: ${noOnboarding.length} (${Math.round(noOnboarding.length/users.length*100)}%)`);

  return { incompleteProfiles, noBusinessInfo, noOnboarding };
}

async function improveUserProfiles() {
  console.log('\n🔧 IMPROVING USER PROFILES');
  console.log('-' .repeat(40));

  const { data: users } = await supabase.from('user_profiles').select('*');

  for (const user of users) {
    let updates = {};
    let needsUpdate = false;

    // Fix missing names
    if (!user.first_name) {
      const emailName = user.email.split('@')[0];
      const nameParts = emailName.split(/[+._-]/);
      updates.first_name = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      needsUpdate = true;
    }

    if (!user.last_name && user.first_name !== 'User') {
      updates.last_name = 'Member'; // Default last name
      needsUpdate = true;
    }

    // Set default business goals based on user source
    if (!user.goals) {
      if (user.created_via_webhook) {
        updates.goals = 'Complete faith-driven business training and apply biblical principles to business operations';
      } else {
        updates.goals = 'Explore intersection of faith and business through IBAM platform';
      }
      needsUpdate = true;
    }

    // Set default business stage
    if (!user.business_stage) {
      updates.business_stage = user.created_via_webhook ? 'startup' : 'exploring';
      needsUpdate = true;
    }

    // Set subscription tier if missing
    if (!user.subscription_tier || user.subscription_tier === 'free') {
      updates.subscription_tier = 'impact_member';
      needsUpdate = true;
    }

    if (needsUpdate) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) {
          console.log(`❌ Failed to update ${user.email}: ${error.message}`);
        } else {
          console.log(`✅ Updated ${user.email}: ${Object.keys(updates).join(', ')}`);
        }
      } catch (e) {
        console.log(`💥 Error updating ${user.email}: ${e.message}`);
      }
    }
  }
}

async function createOnboardingChecklist() {
  console.log('\n📋 CREATING ONBOARDING CHECKLIST');
  console.log('-' .repeat(40));

  const { data: users } = await supabase.from('user_profiles').select('*');

  console.log('\nOnboarding Status for Each User:');
  
  users.forEach((user, i) => {
    console.log(`\n${i + 1}. ${user.email} (${user.first_name || 'No'} ${user.last_name || 'name'})`);
    
    const checklist = [
      { item: 'Complete name', status: !!(user.first_name && user.last_name) },
      { item: 'Business goals set', status: !!user.goals },
      { item: 'Business stage defined', status: !!user.business_stage },
      { item: 'Platform access', status: user.has_platform_access },
      { item: 'Magic token (if webhook)', status: !user.created_via_webhook || !!user.magic_token },
      { item: 'Active status', status: user.is_active }
    ];

    checklist.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      console.log(`   ${icon} ${check.item}`);
    });

    const completionRate = Math.round((checklist.filter(c => c.status).length / checklist.length) * 100);
    console.log(`   📊 Completion: ${completionRate}%`);
  });
}

async function generateOnboardingRecommendations() {
  console.log('\n💡 ONBOARDING RECOMMENDATIONS');
  console.log('-' .repeat(40));

  const { data: users } = await supabase.from('user_profiles').select('*');
  
  const recommendations = [];

  // Check for common issues
  const webhookUsers = users.filter(u => u.created_via_webhook);
  const directUsers = users.filter(u => !u.created_via_webhook);
  const expiredTokens = users.filter(u => u.magic_token && new Date(u.magic_token_expires_at) < new Date());

  if (webhookUsers.length > 0) {
    recommendations.push('🤖 Webhook Integration: Working! ' + webhookUsers.length + ' users created via System.io');
  }

  if (expiredTokens.length > 0) {
    recommendations.push('⏰ Token Refresh: ' + expiredTokens.length + ' users have expired magic tokens');
  }

  const incompleteNames = users.filter(u => !u.first_name || !u.last_name).length;
  if (incompleteNames > 0) {
    recommendations.push('📝 Name Completion: Implement name collection during first login');
  }

  const noGoals = users.filter(u => !u.goals).length;
  if (noGoals > 0) {
    recommendations.push('🎯 Goal Setting: Add business goals wizard to onboarding flow');
  }

  console.log('\n🚀 Action Items:');
  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  console.log('\n📈 Platform Health:');
  console.log(`✅ Total Users: ${users.length}`);
  console.log(`🤖 Webhook Users: ${webhookUsers.length}`);
  console.log(`👤 Direct Signups: ${directUsers.length}`);
  console.log(`🔑 Active Tokens: ${users.filter(u => u.magic_token && new Date(u.magic_token_expires_at) > new Date()).length}`);
  console.log(`🎯 Users with Goals: ${users.filter(u => u.goals).length}`);
}

async function runOnboardingImprovement() {
  await analyzeOnboardingGaps();
  await improveUserProfiles();
  await createOnboardingChecklist();
  await generateOnboardingRecommendations();
  
  console.log('\n✅ ONBOARDING IMPROVEMENT COMPLETE');
  console.log('Database updated with enhanced user profiles!');
}

// Run the improvement process
runOnboardingImprovement();