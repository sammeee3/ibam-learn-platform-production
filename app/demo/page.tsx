'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SparklesIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  PaintBrushIcon,
  HandRaisedIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export default function DemoMenu() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const demos = [
    {
      id: 'grace-system',
      title: '🕊️ Grace-Based Action System',
      description: 'Complete implementation with 2x2 limits, Kingdom filter, and Sabbath releases',
      features: ['Martha/Mary Balance', 'Kingdom Purpose Filter', 'Grace-filled Language', 'Every 7th Session Rest'],
      icon: HandRaisedIcon,
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      status: 'READY',
      route: '/demo/grace-system'
    },
    {
      id: 'enhanced-template',
      title: '✨ Enhanced Session Template',
      description: 'Layered enhancements to existing design with celebrations',
      features: ['Quick Status Buttons', 'Learning Notes', 'Celebration Animations', 'Streak Tracking'],
      icon: SparklesIcon,
      color: 'linear-gradient(135deg, #10b981, #059669)',
      status: 'READY',
      route: '/demo/enhanced-template'
    },
    {
      id: 'commitment-flow',
      title: '🎯 Commitment Flow Demo',
      description: 'Complete action commitment cycle from start to finish',
      features: ['Previous Actions Review', 'Smart Action Builder', 'Impact Tracking', 'Accountability Partners'],
      icon: DocumentCheckIcon,
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      status: 'READY',
      route: '/demo/commitment-flow'
    },
    {
      id: 'simple-flow',
      title: '📋 Simple Action Flow',
      description: 'Simplified version without external dependencies',
      features: ['Looking Back Review', 'Looking Forward Planning', 'Basic Tracking', 'Mobile Responsive'],
      icon: ChartBarIcon,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      status: 'BUILD ERROR',
      route: '/demo/simple-flow'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Action System Demos
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
            Explore different implementations of the Looking Back & Looking Forward system
          </p>
          <div style={{ marginTop: '2rem', color: '#6b7280' }}>
            "Faith without works is dead, but works without faith is exhausting" - James 2:26 (paraphrased)
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {demos.map(demo => {
            const Icon = demo.icon;
            const isHovered = hoveredCard === demo.id;
            
            return (
              <div
                key={demo.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  cursor: demo.status === 'READY' ? 'pointer' : 'not-allowed',
                  opacity: demo.status === 'READY' ? 1 : 0.6
                }}
                onMouseEnter={() => setHoveredCard(demo.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => demo.status === 'READY' && router.push(demo.route)}
              >
                {/* Card Header with Gradient */}
                <div style={{
                  background: demo.color,
                  padding: '1.5rem',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Icon style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                    {demo.status !== 'READY' && (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {demo.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {demo.title}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {demo.description}
                  </p>
                  
                  {/* Features */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4b5563' }}>
                      Key Features:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {demo.features.map((feature, index) => (
                        <li key={index} style={{ 
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{ color: '#10b981' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {demo.status === 'READY' ? (
                    <button
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: isHovered ? demo.color : '#f3f4f6',
                        color: isHovered ? 'white' : '#4b5563',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Demo →
                    </button>
                  ) : (
                    <div style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      fontSize: '0.875rem'
                    }}>
                      ⚠️ Build error - Webpack module issue
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Implementation Notes */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FireIcon style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            Implementation Philosophy
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            color: '#4b5563'
          }}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🎯 Jesus First, Business Second</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Every action flows from Kingdom priorities. Business success is a byproduct of faithful obedience.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>💝 Grace Over Performance</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Celebrate attempts, learn from incompletions, release with grace after reasonable effort.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🌊 Flow Over Accumulation</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                Actions don't pile up. Each session is fresh mercies. Sabbath sessions release everything.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              Current Recommendation: Grace-Based Action System
            </p>
            <p style={{ fontSize: '0.875rem', color: '#78350f' }}>
              Best balance of simplicity, joy, and spiritual integration
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>
          <p style={{ fontSize: '0.875rem' }}>
            Built for IBAM Learning Platform | Integrating Faith & Business Excellence
          </p>
        </div>
      </div>
    </div>
  );
}