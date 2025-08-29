'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import ExtensionConflictWarning from '../../components/auth/ExtensionConflictWarning'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Only clear specific items, not all cookies
      localStorage.removeItem('ibam_session')
      localStorage.removeItem('ibam_profile')

      console.log('🔐 Attempting login for:', email)

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (authError) {
        console.error('Auth error:', authError)
        setError(`Login failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user || !authData.session) {
        setError('Login failed: Invalid response')
        setLoading(false)
        return
      }

      console.log('✅ Login successful for:', authData.user.email)

      // Store session info
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
        timestamp: new Date().toISOString()
      }

      localStorage.setItem('ibam_session', JSON.stringify(userSession))
      localStorage.setItem('ibam-auth-email', authData.user.email!)

      // Set auth cookie for middleware (critical for incognito mode)
      document.cookie = `ibam_auth=${authData.user.email}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
      
      console.log('✅ Session and cookies set for:', authData.user.email)
      
      // Immediate redirect without waiting - bypass profile fetch issues
      window.location.replace('/dashboard')

    } catch (error: any) {
      console.error('Login error:', error)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to IBAM</h1>
          <p className="text-gray-600">Sign in to access your learning platform</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        <div className="mt-6 space-y-3 text-center">
          <div>
            <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 text-sm">
              Don't have an account? Sign up
            </a>
          </div>
          
          <div>
            <a href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm underline">
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Empowering Faith-Driven entrepreneurs worldwide
          </p>
        </div>

        {/* Debug info in development */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          Environment: {typeof window !== 'undefined' && window.location.hostname.includes('ibam-learn-platform-v3') ? 'Production' : 'Staging'}
        </div>
      </div>
    </div>
  )
}