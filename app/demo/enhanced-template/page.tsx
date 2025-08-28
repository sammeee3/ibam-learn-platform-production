'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ArrowPathIcon,
  LightBulbIcon,
  ClockIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SparklesIcon,
  BoltIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface PreviousAction {
  id: string;
  text: string;
  when: string;
  person: string;
  status?: 'complete' | 'partial' | 'deferred' | null;
  learning?: string;
}

export default function EnhancedTemplateDemo() {
  const [expandedSections, setExpandedSections] = useState({
    lookingBack: true,
    lookingUp: false,
    lookingForward: false
  });

  const [previousActions, setPreviousActions] = useState<PreviousAction[]>([
    {
      id: '1',
      text: 'Call 5 potential customers to discuss their business challenges',
      when: 'Tuesday 2-4 PM',
      person: 'John (accountability partner)',
      status: null,
      learning: ''
    }
  ]);

  const [newActions, setNewActions] = useState<any[]>([]);
  const [deferredActions, setDeferredActions] = useState<any[]>([]);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [streak, setStreak] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const updateActionStatus = (actionId: string, status: 'complete' | 'partial' | 'deferred') => {
    setPreviousActions(prev => prev.map(action => {
      if (action.id === actionId) {
        if (status === 'complete') {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          setStreak(s => s + 1);
        }
        if (status === 'deferred') {
          setDeferredActions(d => [...d, { ...action, id: `deferred-${Date.now()}` }]);
        }
        return { ...action, status };
      }
      return action;
    }));
  };

  const updateLearning = (actionId: string, learning: string) => {
    setPreviousActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, learning } : action
    ));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #e0e7ff)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header matching your template */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.125rem', color: '#4b5563' }}>
              Module 1 • Session 1
            </h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              Business is a Good Gift from God
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>~45 min</span>
          </div>
        </div>
      </div>

      {/* Progress Section matching your design */}
      <div style={{ background: 'white', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            {/* Progress Circle */}
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle 
                  cx="40" cy="40" r="36" 
                  stroke="#3b82f6" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - sessionProgress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sessionProgress}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complete</div>
              </div>
            </div>

            {/* Session Progress Info */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Session Progress</h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>About 45 minutes remaining</p>
              {/* Enhanced: Add action completion tracker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                <span style={{ 
                  background: '#dbeafe', 
                  color: '#1e40af', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircleIcon style={{ width: '1rem', height: '1rem' }} />
                  Actions This Module: 4/12
                </span>
                {streak > 0 && (
                  <span style={{ 
                    background: '#fef3c7', 
                    color: '#92400e', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    🔥 {streak} day streak
                  </span>
                )}
              </div>
            </div>

            {/* Progress Indicators */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔄</span>
                <span style={{ color: previousActions.some(a => a.status === 'complete') ? '#10b981' : '#9ca3af' }}>
                  Looking Back
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <span style={{ color: '#9ca3af' }}>Looking Up</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🎯</span>
                <span style={{ color: '#9ca3af' }}>Looking Forward</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <span style={{ color: '#9ca3af' }}>Knowledge Check</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        {/* Celebration Animation */}
        {showCelebration && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            textAlign: 'center',
            animation: 'bounce 1s ease-in-out'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Great Job!</h3>
            <p style={{ color: '#6b7280' }}>You completed an action!</p>
          </div>
        )}

        {/* ENHANCED Looking Back Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => toggleSection('lookingBack')}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 'bold'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔄</span>
              <span>LOOKING BACK</span>
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Accountability & Previous Commitments
              </span>
            </div>
            {expandedSections.lookingBack ? <ChevronDownIcon style={{ width: '1.5rem' }} /> : <ChevronRightIcon style={{ width: '1.5rem' }} />}
          </button>

          {expandedSections.lookingBack && (
            <div style={{ padding: '1.5rem', background: '#f0f9ff' }}>
              {/* Quick Win Tracker - NEW */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #dbeafe'
              }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✨ Quick Review of Last Session\'s Action
                </h4>
                
                {previousActions.map(action => (
                  <div key={action.id} style={{
                    padding: '1rem',
                    background: action.status === 'complete' ? '#dcfce7' : 
                               action.status === 'deferred' ? '#dbeafe' : '#fafafa',
                    borderRadius: '0.5rem',
                    marginBottom: '0.75rem',
                    border: `2px solid ${
                      action.status === 'complete' ? '#86efac' : 
                      action.status === 'deferred' ? '#93c5fd' : '#e5e7eb'
                    }`
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>📝 Your Action:</p>
                      <p style={{ marginLeft: '1.5rem' }}>{action.text}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                        When: {action.when} | Accountability: {action.person}
                      </p>
                    </div>

                    {!action.status && (
                      <>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>How did it go?</p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => updateActionStatus(action.id, 'complete')}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <CheckCircleIcon style={{ width: '1.25rem' }} />
                              Completed!
                            </button>
                            <button
                              onClick={() => updateActionStatus(action.id, 'partial')}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <LightBulbIcon style={{ width: '1.25rem' }} />
                              Learned
                            </button>
                            <button
                              onClick={() => updateActionStatus(action.id, 'deferred')}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <ArrowPathIcon style={{ width: '1.25rem' }} />
                              Defer
                            </button>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            What happened? (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Quick note about what you learned..."
                            onChange={(e) => updateLearning(action.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #e5e7eb'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {action.status === 'complete' && (
                      <div style={{ background: '#bbf7d0', padding: '0.75rem', borderRadius: '0.375rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#14532d' }}>
                          🎉 Awesome! You completed this action!
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#166534', marginTop: '0.25rem' }}>
                          Keep up the great work!
                        </p>
                      </div>
                    )}

                    {action.status === 'partial' && (
                      <div style={{ background: '#fed7aa', padding: '0.75rem', borderRadius: '0.375rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#7c2d12' }}>
                          💡 Every attempt is a learning opportunity!
                        </p>
                      </div>
                    )}

                    {action.status === 'deferred' && (
                      <div style={{ background: '#bfdbfe', padding: '0.75rem', borderRadius: '0.375rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                          ⏩ This action has been moved to today\'s Looking Forward section
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Original content placeholder */}
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
                <p>✨ Your commitment tracking is now enhanced with quick status updates!</p>
              </div>
            </div>
          )}
        </div>

        {/* Looking Up Section (unchanged) */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => toggleSection('lookingUp')}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 'bold'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpenIcon style={{ width: '1.5rem' }} />
              <span>LOOKING UP</span>
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Scripture + Business Learning + Integration
              </span>
            </div>
            {expandedSections.lookingUp ? <ChevronDownIcon style={{ width: '1.5rem' }} /> : <ChevronRightIcon style={{ width: '1.5rem' }} />}
          </button>

          {expandedSections.lookingUp && (
            <div style={{ padding: '1.5rem', background: '#f0fdf4' }}>
              <p>Your existing content goes here...</p>
            </div>
          )}
        </div>

        {/* ENHANCED Looking Forward Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          marginBottom: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => toggleSection('lookingForward')}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: '#ea580c',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 'bold'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <span>LOOKING FORWARD</span>
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Action Planning + Commitments + Feedback
              </span>
            </div>
            {expandedSections.lookingForward ? <ChevronDownIcon style={{ width: '1.5rem' }} /> : <ChevronRightIcon style={{ width: '1.5rem' }} />}
          </button>

          {expandedSections.lookingForward && (
            <div style={{ padding: '1.5rem', background: '#fff7ed' }}>
              {/* Show deferred actions - NEW */}
              {deferredActions.length > 0 && (
                <div style={{
                  background: '#dbeafe',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #3b82f6'
                }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e40af' }}>
                    ⏩ Deferred Actions (Automatically Added)
                  </h4>
                  {deferredActions.map(action => (
                    <div key={action.id} style={{ marginBottom: '0.5rem' }}>
                      <p>• {action.text}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1rem' }}>
                        Original timing: {action.when}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Smart Action Builder - ENHANCED */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  🎯 Create Your Action Commitment
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    What specific action will you take?
                  </label>
                  <textarea
                    placeholder="Be specific: e.g., \'Call 3 customers to ask about their biggest challenge\'"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb',
                      minHeight: '60px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      When exactly? (NEW)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                      </select>
                      <input
                        type="time"
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      Difficulty (NEW)
                    </label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Easy Win
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Medium
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Challenge
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Who will check on you?
                  </label>
                  <input
                    type="text"
                    placeholder="Name of accountability partner"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                </div>

                {/* Success Helper - NEW */}
                <div style={{
                  background: '#f0fdf4',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem',
                  border: '1px solid #86efac'
                }}>
                  <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>
                    💡 Success Helper (NEW)
                  </h5>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    What might prevent this?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., \'Too busy\', \'Fear of rejection\'"
                    style={{
                      width: '100%',
                      padding: '0.375rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #bbf7d0',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Save Action Commitment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transformation Promise (unchanged) */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #3b82f6)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ✨ Your Transformation Promise
          </h3>
          <p>
            By the end of this session, you\'ll see your business not as a necessary evil, 
            but as a sacred gift from God—a primary platform for ministry, discipleship, 
            and Kingdom impact in your community.
          </p>
        </div>
      </div>
    </div>
  );
}