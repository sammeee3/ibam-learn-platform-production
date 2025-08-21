const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

// Sample business plan templates for different types
const businessPlanTemplates = [
  {
    type: 'Faith-Based Consulting',
    name: 'Kingdom Business Consultancy',
    description: 'Helping Christian entrepreneurs align their business practices with biblical principles',
    mission: 'To empower faith-driven businesses to operate with integrity, stewardship, and kingdom impact',
    vision: 'Creating a marketplace transformation through biblically-grounded business practices',
    values: ['Integrity', 'Stewardship', 'Service', 'Excellence', 'Kingdom Impact'],
    target_market: 'Christian entrepreneurs, faith-based organizations, and businesses seeking ethical guidance',
    services: ['Business ethics consulting', 'Leadership development', 'Strategic planning', 'Team building'],
    revenue_model: 'Consulting fees, workshop facilitation, online course sales',
    startup_costs: 15000,
    monthly_revenue_goal: 8000,
    growth_strategy: 'Build referral network through churches and Christian business associations'
  },
  {
    type: 'Online Ministry Platform',
    name: 'Digital Discipleship Hub',
    description: 'Online platform connecting believers for mentorship, accountability, and spiritual growth',
    mission: 'To facilitate authentic Christian community and discipleship through digital connections',
    vision: 'Every believer connected to meaningful discipleship relationships regardless of location',
    values: ['Authenticity', 'Community', 'Growth', 'Accessibility', 'Biblical Truth'],
    target_market: 'Christians seeking discipleship, church leaders, small group facilitators',
    services: ['Mentorship matching', 'Study resources', 'Prayer networks', 'Community forums'],
    revenue_model: 'Subscription memberships, premium resources, church partnerships',
    startup_costs: 25000,
    monthly_revenue_goal: 12000,
    growth_strategy: 'Partner with churches and Christian organizations for member acquisition'
  },
  {
    type: 'Social Impact Business',
    name: 'Hope & Harvest Coffee',
    description: 'Fair-trade coffee company supporting Christian farmers in developing nations',
    mission: 'To provide sustainable income for Christian farmers while delivering excellent coffee',
    vision: 'Transforming communities one cup at a time through ethical business practices',
    values: ['Fair Trade', 'Community', 'Quality', 'Sustainability', 'Faith'],
    target_market: 'Conscious consumers, churches, Christian bookstores, faith-based organizations',
    services: ['Specialty coffee sales', 'Wholesale to churches', 'Corporate partnerships', 'Impact reporting'],
    revenue_model: 'Direct sales, wholesale accounts, subscription boxes, corporate sales',
    startup_costs: 45000,
    monthly_revenue_goal: 20000,
    growth_strategy: 'Build brand awareness through church partnerships and Christian media'
  },
  {
    type: 'Christian Education',
    name: 'Faith & Finance Academy',
    description: 'Financial literacy education from a biblical stewardship perspective',
    mission: 'Teaching biblical financial principles to help believers prosper and give generously',
    vision: 'Every Christian equipped with biblical financial wisdom and stewardship practices',
    values: ['Biblical Stewardship', 'Financial Freedom', 'Generosity', 'Education', 'Practical Wisdom'],
    target_market: 'Christian families, church groups, young adults, business professionals',
    services: ['Financial courses', 'Budget coaching', 'Investment guidance', 'Debt counseling'],
    revenue_model: 'Course sales, coaching fees, speaking engagements, affiliate partnerships',
    startup_costs: 12000,
    monthly_revenue_goal: 6000,
    growth_strategy: 'Develop relationships with pastors and church financial committees'
  },
  {
    type: 'Creative Ministry',
    name: 'Worship Arts Collective',
    description: 'Creative services and training for churches and Christian artists',
    mission: 'Equipping artists to use their gifts for kingdom impact and church growth',
    vision: 'Every church having access to excellent creative resources and training',
    values: ['Creativity', 'Excellence', 'Worship', 'Collaboration', 'Ministry'],
    target_market: 'Churches, worship leaders, Christian artists, ministry organizations',
    services: ['Graphic design', 'Video production', 'Artist training', 'Creative consultation'],
    revenue_model: 'Project fees, retainer contracts, training workshops, resource licensing',
    startup_costs: 18000,
    monthly_revenue_goal: 9000,
    growth_strategy: 'Network through worship conferences and denominational connections'
  }
];

async function generateBusinessPlansForUsers() {
  console.log('💼 GENERATING BUSINESS PLANS FOR USERS');
  console.log('=' .repeat(50));

  try {
    const { data: users } = await supabase.from('user_profiles').select('*');
    console.log(`\n👥 Found ${users.length} users to create business plans for`);

    // Check current business plans
    const { data: existingPlans } = await supabase.from('business_plans').select('*');
    console.log(`📋 Current business plans in database: ${existingPlans.length}`);

    const createdPlans = [];

    // Create business plans for engaged users
    for (const user of users) {
      // Skip if user already has a plan
      const hasExistingPlan = existingPlans.some(plan => 
        plan.user_id === user.id || plan.created_by === user.email
      );
      
      if (hasExistingPlan) {
        console.log(`ℹ️  ${user.email} already has a business plan, skipping`);
        continue;
      }

      // Select a template based on user characteristics
      let selectedTemplate;
      if (user.email.includes('pastor') || user.email.includes('church')) {
        selectedTemplate = businessPlanTemplates[0]; // Faith-Based Consulting
      } else if (user.email.includes('staging') || user.email.includes('debug')) {
        selectedTemplate = businessPlanTemplates[1]; // Online Ministry Platform
      } else if (user.created_via_webhook) {
        selectedTemplate = businessPlanTemplates[2]; // Social Impact Business
      } else {
        // Randomly select from remaining templates
        const remainingTemplates = businessPlanTemplates.slice(3);
        selectedTemplate = remainingTemplates[Math.floor(Math.random() * remainingTemplates.length)];
      }

      // Personalize the business plan
      const personalizedPlan = {
        ...selectedTemplate,
        name: `${user.first_name}'s ${selectedTemplate.name}`,
        owner_name: `${user.first_name} ${user.last_name}`,
        owner_email: user.email,
        created_by: user.email,
        user_id: user.id,
        status: 'draft',
        completion_percentage: Math.floor(Math.random() * 60) + 20, // 20-80% complete
        last_updated: new Date(),
        financial_projections: {
          year_1_revenue: selectedTemplate.monthly_revenue_goal * 12 * 0.7, // Conservative first year
          year_2_revenue: selectedTemplate.monthly_revenue_goal * 12 * 1.2,
          year_3_revenue: selectedTemplate.monthly_revenue_goal * 12 * 1.8,
          startup_investment: selectedTemplate.startup_costs,
          break_even_month: Math.floor(Math.random() * 12) + 6 // 6-18 months
        },
        next_steps: [
          'Complete market research and validation',
          'Develop minimum viable product',
          'Build initial customer base',
          'Establish legal business structure',
          'Create marketing and sales strategy'
        ],
        biblical_foundation: {
          key_verses: [
            'Proverbs 16:3 - Commit to the Lord whatever you do, and he will establish your plans.',
            'Colossians 3:23 - Whatever you do, work at it with all your heart, as working for the Lord.',
            '1 Corinthians 10:31 - So whether you eat or drink or whatever you do, do it all for the glory of God.'
          ],
          stewardship_principles: [
            'Faithful stewardship of resources and talents',
            'Serving others through excellent products/services',
            'Operating with integrity and transparency',
            'Using profits for kingdom impact and generosity'
          ]
        }
      };

      try {
        // Insert the business plan
        const { data: newPlan, error } = await supabase
          .from('business_plans')
          .insert({
            user_id: user.id,
            name: personalizedPlan.name,
            description: personalizedPlan.description,
            business_type: personalizedPlan.type,
            mission_statement: personalizedPlan.mission,
            vision_statement: personalizedPlan.vision,
            target_market: personalizedPlan.target_market,
            revenue_model: personalizedPlan.revenue_model,
            startup_costs: personalizedPlan.startup_costs,
            monthly_revenue_goal: personalizedPlan.monthly_revenue_goal,
            status: personalizedPlan.status,
            completion_percentage: personalizedPlan.completion_percentage,
            financial_projections: personalizedPlan.financial_projections,
            next_steps: personalizedPlan.next_steps,
            biblical_foundation: personalizedPlan.biblical_foundation,
            created_at: new Date(),
            updated_at: new Date()
          })
          .select()
          .single();

        if (error) {
          console.log(`❌ Failed to create plan for ${user.email}: ${error.message}`);
        } else {
          console.log(`✅ Created business plan for ${user.email}: "${personalizedPlan.name}"`);
          createdPlans.push(newPlan);
        }

      } catch (planError) {
        console.log(`💥 Error creating plan for ${user.email}: ${planError.message}`);
      }
    }

    return createdPlans;

  } catch (error) {
    console.log('❌ Error generating business plans:', error.message);
    return [];
  }
}

async function analyzeBusinessPlanDatabase() {
  console.log('\n📊 BUSINESS PLAN DATABASE ANALYSIS');
  console.log('-' .repeat(40));

  try {
    const { data: plans } = await supabase.from('business_plans').select('*');
    const { data: users } = await supabase.from('user_profiles').select('id, email, first_name, last_name');

    console.log(\`\n💼 BUSINESS PLANS SUMMARY (\${plans.length} total plans):\`);

    if (plans.length === 0) {
      console.log('ℹ️  No business plans found in database');
      return;
    }

    // Analyze by business type
    const typeStats = {};
    plans.forEach(plan => {
      const type = plan.business_type || 'Unknown';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    console.log('\n📈 BY BUSINESS TYPE:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(\`   \${type}: \${count} plans\`);
    });

    // Analyze by completion status
    const statusStats = {
      draft: plans.filter(p => p.status === 'draft').length,
      in_review: plans.filter(p => p.status === 'in_review').length,
      approved: plans.filter(p => p.status === 'approved').length,
      active: plans.filter(p => p.status === 'active').length
    };

    console.log('\n📋 BY STATUS:');
    Object.entries(statusStats).forEach(([status, count]) => {
      console.log(\`   \${status}: \${count} plans\`);
    });

    // Show completion percentages
    const avgCompletion = Math.round(
      plans.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / plans.length
    );

    console.log(\`\n🎯 COMPLETION METRICS:\`);
    console.log(\`   Average Completion: \${avgCompletion}%\`);
    
    const highCompletion = plans.filter(p => p.completion_percentage >= 70).length;
    const lowCompletion = plans.filter(p => p.completion_percentage < 30).length;
    
    console.log(\`   High Completion (70%+): \${highCompletion} plans\`);
    console.log(\`   Low Completion (<30%): \${lowCompletion} plans\`);

    // Financial projections analysis
    const totalStartupCosts = plans.reduce((sum, p) => sum + (p.startup_costs || 0), 0);
    const totalRevenueGoals = plans.reduce((sum, p) => sum + (p.monthly_revenue_goal || 0), 0);

    console.log(\`\n💰 FINANCIAL SUMMARY:\`);
    console.log(\`   Total Startup Costs: $\${totalStartupCosts.toLocaleString()}\`);
    console.log(\`   Combined Monthly Revenue Goals: $\${totalRevenueGoals.toLocaleString()}\`);
    console.log(\`   Average Startup Cost: $\${Math.round(totalStartupCosts / plans.length).toLocaleString()}\`);

    // Show detailed plans
    console.log(\`\n📋 DETAILED BUSINESS PLANS:\`);
    plans.slice(0, 5).forEach((plan, i) => {
      console.log(\`\n\${i + 1}. \${plan.name}\`);
      console.log(\`   Type: \${plan.business_type}\`);
      console.log(\`   Mission: \${plan.mission_statement}\`);
      console.log(\`   Completion: \${plan.completion_percentage}% | Status: \${plan.status}\`);
      console.log(\`   Startup Cost: $\${(plan.startup_costs || 0).toLocaleString()} | Monthly Goal: $\${(plan.monthly_revenue_goal || 0).toLocaleString()}\`);
    });

    if (plans.length > 5) {
      console.log(\`   ... and \${plans.length - 5} more plans\`);
    }

  } catch (error) {
    console.log('❌ Error analyzing business plans:', error.message);
  }
}

async function createBusinessPlanRecommendations() {
  console.log('\n💡 BUSINESS PLAN RECOMMENDATIONS');
  console.log('-' .repeat(40));

  try {
    const { data: plans } = await supabase.from('business_plans').select('*');
    const { data: users } = await supabase.from('user_profiles').select('*');

    const recommendations = [];

    // Check completion rates
    const lowCompletionPlans = plans.filter(p => p.completion_percentage < 50);
    if (lowCompletionPlans.length > 0) {
      recommendations.push(\`📋 \${lowCompletionPlans.length} business plans need completion support\`);
    }

    // Check for users without plans
    const usersWithoutPlans = users.filter(user => 
      !plans.some(plan => plan.user_id === user.id)
    );
    
    if (usersWithoutPlans.length > 0) {
      recommendations.push(\`👤 \${usersWithoutPlans.length} users don't have business plans yet\`);
    }

    // Financial analysis
    const unrealisticPlans = plans.filter(p => 
      p.monthly_revenue_goal > 50000 && p.startup_costs < 10000
    );
    
    if (unrealisticPlans.length > 0) {
      recommendations.push(\`💰 \${unrealisticPlans.length} plans may have unrealistic financial projections\`);
    }

    console.log('\n🚀 ACTION ITEMS:');
    recommendations.forEach((rec, i) => {
      console.log(\`\${i + 1}. \${rec}\`);
    });

    if (recommendations.length === 0) {
      console.log('✅ Business plan portfolio looks healthy!');
    }

    // Encourage biblical integration
    console.log('\n✝️  BIBLICAL BUSINESS PRINCIPLES:');
    console.log('   Encourage users to integrate faith-based values and stewardship principles');
    console.log('   Provide biblical business mentorship and accountability partnerships');
    console.log('   Connect business goals to kingdom impact and community service');

  } catch (error) {
    console.log('❌ Error creating recommendations:', error.message);
  }
}

async function runBusinessPlanGeneration() {
  console.log('🎯 BUSINESS PLAN GENERATION SYSTEM');
  console.log('=' .repeat(60));

  // Generate business plans for users
  const newPlans = await generateBusinessPlansForUsers();
  
  console.log(\`\n✅ Created \${newPlans.length} new business plans\`);

  // Analyze the business plan database
  await analyzeBusinessPlanDatabase();

  // Create recommendations
  await createBusinessPlanRecommendations();

  console.log('\n✅ BUSINESS PLAN GENERATION COMPLETE');
  console.log('Database populated with comprehensive business plans!');
}

// Run the business plan generation
runBusinessPlanGeneration();