'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SessionData {
  id: number;
  title: string;
  subtitle?: string;
  module_id: number;
  session_number: number;
  estimated_time?: string;
  transformation_promise?: string;
  scripture?: {
    reference?: string;
    text?: string;
  };
  hook?: string;
  video_url?: string;
  content?: {
    text?: string;
  };
  fast_track_summary?: string;
  mobile_transformation?: {
    powerInsight?: string;
    identityShift?: string;
  };
  reflection?: string;
  becoming_gods_entrepreneur?: {
    content?: string;
    questions?: string[];
  };
  case_study?: string;
  faq_questions?: string[];
  business_plan_questions?: string[];
  extra_materials?: string;
  engagement_mechanics?: {
    challenge?: string;
    community?: string;
  };
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'reflection' | 'action'>('content');

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/sessions/${sessionId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to load session`);
        }
        
        const data = await response.json();
        console.log('✅ Session loaded:', data);
        setSession(data);
        
      } catch (err: any) {
        console.error('❌ Session load error:', err);
        setError(err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Safe data getters with fallbacks
  const getScripture = () => {
    try {
      if (typeof session?.scripture === 'string') {
        return JSON.parse(session.scripture);
      }
      return session?.scripture || {};
    } catch {
      return {};
    }
  };

  const getMobileTransformation = () => {
    try {
      if (typeof session?.mobile_transformation === 'string') {
        return JSON.parse(session.mobile_transformation);
      }
      return session?.mobile_transformation || {};
    } catch {
      return {};
    }
  };

  const getBecomingGodsEntrepreneur = () => {
    try {
      if (typeof session?.becoming_gods_entrepreneur === 'string') {
        return JSON.parse(session.becoming_gods_entrepreneur);
      }
      return session?.becoming_gods_entrepreneur || {};
    } catch {
      return {};
    }
  };

  const getEngagementMechanics = () => {
    try {
      if (typeof session?.engagement_mechanics === 'string') {
        return JSON.parse(session.engagement_mechanics);
      }
      return session?.engagement_mechanics || {};
    } catch {
      return {};
    }
  };

  const getContent = () => {
    try {
      if (typeof session?.content === 'string') {
        return JSON.parse(session.content);
      }
      return session?.content || {};
    } catch {
      return {};
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Session {sessionId}</h2>
          <p className="text-gray-600">Fetching your learning content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Session Load Error</h2>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">Error Details:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              🔄 Try Again
            </button>
            <button 
              onClick={() => router.push('/modules')}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              ← Back to Modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scripture = getScripture();
  const mobileTransform = getMobileTransformation();
  const entrepreneur = getBecomingGodsEntrepreneur();
  const engagement = getEngagementMechanics();
  const content = getContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
                >
                  🏠 Dashboard
                </button>
                <button 
                  onClick={() => router.push('/modules')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
                >
                  📚 All Modules
                </button>
              </div>
              
              <div className="mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  Module {moduleId} • Session {session?.session_number || sessionId}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {session?.title || 'Session Title'}
              </h1>
              
              {session?.subtitle && (
                <p className="text-teal-100 text-lg sm:text-xl mb-4 max-w-3xl">
                  {session.subtitle}
                </p>
              )}
              
              {session?.estimated_time && (
                <div className="flex items-center gap-2 text-teal-100">
                  <span>⏱️</span>
                  <span>Estimated time: {session.estimated_time}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-2xl font-bold mb-1">Session {session?.session_number || sessionId}</div>
                <div className="text-teal-100 text-sm">of Module {moduleId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:hidden">
        <div className="flex">
          {[
            { key: 'content', label: 'Content', icon: '📖' },
            { key: 'reflection', label: 'Reflect', icon: '💭' },
            { key: 'action', label: 'Action', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="text-lg mb-1">{tab.icon}</div>
              <div className="text-sm">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Main Content - Desktop Always Visible, Mobile Conditional */}
          <div className={`lg:col-span-8 space-y-8 ${activeTab === 'content' ? 'block' : 'hidden'} lg:block`}>
            
            {/* Transformation Promise */}
            {session?.transformation_promise && (
              <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Transformation Promise
                </h2>
                <p className="text-amber-800 text-lg leading-relaxed font-medium">
                  {session.transformation_promise}
                </p>
              </section>
            )}

            {/* Scripture Foundation */}
            {(scripture.reference || scripture.text) && (
              <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">📖</span>
                  Biblical Foundation
                </h2>
                <div className="bg-white rounded-xl p-6 border border-blue-100">
                  {scripture.reference && (
                    <div className="font-bold text-blue-600 text-lg mb-3">
                      {scripture.reference} (ESV)
                    </div>
                  )}
                  {scripture.text && (
                    <blockquote className="text-gray-700 text-lg leading-relaxed italic">
                      "{scripture.text}"
                    </blockquote>
                  )}
                </div>
              </section>
            )}

            {/* Hook Story */}
            {session?.hook && (
              <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  Opening Story
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{session.hook}</p>
                </div>
              </section>
            )}

            {/* Fast Track Summary */}
            {session?.fast_track_summary && (
              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  Quick Summary
                </h2>
                <div className="bg-white rounded-xl p-6 border border-green-100">
                  <p className="text-green-800 text-lg leading-relaxed font-medium">
                    {session.fast_track_summary}
                  </p>
                </div>
              </section>
            )}

            {/* Main Content Text */}
            {content.text && (
              <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Main Content
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{content.text}</p>
                </div>
              </section>
            )}

            {/* Mobile Transformation Insights */}
            {(mobileTransform.powerInsight || mobileTransform.identityShift) && (
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">💡</span>
                  Key Insights
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {mobileTransform.powerInsight && (
                    <div className="bg-white rounded-xl p-6 border border-purple-100">
                      <h3 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        Power Insight
                      </h3>
                      <p className="text-purple-800 font-medium">{mobileTransform.powerInsight}</p>
                    </div>
                  )}
                  {mobileTransform.identityShift && (
                    <div className="bg-white rounded-xl p-6 border border-purple-100">
                      <h3 className="font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <span className="text-xl">🔄</span>
                        Identity Shift
                      </h3>
                      <p className="text-purple-800 font-medium">{mobileTransform.identityShift}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Case Study */}
            {session?.case_study && (
              <section className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-teal-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Real-World Case Study
                </h2>
                <div className="bg-white rounded-xl p-6 border border-teal-100">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-teal-800 leading-relaxed">{session.case_study}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Becoming God's Entrepreneur */}
            {entrepreneur.content && (
              <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">👑</span>
                  Becoming God's Entrepreneur
                </h2>
                <div className="bg-white rounded-xl p-6 border border-orange-100">
                  <p className="text-orange-800 text-lg leading-relaxed mb-6">{entrepreneur.content}</p>
                  
                  {entrepreneur.questions && entrepreneur.questions.length > 0 && (
                    <div>
                      <h3 className="font-bold text-orange-700 mb-4 flex items-center gap-2">
                        <span className="text-xl">💭</span>
                        Reflection Questions
                      </h3>
                      <div className="space-y-3">
                        {entrepreneur.questions.map((question: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                            <span className="font-bold text-orange-600 text-lg mt-1">{index + 1}.</span>
                            <p className="text-orange-800 leading-relaxed">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Desktop Always Visible, Mobile Conditional */}
          <div className={`lg:col-span-4 space-y-6 ${activeTab === 'reflection' ? 'block' : 'hidden'} lg:block`}>
            
            {/* Reflection */}
            {session?.reflection && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🤔</span>
                  Personal Reflection
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-blue-800 font-medium leading-relaxed">{session.reflection}</p>
                </div>
                <textarea
                  className="w-full mt-4 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                  placeholder="Write your personal reflection here..."
                />
              </div>
            )}

            {/* Engagement Challenge */}
            {(engagement.challenge || engagement.community) && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Action Steps
                </h3>
                {engagement.challenge && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <span>🎯</span>
                      This Week's Challenge
                    </h4>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-red-800 text-sm leading-relaxed">{engagement.challenge}</p>
                    </div>
                  </div>
                )}
                {engagement.community && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <span>👥</span>
                      Community Discussion
                    </h4>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-blue-800 text-sm leading-relaxed">{engagement.community}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FAQ */}
            {session?.faq_questions && session.faq_questions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">❓</span>
                  FAQ
                </h3>
                <div className="space-y-4">
                  {session.faq_questions.map((faq: string, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 text-sm leading-relaxed">{faq}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Plan Questions */}
            {session?.business_plan_questions && session.business_plan_questions.length > 0 && (
              <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${activeTab === 'action' ? 'block' : 'hidden'} lg:block`}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Business Plan Integration
                </h3>
                <div className="space-y-4">
                  {session.business_plan_questions.map((question: string, index: number) => (
                    <div key={index}>
                      <label className="block text-gray-700 font-medium mb-2">
                        {index + 1}. {question}
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={3}
                        placeholder="Your response will be integrated into your business plan..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Materials */}
            {session?.extra_materials && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📎</span>
                  Extra Materials
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed">{session.extra_materials}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  🏠 Dashboard
                </button>
                <button 
                  onClick={() => router.push('/modules')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  📚 All Modules
                </button>
                <button 
                  onClick={() => router.push(`/modules/${moduleId}`)}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  📖 Module {moduleId}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section (if video exists) */}
      {session?.video_url && !session.video_url.includes('PLACEHOLDER') && (
        <div className="bg-gray-900 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              📺 Training Video
            </h2>
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  src={session.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={`${session.title} - Training Video`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">IBAM - International Business as Mission</h3>
            <p className="text-gray-300 text-lg mb-4">
              Equipping entrepreneurs to transform communities through faith-driven business
            </p>
            <p className="text-teal-400 font-semibold text-lg">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}