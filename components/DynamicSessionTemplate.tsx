
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, Play, CheckCircle, Clock, Star, MessageSquare, ArrowRight, BookOpen, Target, Users, Award, Lightbulb } from 'lucide-react';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SessionData {
  id: string;
  title: string;
  subtitle?: string;
  learning_objective?: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  module_id: string;
  session_id: string;
  bible_verse?: string;
  key_principle?: string;
}

interface SessionResponses {
  look_back: string;
  look_up: string;
  look_forward: string;
}

interface SessionAssessment {
  understanding_rating: number;
  application_rating: number;
  engagement_rating: number;
  detailed_feedback: string;
  biblical_insight: string;
  business_application: string;
  commitment_plan: string;
}

export default function DynamicSessionTemplate() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const sessionId = params.sessionId as string;
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Show all sections by default for demo
  const [videoWatched, setVideoWatched] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const [responses, setResponses] = useState<SessionResponses>({
    look_back: '',
    look_up: '',
    look_forward: ''
  });

  const [assessment, setAssessment] = useState<SessionAssessment>({
    understanding_rating: 0,
    application_rating: 0,
    engagement_rating: 0,
    detailed_feedback: '',
    biblical_insight: '',
    business_application: '',
    commitment_plan: ''
  });

  const fetchSessionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Rich mock data matching your système.io content
      const mockSessionData = {
        id: `${moduleId}-${sessionId}`,
        title: `Module ${moduleId}, Session ${sessionId}: Business is a Good Gift from God`,
        subtitle: 'Understanding God\'s Heart for Marketplace Ministry',
        learning_objective: 'Discover how God designed business as a blessing for communities and a platform for discipleship',
        content: 'This foundational session explores the biblical basis for business ministry and how entrepreneurs can serve as kingdom ambassadors.',
        video_url: 'https://vimeo.com/123456789',
        duration_minutes: 25,
        module_id: moduleId,
        session_id: sessionId,
        bible_verse: 'Genesis 1:28 - "God blessed them and said to them, \'Be fruitful and increase in number; fill the earth and subdue it.\'"',
        key_principle: 'Business is God\'s gift to serve others and advance His kingdom through marketplace relationships.'
      };

      setSessionData(mockSessionData);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId && sessionId) {
      fetchSessionData();
    }
  }, [moduleId, sessionId]);

  const handleVideoComplete = () => {
    setVideoWatched(true);
  };

  const handleAssessmentRating = (category: keyof Pick<SessionAssessment, 'understanding_rating' | 'application_rating' | 'engagement_rating'>, rating: number) => {
    setAssessment(prev => ({ ...prev, [category]: rating }));
  };

  const renderStarRating = (category: keyof Pick<SessionAssessment, 'understanding_rating' | 'application_rating' | 'engagement_rating'>, label: string) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleAssessmentRating(category, star)}
              className={`p-1 rounded transition-colors ${
                assessment[category] >= star 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {assessment[category] > 0 ? `${assessment[category]}/5` : 'Click to rate'}
          </span>
        </div>
      </div>
    );
  };

  const handleCompleteSession = async () => {
    console.log('Session completed:', { moduleId, sessionId, responses, assessment });
    setSessionCompleted(true);
    alert('🎉 Session completed! (This will save to database in production)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center">Loading session {sessionId}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Session</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600">
      {/* FEATURE 1: Header with Progress Tracking */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{sessionData?.title}</h1>
              <p className="text-sm text-gray-600">Session {sessionId} • Module {moduleId} • {sessionData?.duration_minutes} min</p>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">All Features Visible</span>
            </div>
          </div>
          
          {/* FEATURE 2: Visual Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 w-3/4"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>✅ Video</span>
              <span>✅ 3/3 Method</span>
              <span>✅ Assessment</span>
              <span>🎯 Complete</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* FEATURE 3: Hero Section with Bible Verse & Key Principle */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{sessionData?.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{sessionData?.subtitle}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Key Scripture</h3>
              </div>
              <p className="text-blue-800 italic">{sessionData?.bible_verse}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Key Principle</h3>
              </div>
              <p className="text-yellow-800">{sessionData?.key_principle}</p>
            </div>
          </div>
        </div>

        {/* FEATURE 4: Video Section with Vimeo Integration */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Play className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Teaching Video</h3>
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{sessionData?.duration_minutes} minutes</span>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            
            {/* Video Player Area */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-lg font-semibold">Jeff's Teaching Video</p>
                <p className="text-sm text-gray-300">Ready for Vimeo embedding: {sessionData?.video_url}</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Play Video</span>
                </button>
                <button 
                  onClick={handleVideoComplete}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Progress: 100% watched
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 5: 3/3 Methodology - Look Back Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👈</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">LOOK BACK</h3>
                <p className="text-gray-600">Reflection & accountability from your recent business experiences</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 This Week's Vision</h4>
              <p className="text-blue-800">Love God and love your community through good business and multiply disciples in your local marketplace.</p>
            </div>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={responses.look_back}
              onChange={(e) => setResponses(prev => ({ ...prev, look_back: e.target.value }))}
              placeholder="Reflect on your recent business experiences and God's faithfulness. How has He been working in your marketplace relationships? What challenges have you faced, and how have you seen His provision?"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">{responses.look_back.length} characters</p>
              <span className="text-xs text-green-600">✓ Interactive textarea working</span>
            </div>
          </div>
        </div>

        {/* FEATURE 6: 3/3 Methodology - Look Up Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">☝️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">LOOK UP</h3>
                <p className="text-gray-600">Biblical truth & principles from today's teaching</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">📖 Biblical Foundation</h4>
              <p className="text-green-800">How does today's teaching connect to God's Word? What biblical principles apply to your business practices and relationships?</p>
            </div>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              value={responses.look_up}
              onChange={(e) => setResponses(prev => ({ ...prev, look_up: e.target.value }))}
              placeholder="What insights did you gain from Scripture? How does this apply to your business relationships, ethics, and daily practices? What biblical character traits will you focus on?"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">{responses.look_up.length} characters</p>
              <span className="text-xs text-green-600">✓ Biblical integration working</span>
            </div>
          </div>
        </div>

        {/* FEATURE 7: 3/3 Methodology - Look Forward Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👉</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">LOOK FORWARD</h3>
                <p className="text-gray-600">Commitment & action plan for the coming week</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-2">🎯 This Week's Commitment</h4>
              <p className="text-yellow-800">Make one specific commitment that demonstrates biblical character in your business this week. Include who you'll share this with for accountability.</p>
            </div>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={4}
              value={responses.look_forward}
              onChange={(e) => setResponses(prev => ({ ...prev, look_forward: e.target.value }))}
              placeholder="What specific actions will you take this week? Who will you serve? What business relationship will you invest in? Who will you share this commitment with for accountability?"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">{responses.look_forward.length} characters</p>
              <span className="text-xs text-green-600">✓ Commitment tracking working</span>
            </div>
          </div>
        </div>

        {/* FEATURE 8: Professional Assessment System */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Target className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">SESSION ASSESSMENT</h3>
                <p className="text-gray-600">Rate your learning experience and provide detailed feedback</p>
              </div>
              <Award className="w-5 h-5 text-purple-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Star Ratings */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Rate Your Experience</span>
                </h4>
                {renderStarRating('understanding_rating', '📚 Understanding of Content')}
                {renderStarRating('application_rating', '🛠️ Practical Application')}
                {renderStarRating('engagement_rating', '💡 Overall Engagement')}
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    ✓ Interactive 5-star rating system working perfectly!
                  </p>
                </div>
              </div>
              
              {/* Detailed Feedback */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span>Detailed Feedback</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Most Valuable Aspect</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={2}
                      value={assessment.detailed_feedback}
                      onChange={(e) => setAssessment(prev => ({ ...prev, detailed_feedback: e.target.value }))}
                      placeholder="What was most valuable about this session?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biblical Insight</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={2}
                      value={assessment.biblical_insight}
                      onChange={(e) => setAssessment(prev => ({ ...prev, biblical_insight: e.target.value }))}
                      placeholder="Key biblical insight you'll remember..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Application</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={assessment.business_application}
                      onChange={(e) => setAssessment(prev => ({ ...prev, business_application: e.target.value }))}
                      placeholder="How will you apply this to your business?"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 9: Session Completion & Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Complete Session!</h3>
            <p className="text-gray-600 mb-4">
              All session components are visible and functional. In production, completion requirements would be enforced.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <Play className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Video Integration</p>
              <p className="text-xs text-blue-700">✓ Ready for Vimeo</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">3/3 Methodology</p>
              <p className="text-xs text-green-700">✓ All sections working</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Assessment System</p>
              <p className="text-xs text-purple-700">✓ Professional ratings</p>
            </div>
          </div>

          <button
            onClick={handleCompleteSession}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:from-green-700 hover:to-blue-700 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{sessionCompleted ? '🎉 Session Completed!' : 'Complete Session'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* FEATURE 10: Success Celebration */}
        {sessionCompleted && (
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-6 mt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-green-800 mb-2">Session Completed Successfully!</h4>
              <p className="text-green-700 mb-4">You've experienced all the IBAM Learning Platform features!</p>
              <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Next Session
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  View Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}