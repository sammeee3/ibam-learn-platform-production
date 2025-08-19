'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssessmentPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">IBAM Assessment</h1>
          <p className="text-gray-600 mb-8">Choose your assessment type:</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/assessment/pre')}
              className="w-full p-6 text-left border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50"
            >
              <h3 className="text-xl font-semibold text-indigo-900">Pre-Course Assessment</h3>
              <p className="text-gray-600 mt-2">Assess your business knowledge before starting</p>
            </button>
            
            <button 
              onClick={() => router.push('/assessment/post')}
              className="w-full p-6 text-left border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50"
            >
              <h3 className="text-xl font-semibold text-green-900">Post-Course Assessment</h3>
              <p className="text-gray-600 mt-2">Evaluate your learning progress</p>
            </button>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Skip to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
