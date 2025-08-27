'use client';

import { useState } from 'react';

interface Action {
  id: string;
  type: 'business' | 'discipleship';
  specific: string;
  when: string;
  person: string;
  completed?: boolean;
  notes?: string;
}

export default function SimpleFlowDemo() {
  const [view, setView] = useState<'menu' | 'back' | 'forward'>('menu');
  const [previousActions] = useState<Action[]>([
    {
      id: '1',
      type: 'business',
      specific: 'Call 5 potential customers',
      when: 'Wednesday 2-4 PM',
      person: 'John (accountability partner)',
    },
    {
      id: '2', 
      type: 'discipleship',
      specific: 'Have coffee with Sarah from accounting',
      when: 'Friday 3 PM',
      person: 'My spouse',
    }
  ]);
  const [actionStatus, setActionStatus] = useState<Record<string, any>>({});
  const [newActions, setNewActions] = useState<Action[]>([]);

  const markComplete = (id: string) => {
    setActionStatus(prev => ({
      ...prev,
      [id]: { completed: true, notes: '' }
    }));
  };

  const markIncomplete = (id: string) => {
    setActionStatus(prev => ({
      ...prev,
      [id]: { completed: false, reason: 'Did not have time' }
    }));
  };

  const deferAction = (action: Action) => {
    setNewActions(prev => [...prev, {
      ...action,
      id: `new-${Date.now()}`,
      notes: 'Deferred from last session'
    }]);
    setActionStatus(prev => ({
      ...prev,
      [action.id]: { ...prev[action.id], deferred: true }
    }));
  };

  const addNewAction = (type: 'business' | 'discipleship') => {
    const newAction: Action = {
      id: `new-${Date.now()}`,
      type,
      specific: type === 'business' 
        ? 'Review financial statements for cost savings'
        : 'Pray with stressed colleague',
      when: type === 'business' ? 'Monday 9-10 AM' : 'Tuesday lunch',
      person: type === 'business' ? 'Business partner' : 'Prayer partner'
    };
    setNewActions(prev => [...prev, newAction]);
  };

  if (view === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>
              IBAM Action Commitment Flow
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)' }}>
              Experience the complete accountability cycle
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ color: '#667eea' }}>1️⃣ Previous Session</h3>
                <p>You created action commitments based on what you learned</p>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ color: '#764ba2' }}>2️⃣ Current Session - Look Back</h3>
                <p>Review actions: Complete ✅ Learn 💡 or Defer ⏩</p>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                <h3 style={{ color: '#667eea' }}>3️⃣ Current Session - Look Forward</h3>
                <p>Create new actions including any deferred ones</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <button
              onClick={() => setView('back')}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⬅️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Looking Back</h3>
              <p style={{ color: '#666' }}>Review your previous actions</p>
              <ul style={{ textAlign: 'left', marginTop: '1rem', color: '#666' }}>
                <li>✅ Mark complete</li>
                <li>💡 Extract learning</li>
                <li>⏩ Defer to next</li>
              </ul>
            </button>

            <button
              onClick={() => setView('forward')}
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>➡️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Looking Forward</h3>
              <p style={{ color: '#666' }}>Create new commitments</p>
              <ul style={{ textAlign: 'left', marginTop: '1rem', color: '#666' }}>
                <li>💼 Business actions</li>
                <li>❤️ Discipleship actions</li>
                <li>👥 Accountability partners</li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'back') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button
            onClick={() => setView('menu')}
            style={{
              background: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Menu
          </button>

          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Looking Back: Action Review
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
            Review your actions from Module 1, Session 1
          </p>

          {previousActions.map((action, index) => {
            const status = actionStatus[action.id] || {};
            return (
              <div key={action.id} style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                border: status.completed ? '3px solid #10b981' :
                        status.deferred ? '3px solid #3b82f6' : 
                        '3px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {action.type === 'business' ? '💼' : '❤️'}
                      {action.type === 'business' ? 'Business' : 'Discipleship'} Action #{index + 1}
                      {status.completed && <span style={{ color: '#10b981' }}>✅ Complete</span>}
                      {status.deferred && <span style={{ color: '#3b82f6' }}>⏩ Deferred</span>}
                    </h3>
                    <p><strong>Action:</strong> {action.specific}</p>
                    <p><strong>When:</strong> {action.when}</p>
                    <p><strong>Tell:</strong> {action.person}</p>
                  </div>
                </div>

                {!status.completed && !status.reason && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <button
                      onClick={() => markComplete(action.id)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Complete
                    </button>
                    <button
                      onClick={() => markIncomplete(action.id)}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      💡 Incomplete
                    </button>
                    <button
                      onClick={() => deferAction(action)}
                      disabled={status.deferred}
                      style={{
                        background: status.deferred ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: status.deferred ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ⏩ Defer
                    </button>
                  </div>
                )}

                {status.completed && (
                  <div style={{ background: '#d1fae5', padding: '1rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#065f46' }}>🎉 Congratulations! Share your win:</h4>
                    <textarea
                      placeholder="What was the best outcome?"
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                      rows={2}
                    />
                  </div>
                )}

                {status.reason && (
                  <div style={{ background: '#fed7aa', padding: '1rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#7c2d12' }}>💡 Learning Opportunity:</h4>
                    <p>Status: {status.reason}</p>
                    <textarea
                      placeholder="What did you learn?"
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                      rows={2}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setView('forward')}
            style={{
              background: '#4f46e5',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              marginTop: '2rem'
            }}
          >
            Continue to Looking Forward →
          </button>
        </div>
      </div>
    );
  }

  if (view === 'forward') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button
            onClick={() => setView('menu')}
            style={{
              background: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Menu
          </button>

          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Looking Forward: New Commitments
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
            Create actions for Module 1, Session 2
          </p>

          {/* Deferred Actions */}
          {newActions.filter(a => a.notes?.includes('Deferred')).length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1rem',
              border: '3px solid #3b82f6'
            }}>
              <h3 style={{ color: '#1e40af' }}>⏩ Deferred Actions (Auto-Added)</h3>
              {newActions.filter(a => a.notes?.includes('Deferred')).map(action => (
                <div key={action.id} style={{ marginTop: '0.5rem' }}>
                  <p>{action.type === 'business' ? '💼' : '❤️'} {action.specific}</p>
                </div>
              ))}
            </div>
          )}

          {/* New Actions */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h3>Create New Actions ({newActions.length}/4)</h3>
            
            {newActions.length < 4 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => addNewAction('business')}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  💼 Add Business Action
                </button>
                <button
                  onClick={() => addNewAction('discipleship')}
                  style={{
                    background: '#ec4899',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ❤️ Add Discipleship Action
                </button>
              </div>
            )}

            {newActions.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Your Actions:</h4>
                {newActions.map((action, index) => (
                  <div key={action.id} style={{
                    background: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem'
                  }}>
                    <p>
                      {action.type === 'business' ? '💼' : '❤️'}
                      <strong> Action {index + 1}:</strong> {action.specific}
                    </p>
                    <p><small>When: {action.when} | Tell: {action.person}</small></p>
                    <button
                      onClick={() => setNewActions(prev => prev.filter(a => a.id !== action.id))}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newActions.length > 0 && (
              <button
                onClick={() => {
                  alert('Actions saved! They will appear in next session\'s review.');
                  setView('menu');
                }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '1rem'
                }}
              >
                ✅ Complete Session
              </button>
            )}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3>🎯 Tips for Winnable Actions</h3>
            <ul>
              <li><strong>Specific:</strong> Clear actions you can visualize</li>
              <li><strong>Timed:</strong> Schedule when and where</li>
              <li><strong>Accountable:</strong> Someone will check on you</li>
              <li><strong>Achievable:</strong> Start small, build momentum</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}