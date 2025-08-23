/**
 * 🔄 Enhanced SYNC System for IBAM Feedback
 * 
 * Features:
 * - Manual SYNC command (type "SYNC" in terminal)
 * - Automated twice-daily sync (9AM & 9PM)
 * - Pulls from BOTH staging AND production databases
 * - Email notifications for feedback submitters
 * - Prevents duplicates and tracks processed feedback
 */

const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');

// Database configurations
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDk5NzQsImV4cCI6MjA3MTAyNTk3NH0.7XIYS3HndcQxRTOjYWATp_frn2zYIwQS-w551gVs9tM'
);

const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

/**
 * Core SYNC function - pulls feedback from both databases
 */
async function executeSyncCommand() {
  console.log('🔄 SYNC COMMAND INITIATED');
  console.log('⏰ ' + new Date().toLocaleString());
  console.log('');
  
  let totalFeedback = 0;
  let totalTasks = 0;
  
  try {
    // SYNC from staging database
    console.log('📥 Syncing from STAGING database...');
    const stagingResults = await syncFromDatabase(stagingSupabase, 'STAGING');
    totalFeedback += stagingResults.feedbackCount;
    totalTasks += stagingResults.tasksCreated;
    
    console.log('');
    
    // SYNC from production database
    console.log('📥 Syncing from PRODUCTION database...');
    const productionResults = await syncFromDatabase(productionSupabase, 'PRODUCTION');
    totalFeedback += productionResults.feedbackCount;
    totalTasks += productionResults.tasksCreated;
    
    console.log('');
    console.log('📊 SYNC SUMMARY:');
    console.log(`   📝 Total Feedback Items: ${totalFeedback}`);
    console.log(`   ✅ Tasks Created: ${totalTasks}`);
    console.log(`   🕒 Completed: ${new Date().toLocaleString()}`);
    
    if (totalTasks > 0) {
      console.log('');
      console.log('🎯 NEW TASKS ADDED TO YOUR TASK LIST!');
      console.log('💡 Type "Tasks" to see your updated task list');
    }
    
  } catch (error) {
    console.error('❌ SYNC failed:', error.message);
  }
}

/**
 * Sync feedback from a specific database
 */
async function syncFromDatabase(supabase, environment) {
  try {
    // Get unprocessed feedback
    const { data: feedback, error } = await supabase
      .from('user_feedback')
      .select('*')
      .or('status.eq.pending,status.is.null')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      if (error.message.includes('relation "public.user_feedback" does not exist')) {
        console.log(`   ⚠️  ${environment}: user_feedback table doesn't exist yet`);
        return { feedbackCount: 0, tasksCreated: 0 };
      }
      throw error;
    }
    
    if (!feedback || feedback.length === 0) {
      console.log(`   ✨ ${environment}: No new feedback to process`);
      return { feedbackCount: 0, tasksCreated: 0 };
    }
    
    console.log(`   📋 ${environment}: Found ${feedback.length} feedback items`);
    
    let tasksCreated = 0;
    
    // Process each feedback item
    for (const item of feedback) {
      try {
        // Check if task already exists for this feedback
        const { data: existingTask } = await stagingSupabase
          .from('admin_tasks')
          .select('id')
          .eq('source', `${environment.toLowerCase()}_feedback`)
          .eq('source_id', item.id)
          .single();
        
        if (existingTask) {
          console.log(`   🔄 ${environment}: Task already exists for feedback ${item.id.slice(0, 8)}`);
          continue;
        }
        
        // Create task from feedback
        const taskTitle = item.type === 'bug' 
          ? `🐛 Bug: ${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}`
          : `💡 Feature: ${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}`;
        
        const taskDescription = `**${environment} User Feedback**\n\n` +
          `**Type**: ${item.type === 'bug' ? 'Bug Report' : 'Feature Request'}\n` +
          `**Description**: ${item.description}\n` +
          `**Page**: ${item.page_url || 'Unknown'}\n` +
          `**User**: ${item.user_email || 'Anonymous'}\n` +
          `**Submitted**: ${new Date(item.created_at).toLocaleString()}\n` +
          `**Environment**: ${environment}\n` +
          (item.screenshot_data ? `**Screenshot**: Included\n` : '') +
          `**Feedback ID**: ${item.id}`;
        
        // Create task in staging admin_tasks
        const { error: taskError } = await stagingSupabase
          .from('admin_tasks')
          .insert([{
            title: taskTitle,
            description: taskDescription,
            type: item.type === 'bug' ? 'bug_fix' : 'feature_request',
            priority: item.type === 'bug' ? 'high' : 'medium',
            status: 'pending',
            source: environment === 'STAGING' ? 'user_feedback' : 'production_feedback',
            source_id: item.id,
            created_at: new Date().toISOString()
          }]);
        
        if (taskError) {
          console.log(`   ❌ ${environment}: Failed to create task for ${item.id.slice(0, 8)}: ${taskError.message}`);
          continue;
        }
        
        // Mark feedback as processed
        await supabase
          .from('user_feedback')
          .update({ status: 'converted_to_task' })
          .eq('id', item.id);
        
        // Send email notification (if email provided)
        if (item.user_email) {
          await sendFeedbackConfirmation(item.user_email, item.type, item.description, environment);
        }
        
        tasksCreated++;
        console.log(`   ✅ ${environment}: Created task for ${item.type} feedback ${item.id.slice(0, 8)}`);
        
      } catch (itemError) {
        console.log(`   ⚠️  ${environment}: Error processing feedback ${item.id.slice(0, 8)}: ${itemError.message}`);
      }
    }
    
    return { feedbackCount: feedback.length, tasksCreated };
    
  } catch (error) {
    console.log(`   ❌ ${environment}: Database sync failed: ${error.message}`);
    return { feedbackCount: 0, tasksCreated: 0 };
  }
}

/**
 * Send email confirmation to feedback submitter
 */
async function sendFeedbackConfirmation(email, type, description, environment) {
  try {
    // This would integrate with your email service (SendGrid, etc.)
    // For now, we'll log what would be sent
    
    const feedbackType = type === 'bug' ? 'Bug Report' : 'Feature Request';
    const subject = `✅ Your ${feedbackType} has been received - IBAM Learning Platform`;
    
    const message = `
Dear IBAM User,

Thank you for your ${feedbackType.toLowerCase()} submission! We've received your feedback and added it to our development task list.

📋 Your Submission:
• Type: ${feedbackType}
• Description: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}
• Environment: ${environment}
• Submitted: ${new Date().toLocaleString()}

Our development team will review this feedback and work on addressing it in an upcoming update. We truly appreciate your help in making the IBAM Learning Platform better!

Blessings,
The IBAM Development Team

---
This is an automated confirmation. Please do not reply to this email.
`;
    
    console.log(`   📧 Email confirmation queued for ${email} (${feedbackType})`);
    
    // TODO: Integrate with actual email service
    // await emailService.send({ to: email, subject, body: message });
    
  } catch (error) {
    console.log(`   ⚠️  Email notification failed for ${email}: ${error.message}`);
  }
}

/**
 * Set up automated twice-daily sync
 */
function setupAutomatedSync() {
  console.log('⏰ Setting up automated SYNC schedule...');
  console.log('   📅 Morning sync: 9:00 AM daily');
  console.log('   🌙 Evening sync: 9:00 PM daily');
  console.log('');
  
  // Morning sync at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('🌅 AUTOMATED MORNING SYNC');
    executeSyncCommand();
  });
  
  // Evening sync at 9:00 PM  
  cron.schedule('0 21 * * *', () => {
    console.log('🌙 AUTOMATED EVENING SYNC');
    executeSyncCommand();
  });
  
  console.log('✅ Automated sync scheduled successfully!');
  console.log('💡 You can also run manual SYNC by typing "SYNC" anytime');
}

/**
 * Manual SYNC command handler
 */
function setupManualSync() {
  console.log('⌨️  Manual SYNC command ready!');
  console.log('💡 Type "SYNC" anytime to manually sync feedback');
  
  // Listen for manual SYNC commands
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      const input = chunk.trim().toUpperCase();
      if (input === 'SYNC') {
        console.log('');
        console.log('🚀 MANUAL SYNC TRIGGERED');
        executeSyncCommand();
      }
    }
  });
}

/**
 * Main function - start the enhanced SYNC system
 */
async function main() {
  console.log('🔄 IBAM Enhanced SYNC System');
  console.log('📋 Feedback → Task Automation');
  console.log('');
  
  // Test database connections
  console.log('🔍 Testing database connections...');
  
  try {
    const { error: stagingError } = await stagingSupabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (stagingError) {
      console.log('❌ Staging database connection failed');
    } else {
      console.log('✅ Staging database connected');
    }
    
    const { error: productionError } = await productionSupabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (productionError) {
      console.log('❌ Production database connection failed');
    } else {
      console.log('✅ Production database connected');
    }
    
  } catch (error) {
    console.log('⚠️  Database connection test failed:', error.message);
  }
  
  console.log('');
  
  // Set up automated sync (twice daily)
  setupAutomatedSync();
  
  // Set up manual sync command
  setupManualSync();
  
  console.log('');
  console.log('🎯 SYNC SYSTEM READY!');
  console.log('');
  console.log('Available commands:');
  console.log('   SYNC    - Manual sync from both databases');
  console.log('   Ctrl+C  - Stop the SYNC system');
  console.log('');
}

// Export for use in other files
module.exports = { executeSyncCommand, syncFromDatabase };

// Start the system if run directly
if (require.main === module) {
  main();
}