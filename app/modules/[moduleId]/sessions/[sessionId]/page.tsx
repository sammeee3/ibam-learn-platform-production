'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Session data structure - dynamic content per session
const sessionData: Record<string, Record<string, any>> = {
  "1": {
    "1": {
      title: "Business is a Good Gift from God",
      module: "Foundational Principles",
      scripture: {
        reference: "Genesis 1:26",
        text: "Then God said, 'Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.'"
      },
      videoUrl: "https://vimeo.com/your-video-id",
      writtenMaterial: "God designed humans to be creative, productive, and to exercise dominion over creation. Business is not a necessary evil or distraction from spiritual matters - it's a reflection of God's image in us. When we create value, serve others, and steward resources well, we mirror our Creator's character.",
      reflection: "How does viewing business as a reflection of God's image change your perspective on your work?",
      becomingGodsEntrepreneur: {
        content: "As God's entrepreneur, you're called to blend excellence with integrity, profit with purpose, and success with service.",
        questions: [
          "What would change in your business if you truly believed it was a gift from God?",
          "How can your business reflect God's creativity and generosity?"
        ]
      },
      caseStudy: "Sarah owns a local bakery. She started viewing her business as ministry when she realized that providing excellent bread and pastries was serving her community. She began praying over her work, treating employees as family, and donating day-old goods to the homeless shelter.",
      faqQuestions: [
        "Q: Can I really make money and still honor God? A: Yes! God desires us to prosper while maintaining integrity.",
        "Q: What if my business isn't explicitly Christian? A: Your character and excellence can reflect Christ in any business.",
        "Q: How do I balance profit and generosity? A: Sustainable generosity requires profitable operations."
      ],
      businessPlanQuestions: [
        "How will your business reflect God's character and values?",
        "What impact do you want your business to have on your community?",
        "How can your business serve as a platform for spiritual conversations?"
      ]
    },
    "2": {
      title: "Business Leaders Work Together with Church/Spiritual Leaders",
      module: "Foundational Principles",
      scripture: {
        reference: "1 Corinthians 12:12-14",
        text: "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ. For we were all baptized by one Spirit so as to form one body—whether Jews or Gentiles, slave or free—and we were all given the one Spirit to drink. Even so the body is not made up of one part but of many."
      },
      videoUrl: "https://vimeo.com/your-video-id-2",
      writtenMaterial: "The church and marketplace are not separate kingdoms but different parts of God's single kingdom. Business leaders bring resources, organizational skills, and community connections. Church leaders bring spiritual wisdom, pastoral care, and theological grounding. Together, they can accomplish kingdom work neither could achieve alone.",
      reflection: "What unique strengths do you bring as a business leader that could benefit your local church or community ministry?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs understand they're part of a larger body, working in harmony with spiritual leaders to advance God's kingdom.",
        questions: [
          "How can you partner with church leaders without compromising your business integrity?",
          "What kingdom projects could benefit from your business skills and resources?"
        ]
      },
      caseStudy: "Mark, a construction company owner, partnered with his pastor to build homes for single mothers. The church provided spiritual care and community support while Mark's business provided construction expertise and materials at cost.",
      faqQuestions: [
        "Q: What if my pastor doesn't understand business? A: Start small, build trust, and educate gently.",
        "Q: How do I avoid being seen as just a source of money? A: Offer your skills and expertise, not just finances.",
        "Q: What if business and church priorities conflict? A: Seek wisdom through prayer and trusted advisors."
      ],
      businessPlanQuestions: [
        "What partnerships could you develop between your business and local church/ministry leaders?",
        "How can your business skills serve kingdom purposes beyond just financial giving?",
        "What community needs could be addressed through business-ministry collaboration?"
      ]
    },
    "3": {
      title: "Integrity in Business Practices",
      module: "Foundational Principles", 
      scripture: {
        reference: "Proverbs 11:1",
        text: "The Lord detests dishonest scales, but accurate weights find favor with him."
      },
      videoUrl: "https://vimeo.com/your-video-id-3",
      writtenMaterial: "Integrity in business means more than just avoiding obvious fraud - it means complete honesty in all dealings, fair treatment of employees and customers, and transparency in communication. God cares about the details of how we conduct business because our character is revealed in small decisions as much as large ones.",
      reflection: "What areas of your business practices need greater alignment with biblical integrity standards?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs build their reputation on trustworthiness, knowing that integrity is the foundation of sustainable business relationships.",
        questions: [
          "How can you demonstrate integrity even when it costs you short-term profit?",
          "What systems can you put in place to ensure honest practices throughout your business?"
        ]
      },
      caseStudy: "Tom's auto repair shop built a loyal customer base by providing honest estimates, explaining all work performed, and standing behind their repairs with genuine warranties. While competitors cut corners, Tom's integrity-based approach led to sustainable growth.",
      faqQuestions: [
        "Q: What if being completely honest hurts my competitiveness? A: Long-term trust builds stronger business than short-term deception.",
        "Q: How detailed should I be about problems or limitations? A: Transparent communication builds credibility.",
        "Q: What if my industry standard practices seem questionable? A: Be the example of a better way to do business."
      ],
      businessPlanQuestions: [
        "What specific integrity standards will guide your business decisions?",
        "How will you communicate your commitment to honesty with customers and employees?",
        "What accountability measures will you implement to maintain high integrity standards?"
      ]
    },
    "4": {
      title: "Stewardship and Resource Management",
      module: "Foundational Principles",
      scripture: {
        reference: "Luke 16:10",
        text: "Whoever is faithful in very little is also faithful in much, and whoever is dishonest in very little is also dishonest in much."
      },
      videoUrl: "https://vimeo.com/your-video-id-4",
      writtenMaterial: "Everything we have - money, time, talents, opportunities - ultimately belongs to God. We are stewards, not owners. This perspective changes how we make decisions about spending, investing, hiring, and growing our businesses. Good stewardship means maximizing the return on God's investment in us while serving others and advancing His kingdom.",
      reflection: "How does viewing yourself as a steward rather than an owner change your approach to business decisions?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs recognize their role as stewards of divine resources, making decisions that honor the true Owner while serving others effectively.",
        questions: [
          "What would change in your financial decisions if you truly believed everything belongs to God?",
          "How can you balance wise business growth with generous kingdom investment?"
        ]
      },
      caseStudy: "Maria's consulting firm implemented a stewardship model: 10% of profits go to kingdom work, employees receive profit sharing, and business decisions prioritize long-term value creation over short-term gains. This approach attracted top talent and loyal clients.",
      faqQuestions: [
        "Q: Does stewardship mean I can't build wealth? A: Good stewards can build wealth responsibly while serving others.",
        "Q: How much should I give away vs. reinvest in business? A: Seek God's guidance for your specific situation and season.",
        "Q: What if I disagree with how others think I should use 'my' resources? A: You're accountable to God first, but wisdom seeks godly counsel."
      ],
      businessPlanQuestions: [
        "How will you demonstrate faithful stewardship in your business operations?",
        "What percentage of profits will you allocate to kingdom advancement?",
        "How will you balance reinvestment, personal income, and generosity in your financial planning?"
      ]
    }
  },
  "2": {
    "1": {
      title: "Reasons for Failure",
      module: "Success and Failure Factors",
      scripture: {
        reference: "Proverbs 19:21",
        text: "Many are the plans in a person's heart, but it is the Lord's purpose that prevails."
      },
      videoUrl: "https://vimeo.com/your-video-id-3",
      writtenMaterial: "Most business failures stem from preventable causes: inadequate planning, poor cash flow management, misunderstanding the market, or lack of differentiation. However, even with perfect planning, we must hold our plans loosely and trust God's sovereignty.",
      reflection: "Looking at your current business situation, which failure factors pose the greatest risk, and how can you address them?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs plan diligently while holding outcomes loosely, trusting that God's purposes will prevail.",
        questions: [
          "How do you balance careful planning with trusting God's sovereignty?",
          "What would it look like to 'fail successfully' in a way that honors God?"
        ]
      },
      caseStudy: "David's restaurant failed after 18 months due to poor location analysis and cash flow problems. Instead of becoming bitter, he used the experience to mentor other entrepreneurs, helping them avoid similar pitfalls while trusting God's plan for his life.",
      faqQuestions: [
        "Q: Is business failure a sign God doesn't want me in business? A: Not necessarily - failure can be education or redirection.",
        "Q: How do I recover from a major business failure? A: Learn, heal, rebuild slowly, and trust God's timing.",
        "Q: What if I'm afraid of failing? A: Perfect planning reduces risk, but faith conquers fear."
      ],
      businessPlanQuestions: [
        "What are the top 3 risks that could cause your business to fail, and how will you mitigate them?",
        "How will you monitor key performance indicators to detect problems early?",
        "What contingency plans do you need for various failure scenarios?"
      ]
    }
  }
};

// Module configuration for navigation
const moduleConfig = {
  "1": { name: "Foundational Principles", totalSessions: 4 },
  "2": { name: "Success and Failure Factors", totalSessions: 4 },
  "3": { name: "Marketing", totalSessions: 5 },
  "4": { name: "Finance", totalSessions: 4 },
  "5": { name: "Business Planning", totalSessions: 3 }
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;
  
  // User profile state
  const [userProfile, setUserProfile] = useState<any>(null);
  const [lastActivity, setLastActivity] = useState<any>(null);
  
  // Get session data or fallback
  const session = sessionData[moduleId]?.[sessionId] || {
    title: "Session Content Loading...",
    module: "Module Loading...",
    scripture: { reference: "Loading...", text: "Content being prepared..." },
    videoUrl: "",
    writtenMaterial: "Content loading...",
    reflection: "Content loading...",
    becomingGodsEntrepreneur: { content: "Loading...", questions: ["Loading..."] },
    caseStudy: "Loading...",
    faqQuestions: ["Loading..."],
    businessPlanQuestions: ["Loading..."]
  };

  // Get module configuration
  const currentModule = moduleConfig[moduleId as keyof typeof moduleConfig];
  const totalSessions = currentModule?.totalSessions || 4;

  // Learning mode and current section state
  const [learningMode, setLearningMode] = useState<'quick' | 'normal'>('normal');
  const [currentSection, setCurrentSection] = useState<'lookback' | 'lookup' | 'lookforward'>('lookback');
  const [scriptureExpanded, setScriptureExpanded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Comprehensive progress state with bulletproof auto-save
  const [userProgress, setUserProgress] = useState({
    // Look Back progress
    lookBackComplete: false,
    lookBackPrayer: '',
    actionStepExperience: '',
    whyDidntComplete: '',
    howDidItGo: '',
    whoDidYouTell: '',
    whoSpecifically: '',
    visionReflection: '',
    winsReflection: '',
    
    // Look Up progress  
    lookUpComplete: false,
    lookUpPrayer: '',
    writtenMaterialRead: false,
    videoWatched: false,
    quizAnswer: null as number | null,
    personalReflection: '',
    entrepreneurReflection: '',
    caseStudyNotes: '',
    faqReviewed: false,
    coachingQuestion: '',
    
    // Look Forward progress
    lookForwardComplete: false,
    lookForwardPrayer: '',
    keyTruthReflection: '',
    actionStatement1: '',
    actionStatement2: '',
    actionStatement3: '',
    businessPlanAnswer1: '',
    businessPlanAnswer2: '', 
    businessPlanAnswer3: '',
    surveyRating1: null as number | null,
    surveyRating2: null as number | null,
    surveyRating3: null as number | null,
    surveyFeedback: '',
    
    // Session meta
    sessionStartTime: Date.now(),
    lastSaveTime: Date.now(),
    completionPercentage: 0
  });

  // Load user profile and last activity
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // TODO: Replace with actual Supabase calls
        // Mock user profile - replace with real data
        const mockProfile = {
          id: 'user123',
          first_name: 'John', // This will replace email display
          last_name: 'Smith',
          email: 'john.smith@example.com'
        };
        setUserProfile(mockProfile);

        // Mock last activity - replace with real data
        const mockLastActivity = {
          module_id: moduleId,
          session_id: sessionId,
          section: 'lookup',
          timestamp: Date.now()
        };
        setLastActivity(mockLastActivity);

        // const { data: profile } = await supabase
        //   .from('profiles')
        //   .select('first_name, last_name, email')
        //   .eq('id', userId)
        //   .single();
        // setUserProfile(profile);

        // const { data: activity } = await supabase
        //   .from('user_progress')
        //   .select('*')
        //   .eq('user_id', userId)
        //   .order('updated_at', { ascending: false })
        //   .limit(1)
        //   .single();
        // setLastActivity(activity);

      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Load saved progress from localStorage immediately
  useEffect(() => {
    const localKey = `ibam-session-${moduleId}-${sessionId}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setUserProgress(prev => ({...prev, ...parsedData}));
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, [moduleId, sessionId]);

  // Bulletproof auto-save: localStorage immediately + Supabase backup
  useEffect(() => {
    const localKey = `ibam-session-${moduleId}-${sessionId}`;
    
    // Immediate local save
    localStorage.setItem(localKey, JSON.stringify(userProgress));
    
    // Debounced Supabase save
    const saveTimer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        // TODO: Replace with actual Supabase call
        // await supabase.from('session_progress').upsert({
        //   user_id: userId,
        //   module_id: moduleId,
        //   session_id: sessionId,
        //   progress_data: userProgress,
        //   updated_at: new Date()
        // });
        
        setSaveStatus('saved');
        setUserProgress(prev => ({...prev, lastSaveTime: Date.now()}));
      } catch (error) {
        console.error('Save error:', error);
        setSaveStatus('error');
      }
    }, 3000);

    return () => clearTimeout(saveTimer);
  }, [userProgress, moduleId, sessionId]);

  // Navigation functions
  const navigateToModules = () => {
    router.push('/modules');
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const continueLearning = () => {
    if (lastActivity && lastActivity.section) {
      setCurrentSection(lastActivity.section);
    }
  };

  const navigateToSession = (targetSessionId: string) => {
    router.push(`/modules/${moduleId}/sessions/${targetSessionId}`);
  };

  const navigateToPreviousSession = () => {
    const prevSessionId = parseInt(sessionId) - 1;
    if (prevSessionId >= 1) {
      navigateToSession(prevSessionId.toString());
    } else {
      // Go to previous module's last session
      const prevModuleId = parseInt(moduleId) - 1;
      if (prevModuleId >= 1) {
        const prevModule = moduleConfig[prevModuleId.toString() as keyof typeof moduleConfig];
        router.push(`/modules/${prevModuleId}/sessions/${prevModule.totalSessions}`);
      }
    }
  };

  // 🆕 UPDATED: Navigate to next session with Module 1 completion logic
  const navigateToNextSession = () => {
    const nextSessionId = parseInt(sessionId) + 1;
    
    // Check if this is the end of Module 1 (Module 1, Session 4)
    if (moduleId === "5" moduleId === "1" && sessionId === "4"moduleId === "1" && sessionId === "4" sessionId === "3" && userProgress.lookForwardComplete) {
      // Mark Module 1 as completed
      localStorage.setItem('ibam-module-5-completed', 'true');
      console.log('🎉 Module 1 completed! Redirecting to post-assessment...');
      
      // Redirect to post-assessment instead of next module
      router.push('/assessment/post');
      return;
    }
    
    // Normal navigation logic for other sessions
    if (nextSessionId <= totalSessions) {
      navigateToSession(nextSessionId.toString());
    } else {
      // Go to next module's first session
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 5) { // Assuming 5 modules total
        router.push(`/modules/${nextModuleId}/sessions/1`);
      }
    }
  };

  // 🆕 HELPER: Check if this is the final session of Module 1
  const isFinalCourseSession = () => {
    return moduleId === "5" moduleId === "1" && sessionId === "4"moduleId === "1" && sessionId === "4" sessionId === "3";
  };

  // Calculate completion and check section requirements
  const checkLookBackComplete = () => {
    return !!(
      userProgress.actionStepExperience &&
      (userProgress.actionStepExperience === 'didnt' ? userProgress.whyDidntComplete : 
       (userProgress.howDidItGo && userProgress.whoDidYouTell))
    );
  };

  const checkLookUpComplete = () => {
    return !!(
      userProgress.writtenMaterialRead &&
      userProgress.videoWatched &&
      userProgress.quizAnswer !== null &&
      userProgress.personalReflection &&
      userProgress.faqReviewed
    );
  };

  const checkLookForwardComplete = () => {
    return !!(
      userProgress.keyTruthReflection &&
      userProgress.actionStatement1 &&
      userProgress.businessPlanAnswer1 &&
      userProgress.surveyRating1 !== null &&
      userProgress.surveyRating2 !== null &&
      userProgress.surveyRating3 !== null
    );
  };

  // Update progress and auto-check section completion
  const updateProgress = (updates: Partial<typeof userProgress>) => {
    setUserProgress(prev => {
      const newProgress = {...prev, ...updates};
      
      // Auto-check section completion
      newProgress.lookBackComplete = checkLookBackComplete();
      newProgress.lookUpComplete = checkLookUpComplete();
      newProgress.lookForwardComplete = checkLookForwardComplete();
      
      // Calculate overall completion
      const totalSections = 3;
      const completedSections = [
        newProgress.lookBackComplete,
        newProgress.lookUpComplete, 
        newProgress.lookForwardComplete
      ].filter(Boolean).length;
      
      newProgress.completionPercentage = Math.round((completedSections / totalSections) * 100);
      
      return newProgress;
    });
  };

  // Section navigation with locking
  const canAccessSection = (section: 'lookback' | 'lookup' | 'lookforward') => {
    if (section === 'lookback') return true;
    if (section === 'lookup') return userProgress.lookBackComplete;
    if (section === 'lookforward') return userProgress.lookBackComplete && userProgress.lookUpComplete;
    return false;
  };

  // Get previous session action steps (this would eventually come from database)
  const getPreviousActionSteps = () => {
    // Mock previous session data - replace with actual database call
    const prevModuleId = moduleId === "1" && sessionId === "1" ? null : 
                        sessionId === "1" ? (parseInt(moduleId) - 1).toString() : moduleId;
    const prevSessionId = sessionId === "1" ? "4" : (parseInt(sessionId) - 1).toString(); // Assuming 4 sessions per module
    
    if (!prevModuleId) return []; // First session has no previous actions
    
    // Mock previous action statements - replace with actual retrieval
    return [
      "I will pray for 5 minutes each morning at 6 AM",
      "I will call 3 potential customers by name daily for one week", 
      "I will review my business expenses every evening before bed"
    ];
  };

  const previousActionSteps = getPreviousActionSteps();
  
  const exportUserData = () => {
    const exportData = {
      sessionInfo: {
        module: session.module,
        title: session.title,
        moduleId,
        sessionId,
        completedAt: new Date().toISOString()
      },
      responses: userProgress
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IBAM-Session-${moduleId}-${sessionId}-Data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fafc'}}>
      {/* ENHANCED IBAM Header with Navigation */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={navigateToDashboard}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
              >
                🏠 Dashboard
              </button>
              <button 
                onClick={navigateToModules}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
              >
                📚 All Modules
              </button>
              {lastActivity && (
                <button 
                  onClick={continueLearning}
                  className="bg-[#10b981] hover:bg-[#10b981]/80 px-4 py-2 rounded-lg text-white font-bold transition-all flex items-center gap-2"
                >
                  🎯 Continue Learning
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={exportUserData}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2"
              >
                📥 Download My Work
              </button>
              {userProfile && (
                <div className="text-white/90 text-right">
                  <div className="font-semibold">Welcome back, {userProfile.first_name}!</div>
                  <div className="text-sm opacity-75">{userProfile.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <button onClick={navigateToDashboard} className="hover:text-white">Dashboard</button>
            <span>→</span>
            <button onClick={navigateToModules} className="hover:text-white">Modules</button>
            <span>→</span>
            <button onClick={() => router.push(`/modules/${moduleId}`)} className="hover:text-white">
              Module {moduleId}: {currentModule?.name}
            </button>
            <span>→</span>
            <span className="text-white font-semibold">Session {sessionId}</span>
          </div>

          {/* Session Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* IBAM Logo */}
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo" 
                className="h-12 md:h-16 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <div>
                <div className="text-white/90 text-sm md:text-base mb-1">
                  Module {moduleId}: {session.module}
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  {session.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: '#10b981'}}></span>
                    {userProgress.completionPercentage}% complete
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      saveStatus === 'saved' ? 'bg-green-400' : 
                      saveStatus === 'saving' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></span>
                    <span className="hidden sm:inline">
                      {saveStatus === 'saved' ? 'All changes saved' :
                       saveStatus === 'saving' ? 'Saving...' : 'Save error (data safe locally)'}
                    </span>
                  </div>
                  {/* 🆕 Module 1 Final Session Indicator */}
                  {isFinalCourseSession() && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="hidden sm:inline">📊 Post-Assessment after completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Session Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button 
              onClick={navigateToPreviousSession}
              disabled={moduleId === "1" && sessionId === "1"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                moduleId === "1" && sessionId === "1" 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              ← Previous Session
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-white/80">Session {sessionId} of {totalSessions}</span>
              <select 
                value={sessionId}
                onChange={(e) => navigateToSession(e.target.value)}
                className="bg-white/20 text-white rounded-lg px-3 py-1 border border-white/30"
              >
                {Array.from({length: totalSessions}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className="text-gray-900">
                    Session {num}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={navigateToNextSession}
              disabled={moduleId === "5" && sessionId === totalSessions.toString()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                moduleId === "5" && sessionId === totalSessions.toString()
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isFinalCourseSession() ? 'Complete Course →' : 'Next Session →'}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${userProgress.completionPercentage}%`,
                background: 'linear-gradient(90deg, #4ECDC4 0%, #10b981 100%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Learning Mode Selection - Mobile Optimized */}
      <div className="bg-white border-b" style={{borderColor: '#e2e8f0'}}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative group">
              <button
                onClick={() => setLearningMode('quick')}
                className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all text-center ${
                  learningMode === 'quick' 
                    ? 'border-[#4ECDC4] bg-[#4ECDC4]/10' 
                    : 'border-[#e2e8f0] hover:border-[#4ECDC4]/50'
                }`}
              >
                <div className="text-3xl md:text-4xl mb-2">⚡</div>
                <div className="font-semibold text-lg md:text-xl" style={{color: '#2C3E50'}}>Quick</div>
                <div className="text-sm md:text-base text-gray-600">5-10 min</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">Essential insights only</div>
              </button>
              
              {/* Quick Mode Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-[#2C3E50] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs">
                <div className="font-semibold mb-1">⚡ Quick Mode:</div>
                <div className="text-left text-xs">
                  • Key insights only (200 words)<br/>
                  • Skip detailed content<br/>
                  • Quick reflection questions<br/>
                  • Fast clicking experience<br/>
                  • Perfect for busy schedules
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2C3E50]"></div>
              </div>
            </div>
            
            <div className="relative group">
              <button
                onClick={() => setLearningMode('normal')}
                className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all text-center ${
                  learningMode === 'normal' 
                    ? 'border-[#4ECDC4] bg-[#4ECDC4]/10' 
                    : 'border-[#e2e8f0] hover:border-[#4ECDC4]/50'
                }`}
              >
                <div className="text-3xl md:text-4xl mb-2">📚</div>
                <div className="font-semibold text-lg md:text-xl" style={{color: '#2C3E50'}}>Normal</div>
                <div className="text-sm md:text-base text-gray-600">15-20 min</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">Complete experience</div>
              </button>
              
              {/* Normal Mode Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-[#2C3E50] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs">
                <div className="font-semibold mb-1">📚 Normal Mode:</div>
                <div className="text-left text-xs">
                  • Full written material<br/>
                  • Complete video content<br/>
                  • Knowledge check quiz<br/>
                  • Detailed reflections<br/>
                  • FAQ section<br/>
                  • Comprehensive learning
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2C3E50]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Section Navigation - Large Mobile Buttons */}
      <div className="bg-white border-b" style={{borderColor: '#e2e8f0'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {[
              { 
                key: 'lookback', 
                label: 'Look Back', 
                icon: '👀', 
                subtitle: 'Reflect & Pray',
                businessTerms: 'Accountability • Vision • Prayer',
                complete: userProgress.lookBackComplete,
                requirements: 'Complete action step experience + vision reflection'
              },
              { 
                key: 'lookup', 
                label: 'Look Up', 
                icon: '📖', 
                subtitle: 'Learn & Grow',
                businessTerms: 'Learning Objectives • Content • Knowledge Check • Reflection',
                complete: userProgress.lookUpComplete,
                requirements: 'Read material + watch video + quiz + reflection + FAQ review'
              },
              { 
                key: 'lookforward', 
                label: 'Look Forward', 
                icon: '🎯', 
                subtitle: 'Apply & Plan',
                businessTerms: 'Action Planning • Business Plan Builder • Survey',
                complete: userProgress.lookForwardComplete,
                requirements: 'Key reflections + action statement + business plan answer + survey'
              }
            ].map((section, index) => {
              const isAccessible = canAccessSection(section.key as any);
              const isActive = currentSection === section.key;
              const isLocked = !isAccessible;
              
              return (
                <div key={section.key} className="flex-1 relative group">
                  <button
                    onClick={() => isAccessible && setCurrentSection(section.key as any)}
                    disabled={isLocked}
                    className={`w-full py-6 md:py-8 px-2 md:px-4 relative transition-all ${
                      isActive 
                        ? 'bg-[#4ECDC4]/10 border-b-4' 
                        : isAccessible 
                          ? 'hover:bg-gray-50' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      borderBottomColor: isActive ? '#4ECDC4' : 'transparent'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl mb-2">
                        {isLocked ? '🔒' : section.icon}
                      </div>
                      <div className={`font-semibold text-lg md:text-xl ${
                        isActive ? 'text-[#4ECDC4]' : 'text-[#2C3E50]'
                      }`}>
                        {section.label}
                      </div>
                      <div className="text-sm md:text-base text-gray-600 mt-1">
                        {section.subtitle}
                      </div>
                      {section.complete && (
                        <div className="text-2xl md:text-3xl mt-2">✅</div>
                      )}
                      {isLocked && (
                        <div className="text-xs md:text-sm text-gray-500 mt-2">
                          Complete previous section
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Business Terms Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-[#2C3E50] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    <div className="font-semibold mb-1">Business Terms:</div>
                    <div>{section.businessTerms}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2C3E50]"></div>
                  </div>
                  
                  {/* Requirements Tooltip for Locked Sections */}
                  {isLocked && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs">
                      <div className="font-semibold mb-1">To unlock:</div>
                      <div>{section.requirements}</div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🆕 Module 1 Final Session Alert */}
      {isFinalCourseSession() && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-orange-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="bg-white rounded-xl border border-orange-200 p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🎉</div>
                <div>
                  <h4 className="font-bold text-orange-800 text-lg">Final Session of the Course!</h4>
                  <p className="text-orange-700">After completing this session, you'll take the post-assessment to measure your growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator - Shows what's needed to unlock next section */}
      <div className="bg-[#4ECDC4]/5 border-b" style={{borderColor: '#e2e8f0'}}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          {currentSection === 'lookback' && !userProgress.lookBackComplete && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <h4 className="font-semibold text-yellow-800 text-lg mb-2">📋 To unlock Look Up section:</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${userProgress.actionStepExperience ? 'text-green-600' : 'text-yellow-700'}`}>
                  {userProgress.actionStepExperience ? '✅' : '⏳'} Answer action step experience
                </div>
                {userProgress.actionStepExperience === 'didnt' && (
                  <div className={`flex items-center gap-2 ${userProgress.whyDidntComplete ? 'text-green-600' : 'text-yellow-700'}`}>
                    {userProgress.whyDidntComplete ? '✅' : '⏳'} Explain what prevented completion
                  </div>
                )}
                {userProgress.actionStepExperience === 'did' && (
                  <>
                    <div className={`flex items-center gap-2 ${userProgress.howDidItGo ? 'text-green-600' : 'text-yellow-700'}`}>
                      {userProgress.howDidItGo ? '✅' : '⏳'} Describe how it went
                    </div>
                    <div className={`flex items-center gap-2 ${userProgress.whoDidYouTell ? 'text-green-600' : 'text-yellow-700'}`}>
                      {userProgress.whoDidYouTell ? '✅' : '⏳'} Who did you tell?
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {currentSection === 'lookup' && !userProgress.lookUpComplete && userProgress.lookBackComplete && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h4 className="font-semibold text-blue-800 text-lg mb-2">📋 To unlock Look Forward section:</h4>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${userProgress.writtenMaterialRead ? 'text-green-600' : 'text-blue-700'}`}>
                  {userProgress.writtenMaterialRead ? '✅' : '⏳'} Read written material
                </div>
                <div className={`flex items-center gap-2 ${userProgress.videoWatched ? 'text-green-600' : 'text-blue-700'}`}>
                  {userProgress.videoWatched ? '✅' : '⏳'} Watch training video
                </div>
                <div className={`flex items-center gap-2 ${userProgress.quizAnswer !== null ? 'text-green-600' : 'text-blue-700'}`}>
                  {userProgress.quizAnswer !== null ? '✅' : '⏳'} Complete knowledge check
                </div>
                <div className={`flex items-center gap-2 ${userProgress.personalReflection ? 'text-green-600' : 'text-blue-700'}`}>
                  {userProgress.personalReflection ? '✅' : '⏳'} Write personal reflection
                </div>
                <div className={`flex items-center gap-2 ${userProgress.faqReviewed ? 'text-green-600' : 'text-blue-700'}`}>
                  {userProgress.faqReviewed ? '✅' : '⏳'} Review FAQ section
                </div>
              </div>
            </div>
          )}
          
          {currentSection === 'lookup' && userProgress.lookBackComplete && (
            <div className="bg-[#4ECDC4]/10 rounded-xl border border-[#4ECDC4]/20 p-4">
              <h4 className="font-semibold text-[#2C3E50] text-lg mb-2">📚 Look Up Progress:</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${((
                        Number(userProgress.writtenMaterialRead) +
                        Number(userProgress.videoWatched) +
                        Number(userProgress.quizAnswer !== null) +
                        Number(!!userProgress.personalReflection) +
                        Number(userProgress.faqReviewed)
                      ) / 5) * 100}%`,
                      background: 'linear-gradient(90deg, #4ECDC4 0%, #10b981 100%)'
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-[#2C3E50]">
                  {[
                    userProgress.writtenMaterialRead,
                    userProgress.videoWatched,
                    userProgress.quizAnswer !== null,
                    !!userProgress.personalReflection,
                    userProgress.faqReviewed
                  ].filter(Boolean).length}/5 Complete
                </span>
              </div>
            </div>
          )}
          
          {currentSection === 'lookforward' && !userProgress.lookForwardComplete && userProgress.lookUpComplete && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <h4 className="font-semibold text-green-800 text-lg mb-2">
                📋 To complete this session{isFinalCourseSession() ? ' & unlock post-assessment' : ''}:
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${userProgress.keyTruthReflection ? 'text-green-600' : 'text-green-700'}`}>
                  {userProgress.keyTruthReflection ? '✅' : '⏳'} Write key truth reflection
                </div>
                <div className={`flex items-center gap-2 ${userProgress.actionStatement1 ? 'text-green-600' : 'text-green-700'}`}>
                  {userProgress.actionStatement1 ? '✅' : '⏳'} Create action statement #1
                </div>
                <div className={`flex items-center gap-2 ${userProgress.businessPlanAnswer1 ? 'text-green-600' : 'text-green-700'}`}>
                  {userProgress.businessPlanAnswer1 ? '✅' : '⏳'} Answer business plan question #1
                </div>
                <div className={`flex items-center gap-2 ${userProgress.surveyRating1 && userProgress.surveyRating2 && userProgress.surveyRating3 ? 'text-green-600' : 'text-green-700'}`}>
                  {userProgress.surveyRating1 && userProgress.surveyRating2 && userProgress.surveyRating3 ? '✅' : '⏳'} Complete survey ratings
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        {/* LOOK BACK SECTION */}
        {currentSection === 'lookback' && (
          <div className="space-y-6 md:space-y-8">
            {/* Section Prayer */}
            <div className="bg-[#4ECDC4]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
                <span className="text-5xl md:text-6xl">🙏</span>
                Opening Prayer
              </h3>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
                <p className="text-gray-700 italic text-lg md:text-xl leading-relaxed mb-4">
                  "Lord, as I look back on my recent journey, I ask for Your Holy Spirit to enlighten my heart, 
                  teach me from my experiences, and make specific changes in my life and business. 
                  Help me to be honest about my progress and open to Your guidance. Amen."
                </p>
                <textarea
                  value={userProgress.lookBackPrayer}
                  onChange={(e) => updateProgress({lookBackPrayer: e.target.value})}
                  placeholder="Add your own prayer or reflection..."
                  className="w-full h-24 md:h-32 p-4 border-2 border-[#4ECDC4]/20 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Previous Session Action Steps */}
            {previousActionSteps.length > 0 && (
              <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6 md:p-8">
                <h3 className="font-bold text-blue-900 text-xl md:text-2xl mb-6 flex items-center gap-3">
                  <span className="text-5xl md:text-6xl">📋</span>
                  Your Previous Action Steps
                </h3>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-blue-100">
                  <p className="text-blue-800 font-semibold text-lg md:text-xl mb-4">
                    Here's what you committed to do last session:
                  </p>
                  <div className="space-y-3">
                    {previousActionSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="font-bold text-blue-600 text-lg">{index + 1}.</span>
                        <span className="text-gray-700 text-lg leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wins Since Last Session */}
            <div className="bg-gradient-to-r from-[#10b981]/10 to-[#4ECDC4]/10 rounded-2xl border-2 border-[#10b981]/20 p-6 md:p-8">
              <div className="group relative">
                <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3 cursor-help">
                  <span className="text-5xl md:text-6xl">🏆</span>
                  Celebrate Your Wins
                  <span className="text-lg">ℹ️</span>
                </h3>
                
                {/* Win Definition Hover Tooltip */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-4 py-3 bg-[#2C3E50] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-sm">
                  <div className="font-semibold mb-1">What counts as a WIN:</div>
                  <div className="text-left">
                    • Any progress toward your goals<br/>
                    • New insights or learning<br/>
                    • Overcoming obstacles<br/>
                    • Positive feedback from others<br/>
                    • Small steps forward<br/>
                    • God's provision or guidance
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2C3E50]"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#10b981]/20">
                <p className="text-[#2C3E50] font-semibold text-lg md:text-xl mb-4">
                  What wins, progress, or breakthroughs have you experienced since our last session? 
                  (Big or small - they all matter!)
                </p>
                <textarea
                  value={userProgress.winsReflection || ""}
                  onChange={(e) => updateProgress({winsReflection: e.target.value})}
                  className="w-full h-32 md:h-40 p-4 border-2 border-[#10b981]/20 rounded-xl focus:ring-2 focus:ring-[#10b981] text-lg"
                  placeholder="Celebrate your progress... new customers, breakthrough insights, answered prayers, overcoming fears, positive feedback, etc."
                />
              </div>
            </div>

            {/* Action Step Accountability */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-5xl md:text-6xl">📊</span>
                Last Session Action Steps
              </h3>
              
              <div className="space-y-6">
                <p className="font-semibold text-[#2C3E50] text-lg md:text-xl">
                  What was your experience accomplishing your action steps from the last session?
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 md:p-6 rounded-xl border-2 hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="action-experience"
                      value="didnt"
                      checked={userProgress.actionStepExperience === 'didnt'}
                      onChange={(e) => updateProgress({actionStepExperience: e.target.value})}
                      className="w-6 h-6 text-[#4ECDC4]"
                    />
                    <span className="text-lg md:text-xl">I didn't complete them</span>
                  </label>
                  
                  <label className="flex items-center gap-4 p-4 md:p-6 rounded-xl border-2 hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="action-experience"
                      value="did"
                      checked={userProgress.actionStepExperience === 'did'}
                      onChange={(e) => updateProgress({actionStepExperience: e.target.value})}
                      className="w-6 h-6 text-[#4ECDC4]"
                    />
                    <span className="text-lg md:text-xl">I completed them</span>
                  </label>
                </div>

                {userProgress.actionStepExperience === 'didnt' && (
                  <div className="ml-6 md:ml-10 space-y-4">
                    <label className="block text-lg font-semibold text-[#2C3E50]">
                      What prevented you from completing them?
                    </label>
                    <textarea
                      value={userProgress.whyDidntComplete}
                      onChange={(e) => updateProgress({whyDidntComplete: e.target.value})}
                      className="w-full h-32 md:h-40 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                      placeholder="Be honest about the obstacles you faced..."
                    />
                  </div>
                )}

                {userProgress.actionStepExperience === 'did' && (
                  <div className="ml-6 md:ml-10 space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-[#2C3E50] mb-3">
                        How did it go?
                      </label>
                      <textarea
                        value={userProgress.howDidItGo}
                        onChange={(e) => updateProgress({howDidItGo: e.target.value})}
                        className="w-full h-32 md:h-40 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                        placeholder="Describe your experience, challenges, and successes..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-semibold text-[#2C3E50] mb-3">
                        Who did you tell about what you learned?
                      </label>
                      <input
                        type="text"
                        value={userProgress.whoDidYouTell}
                        onChange={(e) => updateProgress({whoDidYouTell: e.target.value})}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                        placeholder="e.g., My spouse, business partner, accountability group..."
                      />
                    </div>
                    
                    {userProgress.whoDidYouTell && (
                      <div>
                        <label className="block text-lg font-semibold text-[#2C3E50] mb-3">
                          Who specifically?
                        </label>
                        <input
                          type="text"
                          value={userProgress.whoSpecifically}
                          onChange={(e) => updateProgress({whoSpecifically: e.target.value})}
                          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                          placeholder="Names of people you shared with..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Vision Reiteration */}
            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-5xl md:text-6xl">🎯</span>
                Our Vision
              </h3>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
                <p className="text-[#2C3E50] font-semibold text-lg md:text-xl leading-relaxed mb-6">
                  "Our vision is to love God and serve our community through excellent, biblically-based business, intentionally multiplying disciples who make disciples in our marketplace sphere of influence, following Jesus' model and calling.."
                </p>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">
                  How does this vision connect with your current business situation?
                </label>
                <textarea
                  value={userProgress.visionReflection}
                  onChange={(e) => updateProgress({visionReflection: e.target.value})}
                  className="w-full h-32 md:h-40 p-4 border-2 border-[#4ECDC4]/20 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                  placeholder="Reflect on how this vision applies to your specific business context..."
                />
              </div>
            </div>

            {/* Section Complete Indicator */}
            {userProgress.lookBackComplete && (
              <div className="bg-[#10b981] text-white rounded-2xl p-6 md:p-8 text-center">
                <div className="text-5xl md:text-6xl mb-4">🌟</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Look Back Complete!</h3>
                <p className="text-lg md:text-xl opacity-90">You can now access the Look Up section.</p>
              </div>
            )}
          </div>
        )}

        {/* LOOK UP SECTION */}
        {currentSection === 'lookup' && (
          <div className="space-y-6 md:space-y-8">
            {/* Section Prayer */}
            <div className="bg-[#4ECDC4]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
                <span className="text-5xl md:text-6xl">🙏</span>
                Learning Prayer
              </h3>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
                <p className="text-gray-700 italic text-lg md:text-xl leading-relaxed mb-4">
                  "Father, as I look up to You for wisdom, I pray that Your Holy Spirit would illuminate 
                  Your truth in this lesson. Teach me not just knowledge, but transformation. 
                  Make specific changes in my heart and business practices. Amen."
                </p>
                <textarea
                  value={userProgress.lookUpPrayer}
                  onChange={(e) => updateProgress({lookUpPrayer: e.target.value})}
                  placeholder="Add your own prayer for this learning time..."
                  className="w-full h-24 md:h-32 p-4 border-2 border-[#4ECDC4]/20 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                />
              </div>
            </div>

            {/* Scripture Foundation */}
            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
                <span className="text-5xl md:text-6xl">📖</span>
                Biblical Foundation
              </h3>
              
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
                <div className="font-bold text-[#4ECDC4] text-lg md:text-xl mb-3">
                  {session.scripture.reference} (ESV)
                </div>
                <div 
                  className={`text-gray-700 text-lg md:text-xl leading-relaxed cursor-pointer transition-all ${
                    scriptureExpanded ? '' : 'line-clamp-3'
                  }`}
                  onClick={() => setScriptureExpanded(!scriptureExpanded)}
                >
                  "{session.scripture.text}"
                </div>
                <button 
                  onClick={() => setScriptureExpanded(!scriptureExpanded)}
                  className="text-[#4ECDC4] text-lg font-semibold mt-3 hover:underline"
                >
                  {scriptureExpanded ? 'Show less' : 'Read full passage'}
                </button>
              </div>
            </div>

            {/* Dynamic content based on learning mode */}
            {learningMode === 'quick' ? (
              // Quick Mode - Condensed Content
              <div className="space-y-6">
                {/* Quick Written Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl flex items-center gap-3">
                      <span className="text-5xl md:text-6xl">⚡</span>
                      Key Insight
                    </h3>
                    <button
                      onClick={() => updateProgress({writtenMaterialRead: true})}
                      className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                        userProgress.writtenMaterialRead
                          ? 'bg-[#10b981] text-white'
                          : 'bg-[#4ECDC4] text-white hover:bg-[#4ECDC4]/80'
                      }`}
                    >
                      {userProgress.writtenMaterialRead ? '✓ Read' : 'Mark as Read'}
                    </button>
                  </div>
                  
                  <div className="text-gray-700 text-lg md:text-xl leading-relaxed">
                    {session.writtenMaterial.slice(0, 200)}...
                  </div>
                </div>

                {/* Quick Reflection */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">💭</span>
                    Quick Reflection
                  </h3>
                  <p className="font-semibold text-[#2C3E50] text-lg md:text-xl mb-4">{session.reflection}</p>
                  <textarea
                    value={userProgress.personalReflection}
                    onChange={(e) => updateProgress({personalReflection: e.target.value})}
                    className="w-full h-24 md:h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                    placeholder="Your quick thoughts..."
                  />
                </div>
              </div>
            ) : (
              // Normal Mode - Full Content
              <div className="space-y-6 md:space-y-8">
                {/* Written Material */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl flex items-center gap-3">
                      <span className="text-4xl md:text-5xl">📝</span>
                      Written Material
                    </h3>
                    <button
                      onClick={() => updateProgress({writtenMaterialRead: true})}
                      className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                        userProgress.writtenMaterialRead
                          ? 'bg-[#10b981] text-white'
                          : 'bg-[#4ECDC4] text-white hover:bg-[#4ECDC4]/80'
                      }`}
                    >
                      {userProgress.writtenMaterialRead ? '✓ Read' : 'Mark as Read'}
                    </button>
                  </div>
                  
                  <div className="text-gray-700 text-lg md:text-xl leading-relaxed">
                    {session.writtenMaterial}
                  </div>
                </div>

                {/* Video Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl flex items-center gap-3">
                      <span className="text-4xl md:text-5xl">📺</span>
                      Training Video
                    </h3>
                    <button
                      onClick={() => updateProgress({videoWatched: true})}
                      className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                        userProgress.videoWatched
                          ? 'bg-[#10b981] text-white'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {userProgress.videoWatched ? '✓ Watched' : 'Mark as Watched'}
                    </button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl md:text-8xl mb-4">▶️</div>
                      <p className="text-gray-600 text-lg md:text-xl">Video content will be embedded here</p>
                      <p className="text-gray-500 text-sm md:text-base mt-2">URL: {session.videoUrl || 'To be configured'}</p>
                    </div>
                  </div>
                </div>

                {/* Quiz */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">🧠</span>
                    Knowledge Check
                  </h3>
                  
                  <div className="space-y-6">
                    <p className="font-semibold text-[#2C3E50] text-lg md:text-xl">
                      According to this session's content, what is the primary biblical foundation for business?
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        "Business is a necessary evil we must endure",
                        "Business reflects God's image and calling for humans to create and steward", 
                        "Business should be kept separate from spiritual matters",
                        "Business is only acceptable if it's explicitly Christian"
                      ].map((option, index) => (
                        <label key={index} className="flex items-center gap-4 p-4 md:p-6 rounded-xl border-2 hover:bg-gray-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name="knowledge-check"
                            value={index}
                            checked={userProgress.quizAnswer === index}
                            onChange={() => updateProgress({quizAnswer: index})}
                            className="w-6 h-6 text-[#4ECDC4]"
                          />
                          <span className="text-gray-700 text-lg md:text-xl">{option}</span>
                        </label>
                      ))}
                    </div>
                    
                    {userProgress.quizAnswer !== null && (
                      <div className="mt-6 p-4 md:p-6 rounded-xl" style={{
                        backgroundColor: userProgress.quizAnswer === 1 ? '#10b981' : '#f59e0b',
                        color: 'white'
                      }}>
                        <p className="text-lg md:text-xl font-semibold">
                          {userProgress.quizAnswer === 1 ? (
                            "✓ Correct! Business is indeed a reflection of God's creative nature."
                          ) : (
                            "Consider reviewing the biblical foundation section. Business reflects God's image in us."
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Reflection */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                    <span className="text-4xl md:text-5xl">💭</span>
                    Personal Reflection
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="font-semibold text-[#2C3E50] text-lg md:text-xl">{session.reflection}</p>
                    <textarea
                      value={userProgress.personalReflection}
                      onChange={(e) => updateProgress({personalReflection: e.target.value})}
                      className="w-full h-32 md:h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                      placeholder="Write your personal reflection here..."
                    />
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl flex items-center gap-3">
                      <span className="text-4xl md:text-5xl">❓</span>
                      Frequently Asked Questions
                    </h3>
                    <button
                      onClick={() => updateProgress({faqReviewed: true})}
                      className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                        userProgress.faqReviewed
                          ? 'bg-[#10b981] text-white'
                          : 'bg-[#4ECDC4] text-white hover:bg-[#4ECDC4]/80'
                      }`}
                    >
                      {userProgress.faqReviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {session.faqQuestions.map((faq: string, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 md:p-6">
                        <p className="text-gray-700 text-lg md:text-xl">{faq}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Coaching Section (Both Modes) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 md:p-8">
              <h3 className="font-bold text-purple-900 text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">🤖</span>
                IBAM Coaching Assistant
              </h3>
              
              <div className="bg-white rounded-xl p-4 md:p-6 border border-purple-100">
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-4 italic">
                  Ask clarification questions about this session's content. Our AI coach combines expertise in:
                  evangelical theology, work-faith integration, and small business entrepreneurship.
                </p>
                
                <textarea
                  value={userProgress.coachingQuestion}
                  onChange={(e) => updateProgress({coachingQuestion: e.target.value})}
                  className="w-full h-24 md:h-32 p-4 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 mb-4 text-lg"
                  placeholder="Type your question about the session content here..."
                />
                
                <div className="bg-purple-50 rounded-xl p-4 md:p-6">
                  <p className="text-purple-700 text-lg md:text-xl">
                    <strong>Coming Soon:</strong> AI-powered coaching responses will be available here. 
                    For now, save your questions and discuss them with your mentor or small group.
                  </p>
                </div>
              </div>
            </div>

            {/* Section Complete Indicator */}
            {userProgress.lookUpComplete && (
              <div className="bg-[#10b981] text-white rounded-2xl p-6 md:p-8 text-center">
                <div className="text-5xl md:text-6xl mb-4">🌟</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Look Up Complete!</h3>
                <p className="text-lg md:text-xl opacity-90">You can now access the Look Forward section.</p>
              </div>
            )}
          </div>
        )}

        {/* LOOK FORWARD SECTION */}
        {currentSection === 'lookforward' && (
          <div className="space-y-6 md:space-y-8">
            {/* Section Prayer */}
            <div className="bg-[#4ECDC4]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">🙏</span>
                Application Prayer
              </h3>
              <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
                <p className="text-gray-700 italic text-lg md:text-xl leading-relaxed mb-4">
                  "Lord, as I look forward to applying what I've learned, I pray for Your Holy Spirit 
                  to guide my steps and make specific changes in my business and life. 
                  Give me courage to act on Your truth and wisdom to implement it well. Amen."
                </p>
                <textarea
                  value={userProgress.lookForwardPrayer}
                  onChange={(e) => updateProgress({lookForwardPrayer: e.target.value})}
                  placeholder="Add your own prayer for application and action..."
                  className="w-full h-24 md:h-32 p-4 border-2 border-[#4ECDC4]/20 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] text-lg"
                />
              </div>
            </div>

            {/* Key Truth Reflection */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">💡</span>
                Key Truth Reflection
              </h3>
              
              <div className="space-y-4">
                <p className="font-semibold text-[#2C3E50] text-lg md:text-xl">
                  Reflect on the key truths from both the business concepts and "Becoming God's Entrepreneur" 
                  content. How do these insights apply to your specific life and business situation?
                </p>
                <textarea
                  value={userProgress.keyTruthReflection}
                  onChange={(e) => updateProgress({keyTruthReflection: e.target.value})}
                  className="w-full h-32 md:h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 text-lg"
                  placeholder="Consider both the practical business insights and spiritual applications from this session..."
                />
              </div>
            </div>

            {/* Specific Action Statements */}
            <div className="bg-gradient-to-r from-[#10b981]/10 to-[#4ECDC4]/10 rounded-2xl border-2 border-[#10b981]/20 p-6 md:p-8">
              <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">🎯</span>
                Specific Action Statements
              </h3>
              
              <div className="bg-yellow-50 rounded-xl p-4 md:p-6 mb-6 border-2 border-yellow-200">
                <p className="text-yellow-800 font-bold text-lg md:text-xl mb-4">
                  ⚠️ Remember: You'll be asked at the beginning of the next session whether you completed these actions.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 text-base md:text-lg">
                  <div>
                    <p className="font-bold text-red-700 mb-3">❌ General Examples:</p>
                    <ul className="space-y-2 text-red-600">
                      <li>• "I will pray more"</li>
                      <li>• "I will make more phone calls"</li>
                      <li>• "I will be better with money"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-green-700 mb-3">✅ Specific Examples:</p>
                    <ul className="space-y-2 text-green-600">
                      <li>• "I will pray for 5 minutes each morning at 6 AM"</li>
                      <li>• "I will call 3 potential customers by name daily for one week"</li>
                      <li>• "I will track expenses daily in my phone app"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num}>
                    <label className="block font-bold text-[#2C3E50] text-lg md:text-xl mb-3">
                      Action Statement #{num} {num === 1 && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={userProgress[`actionStatement${num}` as keyof typeof userProgress] as string}
                      onChange={(e) => updateProgress({[`actionStatement${num}`]: e.target.value})}
                      className="w-full h-24 md:h-32 p-4 border-2 border-[#10b981]/20 rounded-xl focus:ring-2 focus:ring-[#10b981] text-lg"
                      placeholder={`Write a specific, measurable action you will take before the next session...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Plan Integration */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200 p-6 md:p-8">
              <h3 className="font-bold text-orange-900 text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">💼</span>
                IBAM Business Planner Integration
              </h3>
              
              <div className="space-y-6">
                <p className="text-orange-800 text-lg md:text-xl">
                  These questions will help develop your business plan. Your responses will be saved 
                  and available in the IBAM Business Planner tool.
                </p>
                
                {session.businessPlanQuestions.map((question: string, index: number) => (
                  <div key={index}>
                    <label className="block font-bold text-orange-800 text-lg md:text-xl mb-3">
                      {question} {index === 0 && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={userProgress[`businessPlanAnswer${index + 1}` as keyof typeof userProgress] as string}
                      onChange={(e) => updateProgress({[`businessPlanAnswer${index + 1}`]: e.target.value})}
                      className="w-full h-24 md:h-32 p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg"
                      placeholder="Your response will be integrated into your business plan..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Anonymous Survey */}
            <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 md:p-8">
              <h3 className="font-bold text-gray-900 text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="text-4xl md:text-5xl">📊</span>
                Anonymous Session Feedback
              </h3>
              
              <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 mb-6">
                <p className="text-green-700 font-bold text-lg mb-2">🔒 100% Anonymous</p>
                <p className="text-gray-600 text-lg md:text-xl">
                  Your responses help us improve the curriculum. This survey is completely anonymous 
                  and will be sent to our trainer dashboard for analysis.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  "How valuable was this session's content for your business development?",
                  "How clear and engaging was the material presentation?", 
                  "How likely are you to apply what you learned in this session?"
                ].map((question, index) => (
                  <div key={index}>
                    <p className="font-bold text-gray-800 text-lg md:text-xl mb-4">{question}</p>
                    <div className="flex gap-3 mb-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => updateProgress({[`surveyRating${index + 1}`]: rating})}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-full text-xl md:text-2xl font-bold transition-all ${
                            userProgress[`surveyRating${index + 1}` as keyof typeof userProgress] === rating
                              ? 'bg-[#4ECDC4] text-white shadow-lg' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm md:text-base text-gray-500">
                      <span>Not valuable</span>
                      <span>Extremely valuable</span>
                    </div>
                  </div>
                ))}
                
                <div>
                  <label className="block font-bold text-gray-800 text-lg md:text-xl mb-4">
                    Additional feedback, improvements, or criticisms for this specific lesson:
                  </label>
                  <textarea
                    value={userProgress.surveyFeedback}
                    onChange={(e) => updateProgress({surveyFeedback: e.target.value})}
                    className="w-full h-32 md:h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 text-lg"
                    placeholder="Your honest feedback helps us improve (optional)..."
                  />
                </div>
              </div>
            </div>

            {/* 🆕 UPDATED: Session Complete Indicator with Module 1 logic */}
            {userProgress.lookForwardComplete && (
              <div className="bg-[#10b981] text-white rounded-2xl p-6 md:p-8 text-center">
                <div className="text-5xl md:text-6xl mb-4">
                  {isFinalCourseSession() ? '🎉' : '🏆'}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {isFinalCourseSession() ? 'Course Complete!' : 'Session Complete!'}
                </h3>
                <p className="text-lg md:text-xl opacity-90 mb-4">
                  {isFinalCourseSession() 
                    ? 'Congratulations! Time to measure your growth with the post-assessment.' 
                    : 'Excellent work! You can now move to the next session.'
                  }
                </p>
                <button 
                  onClick={navigateToNextSession}
                  className="mt-4 bg-white text-[#10b981] px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  {isFinalCourseSession() ? '📊 Take Post-Assessment →' : 'Continue to Next Session →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* IBAM Footer */}
      <footer className="bg-[#2C3E50] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img 
                src="/images/branding/mini-logo.png" 
                alt="IBAM Mini Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-bold">International Business as Mission</span>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">
              © 2025 IBAM International Business as Mission. Equipping entrepreneurs to transform communities through faith-driven business.
            </p>
            <p className="text-[#4ECDC4] text-base md:text-lg mt-2 font-semibold">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}