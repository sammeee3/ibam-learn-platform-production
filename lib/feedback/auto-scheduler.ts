/**
 * 🤖 Production Feedback Auto-Scheduler
 * Automatically syncs production feedback every 5 minutes
 * Runs in staging environment only - completely safe
 */

import { syncProductionFeedbackToStagingTasks } from './production-reader'

class ProductionFeedbackScheduler {
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false
  private lastRun: Date | null = null
  private runCount = 0
  
  constructor() {
    // Only run in staging/development
    if (this.isStagingEnvironment()) {
      console.log('🤖 Production Feedback Scheduler initialized for staging')
    } else {
      console.log('ℹ️ Production Feedback Scheduler disabled (not staging environment)')
    }
  }
  
  private isStagingEnvironment(): boolean {
    // Check if we're in staging based on environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    return supabaseUrl.includes('yhfxxouswctucxvfetcq') || // Staging database
           process.env.NODE_ENV === 'development' ||
           process.env.VERCEL_ENV === 'preview'
  }
  
  /**
   * Start automatic syncing every 5 minutes
   */
  start(): void {
    if (!this.isStagingEnvironment()) {
      console.log('⚠️ Scheduler not started - not in staging environment')
      return
    }
    
    if (this.isRunning) {
      console.log('ℹ️ Scheduler already running')
      return
    }
    
    console.log('🚀 Starting production feedback auto-sync (every 5 minutes)')
    
    // Run immediately on start
    this.runSync()
    
    // Then run every 5 minutes
    this.intervalId = setInterval(() => {
      this.runSync()
    }, 5 * 60 * 1000) // 5 minutes
    
    this.isRunning = true
  }
  
  /**
   * Stop automatic syncing
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('🛑 Production feedback scheduler stopped')
  }
  
  /**
   * Run sync operation
   */
  private async runSync(): Promise<void> {
    try {
      this.lastRun = new Date()
      this.runCount++
      
      console.log(`🔄 Auto-sync #${this.runCount} starting at ${this.lastRun.toLocaleTimeString()}`)
      
      const result = await syncProductionFeedbackToStagingTasks()
      
      if (result.processed > 0) {
        console.log(`🎯 Auto-sync #${this.runCount}: ${result.message}`)
      } else {
        console.log(`✅ Auto-sync #${this.runCount}: No new production feedback`)
      }
      
    } catch (error) {
      console.error(`❌ Auto-sync #${this.runCount} failed:`, error)
    }
  }
  
  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      runCount: this.runCount,
      nextRun: this.isRunning && this.lastRun ? 
        new Date(this.lastRun.getTime() + 5 * 60 * 1000) : null,
      environment: this.isStagingEnvironment() ? 'staging' : 'production'
    }
  }
  
  /**
   * Manual trigger for testing
   */
  async manualSync(): Promise<any> {
    console.log('🔧 Manual sync triggered')
    return await syncProductionFeedbackToStagingTasks()
  }
}

// Create singleton instance
export const productionFeedbackScheduler = new ProductionFeedbackScheduler()

// Auto-start in staging environments
if (typeof window === 'undefined') { // Server-side only
  try {
    // Start scheduler automatically when module loads
    productionFeedbackScheduler.start()
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('📋 Shutting down production feedback scheduler...')
      productionFeedbackScheduler.stop()
      process.exit(0)
    })
    
    process.on('SIGTERM', () => {
      productionFeedbackScheduler.stop()
    })
    
  } catch (error) {
    console.error('❌ Failed to start production feedback scheduler:', error)
  }
}

export default productionFeedbackScheduler