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
  User,
  Loader2,
  AlertCircle,
  Download,
  Heart,
  Zap,
  Star,
  MessageCircle,
  BookOpen,
  Link2
} from 'lucide-react';

// Enhanced Types with new content sections
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
      multiplication_challenges?: string[];
    };
    written_curriculum?: {
      main_content: string;
      key_points: string[];
      illustrations: string[];
    };
    discovery_bible_study?: {
      verse: string;
      questions: string[];
    };
    bringing_together?: {
      integration_points: string[];
      action_steps: string[];
    };
    pathways?: {
      individual: {
        reflection_prompts: string[];
        personal_application: string[];
      };
      small_group: {
        discussion_questions: string[];
        group_activities: string[];
        accountability_partnerships: string[];
      };
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
    video_url?: string;
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

export default function EnhancedSessionPage({ params }: SessionPageProps) {
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
  const [pathwayMode, setPathwayMode] = useState<'individual' | 'small_group'>('individual');
  const [surveyResponses, setSurveyResponses] = useState({
    content_value: 0,
    learning_experience: 0,
    recommendation: 0
  });

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

  // Handle survey submission
  const submitSurvey = async () => {
    if (!user || !sessionData) return;

    try {
      const surveyData = {
        user_id: user.id,
        session_id: sessionData.id,
        module_id: sessionData.module_id,
        content_value_rating: surveyResponses.content_value,
        learning_experience_rating: surveyResponses.learning_experience,
        recommendation_rating: surveyResponses.recommendation,
        submitted_at: new Date().toISOString()
      };

      // This will need a session_surveys table - for now we'll store in user_progress
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          session_id: sessionData.id,
          module_id: sessionData.module_id,
          survey_data: surveyData,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,session_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      alert('Thank you for your feedback! 🙏');
    } catch (err) {
      console.error('Error submitting survey:', err);
    }
  };
    if (!sessionData) return;
    
    const targetSession = direction === 'next' 
      ? sessionData.session_number + 1 
      : sessionData.session_number - 1;
      
    router.push(`/modules/${params.moduleId}/sessions/${targetSession}`);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Vimeo Video Component
  const VimeoVideo = ({ url, title }: { url: string; title: string }) => {
    const getVimeoEmbedUrl = (vimeoUrl: string) => {
      // Extract video ID and hash from Vimeo URL
      const match = vimeoUrl.match(/vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/);
      if (match) {
        const [, videoId, hash] = match;
        return `https://player.vimeo.com/video/${videoId}?h=${hash}&badge=0&autopause=0&player_id=0&app_id=58479`;
      }
      return null;
    };

    const embedUrl = getVimeoEmbedUrl(url);
    
    if (!embedUrl) {
      return (
        <div className="bg-gray-200 rounded-lg p-8 text-center">
          <Play className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">{title}</p>
          <p className="text-sm text-gray-500 mt-2">Video URL: {url}</p>
        </div>

        {/* NEW: Comprehensive Course Help Center - Bottom Placement */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              🎓 IBAM Course Help Center
            </h3>
            <p className="text-indigo-100">Everything you need to succeed in your faith-driven business journey!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {/* Course Navigation */}
            <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                🧭 Navigation
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">Session Flow:</p>
                  <p className="text-gray-600">Use Previous/Next or Module Overview to navigate</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Learning Paths:</p>
                  <p className="text-gray-600">Switch between Individual & Small Group anytime</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Progress:</p>
                  <p className="text-gray-600">Auto-saves as you complete sections</p>
                </div>
              </div>
            </div>

            {/* Business Planner */}
            <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                💼 Business Planner
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">Access:</p>
                  <p className="text-gray-600">Click "Business Planner" button anytime</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Integration:</p>
                  <p className="text-gray-600">Session answers auto-populate your plan</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Editing:</p>
                  <p className="text-gray-600">Refine responses as your vision grows</p>
                </div>
              </div>
            </div>

            {/* Downloads & Saving */}
            <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                💾 Your Work
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">Auto-Save:</p>
                  <p className="text-gray-600">Everything saves as you type - no stress!</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Downloads:</p>
                  <p className="text-gray-600">Session materials & workbooks available</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Export:</p>
                  <p className="text-gray-600">Download your business plan anytime</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                🆘 Support
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">General Help:</p>
                  <p className="text-gray-600">
                    <a href="mailto:support@ibam.org" className="text-red-600 hover:underline">support@ibam.org</a>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Technical Issues:</p>
                  <p className="text-gray-600">
                    <a href="mailto:tech@ibam.org" className="text-red-600 hover:underline">tech@ibam.org</a>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Response Time:</p>
                  <p className="text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-gray-50 p-6 border-t">
            <h4 className="font-bold text-gray-800 mb-4 text-center">🌟 Additional Resources</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-semibold text-blue-800">📚 Resource Library</h5>
                <p className="text-sm text-gray-600">Books, articles, and tools in your Dashboard</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-semibold text-green-800">👥 Community Forum</h5>
                <p className="text-sm text-gray-600">Connect with fellow entrepreneurs</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-semibold text-purple-800">🙏 Prayer Support</h5>
                <p className="text-sm text-gray-600">Local small groups in your area</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
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

  // Pathway Toggle Component
  const PathwayToggle = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="font-bold text-lg mb-3 text-gray-800">🎯 Choose Your Learning Path</h3>
      <div className="flex gap-4">
        <button
          onClick={() => setPathwayMode('individual')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            pathwayMode === 'individual' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <User className="w-5 h-5 mr-2" />
          Individual Study
        </button>
        <button
          onClick={() => setPathwayMode('small_group')}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            pathwayMode === 'small_group' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-5 h-5 mr-2" />
          Small Group
        </button>
      </div>
    </div>
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
                <span>{sessionData.estimated_time || '~30 min'}</span>
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

        {/* Pathway Selection */}
        <PathwayToggle />

        {/* NEW: Quick Help Access Buttons */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 Need Quick Help?</h3>
              <p className="text-blue-100">Everything you need to navigate like a pro!</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setExpandedSection(expandedSection === 'quickhelp' ? null : 'quickhelp')}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors flex items-center"
              >
                🆘 Quick Help
              </button>
            </div>
          </div>
          
          {expandedSection === 'quickhelp' && (
            <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h5 className="font-bold text-white mb-2">🧭 Navigation Made Easy</h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Use Previous/Next buttons to flow through sessions</li>
                      <li>• Switch between Individual & Small Group anytime</li>
                      <li>• Your progress saves automatically - no stress!</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h5 className="font-bold text-white mb-2">💼 Business Planner Magic</h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Your session answers auto-fill your business plan</li>
                      <li>• Click "Business Planner" anytime to see progress</li>
                      <li>• Edit and refine as your vision grows</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h5 className="font-bold text-white mb-2">💾 Your Work is Safe</h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Everything saves automatically as you type</li>
                      <li>• Download materials anytime you need them</li>
                      <li>• Export your business plan when ready</li>
                    </ul>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <h5 className="font-bold text-white mb-2">🆘 Getting Stuck? We're Here!</h5>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Email: <a href="mailto:support@ibam.org" className="underline font-semibold">support@ibam.org</a></li>
                      <li>• Tech issues: <a href="mailto:tech@ibam.org" className="underline font-semibold">tech@ibam.org</a></li>
                      <li>• Usually respond within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                <h4 className="font-semibold text-blue-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Power Insight
                </h4>
                <p className="text-gray-700">{sessionData.mobile_transformation.powerInsight}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-800 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Identity Shift
                </h4>
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

          {/* Look Up - ENHANCED WITH ALL NEW SECTIONS */}
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
                    <p className="text-green-100">Scripture + Business Content + Videos + Integration</p>
                  </div>
                </div>
                {expandedSection === 'lookup' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookup' && (
              <div className="p-6 bg-green-50">
                {/* Scripture Section */}
                {sessionData.scripture_reference && (
                  <div className="mb-8">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      📖 Key Scripture
                    </h4>
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <ScriptureReference reference={sessionData.scripture_reference} />
                    </div>
                  </div>
                )}

                {/* NEW: Written Curriculum Content Section */}
                <div className="mb-8">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    📝 Core Teaching Content (30-minute read)
                  </h4>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-green-400">
                    {sessionData.content?.written_curriculum?.main_content ? (
                      <div className="prose max-w-none">
                        <div className="text-gray-800 leading-relaxed mb-6">
                          {sessionData.content.written_curriculum.main_content}
                        </div>
                        {sessionData.content.written_curriculum.key_points && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-green-800 mb-3">🎯 Key Points:</h5>
                            <ul className="space-y-2">
                              {sessionData.content.written_curriculum.key_points.map((point, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  <span className="text-gray-700">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Book className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Written curriculum content will be populated here.</p>
                        <p className="text-sm mt-2">This section will contain the comprehensive 30-minute teaching content.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Business Video Section */}
                {sessionData.video_url && (
                  <div className="mb-8">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      🎥 Business Teaching Video
                    </h4>
                    <div className="bg-white p-4 rounded-lg">
                      <VimeoVideo url={sessionData.video_url} title="Business Teaching Video" />
                      
                      {/* Video Discussion Questions */}
                      <div className="mt-6">
                        <h5 className="font-semibold text-gray-800 mb-3">
                          {pathwayMode === 'individual' ? '🤔 Personal Reflection' : '💬 Group Discussion'}
                        </h5>
                        <div className="space-y-3">
                          {pathwayMode === 'individual' ? (
                            sessionData.content?.pathways?.individual?.reflection_prompts?.map((prompt, index) => (
                              <div key={index} className="bg-blue-50 p-4 rounded">
                                <p className="text-gray-700 mb-2">{prompt}</p>
                                <textarea 
                                  className="w-full p-2 border rounded resize-none"
                                  rows={2}
                                  placeholder="Your personal reflection..."
                                />
                              </div>
                            )) || (
                              <div className="bg-blue-50 p-4 rounded">
                                <p className="text-gray-700 mb-2">What key insight from this video will change how you approach your business?</p>
                                <textarea 
                                  className="w-full p-2 border rounded resize-none"
                                  rows={2}
                                  placeholder="Your personal reflection..."
                                />
                              </div>
                            )
                          ) : (
                            sessionData.content?.pathways?.small_group?.discussion_questions?.map((question, index) => (
                              <div key={index} className="bg-purple-50 p-4 rounded">
                                <p className="text-gray-700">{question}</p>
                              </div>
                            )) || (
                              <>
                                <div className="bg-purple-50 p-4 rounded">
                                  <p className="text-gray-700">Share one key insight from the video with your group.</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded">
                                  <p className="text-gray-700">How can you apply this principle in your business this week?</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded">
                                  <p className="text-gray-700">What accountability do you need from the group?</p>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NEW: Enhanced "Becoming God's Entrepreneur" Section */}
                <div className="mb-8">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    👑 Becoming God's Entrepreneur
                  </h4>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-purple-400">
                    {/* BGE Video */}
                    {sessionData.becoming_gods_entrepreneur?.video_url && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-purple-800 mb-3">🎥 Identity Transformation Video</h5>
                        <VimeoVideo 
                          url={sessionData.becoming_gods_entrepreneur.video_url} 
                          title="Becoming God's Entrepreneur" 
                        />
                      </div>
                    )}
                    
                    {/* BGE Content */}
                    {sessionData.becoming_gods_entrepreneur?.content && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-purple-800 mb-3">💭 Identity Reflection</h5>
                        <p className="text-gray-700 italic bg-purple-50 p-4 rounded">
                          {sessionData.becoming_gods_entrepreneur.content}
                        </p>
                      </div>
                    )}

                    {/* BGE Questions */}
                    {sessionData.becoming_gods_entrepreneur?.questions && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-purple-800 mb-3">
                          {pathwayMode === 'individual' ? '🎯 Personal Identity Questions' : '👥 Group Identity Discussion'}
                        </h5>
                        <div className="space-y-3">
                          {sessionData.becoming_gods_entrepreneur.questions.map((question, index) => (
                            <div key={index} className="bg-purple-50 p-4 rounded">
                              <p className="text-gray-700 mb-2">{question}</p>
                              {pathwayMode === 'individual' && (
                                <textarea 
                                  className="w-full p-2 border rounded resize-none"
                                  rows={2}
                                  placeholder="Your reflection on identity..."
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW: IBAM Discovery Bible Study */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        📖 IBAM Discovery Bible Study
                      </h5>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        {/* Discovery Study Questions */}
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                            <h6 className="font-semibold text-blue-800 mb-2">🙏 Pray</h6>
                            <p className="text-gray-700 text-sm">Talk with God simply and briefly. Ask God to teach you this week's passage.</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded border-l-4 border-green-400">
                            <h6 className="font-semibold text-green-800 mb-2">📖 Read and Discuss</h6>
                            <p className="text-gray-700 text-sm mb-3">Read this week's passage: {sessionData.scripture_reference}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-700 font-medium">What did you like about this passage?</p>
                                {pathwayMode === 'individual' && (
                                  <textarea 
                                    className="w-full mt-1 p-2 text-sm border rounded resize-none"
                                    rows={2}
                                    placeholder="What you liked..."
                                  />
                                )}
                              </div>
                              
                              <div>
                                <p className="text-gray-700 font-medium">What did you find challenging about this passage?</p>
                                {pathwayMode === 'individual' && (
                                  <textarea 
                                    className="w-full mt-1 p-2 text-sm border rounded resize-none"
                                    rows={2}
                                    placeholder="What was challenging..."
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                            <h6 className="font-semibold text-purple-800 mb-2">📖 Read Again & Reflect</h6>
                            <p className="text-gray-700 text-sm mb-3">Read this week's passage again.</p>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-700 font-medium">What does this passage teach about God?</p>
                                {pathwayMode === 'individual' && (
                                  <textarea 
                                    className="w-full mt-1 p-2 text-sm border rounded resize-none"
                                    rows={2}
                                    placeholder="What it teaches about God..."
                                  />
                                )}
                              </div>
                              
                              <div>
                                <p className="text-gray-700 font-medium">What does this passage teach about people?</p>
                                {pathwayMode === 'individual' && (
                                  <textarea 
                                    className="w-full mt-1 p-2 text-sm border rounded resize-none"
                                    rows={2}
                                    placeholder="What it teaches about people..."
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW: "Bringing it All Together" Integration Section */}
                <div className="mb-8">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <Link2 className="w-5 h-5 mr-2" />
                    🔗 Bringing it All Together
                  </h4>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-orange-400">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
                      <h5 className="font-semibold text-orange-800 mb-4">
                        🎯 {pathwayMode === 'individual' ? 'Personal Integration' : 'Group Integration'}
                      </h5>
                      
                      {pathwayMode === 'individual' ? (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <p className="text-gray-700 font-medium mb-2">How do the biblical principles connect with the business concepts you learned?</p>
                            <textarea 
                              className="w-full p-2 border rounded resize-none"
                              rows={3}
                              placeholder="Your integration insights..."
                            />
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <p className="text-gray-700 font-medium mb-2">What specific action will you take this week to apply both the biblical and business principles?</p>
                            <textarea 
                              className="w-full p-2 border rounded resize-none"
                              rows={3}
                              placeholder="Your specific action plan..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <p className="text-gray-700 font-medium">Group Discussion: How do the biblical and business principles work together in your marketplace?</p>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <p className="text-gray-700 font-medium">Group Challenge: What specific actions will your group commit to this week?</p>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <p className="text-gray-700 font-medium">Accountability: How will you check in with each other on progress?</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Existing sections - Case Study, Downloads */}
                {sessionData.case_study && (
                  <div className="mb-8">
                    <h4 className="font-bold text-green-800 mb-3">📊 Case Study</h4>
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <p className="text-gray-700">{sessionData.case_study}</p>
                    </div>
                  </div>
                )}

                {sessionData.extra_materials && (
                  <div className="mb-8">
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

                {/* Session-Specific FAQ Only */}
                {sessionData.faq_questions && sessionData.faq_questions.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      ❓ Session Questions & Answers
                    </h4>
                    <div className="bg-white rounded-lg border">
                      <div className="bg-blue-50 px-6 py-3">
                        <h5 className="font-semibold text-blue-800">📚 About Today's Session</h5>
                      </div>
                      <div className="p-6 space-y-4">
                        {sessionData.faq_questions.map((faq, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-3 rounded-r">
                            <p className="text-gray-700">{faq}</p>
                          </div>
                        ))}
                      </div>
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

                {/* Enhanced Application Questions with Pathways */}
                <div className="mb-6">
                  <h4 className="font-bold text-orange-800 mb-3">
                    🎯 {pathwayMode === 'individual' ? 'Personal Application' : 'Group Application & Accountability'}
                  </h4>
                  <div className="space-y-3">
                    {pathwayMode === 'individual' ? (
                      sessionData.content?.look_forward?.application_questions?.map((question, index) => (
                        <div key={index} className="bg-white p-4 rounded border-l-4 border-orange-400">
                          <p className="text-gray-700 mb-2">{question}</p>
                          <textarea 
                            className="w-full p-2 border rounded resize-none"
                            rows={2}
                            placeholder="Your personal commitment..."
                          />
                        </div>
                      )) || (
                        <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                          <p className="text-gray-700 mb-2">What specific action will you take this week to apply today's learning?</p>
                          <textarea 
                            className="w-full p-2 border rounded resize-none"
                            rows={2}
                            placeholder="Your personal commitment..."
                          />
                        </div>
                      )
                    ) : (
                      <>
                        {sessionData.content?.pathways?.small_group?.accountability_partnerships?.map((partnership, index) => (
                          <div key={index} className="bg-white p-4 rounded border-l-4 border-purple-400">
                            <p className="text-gray-700">{partnership}</p>
                          </div>
                        )) || (
                          <>
                            <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                              <p className="text-gray-700">What commitments will each person make for the week ahead?</p>
                            </div>
                            <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                              <p className="text-gray-700">How will you check in with each other during the week?</p>
                            </div>
                            <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                              <p className="text-gray-700">Who will you each share this week's learning with outside the group?</p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Multiplication Challenges */}
                {sessionData.content?.look_forward?.multiplication_challenges && (
                  <div className="mb-6">
                    <h4 className="font-bold text-orange-800 mb-3">
                      🌱 {pathwayMode === 'individual' ? 'Personal Multiplication' : 'Group Multiplication Challenge'}
                    </h4>
                    <div className="space-y-3">
                      {sessionData.content.look_forward.multiplication_challenges.map((challenge, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded border-l-4 border-green-400">
                          <p className="text-gray-700 font-medium">{challenge}</p>
                          {pathwayMode === 'individual' && (
                            <textarea 
                              className="w-full mt-2 p-2 border rounded resize-none"
                              rows={2}
                              placeholder="Your multiplication plan..."
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NEW: Session Feedback Survey */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <h4 className="text-xl font-bold mb-3 flex items-center">
                      <Star className="w-6 h-6 mr-2" />
                      📊 Quick Session Feedback
                    </h4>
                    <p className="text-pink-100 mb-6">Help us make every session better! Your feedback takes 30 seconds and helps fellow entrepreneurs.</p>
                    
                    <div className="space-y-6">
                      {/* Question 1: Content Value */}
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-3">💎 How valuable was today's content for your business journey?</h5>
                        <div className="flex gap-3 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setSurveyResponses(prev => ({ ...prev, content_value: rating }))}
                              className={`w-12 h-12 rounded-full text-2xl transition-all ${
                                surveyResponses.content_value === rating
                                  ? 'bg-yellow-400 text-gray-800 transform scale-110 shadow-lg'
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              {rating === 1 ? '😕' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🤩'}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-pink-200 mt-2">
                          <span>Not helpful</span>
                          <span>Life-changing!</span>
                        </div>
                      </div>

                      {/* Question 2: Learning Experience */}
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-3">🎯 How effective was the learning format (videos, content, exercises)?</h5>
                        <div className="flex gap-3 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setSurveyResponses(prev => ({ ...prev, learning_experience: rating }))}
                              className={`w-12 h-12 rounded-full text-2xl transition-all ${
                                surveyResponses.learning_experience === rating
                                  ? 'bg-green-400 text-gray-800 transform scale-110 shadow-lg'
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              {rating === 1 ? '💤' : rating === 2 ? '😴' : rating === 3 ? '👍' : rating === 4 ? '🚀' : '⚡'}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-pink-200 mt-2">
                          <span>Boring</span>
                          <span>Engaging & Clear</span>
                        </div>
                      </div>

                      {/* Question 3: Recommendation */}
                      <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                        <h5 className="font-semibold text-white mb-3">🤝 How likely are you to recommend this session to another entrepreneur?</h5>
                        <div className="flex gap-3 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setSurveyResponses(prev => ({ ...prev, recommendation: rating }))}
                              className={`w-12 h-12 rounded-full text-2xl transition-all ${
                                surveyResponses.recommendation === rating
                                  ? 'bg-blue-400 text-gray-800 transform scale-110 shadow-lg'
                                  : 'bg-white/20 text-white hover:bg-white/30'
                              }`}
                            >
                              {rating === 1 ? '👎' : rating === 2 ? '🤷' : rating === 3 ? '👌' : rating === 4 ? '👏' : '🙌'}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-pink-200 mt-2">
                          <span>Wouldn't recommend</span>
                          <span>Must experience!</span>
                        </div>
                      </div>

                      {/* Submit Survey */}
                      {Object.values(surveyResponses).every(rating => rating > 0) && (
                        <div className="text-center">
                          <button
                            onClick={submitSurvey}
                            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg"
                          >
                            🙏 Submit Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
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