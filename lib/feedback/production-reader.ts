/**
 * 🔍 Production Feedback Reader
 * Safely reads user feedback from production database
 * Creates tasks in staging environment for development workflow
 */

import { createClient } from '@supabase/supabase-js'

// Lazy initialization to prevent build-time environment variable requirements
let _productionSupabase: ReturnType<typeof createClient> | null = null;
let _stagingSupabase: ReturnType<typeof createClient> | null = null;

// Production database (READ-ONLY access)  
const productionSupabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_productionSupabase) {
      const productionUrl = process.env.NEXT_PUBLIC_PRODUCTION_SUPABASE_URL || 'https://tutrnikhomrgcpkzszvq.supabase.co';
      const productionKey = process.env.PRODUCTION_SUPABASE_SERVICE_ROLE_KEY || 'missing-production-key';
      _productionSupabase = createClient(productionUrl, productionKey);
    }
    return _productionSupabase[prop as keyof typeof _productionSupabase];
  }
});

// Staging database (for task creation)
const stagingSupabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_stagingSupabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration for staging database');
      }
      _stagingSupabase = createClient(supabaseUrl, supabaseKey);
    }
    return _stagingSupabase[prop as keyof typeof _stagingSupabase];
  }
});

export interface ProductionFeedback {
  id: string
  type: 'bug' | 'feature'
  description: string
  user_email: string | null
  page_url: string | null
  user_agent: string | null
  screenshot_data: string | null
  status: string
  priority: string
  created_at: string
  updated_at: string
}

export interface StagingTask {
  title: string
  description: string
  type: 'bug_fix' | 'feature_request'
  status: 'pending'
  priority: 'high' | 'medium' | 'low'
  source: 'production_feedback'
  source_id: string
  metadata: {
    production_feedback_id: string
    user_email: string | null
    page_url: string | null
    user_agent: string | null
    has_screenshot: boolean
    created_at: string
  }
}

/**
 * Safely read production feedback (READ-ONLY)
 */
export async function getProductionFeedback(limit: number = 50): Promise<ProductionFeedback[]> {
  try {
    console.log('🔍 Reading production feedback (read-only)...')
    
    const { data, error } = await productionSupabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('❌ Production feedback read error:', error)
      return []
    }
    
    console.log(`✅ Successfully read ${data?.length || 0} production feedback items`)
    return data || []
    
  } catch (error) {
    console.error('❌ Production database connection error:', error)
    return []
  }
}

/**
 * Get new production feedback not yet processed in staging
 */
export async function getUnprocessedProductionFeedback(): Promise<ProductionFeedback[]> {
  try {
    // Get production feedback
    const productionFeedback = await getProductionFeedback(100)
    
    if (productionFeedback.length === 0) {
      return []
    }
    
    // Get existing staging tasks from production feedback
    const productionIds = productionFeedback.map(f => f.id)
    
    const { data: existingTasks } = await stagingSupabase
      .from('admin_tasks')
      .select('source_id')
      .eq('source', 'production_feedback')
      .in('source_id', productionIds)
    
    const processedIds = new Set(existingTasks?.map(t => t.source_id) || [])
    
    // Return only unprocessed feedback
    const unprocessed = productionFeedback.filter(f => !processedIds.has(f.id))
    
    console.log(`📋 Found ${unprocessed.length} unprocessed production feedback items`)
    return unprocessed
    
  } catch (error) {
    console.error('❌ Error checking unprocessed feedback:', error)
    return []
  }
}

/**
 * Create staging tasks from production feedback
 */
export async function createStagingTasksFromProductionFeedback(
  feedback: ProductionFeedback[]
): Promise<{ success: number; errors: number }> {
  let success = 0
  let errors = 0
  
  for (const item of feedback) {
    try {
      const task: StagingTask = {
        title: `${item.type === 'bug' ? '🐛 PROD BUG' : '💡 PROD FEATURE'}: ${item.description.slice(0, 100)}${item.description.length > 100 ? '...' : ''}`,
        description: `**Production User Feedback** (ID: ${item.id})
        
**Type**: ${item.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}
**Description**: ${item.description}
**User**: ${item.user_email || 'Anonymous'}
**Page**: ${item.page_url || 'Unknown'}
**Browser**: ${item.user_agent || 'Unknown'}
**Screenshot**: ${item.screenshot_data ? '📸 Yes' : '❌ No'}
**Submitted**: ${new Date(item.created_at).toLocaleString()}

**Resolution Steps**:
1. Reproduce issue in staging environment
2. Develop fix in staging
3. Test fix thoroughly  
4. Deploy to staging for verification
5. Promote to production
6. Update production feedback status to 'resolved'`,
        type: item.type === 'bug' ? 'bug_fix' : 'feature_request',
        status: 'pending',
        priority: item.type === 'bug' ? 'high' : 'medium',
        source: 'production_feedback',
        source_id: item.id,
        metadata: {
          production_feedback_id: item.id,
          user_email: item.user_email,
          page_url: item.page_url,
          user_agent: item.user_agent,
          has_screenshot: Boolean(item.screenshot_data),
          created_at: item.created_at
        }
      }
      
      const { error } = await stagingSupabase
        .from('admin_tasks')
        .insert([task])
      
      if (error) {
        console.error(`❌ Failed to create task for feedback ${item.id}:`, error)
        errors++
      } else {
        console.log(`✅ Created staging task for production feedback ${item.id}`)
        success++
      }
      
    } catch (error) {
      console.error(`❌ Error processing feedback ${item.id}:`, error)
      errors++
    }
  }
  
  return { success, errors }
}

/**
 * Main automation function - run this to sync production feedback to staging tasks
 */
export async function syncProductionFeedbackToStagingTasks(): Promise<{
  processed: number
  success: number
  errors: number
  message: string
}> {
  try {
    console.log('🔄 Starting production feedback sync...')
    
    // Get unprocessed production feedback
    const unprocessedFeedback = await getUnprocessedProductionFeedback()
    
    if (unprocessedFeedback.length === 0) {
      return {
        processed: 0,
        success: 0,
        errors: 0,
        message: '✅ No new production feedback to process'
      }
    }
    
    // Create staging tasks
    const result = await createStagingTasksFromProductionFeedback(unprocessedFeedback)
    
    const message = `✅ Processed ${unprocessedFeedback.length} production feedback items. Created ${result.success} tasks, ${result.errors} errors.`
    console.log(message)
    
    return {
      processed: unprocessedFeedback.length,
      success: result.success,
      errors: result.errors,
      message
    }
    
  } catch (error) {
    console.error('❌ Production feedback sync failed:', error)
    return {
      processed: 0,
      success: 0,
      errors: 1,
      message: `❌ Sync failed: ${error}`
    }
  }
}

/**
 * Health check - verify production database connectivity (READ-ONLY)
 */
export async function checkProductionDatabaseHealth(): Promise<boolean> {
  try {
    const { data, error } = await productionSupabase
      .from('user_feedback')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Production database health check failed:', error)
      return false
    }
    
    console.log('✅ Production database connectivity confirmed')
    return true
    
  } catch (error) {
    console.error('❌ Production database connection error:', error)
    return false
  }
}