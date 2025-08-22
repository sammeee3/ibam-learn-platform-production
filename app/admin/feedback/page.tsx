'use client';

import { useState, useEffect } from 'react';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature';
  description: string;
  user_email: string;
  page_url: string;
  created_at: string;
  status: string;
  priority: string;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  source: string;
  source_id: string;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feedback' | 'tasks'>('feedback');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchFeedback(), fetchTasks()]);
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback/list');
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      // Create a simple tasks API endpoint or fetch from your existing admin API
      const response = await fetch('/api/admin/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.filter((task: TaskItem) => task.source === 'staging_feedback' || task.source === 'production_feedback'));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // For now, create a placeholder
      setTasks([]);
    }
  };

  const bulkConvertToTasks = async () => {
    try {
      const response = await fetch('/api/feedback/convert-to-task');
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Success! Processed ${result.processed} feedback items. Created ${result.created} new tasks.`);
        fetchData(); // Refresh both feedback and tasks
      } else {
        alert(`❌ Bulk conversion failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error bulk converting feedback:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  const addToTaskList = async (feedbackItem: FeedbackItem) => {
    try {
      const response = await fetch('/api/feedback/convert-to-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackId: feedbackItem.id }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Success! Created task: ${result.taskTitle}`);
        // Refresh both feedback and tasks
        fetchData();
      } else {
        if (result.error === 'Task already exists for this feedback item') {
          alert('⚠️ This feedback item has already been converted to a task.');
        } else {
          alert(`❌ Failed to create task: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error converting feedback to task:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📋 User Feedback & Task Management</h1>
          <button
            onClick={bulkConvertToTasks}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            🔄 Convert All to Tasks
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Raw Feedback ({feedback.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ✅ Active Tasks ({tasks.length})
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              {activeTab === 'feedback' ? 'Recent Feedback Submissions' : 'Active Tasks from Feedback'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'feedback' 
                ? 'Convert feedback to tasks for tracking and resolution'
                : 'Tasks created from user feedback submissions'
              }
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {activeTab === 'feedback' ? (
              feedback.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No feedback submitted yet. Users can click the purple 💬 BETA button to report issues.
                </div>
              ) : (
                feedback.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.type === 'bug' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.type === 'bug' ? '🐛 Bug Report' : '💡 Feature Request'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.priority === 'high' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.priority} priority
                          </span>
                          {item.status === 'converted_to_task' && (
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              ✅ Converted to Task
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-900 mb-2">{item.description}</p>
                        
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>👤 User: {item.user_email || 'Anonymous'}</p>
                          <p>📱 Page: {item.page_url}</p>
                          <p>🕐 Submitted: {new Date(item.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {item.status !== 'converted_to_task' && (
                        <button
                          onClick={() => addToTaskList(item)}
                          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          ➕ Add to Tasks
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              // Tasks tab content
              tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tasks created from feedback yet. Convert feedback items to tasks to see them here.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.type === 'bug_fix' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {task.type === 'bug_fix' ? '🐛 Bug Fix' : '💡 Feature'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            task.priority === 'high' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority} priority
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                            {task.source === 'staging_feedback' ? '🧪 Staging' : '🚀 Production'}
                          </span>
                        </div>
                        
                        <h3 className="text-gray-900 font-medium mb-2">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description.split('\n')[2] || task.description.slice(0, 150)}...</p>
                        
                        <div className="text-sm text-gray-500">
                          <p>🕐 Created: {new Date(task.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Integration with Task System</h3>
          <p className="text-blue-800">
            User feedback automatically creates entries in our task management system. 
            Use the "Tasks" command in Claude to see all current tasks including user-reported issues.
          </p>
        </div>
      </div>
    </div>
  );
}
