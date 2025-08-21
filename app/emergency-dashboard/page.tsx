'use client'

import { useState, useEffect } from 'react'

export default function EmergencyDashboard() {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('ibam-auth-email')
    if (email) {
      setUserEmail(email)
    } else {
      window.location.href = '/emergency-login'
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/emergency-login'
  }

  const goToMainDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <html>
      <head>
        <title>Emergency Dashboard - IBAM</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-semibold text-gray-900">Emergency Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Logged in as: {userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  ✅ Emergency Access Successful
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Login Working
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>You have successfully logged in using the emergency bypass system.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      Available Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={goToMainDashboard}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 block"
                      >
                        Try Main Dashboard
                      </button>
                      <a
                        href="/modules/1"
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 inline-block"
                      >
                        Go to Modules
                      </a>
                      <a
                        href="/business-planner"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 inline-block ml-2"
                      >
                        Business Planner
                      </a>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      System Status
                    </h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>✅ Authentication: Working</li>
                      <li>✅ Emergency Access: Active</li>
                      <li>⚠️ Main Layout: Under Repair</li>
                      <li>🔧 Profile API: Being Fixed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}