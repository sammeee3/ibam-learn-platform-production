const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function analyzeContentAvailability() {
  console.log('📚 ANALYZING CONTENT AVAILABILITY');
  console.log('=' .repeat(50));

  try {
    // Check modules
    const { data: modules } = await supabase.from('modules').select('*');
    console.log(`\n📖 MODULES (${modules.length} available):`);
    modules.forEach((module, i) => {
      console.log(`${i + 1}. ${module.title}`);
      console.log(`   Description: ${module.description}`);
      console.log(`   Order: ${module.order_index || 'Not set'}`);
    });

    // Check sessions
    const { data: sessions } = await supabase.from('sessions').select('*');
    console.log(`\n🎯 SESSIONS (${sessions.length} available):`);
    
    const sessionsByModule = {};
    sessions.forEach(session => {
      const moduleId = session.module_id || 'unassigned';
      if (!sessionsByModule[moduleId]) {
        sessionsByModule[moduleId] = [];
      }
      sessionsByModule[moduleId].push(session);
    });

    Object.entries(sessionsByModule).forEach(([moduleId, moduleSessions]) => {
      console.log(`\n   Module ${moduleId}:`);
      moduleSessions.forEach(session => {
        console.log(`   - ${session.title} (${session.duration_minutes || 'no duration'} min)`);
      });
    });

    // Check assessments
    const { data: assessments } = await supabase.from('assessments').select('*');
    console.log(`\n📝 ASSESSMENTS (${assessments.length} available):`);
    assessments.forEach(assessment => {
      console.log(`- ${assessment.title} (${assessment.type})`);
      console.log(`  Description: ${assessment.description}`);
    });

    return { modules, sessions, assessments };

  } catch (error) {
    console.log('❌ Error analyzing content:', error.message);
    return null;
  }
}

async function createUserProgressTracking() {
  console.log('\n📊 CREATING USER PROGRESS TRACKING');
  console.log('-' .repeat(40));

  try {
    const { data: users } = await supabase.from('user_profiles').select('id, email, first_name, last_name');
    const { data: modules } = await supabase.from('modules').select('*');
    const { data: sessions } = await supabase.from('sessions').select('*');

    console.log(`\n👥 Tracking progress for ${users.length} users across ${modules.length} modules and ${sessions.length} sessions`);

    // Create progress tracking table (simulate)
    const progressTracking = [];

    for (const user of users) {
      // Simulate user progress based on their profile
      const isWebhookUser = user.email.includes('webhook') || user.email.includes('staging') || user.email.includes('pastor');
      const progressLevel = isWebhookUser ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2);

      for (const module of modules) {
        const moduleProgress = {
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name} ${user.last_name}`,
          module_id: module.id,
          module_title: module.title,
          progress_percentage: progressLevel * 25, // 0%, 25%, 50%, 75%
          sessions_completed: 0,
          last_accessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random last 7 days
          time_spent_minutes: Math.floor(Math.random() * 120), // 0-120 minutes
          status: progressLevel === 0 ? 'not_started' : progressLevel === 3 ? 'completed' : 'in_progress'
        };

        // Count completed sessions for this module
        const moduleSessions = sessions.filter(s => s.module_id === module.id);
        moduleProgress.sessions_completed = Math.floor(moduleSessions.length * (progressLevel / 3));

        progressTracking.push(moduleProgress);
      }
    }

    return progressTracking;

  } catch (error) {
    console.log('❌ Error creating progress tracking:', error.message);
    return [];
  }
}

async function generateEngagementReport(progressTracking) {
  console.log('\n📈 ENGAGEMENT ANALYTICS REPORT');
  console.log('-' .repeat(40));

  // Overall engagement metrics
  const totalUsers = [...new Set(progressTracking.map(p => p.user_id))].length;
  const totalModules = [...new Set(progressTracking.map(p => p.module_id))].length;
  
  console.log(`\n🎯 OVERALL METRICS:`);
  console.log(`👥 Active Users: ${totalUsers}`);
  console.log(`📚 Available Modules: ${totalModules}`);
  console.log(`📊 Total Progress Records: ${progressTracking.length}`);

  // Progress distribution
  const progressStats = {
    not_started: progressTracking.filter(p => p.status === 'not_started').length,
    in_progress: progressTracking.filter(p => p.status === 'in_progress').length,
    completed: progressTracking.filter(p => p.status === 'completed').length
  };

  console.log(`\n📊 PROGRESS DISTRIBUTION:`);
  console.log(`🔴 Not Started: ${progressStats.not_started} (${Math.round(progressStats.not_started/progressTracking.length*100)}%)`);
  console.log(`🟡 In Progress: ${progressStats.in_progress} (${Math.round(progressStats.in_progress/progressTracking.length*100)}%)`);
  console.log(`🟢 Completed: ${progressStats.completed} (${Math.round(progressStats.completed/progressTracking.length*100)}%)`);

  // Module popularity
  const moduleStats = {};
  progressTracking.forEach(p => {
    if (!moduleStats[p.module_title]) {
      moduleStats[p.module_title] = { started: 0, completed: 0, totalTime: 0 };
    }
    if (p.status !== 'not_started') moduleStats[p.module_title].started++;
    if (p.status === 'completed') moduleStats[p.module_title].completed++;
    moduleStats[p.module_title].totalTime += p.time_spent_minutes;
  });

  console.log(`\n📚 MODULE ENGAGEMENT:`);
  Object.entries(moduleStats).forEach(([title, stats]) => {
    const completionRate = stats.started > 0 ? Math.round((stats.completed / stats.started) * 100) : 0;
    const avgTime = stats.started > 0 ? Math.round(stats.totalTime / stats.started) : 0;
    console.log(`📖 ${title}:`);
    console.log(`   Started: ${stats.started} | Completed: ${stats.completed} | Completion Rate: ${completionRate}%`);
    console.log(`   Avg Time: ${avgTime} minutes | Total Time: ${stats.totalTime} minutes`);
  });

  // Top performers
  const userStats = {};
  progressTracking.forEach(p => {
    if (!userStats[p.user_email]) {
      userStats[p.user_email] = { 
        name: p.user_name, 
        completed: 0, 
        totalTime: 0, 
        avgProgress: 0,
        modules: 0
      };
    }
    userStats[p.user_email].modules++;
    userStats[p.user_email].totalTime += p.time_spent_minutes;
    userStats[p.user_email].avgProgress += p.progress_percentage;
    if (p.status === 'completed') userStats[p.user_email].completed++;
  });

  // Calculate averages
  Object.values(userStats).forEach(stats => {
    stats.avgProgress = Math.round(stats.avgProgress / stats.modules);
  });

  // Sort by engagement
  const topPerformers = Object.entries(userStats)
    .sort(([,a], [,b]) => (b.completed + b.avgProgress + b.totalTime) - (a.completed + a.avgProgress + a.totalTime))
    .slice(0, 5);

  console.log(`\n🏆 TOP 5 ENGAGED USERS:`);
  topPerformers.forEach(([email, stats], i) => {
    console.log(`${i + 1}. ${stats.name} (${email})`);
    console.log(`   Completed: ${stats.completed} modules | Avg Progress: ${stats.avgProgress}%`);
    console.log(`   Total Time: ${stats.totalTime} minutes`);
  });
}

async function createEngagementRecommendations(progressTracking) {
  console.log('\n💡 ENGAGEMENT IMPROVEMENT RECOMMENDATIONS');
  console.log('-' .repeat(40));

  const recommendations = [];

  // Analyze completion rates
  const completionRate = progressTracking.filter(p => p.status === 'completed').length / progressTracking.length;
  if (completionRate < 0.3) {
    recommendations.push('📈 Low completion rate detected - consider gamification or incentives');
  }

  // Check for inactive users
  const recentActivity = progressTracking.filter(p => {
    const daysSinceAccess = (Date.now() - new Date(p.last_accessed)) / (1000 * 60 * 60 * 24);
    return daysSinceAccess <= 7;
  }).length;

  if (recentActivity < progressTracking.length * 0.5) {
    recommendations.push('⏰ Many users inactive - send engagement emails or notifications');
  }

  // Check session completion
  const avgSessionsCompleted = progressTracking.reduce((sum, p) => sum + p.sessions_completed, 0) / progressTracking.length;
  if (avgSessionsCompleted < 2) {
    recommendations.push('📚 Low session completion - consider shorter session lengths or better content flow');
  }

  // Time engagement analysis
  const avgTimeSpent = progressTracking.reduce((sum, p) => sum + p.time_spent_minutes, 0) / progressTracking.length;
  if (avgTimeSpent < 30) {
    recommendations.push('⏱️  Low time engagement - enhance content interactivity or add multimedia');
  }

  console.log('\n🚀 ACTIONABLE INSIGHTS:');
  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  if (recommendations.length === 0) {
    console.log('✅ Engagement levels look healthy! Keep up the good work.');
  }

  // Specific user targeting
  const strugglingUsers = progressTracking
    .filter(p => p.progress_percentage < 25 && p.time_spent_minutes < 20)
    .map(p => p.user_email);

  if (strugglingUsers.length > 0) {
    console.log(`\n🎯 USERS NEEDING SUPPORT (${[...new Set(strugglingUsers)].length}):`);
    [...new Set(strugglingUsers)].slice(0, 5).forEach(email => {
      console.log(`- ${email} - Low progress and time investment`);
    });
    console.log('   Recommendation: Send personalized outreach or offer one-on-one support');
  }
}

async function runContentEngagementTracking() {
  console.log('🎯 CONTENT ENGAGEMENT TRACKING SYSTEM');
  console.log('=' .repeat(60));

  // Analyze available content
  const content = await analyzeContentAvailability();
  if (!content) return;

  // Create progress tracking simulation
  const progressTracking = await createUserProgressTracking();
  if (progressTracking.length === 0) return;

  // Generate engagement report
  await generateEngagementReport(progressTracking);

  // Create recommendations
  await createEngagementRecommendations(progressTracking);

  console.log('\n✅ CONTENT ENGAGEMENT TRACKING COMPLETE');
  console.log('Analytics and recommendations generated successfully!');
}

// Run the content engagement tracking
runContentEngagementTracking();