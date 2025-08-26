'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function TrialBanner() {
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number} | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  
  const membershipLevel = user?.membership_level
  const trialEndsAt = user?.trial_ends_at
  
  // Only show for trial members
  if (membershipLevel !== 'trial' || !trialEndsAt) {
    return null
  }
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endDate = new Date(trialEndsAt).getTime()
      const difference = endDate - now
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        
        setTimeLeft({ days, hours, minutes })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute
    
    return () => clearInterval(timer)
  }, [trialEndsAt])
  
  if (!timeLeft) return null
  
  const urgencyColor = timeLeft.days <= 2 ? 'bg-red-500' : timeLeft.days <= 4 ? 'bg-orange-500' : 'bg-blue-500'
  const urgencyMessage = timeLeft.days <= 2 ? '⚡ Trial Ending Soon!' : timeLeft.days <= 4 ? '⏰ Limited Time Left' : '🎯 Free Trial Active'
  
  return (
    <>
      {/* Fixed banner at top of page */}
      <div className={`fixed top-0 left-0 right-0 z-40 ${urgencyColor} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{urgencyMessage}</span>
              
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-xs">days</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">mins</div>
                </div>
              </div>
              
              <span className="hidden md:block text-sm">
                Full course access • Planner preview mode
              </span>
            </div>
            
            <button
              onClick={() => setShowUpgrade(true)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Unlock Full Access
            </button>
          </div>
        </div>
      </div>
      
      {/* Add padding to page content to account for fixed banner */}
      <div className="h-16"></div>
      
      {/* Upgrade modal */}
      {showUpgrade && (
        <TrialUpgradeModal onClose={() => setShowUpgrade(false)} daysLeft={timeLeft.days} />
      )}
    </>
  )
}

function TrialUpgradeModal({ onClose, daysLeft }: { onClose: () => void, daysLeft: number }) {
  const specialOffer = daysLeft <= 2 // Special offer for last 2 days
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
        {specialOffer && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-t-xl -m-8 mb-6">
            <p className="text-center font-semibold">
              🔥 TRIAL ENDING SPECIAL: Save 30% if you upgrade now!
            </p>
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-center mb-6">
          Choose Your Membership
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* IBAM Impact Members Option */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-bold mb-2">IBAM Impact Members</h3>
            <p className="text-gray-600 text-sm mb-4">Course access, planner preview</p>
            
            <div className="mb-4">
              <p className="text-2xl font-bold">
                ${specialOffer ? '7' : '10'}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
              {specialOffer && (
                <p className="text-sm text-red-600 line-through">Normally $10/month</p>
              )}
            </div>
            
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Full course access
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">⚡</span>
                Planner (view only)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Progress tracking
              </li>
            </ul>
            
            <a
              href="https://systeme.io/checkout/ibam-member-monthly"
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Choose IBAM
            </a>
          </div>
          
          {/* Entrepreneur Member Option */}
          <div className="border-2 border-blue-500 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                RECOMMENDED
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2">Entrepreneur Member</h3>
            <p className="text-gray-600 text-sm mb-4">Everything unlocked</p>
            
            <div className="mb-4">
              <p className="text-2xl font-bold">
                ${specialOffer ? '14' : '20'}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </p>
              {specialOffer && (
                <p className="text-sm text-red-600 line-through">Normally $20/month</p>
              )}
            </div>
            
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Everything in IBAM
              </li>
              <li className="flex items-center font-semibold">
                <span className="text-green-500 mr-2">✓</span>
                Full planner (save & export)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced analytics
              </li>
            </ul>
            
            <a
              href="https://systeme.io/checkout/entrepreneur-member-monthly"
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Choose Entrepreneur
            </a>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue with trial ({daysLeft} days left)
          </button>
        </div>
      </div>
    </div>
  )
}