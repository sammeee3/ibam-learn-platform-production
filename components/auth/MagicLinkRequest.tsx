'use client'

import { useState } from 'react'

export function MagicLinkRequest() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const requestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSent(true)
      } else {
        setError(data.error || 'Failed to send magic link')
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-3xl mb-3">📧</div>
        <h3 className="font-semibold text-green-900 mb-2">Check Your Email!</h3>
        <p className="text-green-700 text-sm">
          We sent a magic link to <strong>{email}</strong>
        </p>
        <p className="text-green-600 text-xs mt-2">
          Click the link in the email to log in instantly.
        </p>
        <button
          onClick={() => {
            setSent(false)
            setEmail('')
          }}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Login with Magic Link</h3>
        <p className="text-sm text-gray-600">
          No password needed - we'll email you a secure login link
        </p>
      </div>

      <form onSubmit={requestMagicLink} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
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
          {loading ? 'Sending...' : '✨ Send Me a Magic Link'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Magic links expire after 24 hours for security
        </p>
      </div>
    </div>
  )
}