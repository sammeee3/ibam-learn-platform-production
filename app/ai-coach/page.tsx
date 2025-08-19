'use client'

import { useState } from 'react'
import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'

export default function AICoachPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: "Hello! I'm your IBAM AI Coach. I'm here to help you build a faith-driven business that honors God and serves others. What business challenge can I help you with today?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = [
    "How do I integrate biblical principles into my business?",
    "What are effective marketing strategies for faith-driven businesses?",
    "How can I use my business for discipleship?",
    "Help me create a mission statement that honors God",
    "What financial principles should guide my business?",
    "How do I balance profit with Faith-Driven impact?"
  ]

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        message: generateAIResponse(message),
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('biblical') || lowerMessage.includes('faith')) {
      return "Great question about integrating faith into business! Here are some key biblical principles: 1) Stewardship (Luke 16:10) - manage resources faithfully, 2) Integrity (Proverbs 11:1) - honest dealings in all transactions, 3) Service (Mark 10:43-44) - focus on serving others' needs, not just profit. Would you like me to elaborate on any of these principles?"
    }
    
    if (lowerMessage.includes('marketing') || lowerMessage.includes('promotion')) {
      return "Faith-driven marketing should focus on authentic service rather than manipulation. Consider: 1) Tell your authentic story and values, 2) Provide genuine value to your audience, 3) Use testimonials and word-of-mouth, 4) Partner with local churches and ministries, 5) Create content that educates and serves. What specific marketing challenge are you facing?"
    }
    
    if (lowerMessage.includes('discipleship') || lowerMessage.includes('ministry')) {
      return "Using business for discipleship is powerful! Consider: 1) Mentoring young entrepreneurs in biblical business principles, 2) Creating a workplace culture that reflects Christ, 3) Having intentional conversations about faith with customers/partners, 4) Hosting business networking events with spiritual focus, 5) Partnering with churches for financial literacy training. What aspect of marketplace ministry interests you most?"
    }
    
    if (lowerMessage.includes('mission') || lowerMessage.includes('purpose')) {
      return "A strong mission statement should reflect both your business purpose and Faith-Driven calling. Try this framework: 'We exist to [serve/solve what] for [target audience] by [your unique approach] so that [Faith-Driven impact].' For example: 'We exist to provide financial planning services for Christian families by integrating biblical wisdom so that they can be generous stewards who advance God's Faith-Driven.' What's your business focus?"
    }
    
    return "That's an excellent question about building a Faith-Driven-minded business! As your AI coach, I'd love to help you think through this biblically. Could you share more details about your specific situation or challenge? The more context you provide, the more targeted and helpful my guidance can be. Remember, God has equipped you for this calling!"
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" style={{
              color: '#4ECDC4',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ← Back to Dashboard
            </Link>
            <div style={{
              height: '24px',
              width: '1px',
              backgroundColor: '#e9ecef'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IBAMLogo size="small" />
              <h1 style={{
                color: '#2C3E50',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0
              }}>
                IBAM AI Coach
              </h1>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#28a745',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '14px',
              color: '#666'
            }}>
              Online
            </span>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '24px',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Sidebar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            color: '#2C3E50',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            🚀 Quick Start Questions
          </h3>
          
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e9ecef',
                backgroundColor: 'white',
                color: '#2C3E50',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                marginBottom: '8px',
                lineHeight: '1.4'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {question}
            </button>
          ))}

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #4ECDC4'
          }}>
            <h4 style={{
              color: '#2C3E50',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              💡 Coaching Focus Areas
            </h4>
            <ul style={{
              fontSize: '12px',
              color: '#666',
              margin: 0,
              paddingLeft: '16px'
            }}>
              <li>Biblical business principles</li>
              <li>Faith-Driven-minded strategies</li>
              <li>Faith integration</li>
              <li>Discipleship opportunities</li>
              <li>Ethical decision making</li>
            </ul>
          </div>
        </div>

        {/* Chat Interface */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '700px'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e9ecef',
            borderRadius: '12px 12px 0 0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#4ECDC4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{
                  color: '#2C3E50',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  IBAM AI Business Coach
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  margin: 0
                }}>
                  Your faith-driven business advisor
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: msg.sender === 'user' ? '#4ECDC4' : '#f8f9fa',
                  color: msg.sender === 'user' ? 'white' : '#2C3E50',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  AI Coach is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e9ecef',
            borderRadius: '0 0 12px 12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputMessage)
                  }
                }}
                placeholder="Ask about biblical business principles, marketing strategies, or any business challenge..."
                rows={2}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4ECDC4'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  backgroundColor: inputMessage.trim() && !isTyping ? '#4ECDC4' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                Send
              </button>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>
              💡 Pro tip: Be specific about your business situation for more targeted advice
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2C3E50',
        color: 'white',
        padding: '40px 24px',
        marginTop: '48px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <IBAMLogo size="large" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            IBAM Learning Platform
          </h3>
          <p style={{
            margin: '0 0 16px 0',
            opacity: 0.8
          }}>
            Designed to Thrive - Empowering Faith-Driven Entrepreneurs
          </p>
          <p style={{
            margin: 0,
            fontSize: '14px',
            opacity: 0.6
          }}>
            © 2025 IBAM. Building businesses that honor God and serve others.
          </p>
        </div>
      </footer>
    </div>
  )
}