// ENHANCED LOGIN PAGE WITH COMPLETE DEBUGGING
// File: app/auth/login/page.tsx

'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebugLogs([])

    try {
      addLog('=== ENHANCED LOGIN DEBUG START ===')
      addLog(`Attempting login with email: ${email}`)

      // STEP 1: Test direct Supabase auth first
      addLog('STEP 1: Testing direct Supabase authentication...')
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      addLog(`Supabase direct auth result: ${JSON.stringify({
        success: !!supabaseData.user,
        hasUser: !!supabaseData.user,
        userEmail: supabaseData.user?.email,
        error: supabaseError?.message
      })}`)

      if (supabaseError) {
        addLog(`❌ Supabase error: ${supabaseError.message}`)
        setError(`Supabase authentication failed: ${supabaseError.message}`)
        setLoading(false)
        return
      }

      if (!supabaseData.user) {
        addLog('❌ No user returned from Supabase')
        setError('No user data returned from authentication')
        setLoading(false)
        return
      }

      addLog('✅ Direct Supabase auth successful!')

      // STEP 2: Test NextAuth integration
      addLog('STEP 2: Testing NextAuth integration...')
      
      const nextAuthResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      addLog(`NextAuth result: ${JSON.stringify({
        ok: nextAuthResult?.ok,
        error: nextAuthResult?.error,
        status: nextAuthResult?.status,
        url: nextAuthResult?.url
      })}`)

      if (nextAuthResult?.error) {
        addLog(`❌ NextAuth error: ${nextAuthResult.error}`)
        setError(`Authentication failed: ${nextAuthResult.error}`)
        setLoading(false)
        return
      }

      if (!nextAuthResult?.ok) {
        addLog('❌ NextAuth returned not ok')
        setError('Authentication failed - invalid credentials')
        setLoading(false)
        return
      }

      addLog('✅ NextAuth authentication successful!')

      // STEP 3: Verify session creation
      addLog('STEP 3: Verifying session creation...')
      
      const session = await getSession()
      addLog(`Session check: ${JSON.stringify({
        hasSession: !!session,
        userEmail: session?.user?.email,
        userId: session?.user?.id,
        memberType: session?.user?.memberType
      })}`)

      if (!session) {
        addLog('❌ No session created after successful auth')
        setError('Session creation failed')
        setLoading(false)
        return
      }

      addLog('✅ Session created successfully!')

      // STEP 4: Force redirect to dashboard
      addLog('STEP 4: Redirecting to dashboard...')
      
      // Try multiple redirect methods
      try {
        router.push('/dashboard')
        addLog('Router.push attempted')
        
        // Backup redirect method
        setTimeout(() => {
          window.location.href = '/dashboard'
          addLog('Window.location.href backup executed')
        }, 1000)
        
      } catch (redirectError) {
        addLog(`❌ Redirect error: ${redirectError}`)
        // Force redirect as last resort
        window.location.replace('/dashboard')
      }

    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`)
      console.error('Login error:', error)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test Supabase connection on component load
  useState(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        addLog(`Connection test: ${error ? `❌ ${error.message}` : '✅ Connected'}`)
      } catch (err) {
        addLog(`Connection test failed: ${err}`)
      }
    }
    testConnection()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Login Form */}
          <div>
            <h1 className="text-2xl font-bold text-center mb-6">Sign in to IBAM</h1>
            
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

            {/* Quick Test User Button */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Quick Test (if you created test@ibam.org):</p>
              <button
                onClick={() => {
                  setEmail('test@ibam.org')
                  setPassword('password123')
                }}
                className="text-xs bg-gray-200 px-3 py-1 rounded"
              >
                Fill Test Credentials
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
                className="w-full text-sm bg-gray-200 py-1 px-3 rounded"
              >
                Clear Logs
              </button>
              
              <button
                onClick={() => {
                  const logs = debugLogs.join('\n')
                  navigator.clipboard.writeText(logs)
                  alert('Debug logs copied to clipboard!')
                }}
                className="w-full text-sm bg-blue-200 py-1 px-3 rounded"
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

// ALSO CREATE: Simple Dashboard Test Page
// File: app/dashboard/page.tsx

'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    console.log('Dashboard mounted with session:', session)
    setDebugInfo({
      status,
      hasSession: !!session,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
      memberType: session?.user?.memberType,
      timestamp: new Date().toISOString()
    })

    if (status === 'loading') return
    
    if (!session) {
      console.log('No session, redirecting to login')
      router.push('/auth/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>No session found. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 LOGIN SUCCESS!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to your IBAM Dashboard, {session.user?.email}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">User Email</h3>
              <p className="text-sm text-green-700">{session.user?.email}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">User ID</h3>
              <p className="text-sm text-blue-700">{session.user?.id}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Member Type</h3>
              <p className="text-sm text-purple-700">{session.user?.memberType || 'trial'}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-900">Session Status</h3>
              <p className="text-sm text-orange-700">{status}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/sessions')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Sessions
            </button>
            
            <button
              onClick={() => signOut()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}