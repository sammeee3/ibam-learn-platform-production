'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminTestingDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('1');
  const [selectedSession, setSelectedSession] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // Skip auth check entirely for now - just load the dashboard
    setIsReady(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (data) {
        setUsers(data);
        // Auto-select sammeee@yahoo.com if it exists
        const testUser = data.find(u => u.email === 'sammeee@yahoo.com');
        if (testUser) {
          setSelectedUser(testUser.id);
        }
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const setUserProgress = async (progressPercent: number) => {
    if (!selectedUser) {
      showMessage('error', 'Please select a user first');
      return;
    }

    setLoading(true);
    try {
      const sessionId = `${selectedModule}-${selectedSession}`;
      
      // Calculate what sections should be complete based on percentage
      const lookbackCompleted = progressPercent >= 25;
      const lookupCompleted = progressPercent >= 50;
      const lookforwardCompleted = progressPercent >= 100;
      const quizCompleted = progressPercent >= 75;
      
      let completedSections: string[] = [];
      if (progressPercent >= 25) completedSections.push('introduction');
      if (progressPercent >= 50) completedSections.push('reading');
      if (progressPercent >= 75) completedSections.push('video');
      if (progressPercent === 100) completedSections.push('quiz');

      // Update or insert session progress
      const { error: progressError } = await supabase
        .from('session_progress')
        .upsert({
          user_id: selectedUser,
          session_id: sessionId,
          module_id: selectedModule,
          completed_sections: completedSections,
          lookback_completed: lookbackCompleted,
          lookup_completed: lookupCompleted,
          lookforward_completed: lookforwardCompleted,
          quiz_completed: quizCompleted,
          overall_progress: progressPercent,
          last_activity: new Date().toISOString(),
        }, {
          onConflict: 'user_id,session_id'
        });

      if (progressError) throw progressError;

      // Also mark pre-assessment as complete
      await supabase
        .from('assessment_responses')
        .upsert({
          user_id: selectedUser,
          assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7',
          responses: [{ question_id: 1, answer_index: 0, answer_text: 'ADMIN_BYPASS' }],
          total_score: 999,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,assessment_id'
        });

      await supabase
        .from('user_profiles')
        .update({ pre_assessment_completed: true })
        .eq('id', selectedUser);

      showMessage('success', `✅ Set user to ${progressPercent}% complete for Module ${selectedModule}, Session ${selectedSession}`);
    } catch (error) {
      console.error('Error setting progress:', error);
      showMessage('error', `Failed to set progress`);
    } finally {
      setLoading(false);
    }
  };

  const clearUserProgress = async () => {
    if (!selectedUser) {
      showMessage('error', 'Please select a user first');
      return;
    }

    if (!confirm('Are you sure you want to clear ALL progress for this user?')) {
      return;
    }

    setLoading(true);
    try {
      await supabase.from('session_progress').delete().eq('user_id', selectedUser);
      await supabase.from('assessment_responses').delete().eq('user_id', selectedUser);
      await supabase.from('session_feedback').delete().eq('user_id', selectedUser);
      await supabase.from('user_profiles').update({ pre_assessment_completed: false }).eq('id', selectedUser);

      showMessage('success', '🗑️ Cleared all progress for user');
    } catch (error) {
      showMessage('error', 'Failed to clear progress');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
        </div>
      </div>
    );
  }

  const TEST_SCENARIOS = [
    { name: '0%', desc: 'Reset', color: 'bg-gray-500', icon: '🆕', progress: 0 },
    { name: '25%', desc: 'Early', color: 'bg-blue-500', icon: '📘', progress: 25 },
    { name: '50%', desc: 'Halfway', color: 'bg-yellow-500', icon: '⚡', progress: 50 },
    { name: '75%', desc: 'Almost', color: 'bg-orange-500', icon: '🎯', progress: 75 },
    { name: '99%', desc: 'Modal Ready', color: 'bg-purple-500', icon: '🎉', progress: 99 },
    { name: '100%', desc: 'Complete', color: 'bg-green-500', icon: '✅', progress: 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">🧪 Super Admin Testing Dashboard</h1>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-white ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Main Controls */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Controls</h2>
          
          {/* User Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              <option value="">Select a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Module & Session */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="1">Module 1</option>
                <option value="2">Module 2</option>
                <option value="3">Module 3</option>
                <option value="4">Module 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="1">Session 1</option>
                <option value="2">Session 2</option>
                <option value="3">Session 3</option>
                <option value="4">Session 4</option>
              </select>
            </div>
          </div>

          {/* Progress Buttons */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Set Progress</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {TEST_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.name}
                  onClick={() => setUserProgress(scenario.progress)}
                  disabled={!selectedUser || loading}
                  className={`p-3 rounded-lg text-white disabled:opacity-50 ${scenario.color}`}
                >
                  <div className="text-2xl">{scenario.icon}</div>
                  <div className="text-sm font-bold">{scenario.name}</div>
                  <div className="text-xs">{scenario.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={clearUserProgress}
              disabled={!selectedUser || loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              🗑️ Clear Progress
            </button>
            <button
              onClick={() => {
                if (selectedUser) {
                  window.open(`/modules/${selectedModule}/sessions/${selectedSession}`, '_blank');
                } else {
                  showMessage('error', 'Select a user first');
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              👤 View Session
            </button>
            <button
              onClick={async () => {
                if (!selectedUser) {
                  showMessage('error', 'Select a user first');
                  return;
                }
                try {
                  await supabase.from('user_profiles')
                    .update({ pre_assessment_completed: true })
                    .eq('id', selectedUser);
                  showMessage('success', 'Pre-assessment bypassed');
                } catch (err) {
                  showMessage('error', 'Failed to bypass assessment');
                }
              }}
              disabled={!selectedUser || loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              ⏭️ Skip Assessment
            </button>
          </div>

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
          <h3 className="font-bold mb-2">💡 Quick Instructions</h3>
          <ul className="text-sm space-y-1 text-white/90">
            <li>1. Select a user (sammeee@yahoo.com is auto-selected if available)</li>
            <li>2. Choose module and session to test</li>
            <li>3. Click any percentage to instantly set progress</li>
            <li>4. Use 99% to prepare for feedback modal testing</li>
            <li>5. Click "View Session" to open as that user</li>
          </ul>
        </div>
      </div>
    </div>
  );
}