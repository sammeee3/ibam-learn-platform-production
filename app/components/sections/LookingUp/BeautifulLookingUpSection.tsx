// app/components/sections/LookingUp/BeautifulLookingUpSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Play, Users, ChevronDown, ChevronRight, BookOpen, Book, Star } from 'lucide-react';
import type { SessionData, PathwayMode } from '../../../lib/types';
import { VimeoVideo } from '../../video/VimeoVideo';
import EnhancedReadingChunks from '../../reading/EnhancedReadingChunks';
import BeautifulCaseStudyComponent from '../../case-study/BeautifulCaseStudyComponent';
import EnhancedScriptureReference from '../../scripture/EnhancedScriptureReference';
import SimpleReliableQuizSection from '../../quiz/SimpleReliableQuizSection';
import UniversalReadingWithToggle from '../../reading/UniversalReadingWithToggle';
import { parseMainContentIntoChunks } from '../../../lib/utils';

interface BeautifulLookingUpSectionProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onMarkComplete: (section: string) => void;
  isCompleted?: boolean; // 🔧 NEW: Pass database completion state
  lookingUpProgress?: {
    wealth: boolean;
    people: boolean;
    reading: boolean;
    case: boolean;
    integrate: boolean;
    practice: boolean;
  }; // 🔧 NEW: Individual subsection progress
}

const BeautifulLookingUpSection: React.FC<BeautifulLookingUpSectionProps> = ({ 
  sessionData, 
  pathwayMode = 'individual', 
  onMarkComplete,
  isCompleted = false, // 🔧 NEW: Default to false if not provided
  lookingUpProgress = {
    wealth: false,
    people: false,
    reading: false,
    case: false,
    integrate: false,
    practice: false
  } // 🔧 NEW: Default progress state
}) => {
  console.log('🏗️ BeautifulLookingUpSection rendering with isCompleted:', isCompleted);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ percentage: number, correct: number, total: number } | null>(null);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  
  // 🔧 NEW: Integration section state
  const [integrationGoal, setIntegrationGoal] = useState('');
  const [integrationCompleted, setIntegrationCompleted] = useState(false);
  
  // 🔧 NEW: Storage key for integration section
  const integrationStorageKey = `integration_goal_${sessionData.module_id}_${sessionData.session_number}`;
  
  // 🔧 NEW: Storage keys for video completions
  const wealthVideoStorageKey = `wealth_video_completed_${sessionData.module_id}_${sessionData.session_number}`;
  const peopleVideoStorageKey = `people_video_completed_${sessionData.module_id}_${sessionData.session_number}`;
  
  // 🔧 NEW: Storage key for Memory Practice (quiz) completion
  const practiceStorageKey = `practice_quiz_completed_${sessionData.module_id}_${sessionData.session_number}`;
  
  // 🔧 NEW: Load saved integration data and video completions on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load integration goal
      const saved = localStorage.getItem(integrationStorageKey);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          console.log('🔗 Restored integration goal from localStorage:', parsedData);
          setIntegrationGoal(parsedData.goal || '');
          setIntegrationCompleted(parsedData.completed || false);
        } catch (error) {
          console.error('Error loading saved integration goal:', error);
        }
      }
      
      // 🔧 NEW: Load Memory Practice completion state
      const practiceCompleted = localStorage.getItem(practiceStorageKey);
      if (practiceCompleted === 'true') {
        console.log('🧠 Restored Memory Practice completion from localStorage');
        setQuizCompleted(true);
      }
    }
  }, [integrationStorageKey, practiceStorageKey]);
  
  // 🔧 NEW: Sync quiz completion state with database progress
  useEffect(() => {
    if (lookingUpProgress.practice && !quizCompleted) {
      console.log('🔄 Database shows Memory Practice complete, syncing local state');
      setQuizCompleted(true);
      // Also save to localStorage to maintain consistency
      if (typeof window !== 'undefined') {
        localStorage.setItem(practiceStorageKey, 'true');
        console.log('💾 Synced Memory Practice completion to localStorage from database');
      }
    }
  }, [lookingUpProgress.practice, quizCompleted, practiceStorageKey]);
  
  // 🔧 NEW: Autosave integration goal
  const saveIntegrationGoal = (goal: string) => {
    if (typeof window !== 'undefined') {
      const dataToSave = { goal, completed: goal.trim().length > 10 }; // Auto-complete if sufficient content
      localStorage.setItem(integrationStorageKey, JSON.stringify(dataToSave));
      console.log('💾 Auto-saved integration goal:', dataToSave);
      
      // Auto-complete if goal has enough content
      if (goal.trim().length > 10 && !integrationCompleted) {
        setIntegrationCompleted(true);
        onMarkComplete('integrate');
      }
    }
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lookingUpSections = [
    {
      id: 'wealth',
      title: 'GROW Business',
      icon: '💰',
      description: 'Business Strategy & Profit',
      gradient: 'from-green-400 to-blue-500',
      hoverGradient: 'from-green-500 to-blue-600'
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: '📖',
      description: 'Curriculum Content',
      gradient: 'from-blue-400 to-indigo-500',
      hoverGradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'people',
      title: 'GROW Impact',
      icon: '👥',
      description: 'Identity & Discipleship',
      gradient: 'from-purple-400 to-pink-500',
      hoverGradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'case',
      title: 'Case Study',
      icon: '📊',
      description: 'Real Transformation',
      gradient: 'from-orange-400 to-red-500',
      hoverGradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'integrate',
      title: 'Integrating Both',
      icon: '🔗',
      description: 'Faith-Business Blend',
      gradient: 'from-teal-400 to-cyan-500',
      hoverGradient: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'practice',
      title: 'Memory Practice',
      icon: '🧠',
      description: 'Quiz & Exercises',
      gradient: 'from-pink-400 to-rose-500',
      hoverGradient: 'from-pink-500 to-rose-600'
    },
  ];

  // Smart Video URL Detection
  const getVideoUrl = (section: 'wealth' | 'people'): string | null => {
    if (!sessionData) return null;
    
    if (section === 'wealth') {
      return sessionData.video_url || null;
    }
    
    if (section === 'people') {
      return sessionData.becoming_gods_entrepreneur?.video_url || null;
    }
    
    return null;
  };

  // Render content for each section
  const renderSectionContent = (section: any) => {
    switch (section.id) {
      case 'wealth':
        const wealthVideoUrl = getVideoUrl('wealth');
        
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3">💰 GROW Business: Biblical Business Principles</h4>
              
              {wealthVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo url={wealthVideoUrl} title="GROW Business Video" />
                </div>
              ) : (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <p className="text-blue-800 font-medium mb-2">
                      📹 Business Video Available Soon
                    </p>
                    <p className="text-blue-600 text-sm">
                      Business videos are being added to this session
                    </p>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Building Wealth God's Way</h3>
                  <p className="mb-4">Discover biblical principles for creating sustainable, profitable businesses that honor God and serve others.</p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-800 font-medium">
                      📖 For detailed content and step-by-step reading, visit the <strong>Reading</strong> tab.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {wealthVideoUrl ? (
              <button 
                onClick={() => {
                  // 🔧 SAVE TO LOCALSTORAGE: Mark wealth video as complete
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(wealthVideoStorageKey, 'true');
                    console.log('💾 Saved wealth video completion to localStorage');
                  }
                  onMarkComplete('wealth');
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  lookingUpProgress.wealth 
                    ? 'bg-green-600 text-white cursor-default shadow-lg' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
                disabled={lookingUpProgress.wealth}
              >
                {lookingUpProgress.wealth ? (
                  <>✅ Video Watched - Business Complete! </>
                ) : (
                  <>📺 Watch Video & Complete Business </>
                )}
              </button>
            ) : (
              <button 
                onClick={() => {
                  // 🔧 SAVE TO LOCALSTORAGE: Mark wealth section as complete
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(wealthVideoStorageKey, 'true');
                    console.log('💾 Saved wealth business completion to localStorage');
                  }
                  onMarkComplete('wealth');
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  lookingUpProgress.wealth 
                    ? 'bg-green-600 text-white cursor-default shadow-lg' 
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
                disabled={lookingUpProgress.wealth}
              >
                {lookingUpProgress.wealth ? (
                  <>✅ GROW Business Complete! </>
                ) : (
                  <>📚 Complete GROW Business </>
                )}
              </button>
            )}
          </div>
        );

      case 'reading':
        const chunks = sessionData.content?.written_curriculum?.quick_version?.chunks || [];
        
        return (
          <div className="space-y-6">
            {chunks.length > 0 ? (
              <EnhancedReadingChunks 
                chunks={chunks} 
                title="Session Reading"
                onComplete={() => onMarkComplete('reading')} // 🔧 FIX: Pass completion callback
                sessionData={{ module_id: sessionData.module_id, session_number: sessionData.session_number }} // 🔧 NEW: For autosave
              />
            ) : (
              (() => {
                const mainContent = sessionData.content?.written_curriculum?.main_content;
                if (mainContent) {
                  const parsedChunks = parseMainContentIntoChunks(mainContent);
                  return (
                    <EnhancedReadingChunks 
                      chunks={parsedChunks} 
                      title="Session Reading"
                      onComplete={() => onMarkComplete('reading')} // 🔧 FIX: Pass completion callback
                      sessionData={{ module_id: sessionData.module_id, session_number: sessionData.session_number }} // 🔧 NEW: For autosave
                    />
                  );
                } else {
                  return (
                    <div className="space-y-4">
                      <UniversalReadingWithToggle 
                        sessionData={sessionData}
                        title="Session Reading Content"
                      />
                      <button 
                        onClick={() => onMarkComplete('reading')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        ✅ Complete Reading
                      </button>
                    </div>
                  );
                }
              })()
            )}
            
            {/* Reading Completion Confirmation Banner - ENHANCED */}
            {lookingUpProgress.reading && (
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-xl shadow-2xl border-4 border-green-300 text-center mb-6 transform hover:scale-105 transition-all duration-500 animate-pulse">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-4xl font-bold mb-3">📖 READING COMPLETE!</h3>
                <p className="text-green-100 text-xl font-semibold">🌟 Excellent Work! Your Progress Has Been Saved 🌟</p>
                <div className="flex justify-center space-x-3 mt-6">
                  <div className="text-3xl animate-pulse">✨</div>
                  <div className="text-3xl animate-pulse" style={{animationDelay: '0.3s'}}>⭐</div>
                  <div className="text-3xl animate-pulse" style={{animationDelay: '0.6s'}}>🏆</div>
                  <div className="text-3xl animate-pulse" style={{animationDelay: '0.9s'}}>🎊</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'people':
        const peopleVideoUrl = getVideoUrl('people');
        
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-purple-800 mb-3">👥 GROW Impact: Becoming God's Entrepreneur</h4>
              
              {peopleVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo url={peopleVideoUrl} title="GROW Impact Video" />
                </div>
              ) : (
                <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-purple-800 font-medium mb-2">
                      👥 Impact Video Status
                    </p>
                    <p className="text-purple-600 text-sm">
                      Impact videos for this module are being created and will be available soon
                    </p>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Becoming God's Entrepreneur</h3>
                  <p className="mb-4">Transform your identity from business owner to Faith-Driven entrepreneur.</p>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-4 rounded border">
                <h5 className="font-semibold text-purple-800 mb-3">📖 Scripture Study</h5>
                <div className="border-l-4 border-blue-400 pl-4">
                  <EnhancedScriptureReference reference={sessionData.scripture_reference || "Genesis 1:26"} />
                </div>
              </div>
            </div>
            {peopleVideoUrl ? (
              <button 
                onClick={() => {
                  // 🔧 SAVE TO LOCALSTORAGE: Mark people video as complete
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(peopleVideoStorageKey, 'true');
                    console.log('💾 Saved people video completion to localStorage');
                  }
                  onMarkComplete('people');
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  lookingUpProgress.people 
                    ? 'bg-green-600 text-white cursor-default shadow-lg' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
                disabled={lookingUpProgress.people}
              >
                {lookingUpProgress.people ? (
                  <>✅ Video Watched - Impact Complete! </>
                ) : (
                  <>📺 Watch Video & Complete Impact </>
                )}
              </button>
            ) : (
              <button 
                onClick={() => {
                  // 🔧 SAVE TO LOCALSTORAGE: Mark people section as complete
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(peopleVideoStorageKey, 'true');
                    console.log('💾 Saved people impact completion to localStorage');
                  }
                  onMarkComplete('people');
                }}
                className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  lookingUpProgress.people 
                    ? 'bg-green-600 text-white cursor-default shadow-lg' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                }`}
                disabled={lookingUpProgress.people}
              >
                {lookingUpProgress.people ? (
                  <>✅ GROW Impact Complete! </>
                ) : (
                  <>📚 Complete GROW Impact </>
                )}
              </button>
            )}
          </div>
        );

      case 'case':
        return (
          <div className="space-y-6">
            <BeautifulCaseStudyComponent
              sessionData={sessionData}
              sessionTitle={sessionData.title}
              onComplete={() => onMarkComplete('case')}
            />
            {lookingUpProgress.case && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="font-semibold text-green-800">Case Study Complete!</p>
                <p className="text-green-600 text-sm">Your insights have been saved</p>
              </div>
            )}
          </div>
        );

      case 'integrate':
        // 🔇 HIDDEN: Integration section completely hidden from UI
        // Backend still marks it as complete for progress calculations
        // but doesn't show progress on dashboard per user request
        return null;


      case 'practice':
        return (
          <div className="space-y-6">
            <SimpleReliableQuizSection 
              sessionData={sessionData} 
              onScoreAvailable={(score) => {
                console.log('📉 Score available:', score);
                setQuizScore(score);
              }}
              onCompletion={(completed) => {
                console.log('🧠 Quiz completion callback (60% threshold):', completed);
                // Called when user achieves 60% or higher
                if (completed) {
                  console.log('✅ Quiz completed with passing score - marking section complete');
                  // 🔧 SAVE TO LOCALSTORAGE: Mark Memory Practice as complete
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(practiceStorageKey, 'true');
                    console.log('💾 Saved Memory Practice completion to localStorage');
                  }
                  setQuizCompleted(true);
                  onMarkComplete('practice');
                }
              }}
            />
            
            {/* Show completion button only if quiz attempted but not fully mastered */}
            {!quizCompleted && quizScore && (
              <div className="mt-6">
                <button 
                  onClick={() => {
                    if (quizScore.percentage >= 60) {
                      // Score meets minimum threshold - complete the section
                      console.log('🎯 MANUAL BUTTON: 60%+ achieved, completing Memory Practice:', quizScore.percentage);
                      // 🔧 SAVE TO LOCALSTORAGE: Mark Memory Practice as complete
                      if (typeof window !== 'undefined') {
                        localStorage.setItem(practiceStorageKey, 'true');
                        console.log('💾 MANUAL BUTTON: Saved Memory Practice completion to localStorage');
                      }
                      setQuizCompleted(true);
                      onMarkComplete('practice'); // This calls markLookingUpComplete in parent
                    } else {
                      // Score below 60% - show encouragement popup
                      console.log('🔄 Score below 60%, showing encouragement popup');
                      setShowValidationPopup(true);
                    }
                  }}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    quizScore.percentage >= 60 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {quizScore.percentage >= 60 
                    ? `🏆 Complete Memory Practice (${quizScore.percentage}% Achieved!)` 
                    : `🎯 Review & Improve (${quizScore.percentage}% - Need 60%)`
                  }
                </button>
              </div>
            )}
            
            {/* Show quiz prompt if no score yet */}
            {!quizCompleted && !quizScore && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 font-medium mb-3">
                  🏅 Complete the quiz above to unlock section completion
                </p>
                <p className="text-blue-600 text-sm">
                  You need at least 60% to proceed to the next section
                </p>
              </div>
            )}
            
            {/* Show completion celebration when quiz is completed */}
            {quizCompleted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
                <p className="text-green-700">You have successfully completed this Memory Practice section!</p>
                <div className="mt-3 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
                  ✅ SECTION COMPLETE
                </div>
              </div>
            )}
          </div>
        );


      default:
        return <div>Content loading...</div>;
    }
  };

  // Handle swipe navigation for mobile
  const handleSwipe = (direction: 'next' | 'prev') => {
    const filteredSections = lookingUpSections.filter(section => section.id !== 'integrate');
    if (direction === 'next' && currentSwipeIndex < filteredSections.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else if (direction === 'prev' && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(currentSwipeIndex - 1);
    }
  };

  // Desktop Accordion Style
  const DesktopAccordion = () => (
    <div className="space-y-4">
      {lookingUpSections.filter(section => section.id !== 'integrate').map((section, index) => (
        <div key={section.id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className={`w-full p-6 text-left transition-all duration-300 bg-gradient-to-r ${section.gradient} hover:${section.hoverGradient} text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-4">{section.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                  <p className="text-white/80 text-sm">{section.description}</p>
                </div>
              </div>
              <div className="transform transition-transform duration-200">
                {expandedSection === section.id ? 
                  <ChevronDown className="w-6 h-6" /> : 
                  <ChevronRight className="w-6 h-6" />
                }
              </div>
            </div>
          </button>
          
          {expandedSection === section.id && (
            <div className="p-6 bg-gray-50 border-t animate-in slide-in-from-top-2 duration-300">
              {renderSectionContent(section)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Mobile Swipe Carousel
  const MobileSwipeCarousel = () => {
    const filteredSections = lookingUpSections.filter(section => section.id !== 'integrate');
    const currentSection = filteredSections[currentSwipeIndex];
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with swipe navigation */}
        <div className={`p-4 bg-gradient-to-r ${currentSection.gradient} text-white`}>
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => handleSwipe('prev')}
              disabled={currentSwipeIndex === 0}
              className="p-2 rounded-full bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            <div className="text-center">
              <span className="text-2xl block mb-1">{currentSection.icon}</span>
              <h3 className="font-bold text-lg">{currentSection.title}</h3>
              <p className="text-white/80 text-sm">{currentSection.description}</p>
            </div>
            
            <button 
              onClick={() => handleSwipe('next')}
              disabled={currentSwipeIndex === lookingUpSections.filter(section => section.id !== 'integrate').length - 1}
              className="p-2 rounded-full bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center space-x-2">
            {lookingUpSections.filter(section => section.id !== 'integrate').map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSwipeIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSwipeIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center mt-2 text-white/80 text-sm">
            {currentSwipeIndex + 1} of {lookingUpSections.filter(section => section.id !== 'integrate').length}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderSectionContent(currentSection)}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Content */}
      <div className="p-6 bg-green-50">
        {isMobile ? <MobileSwipeCarousel /> : <DesktopAccordion />}
      </div>
      
      {/* Quiz Validation Popup */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {quizScore && quizScore.percentage < 60 ? 'Keep Learning!' : 'Complete Quiz First!'}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {quizScore && quizScore.percentage < 60
                ? `You scored ${quizScore.percentage}% (${quizScore.correct}/${quizScore.total}). Review the concepts you missed and try again. You need at least 60% to continue to Looking Forward - this ensures you have the foundation for the next sections!`
                : 'Please finish the entire Memory Practice quiz first. Every question builds your understanding of biblical business principles!'
              }
            </p>
            <button
              onClick={() => setShowValidationPopup(false)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              {quizScore && quizScore.percentage < 60 ? 'Review & Try Again' : 'Continue Learning'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeautifulLookingUpSection;