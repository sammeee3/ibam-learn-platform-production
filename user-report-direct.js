const { createClient } = require('@supabase/supabase-js')

async function generateUserReport() {
  console.log('🔍 Generating comprehensive user report for: scott.adkins1@gmail.com')
  console.log('🏢 Database: PRODUCTION (tutrnikhomrgcpkzszvq.supabase.co)')
  console.log('')

  // Connect to PRODUCTION database
  const supabase = createClient(
    'https://tutrnikhomrgcpkzszvq.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set')
    process.exit(1)
  }

  const email = 'scott.adkins1@gmail.com'
  
  try {
    console.log('📋 STEP 1: Finding user profile...')
    
    // 1. Find user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (profileError || !userProfile) {
      console.log('❌ User not found with email:', email)
      console.log('Error details:', profileError?.message)
      return
    }

    console.log('✅ User found:', userProfile.full_name || email)
    console.log('')

    console.log('📊 STEP 2: Gathering user activity data...')

    // 2. Get session progress
    const { data: sessionProgress, error: progressError } = await supabase
      .from('user_session_progress')
      .select(`
        *,
        sessions(id, title, module_id, session_number)
      `)
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false })
    
    // 3. Get assessment results
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
    
    // 4. Get business plan data
    const { data: businessPlan, error: planError } = await supabase
      .from('business_plan_data')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false })
    
    // 5. Get user actions
    const { data: userActions, error: actionsError } = await supabase
      .from('user_action_steps')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
    
    // 6. Get feedback submissions
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })

    console.log('✅ Data gathered successfully')
    console.log('')

    // Calculate analytics
    const now = new Date()
    const createdAt = new Date(userProfile.created_at)
    const daysInSystem = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    const completedSessions = sessionProgress?.filter(p => p.completed) || []
    const totalSessions = sessionProgress?.length || 0
    const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions * 100).toFixed(1) : '0'
    
    const lastActivity = sessionProgress?.[0]?.updated_at || userProfile.updated_at
    const daysSinceLastActivity = Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))

    // Generate comprehensive report
    console.log('📈 COMPREHENSIVE USER REPORT')
    console.log('=' .repeat(80))
    console.log('')
    
    console.log('👤 USER INFORMATION')
    console.log('─'.repeat(40))
    console.log(`📧 Email: ${userProfile.email}`)
    console.log(`👨‍💼 Full Name: ${userProfile.full_name || 'Not provided'}`)
    console.log(`🎫 Membership Tier: ${userProfile.membership_tier || 'Standard'}`)
    console.log(`📅 Account Created: ${new Date(userProfile.created_at).toLocaleDateString()}`)
    console.log(`⏱️ Days in System: ${daysInSystem} days`)
    console.log(`🕐 Last Activity: ${new Date(lastActivity).toLocaleDateString()} (${daysSinceLastActivity} days ago)`)
    console.log('')

    console.log('🎯 LEARNING PROGRESS')
    console.log('─'.repeat(40))
    console.log(`📚 Total Sessions Accessed: ${totalSessions}`)
    console.log(`✅ Completed Sessions: ${completedSessions.length}`)
    console.log(`📊 Completion Rate: ${completionRate}%`)
    console.log('')

    if (sessionProgress && sessionProgress.length > 0) {
      console.log('📋 SESSION DETAILS')
      console.log('─'.repeat(40))
      sessionProgress.slice(0, 10).forEach(progress => {
        const status = progress.completed ? '✅' : '⏳'
        const module = progress.sessions?.module_id || 'Unknown'
        const session = progress.sessions?.session_number || 'N/A'
        const title = progress.sessions?.title || 'Untitled'
        const progressPercent = progress.progress_percentage || 0
        console.log(`${status} Module ${module}, Session ${session}: ${title} (${progressPercent}%)`)
      })
      if (sessionProgress.length > 10) {
        console.log(`... and ${sessionProgress.length - 10} more sessions`)
      }
      console.log('')
    }

    console.log('📝 ASSESSMENTS')
    console.log('─'.repeat(40))
    console.log(`📊 Total Assessments: ${assessments?.length || 0}`)
    if (assessments && assessments.length > 0) {
      assessments.slice(0, 5).forEach(assessment => {
        console.log(`📋 ${assessment.assessment_type}: Score ${assessment.score} (Module ${assessment.module_id})`)
      })
    }
    console.log('')

    console.log('💼 BUSINESS PLANNING')
    console.log('─'.repeat(40))
    console.log(`📄 Business Plan Entries: ${businessPlan?.length || 0}`)
    console.log(`📅 Last Updated: ${businessPlan?.[0]?.updated_at ? new Date(businessPlan[0].updated_at).toLocaleDateString() : 'Never'}`)
    console.log('')

    console.log('🎯 ACTION STEPS')
    console.log('─'.repeat(40))
    const totalActions = userActions?.length || 0
    const completedActions = userActions?.filter(a => a.completed)?.length || 0
    console.log(`📋 Total Actions Created: ${totalActions}`)
    console.log(`✅ Completed Actions: ${completedActions}`)
    console.log(`📊 Action Completion Rate: ${totalActions > 0 ? (completedActions / totalActions * 100).toFixed(1) : 0}%`)
    console.log('')

    console.log('💬 FEEDBACK & ENGAGEMENT')
    console.log('─'.repeat(40))
    console.log(`📝 Feedback Submissions: ${feedback?.length || 0}`)
    console.log(`📅 Last Feedback: ${feedback?.[0]?.created_at ? new Date(feedback[0].created_at).toLocaleDateString() : 'Never'}`)
    console.log('')

    console.log('🔍 DETAILED DATA')
    console.log('─'.repeat(40))
    if (userProfile) {
      console.log('User Profile Data:', JSON.stringify(userProfile, null, 2))
    }
    
    if (progressError) console.log('Progress Error:', progressError.message)
    if (assessmentError) console.log('Assessment Error:', assessmentError.message)
    if (planError) console.log('Business Plan Error:', planError.message)
    if (actionsError) console.log('Actions Error:', actionsError.message)
    if (feedbackError) console.log('Feedback Error:', feedbackError.message)

    console.log('')
    console.log('✅ Report generated successfully!')

  } catch (error) {
    console.error('❌ Error generating user report:', error.message)
  }
}

// Run the report
generateUserReport()