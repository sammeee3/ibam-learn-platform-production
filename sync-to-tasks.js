#!/usr/bin/env node

/**
 * 🔄 SYNC to TodoWrite Integration
 * Fetches tasks created from staging feedback and integrates with TodoWrite system
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Staging database configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCreatedTasksFromFeedback() {
  try {
    console.log('📋 Fetching tasks created from user feedback...');
    
    const { data: tasks, error } = await supabase
      .from('admin_tasks')
      .select('*')
      .eq('source', 'user_feedback')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tasks:', error.message);
      return [];
    }

    console.log(`✅ Found ${tasks?.length || 0} tasks created from feedback`);
    
    return tasks || [];
    
  } catch (error) {
    console.error('❌ Unexpected error fetching tasks:', error.message);
    return [];
  }
}

async function displaySyncResults() {
  try {
    console.log('\n🚀 SYNC Results Summary');
    console.log('=' .repeat(50));

    const tasks = await fetchCreatedTasksFromFeedback();
    
    if (tasks.length === 0) {
      console.log('📝 No tasks found created from user feedback');
      return;
    }

    console.log(`\n📋 ${tasks.length} Task(s) Created from User Feedback:`);
    console.log('=' .repeat(50));

    tasks.forEach((task, index) => {
      const priority = task.priority === 'high' ? '🔴 HIGH' : 
                      task.priority === 'medium' ? '🟡 MEDIUM' : '🟢 LOW';
      const type = task.type === 'bug_fix' ? '🐛 Bug Fix' : '💡 Feature Request';
      const status = task.status === 'pending' ? '⏳ Pending' : 
                    task.status === 'in_progress' ? '🔄 In Progress' : '✅ Complete';
      
      console.log(`\n${index + 1}. ${task.title}`);
      console.log(`   Priority: ${priority} | Type: ${type} | Status: ${status}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Created: ${new Date(task.created_at).toLocaleString()}`);
      
      if (task.description) {
        const shortDesc = task.description.split('\n')[0].replace(/\*\*/g, '');
        console.log(`   Description: ${shortDesc.slice(0, 80)}...`);
      }
    });

    // Show TodoWrite compatible format
    console.log('\n📋 TodoWrite Compatible Format:');
    console.log('=' .repeat(40));
    
    const criticalTasks = tasks.filter(t => t.priority === 'high');
    const highTasks = tasks.filter(t => t.priority === 'medium' && t.type === 'bug_fix');
    const mediumTasks = tasks.filter(t => t.priority === 'medium' && t.type !== 'bug_fix');
    const lowTasks = tasks.filter(t => t.priority === 'low');

    if (criticalTasks.length > 0) {
      console.log('\n🚨 CRITICAL (Must Fix Immediately):');
      criticalTasks.forEach(task => {
        console.log(`- [ ] **${task.title}** - From user feedback (ID: ${task.source_id})`);
      });
    }

    if (highTasks.length > 0) {
      console.log('\n🔴 HIGH PRIORITY (This Week):');
      highTasks.forEach(task => {
        console.log(`- [ ] **${task.title}** - From user feedback (ID: ${task.source_id})`);
      });
    }

    if (mediumTasks.length > 0) {
      console.log('\n🟡 MEDIUM PRIORITY (Next 2 Weeks):');
      mediumTasks.forEach(task => {
        console.log(`- [ ] **${task.title}** - From user feedback (ID: ${task.source_id})`);
      });
    }

    if (lowTasks.length > 0) {
      console.log('\n🟢 LOW PRIORITY (When Time Permits):');
      lowTasks.forEach(task => {
        console.log(`- [ ] **${task.title}** - From user feedback (ID: ${task.source_id})`);
      });
    }

    console.log(`\n🎯 Summary: ${tasks.length} user feedback items successfully converted to tasks`);
    console.log(`   🐛 Bug Reports: ${tasks.filter(t => t.type === 'bug_fix').length}`);
    console.log(`   💡 Feature Requests: ${tasks.filter(t => t.type === 'feature_request').length}`);
    
    return tasks;
    
  } catch (error) {
    console.error('❌ Error displaying sync results:', error.message);
    return [];
  }
}

// Execute if run directly
if (require.main === module) {
  displaySyncResults()
    .then(tasks => {
      console.log('\n🏁 SYNC to TodoWrite Integration Complete');
      console.log(`📝 Ready to integrate ${tasks.length} tasks into task management system`);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = { fetchCreatedTasksFromFeedback, displaySyncResults };