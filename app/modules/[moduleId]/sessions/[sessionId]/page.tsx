'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`);
        }
        
        const data = await response.json();
        setSession(data);
        setLoading(false);
        
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold">Loading Session {sessionId}...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600">Error: {error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">{session?.title || 'Session Title'}</h1>
          <p className="text-teal-100">Module {moduleId} - Session {sessionId}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Transformation Promise */}
            {session?.transformation_promise && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Transformation Promise
                </h2>
                <p className="text-gray-700">{session.transformation_promise}</p>
              </div>
            )}

            {/* Hook Story */}
            {session?.hook && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Opening Story
                </h2>
                <p className="text-gray-700">{session.hook}</p>
              </div>
            )}

            {/* Fast Track Summary */}
            {session?.fast_track_summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Summary
                </h2>
                <p className="text-blue-700">{session.fast_track_summary}</p>
              </div>
            )}

            {/* Case Study */}
            {session?.case_study && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Real-World Case Study
                </h2>
                <p className="text-green-700">{session.case_study}</p>
              </div>
            )}

            {/* Becoming God's Entrepreneur */}
            {session?.becoming_gods_entrepreneur?.content && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">👑</span>
                  Becoming God's Entrepreneur
                </h2>
                <p className="text-gray-700 mb-4">{session.becoming_gods_entrepreneur.content}</p>
                {session.becoming_gods_entrepreneur.questions && (
                  <div>
                    <h3 className="font-semibold mb-2">Reflection Questions</h3>
                    <ul className="space-y-2">
                      {session.becoming_gods_entrepreneur.questions.map((question: string, index: number) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
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
            {session?.reflection && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🤔</span>
                  Reflection
                </h2>
                <p className="text-gray-700">{session.reflection}</p>
              </div>
            )}

            {/* FAQ */}
            {session?.faq_questions && session.faq_questions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">❓</span>
                  FAQ
                </h2>
                <div className="space-y-3">
                  {session.faq_questions.map((faq: string, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-700">{faq}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Plan Questions */}
            {session?.business_plan_questions && session.business_plan_questions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Business Plan Integration
                </h2>
                <ul className="space-y-2">
                  {session.business_plan_questions.map((question: string, index: number) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Navigation</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => router.push('/modules')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  All Modules
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}