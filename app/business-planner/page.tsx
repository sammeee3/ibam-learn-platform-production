'use client'

import { useState } from 'react'
import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'

export default function BusinessPlannerPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [planData, setPlanData] = useState({
    businessName: '',
    mission: '',
    vision: '',
    values: '',
    targetMarket: '',
    products: '',
    marketing: '',
    financials: '',
    operations: '',
    faithDriven: ''
  })

  const sections = [
    { id: 'overview', title: 'Business Overview', icon: '📋' },
    { id: 'mission', title: 'Mission & Vision', icon: '🎯' },
    { id: 'market', title: 'Target Market', icon: '👥' },
    { id: 'products', title: 'Products/Services', icon: '📦' },
    { id: 'marketing', title: 'Marketing Strategy', icon: '📢' },
    { id: 'operations', title: 'Operations Plan', icon: '⚙️' },
    { id: 'financials', title: 'Financial Projections', icon: '💰' },
    { id: 'Faith-Driven', title: 'Faith-Driven Impact', icon: '👑' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setPlanData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <h2 style={{ color: '#2C3E50', fontSize: '24px', marginBottom: '16px' }}>
              📋 Business Overview
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Start with the basics of your faith-driven business concept.
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#2C3E50',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Business Name
              </label>
              <input
                type="text"
                value={planData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#2C3E50', marginBottom: '12px' }}>
                💡 Biblical Business Principles
              </h3>
              <ul style={{ color: '#666', paddingLeft: '20px' }}>
                <li>Stewardship - Managing resources faithfully</li>
                <li>Integrity - Honest in all dealings</li>
                <li>Service - Meeting genuine needs</li>
                <li>Excellence - Doing work as unto the Lord</li>
                <li>Generosity - Blessing others through success</li>
              </ul>
            </div>
          </div>
        )

      case 'mission':
        return (
          <div>
            <h2 style={{ color: '#2C3E50', fontSize: '24px', marginBottom: '16px' }}>
              🎯 Mission & Vision
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Define your God-given purpose and the impact you want to make.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#2C3E50',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Mission Statement
              </label>
              <textarea
                value={planData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                placeholder="Why does your business exist? How do you serve others and honor God?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#2C3E50',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Vision Statement
              </label>
              <textarea
                value={planData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                placeholder="What future impact do you envision? How will the world be different?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#2C3E50',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Core Values
              </label>
              <textarea
                value={planData.values}
                onChange={(e) => handleInputChange('values', e.target.value)}
                placeholder="What biblical values guide your business decisions?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )

      case 'Faith-Driven':
        return (
          <div>
            <h2 style={{ color: '#2C3E50', fontSize: '24px', marginBottom: '16px' }}>
              👑 Faith-Driven Impact Plan
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              How will your business advance God's Faith-Driven and make disciples?
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#2C3E50',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Discipleship Strategy
              </label>
              <textarea
                value={planData.Faith-Driven}
                onChange={(e) => handleInputChange('Faith-Driven', e.target.value)}
                placeholder="How will you use your business to make disciples? What opportunities for spiritual conversations and mentoring will you create?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #4ECDC4'
            }}>
              <h3 style={{ color: '#2C3E50', marginBottom: '12px' }}>
                🌟 Faith-Driven Business Opportunities
              </h3>
              <ul style={{ color: '#666', paddingLeft: '20px', margin: 0 }}>
                <li>Mentor young entrepreneurs in biblical business</li>
                <li>Partner with churches for financial literacy training</li>
                <li>Create jobs for people needing second chances</li>
                <li>Donate percentage of profits to Faith-Driven causes</li>
                <li>Host business networking events with spiritual focus</li>
                <li>Integrate prayer and biblical wisdom into operations</li>
              </ul>
            </div>
          </div>
        )

      default:
        return (
          <div style={{
            textAlign: 'center',
            padding: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <h3 style={{ color: '#2C3E50', marginBottom: '8px' }}>
              Section Coming Soon
            </h3>
            <p style={{ color: '#666' }}>
              This section is under development. Check back soon!
            </p>
          </div>
        )
    }
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
                IBAM Business Planner
              </h1>
            </div>
          </div>
          
          <button
            style={{
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            💾 Save Plan
          </button>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '24px'
      }}>
        {/* Sidebar Navigation */}
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
            📋 Plan Sections
          </h3>
          
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                border: 'none',
                backgroundColor: activeSection === section.id ? '#4ECDC4' : 'transparent',
                color: activeSection === section.id ? 'white' : '#2C3E50',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                textAlign: 'left'
              }}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h4 style={{
              color: '#2C3E50',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              📈 Progress
            </h4>
            <div style={{
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              height: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                backgroundColor: '#4ECDC4',
                height: '100%',
                borderRadius: '4px',
                width: '25%'
              }} />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#666',
              margin: 0
            }}>
              2 of 8 sections completed
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          minHeight: '600px'
        }}>
          {renderSection()}
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