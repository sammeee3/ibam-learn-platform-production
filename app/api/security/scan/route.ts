/**
 * 🛡️ AUTOMATED SECURITY SCAN ENDPOINT
 * Runs comprehensive security monitoring and returns threat assessment
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityMonitor } from '@/lib/security/monitor'

export async function GET(request: NextRequest) {
  // Allow access from same domain or localhost
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const isAuthorized = origin?.includes(host || '') || host?.includes('localhost') || !origin

  if (!isAuthorized) {
    return NextResponse.json({ 
      error: 'Unauthorized access to security endpoint' 
    }, { status: 403 })
  }
  
  try {
    console.log('🛡️ Running automated security scan...')
    
    const scanResults = await securityMonitor.runSecurityScan()
    
    // If critical alerts found, log them prominently
    if (scanResults.riskLevel === 'CRITICAL') {
      console.log('🚨 CRITICAL SECURITY THREATS DETECTED!')
      console.log('🚨 IMMEDIATE ACTION REQUIRED!')
      
      // Send alerts (email, Slack, etc.)
      await securityMonitor.sendAlerts(scanResults.alerts)
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      riskLevel: scanResults.riskLevel,
      summary: {
        totalAlerts: scanResults.alerts.length,
        criticalAlerts: scanResults.alerts.filter(a => a.type === 'CRITICAL').length,
        warningAlerts: scanResults.alerts.filter(a => a.type === 'WARNING').length,
        infoAlerts: scanResults.alerts.filter(a => a.type === 'INFO').length
      },
      metrics: scanResults.metrics,
      alerts: scanResults.alerts,
      recommendations: generateRecommendations(scanResults)
    })
    
  } catch (error: any) {
    console.error('Security scan failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Security scan failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Generate security recommendations based on scan results
 */
function generateRecommendations(scanResults: any): string[] {
  const recommendations: string[] = []
  
  if (scanResults.riskLevel === 'CRITICAL') {
    recommendations.push('🚨 IMMEDIATE: Rotate all credentials (database, API keys)')
    recommendations.push('🚨 IMMEDIATE: Review all admin user accounts')
    recommendations.push('🚨 IMMEDIATE: Check for unauthorized transactions')
  }
  
  if (scanResults.riskLevel === 'HIGH') {
    recommendations.push('⚠️ HIGH: Monitor system closely for 24 hours')
    recommendations.push('⚠️ HIGH: Consider enabling additional security measures')
  }
  
  if (scanResults.metrics.newUsers > 20) {
    recommendations.push('📊 Consider rate limiting user registration')
  }
  
  if (scanResults.alerts.some((a: any) => a.type === 'WARNING')) {
    recommendations.push('🔍 Review system logs for unusual patterns')
  }
  
  return recommendations
}

/**
 * Health check endpoint - always returns basic status
 */
export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'X-Security-Status': 'Active',
      'X-Last-Scan': new Date().toISOString()
    }
  })
}