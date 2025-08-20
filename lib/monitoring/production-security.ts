/**
 * Production Security Monitoring
 * 
 * This module provides security monitoring capabilities specifically for production
 * without modifying existing production code paths.
 */

interface SecurityEvent {
  timestamp: Date;
  type: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'suspicious_activity' | 'error';
  userId?: string;
  email?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityMetrics {
  totalAuthAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  suspiciousActivities: number;
  uniqueUsers: Set<string>;
  timeWindow: Date;
}

/**
 * Production Security Monitor
 * 
 * Monitors security events without interfering with production operations
 */
export class ProductionSecurityMonitor {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 1000; // Keep last 1000 events
  
  /**
   * Log a security event for monitoring
   */
  static logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }
    
    // Alert on critical events
    if (event.severity === 'critical') {
      this.alertCriticalEvent(securityEvent);
    }
    
    // Check for patterns
    this.checkSecurityPatterns();
  }
  
  /**
   * Get security metrics for a time window
   */
  static getSecurityMetrics(hoursBack: number = 24): SecurityMetrics {
    const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp >= cutoff);
    
    const metrics: SecurityMetrics = {
      totalAuthAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,
      suspiciousActivities: 0,
      uniqueUsers: new Set(),
      timeWindow: cutoff
    };
    
    recentEvents.forEach(event => {
      if (event.email) {
        metrics.uniqueUsers.add(event.email);
      }
      
      switch (event.type) {
        case 'auth_attempt':
          metrics.totalAuthAttempts++;
          break;
        case 'auth_success':
          metrics.successfulLogins++;
          break;
        case 'auth_failure':
          metrics.failedLogins++;
          break;
        case 'suspicious_activity':
          metrics.suspiciousActivities++;
          break;
      }
    });
    
    return metrics;
  }
  
  /**
   * Check for suspicious patterns
   */
  private static checkSecurityPatterns(): void {
    const recentEvents = this.events.slice(-50); // Check last 50 events
    
    // Check for multiple failed logins from same IP
    const failuresByIP = new Map<string, number>();
    recentEvents
      .filter(e => e.type === 'auth_failure')
      .forEach(event => {
        const count = failuresByIP.get(event.ip) || 0;
        failuresByIP.set(event.ip, count + 1);
      });
    
    // Alert on suspicious IPs
    failuresByIP.forEach((count, ip) => {
      if (count >= 5) {
        this.logEvent({
          type: 'suspicious_activity',
          ip,
          userAgent: '',
          details: { 
            pattern: 'multiple_failed_logins',
            count,
            timeframe: '10_minutes'
          },
          severity: 'high'
        });
      }
    });
  }
  
  /**
   * Alert on critical security events
   */
  private static alertCriticalEvent(event: SecurityEvent): void {
    console.error('🚨 CRITICAL SECURITY EVENT:', {
      type: event.type,
      timestamp: event.timestamp,
      ip: event.ip,
      details: event.details
    });
    
    // In production, this would send alerts to monitoring systems
    // For now, we'll log to console and could integrate with external services
  }
  
  /**
   * Get recent security events for analysis
   */
  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }
  
  /**
   * Export security report
   */
  static generateSecurityReport(): string {
    const metrics = this.getSecurityMetrics(24);
    const recentCritical = this.events
      .filter(e => e.severity === 'critical')
      .slice(-10);
    
    return `
# Security Report - ${new Date().toISOString()}

## 24-Hour Metrics
- Total Auth Attempts: ${metrics.totalAuthAttempts}
- Successful Logins: ${metrics.successfulLogins}
- Failed Logins: ${metrics.failedLogins}
- Suspicious Activities: ${metrics.suspiciousActivities}
- Unique Users: ${metrics.uniqueUsers.size}

## Recent Critical Events
${recentCritical.length === 0 ? 'None' : recentCritical.map(e => 
  `- ${e.timestamp.toISOString()}: ${e.type} from ${e.ip}`
).join('\n')}

## Recommendations
${metrics.failedLogins > 10 ? '⚠️ High number of failed logins detected' : '✅ Login failure rate normal'}
${metrics.suspiciousActivities > 0 ? '⚠️ Suspicious activities detected' : '✅ No suspicious activities'}
    `.trim();
  }
}

/**
 * Middleware wrapper for existing production routes
 * This can be added to production without changing core logic
 */
export function withSecurityMonitoring<T extends Function>(
  routeHandler: T,
  routeName: string
): T {
  return (async (...args: any[]) => {
    const request = args[0] as Request;
    const startTime = Date.now();
    
    try {
      // Extract security context
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      // Call original handler
      const result = await routeHandler(...args);
      
      // Log successful request
      ProductionSecurityMonitor.logEvent({
        type: 'auth_success',
        ip,
        userAgent,
        details: {
          route: routeName,
          duration: Date.now() - startTime,
          status: 'success'
        },
        severity: 'low'
      });
      
      return result;
      
    } catch (error) {
      // Log error/failure
      ProductionSecurityMonitor.logEvent({
        type: 'error',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: {
          route: routeName,
          error: error instanceof Error ? error.message : 'unknown',
          duration: Date.now() - startTime
        },
        severity: 'medium'
      });
      
      throw error;
    }
  }) as T;
}