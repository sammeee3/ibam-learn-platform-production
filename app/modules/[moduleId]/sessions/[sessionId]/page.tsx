'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface SessionData {
  id: number;
  title: string;
  subtitle?: string;
  session_number: number;
  transformation_promise?: string;
  hook?: string;
  fast_track_summary?: string;
  mobile_transformation?: any;
  reflection?: string;
  case_study?: string;
  becoming_gods_entrepreneur?: any;
  faq_questions?: string[];
  business_plan_questions?: string[];
  engagement_mechanics?: any;
}

export default function SessionPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  
  const moduleId = params?.moduleId as string || '';
  const sessionId = params?.sessionId as string || '';

  useEffect(() => {
    if (sessionId) {
      fetchSession(sessionId);
    }
  }, [sessionId]);

  const fetchSession = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sessions/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Session data:', data);
      setSession(data);
    } catch (err: any) {
      console.error('Error fetching session:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Safe data extraction with fallbacks
  const getSessionTitle = () => {
    return session?.title || 'Session Title Loading...';
  };

  const getSessionSubtitle = () => {
    return session?.subtitle || '';
  };

  const getTransformationPromise = () => {
    return session?.transformation_promise || '';
  };

  const getHook = () => {
    return session?.hook || '';
  };

  const getFastTrackSummary = () => {
    return session?.fast_track_summary || '';
  };

  const getMobileTransformation = () => {
    try {
      const mobile = session?.mobile_transformation;
      if (typeof mobile === 'string') {
        return JSON.parse(mobile);
      }
      return mobile || { powerInsight: '', identityShift: '' };
    } catch {
      return { powerInsight: '', identityShift: '' };
    }
  };

  const getReflection = () => {
    return session?.reflection || '';
  };

  const getCaseStudy = () => {
    return session?.case_study || '';
  };

  const getBecomingGodsEntrepreneur = () => {
    try {
      const entrepreneur = session?.becoming_gods_entrepreneur;
      if (typeof entrepreneur === 'string') {
        return JSON.parse(entrepreneur);
      }
      return entrepreneur || { content: '', questions: [] };
    } catch {
      return { content: '', questions: [] };
    }
  };

  const getFAQQuestions = () => {
    return session?.faq_questions || [];
  };

  const getBusinessPlanQuestions = () => {
    return session?.business_plan_questions || [];
  };

  const getEngagementMechanics = () => {
    try {
      const engagement = session?.engagement_mechanics;
      if (typeof engagement === 'string') {
        return JSON.parse(engagement);
      }
      return engagement || { challenge: '', community: '' };
    } catch {
      return { challenge: '', community: '' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-xl font-bold text-red-800 mb-4">Error Loading Session</h1>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => fetchSession(sessionId)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mobileTransform = getMobileTransformation();
  const entrepreneur = getBecomingGodsEntrepreneur();
  const engagement = getEngagementMechanics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{getSessionTitle()}</h1>
              {getSessionSubtitle() && (
                <p className="text-teal-100 text-lg">{getSessionSubtitle()}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-teal-100">Module {moduleId}</p>
              <p className="text-sm text-teal-200">Session {session?.session_number || sessionId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Transformation Promise */}
            {getTransformationPromise() && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-teal-500 mr-2">🎯</span>
                  Transformation Promise
                </h2>
                <p className="text-gray-700 leading-relaxed">{getTransformationPromise()}</p>
              </div>
            )}

            {/* Hook Story */}
            {getHook() && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-yellow-500 mr-2">⚡</span>
                  Opening Story
                </h2>
                <p className="text-gray-700 leading-relaxed">{getHook()}</p>
              </div>
            )}

            {/* Fast Track Summary */}
            {getFastTrackSummary() && (
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="text-blue-500 mr-2">⚡</span>
                  Quick Summary
                </h2>
                <p className="text-blue-700 leading-relaxed">{getFastTrackSummary()}</p>
              </div>
            )}

            {/* Mobile Transformation */}
            {(mobileTransform.powerInsight || mobileTransform.identityShift) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-purple-500 mr-2">📱</span>
                  Key Insights
                </h2>
                {mobileTransform.powerInsight && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-purple-700 mb-2">Power Insight</h3>
                    <p className="text-gray-700">{mobileTransform.powerInsight}</p>
                  </div>
                )}
                {mobileTransform.identityShift && (
                  <div>
                    <h3 className="font-semibold text-purple-700 mb-2">Identity Shift</h3>
                    <p className="text-gray-700">{mobileTransform.identityShift}</p>
                  </div>
                )}
              </div>
            )}

            {/* Case Study */}
            {getCaseStudy() && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">📊</span>
                  Real-World Case Study
                </h2>
                <p className="text-green-700 leading-relaxed">{getCaseStudy()}</p>
              </div>
            )}

            {/* Becoming God's Entrepreneur */}
            {entrepreneur.content && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-orange-500 mr-2">👑</span>
                  Becoming God&apos;s Entrepreneur
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">{entrepreneur.content}</p>
                {entrepreneur.questions && entrepreneur.questions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2">Reflection Questions</h3>
                    <ul className="space-y-2">
                      {entrepreneur.questions.map((question: string, index: number) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Reflection */}
            {getReflection() && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-blue-500 mr-2">🤔</span>
                  Reflection
                </h2>
                <p className="text-gray-700 leading-relaxed">{getReflection()}</p>
              </div>
            )}

            {/* Engagement Challenge */}
            {(engagement.challenge || engagement.community) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-red-500 mr-2">🚀</span>
                  Action Steps
                </h2>
                {engagement.challenge && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-red-700 mb-2">This Week&apos;s Challenge</h3>
                    <p className="text-gray-700 text-sm">{engagement.challenge}</p>
                  </div>
                )}
                {engagement.community && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2">Community Discussion</h3>
                    <p className="text-gray-700 text-sm">{engagement.community}</p>
                  </div>
                )}
              </div>
            )}

            {/* FAQ */}
            {getFAQQuestions().length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-indigo-500 mr-2">❓</span>
                  FAQ
                </h2>
                <div className="space-y-3">
                  {getFAQQuestions().map((faq: string, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-700 leading-relaxed">{faq}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Plan Questions */}
            {getBusinessPlanQuestions().length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-teal-500 mr-2">📋</span>
                  Business Plan Integration
                </h2>
                <ul className="space-y-2">
                  {getBusinessPlanQuestions().map((question: string, index: number) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}