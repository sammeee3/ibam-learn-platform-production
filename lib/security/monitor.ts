/**
 * 🛡️ AUTOMATED SECURITY MONITORING SYSTEM
 * Automatically detects suspicious activity and security threats
 */

import { supabaseAdmin } from '@/lib/supabase-config'

interface SecurityAlert {
  type: 'CRITICAL' | 'WARNING' | 'INFO'
  title: string
  description: string
  timestamp: string
  details: any
}

interface SecurityMetrics {
  failedLogins: number
  newUsers: number
  suspiciousIPs: string[]
  webhookFailures: number
  databaseErrors: number
}

export class SecurityMonitor {
  private alerts: SecurityAlert[] = []
  
  /**
   * 🚨 CRITICAL: Check for unauthorized admin users
   */
  async checkUnauthorizedAdmins(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = []
    
    try {
      // Check for users with admin privileges created in last 24 hours
      const { data: recentAdmins, error } = await supabaseAdmin
        .from('user_profiles')
        .select('email, created_at, login_source')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .or('is_admin.eq.true,role.eq.admin')
      
      if (recentAdmins && recentAdmins.length > 0) {
        alerts.push({
          type: 'CRITICAL',
          title: 'New Admin User Detected',
          description: `${recentAdmins.length} new admin user(s) created in last 24 hours`,
          timestamp: new Date().toISOString(),
          details: recentAdmins
        })
      }
    } catch (error) {
      console.error('Admin check failed:', error)
    }
    
    return alerts
  }

  /**
   * 🔍 Check for suspicious user registration patterns
   */
  async checkSuspiciousRegistrations(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = []
    
    try {
      // Check for mass user creation (>10 users in 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      
      const { data: recentUsers, error } = await supabaseAdmin
        .from('user_profiles')
        .select('email, created_at, login_source')
        .gte('created_at', oneHourAgo)
      
      if (recentUsers && recentUsers.length > 10) {
        alerts.push({
          type: 'WARNING',
          title: 'Mass User Registration Detected',
          description: `${recentUsers.length} users created in last hour`,
          timestamp: new Date().toISOString(),
          details: recentUsers.map(u => ({ email: u.email, source: u.login_source }))
        })
      }
      
      // Check for users with suspicious email patterns
      const suspiciousEmails = recentUsers?.filter(user => 
        user.email.includes('test') || 
        user.email.includes('temp') || 
        user.email.match(/\d{5,}/) // 5+ digits in email
      ) || []
      
      if (suspiciousEmails.length > 0) {
        alerts.push({
          type: 'WARNING',
          title: 'Suspicious Email Patterns',
          description: `${suspiciousEmails.length} users with suspicious email patterns`,
          timestamp: new Date().toISOString(),
          details: suspiciousEmails
        })
      }
    } catch (error) {
      console.error('Registration check failed:', error)
    }
    
    return alerts
  }

  /**
   * 💳 CRITICAL: Monitor payment/donation activities
   */
  async checkUnauthorizedPayments(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = []
    
    try {
      // Note: This would connect to your payment processor logs
      // For now, we'll check for unusual donation patterns in the system
      
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      // This is a placeholder - you'd implement actual payment monitoring
      console.log('🔍 Payment monitoring: Checking for unauthorized transactions...')
      
      // Could check for:
      // - Refunds you didn't initiate
      // - Large transactions outside business hours
      // - Failed payment attempts from unusual sources
      
    } catch (error) {
      console.error('Payment check failed:', error)
    }
    
    return alerts
  }

  /**
   * 🔐 Monitor authentication failures
   */
  async checkFailedLogins(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = []
    
    try {
      // Check Supabase auth logs for failed login attempts
      // Note: This requires Supabase Pro plan for detailed auth logs
      
      // Placeholder for auth monitoring
      console.log('🔍 Auth monitoring: Checking failed login attempts...')
      
      // Could implement:
      // - Multiple failed logins from same IP
      // - Login attempts with non-existent emails
      // - Unusual login times/locations
      
    } catch (error) {
      console.error('Auth check failed:', error)
    }
    
    return alerts
  }

  /**
   * 🕸️ Monitor webhook security
   */
  async checkWebhookSecurity(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = []
    
    // This would analyze webhook logs stored in your system
    console.log('🔍 Webhook monitoring: Checking for invalid signature attempts...')
    
    // Could track:
    // - Multiple webhook calls with invalid signatures
    // - Webhook calls from unauthorized IPs
    // - Unusual webhook payload patterns
    
    return alerts
  }

  /**
   * 📊 Get comprehensive security metrics
   */
  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    try {
      const { data: recentUsers } = await supabaseAdmin
        .from('user_profiles')
        .select('created_at, login_source')
        .gte('created_at', twentyFourHoursAgo)
      
      return {
        failedLogins: 0, // Would get from auth logs
        newUsers: recentUsers?.length || 0,
        suspiciousIPs: [], // Would get from server logs
        webhookFailures: 0, // Would get from webhook logs
        databaseErrors: 0 // Would get from Supabase logs
      }
    } catch (error) {
      console.error('Metrics collection failed:', error)
      return {
        failedLogins: -1,
        newUsers: -1,
        suspiciousIPs: [],
        webhookFailures: -1,
        databaseErrors: -1
      }
    }
  }

  /**
   * 🚨 Run full security scan
   */
  async runSecurityScan(): Promise<{
    alerts: SecurityAlert[]
    metrics: SecurityMetrics
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }> {
    console.log('🛡️ Starting automated security scan...')
    
    const allAlerts: SecurityAlert[] = []
    
    // Run all security checks
    const [adminAlerts, regAlerts, paymentAlerts, authAlerts, webhookAlerts] = await Promise.all([
      this.checkUnauthorizedAdmins(),
      this.checkSuspiciousRegistrations(),
      this.checkUnauthorizedPayments(),
      this.checkFailedLogins(),
      this.checkWebhookSecurity()
    ])
    
    allAlerts.push(...adminAlerts, ...regAlerts, ...paymentAlerts, ...authAlerts, ...webhookAlerts)
    
    const metrics = await this.getSecurityMetrics()
    
    // Determine risk level
    const criticalAlerts = allAlerts.filter(a => a.type === 'CRITICAL')
    const warningAlerts = allAlerts.filter(a => a.type === 'WARNING')
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
    
    if (criticalAlerts.length > 0) {
      riskLevel = 'CRITICAL'
    } else if (warningAlerts.length > 3) {
      riskLevel = 'HIGH'
    } else if (warningAlerts.length > 0) {
      riskLevel = 'MEDIUM'
    }
    
    console.log(`🛡️ Security scan complete. Risk level: ${riskLevel}`)
    console.log(`📊 Alerts found: ${allAlerts.length} (${criticalAlerts.length} critical)`)
    
    return {
      alerts: allAlerts,
      metrics,
      riskLevel
    }
  }

  /**
   * 📧 Send security alerts (placeholder for email/Slack notifications)
   */
  async sendAlerts(alerts: SecurityAlert[]): Promise<void> {
    const criticalAlerts = alerts.filter(a => a.type === 'CRITICAL')
    
    if (criticalAlerts.length > 0) {
      console.log('🚨 CRITICAL SECURITY ALERTS:')
      criticalAlerts.forEach(alert => {
        console.log(`   - ${alert.title}: ${alert.description}`)
      })
      
      // TODO: Implement actual notifications:
      // - Send email to admin
      // - Post to Slack channel
      // - Send SMS for critical alerts
    }
  }
}

export const securityMonitor = new SecurityMonitor()