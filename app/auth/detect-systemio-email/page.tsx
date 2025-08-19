'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function DetectSystemIOEmailPage() {
  const [status, setStatus] = useState('detecting')
  const [detectedEmail, setDetectedEmail] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const token = searchParams.get('token')
    const returnUrl = searchParams.get('returnUrl') || '/dashboard'

    addLog('🔍 Starting System.io email detection...')

    const detectEmail = async () => {
      let userEmail: string | null = null
      let detectionMethod = 'unknown'

      // METHOD 1: Check for System.io global objects
      try {
        if (typeof window !== 'undefined') {
          const win = window as any
          
          if (win.SystemeIO?.currentUser?.email) {
            userEmail = win.SystemeIO.currentUser.email
            detectionMethod = 'SystemeIO.currentUser'
            addLog(`✅ Found via SystemeIO global: ${userEmail}`)
          } else if (win.systeme?.user?.email) {
            userEmail = win.systeme.user.email
            detectionMethod = 'systeme.user'
            addLog(`✅ Found via systeme global: ${userEmail}`)
          } else if (win.user?.email) {
            userEmail = win.user.email
            detectionMethod = 'window.user'
            addLog(`✅ Found via window.user: ${userEmail}`)
          }
        }
      } catch (e) {
        addLog(`⚠️ Method 1 failed: ${(e as Error).message}`)
      }

      // METHOD 2: Check System.io cookies
      if (!userEmail) {
        try {
          const cookies = document.cookie.split(';')
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name.toLowerCase().includes('systeme') || name.toLowerCase().includes('user')) {
              addLog(`🔍 Checking cookie: ${name}`)
              try {
                const decodedValue = decodeURIComponent(value || '')
                if (decodedValue.includes('@')) {
                  userEmail = decodedValue
                  detectionMethod = `cookie: ${name}`
                  addLog(`✅ Found via cookie ${name}: ${userEmail}`)
                  break
                } else if (decodedValue.startsWith('{')) {
                  const userData = JSON.parse(decodedValue)
                  if (userData.email) {
                    userEmail = userData.email
                    detectionMethod = `cookie JSON: ${name}`
                    addLog(`✅ Found via cookie JSON ${name}: ${userEmail}`)
                    break
                  }
                }
              } catch (e) {
                addLog(`⚠️ Cookie ${name} parse failed`)
              }
            }
          }
        } catch (e) {
          addLog(`⚠️ Method 2 failed: ${(e as Error).message}`)
        }
      }

      // METHOD 3: Check page content for user data
      if (!userEmail) {
        try {
          const profileSelectors = [
            '[data-user-email]',
            '.user-email',
            '.profile-email',
            '[data-email]',
            '.member-email',
            '.user-info',
            '.profile-info'
          ]

          for (const selector of profileSelectors) {
            const element = document.querySelector(selector)
            if (element) {
              const elementText = element.textContent || element.getAttribute('data-user-email') || element.getAttribute('data-email')
              if (elementText && elementText.includes('@')) {
                userEmail = elementText.trim()
                detectionMethod = `page element: ${selector}`
                addLog(`✅ Found via page element ${selector}: ${userEmail}`)
                break
              }
            }
          }
        } catch (e) {
          addLog(`⚠️ Method 3 failed: ${(e as Error).message}`)
        }
      }

      // METHOD 4: Extract from page text
      if (!userEmail) {
        try {
          const pageText = document.body.innerText || document.body.textContent || ''
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
          const emails = pageText.match(emailRegex)

          if (emails && emails.length > 0) {
            // Filter out system emails
            const userEmails = emails.filter(email => 
              !email.toLowerCase().includes('support@') &&
              !email.toLowerCase().includes('noreply@') &&
              !email.toLowerCase().includes('info@') &&
              !email.toLowerCase().includes('admin@') &&
              !email.toLowerCase().includes('hello@') &&
              !email.toLowerCase().includes('contact@') &&
              !email.toLowerCase().includes('example@')
            )

            if (userEmails.length > 0) {
              userEmail = userEmails[0]
              detectionMethod = 'page text extraction'
              addLog(`✅ Found via page text: ${userEmail}`)
            }
          }
        } catch (e) {
          addLog(`⚠️ Method 4 failed: ${(e as Error).message}`)
        }
      }

      // If we found an email, redirect to SSO
      if (userEmail) {
        setDetectedEmail(userEmail)
        setStatus('redirecting')
        addLog(`🎯 Email detected: ${userEmail}`)
        addLog(`🔄 Redirecting to IBAM platform...`)

        // Clear any conflicting sessions first
        try {
          // Clear localStorage
          localStorage.removeItem('ibam-auth-email')
          localStorage.removeItem('userEmail')
          
          // Clear cookies by setting them to expire
          document.cookie = 'ibam_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          document.cookie = 'ibam_auth_server=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          
          addLog(`🧹 Cleared conflicting session data`)
        } catch (e) {
          addLog(`⚠️ Session cleanup warning: ${(e as Error).message}`)
        }

        // Redirect to SSO with detected email
        const ssoUrl = `/api/auth/sso?email=${encodeURIComponent(userEmail)}&token=${token}&source=systemio-detection&method=${encodeURIComponent(detectionMethod)}`
        
        setTimeout(() => {
          window.location.href = ssoUrl
        }, 1000)
        
      } else {
        setStatus('manual_entry')
        addLog(`❌ Could not detect System.io email automatically`)
      }
    }

    detectEmail()
  }, [searchParams, router])

  const handleManualEntry = () => {
    const email = prompt('Please enter your System.io email address:')
    if (email && email.includes('@')) {
      const token = searchParams.get('token')
      const ssoUrl = `/api/auth/sso?email=${encodeURIComponent(email)}&token=${token}&source=manual-entry`
      window.location.href = ssoUrl
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔍 Detecting Your System.io Email
          </h1>
          <p className="text-gray-600">
            Please wait while we automatically detect your logged-in email...
          </p>
        </div>

        <div className="space-y-4">
          {status === 'detecting' && (
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 font-medium">Detecting email...</span>
            </div>
          )}

          {status === 'redirecting' && detectedEmail && (
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">
                ✅ Email Detected: {detectedEmail}
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-green-600 font-medium">Redirecting to IBAM platform...</span>
              </div>
            </div>
          )}

          {status === 'manual_entry' && (
            <div className="text-center space-y-4">
              <div className="text-orange-600 font-semibold">
                ⚠️ Automatic detection failed
              </div>
              <p className="text-gray-600 text-sm">
                We couldn't automatically detect your System.io email. Please enter it manually.
              </p>
              <button
                onClick={handleManualEntry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Enter Email Manually
              </button>
            </div>
          )}
        </div>

        {/* Debug logs */}
        <div className="mt-6 border-t pt-4">
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
              Detection Logs ({logs.length})
            </summary>
            <div className="mt-2 max-h-48 overflow-y-auto bg-gray-50 p-2 rounded font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}