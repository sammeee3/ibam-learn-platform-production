'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WebhookLog {
  id: string
  timestamp: string
  event_type: string
  email: string
  tags: string[]
  membership_detected: string
  user_created: boolean
  error?: string
  raw_data?: any
}

export default function WebhookMonitor() {
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [loading, setLoading] = useState(true)
  const [testStatus, setTestStatus] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    fetchLogs()
    
    // Auto-refresh every 5 seconds if enabled
    const interval = autoRefresh ? setInterval(fetchLogs, 5000) : null
    return () => { if (interval) clearInterval(interval) }
  }, [autoRefresh])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/webhook-logs')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendTestWebhook = async (tagName: string) => {
    setTestStatus('Sending test webhook...')
    try {
      const response = await fetch('/api/webhooks/systemio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': 'staging-secret-2025-secure'
        },
        body: JSON.stringify({
          event_type: 'TAG_ADDED',
          contact: {
            email: `test-${Date.now()}@example.com`,
            firstName: 'Test',
            lastName: 'User',
            tags: [tagName]
          }
        })
      })
      
      const result = await response.json()
      if (response.ok) {
        setTestStatus(`✅ Test successful! Check logs above.`)
      } else {
        setTestStatus(`❌ Test failed: ${result.error}`)
      }
      
      // Refresh logs after test
      setTimeout(fetchLogs, 1000)
    } catch (error) {
      setTestStatus(`❌ Error: ${error}`)
    }
  }

  const clearLogs = async () => {
    if (confirm('Clear all webhook logs?')) {
      await fetch('/api/admin/webhook-logs', { method: 'DELETE' })
      setLogs([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">🔗 Webhook Monitor</h1>
              <p className="text-gray-600 mt-1">System.io webhook testing and monitoring</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
              </button>
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Webhook Configuration Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 System.io Webhook Configuration</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Webhook URL:</p>
              <code className="block bg-white p-3 rounded text-xs border border-gray-300">
                https://ibam-learn-platform-staging-v2.vercel.app/api/webhooks/systemio
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Secret Key:</p>
              <code className="block bg-white p-3 rounded text-xs border border-gray-300">
                staging-secret-2025-secure
              </code>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Required Events:</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">TAG_ADDED</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">TAG_REMOVED</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">CONTACT_CREATED</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">CONTACT_UPDATED</span>
            </div>
          </div>
        </div>

        {/* Test Webhook Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🧪 Test Webhook</h2>
          <p className="text-sm text-gray-600 mb-4">
            Send a test webhook to verify membership tag processing:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => sendTestWebhook('IBAM Impact Members')}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Test IBAM Member
            </button>
            <button
              onClick={() => sendTestWebhook('Entrepreneur')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Test Entrepreneur
            </button>
            <button
              onClick={() => sendTestWebhook('Church Partnership Small')}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              Test Church Small
            </button>
            <button
              onClick={() => sendTestWebhook('Unknown Tag')}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
            >
              Test Unknown Tag
            </button>
          </div>
          {testStatus && (
            <div className={`p-3 rounded-lg text-sm ${
              testStatus.includes('✅') ? 'bg-green-50 text-green-800' : 
              testStatus.includes('❌') ? 'bg-red-50 text-red-800' : 
              'bg-blue-50 text-blue-800'
            }`}>
              {testStatus}
            </div>
          )}
        </div>

        {/* Webhook Logs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">📜 Recent Webhook Events</h2>
            <button
              onClick={clearLogs}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear Logs
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading webhook logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No webhook events yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Events will appear here when System.io sends webhooks
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div 
                  key={log.id}
                  className={`border rounded-lg p-4 ${
                    log.error ? 'border-red-300 bg-red-50' : 
                    log.user_created ? 'border-green-300 bg-green-50' : 
                    'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        log.event_type === 'TAG_ADDED' ? 'bg-blue-100 text-blue-700' :
                        log.event_type === 'TAG_REMOVED' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {log.event_type}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {log.user_created && (
                      <span className="text-green-600 text-sm font-medium">✅ User Created</span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email:</p>
                      <p className="font-medium">{log.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tags:</p>
                      <p className="font-medium">{log.tags.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Membership Detected:</p>
                      <p className="font-medium">{log.membership_detected || 'None'}</p>
                    </div>
                  </div>
                  
                  {log.error && (
                    <div className="mt-3 p-2 bg-red-100 rounded text-red-700 text-sm">
                      Error: {log.error}
                    </div>
                  )}
                  
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      View Raw Data
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.raw_data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Help */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">🎯 Testing Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click one of the test buttons above to simulate a System.io webhook</li>
            <li>Watch the logs update to see how the webhook is processed</li>
            <li>Check if the user is created with the correct membership tier</li>
            <li>For real testing: Add a tag to a contact in System.io and watch it appear here</li>
          </ol>
        </div>
      </div>
    </div>
  )
}