'use client'

import Link from 'next/link'
import IBAMLogo from '@/components/IBAMLogo'

export default function PlanPage() {
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
              Business Planning Hub
            </h1>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <Link href="/business-planner" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>💼</div>
            <h3 style={{ color: '#2C3E50', textAlign: 'center', marginBottom: '8px' }}>Business Planner</h3>
            <p style={{ color: '#666', textAlign: 'center' }}>Create your comprehensive business plan</p>
          </Link>

          <Link href="/ai-coach" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '16px' }}>🤖</div>
            <h3 style={{ color: '#2C3E50', textAlign: 'center', marginBottom: '8px' }}>AI Coach</h3>
            <p style={{ color: '#666', textAlign: 'center' }}>Get personalized business guidance</p>
          </Link>
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
          { href: '/plan', icon: '📋', label: 'Plan', active: true },
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
    </div>
  )
}