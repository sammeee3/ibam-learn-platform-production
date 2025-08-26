import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    
    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
    
    // Get active today (users who logged in today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: activeToday } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', today.toISOString())
    
    // Get new users this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { count: newThisWeek } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())
    
    // Get trial users
    const { count: trialUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('membership_level', 'trial')
    
    // Get recent activity (simplified for now)
    const recentActivity = [
      {
        icon: '👤',
        description: 'New user signed up',
        timestamp: 'Just now',
        action: { label: 'View', href: '/admin/users' }
      },
      {
        icon: '🔗',
        description: 'Webhook received from System.io',
        timestamp: '5 minutes ago',
        action: { label: 'Check', href: '/admin/webhooks' }
      },
      {
        icon: '📚',
        description: 'Module 1 completed by user',
        timestamp: '1 hour ago',
        action: { label: 'Details', href: '/admin/analytics' }
      }
    ]
    
    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeToday: activeToday || 0,
        newThisWeek: newThisWeek || 0,
        trialUsers: trialUsers || 0
      },
      recentActivity
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { 
        stats: {
          totalUsers: 0,
          activeToday: 0,
          newThisWeek: 0,
          trialUsers: 0
        },
        recentActivity: []
      },
      { status: 200 }
    )
  }
}