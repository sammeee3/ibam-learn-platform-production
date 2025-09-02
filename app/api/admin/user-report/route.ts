import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || 'scott.adkins1@gmail.com'
    
    console.log(`Generating comprehensive user report for: ${email}`)
    
    // Connect to STAGING database  
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // 1. Find user profile and auth data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (profileError || !userProfile) {
      return NextResponse.json({
        error: `User not found with email: ${email}`,
        details: profileError?.message
      }, { status: 404 })
    }

    // 2. Get user auth data - First get the user ID from auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    const authUser = authUsers?.users?.find((user: any) => user.email === email)
    
    // 3. Get session progress
    const { data: sessionProgress, error: progressError } = await supabase
      .from('user_session_progress')
      .select(`
        *,
        sessions(id, title, module_id, session_number)
      `)
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false })
    
    // 4. Get assessment results
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
    
    // 5. Get business plan data
    const { data: businessPlan, error: planError } = await supabase
      .from('business_plan_data')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false })
    
    // 6. Get user actions
    const { data: userActions, error: actionsError } = await supabase
      .from('user_action_steps')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
    
    // 7. Get feedback submissions
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })

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
    const report = {
      userInfo: {
        email: userProfile.email,
        fullName: userProfile.full_name,
        membershipTier: userProfile.membership_tier,
        createdAt: userProfile.created_at,
        daysInSystem,
        lastActivity,
        daysSinceLastActivity,
        authProvider: (authUser as any)?.app_metadata?.provider || 'email'
      },
      
      progressSummary: {
        totalSessions,
        completedSessions: completedSessions.length,
        completionRate: `${completionRate}%`,
        sessionDetails: sessionProgress?.map(p => ({
          module: p.sessions?.module_id,
          session: p.sessions?.session_number,
          title: p.sessions?.title,
          completed: p.completed,
          progress: p.progress_percentage,
          lastUpdated: p.updated_at
        })) || []
      },
      
      assessments: {
        total: assessments?.length || 0,
        data: assessments?.map(a => ({
          type: a.assessment_type,
          score: a.score,
          completedAt: a.created_at,
          moduleId: a.module_id
        })) || []
      },
      
      businessPlan: {
        hasBusinessPlan: (businessPlan?.length || 0) > 0,
        totalEntries: businessPlan?.length || 0,
        lastUpdated: businessPlan?.[0]?.updated_at,
        recentEntries: businessPlan?.map(bp => ({
          section: bp.section,
          question: bp.question,
          lastUpdated: bp.updated_at
        })) || []
      },
      
      actions: {
        totalActions: userActions?.length || 0,
        completedActions: userActions?.filter(a => a.completed)?.length || 0,
        actionCompletionRate: (userActions?.length || 0) > 0 ? (userActions!.filter(a => a.completed).length / userActions!.length * 100).toFixed(1) : '0',
        recentActions: userActions?.map(a => ({
          actionType: a.action_type,
          specificAction: a.specific_action,
          completed: a.completed,
          moduleId: a.module_id,
          sessionId: a.session_id,
          createdAt: a.created_at
        })) || []
      },
      
      engagement: {
        feedbackSubmissions: feedback?.length || 0,
        lastFeedback: feedback?.[0]?.created_at,
        recentFeedback: feedback?.map(f => ({
          feedbackText: f.feedback_text,
          pageUrl: f.page_url,
          submittedAt: f.created_at
        })) || []
      },
      
      errors: {
        profileError: (profileError as any)?.message,
        authError: (authError as any)?.message,
        progressError: (progressError as any)?.message,
        assessmentError: (assessmentError as any)?.message,
        planError: (planError as any)?.message,
        actionsError: (actionsError as any)?.message,
        feedbackError: (feedbackError as any)?.message
      }
    }

    console.log(`Report generated successfully for ${email}`)
    
    return NextResponse.json({
      success: true,
      email,
      generatedAt: new Date().toISOString(),
      report
    })

  } catch (error) {
    console.error('User report generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate user report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}