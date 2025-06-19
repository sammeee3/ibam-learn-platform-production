'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Module configuration for navigation 
const moduleConfig = {
  "1": { name: "Foundational Principles", totalSessions: 4 },
  "2": { name: "Success and Failure Factors", totalSessions: 4 },
  "3": { name: "Marketing Excellence", totalSessions: 5 },
  "4": { name: "Financial Management", totalSessions: 4 },
  "5": { name: "Business Planning", totalSessions: 3 }
};

// Session data interface (matches database structure)
interface SessionData {
  id: number;
  title: string;
  subtitle?: string;
  module_id: number;
  session_number: number;
  estimated_time?: string;
  transformation_promise?: string;
  scripture?: {
    reference: string;
    text: string;
  };
  hook?: string;
  video_url?: string;
  content?: any; // Rich content structure
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

// User progress interface
interface UserProgress {
  lookBackComplete: boolean;
  lookUpComplete: boolean;
  lookForwardComplete: boolean;
  writtenMaterialRead: boolean;
  videoWatched: boolean;
  quizAnswer: number | null;
  personalReflection: string;
  faqReviewed: boolean;
  keyTruthReflection: string;
  actionStatement1: string;
  businessPlanAnswer1: string;
  surveyRating1: number | null;
  surveyRating2: number | null;
  surveyRating3: number | null;
  postAssessmentRequired: boolean;
  postAssessmentCompleted: boolean;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;

  // State management
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<'lookback' | 'lookup' | 'lookforward'>('lookback');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    lookBackComplete: false,
    lookUpComplete: false,
    lookForwardComplete: false,
    writtenMaterialRead: false,
    videoWatched: false,
    quizAnswer: null,
    personalReflection: '',
    faqReviewed: false,
    keyTruthReflection: '',
    actionStatement1: '',
    businessPlanAnswer1: '',
    surveyRating1: null,
    surveyRating2: null,
    surveyRating3: null,
    postAssessmentRequired: false,
    postAssessmentCompleted: false
  });

  // Load session data from database
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`Loading session: Module ${moduleId}, Session ${sessionId}`);

        // Query sessions table - direct mapping from URL params
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('module_id', parseInt(moduleId))
          .eq('session_number', parseInt(sessionId))
          .single();

        if (error) {
          console.error('Database error:', error);
          setError(`Failed to load session: ${error.message}`);
          return;
        }

        if (!data) {
          console.error('No session data found');
          setError('Session not found');
          return;
        }

        console.log('Session data loaded:', data);
        setSession(data);

        // Set post-assessment requirement for final session
        if (isFinalCourseSession()) {
          setUserProgress(prev => ({ ...prev, postAssessmentRequired: true }));
        }

      } catch (err) {
        console.error('Error loading session:', err);
        setError('Failed to load session data');
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId && sessionId) {
      loadSessionData();
    }
  }, [moduleId, sessionId]);

  // Check if this is the final session
  const isFinalCourseSession = () => {
    return moduleId === "5" && sessionId === "3";
  };

  // Get current module info
  const currentModule = moduleConfig[moduleId as keyof typeof moduleConfig];
  const totalSessions = currentModule?.totalSessions || 4;

  // Navigation functions
  const navigateToNextSession = () => {
    const nextSessionId = parseInt(sessionId) + 1;
    
    // Check if this is the end of Module 5 (Course completion)
    if (moduleId === "5" && sessionId === "3" && userProgress.lookForwardComplete) {
      localStorage.setItem('ibam-course-completed', 'true');
      console.log('🎉 Course completed! Redirecting to post-assessment...');
      router.push('/assessment/post');
      return;
    }
    
    // Normal navigation
    if (nextSessionId <= totalSessions) {
      router.push(`/modules/${moduleId}/sessions/${nextSessionId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 5) {
        router.push(`/modules/${nextModuleId}/sessions/1`);
      }
    }
  };

  // Helper functions for survey ratings
  const getSurveyRating = (index: number): number | null => {
    switch (index) {
      case 0: return userProgress.surveyRating1;
      case 1: return userProgress.surveyRating2;
      case 2: return userProgress.surveyRating3;
      default: return null;
    }
  };

  const updateSurveyRating = (index: number, rating: number) => {
    switch (index) {
      case 0: updateProgress({ surveyRating1: rating }); break;
      case 1: updateProgress({ surveyRating2: rating }); break;
      case 2: updateProgress({ surveyRating3: rating }); break;
    }
  };

  // Update progress function
  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => {
      const newProgress = {...prev, ...updates};
      
      // Auto-check completion
      newProgress.lookBackComplete = true; // Simplified for now
      newProgress.lookUpComplete = !!(
        newProgress.writtenMaterialRead &&
        newProgress.videoWatched &&
        newProgress.quizAnswer !== null &&
        newProgress.personalReflection &&
        newProgress.faqReviewed
      );
      
      // For final session, require post-assessment acknowledgment
      if (isFinalCourseSession()) {
        newProgress.lookForwardComplete = !!(
          newProgress.keyTruthReflection &&
          newProgress.actionStatement1 &&
          newProgress.businessPlanAnswer1 &&
          newProgress.surveyRating1 !== null &&
          newProgress.surveyRating2 !== null &&
          newProgress.surveyRating3 !== null &&
          newProgress.postAssessmentRequired
        );
      } else {
        newProgress.lookForwardComplete = !!(
          newProgress.keyTruthReflection &&
          newProgress.actionStatement1 &&
          newProgress.businessPlanAnswer1 &&
          newProgress.surveyRating1 !== null &&
          newProgress.surveyRating2 !== null &&
          newProgress.surveyRating3 !== null
        );
      }
      
      return newProgress;
    });
  };

  // Save progress to database
  const saveProgressToDatabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !session) return;

      // Create unique session identifier: module_id * 10 + session_number
      // Module 1 Session 1 = 11, Module 3 Session 2 = 32, etc.
      const uniqueSessionId = parseInt(moduleId) * 10 + parseInt(sessionId);

      // Save progress to user_progress table
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          session_id: uniqueSessionId,
          completion_percentage: userProgress.lookForwardComplete ? 100 : 
                                userProgress.lookUpComplete ? 66 : 
                                userProgress.lookBackComplete ? 33 : 0,
          video_watched: userProgress.videoWatched,
          quiz_completed: userProgress.quizAnswer !== null,
          quiz_score: userProgress.quizAnswer !== null ? userProgress.quizAnswer + 1 : null,
          completed_sections: JSON.stringify({
            lookBack: userProgress.lookBackComplete,
            lookUp: userProgress.lookUpComplete,
            lookForward: userProgress.lookForwardComplete
          }),
          video_completion_percentage: userProgress.videoWatched ? 100 : 0,
          opening_confidence_rating: 3, // Default for now
          closing_confidence_rating: userProgress.lookForwardComplete ? 4 : null,
          completed_at: userProgress.lookForwardComplete ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving progress:', error);
      } else {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Save progress when user completes sections
  useEffect(() => {
    if (session && (userProgress.lookBackComplete || userProgress.lookUpComplete || userProgress.lookForwardComplete)) {
      saveProgressToDatabase();
    }
  }, [userProgress.lookBackComplete, userProgress.lookUpComplete, userProgress.lookForwardComplete]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Session</div>
          <p className="text-gray-600 mb-4">{error || 'Session not found'}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
            <p className="opacity-90">Module {moduleId}: {currentModule?.name}</p>
            {session.subtitle && (
              <p className="text-yellow-200 mt-1">{session.subtitle}</p>
            )}
            {isFinalCourseSession() && (
              <div className="mt-3 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-lg p-3">
                <p className="text-yellow-100 font-semibold">🎉 Final Session - Post-Assessment Required for Completion</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {[
              { key: 'lookback', label: 'Look Back', icon: '👀' },
              { key: 'lookup', label: 'Look Up', icon: '📖' },
              { key: 'lookforward', label: 'Look Forward', icon: '🎯' }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setCurrentSection(section.key as 'lookback' | 'lookup' | 'lookforward')}
                className={`flex-1 py-6 text-center ${
                  currentSection === section.key ? 'border-b-4 border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="text-4xl mb-2">{section.icon}</div>
                <div className="font-semibold">{section.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Look Back Section */}
        {currentSection === 'lookback' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Opening Prayer</h3>
              <p className="text-gray-700 italic mb-4">
                {isFinalCourseSession() 
                  ? "Lord, as I complete this incredible journey, help me reflect on all You've taught me and prepare my heart for the transformation assessment ahead. Amen."
                  : "Lord, as I look back on my recent journey, help me learn from my experiences and be open to Your guidance. Amen."
                }
              </p>
            </div>
            
            {/* Hook Section */}
            {session.hook && (
              <div className="bg-blue-50 rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">💡 Session Hook</h3>
                <p className="text-gray-700">{session.hook}</p>
              </div>
            )}

            {/* Final Session Reflection */}
            {isFinalCourseSession() && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">🌟 Course Journey Reflection</h3>
                <p className="text-gray-700 mb-4">
                  You've completed an amazing 20-session journey through Faith-Driven Business principles. Take a moment to reflect on:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>How your understanding of business as ministry has evolved</li>
                  <li>The specific biblical principles you'll implement in your business</li>
                  <li>The relationships and partnerships you want to develop</li>
                  <li>Your vision for kingdom impact through your marketplace influence</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Look Up Section */}
        {currentSection === 'lookup' && (
          <div className="space-y-8">
            {/* Scripture */}
            {session.scripture && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">�� Biblical Foundation</h3>
                <div className="font-bold text-blue-600 mb-2">{session.scripture.reference}</div>
                <div className="text-gray-700 italic">"{session.scripture.text}"</div>
              </div>
            )}

            {/* Main Content */}
            {session.content && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">📝 Written Material</h3>
                  <button
                    onClick={() => updateProgress({writtenMaterialRead: true})}
                    className={`px-4 py-2 rounded ${
                      userProgress.writtenMaterialRead ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {userProgress.writtenMaterialRead ? '✓ Read' : 'Mark as Read'}
                  </button>
                </div>
                <div className="text-gray-700 prose max-w-none">
                  {typeof session.content === 'string' ? (
                    <p>{session.content}</p>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: JSON.stringify(session.content) }} />
                  )}
                </div>
              </div>
            )}

            {/* Video */}
            {session.video_url && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">📺 Training Video</h3>
                  <button
                    onClick={() => updateProgress({videoWatched: true})}
                    className={`px-4 py-2 rounded ${
                      userProgress.videoWatched ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {userProgress.videoWatched ? '✓ Watched' : 'Mark as Watched'}
                  </button>
                </div>
                <div className="bg-gray-100 rounded aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">▶️</div>
                    <p>Video: {session.video_url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">🧠 Knowledge Check</h3>
              <p className="mb-4">
                {isFinalCourseSession() 
                  ? "What is the ultimate goal of a Faith-Driven business?"
                  : "What is the primary biblical foundation for business?"
                }
              </p>
              <div className="space-y-2">
                {(isFinalCourseSession() ? [
                  "Maximum financial profit",
                  "Personal success and recognition",
                  "Multiplying disciples and advancing God's kingdom",
                  "Building the largest possible business"
                ] : [
                  "Business is a necessary evil",
                  "Business reflects God's image and calling",
                  "Business should be separate from faith",
                  "Business is only acceptable if explicitly Christian"
                ]).map((option: string, index: number) => (
                  <label key={index} className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="quiz"
                      checked={userProgress.quizAnswer === index}
                      onChange={() => updateProgress({quizAnswer: index})}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reflection */}
            {session.reflection && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">💭 Personal Reflection</h3>
                <p className="mb-4">{session.reflection}</p>
                <textarea
                  value={userProgress.personalReflection}
                  onChange={(e) => updateProgress({personalReflection: e.target.value})}
                  className="w-full h-32 p-3 border rounded"
                  placeholder="Write your reflection here..."
                />
              </div>
            )}

            {/* FAQ */}
            {session.faq_questions && session.faq_questions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">❓ FAQ</h3>
                  <button
                    onClick={() => updateProgress({faqReviewed: true})}
                    className={`px-4 py-2 rounded ${
                      userProgress.faqReviewed ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {userProgress.faqReviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                  </button>
                </div>
                <div className="space-y-3">
                  {session.faq_questions.map((faq: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p>{faq}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Look Forward Section */}
        {currentSection === 'lookforward' && (
          <div className="space-y-8">
            {/* Key Truth */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">💡 Key Truth Reflection</h3>
              <textarea
                value={userProgress.keyTruthReflection}
                onChange={(e) => updateProgress({keyTruthReflection: e.target.value})}
                className="w-full h-32 p-3 border rounded"
                placeholder={isFinalCourseSession() 
                  ? "What are the most important insights from your entire Faith-Driven Business journey?"
                  : "What are the key insights from this session?"
                }
              />
            </div>

            {/* Action Statement */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Action Statement</h3>
              <textarea
                value={userProgress.actionStatement1}
                onChange={(e) => updateProgress({actionStatement1: e.target.value})}
                className="w-full h-24 p-3 border rounded"
                placeholder={isFinalCourseSession() 
                  ? "What are your top 3 implementation steps for launching your Faith-Driven business?"
                  : "What specific action will you take before the next session?"
                }
              />
            </div>

            {/* Business Plan */}
            {session.business_plan_questions && session.business_plan_questions.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">💼 Business Plan Integration</h3>
                <p className="mb-3">{session.business_plan_questions[0]}</p>
                <textarea
                  value={userProgress.businessPlanAnswer1}
                  onChange={(e) => updateProgress({businessPlanAnswer1: e.target.value})}
                  className="w-full h-24 p-3 border rounded"
                  placeholder="Your response will be integrated into your business plan..."
                />
              </div>
            )}

            {/* POST-ASSESSMENT SECTION - Only for Final Session */}
            {isFinalCourseSession() && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-700">⭐ Final Assessment Required</h3>
                <div className="bg-white rounded p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    <strong>Before completing this course, you must take the post-assessment to:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Measure your transformation and growth</li>
                    <li>Compare your progress from the beginning</li>
                    <li>Demonstrate the course's impact on your thinking</li>
                    <li>Earn your Faith-Driven Business certificate</li>
                  </ul>
                  <p className="text-orange-600 font-semibold">
                    The post-assessment will be automatically launched when you complete this session.
                  </p>
                </div>
                <label className="flex items-center gap-3 p-3 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={userProgress.postAssessmentRequired}
                    onChange={(e) => updateProgress({postAssessmentRequired: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">
                    I understand that I need to complete the post-assessment to finish the course and earn my certificate.
                  </span>
                </label>
              </div>
            )}

            {/* Survey */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">📊 Session Feedback</h3>
              {([
                isFinalCourseSession() ? "How valuable was this entire course?" : "How valuable was this session?",
                "How clear was the material?",
                "How likely are you to apply what you learned?"
              ]).map((question: string, index: number) => (
                <div key={index} className="mb-6">
                  <p className="mb-3">{question}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating: number) => (
                      <button
                        key={rating}
                        onClick={() => updateSurveyRating(index, rating)}
                        className={`w-12 h-12 rounded-full font-bold ${
                          getSurveyRating(index) === rating
                            ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Button */}
            {userProgress.lookForwardComplete && (
              <div className={`${
                isFinalCourseSession() ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-green-500'
              } text-white rounded-lg p-6 text-center`}>
                <h3 className="text-xl font-bold mb-2">
                  {isFinalCourseSession() ? '🎉 Ready for Post-Assessment!' : '🏆 Session Complete!'}
                </h3>
                <p className="mb-4">
                  {isFinalCourseSession() 
                    ? 'Congratulations! You\'ve completed all 20 sessions. Time to measure your transformation and earn your certificate!' 
                    : 'Great work! Ready for the next session?'
                  }
                </p>
                <button 
                  onClick={navigateToNextSession}
                  className={`${
                    isFinalCourseSession() ? 'bg-white text-blue-600' : 'bg-white text-green-500'
                  } px-6 py-3 rounded-lg font-bold text-lg`}
                >
                  {isFinalCourseSession() ? '📊 Take Post-Assessment & Get Certificate' : 'Next Session →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
