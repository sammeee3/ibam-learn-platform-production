/**
 * Security Dashboard API
 * 
 * Provides security monitoring data without affecting production operations.
 * This endpoint can be safely added to production for monitoring purposes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductionSecurityMonitor } from '@/lib/monitoring/production-security';

export async function GET(request: NextRequest) {
  try {
    // Only allow access from specific IPs or with admin token in production
    const isAuthorized = await checkSecurityAccess(request);
    
    if (!isAuthorized) {
      ProductionSecurityMonitor.logEvent({
        type: 'suspicious_activity',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: {
          action: 'unauthorized_security_dashboard_access',
          path: '/api/security/dashboard'
        },
        severity: 'medium'
      });
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const hours = parseInt(searchParams.get('hours') || '24');
    const format = searchParams.get('format') || 'json';

    // Get security metrics
    const metrics = ProductionSecurityMonitor.getSecurityMetrics(hours);
    const recentEvents = ProductionSecurityMonitor.getRecentEvents(50);

    if (format === 'report') {
      const report = ProductionSecurityMonitor.generateSecurityReport();
      return new NextResponse(report, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="security-report-${new Date().toISOString()}.txt"`
        }
      });
    }

    // Return JSON dashboard data
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      timeWindow: hours,
      metrics: {
        ...metrics,
        uniqueUsers: metrics.uniqueUsers.size // Convert Set to number
      },
      recentEvents: recentEvents.map(event => ({
        ...event,
        // Redact sensitive information
        details: redactSensitiveInfo(event.details)
      })),
      alerts: generateSecurityAlerts(metrics),
      recommendations: generateSecurityRecommendations(metrics)
    });

  } catch (error) {
    console.error('Security dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check if request is authorized to access security dashboard
 */
async function checkSecurityAccess(request: NextRequest): Promise<boolean> {
  // In development/staging, allow access
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  // Check for admin security token
  const securityToken = request.headers.get('x-security-token');
  const expectedToken = process.env.SECURITY_DASHBOARD_TOKEN;
  
  if (expectedToken && securityToken === expectedToken) {
    return true;
  }

  // Check for admin session (if we have user context)
  const adminEmail = request.headers.get('x-admin-email');
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (adminEmail && adminEmails.includes(adminEmail)) {
    return true;
  }

  return false;
}

/**
 * Redact sensitive information from event details
 */
function redactSensitiveInfo(details: Record<string, any>): Record<string, any> {
  const redacted = { ...details };
  
  // List of fields to redact
  const sensitiveFields = ['token', 'password', 'secret', 'key', 'email'];
  
  sensitiveFields.forEach(field => {
    if (redacted[field]) {
      redacted[field] = '[REDACTED]';
    }
  });

  return redacted;
}

/**
 * Generate security alerts based on metrics
 */
function generateSecurityAlerts(metrics: any): string[] {
  const alerts: string[] = [];

  if (metrics.failedLogins > 20) {
    alerts.push('🚨 HIGH: Unusual number of failed login attempts detected');
  }

  if (metrics.suspiciousActivities > 5) {
    alerts.push('⚠️ MEDIUM: Multiple suspicious activities detected');
  }

  if (metrics.totalAuthAttempts > 100) {
    alerts.push('ℹ️ INFO: High authentication activity');
  }

  return alerts;
}

/**
 * Generate security recommendations
 */
function generateSecurityRecommendations(metrics: any): string[] {
  const recommendations: string[] = [];

  if (metrics.failedLogins > 10) {
    recommendations.push('Consider implementing rate limiting on authentication endpoints');
  }

  if (metrics.suspiciousActivities > 0) {
    recommendations.push('Review suspicious activities and consider blocking problematic IPs');
  }

  if (metrics.uniqueUsers < 5) {
    recommendations.push('Low user activity - verify monitoring is working correctly');
  }

  return recommendations;
}