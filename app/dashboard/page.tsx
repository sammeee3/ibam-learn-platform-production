'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MainDashboard() {
  const [user, setUser] = useState({
    firstName: 'Jeff',
    lastName: 'Samuelson',
    memberType: 'Individual Business Member',
    joinDate: '2025-06-13',
    completedModules: 2,
    totalModules: 5,
    businessPlansCreated: 1,
    currentStreak: 7,
    preAssessmentCompleted: true,
    preAssessmentScore: 2.8,
    postAssessmentCompleted: false,
    postAssessmentScore: null,
    averageSessionRating: 4.2,
    totalSessionsCompleted: 8,
    learningGoals: [
      'Create a biblical business plan',
      'Learn effective marketing strategies', 
      'Integrate faith into business operations'
    ]
  })

  const modules = [
    {
      id: 1,
      title: 'Foundational Principles',
      sessions: 4,
      completed: 4,
      status: 'completed',
      description: 'Biblical foundation for faith-driven business'
    },
    {
      id: 2,
      title: 'Success and Failure Factors',
      sessions: 4,
      completed: 4,
      status: 'completed',
      description: 'Understanding what makes businesses succeed'
    },
    {
      id: 3,
      title: 'Marketing',
      sessions: 5,
      completed: 2,
      status: 'in-progress',
      description: 'Reaching your customers effectively'
    },
    {
      id: 4,
      title: 'Finance',
      sessions: 4,
      completed: 0,
      status: 'locked',
      description: 'Managing money and funding your business'
    },
    {
      id: 5,
      title: 'Business Planning',
      sessions: 3,
      completed: 0,
      status: 'locked',
      description: 'Writing your comprehensive business plan'
    }
  ]

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Module 3: Marketing - Session 3',
      icon: '📚',
      href: '/modules/3/sessions/3',
      color: '#5DADE2'
    },
    {
      title: 'Business Planner',
      description: 'Create or edit your business plan',
      icon: '💼',
      href: '/business-planner',
      color: '#4ECDC4'
    },
    ...(user.completedModules >= user.totalModules && !user.postAssessmentCompleted ? [{
      title: 'Post-Course Assessment',
      description: 'Measure your growth and improvement',
      icon: '🎯',
      href: '/assessment/post',
      color: '#22C55E'
    }] : []),
    ...(!user.preAssessmentCompleted ? [{
      title: 'Start Pre-Assessment',
      description: 'Establish your learning baseline',
      icon: '📋',
      href: '/assessment/pre',
      color: '#8B5CF6'
    }] : []),
    {
      title: 'AI Coach',
      description: 'Get personalized business advice',
      icon: '🤖',
      href: '/ai-coach',
      color: '#E74C3C'
    },
    {
      title: 'Community',
      description: 'Connect with other entrepreneurs',
      icon: '👥',
      href: '/community',
      color: '#9B59B6'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img
            src="/images/branding/mini-logo.png"
            alt="IBAM Logo"
            style={{
              width: '40px',
              height: 'auto'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.includes('mini-logo.png')) {
                target.src = '/images/branding/ibam-logo.png';
              } else {
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div style="
                    width: 40px; 
                    height: 40px; 
                    background: #2C3E50; 
                    border-radius: 6px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-weight: bold; 
                    font-size: 12px;
                  ">IBAM</div>
                `;
              }
            }}
          />
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              margin: 0
            }}>
              IBAM Learning Platform
            </h1>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#6C757D'
          }}>
            <span>🔥</span>
            <span>{user.currentStreak} day streak</span>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#5DADE2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0'
          }}>
            Welcome back, {user.firstName}! 👋
          </h2>
          <p style={{
            fontSize: '1rem',
            opacity: 0.9,
            margin: '0 0 1.5rem 0'
          }}>
            Continue building your faith-driven business with IBAM
          </p>
          
          {/* Progress Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {user.completedModules}/{user.totalModules}
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                Modules Complete
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {user.businessPlansCreated}
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                Business Plans
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {user.averageSessionRating.toFixed(1)}
              </div>
              <div style={{
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                Avg Rating
              </div>
            </div>
            {user.preAssessmentCompleted && user.postAssessmentCompleted && (
              <div style={{
                backgroundColor: 'rgba(34,197,94,0.2)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>
                  +{((user.postAssessmentScore || 0) - user.preAssessmentScore).toFixed(1)}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  opacity: 0.8
                }}>
                  Growth Points
                </div>
              </div>
            )}
            {!user.postAssessmentCompleted && user.completedModules >= user.totalModules && (
              <div style={{
                backgroundColor: 'rgba(34,197,94,0.2)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem'
                }}>
                  🎯
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  opacity: 0.8
                }}>
                  Take Final Assessment
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'block'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: action.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#2C3E50',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {action.title}
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6C757D',
                      margin: 0
                    }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Your Learning Progress
          </h3>

          {/* Assessment Progress */}
          {(user.preAssessmentCompleted || user.postAssessmentCompleted) && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📊 Assessment Progress
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: user.postAssessmentCompleted ? 'repeat(2, 1fr)' : '1fr',
                gap: '1rem'
              }}>
                {/* Pre-Assessment */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#6C757D',
                    marginBottom: '0.5rem'
                  }}>
                    Pre-Course Baseline
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: user.preAssessmentCompleted ? '#5DADE2' : '#E5E7EB',
                    marginBottom: '0.25rem'
                  }}>
                    {user.preAssessmentCompleted ? user.preAssessmentScore.toFixed(1) : '—'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6C757D'
                  }}>
                    {user.preAssessmentCompleted ? 'Completed' : 'Not taken'}
                  </div>
                </div>

                {/* Post-Assessment */}
                {user.postAssessmentCompleted ? (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #22C55E'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6C757D',
                      marginBottom: '0.5rem'
                    }}>
                      Post-Course Score
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#22C55E',
                      marginBottom: '0.25rem'
                    }}>
                      {(user.postAssessmentScore || 0).toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#22C55E',
                      fontWeight: '600'
                    }}>
                      +{((user.postAssessmentScore || 0) - user.preAssessmentScore).toFixed(1)} improvement
                    </div>
                  </div>
                ) : user.completedModules >= user.totalModules ? (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#FFFBEB',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #F59E0B'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6C757D',
                      marginBottom: '0.5rem'
                    }}>
                      Ready for Final Assessment
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem'
                    }}>
                      🎯
                    </div>
                    <Link
                      href="/assessment/post"
                      style={{
                        backgroundColor: '#F59E0B',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Take Assessment
                    </Link>
                  </div>
                ) : null}
              </div>

              {user.preAssessmentCompleted && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: '#6C757D',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  Your learning goals: {user.learningGoals.join(', ')}
                </div>
              )}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {modules.map((module) => {
              const progressPercentage = (module.completed / module.sessions) * 100
              const isLocked = module.status === 'locked'
              const isCompleted = module.status === 'completed'
              
              return (
                <div
                  key={module.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    opacity: isLocked ? 0.6 : 1
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#2C3E50',
                          margin: 0
                        }}>
                          Module {module.id}: {module.title}
                        </h4>
                        {isCompleted && (
                          <span style={{
                            backgroundColor: '#22C55E',
                            color: 'white',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            ✓ Complete
                          </span>
                        )}
                        {isLocked && (
                          <span style={{
                            backgroundColor: '#9CA3AF',
                            color: 'white',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            🔒 Locked
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6C757D',
                        margin: '0 0 1rem 0'
                      }}>
                        {module.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div style={{
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        height: '8px',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          backgroundColor: isCompleted ? '#22C55E' : '#5DADE2',
                          height: '100%',
                          borderRadius: '4px',
                          width: `${progressPercentage}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6C757D'
                      }}>
                        {module.completed} of {module.sessions} sessions completed
                      </div>
                    </div>
                    
                    {!isLocked && (
                      <Link
                        href={`/modules/${module.id}`}
                        style={{
                          backgroundColor: isCompleted ? '#22C55E' : '#5DADE2',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = isCompleted ? '#16A34A' : '#3498DB'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = isCompleted ? '#22C55E' : '#5DADE2'
                        }}
                      >
                        {isCompleted ? 'Review' : 'Continue'}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Show on mobile screens */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #E5E7EB',
        padding: '0.5rem',
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}>
        {[
          { icon: '🏠', label: 'Home', href: '/dashboard', active: true },
          { icon: '📚', label: 'Learn', href: '/modules' },
          { icon: '💼', label: 'Plan', href: '/business-planner' },
          { icon: '👥', label: 'Community', href: '/community' },
          { icon: '👤', label: 'Profile', href: '/profile' }
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.5rem',
              textDecoration: 'none',
              color: item.active ? '#5DADE2' : '#6C757D',
              fontSize: '0.75rem',
              minWidth: '44px'
            }}
          >
            <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}