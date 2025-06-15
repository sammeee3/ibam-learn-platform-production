'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ModulePage() {
  const params = useParams()
  const moduleId = params?.moduleId as string

  const sessions = [1, 2, 3, 4] // Adjust based on module

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/modules" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          ← Back to Modules
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Module {moduleId}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sessions</h2>
          <div className="space-y-4">
            {sessions.map((sessionId) => (
              <div key={sessionId} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Session {moduleId}.{sessionId}</h3>
                  <p className="text-sm text-gray-500">Duration: 45 min</p>
                </div>
                <Link 
                  href={`/modules/${moduleId}/sessions/${sessionId}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Start Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
