
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
  const [sessionChecked, setSessionChecked] = useState(false)
  const router = useRouter()

  const addLog = (message: string) => {
    console.log(message)
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Check if already logged in - ONLY ONCE
  useEffect(() => {
    if (sessionChecked) return // Prevent multiple runs

    const checkSession = async () => {
      try {
        addLog('🔧 Checking for existing session...')
        
        // First check localStorage
        const localSession = localStorage.getItem('ibam_session')
        if (!localSession) {
          addLog('ℹ️ No local session found')
          setSessionChecked(true)
          return
        }

        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          addLog(`❌ Session check error: ${error.message}`)
          localStorage.removeItem('ibam_session')
          localStorage.removeItem('ibam_profile')
          setSessionChecked(true)
          return
        }

        if (session && session.user) {
          addLog('✅ Valid session found, redirecting to dashboard')
          // Use a slight delay to ensure logs are visible
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
        } else {
          addLog('ℹ️ No valid session found, please log in')
          localStorage.removeItem('ibam_session')
          localStorage.removeItem('ibam_profile')
        }
        
        setSessionChecked(true)
      } catch (err) {
        addLog(`❌ Session check failed: ${err}`)
        localStorage.removeItem('ibam_session')
        localStorage.removeItem('ibam_profile')
        setSessionChecked(true)
      }
    }
    
    checkSession()
  }, [sessionChecked])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      addLog('=== LOGIN ATTEMPT START ===')
      addLog(`Attempting login with: ${email}`)

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

      // Store session
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
      addLog('✅ Session stored, redirecting...')
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Login Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-6">Sign in to IBAM</h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Safe Supabase-Only Login (Fixed Infinite Loop!)
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

            <div className="mt-4 text-center">
              <a href="/auth/signup" className="text-blue-600 hover:text-blue-700">
                Don't have an account? Sign up
              </a>
            </div>

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

            {/* Clear Session Button */}
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800 mb-2">Having issues?</p>
              <button
                onClick={() => {
                  localStorage.clear()
                  setDebugLogs([])
                  addLog('🧹 Cleared all sessions and cache')
                  setTimeout(() => location.reload(), 500)
                }}
                className="text-xs bg-red-200 px-3 py-1 rounded hover:bg-red-300"
              >
                Clear Session & Reload
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