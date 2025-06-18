'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SessionData {
  id: number;
  title: string;
  subtitle?: string;
  module_id: number;
  session_number: number;
  estimated_time?: string;
  transformation_promise?: string;
  scripture?: any;
  hook?: string;
  video_url?: string;
  content?: any;
  fast_track_summary?: string;
  mobile_transformation?: any;
  reflection?: string;
  becoming_gods_entrepreneur?: any;
  case_study?: string;
  faq_questions?: string[];
  business_plan_questions?: string[];
  extra_materials?: string;
  engagement_mechanics?: any;
}

interface UserProgress {
  lookBackComplete: boolean;
  lookUpComplete: boolean;
  lookForwardComplete: boolean;
  completionPercentage: number;
  
  // Look Back Data
  lookBackPrayer: string;
  previousActionReview: string;
  winsAndChallenges: string;
  visionReflection: string;
  
  // Look Up Data  
  lookUpPrayer: string;
  writtenMaterialRead: boolean;
  videoWatched: boolean;
  knowledgeCheckAnswer: number | null;
  personalReflection: string;
  faqReviewed: boolean;
  
  // Look Forward Data
  lookForwardPrayer: string;
  keyTruthReflection: string;
  actionStatement1: string;
  actionStatement2: string;
  actionStatement3: string;
  businessPlanAnswer1: string;
  businessPlanAnswer2: string;
  businessPlanAnswer3: string;
  accountabilityPartner: string;
  communityCommitment: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'lookback' | 'lookup' | 'lookforward'>('lookback');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    lookBackComplete: false,
    lookUpComplete: false,
    lookForwardComplete: false,
    completionPercentage: 0,
    lookBackPrayer: '',
    previousActionReview: '',
    winsAndChallenges: '',
    visionReflection: '',
    lookUpPrayer: '',
    writtenMaterialRead: false,
    videoWatched: false,
    knowledgeCheckAnswer: null,
    personalReflection: '',
    faqReviewed: false,
    lookForwardPrayer: '',
    keyTruthReflection: '',
    actionStatement1: '',
    actionStatement2: '',
    actionStatement3: '',
    businessPlanAnswer1: '',
    businessPlanAnswer2: '',
    businessPlanAnswer3: '',
    accountabilityPartner: '',
    communityCommitment: ''
  });

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) throw new Error(`Failed to fetch session: ${response.status}`);
        
        const data = await response.json();
        setSession(data);
        
        // Load saved progress
        const savedProgress = localStorage.getItem(`session-progress-${sessionId}`);
        if (savedProgress) {
          setUserProgress(JSON.parse(savedProgress));
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem(`session-progress-${sessionId}`, JSON.stringify(userProgress));
    
    // Calculate completion
    const lookBackDone = !!(userProgress.lookBackPrayer && userProgress.visionReflection);
    const lookUpDone = !!(userProgress.personalReflection && userProgress.writtenMaterialRead);
    const lookForwardDone = !!(userProgress.actionStatement1 && userProgress.businessPlanAnswer1);
    
    const newProgress = {
      ...userProgress,
      lookBackComplete: lookBackDone,
      lookUpComplete: lookUpDone,
      lookForwardComplete: lookForwardDone,
      completionPercentage: Math.round(((Number(lookBackDone) + Number(lookUpDone) + Number(lookForwardDone)) / 3) * 100)
    };
    
    if (JSON.stringify(newProgress) !== JSON.stringify(userProgress)) {
      setUserProgress(newProgress);
    }
  }, [userProgress, sessionId]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({ ...prev, ...updates }));
  };

  const canAccessSection = (section: 'lookback' | 'lookup' | 'lookforward') => {
    if (section === 'lookback') return true;
    if (section === 'lookup') return userProgress.lookBackComplete;
    if (section === 'lookforward') return userProgress.lookBackComplete && userProgress.lookUpComplete;
    return false;
  };

  const getScripture = () => {
    try {
      if (typeof session?.scripture === 'string') return JSON.parse(session.scripture);
      return session?.scripture || {};
    } catch { return {}; }
  };

  const getMobileTransformation = () => {
    try {
      if (typeof session?.mobile_transformation === 'string') return JSON.parse(session.mobile_transformation);
      return session?.mobile_transformation || {};
    } catch { return {}; }
  };

  const getEngagement = () => {
    try {
      if (typeof session?.engagement_mechanics === 'string') return JSON.parse(session.engagement_mechanics);
      return session?.engagement_mechanics || {};
    } catch { return {}; }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Session {sessionId}...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Session</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-3 rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const scripture = getScripture();
  const mobileTransform = getMobileTransformation();
  const engagement = getEngagement();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                🏠 Dashboard
              </button>
              <button onClick={() => router.push('/modules')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                📚 Modules
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Module {moduleId} • Session {sessionId}</div>
              <div className="font-semibold">{userProgress.completionPercentage}% Complete</div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{session?.title}</h1>
          {session?.subtitle && <p className="text-teal-100 text-lg">{session.subtitle}</p>}
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
              style={{ width: `${userProgress.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3/3 Method Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex">
            {[
              { key: 'lookback', label: 'Look Back', icon: '👁️', subtitle: 'Reflect & Pray', complete: userProgress.lookBackComplete },
              { key: 'lookup', label: 'Look Up', icon: '📖', subtitle: 'Learn & Grow', complete: userProgress.lookUpComplete },
              { key: 'lookforward', label: 'Look Forward', icon: '🎯', subtitle: 'Apply & Plan', complete: userProgress.lookForwardComplete }
            ].map((section) => {
              const isAccessible = canAccessSection(section.key as any);
              const isActive = currentSection === section.key;
              
              return (
                <button
                  key={section.key}
                  onClick={() => isAccessible && setCurrentSection(section.key as any)}
                  disabled={!isAccessible}
                  className={`flex-1 py-6 px-4 text-center transition-all ${
                    isActive ? 'bg-teal-50 border-b-4 border-teal-500' : 
                    isAccessible ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-2">{!isAccessible ? '🔒' : section.icon}</div>
                  <div className={`font-semibold text-lg ${isActive ? 'text-teal-600' : 'text-gray-700'}`}>
                    {section.label}
                  </div>
                  <div className="text-sm text-gray-500">{section.subtitle}</div>
                  {section.complete && <div className="text-2xl mt-1">✅</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* LOOK BACK SECTION */}
        {currentSection === 'lookback' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">👁️ Look Back</h2>
              <p className="text-gray-600 text-lg">Reflect on your journey and pray for wisdom</p>
            </div>

            {/* Opening Prayer */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                🙏 Opening Prayer
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-blue-700 italic">
                  "Lord, as I look back on my recent journey, help me see Your hand at work. 
                  Give me wisdom to learn from my experiences and courage to grow in faithfulness."
                </p>
              </div>
              <textarea
                value={userProgress.lookBackPrayer}
                onChange={(e) => updateProgress({ lookBackPrayer: e.target.value })}
                placeholder="Add your personal prayer or reflection..."
                className="w-full h-24 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Previous Actions Review */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                📋 Previous Action Review
              </h3>
              <p className="text-yellow-700 mb-4">
                What action steps did you commit to in your last session? How did they go?
              </p>
              <textarea
                value={userProgress.previousActionReview}
                onChange={(e) => updateProgress({ previousActionReview: e.target.value })}
                placeholder="Reflect on your previous commitments and what you learned..."
                className="w-full h-32 p-4 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Wins and Challenges */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                🏆 Wins and Challenges
              </h3>
              <p className="text-green-700 mb-4">
                What victories (big or small) have you experienced? What challenges are you facing?
              </p>
              <textarea
                value={userProgress.winsAndChallenges}
                onChange={(e) => updateProgress({ winsAndChallenges: e.target.value })}
                placeholder="Celebrate your wins and honestly assess your challenges..."
                className="w-full h-32 p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Vision Reiteration */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                🎯 Our Vision
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-purple-700 font-medium">
                  "To love God and serve our community through excellent, biblically-based business, 
                  intentionally multiplying disciples who make disciples in our marketplace sphere of influence."
                </p>
              </div>
              <p className="text-purple-700 mb-4">
                How does this vision connect with your current business situation and recent experiences?
              </p>
              <textarea
                value={userProgress.visionReflection}
                onChange={(e) => updateProgress({ visionReflection: e.target.value })}
                placeholder="Connect the IBAM vision with your personal journey..."
                className="w-full h-32 p-4 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {userProgress.lookBackComplete && (
              <div className="bg-green-500 text-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-bold">Look Back Complete!</h3>
                <p>You can now access the Look Up section.</p>
              </div>
            )}
          </div>
        )}

        {/* LOOK UP SECTION */}
        {currentSection === 'lookup' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">📖 Look Up</h2>
              <p className="text-gray-600 text-lg">Learn from God's Word and grow in wisdom</p>
            </div>

            {/* Learning Prayer */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                🙏 Learning Prayer
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-blue-700 italic">
                  "Father, open my heart and mind to Your truth. Help me not just gain knowledge, 
                  but be transformed by what I learn today."
                </p>
              </div>
              <textarea
                value={userProgress.lookUpPrayer}
                onChange={(e) => updateProgress({ lookUpPrayer: e.target.value })}
                placeholder="Add your personal prayer for learning..."
                className="w-full h-24 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Scripture Foundation */}
            {(scripture.reference || scripture.text) && (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                  📖 Scripture Foundation
                </h3>
                <div className="bg-white rounded-lg p-4">
                  {scripture.reference && (
                    <div className="font-bold text-amber-600 mb-2">{scripture.reference} (ESV)</div>
                  )}
                  {scripture.text && (
                    <blockquote className="text-amber-800 italic">"{scripture.text}"</blockquote>
                  )}
                </div>
              </div>
            )}

            {/* Transformation Promise */}
            {session?.transformation_promise && (
              <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                  🎯 What You'll Gain
                </h3>
                <p className="text-teal-700 text-lg">{session.transformation_promise}</p>
              </div>
            )}

            {/* Hook Story */}
            {session?.hook && (
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  ⚡ Opening Story
                </h3>
                <p className="text-gray-700 leading-relaxed">{session.hook}</p>
              </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  📝 Main Teaching
                </h3>
                <button
                  onClick={() => updateProgress({ writtenMaterialRead: true })}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    userProgress.writtenMaterialRead 
                      ? 'bg-green-500 text-white' 
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  }`}
                >
                  {userProgress.writtenMaterialRead ? '✓ Read' : 'Mark as Read'}
                </button>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {session?.fast_track_summary || 'Main teaching content will be displayed here.'}
                </p>
              </div>
            </div>

            {/* Video Content */}
            {session?.video_url && !session.video_url.includes('PLACEHOLDER') && (
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    📺 Training Video
                  </h3>
                  <button
                    onClick={() => updateProgress({ videoWatched: true })}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      userProgress.videoWatched 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {userProgress.videoWatched ? '✓ Watched' : 'Mark as Watched'}
                  </button>
                </div>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">▶️</div>
                    <p>Video player would be embedded here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Knowledge Check */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                🧠 Knowledge Check
              </h3>
              <p className="text-indigo-700 mb-4">
                What is the main biblical principle taught in this session?
              </p>
              <div className="space-y-3">
                {[
                  "God wants us to be successful in business at any cost",
                  "Business and faith should be kept completely separate",
                  "Biblical principles enhance business effectiveness and sustainability",
                  "Only explicitly Christian businesses can honor God"
                ].map((option, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-indigo-50">
                    <input
                      type="radio"
                      name="knowledge-check"
                      value={index}
                      checked={userProgress.knowledgeCheckAnswer === index}
                      onChange={() => updateProgress({ knowledgeCheckAnswer: index })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {userProgress.knowledgeCheckAnswer !== null && (
                <div className={`mt-4 p-4 rounded-lg ${
                  userProgress.knowledgeCheckAnswer === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {userProgress.knowledgeCheckAnswer === 2 
                    ? "✓ Correct! Biblical principles do enhance business effectiveness."
                    : "Consider reviewing the main teaching. Biblical principles are designed to help, not hinder business success."
                  }
                </div>
              )}
            </div>

            {/* Personal Reflection */}
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
              <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                💭 Personal Reflection
              </h3>
              <p className="text-pink-700 mb-4">
                {session?.reflection || 'How will you apply what you learned in this session?'}
              </p>
              <textarea
                value={userProgress.personalReflection}
                onChange={(e) => updateProgress({ personalReflection: e.target.value })}
                placeholder="Write your personal reflection and insights..."
                className="w-full h-32 p-4 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* FAQ Review */}
            {session?.faq_questions && session.faq_questions.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    ❓ Frequently Asked Questions
                  </h3>
                  <button
                    onClick={() => updateProgress({ faqReviewed: true })}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      userProgress.faqReviewed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {userProgress.faqReviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                  </button>
                </div>
                <div className="space-y-3">
                  {session.faq_questions.map((faq, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <p className="text-gray-700">{faq}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userProgress.lookUpComplete && (
              <div className="bg-green-500 text-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-bold">Look Up Complete!</h3>
                <p>You can now access the Look Forward section.</p>
              </div>
            )}
          </div>
        )}

        {/* LOOK FORWARD SECTION */}
        {currentSection === 'lookforward' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Look Forward</h2>
              <p className="text-gray-600 text-lg">Apply what you've learned and plan your next steps</p>
            </div>

            {/* Application Prayer */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                🙏 Application Prayer
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-blue-700 italic">
                  "Lord, give me courage to apply what I've learned. Help me take specific steps 
                  that honor You and advance Your kingdom through my business."
                </p>
              </div>
              <textarea
                value={userProgress.lookForwardPrayer}
                onChange={(e) => updateProgress({ lookForwardPrayer: e.target.value })}
                placeholder="Add your prayer for wisdom in application..."
                className="w-full h-24 p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Key Truth Reflection */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                💡 Key Truth Integration
              </h3>
              <p className="text-yellow-700 mb-4">
                What is the most important truth you learned today? How will it change your approach to business?
              </p>
              <textarea
                value={userProgress.keyTruthReflection}
                onChange={(e) => updateProgress({ keyTruthReflection: e.target.value })}
                placeholder="Identify the key truth and how it will transform your business approach..."
                className="w-full h-32 p-4 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Specific Action Statements */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                🎯 Specific Action Commitments
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-red-700 font-semibold">⚠️ Remember: You'll be asked about these at the start of your next session!</p>
                <p className="text-red-600 text-sm mt-2">Make them specific, measurable, and time-bound.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-red-700 font-medium mb-2">Action Statement #1 (Required)</label>
                  <textarea
                    value={userProgress.actionStatement1}
                    onChange={(e) => updateProgress({ actionStatement1: e.target.value })}
                    placeholder="I will [specific action] by [when] because [why]..."
                    className="w-full h-24 p-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-red-700 font-medium mb-2">Action Statement #2 (Optional)</label>
                  <textarea
                    value={userProgress.actionStatement2}
                    onChange={(e) => updateProgress({ actionStatement2: e.target.value })}
                    placeholder="I will [specific action] by [when] because [why]..."
                    className="w-full h-24 p-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-red-700 font-medium mb-2">Action Statement #3 (Optional)</label>
                  <textarea
                    value={userProgress.actionStatement3}
                    onChange={(e) => updateProgress({ actionStatement3: e.target.value })}
                    placeholder="I will [specific action] by [when] because [why]..."
                    className="w-full h-24 p-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Business Plan Integration */}
            {session?.business_plan_questions && session.business_plan_questions.length > 0 && (
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  📋 Business Plan Builder
                </h3>
                <p className="text-orange-700 mb-4">
                  Your responses will be saved to your business plan automatically.
                </p>
                
                <div className="space-y-4">
                  {session.business_plan_questions.slice(0, 3).map((question, index) => (
                    <div key={index}>
                      <label className="block text-orange-700 font-medium mb-2">
                        {index + 1}. {question}
                      </label>
                      <textarea
                        value={userProgress[`businessPlanAnswer${index + 1}` as keyof UserProgress] as string}
                        onChange={(e) => updateProgress({ [`businessPlanAnswer${index + 1}`]: e.target.value })}
                        placeholder="Your response will be integrated into your business plan..."
                        className="w-full h-24 p-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accountability & Community */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                👥 Accountability & Community
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    Who will you share your action commitments with for accountability?
                  </label>
                  <input
                    type="text"
                    value={userProgress.accountabilityPartner}
                    onChange={(e) => updateProgress({ accountabilityPartner: e.target.value })}
                    placeholder="Name of accountability partner, spouse, mentor, etc."
                    className="w-full p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-green-700 font-medium mb-2">
                    How will you engage with the IBAM community this week?
                  </label>
                  <textarea
                    value={userProgress.communityCommitment}
                    onChange={(e) => updateProgress({ communityCommitment: e.target.value })}
                    placeholder="Will you share insights, ask questions, encourage others, etc.?"
                    className="w-full h-24 p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Transformation Display */}
            {(mobileTransform.powerInsight || mobileTransform.identityShift) && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  📱 Key Transformations
                </h3>
                
                {mobileTransform.powerInsight && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-purple-700 mb-2">💡 Power Insight</h4>
                    <p className="text-purple-800">{mobileTransform.powerInsight}</p>
                  </div>
                )}
                
                {mobileTransform.identityShift && (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-purple-700 mb-2">🔄 Identity Shift</h4>
                    <p className="text-purple-800">{mobileTransform.identityShift}</p>
                  </div>
                )}
              </div>
            )}

            {userProgress.lookForwardComplete && (
              <div className="bg-green-500 text-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold">Session Complete!</h3>
                <p className="mb-4">Excellent work! You've completed this session.</p>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-green-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}