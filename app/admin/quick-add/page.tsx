'use client'

import { useState } from 'react'

export default function QuickAddUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [membershipType, setMembershipType] = useState('entrepreneur') // Default to best tier
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Split name into first and last
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0] || 'User'
      const lastName = nameParts.slice(1).join(' ') || ''

      // Call API
      const response = await fetch('/api/admin/quick-add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          membershipLevel: membershipType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `✅ ${name} added successfully! They'll receive an email with login instructions.`
        })
        // Clear form
        setName('')
        setEmail('')
      } else {
        setResult({
          success: false,
          message: `❌ Error: ${data.error}`
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: '❌ Something went wrong. Try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Quick Add User</h1>
          <p className="text-gray-600 text-center mb-8">Add someone to IBAM in 10 seconds</p>

          <form onSubmit={handleQuickAdd} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                placeholder="John Smith"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                placeholder="john@example.com"
              />
            </div>

            {/* Membership Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMembershipType('ibam_member')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    membershipType === 'ibam_member'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Basic</div>
                  <div className="text-xs text-gray-600">Course only</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMembershipType('entrepreneur')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    membershipType === 'entrepreneur'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Full Access</div>
                  <div className="text-xs text-gray-600">Everything</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105'
              }`}
            >
              {loading ? '⏳ Adding User...' : '🚀 Add User & Send Email'}
            </button>
          </form>

          {/* Result Message */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <p className={`text-center font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1️⃣ They get a welcome email instantly</li>
              <li>2️⃣ Email contains a magic login link</li>
              <li>3️⃣ They click link → Set password → Done!</li>
              <li>4️⃣ Full access to IBAM platform</li>
            </ol>
          </div>

          {/* System.io Note */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> To add them to System.io too, go to System.io → Contacts → Add Contact → Apply matching tag
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}