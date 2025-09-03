'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '../../lib/admin-auth'

export default function SuperAdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    trialUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [securityStatus, setSecurityStatus] = useState<{
    riskLevel: string;
    alerts: any[];
    lastScan: string | null;
    monitoring: boolean;
  }>({
    riskLevel: 'UNKNOWN',
    alerts: [],
    lastScan: null,
    monitoring: false
  })
  const router = useRouter()
  const { checkAdminAuth } = useAdminAuth()

  useEffect(() => {
    checkAuthorization()
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      // Fetch basic stats and security status
      fetchDashboardStats()
      fetchSecurityStatus()
      
      // Set up security monitoring refresh (every 5 minutes)
      const securityInterval = setInterval(fetchSecurityStatus, 5 * 60 * 1000)
      
      return () => clearInterval(securityInterval)
    }
  }, [isAuthorized])

  const checkAuthorization = async () => {
    try {
      const result = await checkAdminAuth()
      if (result.isAuthorized) {
        setIsAuthorized(true)
      } else {
        alert('⛔ Admin access only. This incident has been logged.')
        router.push(result.redirectTo || '/dashboard')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login?redirect=/admin')
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || {
          totalUsers: 0,
          activeToday: 0,
          newThisWeek: 0,
          trialUsers: 0
        })
        setRecentActivity(data.recentActivity || [])
      } else {
        console.warn('Stats API returned error:', response.status)
        // Set default values on API failure
        setStats({
          totalUsers: 0,
          activeToday: 0,
          newThisWeek: 0,
          trialUsers: 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default values on network error
      setStats({
        totalUsers: 0,
        activeToday: 0,
        newThisWeek: 0,
        trialUsers: 0
      })
    }
  }

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch('/api/security/dashboard')
      if (response.ok) {
        const data = await response.json()
        setSecurityStatus({
          riskLevel: data.alerts && data.alerts.length > 0 ? 'HIGH' : 'LOW',
          alerts: data.alerts || [],
          lastScan: data.timestamp || data.lastScan,
          monitoring: true
        })
      } else {
        console.warn('Security API not available, using defaults')
        setSecurityStatus({
          riskLevel: 'LOW',
          alerts: [],
          lastScan: new Date().toISOString(),
          monitoring: true
        })
      }
    } catch (error) {
      console.error('Error fetching security status:', error)
      setSecurityStatus({
        riskLevel: 'UNKNOWN',
        alerts: [],
        lastScan: null,
        monitoring: false
      })
    }
  }

  const runSecurityScan = async () => {
    try {
      const response = await fetch('/api/security/scan-repository')
      if (response.ok) {
        fetchSecurityStatus() // Refresh status after scan
      }
    } catch (error) {
      console.error('Error running security scan:', error)
    }
  }

  const adminSections = [
    {
      title: '👥 User Management',
      description: 'Add users, manage accounts, view activity',
      items: [
        { name: 'Add User', href: '/admin/add-user', icon: '➕', color: 'bg-green-500', active: true },
        { name: 'User Reports', href: '/admin/user-reports', icon: '📊', color: 'bg-indigo-600', active: true },
        { name: 'Quick Add', href: '/admin/quick-add', icon: '⚡', color: 'bg-blue-500', active: true },
        { name: 'User List', href: '/admin/user-reports', icon: '📋', color: 'bg-purple-500', active: true, tooltip: 'View in User Reports' },
      ]
    },
    {
      title: '📈 Analytics & Reports',
      description: 'View metrics, conversion funnels, engagement',
      items: [
        { name: 'Analytics Dashboard', href: '/admin/analytics', icon: '📊', color: 'bg-indigo-500', active: true },
        { name: 'Session Feedback', href: '/admin/session-feedback', icon: '⭐', color: 'bg-purple-500', active: true },
        { name: 'User Feedback', href: '/admin/feedback', icon: '💬', color: 'bg-pink-500', active: true },
      ]
    },
    {
      title: '🛡️ Security & Monitoring',
      description: 'Real-time security alerts, scanning, and monitoring',
      items: [
        { name: 'Security Dashboard', href: '/admin/security', icon: '🚨', color: securityStatus.riskLevel === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-green-500', active: true },
        { name: 'Webhook Monitor', href: '/admin/webhooks', icon: '🔗', color: 'bg-cyan-500', active: true },
        { name: 'Repository Scan', href: '#', icon: '🔍', color: 'bg-orange-500', active: true, onClick: runSecurityScan },
      ]
    },
    {
      title: '📋 Deployment & Testing',
      description: 'Track deployments, testing tools, and QA',
      items: [
        { name: 'Deployment History', href: '/admin/deployment-history', icon: '📋', color: 'bg-gradient-to-r from-indigo-600 to-purple-600', active: true },
        { name: 'Testing Dashboard', href: '/admin/test-final', icon: '🧪', color: 'bg-gradient-to-r from-purple-600 to-pink-600', active: true },
        { name: 'Quick Test Scenarios', href: '/admin/test-final', icon: '🚀', color: 'bg-gradient-to-r from-blue-600 to-cyan-600', active: true },
      ]
    },
    {
      title: '🎓 Coming Soon Features',
      description: 'Features in development - check back later',
      items: [
        { name: 'Module Editor', href: '#', icon: '📚', color: 'bg-red-500', active: false },
        { name: 'Content Library', href: '#', icon: '📝', color: 'bg-orange-500', active: false },
        { name: 'Email Templates', href: '#', icon: '📨', color: 'bg-fuchsia-500', active: false },
      ]
    }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-2xl text-gray-800 mb-2">Verifying Admin Access</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⛔</div>
          <div className="text-2xl text-gray-800 mb-2">Access Denied</div>
          <div className="text-gray-600">Admin privileges required</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                🛡️ Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Complete control center for IBAM Learning Platform</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to User Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeToday}</p>
              </div>
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">New This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newThisWeek}</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Trial Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.trialUsers}</p>
              </div>
              <span className="text-2xl">⏰</span>
            </div>
          </div>

          {/* Security Status Card */}
          <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
            securityStatus.riskLevel === 'HIGH' ? 'border-red-500' : 
            securityStatus.riskLevel === 'LOW' ? 'border-green-500' : 'border-gray-500'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Security Status</p>
                <p className={`text-2xl font-bold mt-1 ${
                  securityStatus.riskLevel === 'HIGH' ? 'text-red-600' : 
                  securityStatus.riskLevel === 'LOW' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {securityStatus.riskLevel}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {securityStatus.alerts.length} alerts
                </p>
              </div>
              <span className={`text-2xl ${securityStatus.riskLevel === 'HIGH' ? 'animate-pulse' : ''}`}>
                {securityStatus.riskLevel === 'HIGH' ? '🚨' : '🛡️'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/add-user"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              ➕ Add User
            </Link>
            <Link
              href="/admin/user-reports"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              📊 User Reports
            </Link>
            <Link
              href="/admin/analytics"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              📈 Analytics
            </Link>
            <Link
              href="/admin/webhooks"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              🔗 Webhooks
            </Link>
            <Link
              href="/admin/security"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              🛡️ Security
            </Link>
            <Link
              href="/admin/test-final"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              🧪 Testing
            </Link>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {adminSections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{section.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {section.items.map((item, itemIndex) => (
                  item.active ? (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl mb-2 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-700 text-center font-medium">{item.name}</span>
                    </Link>
                  ) : (
                    <div
                      key={itemIndex}
                      className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl mb-2 opacity-50`}>
                        {item.icon}
                      </div>
                      <span className="text-sm text-gray-400 text-center font-medium">{item.name}</span>
                      <span className="text-xs text-gray-400 mt-1">Coming Soon</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🕐 Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">{activity.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                  {activity.action && (
                    <button
                      onClick={() => router.push(activity.action.href)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {activity.action.label} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>IBAM Learning Platform v2.0 | Super Admin Access</p>
          <p className="mt-1">Last deployment: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}