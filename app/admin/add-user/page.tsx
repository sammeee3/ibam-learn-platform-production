'use client'

import { useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase-config'
import { MEMBERSHIP_CONFIG } from '@/lib/membership-config'

export default function AdminAddUser() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [membershipLevel, setMembershipLevel] = useState('ibam_member')
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Call API to create user
      const response = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          membershipLevel,
          sendWelcomeEmail
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `User created successfully! Welcome email sent to ${email}. Magic link: ${data.magicLink}` })
        // Reset form
        setEmail('')
        setFirstName('')
        setLastName('')
      } else {
        // Handle specific error cases
        let errorMessage = data.error || 'Failed to create user'
        if (response.status === 409) {
          errorMessage = `A user with email "${email}" already exists. Try a different email address.`
        }
        setMessage({ type: 'error', text: errorMessage })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Admin: Add User Manually</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">When to use this:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Comp memberships for partners/influencers</li>
              <li>• Staff accounts that bypass payment</li>
              <li>• Testing different membership levels</li>
              <li>• Manual migration from old system</li>
            </ul>
          </div>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Membership Level *
              </label>
              <select
                value={membershipLevel}
                onChange={(e) => setMembershipLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="trial">Trial Member (7 days)</option>
                <option value="ibam_member">IBAM Impact Members ($10/mo)</option>
                <option value="entrepreneur">Entrepreneur Member ($20/mo)</option>
                <option value="business">Business Member ($59/mo)</option>
                <option value="church_small">Church Partner Small ($49/mo)</option>
                <option value="church_large">Church Partner Large ($150/mo)</option>
                <option value="church_mega">Church Partner Mega ($500/mo)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Note: This doesn't create a System.io subscription - for tracking only
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendWelcome"
                checked={sendWelcomeEmail}
                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="sendWelcome" className="text-sm text-gray-700">
                Send welcome email with magic login link
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
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
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold mb-3">After Creating User:</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li>1. User gets magic login link (24 hours valid)</li>
              <li>2. Add them to System.io manually if needed</li>
              <li>3. They can set password on first login</li>
              <li>4. Access level matches selected membership</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> For paid memberships, you still need to:
            </p>
            <ul className="text-sm text-yellow-800 mt-2 space-y-1">
              <li>• Add them in System.io with matching tag</li>
              <li>• Set up their billing if not comp'd</li>
              <li>• Tag will sync membership on next webhook</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}