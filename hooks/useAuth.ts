import { useEffect, useState } from 'react'

export interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  subscriptionStatus: 'trial' | 'active' | 'expired'
  courseAccess: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = 'https://your-systemio-subdomain.systeme.io/member'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const hasAccess = (courseId: string): boolean => {
    if (!user) return false
    if (user.subscriptionStatus === 'expired') return false
    return user.courseAccess.includes(courseId) || user.courseAccess.includes('all')
  }

  return {
    user,
    loading,
    logout,
    hasAccess,
    isAuthenticated: !!user,
    isTrialActive: user?.subscriptionStatus === 'trial',
    isSubscriptionActive: user?.subscriptionStatus === 'active'
  }
}
