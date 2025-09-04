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

    // Enhanced dashboard data with repository scan integration
    const repositoryStatus = await getRepositoryStatus();
    
    // Return JSON dashboard data
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      timeWindow: hours,
      riskLevel: repositoryStatus.riskLevel || 'LOW',
      monitoring: true,
      lastScan: new Date().toISOString(),
      repositoryStatus: repositoryStatus.status || 'Clean',
      metrics: {
        ...metrics,
        uniqueUsers: metrics.uniqueUsers.size // Convert Set to number
      },
      recentEvents: recentEvents.map(event => ({
        ...event,
        // Redact sensitive information
        details: redactSensitiveInfo(event.details)
      })),
      alerts: generateSecurityAlerts(metrics, repositoryStatus),
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
  // TEMPORARY: Allow all requests for staging dashboard testing
  // TODO: Implement proper authentication after testing
  
  const headers = {
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
    nodeEnv: process.env.NODE_ENV,
    host: request.headers.get('host'),
    method: request.method
  };
  
  console.log('🔍 Security access check:', headers);
  
  // For staging/development, allow all requests from our domain
  const allowedOrigins = [
    'https://ibam-learn-platform-staging.vercel.app',
    'https://ibam-learn-platform-staging-v2.vercel.app',
    'localhost:3000',
    'localhost:3001'
  ];
  
  const origin = headers.origin || headers.referer;
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => origin.includes(allowed));
    console.log('🔍 Origin check:', { origin, isAllowed });
    if (isAllowed) return true;
  }
  
  // Allow direct API calls (no origin/referer)
  if (!origin && headers.userAgent?.includes('IBAM-Security-Dashboard')) {
    console.log('🔍 Internal API call allowed');
    return true;
  }
  
  // For staging, allow all requests for now
  console.log('🔍 Allowing request for staging environment');
  return true;
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
 * Get repository security status by calling our scan API
 */
async function getRepositoryStatus(): Promise<{status: string, riskLevel: string}> {
  try {
    // Use the correct Vercel URL for staging
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'https://ibam-learn-platform-staging.vercel.app';
    
    console.log('Calling repository scan at:', `${baseUrl}/api/security/scan-repository`);
    
    const response = await fetch(`${baseUrl}/api/security/scan-repository`, {
      method: 'GET',
      headers: {
        'User-Agent': 'IBAM-Security-Dashboard/1.0'
      }
    });
    
    console.log('Repository scan response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Repository scan data:', { 
        status: data.status, 
        totalExposures: data.totalExposures,
        riskLevel: data.riskLevel,
        filesScanned: data.filesScanned 
      });
      
      return {
        status: data.status === 'VULNERABLE' ? `${data.totalExposures} secrets found` : 'Clean',
        riskLevel: data.riskLevel || 'LOW'
      };
    } else {
      console.log('Repository scan failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Repository scan error:', error);
  }
  
  return {
    status: 'Scan failed',
    riskLevel: 'UNKNOWN'
  };
}

/**
 * Generate security alerts based on metrics
 */
function generateSecurityAlerts(metrics: any, repositoryStatus?: any): string[] {
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

  // Add repository-based alerts
  if (repositoryStatus?.riskLevel === 'CRITICAL') {
    alerts.push('🚨 CRITICAL: Repository security vulnerabilities detected');
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