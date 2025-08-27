'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleTestingDashboard() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedModule, setSelectedModule] = useState('1');
  const [selectedSession, setSelectedSession] = useState('1');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch real users from database
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/testing');
      if (response.ok) {
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
          // Auto-select sammeee@yahoo.com
          const testUser = data.users.find((u: any) => u.email === 'sammeee@yahoo.com');
          if (testUser) {
            setSelectedUser(testUser.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSetProgress = async (percent: number) => {
    if (!selectedUser) {
      setMessage('❌ Please select a user first!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

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
        setMessage(`✅ Success! User set to ${percent}% for Module ${selectedModule}, Session ${selectedSession}`);
      } else {
        setMessage('❌ Failed to update progress');
      }
    } catch (error) {
      setMessage('❌ Error updating progress');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  const viewSession = () => {
    if (!selectedUser) {
      setMessage('❌ Select a user first!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const url = `/modules/${selectedModule}/sessions/${selectedSession}`;
    window.open(url, '_blank');
  };

  const goToAdmin = () => {
    router.push('/admin');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '1rem', 
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>
            🧪 Simple Testing Dashboard
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
            Quick testing controls - Works immediately!
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: message.includes('✅') ? '#10b981' : message.includes('❌') ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            animation: message.includes('⏳') ? 'pulse 1s infinite' : 'none'
          }}>
            {message}
          </div>
        )}

        {/* Controls */}
        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {/* User Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              📧 Select User:
            </label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="">-- Select a user --</option>
              {users.length > 0 ? (
                users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email} {user.email === 'sammeee@yahoo.com' ? '⭐' : ''}
                  </option>
                ))
              ) : (
                <option disabled>Loading users...</option>
              )}
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
                onChange={(e) => setSelectedModule(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value="1">Module 1: Foundation</option>
                <option value="2">Module 2: Growth</option>
                <option value="3">Module 3: Leadership</option>
                <option value="4">Module 4: Impact</option>
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
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value="1">Session 1</option>
                <option value="2">Session 2</option>
                <option value="3">Session 3</option>
                <option value="4">Session 4</option>
              </select>
            </div>
          </div>

          {/* Progress Buttons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              🚀 Set Progress Instantly:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { percent: 0, icon: '🆕', label: 'Reset', color: '#6b7280' },
                { percent: 25, icon: '📘', label: 'Early', color: '#3b82f6' },
                { percent: 50, icon: '⚡', label: 'Half', color: '#eab308' },
                { percent: 75, icon: '🎯', label: 'Almost', color: '#f97316' },
                { percent: 99, icon: '🎉', label: 'Modal', color: '#a855f7' },
                { percent: 100, icon: '✅', label: 'Done', color: '#10b981' },
              ].map(({ percent, icon, label, color }) => (
                <button 
                  key={percent}
                  onClick={() => handleSetProgress(percent)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  style={{ 
                    padding: '1rem',
                    background: color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: selectedUser ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    opacity: selectedUser ? 1 : 0.5,
                    transition: 'transform 0.2s',
                    textAlign: 'center'
                  }}
                  disabled={!selectedUser}
                >
                  <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                  <div>{percent}%</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            borderTop: '2px solid #e5e7eb',
            paddingTop: '1.5rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button 
              onClick={viewSession}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              style={{ 
                padding: '1rem 2rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'background 0.2s'
              }}
            >
              👤 View Session in New Tab
            </button>
            <button 
              onClick={goToAdmin}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
              style={{ 
                padding: '1rem 2rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'background 0.2s'
              }}
            >
              ← Back to Admin Panel
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#333', fontSize: '1.2rem' }}>
            💡 Testing the Feedback Modal
          </h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
            <li><strong>Select sammeee@yahoo.com</strong> (auto-selected if available)</li>
            <li><strong>Choose Module 1, Session 1</strong> (or any combination)</li>
            <li><strong>Click 99% button</strong> to set user almost complete</li>
            <li><strong>Click "View Session"</strong> to open in new tab</li>
            <li><strong>Complete Looking Forward section</strong> to trigger modal at 100%!</li>
          </ol>
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            background: '#fef3c7', 
            borderRadius: '0.5rem',
            border: '2px solid #fbbf24'
          }}>
            <strong style={{ color: '#92400e' }}>💡 Pro Tip:</strong>
            <span style={{ color: '#78350f' }}> The 99% button sets everything complete except Looking Forward - perfect for testing the feedback modal!</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}