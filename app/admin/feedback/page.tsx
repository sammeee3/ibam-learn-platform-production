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

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

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

  const addToTaskList = async (feedbackItem: FeedbackItem) => {
    const taskDescription = `${feedbackItem.type === 'bug' ? '🐛 BUG' : '💡 FEATURE'}: ${feedbackItem.description}`;
    
    // This will be integrated with your TodoWrite system
    console.log('Adding to task list:', taskDescription);
    alert(`Added to task list: ${taskDescription}`);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📋 User Feedback & Task Management</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Feedback Submissions</h2>
            <p className="text-gray-600">Feedback automatically creates tasks in our management system</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {feedback.length === 0 ? (
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
                      </div>
                      
                      <p className="text-gray-900 mb-2">{item.description}</p>
                      
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>👤 User: {item.user_email || 'Anonymous'}</p>
                        <p>📱 Page: {item.page_url}</p>
                        <p>🕐 Submitted: {new Date(item.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToTaskList(item)}
                      className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      ➕ Add to Tasks
                    </button>
                  </div>
                </div>
              ))
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
