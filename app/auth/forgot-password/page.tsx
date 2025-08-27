'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

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
          setError('Too many reset attempts. Please wait a few minutes and try again.')
        } else if (error.message.includes('not found')) {
          // Security: don't reveal if email exists
          setSuccess(true)
        } else {
          setError(`Unable to send reset email. Please try again.`)
        }
      } else {
        setSuccess(true)
      }
    } catch (error: any) {
      console.error('Reset error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">Enter your email and we'll send you a reset link</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success ? (
          <div>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-medium mb-2">✅ Check your email!</p>
              <p className="text-sm">
                If an account exists for {email}, we've sent password reset instructions.
                Please check your inbox and spam folder.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-6">
              <p className="font-medium mb-1">Didn't receive the email?</p>
              <ul className="space-y-1 text-xs">
                <li>• Check your spam/junk folder</li>
                <li>• Verify you entered the correct email</li>
                <li>• Wait a few minutes and try again</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSuccess(false)
                setEmail('')
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 font-medium"
            >
              Try Another Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 text-sm block">
            Back to Login
          </Link>
          <Link href="/auth/signup" className="text-gray-600 hover:text-gray-700 text-sm block">
            Don't have an account? Sign up
          </Link>
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