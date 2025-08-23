'use client'

import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'
import SafeFeedbackWidget from '../components/feedback/SafeFeedbackWidget'

export default function LearnPage() {
  const modules = [
    { id: 1, title: "Biblical Business Foundations", sessions: 5, progress: 100 },
    { id: 2, title: "Planning Your Faith-Driven Business", sessions: 4, progress: 75 },
    { id: 3, title: "Marketing with Faith-Driven Values", sessions: 6, progress: 50 },
    { id: 4, title: "Financial Stewardship", sessions: 4, progress: 0 },
    { id: 5, title: "Operations & Leadership", sessions: 5, progress: 0 }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IBAMLogo size="small" />
            <h1 style={{
              color: '#2C3E50',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0
            }}>
              IBAM Learning Center
            </h1>
          </div>
          <Link href="/assessment/pre" style={{
            backgroundColor: '#4ECDC4',
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            📋 Take Assessment
          </Link>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {modules.map((module) => (
            <div key={module.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: '#2C3E50',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Module {module.id}: {module.title}
                </h3>
                <p style={{
                  color: '#666',
                  marginBottom: '12px'
                }}>
                  {module.sessions} sessions • {module.progress}% complete
                </p>
                <div style={{
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  height: '8px',
                  width: '200px'
                }}>
                  <div style={{
                    backgroundColor: '#4ECDC4',
                    height: '100%',
                    borderRadius: '4px',
                    width: `${module.progress}%`
                  }} />
                </div>
              </div>
              <Link
                href={`/modules/${module.id}/sessions/1`}
                style={{
                  backgroundColor: module.progress > 0 ? '#4ECDC4' : '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {module.progress > 0 ? 'Continue' : 'Start'}
              </Link>
            </div>
          ))}
        </div>
      </main>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e9ecef',
        padding: '12px 0',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Home' },
          { href: '/learn', icon: '📚', label: 'Learn', active: true },
          { href: '/plan', icon: '📋', label: 'Plan' },
          { href: '/community', icon: '👥', label: 'Community' },
          { href: '/profile', icon: '👤', label: 'Profile' }
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: item.active ? '#4ECDC4' : '#666',
            fontSize: '12px'
          }}>
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <SafeFeedbackWidget />
    </div>
  )
}