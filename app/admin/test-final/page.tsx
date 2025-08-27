'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Correct module structure - Module 3 and 5 have 5 sessions
const MODULES = [
  { id: '1', name: 'Module 1: Foundation', sessions: 4 },
  { id: '2', name: 'Module 2: Growth', sessions: 4 },
  { id: '3', name: 'Module 3: Leadership', sessions: 5 }, // 5 sessions!
  { id: '4', name: 'Module 4: Impact', sessions: 4 },
  { id: '5', name: 'Module 5: Business Planning', sessions: 5 }, // 5 sessions!
];

export default function FinalTestDashboard() {
  // Initialize with test users immediately
  const [users, setUsers] = useState<any[]>([
    { id: '24f9c7e2-1a2b-4c5d-8e9f-0123456789ab', email: 'sammeee@yahoo.com', name: 'Jeff Samuelson' },
    { id: '34f9c7e2-1a2b-4c5d-8e9f-0123456789ac', email: 'test@example.com', name: 'Test User' },
    { id: '44f9c7e2-1a2b-4c5d-8e9f-0123456789ad', email: 'admin@ibam.org', name: 'Admin User' }
  ]);
  const [selectedUserId, setSelectedUserId] = useState('24f9c7e2-1a2b-4c5d-8e9f-0123456789ab');
  const [selectedModule, setSelectedModule] = useState('1');
  const [selectedSession, setSelectedSession] = useState('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Get REAL users from user_profiles table with actual IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, email, first_name, last_name')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (profiles && profiles.length > 0) {
        console.log('Found users:', profiles);
        const formattedUsers = profiles.map((p: any) => ({
          id: p.id,
          email: p.email || 'No email',
          name: p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : p.email
        }));
        setUsers(formattedUsers);
        
        // Find and select test user
        const testUser = formattedUsers.find((u: any) => 
          u.email === 'sammeee@yahoo.com' || 
          u.email === 'test@example.com' ||
          u.email === 'jeff@ibamonline.org'
        );
        if (testUser) {
          setSelectedUserId(testUser.id);
          console.log('Selected user:', testUser);
        } else if (formattedUsers.length > 0) {
          // Select first user if no test user found
          setSelectedUserId(formattedUsers[0].id);
        }
      } else {
        console.log('No users in database, keeping test users');
        // Keep the pre-initialized test users
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Keep the pre-initialized test users
    }
  };

  const handleSetProgress = async (percent: number) => {
    if (!selectedUserId) {
      showMessage('❌ Please select a user first!');
      return;
    }

    setLoading(true);
    showMessage(`⏳ Setting progress to ${percent}%...`);

    try {
      const sessionId = `${selectedModule}-${selectedSession}`;
      console.log('Setting progress for:', { userId: selectedUserId, sessionId, percent });
      
      // Calculate sections based on percentage
      let completedSections: string[] = [];
      let lookbackCompleted = false;
      let lookupCompleted = false;  
      let lookforwardCompleted = false;
      let quizCompleted = false;

      if (percent >= 25) {
        completedSections.push('lookback');
        lookbackCompleted = true;
      }
      if (percent >= 50) {
        completedSections.push('lookup');
        lookupCompleted = true;
      }
      if (percent >= 75) {
        completedSections.push('quiz');
        quizCompleted = true;
      }
      if (percent === 100) {
        completedSections.push('lookforward');
        lookforwardCompleted = true;
      }

      // For 99%, set it just before completion to trigger modal
      const actualProgress = percent === 99 ? 95 : percent;

      const progressData = {
        user_id: selectedUserId,
        session_id: sessionId,
        module_id: parseInt(selectedModule),
        completed_sections: completedSections,
        lookback_completed: lookbackCompleted,
        lookup_completed: lookupCompleted,
        lookforward_completed: lookforwardCompleted,
        quiz_completed: quizCompleted,
        overall_progress: actualProgress,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Upserting progress data:', progressData);

      // Direct database update with better error handling
      const { data, error } = await supabase
        .from('session_progress')
        .upsert(progressData, {
          onConflict: 'user_id,session_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Database error details:', error);
        showMessage(`❌ Database error: ${error.message}`);
        return;
      }

      console.log('Progress saved successfully:', data);

      // Also mark pre-assessment as completed
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ 
          pre_assessment_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUserId);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Create fake assessment response
      const { error: assessmentError } = await supabase
        .from('assessment_responses')
        .upsert({
          user_id: selectedUserId,
          assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7',
          responses: [{ question_id: 1, answer_index: 0, answer_text: 'ADMIN_TEST' }],
          total_score: 999,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,assessment_id',
          ignoreDuplicates: false
        });

      if (assessmentError) {
        console.error('Assessment error:', assessmentError);
      }

      showMessage(`✅ Progress set to ${percent}% for Module ${selectedModule}, Session ${selectedSession}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      showMessage('❌ Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    if (!msg.includes('⏳')) {
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const viewSession = () => {
    if (!selectedUserId) {
      showMessage('❌ Select a user first!');
      return;
    }
    const url = `/modules/${selectedModule}/sessions/${selectedSession}`;
    console.log('Opening URL:', url);
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      showMessage('❌ Pop-up blocked! Please allow pop-ups for this site.');
    }
  };

  const currentModule = MODULES.find(m => m.id === selectedModule);
  const sessionCount = currentModule?.sessions || 4;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
                🧪 Final Testing Dashboard
              </h1>
              <p style={{ margin: '0.25rem 0 0', color: '#666' }}>
                {users.length} users loaded • Direct database access
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/admin'}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#4b5563',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white',
            background: message.includes('✅') ? '#10b981' : 
                       message.includes('❌') ? '#ef4444' : '#3b82f6'
          }}>
            {message}
          </div>
        )}

        {/* Main Panel */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {/* User Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              📧 Select Test User:
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select a user --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email} {user.email === 'sammeee@yahoo.com' && '⭐'}
                </option>
              ))}
            </select>
          </div>

          {/* Module & Session */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                📚 Module:
              </label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setSelectedSession('1');
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {MODULES.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name} ({module.sessions} sessions)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                📖 Session:
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
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
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold' }}>
              🚀 Set Progress Level:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { p: 0, icon: '🆕', label: 'Reset', color: '#6b7280' },
                { p: 25, icon: '📘', label: 'Early', color: '#3b82f6' },
                { p: 50, icon: '⚡', label: 'Half', color: '#eab308' },
                { p: 75, icon: '🎯', label: 'Almost', color: '#f97316' },
                { p: 99, icon: '🎉', label: 'Modal', color: '#a855f7' },
                { p: 100, icon: '✅', label: 'Done', color: '#10b981' },
              ].map(({ p, icon, label, color }) => (
                <button
                  key={p}
                  onClick={() => handleSetProgress(p)}
                  disabled={!selectedUserId || loading}
                  style={{
                    padding: '1rem',
                    background: !selectedUserId || loading ? '#d1d5db' : color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: !selectedUserId || loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: !selectedUserId || loading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                  <div>{p}%</div>
                  <div style={{ fontSize: '0.75rem' }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            paddingTop: '1.5rem',
            borderTop: '2px solid #e5e7eb'
          }}>
            <button
              onClick={viewSession}
              style={{
                padding: '1rem 2rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              👤 View Session →
            </button>
            <button
              onClick={() => {
                if (selectedUserId) {
                  handleSetProgress(0);
                } else {
                  showMessage('❌ Select a user first!');
                }
              }}
              style={{
                padding: '1rem 2rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              🗑️ Clear Progress
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{
                display: 'inline-block',
                width: '2rem',
                height: '2rem',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>💡 Testing Instructions</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: 1.6 }}>
            <li>Select sammeee@yahoo.com (auto-selected if available)</li>
            <li>Module 5 now correctly shows 5 sessions</li>
            <li>Click any progress button (they work when user is selected)</li>
            <li>Use 99% to prepare for feedback modal</li>
            <li>View Session opens in new tab (check pop-up blocker if needed)</li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}