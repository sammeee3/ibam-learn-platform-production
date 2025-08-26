'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    trialUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch basic stats
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const adminSections = [
    {
      title: '👥 User Management',
      description: 'Add users, manage accounts, view activity',
      items: [
        { name: 'Quick Add User', href: '/admin/quick-add', icon: '➕', color: 'bg-green-500', active: true },
        { name: 'User List', href: '#', icon: '📋', color: 'bg-blue-500', active: false },
        { name: 'Activity Log', href: '#', icon: '📊', color: 'bg-purple-500', active: false },
      ]
    },
    {
      title: '📈 Analytics & Reports',
      description: 'View metrics, conversion funnels, engagement',
      items: [
        { name: 'Analytics Dashboard', href: '/admin/analytics', icon: '📊', color: 'bg-indigo-500', active: true },
        { name: 'Conversion Funnel', href: '#', icon: '📉', color: 'bg-pink-500', active: false },
        { name: 'Revenue Report', href: '#', icon: '💰', color: 'bg-yellow-500', active: false },
      ]
    },
    {
      title: '🎓 Course Management',
      description: 'Manage modules, sessions, content',
      items: [
        { name: 'Module Editor', href: '#', icon: '📚', color: 'bg-red-500', active: false },
        { name: 'Content Library', href: '#', icon: '📝', color: 'bg-orange-500', active: false },
        { name: 'Assessment Results', href: '#', icon: '✅', color: 'bg-teal-500', active: false },
      ]
    },
    {
      title: '💳 Membership & Billing',
      description: 'Manage subscriptions, webhooks, pricing',
      items: [
        { name: 'Membership Tiers', href: '#', icon: '🏆', color: 'bg-amber-500', active: false },
        { name: 'Webhook Monitor', href: '/admin/webhooks', icon: '🔗', color: 'bg-cyan-500', active: true },
        { name: 'Pricing Config', href: '#', icon: '💵', color: 'bg-emerald-500', active: false },
      ]
    },
    {
      title: '⚙️ System & Security',
      description: 'System health, security logs, configurations',
      items: [
        { name: 'Security Monitor', href: '#', icon: '🔒', color: 'bg-gray-600', active: false },
        { name: 'System Health', href: '#', icon: '🏥', color: 'bg-lime-500', active: false },
        { name: 'Database Tools', href: '#', icon: '💾', color: 'bg-slate-600', active: false },
      ]
    },
    {
      title: '📧 Communications',
      description: 'Email campaigns, notifications, announcements',
      items: [
        { name: 'Send Broadcast', href: '#', icon: '📢', color: 'bg-violet-500', active: false },
        { name: 'Email Templates', href: '#', icon: '📨', color: 'bg-fuchsia-500', active: false },
        { name: 'Notification Center', href: '#', icon: '🔔', color: 'bg-rose-500', active: false },
      ]
    }
  ]

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
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/quick-add"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              ➕ Add User
            </Link>
            <button
              disabled
              className="bg-white/70 text-blue-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed shadow-md opacity-75"
            >
              📢 Send Broadcast (Soon)
            </button>
            <Link
              href="/admin/analytics"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              📊 View Analytics
            </Link>
            <Link
              href="/admin/webhooks"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              🔗 Check Webhooks
            </Link>
            <button
              disabled
              className="bg-white/70 text-blue-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed shadow-md opacity-75"
            >
              🔒 Security Status (Soon)
            </button>
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