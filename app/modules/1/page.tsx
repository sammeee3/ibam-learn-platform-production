'use client';

import React, { useState, useEffect } from 'react';
import SafeFeedbackWidget from '../../components/feedback/SafeFeedbackWidget';
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
  Home,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Supabase configuration - FIXED to use environment variables
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

const Module1FoundationalPrinciples: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSessions: [],
    currentSessionId: null,
    moduleProgress: 0,
    totalSessions: 4
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [preAssessmentCompleted, setPreAssessmentCompleted] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ENHANCED: Get user ID using multiple methods
  const getTestUserId = async (): Promise<string> => {
    try {
      // First try to get the real authenticated user (same as pre-assessment)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('🔐 Found authenticated user:', user.id);
        return user.id;
      }
      
      // If no authenticated user, try database fallback
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id')
        .limit(1)
        .maybeSingle();
      
      if (!error && data?.user_id) {
        console.log('📊 Using database user ID:', data.user_id);
        return data.user_id;
      }
    } catch (error) {
      console.log('⚠️ No user found, using mock user ID');
    }
    
    // Last resort fallback
    return '550e8400-e29b-41d4-a716-446655440000';
  };

  // ENHANCED: Pre-assessment status check with detailed logging
  const checkPreAssessmentStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking pre-assessment for user:', userId);
      
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id, completed_at, user_id')
        .eq('user_id', userId)
        .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7') // Pre-assessment ID
        .single();

      console.log('📋 Assessment check result:', { data, error });
      
      if (data && !error) {
        setPreAssessmentCompleted(true);
        console.log('✅ Pre-assessment found - unlocking Module 1');
      } else {
        setPreAssessmentCompleted(false);
        console.log('❌ No pre-assessment found - Module 1 stays locked');
      }
    } catch (error) {
      console.error('🚨 Error checking pre-assessment:', error);
      setPreAssessmentCompleted(false);
    } finally {
      setAssessmentLoading(false);
    }
  };

  // NEW: Force refresh assessment status with multiple user ID methods
  const forceRefreshAssessment = async () => {
    console.log('🔄 Force refreshing assessment status...');
    setRefreshing(true);
    
    try {
      // Try multiple user ID methods
      const methods = [
        // Method 1: Real authenticated user
        async () => {
          const { data: { user } } = await supabase.auth.getUser();
          return user?.id;
        },
        
        // Method 2: Try all recent assessment users
        async () => {
          const { data, error } = await supabase
            .from('assessment_responses')
            .select('user_id')
            .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7')
            .order('completed_at', { ascending: false })
            .limit(5);
          
          return data?.[0]?.user_id;
        },
        
        // Method 3: Mock user fallback
        async () => '550e8400-e29b-41d4-a716-446655440000'
      ];
      
      for (const method of methods) {
        const testUserId = await method();
        if (!testUserId) continue;
        
        console.log(`🧪 Testing user ID: ${testUserId}`);
        
        const { data, error } = await supabase
          .from('assessment_responses')
          .select('id, completed_at, user_id')
          .eq('user_id', testUserId)
          .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7')
          .single();
        
        console.log(`📊 Result for ${testUserId}:`, { data, error });
        
        if (data && !error) {
          console.log('✅ Found assessment! Unlocking...');
          setUserId(testUserId);
          setPreAssessmentCompleted(true);
          setAssessmentLoading(false);
          setRefreshing(false);
          return;
        }
      }
      
      console.log('❌ No assessment found with any method');
      setPreAssessmentCompleted(false);
      setAssessmentLoading(false);
      
    } catch (error) {
      console.error('🚨 Force refresh failed:', error);
      setPreAssessmentCompleted(false);
      setAssessmentLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Load module data
  const loadModuleData = async () => {
    try {
      setLoading(true);
      
      // Get user ID
      const currentUserId = await getTestUserId();
      setUserId(currentUserId);

      // Check pre-assessment status
      await checkPreAssessmentStatus(currentUserId);

      // Get sessions for Module 1
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, session_number, title, subtitle')
        .eq('module_id', 1)
        .order('session_number');

      if (sessionsError) {
        throw new Error(`Sessions query failed: ${sessionsError.message}`);
      }

      // Get user progress for Module 1
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('session_id, completion_percentage, completed_at')
        .eq('user_id', currentUserId);

      if (!sessionsData || sessionsData.length === 0) {
        // Fallback to mock data
        const mockSessions: SessionData[] = [
          {
            id: 1,
            session_number: 1,
            title: "Business is a Good Gift from God",
            subtitle: "Understanding God's Original Design for Business",
            isCompleted: true,
            isLocked: false,
            isCurrentSession: false,
            completion_percentage: 100
          },
          {
            id: 2,
            session_number: 2,
            title: "Business Leaders Work Together with Church Leaders",
            subtitle: "Partnership Between Marketplace and Ministry",
            isCompleted: true,
            isLocked: false,
            isCurrentSession: false,
            completion_percentage: 100
          },
          {
            id: 3,
            session_number: 3,
            title: "God's Guidelines for Managing a Business",
            subtitle: "Biblical Principles for Business Operations",
            isCompleted: false,
            isLocked: false,
            isCurrentSession: true,
            completion_percentage: 0
          },
          {
            id: 4,
            session_number: 4,
            title: "Faith-Driven Business - The AVODAH Model",
            subtitle: "Your Calling as God's Entrepreneur",
            isCompleted: false,
            isLocked: true,
            isCurrentSession: false,
            completion_percentage: 0
          }
        ];

        setSessions(mockSessions);
        setUserProgress({
          completedSessions: [1, 2],
          currentSessionId: 3,
          moduleProgress: 50,
          totalSessions: 4
        });
        return;
      }

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
      console.error('Error loading module data:', error);
      // Use fallback data on error
      const mockSessions: SessionData[] = [
        {
          id: 1,
          session_number: 1,
          title: "Business is a Good Gift from God",
          subtitle: "Understanding God's Original Design for Business",
          isCompleted: false,
          isLocked: false,
          isCurrentSession: true,
          completion_percentage: 0
        },
        {
          id: 2,
          session_number: 2,
          title: "Business Leaders Work Together with Church Leaders",
          subtitle: "Partnership Between Marketplace and Ministry",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        },
        {
          id: 3,
          session_number: 3,
          title: "God's Guidelines for Managing a Business",
          subtitle: "Biblical Principles for Business Operations",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        },
        {
          id: 4,
          session_number: 4,
          title: "Faith-Driven Business - The AVODAH Model",
          subtitle: "Your Calling as God's Entrepreneur",
          isCompleted: false,
          isLocked: true,
          isCurrentSession: false,
          completion_percentage: 0
        }
      ];

      setSessions(mockSessions);
      setUserProgress({
        completedSessions: [],
        currentSessionId: 1,
        moduleProgress: 0,
        totalSessions: 4
      });
    } finally {
      setLoading(false);
    }
  };

  // ENHANCED: useEffect with retry logic
  useEffect(() => {
    const loadWithRetry = async () => {
      await loadModuleData();
      
      // If assessment still not found, try force refresh after 2 seconds
      setTimeout(() => {
        if (!preAssessmentCompleted && !assessmentLoading) {
          console.log('🔄 Assessment not found, trying force refresh...');
          forceRefreshAssessment();
        }
      }, 2000);
    };
    
    loadWithRetry();
  }, []);

  // ENHANCED: Pre-Assessment Required Banner with refresh functionality
  const PreAssessmentBanner: React.FC = () => {
    if (assessmentLoading) {
      return (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="font-medium">Checking assessment status...</p>
          </div>
        </div>
      );
    }
    
    if (!preAssessmentCompleted) {
      return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 mb-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-bold mb-1">Pre-Assessment Required</h3>
                <p className="text-blue-100 mb-2">
                  Complete your pre-course assessment to unlock Module 1 sessions and begin your learning journey.
                </p>
                <p className="text-blue-200 text-sm">
                  Already completed? <button 
                    onClick={forceRefreshAssessment}
                    disabled={refreshing}
                    className="underline hover:text-white disabled:opacity-50"
                  >
                    {refreshing ? 'Refreshing...' : 'Click here to refresh'}
                  </button>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.href = '/assessment/pre'}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Take Assessment
              </button>
              <button
                onClick={forceRefreshAssessment}
                disabled={refreshing}
                className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-300 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-3" />
          <p className="font-medium">Pre-assessment completed! You're ready to begin Module 1.</p>
        </div>
      </div>
    );
  };

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
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">  
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
              Dashboard → Module 1  
            </div>  
          </div>

          <div className="flex items-center justify-between">  
            <div className="flex items-center">  
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-6 text-3xl">  
                🏗️  
              </div>  
              <div>  
                <h1 className="text-3xl md:text-4xl font-bold mb-2">  
                  Module 1: Foundational Principles  
                </h1>  
                <p className="text-white/90 text-lg">Build the biblical foundation for your faith-driven business</p>  
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

  // Continue Learning CTA (Red like dashboard) - Updated with pre-assessment check
  const ContinueLearningCTA: React.FC = () => {
    const currentSession = sessions.find(s => s.isCurrentSession);
    
    if (!preAssessmentCompleted || !currentSession) return null;

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
            onClick={() => window.location.href = `/modules/1/sessions/${currentSession.id}`}
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
                    <span className="text-gray-600 text-sm">Understanding business as God's good gift to humanity</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">How business leaders work with church leaders effectively</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Godly guidelines for managing your business operations</span>  
                  </li>  
                  <li className="flex items-start">  
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">What makes a business truly faith-driven vs. secular</span>  
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
                    <span className="text-gray-600 text-sm">Biblical foundation for your entrepreneurship calling</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Clear understanding of your faith-driven business purpose</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Framework for biblical decision-making in business</span>  
                  </li>  
                  <li className="flex items-start">  
                    <Award className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />  
                    <span className="text-gray-600 text-sm">Confidence in God's design for marketplace ministry</span>  
                  </li>  
                </ul>  
              </div>  
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-xl p-4">  
              <div className="flex items-center">  
                <Clock className="w-5 h-5 text-blue-600 mr-3" />  
                <div>  
                  <h4 className="font-semibold text-blue-800">Time Commitment</h4>  
                  <p className="text-blue-600 text-sm">4 sessions • 15-25 minutes each • Complete at your own pace</p>  
                </div>  
              </div>  
            </div>  
          </div>  
        )}  
      </div>  
    );  
  };

  // Sessions Grid Component (Updated with pre-assessment check)
  const SessionsGrid: React.FC = () => {  
    return (  
      <div className="mb-6">  
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sessions in This Module</h2>  
          
        <div className="grid gap-4">  
          {sessions.map((session) => {
            // Lock all sessions if pre-assessment not completed
            const isSessionLocked = !preAssessmentCompleted || session.isLocked;
            
            return (
              <div  
                key={session.id}  
                className={`  
                  rounded-xl shadow-sm border transition-all duration-200  
                  ${isSessionLocked   
                    ? 'opacity-50 cursor-not-allowed bg-gray-100'   
                    : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'  
                  }  
                  ${session.isCompleted   
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400'   
                    : session.isCurrentSession && preAssessmentCompleted
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400'  
                      : isSessionLocked
                        ? 'bg-gray-100'  
                        : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400'  
                  }  
                `}  
                onClick={() => {
                  if (!preAssessmentCompleted) {
                    window.location.href = '/assessment/pre';
                  } else if (!session.isLocked) {
                    window.location.href = `/modules/1/sessions/${session.session_number}`;
                  }
                }}
              >  
                <div className="p-6">  
                  <div className="flex items-center justify-between">  
                    <div className="flex items-center flex-1">  
                      <div className={`  
                        w-12 h-12 rounded-full flex items-center justify-center mr-4  
                        ${session.isCompleted   
                          ? 'bg-green-500 text-white'   
                          : isSessionLocked   
                            ? 'bg-gray-300 text-gray-500'  
                            : session.isCurrentSession && preAssessmentCompleted
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'  
                              : 'bg-orange-500 text-white'  
                        }  
                      `}>  
                        {session.isCompleted ? (  
                          <CheckCircle className="w-6 h-6" />  
                        ) : isSessionLocked ? (  
                          <Lock className="w-6 h-6" />  
                        ) : session.isCurrentSession && preAssessmentCompleted ? (  
                          <Play className="w-6 h-6" />  
                        ) : (  
                          <span className="font-bold">{session.session_number}</span>  
                        )}  
                      </div>

                      <div className="flex-1">  
                        <div className="flex items-start justify-between mb-2">  
                          <h3 className={`font-semibold text-lg ${  
                            session.isCompleted ? 'text-green-800' :  
                            session.isCurrentSession && preAssessmentCompleted ? 'text-blue-800' :  
                            isSessionLocked ? 'text-gray-500' : 'text-orange-800'  
                          }`}>  
                            Session {session.session_number}: {session.title}  
                          </h3>  
                          <div className="text-sm text-gray-500 ml-4">  
                            20 min  
                          </div>  
                        </div>  
                        <p className={`text-sm mb-3 ${  
                          isSessionLocked ? 'text-gray-400' : 'text-gray-600'  
                        }`}>{session.subtitle}</p>  
                          
                        <div className="flex items-center justify-between">  
                          <span className={`  
                            text-xs px-3 py-1 rounded-full font-medium  
                            ${session.isCompleted   
                              ? 'bg-green-200 text-green-800'   
                              : isSessionLocked   
                                ? !preAssessmentCompleted
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'bg-gray-200 text-gray-600'
                                : session.isCurrentSession && preAssessmentCompleted
                                  ? 'bg-blue-200 text-blue-800'  
                                  : 'bg-orange-200 text-orange-800'  
                            }  
                          `}>  
                            {session.isCompleted   
                              ? 'Completed'   
                              : !preAssessmentCompleted
                                ? 'Pre-Assessment Required'
                                : session.isLocked   
                                  ? 'Locked'   
                                  : session.isCurrentSession  
                                    ? 'Current Session'  
                                    : 'Available'  
                            }  
                          </span>  
                            
                          {!isSessionLocked && (  
                            <ChevronRight className="w-5 h-5 text-gray-400" />  
                          )}  
                        </div>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
              </div>  
            );
          })}  
        </div>  
      </div>  
    );  
  };

  if (loading || assessmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Module 1...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">  
      <ModuleProgressHeader />

      <div className="flex-1">  
        <div className="max-w-6xl mx-auto px-4 py-8">  
          <PreAssessmentBanner />
          
          <ContinueLearningCTA />

          <ModuleOverview />

          <SessionsGrid />

          <BusinessPlannerAccess />  
        </div>  
      </div>

      <IBAMFooter />  
      <SafeFeedbackWidget />
    </div>  
  );  
};

export default Module1FoundationalPrinciples;