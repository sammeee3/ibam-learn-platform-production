'use client'

import { useState } from 'react'
import { BusinessMemberComingSoon } from '@/components/membership/BusinessMemberComingSoon'

export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Kingdom Impact Level
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            100% of your membership funds entrepreneurs and churches worldwide
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Annual (Save 2 Months)
            </button>
          </div>
        </div>

        {/* Individual Memberships */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Individual Memberships
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* IBAM Impact Members */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">IBAM Impact Members</h3>
              <p className="text-gray-600 mb-6">Perfect for learning the fundamentals</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? '10' : '100'}
                  <span className="text-base font-normal text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">Save $20/year</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Full Course Access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Module Assessments
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Progress Tracking
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-3">✗</span>
                  Business Planner (Upgrade to unlock)
                </li>
              </ul>
              
              <a
                href={`https://systeme.io/checkout/ibam-member-${billingPeriod}`}
                className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start 7-Day Free Trial
              </a>
            </div>

            {/* Entrepreneur Member */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Entrepreneur Member</h3>
              <p className="text-gray-600 mb-6">Everything you need to launch & grow</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? '20' : '200'}
                  <span className="text-base font-normal text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">Save $40/year</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <strong>Everything in IBAM Impact</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Full Business Planner Access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Export Tools (PDF/Word)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Analytics Dashboard
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Priority Email Support
                </li>
              </ul>
              
              <a
                href={`https://systeme.io/checkout/entrepreneur-member-${billingPeriod}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                Start 7-Day Free Trial
              </a>
            </div>

            {/* Business Member - Coming Soon */}
            <BusinessMemberComingSoon />
          </div>
        </div>

        {/* Church Partnerships */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Church Partnership Programs
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Empower your congregation with business training • 30-day free trial
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Small Church */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">Small Church Partner</h3>
              <p className="text-gray-600 mb-6">For churches up to 250 members</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? '49' : '490'}
                  <span className="text-base font-normal text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">Save $98/year</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Up to 250 student accounts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Church admin portal
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Ambassador management
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Cohort tracking
                </li>
              </ul>
              
              <a
                href={`https://systeme.io/checkout/church-small-${billingPeriod}`}
                className="block w-full bg-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Start 30-Day Trial
              </a>
            </div>

            {/* Large Church */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">Large Church Partner</h3>
              <p className="text-gray-600 mb-6">For churches up to 1,000 members</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? '150' : '1500'}
                  <span className="text-base font-normal text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">Save $300/year</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Up to 1,000 student accounts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Everything in Small Church
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Custom reports
                </li>
              </ul>
              
              <a
                href={`https://systeme.io/checkout/church-large-${billingPeriod}`}
                className="block w-full bg-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Start 30-Day Trial
              </a>
            </div>

            {/* Mega Church */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-purple-500">
              <h3 className="text-xl font-bold mb-4">Mega Church Partner</h3>
              <p className="text-gray-600 mb-6">For churches over 1,000 members</p>
              
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${billingPeriod === 'monthly' ? '500' : '5000'}
                  <span className="text-base font-normal text-gray-600">
                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-1">Save $1,000/year</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <strong>Unlimited student accounts</strong>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Everything in Large Church
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Custom branding options
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Dedicated support
                </li>
              </ul>
              
              <a
                href={`https://systeme.io/checkout/church-mega-${billingPeriod}`}
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Start 30-Day Trial
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-gray-600">
                Individual memberships get a 7-day free trial, church partnerships get 30 days. 
                No credit card required to start. Cancel anytime during your trial.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do memberships auto-renew?</h3>
              <p className="text-gray-600">
                Yes, all memberships auto-renew unless cancelled. You can cancel anytime through 
                your System.io account dashboard.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade anytime and get immediate access to additional features. 
                Downgrades take effect at your next renewal.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Where does my membership fee go?</h3>
              <p className="text-gray-600">
                100% of membership fees fund entrepreneurs and churches in underserved areas. 
                Our operations are funded separately by donors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}