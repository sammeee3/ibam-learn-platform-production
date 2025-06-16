'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

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

  // Check if already logged in - MATCH the dashboard logic
  useEffect(() => {
    const checkSession = async () => {
      try {
        addLog('🔍 Checking for existing session...')
        
        // First check localStorage (same as dashboard)
        const storedSession = localStorage.getItem('ibam_session')
        
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession)
            
            // Check if session is not expired
            if (session.session.expires_at && session.session.expires_at > Date.now() / 1000) {
              addLog('✅ Found valid localStorage session, redirecting to dashboard')
              // Force redirect with window.location
              window.location.href = '/dashboard'
              return
            } else {
              addLog('⏰ localStorage session expired, clearing it')
              localStorage.removeItem('ibam_session')
              localStorage.removeItem('ibam_profile')
            }
          } catch (err) {
            addLog('❌ Invalid localStorage session, clearing it')
            localStorage.removeItem('ibam_session')
            localStorage.removeItem('ibam_profile')
          }
        }
        
        // Fallback: check Supabase session
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session) {
          addLog('✅ Found Supabase session, will redirect after storing in localStorage')
          // Don't redirect here - let them log in to properly store the session
        } else {
          addLog('ℹ️ No existing session found anywhere')
        }
      } catch (err) {
        addLog(`❌ Session check failed: ${err}`)
      }
    }
    
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebugLogs([])

    try {
      addLog('=== SAFE SUPABASE LOGIN START ===')
      addLog(`Attempting login with email: ${email}`)

      // Test environment variables first
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      addLog(`Environment check - URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`)
      addLog(`Environment check - Key: ${supabaseKey ? '✅ Found' : '❌ Missing'}`)

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
      }

      // Create Supabase client
      const supabase = createClient(supabaseUrl, supabaseKey)
      addLog('✅ Supabase client created successfully')

      // Test database connection first
      addLog('Testing database connection...')
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (testError) {
        addLog(`❌ Database connection failed: ${testError.message}`)
        setError(`Database connection failed: ${testError.message}`)
        setLoading(false)
        return
      }
      
      addLog('✅ Database connection successful')

      // Attempt login
      addLog('Attempting Supabase authentication...')
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      addLog(`Auth attempt result: ${JSON.stringify({
        hasUser: !!authData.user,
        userEmail: authData.user?.email,
        hasSession: !!authData.session,
        errorMessage: authError?.message
      })}`)

      if (authError) {
        addLog(`❌ Authentication failed: ${authError.message}`)
        setError(`Login failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        addLog('❌ No user data returned')
        setError('Login failed: No user data returned')
        setLoading(false)
        return
      }

      addLog('✅ Authentication successful!')

      // Store user session in localStorage (simple session management)
      const userSession = {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        },
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at
        },
        loginTime: new Date().toISOString()
      }

      localStorage.setItem('ibam_session', JSON.stringify(userSession))
      addLog('✅ Session stored successfully')

      // Get user profile from database
      addLog('Fetching user profile...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profile) {
        addLog(`✅ Profile found: ${JSON.stringify({
          email: profile.email,
          memberType: profile.member_type_key,
          fullName: profile.full_name
        })}`)
        
        // Store profile data
        localStorage.setItem('ibam_profile', JSON.stringify(profile))
      } else {
        addLog(`⚠️ No profile found, error: ${profileError?.message}`)
      }

      addLog('🚀 Redirecting to dashboard...')
      
      // Force redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
      console.error('Login error:', error)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test connection on load
  useEffect(() => {
    const testConnection = async () => {
      try {
        addLog('🔧 Testing initial connection...')
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        addLog(`Initial connection test: ${error ? `❌ ${error.message}` : '✅ Connected successfully'}`)
      } catch (err) {
        addLog(`Initial connection failed: ${err}`)
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
            <div className="text-center mb-6">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-16 w-auto mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">Sign in to IBAM</h1>
              <p className="text-sm text-gray-600">Faith-Driven Business Learning Platform</p>
            </div>
            
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
                className="w-full py-3 px-4 rounded-lg font-semibold text-lg text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
              >
                {loading ? 'Signing in...' : 'Sign in to Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/auth/signup" className="text-blue-600 hover:text-blue-700">
                Don't have an account? Sign up
              </a>
            </div>

            {/* Environment Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-2">🔧 System Status:</h3>
              <div className="text-xs space-y-1">
                <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Connected' : '❌ Missing'}</p>
                <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}</p>
                <p>Environment: {process.env.NODE_ENV || 'unknown'}</p>
              </div>
            </div>

            {/* Quick Test User Button */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">🧪 Quick Test (if you created test user):</p>
              <button
                onClick={() => {
                  setEmail('test@ibam.org')
                  setPassword('password123')
                }}
                className="text-xs bg-yellow-200 px-3 py-1 rounded hover:bg-yellow-300"
              >
                Fill Test Credentials
              </button>
            </div>
          </div>

          {/* Debug Panel */}
          <div>
            <h2 className="text-lg font-semibold mb-4">🔍 Debug Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto text-xs font-mono">
              {debugLogs.length === 0 ? (
                <div className="text-gray-500">Debug logs will appear here when you try to log in...</div>
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
              
              <button
                onClick={() => {
                  const logs = debugLogs.join('\n')
                  navigator.clipboard.writeText(logs)
                  alert('Debug logs copied to clipboard!')
                }}
                className="w-full text-sm bg-blue-200 py-1 px-3 rounded hover:bg-blue-300"
              >
                Copy Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}