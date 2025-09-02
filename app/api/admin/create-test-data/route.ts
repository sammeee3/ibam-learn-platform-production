import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 Creating comprehensive test data for staging...')
    
    const supabase = createServerSupabaseClient()
    
    // Test users to create
    const testUsers = [
      {
        email: 'test@staging.com',
        fullName: 'Test User One',
        membershipTier: 'premium',
        completedSessions: 8,
        totalActions: 12,
        completedActions: 7,
        hasBusinessPlan: true,
        feedbackCount: 3
      },
      {
        email: 'demo@staging.com', 
        fullName: 'Demo Student',
        membershipTier: 'standard',
        completedSessions: 3,
        totalActions: 5,
        completedActions: 2,
        hasBusinessPlan: false,
        feedbackCount: 1
      },
      {
        email: 'active@staging.com',
        fullName: 'Active Learner',
        membershipTier: 'premium',
        completedSessions: 15,
        totalActions: 20,
        completedActions: 18,
        hasBusinessPlan: true,
        feedbackCount: 8
      }
    ]

    const results = []

    for (const userData of testUsers) {
      console.log(`Creating test user: ${userData.email}`)
      
      // 1. Create auth user
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'test123456',
        email_confirm: true
      })

      if (authError) {
        console.error(`Auth user creation failed for ${userData.email}:`, authError.message)
        continue
      }

      const userId = authUser.user.id

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.fullName,
          membership_tier: userData.membershipTier,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error(`Profile creation failed for ${userData.email}:`, profileError.message)
        continue
      }

      // 3. Create session progress data
      for (let i = 1; i <= userData.completedSessions; i++) {
        const moduleId = Math.ceil(i / 5) // 5 sessions per module
        const sessionId = ((moduleId - 1) * 5) + ((i - 1) % 5) + 1
        
        await supabase
          .from('user_session_progress')
          .insert({
            user_id: userId,
            session_id: sessionId,
            module_id: moduleId,
            session_number: ((i - 1) % 5) + 1,
            progress_percentage: 100,
            completed: true,
            updated_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      // 4. Create action steps
      for (let i = 1; i <= userData.totalActions; i++) {
        const completed = i <= userData.completedActions
        const moduleId = Math.ceil(i / 4) // 4 actions per module
        
        await supabase
          .from('user_action_steps')
          .insert({
            user_id: userId,
            module_id: moduleId,
            session_id: ((i - 1) % 5) + 1,
            action_type: ['immediate', 'weekly', 'ongoing'][i % 3],
            specific_action: `Test action #${i} - ${['Call potential customer', 'Update business plan', 'Schedule networking meeting'][i % 3]}`,
            completed: completed,
            created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: completed ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null
          })
      }

      // 5. Create assessments
      for (let i = 1; i <= 3; i++) {
        await supabase
          .from('assessment_results')
          .insert({
            user_id: userId,
            assessment_type: ['pre_assessment', 'mid_assessment', 'post_assessment'][i - 1],
            module_id: i,
            score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
            created_at: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      // 6. Create business plan data (if applicable)
      if (userData.hasBusinessPlan) {
        const businessPlanSections = [
          { section: 'vision', question: 'Business Vision', answer: `${userData.fullName}'s vision for transforming the marketplace` },
          { section: 'target_market', question: 'Target Market', answer: 'Christian entrepreneurs and business leaders' },
          { section: 'revenue_model', question: 'Revenue Model', answer: 'Consulting and coaching services with digital products' },
          { section: 'marketing_strategy', question: 'Marketing Strategy', answer: 'Faith-based networking and referral system' }
        ]

        for (const section of businessPlanSections) {
          await supabase
            .from('business_plan_data')
            .insert({
              user_id: userId,
              section: section.section,
              question: section.question,
              answer: section.answer,
              updated_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
            })
        }
      }

      // 7. Create feedback submissions
      for (let i = 1; i <= userData.feedbackCount; i++) {
        await supabase
          .from('feedback')
          .insert({
            user_id: userId,
            feedback_text: `Great session! This is test feedback #${i} from ${userData.fullName}. Really helpful content and practical applications.`,
            page_url: `/modules/${Math.ceil(i / 2)}/session/${((i - 1) % 5) + 1}`,
            created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      results.push({
        email: userData.email,
        userId: userId,
        status: 'created',
        data: {
          sessions: userData.completedSessions,
          actions: `${userData.completedActions}/${userData.totalActions}`,
          businessPlan: userData.hasBusinessPlan,
          feedback: userData.feedbackCount
        }
      })

      console.log(`✅ Test user created: ${userData.email}`)
    }

    console.log('🎉 All test data created successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      users: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error creating test data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}