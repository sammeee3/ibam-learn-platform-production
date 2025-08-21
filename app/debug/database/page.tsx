'use client'

import { useState, useEffect } from 'react'

interface DatabaseInfo {
  timestamp: string
  database: {
    projectId: string
    environment: string
    expectedDB: string
    supabaseUrl: string
    connectionStatus: string
  }
  deployment: {
    hostname: string
    deploymentEnvironment: string
    environmentMatch: boolean
    warning: string | null
  }
  statistics: {
    authUsersCount: number
    userProfilesCount: number
    lastError: any
  }
  recentUsers: Array<{
    id: string
    first_name: string
    email: string
    created_at: string
  }>
  debug: {
    nodeEnv: string
    vercelEnv: string
    timestamp: number
  }
}

export default function DatabaseDebugPage() {
  const [info, setInfo] = useState<DatabaseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/debug/database-info')
      .then(res => res.json())
      .then(data => {
        setInfo(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading database information...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!info) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-xl text-yellow-600">No database information available</div>
      </div>
    )
  }

  const isStaging = info.database.environment === 'STAGING'
  const isProduction = info.database.environment === 'PRODUCTION'
  const isMatched = info.deployment.environmentMatch

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          IBAM Database Connection Status
        </h1>

        {/* Environment Status Card */}
        <div className={`p-6 rounded-lg border-4 mb-6 ${
          isMatched 
            ? isStaging 
              ? 'bg-green-50 border-green-500' 
              : 'bg-blue-50 border-blue-500'
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${
              isMatched 
                ? isStaging 
                  ? 'text-green-800' 
                  : 'text-blue-800'
                : 'text-red-800'
            }`}>
              {isMatched ? '✅' : '⚠️'} {info.database.environment} DATABASE
            </h2>
            <p className="text-lg">
              Project ID: <code className="bg-gray-200 px-2 py-1 rounded">{info.database.projectId}</code>
            </p>
            <p className="text-lg">
              URL: <code className="bg-gray-200 px-2 py-1 rounded">{info.database.supabaseUrl}</code>
            </p>
            {info.deployment.warning && (
              <p className="text-red-600 font-bold mt-2">{info.deployment.warning}</p>
            )}
          </div>
        </div>

        {/* Database Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Database Statistics</h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Auth Users:</span> {info.statistics.authUsersCount}
              </p>
              <p>
                <span className="font-semibold">User Profiles:</span> {info.statistics.userProfilesCount}
              </p>
              <p>
                <span className="font-semibold">Connection:</span> 
                <span className="text-green-600 ml-2">{info.database.connectionStatus}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Deployment Info</h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Hostname:</span> {info.deployment.hostname}
              </p>
              <p>
                <span className="font-semibold">Environment:</span> {info.deployment.deploymentEnvironment}
              </p>
              <p>
                <span className="font-semibold">Node ENV:</span> {info.debug.nodeEnv}
              </p>
              <p>
                <span className="font-semibold">Vercel ENV:</span> {info.debug.vercelEnv}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Recent Users (Last 5)</h3>
          {info.recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Created</th>
                    <th className="py-2">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {info.recentUsers.map((user, index) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">{user.first_name || 'Unknown'}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-2 text-xs text-gray-500">{user.id.substring(0, 8)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent users found</p>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date(info.timestamp).toLocaleString()}
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 text-center space-x-4">
          <a 
            href="/auth/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </a>
          <a 
            href="/dashboard" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}