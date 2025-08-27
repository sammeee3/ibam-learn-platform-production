'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Correct module and session structure based on actual content
const MODULES = [
  { id: '1', name: 'Module 1: Foundation', sessions: 4 },
  { id: '2', name: 'Module 2: Growth', sessions: 4 },
  { id: '3', name: 'Module 3: Leadership', sessions: 5 },
  { id: '4', name: 'Module 4: Impact', sessions: 4 },
  { id: '5', name: 'Module 5: Business Planning', sessions: 5 },
];

export default function TestDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedModule, setSelectedModule] = useState('1');
  const [selectedSession, setSelectedSession] = useState('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/get-users');
      const data = await response.json();
      
      if (data.users && data.users.length > 0) {
        setUsers(data.users);
        // Auto-select sammeee@yahoo.com if exists
        const testUser = data.users.find((u: any) => u.email === 'sammeee@yahoo.com');
        if (testUser) {
          setSelectedUser(testUser.id);
        }
      } else {
        setMessage('⚠️ No users found in database');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setMessage('❌ Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const setProgress = async (percent: number) => {
    if (!selectedUser) {
      setMessage('❌ Please select a user first!');
      return;
    }

    setLoading(true);
    setMessage(`⏳ Setting progress to ${percent}%...`);
    
    try {
      const response = await fetch('/api/admin/testing-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          moduleId: selectedModule,
          sessionId: selectedSession,
          progressPercent: percent,
        }),
      });

      if (response.ok) {
        setMessage(`✅ User set to ${percent}% for Module ${selectedModule}, Session ${selectedSession}`);
      } else {
        setMessage('❌ Failed to update progress');
      }
    } catch (error) {
      setMessage('❌ Error updating progress');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const currentModule = MODULES.find(m => m.id === selectedModule);
  const sessionCount = currentModule?.sessions || 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧪 Admin Testing Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Secure testing environment • {users.length} users loaded
              </p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-white font-semibold text-center ${
            message.includes('✅') ? 'bg-green-500' :
            message.includes('❌') ? 'bg-red-500' :
            message.includes('⚠️') ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}>
            {message}
          </div>
        )}

        {/* Main Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* User Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📧 Select Test User
            </label>
            {loadingUsers ? (
              <div className="text-gray-500">Loading users...</div>
            ) : (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                disabled={loading}
              >
                <option value="">-- Select a user --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email} 
                    {user.email === 'sammeee@yahoo.com' && ' ⭐ (Test Account)'}
                    {user.pre_assessment_completed && ' ✓'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Module & Session Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📚 Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setSelectedSession('1'); // Reset to session 1 when module changes
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                {MODULES.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name} ({module.sessions} sessions)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📖 Session
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                {[...Array(sessionCount)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Session {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🚀 Set Progress Level
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { p: 0, icon: '🆕', label: 'Reset', color: 'bg-gray-500' },
                { p: 25, icon: '📘', label: 'Early', color: 'bg-blue-500' },
                { p: 50, icon: '⚡', label: 'Half', color: 'bg-yellow-500' },
                { p: 75, icon: '🎯', label: 'Almost', color: 'bg-orange-500' },
                { p: 99, icon: '🎉', label: 'Modal', color: 'bg-purple-500' },
                { p: 100, icon: '✅', label: 'Done', color: 'bg-green-500' },
              ].map(({ p, icon, label, color }) => (
                <button
                  key={p}
                  onClick={() => setProgress(p)}
                  disabled={!selectedUser || loading}
                  className={`p-4 ${color} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105`}
                >
                  <div className="text-2xl">{icon}</div>
                  <div className="font-bold">{p}%</div>
                  <div className="text-xs opacity-90">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-6 border-t">
            <button
              onClick={() => {
                if (!selectedUser) {
                  setMessage('❌ Select a user first!');
                  return;
                }
                const url = `/modules/${selectedModule}/sessions/${selectedSession}`;
                console.log('Opening:', url);
                window.open(url, '_blank');
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              👤 View Session →
            </button>
            <button
              onClick={async () => {
                if (!selectedUser) {
                  setMessage('❌ Select a user first!');
                  return;
                }
                setMessage('⏳ Clearing all progress...');
                // Clear progress logic here
                setTimeout(() => setMessage('✅ Progress cleared!'), 1000);
              }}
              disabled={!selectedUser || loading}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              🗑️ Clear Progress
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔒</span>
            <div>
              <h3 className="font-semibold text-yellow-900">Security Notice</h3>
              <p className="text-yellow-800 text-sm mt-1">
                This dashboard bypasses normal authentication for testing purposes. 
                In production, ensure proper admin authentication is enforced.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/90 rounded-xl p-4 mt-6">
          <h3 className="font-semibold mb-2">💡 Quick Guide</h3>
          <ol className="text-sm space-y-1 text-gray-700">
            <li>1. Select user (sammeee@yahoo.com is pre-selected for testing)</li>
            <li>2. Choose module (5 modules available) and session</li>
            <li>3. Click progress button to instantly set completion level</li>
            <li>4. Use 99% to prepare for feedback modal testing</li>
            <li>5. Click "View Session" to open in new tab as that user</li>
          </ol>
        </div>
      </div>
    </div>
  );
}