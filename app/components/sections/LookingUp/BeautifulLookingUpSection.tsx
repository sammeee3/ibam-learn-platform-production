// app/components/sections/LookingUp/BeautifulLookingUpSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Play, Users, ChevronDown, ChevronRight, BookOpen, Book, Star } from 'lucide-react';
import type { SessionData, PathwayMode } from '../../../lib/types';
import { VimeoVideo } from '../../video/VimeoVideo';
import EnhancedReadingChunks from '../../reading/EnhancedReadingChunks';
import BeautifulCaseStudyComponent from '../../case-study/BeautifulCaseStudyComponent';
import EnhancedScriptureReference from '../../scripture/EnhancedScriptureReference';
import AIChatInterface from '../../coaching/AIChatInterface';
import EnhancedQuizSection from '../../quiz/EnhancedQuizSection';
import UniversalReadingWithToggle from '../../reading/UniversalReadingWithToggle';
import { parseMainContentIntoChunks } from '../../../lib/utils';

interface BeautifulLookingUpSectionProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onMarkComplete: (section: string) => void;
}

const BeautifulLookingUpSection: React.FC<BeautifulLookingUpSectionProps> = ({ 
  sessionData, 
  pathwayMode = 'individual', 
  onMarkComplete 
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
      id: 'coaching',
      title: 'Session Coaching',
      icon: '🎯',
      description: 'AI + Human Support',
      gradient: 'from-indigo-400 to-purple-500',
      hoverGradient: 'from-indigo-500 to-purple-600'
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
            <button 
              onClick={() => onMarkComplete('wealth')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              ✅ Complete GROW Business
            </button>
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
                    />
                  );
                } else {
                  return (
                    <UniversalReadingWithToggle 
                      sessionData={sessionData}
                      title="Session Reading Content"
                    />
                  );
                }
              })()
            )}
            
            <button 
              onClick={() => onMarkComplete('reading')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              ✅ Complete Reading
            </button>
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
            <button 
              onClick={() => onMarkComplete('people')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              ✅ Complete GROW Impact
            </button>
          </div>
        );

      case 'case':
        return (
          <div className="space-y-6">
            <BeautifulCaseStudyComponent
              sessionData={sessionData}
              sessionTitle={sessionData.title}
            />
            <button 
              onClick={() => onMarkComplete('case')}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              ✅ Complete Case Study
            </button>
          </div>
        );

      case 'integrate':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-400">
              <h4 className="font-bold text-teal-800 mb-3">🔗 Integrating Business & Impact</h4>
              
              {pathwayMode === 'individual' ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">💡 Personal Integration Framework</h5>
                    <ul className="space-y-2 mb-4">
                      <li><strong>Profit with Purpose:</strong> Every revenue strategy includes discipleship opportunities</li>
                      <li><strong>Excellence as Evangelism:</strong> Quality work opens doors for spiritual conversations</li>
                      <li><strong>Generosity as Growth:</strong> Giving creates space for God's provision</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">🎯 Personal Integration Planning</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">This Week's Integration Goal:</label>
                        <textarea 
                          className="w-full p-3 border rounded"
                          rows={2}
                          placeholder="How will you integrate wealth-building and people-growing in your business this week?"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">👥 Group Integration Workshop</h5>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-400 pl-4">
                        <h6 className="font-medium text-green-800">Step 1: Pair & Share (10 minutes)</h6>
                        <p className="text-sm text-gray-600">Form pairs. Each person shares their biggest business challenge and biggest ministry opportunity.</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h6 className="font-medium text-blue-800">Step 2: Group Brainstorm (15 minutes)</h6>
                        <p className="text-sm text-gray-600">Each pair presents one integration challenge to the group.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => onMarkComplete('integrate')}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors"
            >
              ✅ Complete Integration
            </button>
          </div>
        );

      case 'coaching':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">🎯 Session-Specific Coaching</h4>
              <div className="mb-6">
                <h5 className="font-semibold mb-3">🤖 AI Coaching (Available Now)</h5>
                <AIChatInterface />
              </div>
            </div>
            <button 
              onClick={() => onMarkComplete('coaching')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ✅ Complete Coaching Section
            </button>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <EnhancedQuizSection sessionData={sessionData} />
            <button 
              onClick={() => onMarkComplete('practice')}
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition-colors"
            >
              ✅ Complete Memory Practice
            </button>
          </div>
        );


      default:
        return <div>Content loading...</div>;
    }
  };

  // Handle swipe navigation for mobile
  const handleSwipe = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSwipeIndex < lookingUpSections.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else if (direction === 'prev' && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(currentSwipeIndex - 1);
    }
  };

  // Desktop Accordion Style
  const DesktopAccordion = () => (
    <div className="space-y-4">
      {lookingUpSections.map((section, index) => (
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
    const currentSection = lookingUpSections[currentSwipeIndex];
    
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
              disabled={currentSwipeIndex === lookingUpSections.length - 1}
              className="p-2 rounded-full bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center space-x-2">
            {lookingUpSections.map((_, index) => (
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
            {currentSwipeIndex + 1} of {lookingUpSections.length}
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
    </div>
  );
};

export default BeautifulLookingUpSection;