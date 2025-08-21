'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ImprovedLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetMessage('')

    try {
      // Clear any existing sessions and cookies completely
      await supabase.auth.signOut()
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });

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

      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to dashboard
      window.location.href = '/dashboard'

    } catch (error: any) {
      console.error('Login error:', error)
      setError(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setError('')
    setResetMessage('')

    if (!email) {
      setError('Please enter your email address first')
      setResetLoading(false)
      return
    }

    try {
      console.log('📧 Sending password reset to:', email)
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`
        }
      )

      if (error) {
        console.error('Reset error:', error)
        if (error.message.includes('rate limit')) {
          setError('Too many reset attempts. Please wait a few minutes.')
        } else {
          setError(`Password reset failed: ${error.message}`)
        }
      } else {
        setResetMessage('✅ Password reset email sent! Check your inbox.')
        setShowResetForm(false)
      }
    } catch (error: any) {
      console.error('Reset error:', error)
      setError(`Reset failed: ${error.message}`)
    } finally {
      setResetLoading(false)
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

        {resetMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {resetMessage}
          </div>
        )}

        {!showResetForm ? (
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
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
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

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-3 text-center">
          <div>
            <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 text-sm">
              Don't have an account? Sign up
            </a>
          </div>
          
          <div>
            <button
              onClick={() => {
                setShowResetForm(!showResetForm)
                setError('')
                setResetMessage('')
              }}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              {showResetForm ? 'Back to Sign In' : 'Forgot your password?'}
            </button>
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