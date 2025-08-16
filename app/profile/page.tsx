'use client'

import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'

export default function ProfilePage() {
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
              Your Profile
            </h1>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#4ECDC4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 auto 16px'
          }}>
            JS
          </div>
          <h2 style={{ color: '#2C3E50', marginBottom: '8px' }}>Jeff Samuelson</h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>Faith-Driven Entrepreneur</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: '18px' }}>7</div>
              <div style={{ color: '#666' }}>Day Streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: '18px' }}>2/5</div>
              <div style={{ color: '#666' }}>Modules</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ECDC4', fontWeight: 'bold', fontSize: '18px' }}>4.2</div>
              <div style={{ color: '#666' }}>Avg Rating</div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <Link href="/assessment/pre" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
            <div style={{ color: '#2C3E50', fontWeight: '600' }}>Take Assessment</div>
          </Link>

          <button style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ color: '#2C3E50', fontWeight: '600' }}>Settings</div>
          </button>

          <button style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📤</div>
            <div style={{ color: '#2C3E50', fontWeight: '600' }}>Export Data</div>
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#2C3E50', marginBottom: '16px' }}>Account Information</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', marginBottom: '4px' }}>Email</label>
              <input type="email" value="jeff@ibam.org" disabled style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box'
              }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', marginBottom: '4px' }}>Phone</label>
              <input type="tel" placeholder="(555) 123-4567" style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }} />
            </div>
            <button style={{
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              justifySelf: 'start'
            }}>
              Update Profile
            </button>
          </div>
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
          { href: '/learn', icon: '📚', label: 'Learn' },
          { href: '/plan', icon: '📋', label: 'Plan' },
          { href: '/community', icon: '👥', label: 'Community' },
          { href: '/profile', icon: '👤', label: 'Profile', active: true }
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
    </div>
  )
}