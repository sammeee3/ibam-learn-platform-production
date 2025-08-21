'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a valid session for password reset
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session && session.user) {
          console.log('✅ Valid reset session found for:', session.user.email)
          setIsValidSession(true)
        } else {
          console.log('❌ No valid session found')
          setError('Invalid or expired reset link. Please request a new password reset.')
        }
      } catch (err) {
        console.error('Session check error:', err)
        setError('Error validating reset link. Please try again.')
      }
    }

    checkSession()
  }, [])

  const validatePassword = (pwd: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)

    if (pwd.length < minLength) {
      return 'Password must be at least 8 characters long'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    try {
      console.log('🔒 Updating password...')
      
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        setError(`Failed to update password: ${error.message}`)
      } else {
        console.log('✅ Password updated successfully')
        setSuccess('✅ Password updated successfully! You can now log in with your new password.')
        
        // Clear form
        setPassword('')
        setConfirmPassword('')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (error: any) {
      console.error('Reset error:', error)
      setError(`Password reset failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = (pwd: string) => {
    const errors: string[] = []
    if (pwd.length < 8) errors.push('length')
    if (!/[A-Z]/.test(pwd)) errors.push('uppercase')
    if (!/[a-z]/.test(pwd)) errors.push('lowercase')
    if (!/\d/.test(pwd)) errors.push('number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('special')

    if (errors.length === 0) return 'text-green-600'
    if (errors.length <= 2) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPasswordStrengthText = (pwd: string) => {
    if (!pwd) return ''
    const errors: string[] = []
    if (pwd.length < 8) errors.push('8+ characters')
    if (!/[A-Z]/.test(pwd)) errors.push('uppercase')
    if (!/[a-z]/.test(pwd)) errors.push('lowercase') 
    if (!/\d/.test(pwd)) errors.push('number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('special character')

    if (errors.length === 0) return '✅ Strong password'
    return `Need: ${errors.join(', ')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {!isValidSession ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              Invalid or expired reset link. Please request a new password reset.
            </div>
            <a 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Back to Login
            </a>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                {success}
                <div className="text-sm mt-2">Redirecting to login page...</div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {password && (
                    <div className={`text-xs mt-1 ${getPasswordStrengthColor(password)}`}>
                      {getPasswordStrengthText(password)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <div className="text-xs mt-1 text-red-600">
                      Passwords do not match
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
                  <div className="font-medium mb-2">Password Requirements:</div>
                  <ul className="space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <a href="/auth/login" className="text-blue-600 hover:text-blue-700 text-sm">
                Back to Login
              </a>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Empowering Faith-Driven entrepreneurs worldwide
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}