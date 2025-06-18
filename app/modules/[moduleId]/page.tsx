'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Session data for titles and descriptions
const sessionData: Record<string, Record<string, any>> = {
  "1": {
    "1": {
      title: "Business is a Good Gift from God",
      description: "Understanding business as a reflection of God's image",
      scripture: "Genesis 1:26"
    },
    "2": {
      title: "Business Leaders Work Together with Church/Spiritual Leaders", 
      description: "Partnership between marketplace and church leadership",
      scripture: "1 Corinthians 12:12-14"
    },
    "3": {
      title: "Integrity in Business Practices",
      description: "Biblical standards for honest business dealings",
      scripture: "Proverbs 11:1"
    },
    "4": {
      title: "Stewardship and Resource Management",
      description: "Managing God's resources with faithfulness",
      scripture: "Luke 16:10"
    }
  },
  "2": {
    "1": {
      title: "Common Reasons for Business Failure",
      description: "Understanding and avoiding preventable failures",
      scripture: "Proverbs 19:21"
    },
    "2": {
      title: "Keys to Business Success",
      description: "Biblical principles for thriving businesses",
      scripture: "Psalm 1:3"
    },
    "3": {
      title: "Learning from Setbacks",
      description: "How to respond to challenges with faith",
      scripture: "Romans 8:28"
    },
    "4": {
      title: "Building Resilience",
      description: "Developing perseverance in business",
      scripture: "James 1:2-4"
    }
  },
  "3": {
    "1": {
      title: "Understanding Your Market", 
      description: "Knowing your customers and their needs",
      scripture: "Proverbs 27:14"
    },
    "2": {
      title: "Building Your Brand",
      description: "Creating a reputation that honors God",
      scripture: "Proverbs 22:1"
    },
    "3": {
      title: "Digital Marketing Strategy",
      description: "Using online tools for kingdom impact",
      scripture: "Matthew 5:14-16"
    },
    "4": {
      title: "Customer Relationships",
      description: "Serving customers with excellence",
      scripture: "Colossians 3:23"
    },
    "5": {
      title: "Marketing with Integrity",
      description: "Honest communication and authentic messaging",
      scripture: "Ephesians 4:25"
    }
  },
  "4": {
    "1": {
      title: "Biblical View of Money",
      description: "Understanding God's perspective on finances",
      scripture: "1 Timothy 6:10"
    },
    "2": {
      title: "Cash Flow Management",
      description: "Practical financial planning and budgeting",
      scripture: "Proverbs 21:5"
    },
    "3": {
      title: "Funding Your Business",
      description: "Wise approaches to investment and borrowing",
      scripture: "Proverbs 22:7"
    },
    "4": {
      title: "Financial Accountability",
      description: "Transparency and stewardship in finances",
      scripture: "Luke 16:11"
    }
  },
  "5": {
    "1": {
      title: "Vision and Mission Development",
      description: "Creating a God-honoring business purpose",
      scripture: "Proverbs 29:18"
    },
    "2": {
      title: "Strategic Planning Process",
      description: "Planning with wisdom and prayer",
      scripture: "Proverbs 16:3"
    },
    "3": {
      title: "Implementation and Action Steps",
      description: "Turning plans into faithful action",
      scripture: "James 2:17"
    }
  }
};

// Module configuration
const moduleConfig = {
  "1": { 
    name: "Foundational Principles", 
    totalSessions: 4,
    description: "Understanding the biblical foundation for business as mission",
    icon: "📖"
  },
  "2": { 
    name: "Success and Failure Factors", 
    totalSessions: 4,
    description: "Learning the keys to sustainable business success",
    icon: "🎯"
  },
  "3": { 
    name: "Marketing Excellence", 
    totalSessions: 5,
    description: "Reaching your audience with integrity and impact",
    icon: "📈"
  },
  "4": { 
    name: "Financial Management", 
    totalSessions: 4,
    description: "Stewardship and wise resource management",
    icon: "💰"
  },
  "5": { 
    name: "Business Planning", 
    totalSessions: 3,
    description: "Creating your roadmap for faith-driven success",
    icon: "🗺️"
  }
};

export default function ModuleOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  
  const [sessionProgress, setSessionProgress] = useState<Record<string, boolean>>({});
  
  // Get module configuration
  const currentModule = moduleConfig[moduleId as keyof typeof moduleConfig];
  const sessions = sessionData[moduleId] || {};
  
  // Load session progress from localStorage
  useEffect(() => {
    const progress: Record<string, boolean> = {};
    for (let i = 1; i <= (currentModule?.totalSessions || 0); i++) {
      const sessionKey = `ibam-session-${moduleId}-${i}`;
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          progress[i.toString()] = parsedData.lookForwardComplete || false;
        } catch (error) {
          progress[i.toString()] = false;
        }
      } else {
        progress[i.toString()] = false;
      }
    }
    setSessionProgress(progress);
  }, [moduleId, currentModule]);

  const completedSessions = Object.values(sessionProgress).filter(Boolean).length;
  const totalSessions = currentModule?.totalSessions || 0;
  const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const navigateToSession = (sessionId: string) => {
    router.push(`/modules/${moduleId}/sessions/${sessionId}`);
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <button 
            onClick={navigateToDashboard}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fafc'}}>
      {/* IBAM Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <div>
                <div className="text-white/90 text-sm md:text-base mb-1">
                  Module {moduleId}
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  {currentModule.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: '#10b981'}}></span>
                    {progressPercentage}% complete
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    {completedSessions} of {totalSessions} sessions completed
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={navigateToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
            >
              🏠 <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #4ECDC4 0%, #10b981 100%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        {/* Module Description */}
        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl md:text-6xl">{currentModule.icon}</div>
            <div>
              <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-2">
                Module Overview
              </h2>
              <p className="text-gray-700 text-lg md:text-xl">
                {currentModule.description}
              </p>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">📚</span>
            Learning Sessions
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {Array.from({length: totalSessions}, (_, index) => {
              const sessionNum = (index + 1).toString();
              const session = sessions[sessionNum];
              const isCompleted = sessionProgress[sessionNum];
              
              return (
                <div 
                  key={sessionNum}
                  className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigateToSession(sessionNum)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Session Number */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        isCompleted ? 'bg-[#10b981]' : 'bg-[#4ECDC4]'
                      }`}>
                        {isCompleted ? '✓' : `${moduleId}.${sessionNum}`}
                      </div>
                      
                      {/* Session Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-[#2C3E50] text-lg md:text-xl mb-2">
                          Session {moduleId}.{sessionNum}: {session?.title || `Session ${sessionNum}`}
                        </h3>
                        <p className="text-gray-600 text-base md:text-lg mb-2">
                          {session?.description || "Session content description"}
                        </p>
                        {session?.scripture && (
                          <div className="flex items-center gap-2 text-sm text-[#4ECDC4] font-semibold">
                            <span>📖</span>
                            <span>{session.scripture}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="text-right">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-[#10b981] font-semibold">
                          <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                          <span>Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                          <span>Not Started</span>
                        </div>
                      )}
                      
                      {/* Duration Estimate */}
                      <div className="text-sm text-gray-500 mt-1">
                        15-20 min
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button 
                      className="w-full py-3 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-1"
                      style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToSession(sessionNum);
                      }}
                    >
                      {isCompleted ? 'Review Session' : 'Start Session'} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Complete Status */}
        {completedSessions === totalSessions && (
          <div className="bg-[#10b981] text-white rounded-2xl p-6 md:p-8 text-center">
            <div className="text-5xl md:text-6xl mb-4">🎉</div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Module {moduleId} Complete!</h3>
            <p className="text-lg md:text-xl opacity-90 mb-4">
              Excellent work! You've completed all sessions in this module.
            </p>
            {moduleId === "5" ? (
              <button 
                onClick={() => router.push('/assessment/post')}
                className="bg-white text-[#10b981] px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
              >
                📊 Take Final Assessment →
              </button>
            ) : (
              <button 
                onClick={() => router.push(`/modules/${parseInt(moduleId) + 1}`)}
                className="bg-white text-[#10b981] px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Continue to Module {parseInt(moduleId) + 1} →
              </button>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={navigateToDashboard}
            className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-3">🏠</div>
            <div className="font-bold text-[#2C3E50] mb-2">Dashboard</div>
            <div className="text-gray-600">Return to your learning dashboard</div>
          </button>
          
          <button 
            onClick={() => router.push('/business-planner')}
            className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-3">📊</div>
            <div className="font-bold text-[#2C3E50] mb-2">Business Planner</div>
            <div className="text-gray-600">Apply your learning to your business plan</div>
          </button>
          
          <button 
            onClick={() => router.push('/community')}
            className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-3">🤝</div>
            <div className="font-bold text-[#2C3E50] mb-2">Community</div>
            <div className="text-gray-600">Connect with fellow entrepreneurs</div>
          </button>
        </div>
      </div>

      {/* IBAM Footer */}
      <footer style={{background: '#2C3E50'}} className="text-white mt-16">
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
            <p style={{color: '#4ECDC4'}} className="text-base md:text-lg mt-2 font-semibold">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}