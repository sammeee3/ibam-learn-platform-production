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
    target_market: 'Christian entrepreneurs, faith-based organizations, and businesses seeking ethical guidance',
    revenue_model: 'Consulting fees, workshop facilitation, online course sales',
    startup_costs: 15000,
    monthly_revenue_goal: 8000
  },
  {
    type: 'Online Ministry Platform', 
    name: 'Digital Discipleship Hub',
    description: 'Online platform connecting believers for mentorship, accountability, and spiritual growth',
    mission: 'To facilitate authentic Christian community and discipleship through digital connections',
    target_market: 'Christians seeking discipleship, church leaders, small group facilitators',
    revenue_model: 'Subscription memberships, premium resources, church partnerships',
    startup_costs: 25000,
    monthly_revenue_goal: 12000
  },
  {
    type: 'Social Impact Business',
    name: 'Hope & Harvest Coffee',
    description: 'Fair-trade coffee company supporting Christian farmers in developing nations',
    mission: 'To provide sustainable income for Christian farmers while delivering excellent coffee',
    target_market: 'Conscious consumers, churches, Christian bookstores, faith-based organizations',
    revenue_model: 'Direct sales, wholesale accounts, subscription boxes, corporate sales',
    startup_costs: 45000,
    monthly_revenue_goal: 20000
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

    // Create business plans for first 5 users as examples
    const sampleUsers = users.slice(0, 5);

    for (const user of sampleUsers) {
      // Select a template
      const templateIndex = createdPlans.length % businessPlanTemplates.length;
      const selectedTemplate = businessPlanTemplates[templateIndex];

      // Create personalized plan data
      const planData = {
        user_id: user.id,
        name: `${user.first_name || 'User'}'s ${selectedTemplate.name}`,
        description: selectedTemplate.description,
        business_type: selectedTemplate.type,
        mission_statement: selectedTemplate.mission,
        target_market: selectedTemplate.target_market,
        revenue_model: selectedTemplate.revenue_model,
        startup_costs: selectedTemplate.startup_costs,
        monthly_revenue_goal: selectedTemplate.monthly_revenue_goal,
        status: 'draft',
        completion_percentage: Math.floor(Math.random() * 60) + 20,
        financial_projections: {
          year_1_revenue: selectedTemplate.monthly_revenue_goal * 12 * 0.7,
          year_2_revenue: selectedTemplate.monthly_revenue_goal * 12 * 1.2,
          startup_investment: selectedTemplate.startup_costs
        },
        created_at: new Date(),
        updated_at: new Date()
      };

      try {
        const { data: newPlan, error } = await supabase
          .from('business_plans')
          .insert(planData)
          .select()
          .single();

        if (error) {
          console.log(`❌ Failed to create plan for ${user.email}: ${error.message}`);
        } else {
          console.log(`✅ Created business plan for ${user.email}: "${planData.name}"`);
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

    console.log(`\n💼 BUSINESS PLANS SUMMARY (${plans.length} total plans):`);

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
      console.log(`   ${type}: ${count} plans`);
    });

    // Financial projections analysis
    const totalStartupCosts = plans.reduce((sum, p) => sum + (p.startup_costs || 0), 0);
    const totalRevenueGoals = plans.reduce((sum, p) => sum + (p.monthly_revenue_goal || 0), 0);

    console.log(`\n💰 FINANCIAL SUMMARY:`);
    console.log(`   Total Startup Costs: $${totalStartupCosts.toLocaleString()}`);
    console.log(`   Combined Monthly Revenue Goals: $${totalRevenueGoals.toLocaleString()}`);
    
    if (plans.length > 0) {
      console.log(`   Average Startup Cost: $${Math.round(totalStartupCosts / plans.length).toLocaleString()}`);
    }

    // Show detailed plans
    console.log(`\n📋 DETAILED BUSINESS PLANS:`);
    plans.forEach((plan, i) => {
      console.log(`\n${i + 1}. ${plan.name}`);
      console.log(`   Type: ${plan.business_type}`);
      console.log(`   Mission: ${plan.mission_statement}`);
      console.log(`   Completion: ${plan.completion_percentage}%`);
      console.log(`   Startup: $${(plan.startup_costs || 0).toLocaleString()} | Monthly Goal: $${(plan.monthly_revenue_goal || 0).toLocaleString()}`);
    });

  } catch (error) {
    console.log('❌ Error analyzing business plans:', error.message);
  }
}

async function runBusinessPlanGeneration() {
  console.log('🎯 BUSINESS PLAN GENERATION SYSTEM');
  console.log('=' .repeat(60));

  // Generate business plans for users
  const newPlans = await generateBusinessPlansForUsers();
  
  console.log(`\n✅ Created ${newPlans.length} new business plans`);

  // Analyze the business plan database
  await analyzeBusinessPlanDatabase();

  console.log('\n✅ BUSINESS PLAN GENERATION COMPLETE');
  console.log('Database populated with comprehensive business plans!');
}

// Run the business plan generation
runBusinessPlanGeneration();