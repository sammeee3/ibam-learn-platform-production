'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface TestScenario {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const TEST_SCENARIOS: TestScenario[] = [
  { name: '0% - Fresh Start', description: 'Reset user to beginning', color: 'bg-gray-500', icon: '🆕' },
  { name: '25% - Early Progress', description: 'Complete intro sections', color: 'bg-blue-500', icon: '📘' },
  { name: '50% - Halfway', description: 'Complete half of session', color: 'bg-yellow-500', icon: '⚡' },
  { name: '75% - Almost Done', description: 'Only quiz remaining', color: 'bg-orange-500', icon: '🎯' },
  { name: '99% - Trigger Modal', description: 'One section to complete', color: 'bg-purple-500', icon: '🎉' },
  { name: '100% - Complete', description: 'Session fully complete', color: 'bg-green-500', icon: '✅' },
];

const MODULES = [
  { id: '1', name: 'Module 1: Foundation' },
  { id: '2', name: 'Module 2: Growth' },
  { id: '3', name: 'Module 3: Leadership' },
  { id: '4', name: 'Module 4: Impact' },
];

const SESSIONS = [
  { id: '1', name: 'Session 1' },
  { id: '2', name: 'Session 2' },
  { id: '3', name: 'Session 3' },
  { id: '4', name: 'Session 4' },
];

export default function AdminTestingDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('1');
  const [selectedSession, setSelectedSession] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setCheckingAuth(true);
    
    try {
      // Get current user with proper error handling
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error:', error);
        setDebugInfo(`Auth error: ${error.message}`);
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      if (!user) {
        console.error('No user found');
        setDebugInfo('No user found - redirecting...');
        setTimeout(() => router.push('/auth/login'), 2000);
        return;
      }

      // Store current user email for display
      setCurrentUserEmail(user.email || 'unknown');
      
      // Admin check - make it very permissive for now
      const adminEmails = [
        'sammeee3@gmail.com', 
        'sammeee@yahoo.com', 
        'jeff@samuelsonenterprises.com',
        'jeffreysamuelsonii@gmail.com'
      ];
      
      // Case-insensitive check
      const userEmail = (user.email || '').toLowerCase().trim();
      const isAdmin = adminEmails.some(email => email.toLowerCase() === userEmail);
      
      console.log('Admin check:', {
        userEmail,
        isAdmin,
        adminEmails
      });
      
      setDebugInfo(`User: ${userEmail}, Admin: ${isAdmin}`);
      
      // For now, let's allow ALL users to access testing (remove this in production)
      const ALLOW_ALL_FOR_TESTING = true;
      
      if (!isAdmin && !ALLOW_ALL_FOR_TESTING) {
        console.error('Not an admin:', userEmail);
        setDebugInfo(`Access denied for: ${userEmail}`);
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      // If we get here, user is authorized
      setCheckingAuth(false);
      await fetchUsers();
      
    } catch (err) {
      console.error('Initialization error:', err);
      setDebugInfo(`Error: ${err}`);
      setCheckingAuth(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching users:', error);
        showMessage('error', 'Failed to load users');
        return;
      }
      
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
      showMessage('error', 'Failed to load users');
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

      if (progressError) {
        console.error('Progress error:', progressError);
        throw progressError;
      }

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

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({ pre_assessment_completed: true })
        .eq('id', selectedUser);

      showMessage('success', `✅ Set user to ${progressPercent}% complete for Module ${selectedModule}, Session ${selectedSession}`);
    } catch (error) {
      console.error('Error setting progress:', error);
      showMessage('error', `Failed to set progress: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loginAsUser = async () => {
    if (!selectedUser) {
      showMessage('error', 'Please select a user first');
      return;
    }

    const user = users.find(u => u.id === selectedUser);
    if (!user) return;

    showMessage('success', `Opening session as ${user.email}...`);
    window.open(`/modules/${selectedModule}/sessions/${selectedSession}`, '_blank');
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
      console.error('Clear progress error:', error);
      showMessage('error', 'Failed to clear progress');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔐 Checking Authorization...</h2>
          <p className="text-gray-600">Verifying admin access...</p>
          <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🧪 Super Admin Testing Dashboard
              </h1>
              <p className="text-white/80">Quickly set up any testing scenario</p>
              <p className="text-white/60 text-sm mt-1">Logged in as: {currentUserEmail}</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white shadow-lg`}>
            {message.text}
          </div>
        )}

        {/* User Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📧 Select Test User</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Account ({users.length} users loaded)
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email} (ID: {user.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-4">
              <button
                onClick={clearUserProgress}
                disabled={!selectedUser || loading}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                🗑️ Clear All Progress
              </button>
              <button
                onClick={loginAsUser}
                disabled={!selectedUser || loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                👤 View as User
              </button>
            </div>
          </div>
        </div>

        {/* Module & Session Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Select Module & Session</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                {MODULES.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                {SESSIONS.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Test Scenarios */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 Quick Test Scenarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_SCENARIOS.map((scenario) => {
              const progress = parseInt(scenario.name.split('%')[0]);
              return (
                <button
                  key={scenario.name}
                  onClick={() => setUserProgress(progress)}
                  disabled={!selectedUser || loading}
                  className={`p-6 rounded-xl text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${scenario.color}`}
                >
                  <div className="text-3xl mb-2">{scenario.icon}</div>
                  <div className="font-bold text-lg">{scenario.name}</div>
                  <div className="text-sm opacity-90 mt-1">{scenario.description}</div>
                </button>
              );
            })}
          </div>

          {/* Special Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Special Testing Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  if (selectedUser) {
                    setUserProgress(99);
                  } else {
                    showMessage('error', 'Select a user first!');
                  }
                }}
                disabled={!selectedUser || loading}
                className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                🎯 Test Feedback Modal (99%)
              </button>

              <button
                onClick={async () => {
                  if (!selectedUser) {
                    showMessage('error', 'Select a user first!');
                    return;
                  }
                  setLoading(true);
                  try {
                    await supabase.from('user_profiles')
                      .update({ pre_assessment_completed: true })
                      .eq('id', selectedUser);
                    showMessage('success', '⏭️ Pre-assessment bypassed');
                  } catch (err) {
                    showMessage('error', 'Failed to bypass assessment');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={!selectedUser || loading}
                className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ⏭️ Skip Pre-Assessment
              </button>

              <button
                onClick={() => {
                  window.open(`/modules/${selectedModule}/sessions/${selectedSession}`, '_blank');
                }}
                className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                📖 Open Session Page
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 mt-2">Processing...</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-2">💡 How to Use</h3>
          <ul className="text-white/80 space-y-1 text-sm">
            <li>• Select a user account to test with (sammeee@yahoo.com is pre-configured)</li>
            <li>• Choose the module and session you want to test</li>
            <li>• Click any progress percentage to instantly set that user to that state</li>
            <li>• Use "99%" to test the feedback modal (complete Looking Forward to trigger)</li>
            <li>• "View as User" opens the session in a new tab</li>
            <li>• "Clear All Progress" resets the user completely</li>
          </ul>
          <p className="text-white/60 text-xs mt-4">
            Debug: Currently allowing all users for testing. In production, only admins can access.
          </p>
        </div>
      </div>
    </div>
  );
}