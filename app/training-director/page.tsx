'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StudentProgress {
  id: string
  name: string
  email: string
  memberType: string
  enrollmentDate: string
  completedModules: number
  totalModules: number
  preAssessmentScore: number
  postAssessmentScore?: number
  averageSessionRating: number
  lastActive: string
  status: 'active' | 'completed' | 'inactive'
  businessPlanProgress: number
  sessionCompletion: {
    moduleId: number
    sessionId: number
    completedAt: string
    surveyRating: {
      comprehension: number
      application: number
      confidence: number
    }
    comments: {
      content: string
      delivery: string
      application: string
      improvement: string
    }
  }[]
}

interface CourseAnalytics {
  totalStudents: number
  activeStudents: number
  completionRate: number
  averageEngagement: number
  improvementMetrics: {
    biblicalFoundation: number
    businessKnowledge: number
    marketplaceMinistry: number
  }
  sessionRatings: {
    moduleId: number
    sessionId: number
    averageRating: number
    completionCount: number
    commonIssues: string[]
  }[]
}

export default function TrainingDirectorDashboard() {
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'analytics' | 'feedback'>('overview')
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null)
  const [dateRange, setDateRange] = useState('30')

  // Mock data - replace with actual API calls
  const courseAnalytics: CourseAnalytics = {
    totalStudents: 24,
    activeStudents: 18,
    completionRate: 67,
    averageEngagement: 4.2,
    improvementMetrics: {
      biblicalFoundation: 2.1,
      businessKnowledge: 1.8,
      marketplaceMinistry: 2.3
    },
    sessionRatings: [
      {
        moduleId: 1,
        sessionId: 1,
        averageRating: 4.5,
        completionCount: 22,
        commonIssues: ['Need more practical examples', 'Video quality could be better']
      },
      {
        moduleId: 1,
        sessionId: 2,
        averageRating: 4.1,
        completionCount: 20,
        commonIssues: ['Content too fast', 'More biblical examples needed']
      }
    ]
  }

  const students: StudentProgress[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      memberType: 'Individual Business Member',
      enrollmentDate: '2025-05-15',
      completedModules: 3,
      totalModules: 5,
      preAssessmentScore: 2.8,
      postAssessmentScore: 4.2,
      averageSessionRating: 4.5,
      lastActive: '2025-06-12',
      status: 'active',
      businessPlanProgress: 75,
      sessionCompletion: [
        {
          moduleId: 1,
          sessionId: 1,
          completedAt: '2025-05-16',
          surveyRating: { comprehension: 4, application: 5, confidence: 4 },
          comments: {
            content: 'Great biblical foundation, very clear explanations',
            delivery: 'Perfect video quality and pacing',
            application: 'Easy to apply to my consulting business',
            improvement: 'Maybe add more international examples'
          }
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mike.chen@email.com',
      memberType: 'Advanced Business Member',
      enrollmentDate: '2025-04-20',
      completedModules: 5,
      totalModules: 5,
      preAssessmentScore: 3.2,
      postAssessmentScore: 4.7,
      averageSessionRating: 4.8,
      lastActive: '2025-06-13',
      status: 'completed',
      businessPlanProgress: 100,
      sessionCompletion: []
    },
    {
      id: '3',
      name: 'Rachel Martinez',
      email: 'rachel.m@church.org',
      memberType: 'Church Partner',
      enrollmentDate: '2025-06-01',
      completedModules: 1,
      totalModules: 5,
      preAssessmentScore: 2.1,
      averageSessionRating: 3.8,
      lastActive: '2025-06-10',
      status: 'active',
      businessPlanProgress: 25,
      sessionCompletion: []
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22C55E'
      case 'completed': return '#5DADE2'
      case 'inactive': return '#EF4444'
      default: return '#6C757D'
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 4) return '#22C55E'
    if (score >= 3) return '#F59E0B'
    return '#EF4444'
  }

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Key Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {[
          {
            title: 'Total Students',
            value: courseAnalytics.totalStudents,
            subtitle: `${courseAnalytics.activeStudents} active`,
            icon: '👥',
            color: '#5DADE2'
          },
          {
            title: 'Completion Rate',
            value: `${courseAnalytics.completionRate}%`,
            subtitle: 'Course completion',
            icon: '✅',
            color: '#22C55E'
          },
          {
            title: 'Avg Engagement',
            value: courseAnalytics.averageEngagement.toFixed(1),
            subtitle: 'Session rating',
            icon: '⭐',
            color: '#F59E0B'
          },
          {
            title: 'Avg Improvement',
            value: '+2.1',
            subtitle: 'Points gained',
            icon: '📈',
            color: '#8B5CF6'
          }
        ].map((metric, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${metric.color}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>{metric.icon}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#2C3E50'
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6C757D'
                }}>
                  {metric.subtitle}
                </div>
              </div>
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2C3E50',
              margin: 0
            }}>
              {metric.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Student Progress Overview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#2C3E50',
          marginBottom: '1.5rem'
        }}>
          Student Progress Summary
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {students.slice(0, 6).map((student) => (
            <div
              key={student.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#5DADE2'
                e.currentTarget.style.backgroundColor = '#F8FAFC'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.backgroundColor = 'white'
              }}
              onClick={() => setSelectedStudent(student)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3E50',
                  margin: 0
                }}>
                  {student.name}
                </h4>
                <span style={{
                  backgroundColor: getStatusColor(student.status),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {student.status}
                </span>
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: '#6C757D',
                marginBottom: '0.75rem'
              }}>
                {student.completedModules}/{student.totalModules} modules • {student.memberType}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6C757D',
                    marginBottom: '0.25rem'
                  }}>
                    Progress
                  </div>
                  <div style={{
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    height: '6px'
                  }}>
                    <div style={{
                      backgroundColor: '#5DADE2',
                      height: '100%',
                      borderRadius: '4px',
                      width: `${(student.completedModules / student.totalModules) * 100}%`
                    }} />
                  </div>
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: getProgressColor(student.averageSessionRating)
                }}>
                  {student.averageSessionRating.toFixed(1)}⭐
                </div>
              </div>

              {student.postAssessmentScore && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#22C55E'
                }}>
                  <span>📈</span>
                  <span>
                    Improved {(student.postAssessmentScore - student.preAssessmentScore).toFixed(1)} points
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <button
            onClick={() => setSelectedView('students')}
            style={{
              backgroundColor: '#5DADE2',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3498DB'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5DADE2'}
          >
            View All Students →
          </button>
        </div>
      </div>

      {/* Learning Improvement Metrics */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#2C3E50',
          marginBottom: '1.5rem'
        }}>
          Average Student Improvement (Pre → Post Assessment)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              area: 'Biblical Foundation',
              improvement: courseAnalytics.improvementMetrics.biblicalFoundation,
              icon: '📖'
            },
            {
              area: 'Business Knowledge',
              improvement: courseAnalytics.improvementMetrics.businessKnowledge,
              icon: '💼'
            },
            {
              area: 'Marketplace Ministry',
              improvement: courseAnalytics.improvementMetrics.marketplaceMinistry,
              icon: '⛪'
            }
          ].map((metric, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {metric.icon}
              </div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2C3E50',
                marginBottom: '0.5rem'
              }}>
                {metric.area}
              </h4>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#22C55E',
                marginBottom: '0.25rem'
              }}>
                +{metric.improvement.toFixed(1)}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6C757D'
              }}>
                Average improvement
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStudentDetail = (student: StudentProgress) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2C3E50',
            margin: 0
          }}>
            {student.name}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6C757D',
            margin: '0.25rem 0 0 0'
          }}>
            {student.email} • {student.memberType}
          </p>
        </div>
        <button
          onClick={() => setSelectedStudent(null)}
          style={{
            backgroundColor: '#E5E7EB',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Student Progress Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          {
            label: 'Completion',
            value: `${student.completedModules}/${student.totalModules}`,
            subtitle: 'modules',
            color: '#5DADE2'
          },
          {
            label: 'Engagement',
            value: student.averageSessionRating.toFixed(1),
            subtitle: 'avg rating',
            color: '#F59E0B'
          },
          {
            label: 'Business Plan',
            value: `${student.businessPlanProgress}%`,
            subtitle: 'complete',
            color: '#8B5CF6'
          },
          {
            label: 'Improvement',
            value: student.postAssessmentScore ? 
              `+${(student.postAssessmentScore - student.preAssessmentScore).toFixed(1)}` : 'TBD',
            subtitle: 'points',
            color: '#22C55E'
          }
        ].map((metric, index) => (
          <div
            key={index}
            style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#F8F9FA',
              borderRadius: '8px'
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: metric.color,
              marginBottom: '0.25rem'
            }}>
              {metric.value}
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#2C3E50'
            }}>
              {metric.label}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6C757D'
            }}>
              {metric.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Session Completion History */}
      {student.sessionCompletion.length > 0 && (
        <div>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Recent Session Feedback
          </h4>
          
          {student.sessionCompletion.slice(0, 3).map((session, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2C3E50'
                }}>
                  Module {session.moduleId}, Session {session.sessionId}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6C757D'
                }}>
                  {new Date(session.completedAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>Comprehension</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: getProgressColor(session.surveyRating.comprehension) }}>
                    {session.surveyRating.comprehension}/5
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>Application</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: getProgressColor(session.surveyRating.application) }}>
                    {session.surveyRating.application}/5
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>Confidence</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: getProgressColor(session.surveyRating.confidence) }}>
                    {session.surveyRating.confidence}/5
                  </div>
                </div>
              </div>

              {session.comments.improvement && (
                <div style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #F59E0B',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  <strong>Improvement Suggestion:</strong> {session.comments.improvement}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

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
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              margin: 0
            }}>
              📊 Training Director Dashboard
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6C757D',
              margin: '0.25rem 0 0 0'
            }}>
              Monitor student progress and course effectiveness
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            <Link
              href="/dashboard"
              style={{
                color: '#6C757D',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              ← Back to Platform
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'students', label: 'Students', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'feedback', label: 'Feedback', icon: '💬' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 0',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: selectedView === tab.id ? '2px solid #5DADE2' : '2px solid transparent',
                color: selectedView === tab.id ? '#5DADE2' : '#6C757D',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {selectedView === 'overview' && renderOverview()}
        
        {selectedView === 'students' && (
          <div>
            {selectedStudent ? (
              renderStudentDetail(selectedStudent)
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2C3E50',
                  marginBottom: '1.5rem'
                }}>
                  All Students
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '1rem'
                }}>
                  {students.map((student) => (
                    <div
                      key={student.id}
                      style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#5DADE2'
                        e.currentTarget.style.backgroundColor = '#F8FAFC'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB'
                        e.currentTarget.style.backgroundColor = 'white'
                      }}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <h4 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#2C3E50',
                          margin: 0
                        }}>
                          {student.name}
                        </h4>
                        <span style={{
                          backgroundColor: getStatusColor(student.status),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {student.status}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6C757D',
                        marginBottom: '1rem'
                      }}>
                        {student.email}<br />
                        {student.memberType}
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>Progress</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2C3E50' }}>
                            {student.completedModules}/{student.totalModules} modules
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>Rating</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: getProgressColor(student.averageSessionRating) }}>
                            {student.averageSessionRating.toFixed(1)}/5 ⭐
                          </div>
                        </div>
                      </div>

                      {student.postAssessmentScore && (
                        <div style={{
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #22C55E',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: '#22C55E',
                          fontWeight: '500'
                        }}>
                          📈 Improved +{(student.postAssessmentScore - student.preAssessmentScore).toFixed(1)} points
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedView === 'analytics' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '1rem'
            }}>
              📈 Advanced Analytics
            </h3>
            <p style={{
              color: '#6C757D',
              fontSize: '0.875rem'
            }}>
              Detailed analytics and reporting features coming soon...
            </p>
          </div>
        )}

        {selectedView === 'feedback' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '1.5rem'
            }}>
              💬 Session Feedback Summary
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {courseAnalytics.sessionRatings.map((session, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#2C3E50',
                      margin: 0
                    }}>
                      Module {session.moduleId}, Session {session.sessionId}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: getProgressColor(session.averageRating)
                      }}>
                        {session.averageRating}/5 ⭐
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6C757D'
                      }}>
                        {session.completionCount} completions
                      </span>
                    </div>
                  </div>

                  {session.commonIssues.length > 0 && (
                    <div>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#2C3E50',
                        marginBottom: '0.5rem'
                      }}>
                        Common Improvement Areas:
                      </h5>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {session.commonIssues.map((issue, issueIndex) => (
                          <li
                            key={issueIndex}
                            style={{
                              fontSize: '0.875rem',
                              color: '#6C757D',
                              marginBottom: '0.25rem',
                              paddingLeft: '1rem',
                              position: 'relative'
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#F59E0B'
                            }}>
                              •
                            </span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}