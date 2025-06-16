'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    console.log('Dashboard mounted with session:', session)
    setDebugInfo({
      status,
      hasSession: !!session,
      userEmail: session?.user?.email,
      userId: session?.user?.id,
      memberType: session?.user?.memberType,
      timestamp: new Date().toISOString()
    })

    if (status === 'loading') return
    
    if (!session) {
      console.log('No session, redirecting to login')
      router.push('/auth/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>No session found. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 LOGIN SUCCESS!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to your IBAM Dashboard, {session.user?.email}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">User Email</h3>
              <p className="text-sm text-green-700">{session.user?.email}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">User ID</h3>
              <p className="text-sm text-blue-700">{session.user?.id}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Member Type</h3>
              <p className="text-sm text-purple-700">{session.user?.memberType || 'trial'}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-900">Session Status</h3>
              <p className="text-sm text-orange-700">{status}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/sessions')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Sessions
            </button>
            
            <button
              onClick={() => signOut()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}