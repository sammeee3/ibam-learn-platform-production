'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function UserReportsPage() {
  const [email, setEmail] = useState('scott.adkins1@gmail.com')
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateReport = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)

    try {
      console.log('🔍 Generating user report for:', email)
      
      // Connect to PRODUCTION database
      const supabase = createClient(
        'https://tutrnikhomrgcpkzszvq.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
      )

      console.log('📋 Finding user profile...')
      
      // Find user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()
      
      if (profileError || !userProfile) {
        setError(`User not found with email: ${email}`)
        setLoading(false)
        return
      }

      console.log('✅ User found, gathering activity data...')

      // Get all user data
      const [sessionProgressResult, assessmentsResult, businessPlanResult, userActionsResult, feedbackResult] = await Promise.all([
        // Session progress
        supabase
          .from('user_session_progress')
          .select(`
            *,
            sessions(id, title, module_id, session_number)
          `)
          .eq('user_id', userProfile.id)
          .order('updated_at', { ascending: false }),
        
        // Assessment results
        supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false }),
        
        // Business plan data
        supabase
          .from('business_plan_data')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('updated_at', { ascending: false }),
        
        // User actions
        supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false }),
        
        // Feedback submissions
        supabase
          .from('feedback')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })
      ])

      const sessionProgress = sessionProgressResult.data || []
      const assessments = assessmentsResult.data || []
      const businessPlan = businessPlanResult.data || []
      const userActions = userActionsResult.data || []
      const feedback = feedbackResult.data || []

      // Calculate analytics
      const now = new Date()
      const createdAt = new Date(userProfile.created_at)
      const daysInSystem = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      
      const completedSessions = sessionProgress.filter(p => p.completed)
      const totalSessions = sessionProgress.length
      const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions * 100).toFixed(1) : '0'
      
      const lastActivity = sessionProgress[0]?.updated_at || userProfile.updated_at
      const daysSinceLastActivity = Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      
      const completedActions = userActions.filter(a => a.completed)

      // Generate report
      const reportData = {
        userInfo: {
          email: userProfile.email,
          fullName: userProfile.full_name,
          membershipTier: userProfile.membership_tier,
          createdAt: userProfile.created_at,
          daysInSystem,
          lastActivity,
          daysSinceLastActivity
        },
        progressSummary: {
          totalSessions,
          completedSessions: completedSessions.length,
          completionRate: `${completionRate}%`,
          sessionDetails: sessionProgress.slice(0, 20).map(p => ({
            module: p.sessions?.module_id,
            session: p.sessions?.session_number,
            title: p.sessions?.title,
            completed: p.completed,
            progress: p.progress_percentage,
            lastUpdated: p.updated_at
          }))
        },
        assessments: {
          total: assessments.length,
          data: assessments.slice(0, 10).map(a => ({
            type: a.assessment_type,
            score: a.score,
            completedAt: a.created_at,
            moduleId: a.module_id
          }))
        },
        businessPlan: {
          hasBusinessPlan: businessPlan.length > 0,
          totalEntries: businessPlan.length,
          lastUpdated: businessPlan[0]?.updated_at,
          recentEntries: businessPlan.slice(0, 5).map(bp => ({
            section: bp.section,
            question: bp.question,
            lastUpdated: bp.updated_at
          }))
        },
        actions: {
          totalActions: userActions.length,
          completedActions: completedActions.length,
          actionCompletionRate: userActions.length > 0 ? (completedActions.length / userActions.length * 100).toFixed(1) : '0',
          recentActions: userActions.slice(0, 10).map(a => ({
            actionType: a.action_type,
            specificAction: a.specific_action,
            completed: a.completed,
            moduleId: a.module_id,
            sessionId: a.session_id,
            createdAt: a.created_at
          }))
        },
        engagement: {
          feedbackSubmissions: feedback.length,
          lastFeedback: feedback[0]?.created_at,
          recentFeedback: feedback.slice(0, 5).map(f => ({
            feedbackText: f.feedback_text,
            pageUrl: f.page_url,
            submittedAt: f.created_at
          }))
        }
      }

      setReport(reportData)
      console.log('✅ Report generated successfully!')

    } catch (error) {
      console.error('❌ Error generating report:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📊 User Activity Reports
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate User Report</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user email..."
              />
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {report && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">👤 User Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{report.userInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold">{report.userInfo.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Membership</p>
                  <p className="font-semibold">{report.userInfo.membershipTier || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days in System</p>
                  <p className="font-semibold text-blue-600">{report.userInfo.daysInSystem} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-semibold">{new Date(report.userInfo.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Activity</p>
                  <p className="font-semibold">{new Date(report.userInfo.lastActivity).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days Since Last Activity</p>
                  <p className={`font-semibold ${report.userInfo.daysSinceLastActivity > 7 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.userInfo.daysSinceLastActivity} days ago
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Learning Progress</h2>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{report.progressSummary.totalSessions}</p>
                  <p className="text-gray-500">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{report.progressSummary.completedSessions}</p>
                  <p className="text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{report.progressSummary.completionRate}</p>
                  <p className="text-gray-500">Completion Rate</p>
                </div>
              </div>
              
              {report.progressSummary.sessionDetails.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Sessions</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {report.progressSummary.sessionDetails.map((session: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">
                            {session.completed ? '✅' : '⏳'} Module {session.module}, Session {session.session}
                          </p>
                          <p className="text-sm text-gray-600">{session.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{session.progress}%</p>
                          <p className="text-xs text-gray-500">
                            {new Date(session.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Steps */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Action Steps</h2>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{report.actions.totalActions}</p>
                  <p className="text-gray-500">Total Actions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{report.actions.completedActions}</p>
                  <p className="text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{report.actions.actionCompletionRate}%</p>
                  <p className="text-gray-500">Completion Rate</p>
                </div>
              </div>
              
              {report.actions.recentActions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Actions</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {report.actions.recentActions.map((action: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">
                            {action.completed ? '✅' : '⏳'} {action.specificAction}
                          </p>
                          <p className="text-sm text-gray-600">Module {action.moduleId}, Session {action.sessionId}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(action.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Business Plan & Engagement */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💼 Business Planning</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Has Business Plan:</span>
                    <span className={report.businessPlan.hasBusinessPlan ? 'text-green-600' : 'text-gray-500'}>
                      {report.businessPlan.hasBusinessPlan ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Entries:</span>
                    <span className="font-semibold">{report.businessPlan.totalEntries}</span>
                  </div>
                  {report.businessPlan.lastUpdated && (
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{new Date(report.businessPlan.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💬 Engagement</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Feedback Submissions:</span>
                    <span className="font-semibold">{report.engagement.feedbackSubmissions}</span>
                  </div>
                  {report.engagement.lastFeedback && (
                    <div className="flex justify-between">
                      <span>Last Feedback:</span>
                      <span>{new Date(report.engagement.lastFeedback).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Assessments Taken:</span>
                    <span className="font-semibold">{report.assessments.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}