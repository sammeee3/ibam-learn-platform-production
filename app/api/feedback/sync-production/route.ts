/**
 * 🔄 Production Feedback Sync API
 * Automatically syncs production user feedback to staging task management
 * READ-ONLY access to production, safe automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncProductionFeedbackToStagingTasks, checkProductionDatabaseHealth } from '@/lib/feedback/production-reader'

export async function GET(request: NextRequest) {
  try {
    // Verify this is running in staging environment
    const host = request.headers.get('host')
    if (!host?.includes('staging') && !host?.includes('localhost')) {
      return NextResponse.json({ 
        error: 'This endpoint only runs in staging environment' 
      }, { status: 403 })
    }
    
    console.log('🔄 Production feedback sync triggered via API')
    
    // Health check first
    const isHealthy = await checkProductionDatabaseHealth()
    if (!isHealthy) {
      return NextResponse.json({
        api_success: false,
        error: 'Production database health check failed',
        message: 'Cannot connect to production database for reading feedback'
      }, { status: 503 })
    }
    
    // Sync production feedback to staging tasks
    const result = await syncProductionFeedbackToStagingTasks()
    
    return NextResponse.json({
      api_success: true,
      timestamp: new Date().toISOString(),
      environment: 'staging',
      ...result
    })
    
  } catch (error: any) {
    console.error('❌ Production feedback sync API error:', error)
    
    return NextResponse.json({
      api_success: false,
      error: 'Production feedback sync failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Manual trigger with optional parameters
  try {
    const { force = false } = await request.json().catch(() => ({}))
    
    console.log('🔄 Manual production feedback sync triggered', { force })
    
    const result = await syncProductionFeedbackToStagingTasks()
    
    return NextResponse.json({
      api_success: true,
      manual_trigger: true,
      timestamp: new Date().toISOString(),
      ...result
    })
    
  } catch (error: any) {
    return NextResponse.json({
      api_success: false,
      error: 'Manual sync failed',
      message: error.message
    }, { status: 500 })
  }
}

/**
 * Health check endpoint
 */
export async function HEAD() {
  const isHealthy = await checkProductionDatabaseHealth()
  
  return new NextResponse(null, { 
    status: isHealthy ? 200 : 503,
    headers: {
      'X-Production-DB-Status': isHealthy ? 'healthy' : 'unhealthy',
      'X-Last-Check': new Date().toISOString()
    }
  })
}