'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      // Clear any existing sessions
      localStorage.removeItem('ibam_session')
      localStorage.removeItem('ibam_profile')

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        setError(`Login failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user || !authData.session) {
        setError('Login failed: Invalid response')
        setLoading(false)
        return
      }

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
      
      // Set HTTP cookies for middleware - both client and server cookies
      document.cookie = `ibam_auth=${email}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      document.cookie = `ibam_auth_server=${email}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict; httponly`;
      
      // Ensure user profile exists (critical for new auth users)
      try {
        console.log('🔍 Ensuring user profile exists for:', email);
        const profileResponse = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            auth_user_id: authData.user.id,
          }),
        });
        
        if (profileResponse.ok) {
          console.log('✅ User profile ensured');
        } else {
          console.warn('⚠️ Profile creation check failed, but proceeding...');
        }
      } catch (profileError) {
        console.warn('Profile creation error:', profileError);
      }
      
      // Verify session works before redirecting
      try {
        const sessionCheck = await fetch('/api/auth/session');
        if (!sessionCheck.ok) {
          console.warn('Session validation failed, but proceeding...');
        } else {
          console.log('✅ Session validation successful');
        }
      } catch (sessionError) {
        console.warn('Session check failed:', sessionError);
      }
      
      // Redirect to dashboard
      window.location.href = '/dashboard'

    } catch (error: any) {
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Enter your email"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Enter your password"
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

        <div className="mt-6 text-center">
          <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 text-sm">
            Don't have an account? Sign up
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Empowering Faith-Driven entrepreneurs worldwide
          </p>
        </div>
      </div>
    </div>
  )
}
