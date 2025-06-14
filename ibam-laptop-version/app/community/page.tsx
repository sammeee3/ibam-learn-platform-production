// ==========================================
// 📁 app/community/page.tsx - Complete File
// ==========================================
'use client'

import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'

export default function CommunityPage() {
  const discussions = [
    {
      id: 1,
      title: "How do you integrate prayer into your daily business operations?",
      author: "Sarah M.",
      replies: 12,
      lastActivity: "2 hours ago",
      category: "Faith Integration"
    },
    {
      id: 2,
      title: "Seeking advice on ethical pricing strategies",
      author: "David L.",
      replies: 8,
      lastActivity: "4 hours ago",
      category: "Business Ethics"
    },
    {
      id: 3,
      title: "Success story: How my coffee shop became a discipleship hub",
      author: "Maria R.",
      replies: 24,
      lastActivity: "6 hours ago",
      category: "Success Stories"
    }
  ]

  const members = [
    { name: "Jeff S.", role: "Entrepreneur", specialty: "Digital Marketing" },
    { name: "Pastor Mike", role: "Church Leader", specialty: "Ministry Integration" },
    { name: "Lisa Chen", role: "Business Coach", specialty: "Financial Planning" },
    { name: "Carlos M.", role: "Entrepreneur", specialty: "Manufacturing" }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
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
                IBAM Community
              </h1>
            </div>
          </div>
          
          <button style={{
            backgroundColor: '#4ECDC4',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            💬 New Discussion
          </button>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '24px'
      }}>
        <div>
          <div style={{
            backgroundColor: 'linear-gradient(135deg, #2C3E50 0%, #4ECDC4 100%)',
            background: 'linear-gradient(135deg, #2C3E50 0%, #4ECDC4 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '12px',
              margin: 0
            }}>
              👥 Welcome to the IBAM Community
            </h2>
            <p style={{
              opacity: 0.9,
              margin: '12px 0 0 0'
            }}>
              Connect with fellow Faith-Driven entrepreneurs, share insights, and grow together in faith and business
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{
                color: '#2C3E50',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0
              }}>
                💬 Recent Discussions
              </h3>
            </div>

            {discussions.map((discussion, index) => (
              <div
                key={discussion.id}
                style={{
                  padding: '20px',
                  borderBottom: index < discussions.length - 1 ? '1px solid #f8f9fa' : 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    color: '#2C3E50',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {discussion.title}
                  </h4>
                  <span style={{
                    backgroundColor: '#4ECDC4',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}>
                    {discussion.category}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <span>by {discussion.author}</span>
                  <span>•</span>
                  <span>{discussion.replies} replies</span>
                  <span>•</span>
                  <span>{discussion.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#2C3E50',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              📊 Community Stats
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Total Members</span>
                <span style={{ color: '#2C3E50', fontWeight: 'bold' }}>1,247</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Active Today</span>
                <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>89</span>
              </div>
            </div>

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>New This Week</span>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>23</span>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #4ECDC4'
          }}>
            <h3 style={{
              color: '#2C3E50',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              🚀 Quick Actions
            </h3>
            
            <button style={{
              width: '100%',
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '8px'
            }}>
              💬 Start Discussion
            </button>
            
            <button style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#4ECDC4',
              border: '2px solid #4ECDC4',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              🙏 Prayer Request
            </button>
          </div>
        </div>
      </div>

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