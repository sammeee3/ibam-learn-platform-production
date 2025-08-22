'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)' 
    }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            paddingBottom: '2rem',
            paddingTop: '1.5rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}>
            {/* Header with Logo */}
            <header style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* IBAM Logo */}
                  <div style={{ height: '48px', width: '48px' }}>
                    <img
                      src="/images/branding/mini-logo.png"
                      alt="IBAM - International Business As Mission"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain"
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes("mini-logo.png")) {
                          target.src = "/images/branding/ibam-logo.png";
                        } else if (target.src.includes("ibam-logo.png")) {
                          target.src = "/images/branding/ibam-logo-copy.jpg";
                        } else {
                          target.style.display = "none";
                          target.parentElement!.innerHTML = `<div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;">IBAM</div>`;
                        }
                      }}
                    />                  </div>
                  {/* Text Logo */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.5rem', 
                      color: 'white' 
                    }}>
                      IBAM
                    </div>
                    <div style={{ 
                      fontWeight: '500', 
                      letterSpacing: '0.1em', 
                      fontSize: '0.875rem', 
                      opacity: 0.8,
                      color: '#5DADE2'
                    }}>
                      DESIGNED TO THRIVE
                    </div>
                  </div>
                </div>
              </div>
            </header>
            
            <main style={{ 
              marginTop: '2.5rem', 
              maxWidth: '1280px', 
              margin: '2.5rem auto 0',
              padding: '0 1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '1.5rem',
                  lineHeight: '1.1'
                }}>
                  <span>Empower.</span>{' '}
                  <span style={{ color: '#5DADE2' }}>Educate.</span>{' '}
                  <span>Equip.</span>
                </h1>
                <p style={{
                  marginTop: '1rem',
                  fontSize: '1.25rem',
                  color: '#d1d5db',
                  maxWidth: '42rem',
                  margin: '1rem auto'
                }}>
                  Transform your business into a vessel for Faith-Driven impact. Join thousands of entrepreneurs learning to thrive through biblical business principles.
                </p>
                <div style={{ 
                  marginTop: '2rem', 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <Link 
                    href="/auth/signup"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#5DADE2',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4A90D9';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#5DADE2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="/auth/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#5DADE2',
                      backgroundColor: 'transparent',
                      border: '2px solid #5DADE2',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(93, 173, 226, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Three Fish Mission Section */}
      <div style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#5DADE2',
              marginBottom: '0.5rem'
            }}>
              The IBAM Mission
            </h2>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: '800',
              color: '#2C3E50',
              marginBottom: '1rem'
            }}>
              Three Fish Approach
            </p>
            <p style={{
              marginTop: '1rem',
              maxWidth: '42rem',
              fontSize: '1.25rem',
              color: '#6b7280',
              margin: '1rem auto'
            }}>
              Our mission is inspired by the three fish metaphor, reflecting our core functions.
            </p>
          </div>

          <div style={{
            marginTop: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                backgroundColor: '#5DADE2',
                margin: '0 auto 1rem'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 style={{ 
                marginTop: '1rem', 
                fontSize: '1.125rem', 
                fontWeight: '500', 
                color: '#2C3E50' 
              }}>Give a Fish</h3>
              <p style={{ 
                marginTop: '0.5rem', 
                fontSize: '1rem', 
                color: '#6b7280' 
              }}>
                Provide start-up loans to kickstart your business journey with Faith-Driven principles.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                backgroundColor: '#5DADE2',
                margin: '0 auto 1rem'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{ 
                marginTop: '1rem', 
                fontSize: '1.125rem', 
                fontWeight: '500', 
                color: '#2C3E50' 
              }}>Teach to Fish</h3>
              <p style={{ 
                marginTop: '0.5rem', 
                fontSize: '1rem', 
                color: '#6b7280' 
              }}>
                Offer comprehensive entrepreneur training for sustainable business development.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                backgroundColor: '#5DADE2',
                margin: '0 auto 1rem'
              }}>
                <svg style={{ height: '2rem', width: '2rem', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0 0 18.05 7h-.22c-.8 0-1.54.5-1.85 1.26l-1.99 5.99A1.991 1.991 0 0 0 16 17v5h4z"/>
                </svg>
              </div>
              <h3 style={{ 
                marginTop: '1rem', 
                fontSize: '1.125rem', 
                fontWeight: '500', 
                color: '#2C3E50' 
              }}>Equip for Discipleship</h3>
              <p style={{ 
                marginTop: '0.5rem', 
                fontSize: '1rem', 
                color: '#6b7280' 
              }}>
                Encourage discipleship multiplication to maximize Faith-Driven impact through business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}