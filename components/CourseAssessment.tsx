'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AssessmentData {
  userId: string
  courseId: string
  assessmentType: 'pre' | 'post'
  timestamp: string
  scores: {
    biblicalFoundation: number
    businessKnowledge: number
    marketplaceMinistry: number
    practicalSkills: number
    discipleshipReadiness: number
  }
  selfEvaluation: {
    confidence: number
    experience: number
    knowledge: number
    readiness: number
  }
  goals: string[]
  businessStatus: string
  comments: string
}

interface CourseAssessmentProps {
  type: 'pre' | 'post'
  onComplete: (data: AssessmentData) => void
  existingData?: AssessmentData
}

export default function CourseAssessment({ type, onComplete, existingData }: CourseAssessmentProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [responses, setResponses] = useState<{[key: string]: number}>({})
  const [selfEval, setSelfEval] = useState({
    confidence: 0,
    experience: 0,
    knowledge: 0,
    readiness: 0
  })
  const [businessStatus, setBusinessStatus] = useState('')
  const [comments, setComments] = useState('')

  const sections = [
    {
      id: 'biblical',
      title: 'Biblical Foundation Assessment',
      description: 'Evaluate your understanding of biblical business principles',
      icon: '📖'
    },
    {
      id: 'business',
      title: 'Business Knowledge Assessment', 
      description: 'Assess your practical business skills and experience',
      icon: '💼'
    },
    {
      id: 'ministry',
      title: 'Marketplace Ministry Assessment',
      description: 'Evaluate your readiness for Faith-Driven business impact',
      icon: '⛪'
    },
    {
      id: 'goals',
      title: 'Learning Goals & Business Status',
      description: 'Define your objectives and current situation',
      icon: '🎯'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your responses and complete the assessment',
      icon: '✅'
    }
  ]

  const biblicalQuestions = [
    {
      id: 'stewardship',
      question: 'How well do you understand the biblical concept of stewardship in business?',
      context: 'This measures your grasp of managing resources as God\'s steward'
    },
    {
      id: 'integrity',
      question: 'How confident are you in applying biblical integrity in business decisions?',
      context: 'This evaluates your commitment to honest, ethical business practices'
    },
    {
      id: 'purpose',
      question: 'How clearly do you see business as a platform for God\'s Faith-Driven?',
      context: 'This assesses your understanding of business as ministry'
    },
    {
      id: 'relationships',
      question: 'How well do you understand biblical principles for business relationships?',
      context: 'This measures your grasp of Christ-like business interactions'
    },
    {
      id: 'generosity',
      question: 'How confident are you in integrating biblical generosity into business?',
      context: 'This evaluates your readiness to use business for giving and blessing'
    }
  ]

  const businessQuestions = [
    {
      id: 'planning',
      question: 'How competent do you feel in creating a comprehensive business plan?',
      context: 'This measures your strategic planning and business development skills'
    },
    {
      id: 'marketing',
      question: 'How confident are you in marketing and reaching customers effectively?',
      context: 'This evaluates your customer acquisition and marketing abilities'
    },
    {
      id: 'finance',
      question: 'How well do you understand business finances and cash flow management?',
      context: 'This assesses your financial literacy and money management skills'
    },
    {
      id: 'operations',
      question: 'How capable are you of managing day-to-day business operations?',
      context: 'This measures your operational management and execution abilities'
    },
    {
      id: 'growth',
      question: 'How prepared are you to scale and grow a business sustainably?',
      context: 'This evaluates your understanding of business expansion and scaling'
    }
  ]

  const ministryQuestions = [
    {
      id: 'discipleship',
      question: 'How ready are you to use your business for making disciples?',
      context: 'This measures your preparation for discipleship through business'
    },
    {
      id: 'community',
      question: 'How confident are you in serving your community through business?',
      context: 'This evaluates your readiness for community impact and service'
    },
    {
      id: 'sharing',
      question: 'How prepared are you to share your faith naturally in business?',
      context: 'This assesses your evangelistic readiness in marketplace settings'
    },
    {
      id: 'mentoring',
      question: 'How ready are you to mentor other Christian entrepreneurs?',
      context: 'This measures your preparation for multiplication and coaching'
    },
    {
      id: 'impact',
      question: 'How clearly can you articulate your Faith-Driven business vision?',
      context: 'This evaluates your clarity on Faith-Driven impact through business'
    }
  ]

  const scaleOptions = [
    { value: 1, label: '1 - Not at all prepared/confident', color: '#DC2626' },
    { value: 2, label: '2 - Slightly prepared/confident', color: '#EA580C' },
    { value: 3, label: '3 - Moderately prepared/confident', color: '#F59E0B' },
    { value: 4, label: '4 - Very prepared/confident', color: '#65A30D' },
    { value: 5, label: '5 - Completely prepared/confident', color: '#16A34A' }
  ]

  const handleResponseChange = (questionId: string, score: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: score
    }))
  }

  const handleSelfEvalChange = (field: string, value: number) => {
    setSelfEval(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateSectionScore = (questions: any[], prefix: string) => {
    let total = 0
    let count = 0
    questions.forEach(q => {
      const score = responses[`${prefix}-${q.id}`]
      if (score) {
        total += score
        count++
      }
    })
    return count > 0 ? Math.round(total / count) : 0
  }

  const handleSubmit = () => {
    const finalData: AssessmentData = {
      userId: 'current-user-id',
      courseId: 'ibam-business-course',
      assessmentType: type,
      timestamp: new Date().toISOString(),
      scores: {
        biblicalFoundation: calculateSectionScore(biblicalQuestions, 'biblical'),
        businessKnowledge: calculateSectionScore(businessQuestions, 'business'),
        marketplaceMinistry: calculateSectionScore(ministryQuestions, 'ministry'),
        practicalSkills: Math.round((selfEval.confidence + selfEval.experience + selfEval.knowledge + selfEval.readiness) / 4),
        discipleshipReadiness: Math.round((selfEval.confidence + selfEval.readiness) / 2)
      },
      selfEvaluation: selfEval,
      goals: [],
      businessStatus,
      comments
    }

    onComplete(finalData)
  }

  const renderQuestionSection = (questions: any[], sectionKey: string, title: string) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '1rem'
      }}>
        {title}
      </h3>

      {type === 'post' && existingData && (
        <div style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #5DADE2',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '0.5rem'
          }}>
            📊 Your Pre-Course Score: {existingData.scores[sectionKey as keyof typeof existingData.scores]}/5
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: '#6C757D',
            margin: 0
          }}>
            Rate your current ability honestly to see your growth through the course.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {questions.map((question, index) => (
          <div key={question.id} style={{
            padding: '1.5rem',
            backgroundColor: '#F8F9FA',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2C3E50',
              marginBottom: '0.5rem'
            }}>
              {question.question}
            </h5>
            <p style={{
              fontSize: '0.875rem',
              color: '#6C757D',
              marginBottom: '1rem',
              fontStyle: 'italic'
            }}>
              {question.context}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.5rem'
            }}>
              {scaleOptions.map((option) => {
                const responseKey = `${sectionKey}-${question.id}`
                const isSelected = responses[responseKey] === option.value
                
                return (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: isSelected ? `${option.color}15` : 'white',
                      border: `2px solid ${isSelected ? option.color : '#E5E7EB'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#F3F4F6'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'white'
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={responseKey}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleResponseChange(responseKey, option.value)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ color: option.color }}>{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGoalsSection = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '2rem'
      }}>
        Learning Goals & Business Status
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Business Status */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Current Business Status
          </label>
          <select
            value={businessStatus}
            onChange={(e) => setBusinessStatus(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 1rem',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select your current status...</option>
            <option value="idea">I have a business idea but haven't started</option>
            <option value="planning">I'm currently planning my business</option>
            <option value="startup">I recently started my business (0-2 years)</option>
            <option value="established">I have an established business (2+ years)</option>
            <option value="scaling">I'm looking to scale/grow my existing business</option>
            <option value="ministry">I want to integrate ministry into my business</option>
            <option value="other">Other situation</option>
          </select>
        </div>

        {/* Self-Evaluation Sliders */}
        <div>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Self-Evaluation (Rate yourself honestly)
          </h4>
          
          {[
            { key: 'confidence', label: 'Overall confidence in starting/running a business' },
            { key: 'experience', label: 'Practical business experience level' },
            { key: 'knowledge', label: 'Biblical business principles knowledge' },
            { key: 'readiness', label: 'Readiness to use business for Faith-Driven impact' }
          ].map((item) => (
            <div key={item.key} style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {item.label}
                </label>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2C3E50'
                }}>
                  {selfEval[item.key as keyof typeof selfEval]}/5
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={selfEval[item.key as keyof typeof selfEval]}
                onChange={(e) => handleSelfEvalChange(item.key, parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: '#E5E7EB',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.25rem',
                fontSize: '0.75rem',
                color: '#6C757D'
              }}>
                <span>Beginner</span>
                <span>Advanced</span>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Goals */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            What are your top 3 goals for this course? (Optional but helpful)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Example: Learn to create a biblical business plan, understand marketing strategies, integrate faith into daily business operations..."
            rows={4}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderReviewSection = () => {
    const biblicalScore = calculateSectionScore(biblicalQuestions, 'biblical')
    const businessScore = calculateSectionScore(businessQuestions, 'business')
    const ministryScore = calculateSectionScore(ministryQuestions, 'ministry')
    const skillsScore = Math.round((selfEval.confidence + selfEval.experience + selfEval.knowledge + selfEval.readiness) / 4)
    const discipleshipScore = Math.round((selfEval.confidence + selfEval.readiness) / 2)
    
    const averageScore = (biblicalScore + businessScore + ministryScore + skillsScore + discipleshipScore) / 5

    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2C3E50',
          marginBottom: '2rem'
        }}>
          Assessment Review
        </h3>

        {/* Score Summary */}
        <div style={{
          backgroundColor: '#F0F9FF',
          border: '1px solid #5DADE2',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: '1rem'
          }}>
            Your {type === 'pre' ? 'Baseline' : 'Final'} Assessment Scores
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { key: 'biblical', label: 'Biblical Foundation', score: biblicalScore },
              { key: 'business', label: 'Business Knowledge', score: businessScore },
              { key: 'ministry', label: 'Marketplace Ministry', score: ministryScore },
              { key: 'skills', label: 'Practical Skills', score: skillsScore },
              { key: 'discipleship', label: 'Discipleship Readiness', score: discipleshipScore }
            ].map((area) => (
              <div key={area.key} style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '6px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#5DADE2',
                  marginBottom: '0.5rem'
                }}>
                  {area.score}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6C757D'
                }}>
                  {area.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #E5E7EB'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '0.5rem'
            }}>
              {averageScore.toFixed(1)}/5
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#6C757D'
            }}>
              Overall {type === 'pre' ? 'Baseline' : 'Final'} Score
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            backgroundColor: '#5DADE2',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3498DB'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5DADE2'}
        >
          {type === 'pre' ? 'Complete Pre-Course Assessment & Start Learning' : 'Complete Post-Course Assessment'}
        </button>
      </div>
    )
  }

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
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              margin: 0
            }}>
              {type === 'pre' ? '📋 Pre-Course Assessment' : '🎯 Post-Course Assessment'}
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6C757D',
              margin: '0.25rem 0 0 0'
            }}>
              {type === 'pre' 
                ? 'Help us understand your baseline to personalize your learning journey'
                : 'Measure your growth and transformation through IBAM training'
              }
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#5DADE2',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Step {currentSection + 1} of {sections.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          maxWidth: '800px',
          margin: '1rem auto 0',
          backgroundColor: '#E5E7EB',
          borderRadius: '8px',
          height: '8px'
        }}>
          <div style={{
            backgroundColor: '#5DADE2',
            height: '100%',
            borderRadius: '8px',
            width: `${((currentSection + 1) / sections.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Section Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: currentSection === index ? '#5DADE2' : '#F8F9FA',
                color: currentSection === index ? 'white' : '#6C757D',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>{section.icon}</span>
              <span style={{ display: 'none' }}>{section.title}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        {currentSection === 0 && renderQuestionSection(biblicalQuestions, 'biblical', 'Biblical Foundation Assessment')}
        {currentSection === 1 && renderQuestionSection(businessQuestions, 'business', 'Business Knowledge Assessment')}
        {currentSection === 2 && renderQuestionSection(ministryQuestions, 'ministry', 'Marketplace Ministry Assessment')}
        {currentSection === 3 && renderGoalsSection()}
        {currentSection === 4 && renderReviewSection()}

        {/* Navigation */}
        {currentSection < sections.length - 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              style={{
                backgroundColor: currentSection === 0 ? '#E5E7EB' : 'transparent',
                color: currentSection === 0 ? '#9CA3AF' : '#6C757D',
                border: currentSection === 0 ? 'none' : '2px solid #E5E7EB',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: currentSection === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Previous
            </button>

            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
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
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}