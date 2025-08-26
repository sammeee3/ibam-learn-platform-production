'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SetupPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFirstTime, setIsFirstTime] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  useEffect(() => {
    // Get user info from session or token
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        // Check if they have a password set
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('password_set')
          .eq('email', user.email)
          .single()
        
        setIsFirstTime(!profile?.password_set)
      }
    }
    checkUser()
  }, [])
  
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    
    setLoading(true)
    
    try {
      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })
      
      if (updateError) throw updateError
      
      // Mark password as set in profile
      await supabase
        .from('user_profiles')
        .update({ 
          password_set: true,
          password_set_at: new Date().toISOString()
        })
        .eq('email', email)
      
      // Redirect to dashboard
      router.push('/dashboard?welcome=true')
      
    } catch (err: any) {
      setError(err.message || 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isFirstTime ? 'Welcome! Set Your Password' : 'Update Your Password'}
          </h1>
          <p className="text-gray-600">
            {isFirstTime 
              ? 'Create a password to secure your account'
              : 'Choose a new password for your account'
            }
          </p>
        </div>
        
        {email && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Account: <strong>{email}</strong></p>
          </div>
        )}
        
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password (min 8 characters)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium mb-2">Password Requirements:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className={password.length >= 8 ? 'text-green-700' : ''}>
                • At least 8 characters
              </li>
              <li className={password.match(/[A-Z]/) ? 'text-green-700' : ''}>
                • One uppercase letter recommended
              </li>
              <li className={password.match(/[0-9]/) ? 'text-green-700' : ''}>
                • One number recommended
              </li>
            </ul>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Setting Password...' : 'Set Password & Continue'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Skip password setup - I'll use magic links →
          </a>
        </div>
      </div>
    </div>
  )
}