'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PlannerAccessControlProps {
  children: React.ReactNode
}

export function PlannerAccessControl({ children }: PlannerAccessControlProps) {
  const { user } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const membershipLevel = user?.membership_level || 'trial'
  
  // Check if user has full planner access
  const hasFullAccess = ['entrepreneur', 'business', 'church_small', 'church_large', 'church_mega'].includes(membershipLevel)
  const isTrialOrBasic = ['trial', 'ibam_member'].includes(membershipLevel)
  
  // For trial and IBAM members - show preview mode
  if (isTrialOrBasic) {
    return (
      <div className="relative">
        {/* Planner content - fully interactive but can't save */}
        <div className="relative">
          {children}
          
          {/* Floating save blocker */}
          <div 
            className="fixed bottom-8 right-8 z-50"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Preview Mode</p>
                <p className="text-sm">Upgrade to save your work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade prompt when trying to save */}
        {showUpgradeModal && (
          <UpgradeModal 
            currentTier={membershipLevel}
            onClose={() => setShowUpgradeModal(false)} 
          />
        )}
      </div>
    )
  }
  
  // Full access users
  return <>{children}</>
}

function UpgradeModal({ currentTier, onClose }: { currentTier: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform scale-100 transition-transform">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock Full Planner Access
          </h2>
          
          <p className="text-gray-600">
            {currentTier === 'trial' 
              ? "You're exploring the planner in trial mode. Upgrade to save your business plans!"
              : "As an IBAM Impact Members subscriber, you can explore the planner. Upgrade to Entrepreneur to save and export!"
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            🚀 Entrepreneur Membership Unlocks:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Save unlimited business plans</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Export to PDF & Word documents</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Track progress over time</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Access advanced planning tools</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Get personalized recommendations</span>
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-gray-900">
            $20<span className="text-base font-normal text-gray-600">/month</span>
          </p>
          <p className="text-sm text-gray-600">or $200/year (save $40)</p>
        </div>

        <div className="space-y-3">
          <a
            href="https://systeme.io/checkout/entrepreneur-member-monthly"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            Upgrade to Entrepreneur
          </a>
          
          <button
            onClick={onClose}
            className="block w-full text-gray-500 text-center py-2 hover:text-gray-700 transition-colors"
          >
            Continue Exploring
          </button>
        </div>

        {currentTier === 'trial' && (
          <p className="text-xs text-center text-gray-500 mt-4">
            Your trial has full course access. Upgrade anytime to unlock planner saves.
          </p>
        )}
      </div>
    </div>
  )
}