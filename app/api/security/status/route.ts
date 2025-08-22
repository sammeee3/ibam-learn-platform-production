/**
 * 🛡️ SECURITY STATUS ENDPOINT
 * Returns current security monitoring status and recent alerts
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityScheduler } from '@/lib/security/scheduler'
import { securityMonitor } from '@/lib/security/monitor'

export async function GET(request: NextRequest) {
  // Allow access from same domain or localhost
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const isAuthorized = origin?.includes(host || '') || host?.includes('localhost') || !origin

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get monitoring status
    const monitoringStatus = securityScheduler.getStatus()
    
    // Get recent metrics
    const metrics = await securityMonitor.getSecurityMetrics()
    
    // Quick threat assessment
    const quickScan = await securityMonitor.checkUnauthorizedAdmins()
    const criticalThreats = quickScan.filter(alert => alert.type === 'CRITICAL')
    
    const status = {
      timestamp: new Date().toISOString(),
      monitoring: {
        active: monitoringStatus.running,
        uptime: monitoringStatus.uptime,
        lastCheck: new Date().toISOString()
      },
      security: {
        riskLevel: criticalThreats.length > 0 ? 'CRITICAL' : 'LOW',
        activeThreatCount: criticalThreats.length,
        lastScan: new Date().toISOString()
      },
      metrics: metrics,
      system: {
        environment: process.env.NODE_ENV || 'development',
        version: '2.1.0',
        uptime: process.uptime()
      }
    }
    
    return NextResponse.json(status)
    
  } catch (error: any) {
    console.error('Security status check failed:', error)
    
    return NextResponse.json({
      error: 'Security status unavailable',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * Start/stop monitoring endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'start') {
      securityScheduler.start()
      return NextResponse.json({
        success: true,
        message: 'Security monitoring started',
        status: securityScheduler.getStatus()
      })
    }
    
    if (action === 'stop') {
      securityScheduler.stop()
      return NextResponse.json({
        success: true,
        message: 'Security monitoring stopped',
        status: securityScheduler.getStatus()
      })
    }
    
    return NextResponse.json({
      error: 'Invalid action',
      validActions: ['start', 'stop']
    }, { status: 400 })
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Security control failed',
      message: error.message
    }, { status: 500 })
  }
}