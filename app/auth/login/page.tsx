'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client OUTSIDE component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    console.log(message)
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // DISABLED automatic session check to prevent infinite loop
  // useEffect removed - no more automatic redirects!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      addLog('=== LOGIN ATTEMPT START ===')
      addLog(`Attempting login with: ${email}`)

      // Clear any existing sessions first
      localStorage.removeItem('ibam_session')
      localStorage.removeItem('ibam_profile')
      addLog('🧹 Cleared existing sessions')

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        addLog(`❌ Login failed: ${authError.message}`)
        setError(`Login failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user || !authData.session) {
        addLog('❌ No user/session data returned')
        setError('Login failed: Invalid response')
        setLoading(false)
        return
      }

      addLog('✅ Authentication successful!')

      // Store NEW session
      const userSession = {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        },
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at
        },
        loginTime: new Date().toISOString()
      }

      localStorage.setItem('ibam_session', JSON.stringify(userSession))
      addLog('✅ NEW session stored successfully')
      
      addLog('🚀 Manual redirect to dashboard...')
      
      // Manual redirect with fresh session
      window.location.href = '/dashboard'

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test connection on page load - NO SESSION CHECK
  useEffect(() => {
    const testConnection = async () => {
      try {
        addLog('🔧 Testing database connection...')
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        addLog(`Database test: ${error ? `❌ ${error.message}` : '✅ Connected successfully'}`)
      } catch (err) {
        addLog(`Database connection failed: ${err}`)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Login Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-6">Sign in to IBAM</h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              No Auto-Redirect (Manual Login Only)
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Quick Test */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">Quick Test:</p>
              <button
                onClick={() => {
                  setEmail('test1@test.com')
                  setPassword('password123')
                }}
                className="text-xs bg-yellow-200 px-3 py-1 rounded hover:bg-yellow-300"
              >
                Fill Test Credentials
              </button>
            </div>

            {/* Emergency Reset */}
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800 mb-2">Emergency Reset:</p>
              <button
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  setDebugLogs([])
                  addLog('🚨 EMERGENCY RESET - All data cleared')
                  setTimeout(() => location.reload(), 1000)
                }}
                className="text-xs bg-red-200 px-3 py-1 rounded hover:bg-red-300"
              >
                CLEAR ALL & RELOAD
              </button>
            </div>
          </div>

          {/* Debug Panel */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto text-xs font-mono">
              {debugLogs.length === 0 ? (
                <div className="text-gray-500">Debug logs will appear here...</div>
              ) : (
                debugLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={() => setDebugLogs([])}
                className="w-full text-sm bg-gray-200 py-1 px-3 rounded hover:bg-gray-300"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}