'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {   
  ArrowLeft,  
  BookOpen,   
  CheckCircle,   
  Lock,   
  Play,   
  Award,   
  ArrowRight,  
  Briefcase,  
  Target,  
  Clock,  
  Users,  
  Star,  
  ChevronRight,  
  ChevronDown,  
  ChevronUp,  
  Home  
} from 'lucide-react';

// Supabase configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// IBAM Logo Component
interface IBAMLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: React.CSSProperties;
}

const IBAMLogo: React.FC<IBAMLogoProps> = ({
  size = 'medium',
  className = '',
  style = {}
}: IBAMLogoProps) => {
  const sizeMap = {
    small: { width: '24px', height: 'auto' },
    medium: { width: '40px', height: 'auto' },
    large: { width: '60px', height: 'auto' },
    xlarge: { width: '120px', height: 'auto' }
  };

  const logoFile = size === 'small' 
    ? '/images/branding/mini-logo.png'
    : '/images/branding/ibam-logo.png';

  return (
    <img
      src={logoFile}
      alt="IBAM Logo"
      className={className}
      style={{ ...sizeMap[size], ...style }}
      onError={(e) => {
        e.currentTarget.src = '/images/branding/ibam-logo.png';
      }}
    />
  );
};

// Type Definitions
interface SessionData {  
  id: number;  
  session_number: number;
  title: string;  
  subtitle: string;
  isCompleted: boolean;  
  isLocked: boolean;  
  isCurrentSession: boolean;  
  completion_percentage: number;
}

interface UserProgress {  
  completedSessions: number[];  
  currentSessionId: number | null;  
  moduleProgress: number;  
  totalSessions: number;
}

const Module5BusinessPlanning: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSessions: [],
    currentSessionId: null,
    moduleProgress: 0,
    totalSessions: 5
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  // Get user ID using proper authentication
  const getTestUserId = async (): Promise<string> => {
    try {
      // First try to get the real authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('🔐 Module 5: Found authenticated user:', user.id);
        return user.id;
      }
      
      // If no authenticated user, try database fallback
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id')
        .limit(1)
        .maybeSingle();
      
      if (!error && data?.user_id) {
        console.log('📊 Module 5: Using database user ID:', data.user_id);
        return data.user_id;
      }
    } catch (error) {
      console.log('⚠️ Module 5: No user found, using mock user ID');
    }
    
    // Last resort fallback
    console.log('🔄 Module 5: Using fallback user ID');
    return '550e8400-e29b-41d4-a716-446655440000';
  };

  // Load module data
  const loadModuleData = async () => {
    try {
      setLoading(true);
      
      // Get user ID
      const currentUserId = await getTestUserId();
      setUserId(currentUserId);

      // Get sessions for Module 5 - Correct IDs 51-55
      console.log('🔍 Module 5: Querying database for sessions...');
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, session_number, title, subtitle')
        .eq('module_id', 5)
        .order('session_number');

      console.log('📊 Module 5: Sessions query result:', { sessionsData, sessionsError });

      if (sessionsError) {
        console.error('❌ Module 5: Sessions query failed:', sessionsError);
        throw new Error(`Sessions query failed: ${sessionsError.message}`);
      }

      // Get user progress for Module 5
      console.log('🔍 Module 5: Querying user progress for user:', currentUserId);
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('session_id, completion_percentage, completed_at')
        .eq('user_id', currentUserId)
        .eq('module_id', 5);

      console.log('📊 Module 5: Progress query result:', { progressData, progressError });

      if (!sessionsData || sessionsData.length === 0) {
        console.log('⚠️ Module 5: No sessions found in database, using fallback data');
        // FIXED: Fallback data with CORRECT IDs 51-55
        const mockSessions: SessionData[] = [
          {
            id: 51,
            session_number: 1,
            title: "Your 90-Day Launch Strategy - From Learning to Earning",
            subtitle: "Transform your learning into immediate action",
            isCompleted: false,
            isLocked: false,
            isCurrentSession: true,
            completion_percentage: 0
          },
          {
            id: 52,
            session_number: 2,
            title: "Building Relationships That Transform - People Development Through Business",
            subtitle: "Create lasting relationships that multiply impact",
            isCompleted: false,
            isLocked: true,
            isCurrentSession: false,
            completion_percentage: 0
          },
          {
            id: 53,
            session_number: 3,
            title: "Building Systems That Scale - From Solo to Team",
            subtitle: "Develop scalable systems for sustainable growth",
            isCompleted: false,
            isLocked: true,
            isCurrentSession: false,
            completion_percentage: 0
          },
          {
            id: 54,
            session_number: 4,
            title: "Measuring What Matters - Success Metrics & Advanced Growth",
            subtitle: "Track kingdom impact and business success",
            isCompleted: false,
            isLocked: true,
            isCurrentSession: false,
            completion_percentage: 0
          },
          {
            id: 55,
            session_number: 5,
            title: "Community Impact & Legacy Building - Creating Lasting Change",
            subtitle: "Build a legacy that multiplies disciples",
            isCompleted: false,
            isLocked: true,
            isCurrentSession: false,
            completion_percentage: 0
          }
        ];

        setSessions(mockSessions);
        setUserProgress({
          completedSessions: [],
          currentSessionId: 51,
          moduleProgress: 0,
          totalSessions: 5
        });
        return;
      }

      console.log('✅ Module 5: Found', sessionsData.length, 'sessions in database');

      // Process real data
      const progressMap = new Map();
      progressData?.forEach(p => {
        progressMap.set(p.session_id, {
          completion_percentage: p.completion_percentage,
          completed: p.completed_at !== null
        });
      });

      const processedSessions: SessionData[] = sessionsData.map((session, index) => {
        const progress = progressMap.get(session.id) || { completion_percentage: 0, completed: false };
        const isCompleted = progress.completed;
        const prevSession = index > 0 ? sessionsData[index - 1] : null;
        const prevProgress = prevSession ? progressMap.get(prevSession.id) : null;
        const isLocked = index > 0 && (!prevProgress || !prevProgress.completed);
        const isCurrentSession = !isCompleted && !isLocked;

        return {
          id: session.id,
          session_number: session.session_number,
          title: session.title,
          subtitle: session.subtitle || '',
          isCompleted,
          isLocked,
          isCurrentSession,
          completion_percentage: progress.completion_percentage
        };
      });

      // Calculate module progress
      const completedCount = processedSessions.filter(s => s.isCompleted).length;
      const moduleProgress = Math.round((completedCount / processedSessions.length) * 100);
      const currentSession = processedSessions.find(s => s.isCurrentSession);

      setSessions(processedSessions);
      setUserProgress({
        completedSessions: processedSessions.filter(s => s.isCompleted).map(s => s.id),
        currentSessionId: currentSession?.id || null,
        moduleProgress,
        totalSessions: processedSessions.length
      });

    } catch (error) {
      console.error('❌ Module 5: Error loading module data:', error);
      // FIXED: Use correct fallback data on error
      const mockSessions: SessionData[] = [
        {
          id: 51,
          session_number: 1,
          title: "Your 90-Day Launch Strategy - From Learning to Earning",
          subtitle: "Transform your learning into immediate action",
          isCompleted: false,
          isLocked: false,
          isCurrentSession: true,
          completion_percentage: 0
        },
        {
          id: 52,
          session_number: 2,
          title: "Building Relationships That Transform - People Development Through Business",
          subtitle: "Create lasting relationships that multiply impact",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        },
        {
          id: 53,
          session_number: 3,
          title: "Building Systems That Scale - From Solo to Team",
          subtitle: "Develop scalable systems for sustainable growth",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        },
        {
          id: 54,
          session_number: 4,
          title: "Measuring What Matters - Success Metrics & Advanced Growth",
          subtitle: "Track kingdom impact and business success",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        },
        {
          id: 55,
          session_number: 5,
          title: "Community Impact & Legacy Building - Creating Lasting Change",
          subtitle: "Build a legacy that multiplies disciples",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        }
      ];

      setSessions(mockSessions);
      setUserProgress({
        completedSessions: [],
        currentSessionId: 51,
        moduleProgress: 0,
        totalSessions: 5
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleData();
  }, []);

  // IBAM Footer Component  
  const IBAMFooter: React.FC = () => {  
    return (  
      <footer className="bg-gray-800 text-white py-6 mt-12">  
        <div className="max-w-6xl mx-auto px-4">  
          <div className="flex flex-col md:flex-row items-center justify-between">  
            <div className="flex items-center mb-4 md:mb-0">  
              <IBAMLogo size="medium" className="mr-3" />
              <div className="text-sm">  
                <p className="font-semibold">International Business As Mission</p>
                <p>© 2025 IBAM. Multiplying Followers of Jesus Christ through excellent, Faith-Driven Businesses.</p>
              </div>  
            </div>  
            <a   
              href="https://www.ibam.org"   
              target="_blank"   
              rel="noopener noreferrer"  
              className="text-teal-400 hover:text-teal-300 transition-colors text-sm"  
            >  
              www.ibam.org  
            </a>  
          </div>  
        </div>  
      </footer>  
    );  
  };

  // Business Planner Quick Access Component  
  const BusinessPlannerAccess: React.FC = () => {  
    return (  
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded-r-xl p-4 mb-6">  
        <div className="flex items-center justify-between">  
          <div className="flex items-center">  
            <Briefcase className="w-5 h-5 text-orange-600 mr-3" />  
            <div>  
              <h3 className="font-semibold text-orange-800">Business Planner</h3>  
              <p className="text-orange-600 text-sm">Apply your learning immediately</p>  
            </div>  
          </div>  
          <button  
            onClick={() => window.location.href = '/business-planner'}  
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm"  
          >  
            Open Planner  
          </button>  
        </div>  
      </div>  
    );  
  };

  // Module Progress Header Component  
  const ModuleProgressHeader: React.FC = () => {  
    return (  
      <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white shadow-lg">  
        <div className="max-w-6xl mx-auto px-4 py-6">  
          <div className="flex items-center mb-4">  
            <button   
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mr-6"  
            >  
              <ArrowLeft className="w-5 h-5 mr-2" />  
              Back to Dashboard  
            </button>  
            <div className="flex items-center text-white/80 text-sm">  
              <Home className="w-4 h-4 mr-2" />  
              Dashboard → Module 5  
            </div>  
          </div>

          <div className="flex items-center justify-between">  
            <div className="flex items-center">  
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-6 text-3xl">  
                📋  
              </div>  
              <div>  
                <h1 className="text-3xl md:text-4xl font-bold mb-2">  
                  Module 5: Business Planning  
                </h1>  
                <p className="text-white/90 text-lg">Transform your learning into a thriving business with launch strategies, relationship building, scalable systems, success metrics, and community impact planning</p>  
              </div>  
            </div>  
              
            <div className="text-right">  
              <div className="text-3xl font-bold">{userProgress.moduleProgress}%</div>  
              <div className="text-white/80 text-sm">  
                {userProgress.completedSessions.length} of {userProgress.totalSessions} sessions  
              </div>  
            </div>  
          </div>

          <div className="mt-6">  
            <div className="w-full bg-white/20 rounded-full h-3">  
              <div   
                className="bg-white h-3 rounded-full transition-all duration-500"  
                style={{ width: `${userProgress.moduleProgress}%` }}  
              ></div>  
            </div>  
          </div>  
        </div>  
      </div>  
    );  
  };

  // Continue Learning CTA (Red like dashboard)  
  const ContinueLearningCTA: React.FC = () => {
    const currentSession = sessions.find(s => s.isCurrentSession);
    if (!currentSession) return null;

    return (  
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6 mb-6">  
        <div className="flex items-center justify-between">  
          <div className="flex items-center">  
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">  
              <Play className="w-6 h-6" />  
            </div>  
            <div>  
              <h3 className="text-xl font-bold mb-1">Ready to Continue?</h3>  
              <p className="text-red-100">  
                Session {currentSession.session_number}: {currentSession.title}  
              </p>  
            </div>  
          </div>  
          <button  
            onClick={() => window.location.href = `/modules/5/sessions/${currentSession.id}`}
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center"  
          >  
            Continue Session  
            <ArrowRight className="w-5 h-5 ml-2" />  
          </button>  
        </div>  
      </div>  
    );  
  };

  // Module Overview Section (Accordion)  
  const ModuleOverview: React.FC = () => {  
    const [isExpanded, setIsExpanded] = useState(false);

    return (  
      <div className="bg-white rounded-xl shadow-sm border mb-6">  
        <button  
          onClick={() => setIsExpanded(!isExpanded)}  
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"  
        >  
          <div className="flex items-center justify-between">  
            <h2 className="text-xl font-bold text-gray-800 flex items-center">  
              <Target className="w-5 h-5 mr-2 text-gray-600" />  
              What You'll Accomplish in This Module  
            </h2>  
            {isExpanded ? (  
              <ChevronUp className="w-5 h-5 text-gray-400" />  
            ) : (  
              <ChevronDown className="w-5 h-5 text-gray-400" />  
            )}  
          </div>  
        </button>  
          
        {isExpanded && (  
          <div className="px-6 pb-6">  
            <div className="grid md:grid-cols-2 gap-6">  
              <div>  
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">  
                  <BookOpen className="w-4 h-4 mr-2" />  
                  What You'll Learn  
                </h3>  
                <ul className="space-y-2">  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">90-day launch strategy from learning to earning</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Relationship building for business transformation</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Scalable systems development from solo to team</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Success metrics and advanced growth strategies</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Community impact and legacy building</span>  
                  </li>  
                </ul>  
              </div>

              <div>  
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">  
                  <Star className="w-4 h-4 mr-2" />  
                  Key Outcomes  
                </h3>  
                <ul className="space-y-2">  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Complete business launch strategy ready to execute</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Relationship network for sustainable growth</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Scalable systems for team development</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Metrics framework for kingdom impact measurement</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Legacy plan for multiplying disciples through business</span>  
                  </li>  
                </ul>  
              </div>  
            </div>

            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 rounded-r-xl p-4">  
              <div className="flex items-center">  
                <Clock className="w-5 h-5 text-indigo-600 mr-3" />  
                <div>  
                  <h4 className="font-semibold text-indigo-800">Time Commitment</h4>  
                  <p className="text-indigo-600 text-sm">5 sessions • 25-30 minutes each • Business plan templates included</p>  
                </div>  
              </div>  
            </div>  
          </div>  
        )}  
      </div>  
    );  
  };

  // Sessions Grid Component - FIXED: Now uses session.id for routing
  const SessionsGrid: React.FC = () => {  
    return (  
      <div className="mb-6">  
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sessions in This Module</h2>  
          
        <div className="grid gap-4">  
          {sessions.map((session) => (  
            <div  
              key={session.id}  
              className={`  
                rounded-xl shadow-sm border transition-all duration-200  
                ${session.isLocked   
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'   
                  : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'  
                }  
                ${session.isCompleted   
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400'   
                  : session.isCurrentSession  
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400'  
                    : session.isLocked  
                      ? 'bg-gray-100'  
                      : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400'  
                }  
              `}  
              onClick={() => !session.isLocked && (window.location.href = `/modules/5/sessions/${session.id}`)}
            >  
              <div className="p-6">  
                <div className="flex items-center justify-between">  
                  <div className="flex items-center flex-1">  
                    <div className={`  
                      w-12 h-12 rounded-full flex items-center justify-center mr-4  
                      ${session.isCompleted   
                        ? 'bg-green-500 text-white'   
                        : session.isLocked   
                          ? 'bg-gray-300 text-gray-500'  
                          : session.isCurrentSession  
                            ? 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'  
                            : 'bg-orange-500 text-white'  
                      }  
                    `}>  
                      {session.isCompleted ? (  
                        <CheckCircle className="w-6 h-6" />  
                      ) : session.isLocked ? (  
                        <Lock className="w-6 h-6" />  
                      ) : session.isCurrentSession ? (  
                        <Play className="w-6 h-6" />  
                      ) : (  
                        <span className="font-bold">{session.session_number}</span>  
                      )}  
                    </div>

                    <div className="flex-1">  
                      <div className="flex items-start justify-between mb-2">  
                        <h3 className={`font-semibold text-lg ${  
                          session.isCompleted ? 'text-green-800' :  
                          session.isCurrentSession ? 'text-indigo-800' :  
                          session.isLocked ? 'text-gray-500' : 'text-orange-800'  
                        }`}>  
                          Session {session.session_number}: {session.title}  
                        </h3>  
                        <div className="text-sm text-gray-500 ml-4">  
                          28 min  
                        </div>  
                      </div>  
                      <p className={`text-sm mb-3 ${  
                        session.isLocked ? 'text-gray-400' : 'text-gray-600'  
                      }`}>{session.subtitle}</p>  
                        
                      <div className="flex items-center justify-between">  
                        <span className={`  
                          text-xs px-3 py-1 rounded-full font-medium  
                          ${session.isCompleted   
                            ? 'bg-green-200 text-green-800'   
                            : session.isLocked   
                              ? 'bg-gray-200 text-gray-600'  
                              : session.isCurrentSession  
                                ? 'bg-indigo-200 text-indigo-800'  
                                : 'bg-orange-200 text-orange-800'  
                          }  
                        `}>  
                          {session.isCompleted   
                            ? 'Completed'   
                            : session.isLocked   
                              ? 'Locked'   
                              : session.isCurrentSession  
                                ? 'Current Session'  
                                : 'Available'  
                          }  
                        </span>  
                          
                        {!session.isLocked && (  
                          <ChevronRight className="w-5 h-5 text-gray-400" />  
                        )}  
                      </div>  
                    </div>  
                  </div>  
                </div>  
              </div>  
            </div>  
          ))}  
        </div>  
      </div>  
    );  
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Module 5...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">  
      <ModuleProgressHeader />

      <div className="flex-1">  
        <div className="max-w-6xl mx-auto px-4 py-8">  
          <ContinueLearningCTA />

          <ModuleOverview />

          <SessionsGrid />

          <BusinessPlannerAccess />  
        </div>  
      </div>

      <IBAMFooter />  
    </div>  
  );  
};

export default Module5BusinessPlanning;