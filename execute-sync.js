#!/usr/bin/env node

/**
 * 🔄 SYNC Command Executor
 * Executes the SYNC functionality to pull staging feedback and convert to tasks
 * Simulates the API endpoints locally using direct database access
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Staging database configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Try anon key first

console.log('🔄 SYNC Command Execution Starting...');
console.log('Database:', supabaseUrl ? 'Connected to staging' : 'Missing URL');
console.log('Service Key:', supabaseKey ? 'Available' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStagingFeedback() {
  try {
    console.log('\n📥 Fetching staging feedback...');
    
    const { data: feedback, error } = await supabase
      .from('user_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching feedback:', error.message);
      return [];
    }

    console.log(`✅ Found ${feedback?.length || 0} feedback items`);
    
    if (feedback && feedback.length > 0) {
      feedback.forEach((item, index) => {
        console.log(`\n📝 Feedback ${index + 1}:`);
        console.log(`  ID: ${item.id}`);
        console.log(`  Type: ${item.type === 'bug' ? '🐛 Bug' : '💡 Feature'}`);
        console.log(`  Description: ${item.description?.slice(0, 80)}${item.description?.length > 80 ? '...' : ''}`);
        console.log(`  User: ${item.user_email || 'Anonymous'}`);
        console.log(`  Page: ${item.page_url || 'Unknown'}`);
        console.log(`  Screenshot: ${item.screenshot_data ? '📸 Yes' : '❌ No'}`);
        console.log(`  Status: ${item.status || 'new'}`);
        console.log(`  Created: ${new Date(item.created_at).toLocaleString()}`);
      });
    }

    return feedback || [];
    
  } catch (error) {
    console.error('❌ Unexpected error fetching feedback:', error.message);
    return [];
  }
}

async function convertFeedbackToTask(feedback) {
  try {
    console.log(`\n🔄 Converting feedback ${feedback.id} to task...`);

    // Check if task already exists
    const { data: existingTask } = await supabase
      .from('admin_tasks')
      .select('id')
      .eq('source', 'user_feedback')
      .eq('source_id', feedback.id)
      .single();

    if (existingTask) {
      console.log(`⚠️  Task already exists for feedback ${feedback.id}: ${existingTask.id}`);
      return { status: 'already_exists', taskId: existingTask.id };
    }

    // Create the task
    const task = {
      title: `${feedback.type === 'bug' ? '🐛 STAGING BUG' : '💡 STAGING FEATURE'}: ${feedback.description.slice(0, 100)}${feedback.description.length > 100 ? '...' : ''}`,
      description: `**Staging User Feedback** (ID: ${feedback.id})

**Type**: ${feedback.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}
**Description**: ${feedback.description}
**User**: ${feedback.user_email || 'Anonymous'}
**Page**: ${feedback.page_url || 'Unknown'}
**Browser**: ${feedback.user_agent || 'Unknown'}
**Screenshot**: ${feedback.screenshot_data ? '📸 Yes (base64 data available)' : '❌ No'}
**Submitted**: ${new Date(feedback.created_at).toLocaleString()}

**Resolution Steps**:
1. Reproduce issue in staging environment
2. Develop fix locally
3. Test fix thoroughly
4. Commit and deploy fix
5. Mark task as completed`,
      type: feedback.type === 'bug' ? 'bug_fix' : 'feature_request',
      status: 'pending',
      priority: feedback.type === 'bug' ? 'high' : 'medium',
      source: 'user_feedback',
      source_id: feedback.id
    };

    const { data: newTask, error: taskError } = await supabase
      .from('admin_tasks')
      .insert([task])
      .select()
      .single();

    if (taskError) {
      console.error(`❌ Failed to create task for feedback ${feedback.id}:`, taskError.message);
      return { status: 'error', error: taskError.message };
    }

    // Mark feedback as processed
    await supabase
      .from('user_feedback')
      .update({ status: 'converted_to_task' })
      .eq('id', feedback.id);

    console.log(`✅ Created task ${newTask.id} for feedback ${feedback.id}`);
    console.log(`   Title: ${task.title}`);
    
    return { status: 'created', taskId: newTask.id, title: task.title };
    
  } catch (error) {
    console.error(`❌ Error converting feedback ${feedback.id} to task:`, error.message);
    return { status: 'error', error: error.message };
  }
}

async function executeSyncCommand() {
  try {
    console.log('\n🚀 Executing SYNC Command...');
    console.log('=' .repeat(50));

    // Fetch all unprocessed feedback
    const feedback = await fetchStagingFeedback();
    
    if (feedback.length === 0) {
      console.log('\n✅ SYNC Complete - No feedback to process');
      return {
        success: true,
        message: 'No new staging feedback to process',
        processed: 0,
        created: 0
      };
    }

    console.log(`\n🔄 Processing ${feedback.length} feedback items...`);
    
    let created = 0;
    let alreadyExists = 0;
    let errors = 0;
    const results = [];

    for (const item of feedback) {
      const result = await convertFeedbackToTask(item);
      results.push({ feedbackId: item.id, ...result });
      
      if (result.status === 'created') {
        created++;
      } else if (result.status === 'already_exists') {
        alreadyExists++;
      } else if (result.status === 'error') {
        errors++;
      }
    }

    console.log('\n📊 SYNC Results:');
    console.log('=' .repeat(30));
    console.log(`📝 Feedback processed: ${feedback.length}`);
    console.log(`✅ Tasks created: ${created}`);
    console.log(`⚠️  Already existed: ${alreadyExists}`);
    console.log(`❌ Errors: ${errors}`);

    if (created > 0) {
      console.log('\n🎯 Newly Created Tasks:');
      results.filter(r => r.status === 'created').forEach(r => {
        console.log(`  • Task ${r.taskId}: ${r.title?.slice(0, 60)}...`);
      });
    }

    const successMessage = created > 0 
      ? `🎯 SYNC Complete - Created ${created} new tasks from ${feedback.length} feedback items`
      : `✅ SYNC Complete - All ${feedback.length} feedback items already processed`;

    console.log(`\n${successMessage}`);
    
    return {
      success: true,
      message: successMessage,
      processed: feedback.length,
      created,
      alreadyExists,
      errors,
      results
    };
    
  } catch (error) {
    console.error('\n❌ SYNC Command Failed:', error.message);
    return {
      success: false,
      error: error.message,
      message: `SYNC failed: ${error.message}`
    };
  }
}

// Execute if run directly
if (require.main === module) {
  executeSyncCommand()
    .then(result => {
      console.log('\n🏁 SYNC Command Complete');
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = { executeSyncCommand, fetchStagingFeedback, convertFeedbackToTask };