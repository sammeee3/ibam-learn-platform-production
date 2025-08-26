'use client'

import { useState } from 'react'

export function BusinessMemberComingSoon() {
  const [email, setEmail] = useState('')
  const [showInterest, setShowInterest] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Save interest to database or send notification
    console.log(`Business membership interest from: ${email}`)
    setSubmitted(true)
  }

  return (
    <div className="relative">
      {/* Grayed out overlay */}
      <div className="opacity-50 pointer-events-none">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-700">Business Membership</h3>
              <p className="text-gray-600 mt-2">Premium features for scaling businesses</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-semibold text-gray-700">What's Included (Coming):</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Advanced Business Analytics Dashboard
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Team Collaboration Tools (up to 10 users)
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Custom Business Plan Templates
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Financial Projection Tools
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Direct Mentorship Connections
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                API Access for Integrations
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                White-label Options
              </li>
              <li className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3">✓</span>
                Priority Support
              </li>
            </ul>
          </div>

          <div className="bg-white/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-gray-700">$59<span className="text-base font-normal">/month</span></p>
                <p className="text-sm text-gray-600">or $590/year (save $118)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Launch Target:</p>
                <p className="text-lg font-bold text-gray-600">Q2 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active overlay with call to action */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-4 transform hover:scale-105 transition-transform">
          {!showInterest ? (
            <>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                🚀 Help Launch Business Membership
              </h3>
              <p className="text-gray-700 mb-6">
                By joining now as a founding Business Member, you'll:
              </p>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Lock in founder pricing: <strong>$59/month forever</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Shape features based on your needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Get immediate Entrepreneur access while we build</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span>Direct input on development priorities</span>
                </li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Limited to first 20 founding members</strong><br />
                  Your investment directly funds feature development
                </p>
              </div>

              <button
                onClick={() => setShowInterest(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Express Interest & Get Notified
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                No payment required now • Cancel anytime
              </p>
            </>
          ) : !submitted ? (
            <form onSubmit={handleInterestSubmit}>
              <h3 className="text-xl font-bold mb-4">Join as Founding Member</h3>
              <p className="text-gray-700 mb-6">
                Be among the first to shape Business Membership:
              </p>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✓ Get Entrepreneur access immediately<br />
                  ✓ Automatic upgrade when Business tier launches<br />
                  ✓ Founder pricing locked in: $59/month
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Secure My Founding Member Spot
              </button>
              
              <button
                type="button"
                onClick={() => setShowInterest(false)}
                className="w-full mt-2 text-gray-500 text-sm hover:text-gray-700"
              >
                Back
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-4">You're on the List!</h3>
              <p className="text-gray-700 mb-6">
                We'll notify you when Business Membership launches.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                In the meantime, consider starting with Entrepreneur Membership 
                to access the course and business planner today.
              </p>
              <a
                href="/signup?tier=entrepreneur"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start with Entrepreneur
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}