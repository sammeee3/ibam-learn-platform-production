'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ChevronDown, 
  ChevronRight, 
  Book, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Info, 
  Target, 
  Lightbulb, 
  Clock, 
  Users,
  Loader2,
  AlertCircle,
  Download
} from 'lucide-react';

// Types based on your database structure
interface SessionData {
  id: number;
  module_id: number;
  session_number: number;
  title: string;
  subtitle: string;
  transformation_promise: string;
  hook: string;
  fast_track_summary: string;
  scripture_reference: string;
  video_url?: string;
  content: {
    look_back?: {
      vision_statement: string;
      reflection_questions: string[];
    };
    look_forward?: {
      commitment_prompt: string;
      application_questions: string[];
    };
  };
  mobile_transformation?: {
    powerInsight: string;
    identityShift: string;
  };
  case_study: string;
  faq_questions: string[];
  business_plan_questions: string[];
  engagement_mechanics?: {
    challenge: string;
    community: string;
  };
  becoming_gods_entrepreneur?: {
    content: string;
    questions: string[];
  };
  extra_materials?: string;
  estimated_time?: string;
}

interface SessionPageProps {
  params: {
    moduleId: string;
    sessionId: string;
  };
}

export default function SessionPage({ params }: SessionPageProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // State management
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState({
    lookback: false,
    lookup: false,
    lookforward: false
  });
  const [hoveredVerse, setHoveredVerse] = useState<string | null>(null);

  // Load session data and user
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Fetch session data
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', parseInt(params.sessionId))
          .single();

        if (sessionError) throw sessionError;
        
        setSessionData(session);

        // Load user progress for this session
        if (user) {
          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('session_id', parseInt(params.sessionId))
            .single();

          if (progress) {
            setCompletedSections({
              lookback: progress.look_back_completed || false,
              lookup: progress.look_up_completed || false,
              lookforward: progress.look_forward_completed || false
            });
          }
        }

      } catch (err: any) {
        console.error('Error loading session:', err);
        setError(err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [params.sessionId, params.moduleId, supabase]);

  // Handle section completion
  const markSectionComplete = async (section: string) => {
    if (!user || !sessionData) return;

    try {
      const updates = {
        user_id: user.id,
        session_id: sessionData.id,
        module_id: sessionData.module_id,
        [`${section}_completed`]: true,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_progress')
        .upsert(updates, { 
          onConflict: 'user_id,session_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      setCompletedSections(prev => ({
        ...prev,
        [section]: true
      }));

    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  // Navigation functions
  const navigateToSession = (direction: 'prev' | 'next') => {
    if (!sessionData) return;
    
    const targetSession = direction === 'next' 
      ? sessionData.session_number + 1 
      : sessionData.session_number - 1;
      
    router.push(`/modules/${params.moduleId}/sessions/${targetSession}`);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Scripture hover component
  const ScriptureReference = ({ reference }: { reference: string }) => (
    <span 
      className="relative inline-block cursor-pointer text-blue-600 font-semibold border-b border-dotted border-blue-400 hover:text-blue-800 transition-colors"
      onMouseEnter={() => setHoveredVerse(reference)}
      onMouseLeave={() => setHoveredVerse(null)}
    >
      {reference}
      {hoveredVerse === reference && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 bg-white border-2 border-blue-200 rounded-lg shadow-xl max-w-sm">
          <div className="text-sm font-bold text-blue-800 mb-2">{reference}</div>
          <div className="text-sm text-gray-700 italic">
            Scripture text will be loaded here from your scripture table
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-200"></div>
        </div>
      )}
    </span>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error || 'Session not found'}</p>
          <button 
            onClick={() => navigateTo('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Faith-Driven Business Mastery → Module {sessionData.module_id} → Session {sessionData.session_number}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{sessionData.title}</h1>
            <p className="text-gray-600 mt-2">{sessionData.subtitle}</p>
          </div>
          
          {/* Progress indicator with session info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <div className={`flex items-center ${completedSections.lookback ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Look Back</span>
              </div>
              <div className={`flex items-center ${completedSections.lookup ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Look Up</span>
              </div>
              <div className={`flex items-center ${completedSections.lookforward ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Look Forward</span>
              </div>
            </div>
            
            {/* Session completion status */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{sessionData.estimated_time || '~25 min'}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Session {sessionData.session_number}</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {Object.values(completedSections).every(Boolean) ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800">🧭 Session Navigation</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button 
              onClick={() => navigateToSession('prev')}
              disabled={sessionData.session_number <= 1}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Previous Session
            </button>
            
            <div className="flex flex-col sm:flex-row gap-2 text-center">
              <button 
                onClick={() => navigateTo(`/modules/${params.moduleId}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                📋 Module Overview
              </button>
              <button 
                onClick={() => navigateTo('/dashboard')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                🏠 Dashboard
              </button>
              <button 
                onClick={() => navigateTo('/business-plan')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                💼 Business Planner
              </button>
            </div>
            
            <button 
              onClick={() => navigateToSession('next')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Next Session
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Hook Section */}
        {sessionData.hook && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-3">🎯 Session Hook</h2>
            <p className="text-lg leading-relaxed">{sessionData.hook}</p>
          </div>
        )}

        {/* Mobile Transformation */}
        {sessionData.mobile_transformation && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Mobile Transformation</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-800">💡 Power Insight</h4>
                <p className="text-gray-700">{sessionData.mobile_transformation.powerInsight}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-800">🔄 Identity Shift</h4>
                <p className="text-gray-700">{sessionData.mobile_transformation.identityShift}</p>
              </div>
            </div>
          </div>
        )}

        {/* Three main sections */}
        <div className="space-y-4 mb-8">
          {/* Look Back */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookback' ? null : 'lookback')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">👀 Look Back</h3>
                    <p className="text-blue-100">Accountability & Previous Commitments</p>
                  </div>
                </div>
                {expandedSection === 'lookback' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookback' && (
              <div className="p-6 bg-blue-50">
                {sessionData.content?.look_back?.vision_statement && (
                  <div className="mb-6">
                    <h4 className="font-bold text-blue-800 mb-3">Our Vision Statement</h4>
                    <p className="text-gray-700 italic border-l-4 border-blue-400 pl-4">
                      {sessionData.content.look_back.vision_statement}
                    </p>
                  </div>
                )}
                
                {sessionData.content?.look_back?.reflection_questions && (
                  <div className="mb-6">
                    <h4 className="font-bold text-blue-800 mb-3">Reflection Questions</h4>
                    <div className="space-y-3">
                      {sessionData.content.look_back.reflection_questions.map((question, index) => (
                        <div key={index} className="bg-white p-4 rounded border-l-4 border-blue-400">
                          <p className="text-gray-700">{question}</p>
                          <textarea 
                            className="w-full mt-2 p-2 border rounded resize-none"
                            rows={2}
                            placeholder="Your reflection..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => markSectionComplete('lookback')}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Complete Look Back
                </button>
              </div>
            )}
          </div>

          {/* Look Up */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-green-500 hover:bg-green-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookup' ? null : 'lookup')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">📖 Look Up</h3>
                    <p className="text-green-100">Scripture + Business Content + Videos</p>
                  </div>
                </div>
                {expandedSection === 'lookup' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookup' && (
              <div className="p-6 bg-green-50">
                {/* Scripture Section */}
                {sessionData.scripture_reference && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-3">📖 Key Scripture</h4>
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <ScriptureReference reference={sessionData.scripture_reference} />
                    </div>
                  </div>
                )}

                {/* Video Section */}
                {sessionData.video_url && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-3">🎥 Teaching Video</h4>
                    <div className="bg-white p-4 rounded">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded flex items-center justify-center">
                        <Play className="w-16 h-16 text-gray-500" />
                        <span className="ml-2 text-gray-600">Video: {sessionData.video_url}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Downloadable Materials */}
                {sessionData.extra_materials && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-3">📄 Session Downloads</h4>
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-800">Session Workbook & Resources</h5>
                          <p className="text-gray-600 text-sm">PDF worksheets, templates, and supplementary materials</p>
                        </div>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case Study */}
                {sessionData.case_study && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-3">📊 Case Study</h4>
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <p className="text-gray-700">{sessionData.case_study}</p>
                    </div>
                  </div>
                )}

                {/* FAQ */}
                {sessionData.faq_questions && sessionData.faq_questions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-3">❓ Frequently Asked Questions</h4>
                    <div className="space-y-3">
                      {sessionData.faq_questions.map((faq, index) => (
                        <div key={index} className="bg-white p-4 rounded">
                          <p className="text-gray-700">{faq}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => markSectionComplete('lookup')}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Complete Look Up
                </button>
              </div>
            )}
          </div>

          {/* Look Forward */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-orange-500 hover:bg-orange-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookforward' ? null : 'lookforward')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">🎯 Look Forward</h3>
                    <p className="text-orange-100">Action Planning + Commitments</p>
                  </div>
                </div>
                {expandedSection === 'lookforward' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookforward' && (
              <div className="p-6 bg-orange-50">
                {/* Business Planner Integration */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-2">💼 Business Planner Integration</h4>
                        <p className="text-purple-100">Apply today's learning directly to your business plan</p>
                      </div>
                      <button 
                        onClick={() => navigateTo('/business-plan')}
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
                      >
                        Open Planner →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Business Plan Questions */}
                {sessionData.business_plan_questions && sessionData.business_plan_questions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-orange-800 mb-3">📋 Business Plan Development</h4>
                    <div className="space-y-4">
                      {sessionData.business_plan_questions.map((question, index) => (
                        <div key={index} className="bg-white p-5 rounded-lg border-l-4 border-purple-400 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <p className="text-gray-800 font-medium">{question}</p>
                            <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                              Add to Planner
                            </button>
                          </div>
                          <textarea 
                            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            rows={3}
                            placeholder="Your response will be saved to your business plan..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Questions */}
                {sessionData.content?.look_forward?.application_questions && (
                  <div className="mb-6">
                    <h4 className="font-bold text-orange-800 mb-3">🎯 Personal Application</h4>
                    <div className="space-y-3">
                      {sessionData.content.look_forward.application_questions.map((question, index) => (
                        <div key={index} className="bg-white p-4 rounded border-l-4 border-orange-400">
                          <p className="text-gray-700 mb-2">{question}</p>
                          <textarea 
                            className="w-full p-2 border rounded resize-none"
                            rows={2}
                            placeholder="Your commitment..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* God's Entrepreneur Section */}
                {sessionData.becoming_gods_entrepreneur && (
                  <div className="mb-6">
                    <h4 className="font-bold text-orange-800 mb-3">👑 Becoming God's Entrepreneur</h4>
                    <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                      <p className="text-gray-700 mb-4">{sessionData.becoming_gods_entrepreneur.content}</p>
                      <div className="space-y-3">
                        {sessionData.becoming_gods_entrepreneur.questions?.map((question, index) => (
                          <div key={index}>
                            <p className="text-gray-700 mb-2">{question}</p>
                            <textarea 
                              className="w-full p-2 border rounded resize-none"
                              rows={2}
                              placeholder="Your reflection..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => markSectionComplete('lookforward')}
                    className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
                  >
                    Complete Look Forward
                  </button>
                  <button 
                    onClick={() => navigateTo('/business-plan')}
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Save to Business Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transformation Promise */}
        {sessionData.transformation_promise && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-3">✨ Your Transformation Promise</h3>
            <p className="text-lg">{sessionData.transformation_promise}</p>
          </div>
        )}
      </div>
    </div>
  );
}