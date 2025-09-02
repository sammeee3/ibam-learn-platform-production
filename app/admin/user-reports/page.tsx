'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function UserReportsPage() {
  const [email, setEmail] = useState('sammeee@yahoo.com')
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
      
      // Call the API route instead of direct database connection
      // (API route uses service role key to bypass RLS)
      const response = await fetch(`/api/admin/user-report?email=${encodeURIComponent(email)}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        setError(`API Error: ${errorText}`)
        setLoading(false)
        return
      }

      const apiData = await response.json()
      
      if (!apiData.success) {
        setError(apiData.error || 'Report generation failed')
        setLoading(false)
        return
      }

      setReport(apiData.report)
      console.log('✅ Report generated successfully!')
      setLoading(false)

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