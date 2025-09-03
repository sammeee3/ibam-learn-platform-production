/**
 * 🕐 AUTOMATED SECURITY MONITORING SCHEDULER
 * Runs security scans automatically at regular intervals
 */

import { securityMonitor } from './monitor'

interface MonitoringConfig {
  enabled: boolean
  intervals: {
    critical: number    // How often to check for critical threats (minutes)
    standard: number    // How often to run full scans (minutes)
    metrics: number     // How often to collect metrics (minutes)
  }
  notifications: {
    email?: string
    slack?: string
    webhook?: string
  }
}

export class SecurityScheduler {
  private config: MonitoringConfig
  private intervals: { [key: string]: NodeJS.Timeout } = {}
  private isRunning = false

  constructor(config: MonitoringConfig = {
    enabled: true,
    intervals: {
      critical: 5,     // Check every 5 minutes for critical issues (faster detection)
      standard: 30,    // Full scan every 30 minutes (more frequent)
      metrics: 5       // Collect metrics every 5 minutes
    },
    notifications: {}
  }) {
    this.config = config
  }

  /**
   * 🚀 Start automated monitoring
   */
  start(): void {
    if (this.isRunning || !this.config.enabled) {
      console.log('⏸️ Security monitoring already running or disabled')
      return
    }

    console.log('🛡️ Starting automated security monitoring...')
    this.isRunning = true

    // Critical threat monitoring (every 15 minutes)
    this.intervals.critical = setInterval(async () => {
      await this.runCriticalCheck()
    }, this.config.intervals.critical * 60 * 1000)

    // Full security scan (every hour)
    this.intervals.standard = setInterval(async () => {
      await this.runFullScan()
    }, this.config.intervals.standard * 60 * 1000)

    // Metrics collection (every 5 minutes)
    this.intervals.metrics = setInterval(async () => {
      await this.collectMetrics()
    }, this.config.intervals.metrics * 60 * 1000)

    // NEW: Repository security scan (every 10 minutes for immediate detection)
    this.intervals.repository = setInterval(async () => {
      await this.scanRepositoryForSecrets()
    }, 10 * 60 * 1000)

    // Run initial scans
    this.runCriticalCheck()
    this.collectMetrics()
    this.scanRepositoryForSecrets() // NEW: Initial repository scan

    console.log('✅ Automated security monitoring started')
    console.log(`   - Critical checks: every ${this.config.intervals.critical} minutes`)
    console.log(`   - Full scans: every ${this.config.intervals.standard} minutes`)
    console.log(`   - Metrics: every ${this.config.intervals.metrics} minutes`)
    console.log(`   - Repository scans: every 10 minutes`) // NEW
  }

  /**
   * ⏹️ Stop automated monitoring
   */
  stop(): void {
    if (!this.isRunning) {
      return
    }

    console.log('⏹️ Stopping automated security monitoring...')
    
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval)
    })
    
    this.intervals = {}
    this.isRunning = false
    
    console.log('✅ Security monitoring stopped')
  }

  /**
   * 🚨 Run critical threat check
   */
  private async runCriticalCheck(): Promise<void> {
    try {
      console.log('🔍 Running critical threat check...')
      
      const [adminAlerts, paymentAlerts] = await Promise.all([
        securityMonitor.checkUnauthorizedAdmins(),
        securityMonitor.checkUnauthorizedPayments()
      ])
      
      const criticalAlerts = [...adminAlerts, ...paymentAlerts].filter(
        alert => alert.type === 'CRITICAL'
      )
      
      if (criticalAlerts.length > 0) {
        console.log('🚨 CRITICAL SECURITY THREATS DETECTED!')
        await this.handleCriticalAlerts(criticalAlerts)
      } else {
        console.log('✅ No critical threats detected')
      }
      
    } catch (error) {
      console.error('Critical check failed:', error)
    }
  }

  /**
   * 🔍 Run full security scan
   */
  private async runFullScan(): Promise<void> {
    try {
      console.log('🛡️ Running full security scan...')
      
      const results = await securityMonitor.runSecurityScan()
      
      console.log(`📊 Scan complete: ${results.riskLevel} risk level`)
      console.log(`📊 Alerts: ${results.alerts.length} total`)
      
      // Log results to monitoring system
      await this.logScanResults(results)
      
      // Handle high-risk situations
      if (results.riskLevel === 'CRITICAL' || results.riskLevel === 'HIGH') {
        await this.handleHighRiskSituation(results)
      }
      
    } catch (error) {
      console.error('Full scan failed:', error)
    }
  }

  /**
   * 📊 Collect security metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      const metrics = await securityMonitor.getSecurityMetrics()
      
      // Log metrics for trend analysis
      console.log('📊 Security metrics:', {
        newUsers: metrics.newUsers,
        failedLogins: metrics.failedLogins,
        webhookFailures: metrics.webhookFailures
      })
      
      // TODO: Store metrics in database for historical analysis
      
    } catch (error) {
      console.error('Metrics collection failed:', error)
    }
  }

  /**
   * 🔍 Scan repository for exposed secrets
   */
  private async scanRepositoryForSecrets(): Promise<void> {
    try {
      console.log('🔍 Scanning repository for exposed secrets...')
      
      // Call the repository scanning API
      const response = await fetch('/api/security/scan-repository')
      const result = await response.json()
      
      if (result.status === 'VULNERABLE') {
        console.error('🚨 EXPOSED SECRETS DETECTED IN REPOSITORY!')
        console.error(`   Risk Level: ${result.riskLevel}`)
        console.error(`   Total Exposures: ${result.totalExposures}`)
        console.error(`   Threats Found: ${result.threats.length}`)
        
        // Send critical alert
        await this.handleCriticalAlerts(result.threats.map((t: any) => ({
          type: 'CRITICAL',
          title: `Repository Security: ${t.type}`,
          description: `Found in ${t.file}: ${t.action}`
        })))
        
        // Log all threats
        result.threats.forEach((threat: any) => {
          console.error(`   🚨 ${threat.type} in ${threat.file}`)
        })
      } else {
        console.log('✅ Repository scan complete - no exposed secrets found')
      }
      
    } catch (error) {
      console.error('Repository scan failed:', error)
    }
  }

  /**
   * 🚨 Handle critical security alerts
   */
  private async handleCriticalAlerts(alerts: any[]): Promise<void> {
    console.log('🚨 HANDLING CRITICAL SECURITY ALERTS:')
    
    alerts.forEach(alert => {
      console.log(`   🚨 ${alert.title}: ${alert.description}`)
    })

    // Send immediate notifications
    await this.sendNotifications(alerts, 'CRITICAL')
    
    // TODO: Implement automatic response actions:
    // - Temporarily disable user registration
    // - Lock admin accounts
    // - Alert all administrators
    // - Create incident response ticket
  }

  /**
   * ⚠️ Handle high-risk situations
   */
  private async handleHighRiskSituation(results: any): Promise<void> {
    console.log(`⚠️ HIGH RISK SITUATION DETECTED: ${results.riskLevel}`)
    
    // Send notifications to administrators
    await this.sendNotifications(results.alerts, results.riskLevel)
    
    // Increase monitoring frequency temporarily
    if (results.riskLevel === 'CRITICAL') {
      console.log('🚨 Increasing monitoring frequency to every 5 minutes')
      // TODO: Implement temporary high-frequency monitoring
    }
  }

  /**
   * 📧 Send security notifications
   */
  private async sendNotifications(alerts: any[], level: string): Promise<void> {
    try {
      // Console logging (always available)
      console.log(`🚨 SECURITY ALERT (${level}):`)
      alerts.forEach((alert: any) => {
        console.log(`   - ${alert.title}: ${alert.description}`)
      })
      
      // TODO: Implement actual notification channels:
      /*
      if (this.config.notifications.email) {
        await sendEmailAlert(this.config.notifications.email, alerts, level)
      }
      
      if (this.config.notifications.slack) {
        await sendSlackAlert(this.config.notifications.slack, alerts, level)
      }
      
      if (this.config.notifications.webhook) {
        await sendWebhookAlert(this.config.notifications.webhook, alerts, level)
      }
      */
      
    } catch (error) {
      console.error('Failed to send notifications:', error)
    }
  }

  /**
   * 📊 Log scan results for historical analysis
   */
  private async logScanResults(results: any): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      riskLevel: results.riskLevel,
      alertCount: results.alerts.length,
      metrics: results.metrics
    }
    
    // TODO: Store in database or logging service
    console.log('📊 Scan logged:', logEntry)
  }

  /**
   * ℹ️ Get monitoring status
   */
  getStatus() {
    return {
      running: this.isRunning,
      config: this.config,
      uptime: this.isRunning ? Date.now() : 0
    }
  }
}

// Export singleton instance
export const securityScheduler = new SecurityScheduler()

// Auto-start security monitoring in all environments (unless explicitly disabled)
if (process.env.SECURITY_MONITORING !== 'disabled') {
  const env = process.env.NODE_ENV || 'development'
  console.log(`🛡️ ${env} environment detected - starting security monitoring`)
  securityScheduler.start()
}