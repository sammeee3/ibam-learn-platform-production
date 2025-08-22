/**
 * 📋 Sync Command Integration
 * Integrates production feedback sync with TodoWrite system
 * Allows manual "SYNC" command to pull production feedback
 */

import { syncProductionFeedbackToStagingTasks, getProductionFeedback } from './production-reader'

/**
 * Execute sync command - used with TodoWrite system
 */
export async function executeSyncCommand(): Promise<string> {
  try {
    console.log('📋 SYNC command executed - checking production feedback')
    
    const result = await syncProductionFeedbackToStagingTasks()
    
    if (result.processed === 0) {
      return `✅ SYNC complete - No new production feedback to process`
    }
    
    return `🎯 SYNC complete - Processed ${result.processed} production feedback items. Created ${result.success} new tasks${result.errors > 0 ? `, ${result.errors} errors` : ''}.`
    
  } catch (error: any) {
    return `❌ SYNC failed - ${error.message}`
  }
}

/**
 * Get production feedback summary for status display
 */
export async function getProductionFeedbackSummary(): Promise<{
  total: number
  recent: number
  bugs: number
  features: number
  summary: string
}> {
  try {
    const feedback = await getProductionFeedback(50)
    
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recent = feedback.filter(f => new Date(f.created_at) > last24Hours)
    const bugs = feedback.filter(f => f.type === 'bug')
    const features = feedback.filter(f => f.type === 'feature')
    
    const summary = `📊 Production Feedback: ${feedback.length} total (${recent.length} in 24h) | 🐛 ${bugs.length} bugs | 💡 ${features.length} features`
    
    return {
      total: feedback.length,
      recent: recent.length,
      bugs: bugs.length,
      features: features.length,
      summary
    }
    
  } catch (error) {
    return {
      total: 0,
      recent: 0,
      bugs: 0,
      features: 0,
      summary: '❌ Unable to connect to production feedback'
    }
  }
}

/**
 * Enhanced task list that includes production feedback status
 */
export async function getEnhancedTaskStatus(): Promise<string> {
  try {
    const summary = await getProductionFeedbackSummary()
    
    return `
📋 **STAGING TASK STATUS**

${summary.summary}

**Quick Commands:**
• Type "SYNC" → Pull latest production feedback
• Type "Tasks" → Show all current tasks  
• Type "ADD [description]" → Add manual task

**Auto-Sync:** Every 5 minutes ⏰
**Last Check:** ${new Date().toLocaleTimeString()}
`
  } catch (error) {
    return `📋 **STAGING TASK STATUS**

❌ Production connection error
**Manual Commands:** SYNC | Tasks | ADD [description]`
  }
}