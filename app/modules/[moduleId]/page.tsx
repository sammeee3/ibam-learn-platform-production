'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, PlayCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SessionData {
  id: number;
  title: string;
  subtitle?: string;
  session_number: number;
  estimated_time?: string;
  transformation_promise?: string;
}

interface ModuleInfo {
  name: string;
  description: string;
  totalSessions: number;
}

const moduleConfig: Record<string, ModuleInfo> = {
  "1": { 
    name: "Foundational Principles", 
    description: "Discover how business reflects God's image and learn to work alongside church leaders while applying godly guidelines.",
    totalSessions: 4 
  },
  "2": { 
    name: "Success and Failure Factors", 
    description: "Understand what leads to business failure and success, learn to discern God's will, and build godly character.",
    totalSessions: 4 
  },
  "3": { 
    name: "Marketing Excellence", 
    description: "Master the marketing triangle, develop ethical selling processes, and understand your market and competition.",
    totalSessions: 5 
  },
  "4": { 
    name: "Financial Management", 
    description: "Learn biblical approaches to funding, budgeting, working with investors, and making sound financial decisions.",
    totalSessions: 4 
  },
  "5": { 
    name: "Business Planning", 
    description: "Complete your homework, write your comprehensive faith-driven business plan, and develop your launch strategy.",
    totalSessions: 3 
  }
};

export default function ModuleOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const moduleInfo = moduleConfig[moduleId];

  useEffect(() => {
    const loadModuleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load sessions for this module
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('id, title, subtitle, session_number, estimated_time, transformation_promise')
          .eq('module_id', parseInt(moduleId))
          .order('session_number');

        if (sessionsError) {
          throw sessionsError;
        }

        setSessions(sessionsData || []);

        // Load user progress
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('session_id')
            .eq('user_id', user.id)
            .gte('completion_percentage', 100);

          const completedSessionIds = progressData?.map(p => p.session_id) || [];
          setCompletedSessions(completedSessionIds);
        }

      } catch (err) {
        console.error('Error loading module data:', err);
        setError('Failed to load module data');
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId && moduleInfo) {
      loadModuleData();
    } else {
      setError('Module not found');
      setIsLoading(false);
    }
  }, [moduleId, moduleInfo]);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleSessionClick = (sessionNumber: number) => {
    router.push(`/modules/${moduleId}/sessions/${sessionNumber}`);
  };

  const calculateProgress = () => {
    if (sessions.length === 0) return 0;
    return Math.round((completedSessions.length / sessions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !moduleInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Module Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
          <button 
            onClick={handleBackToDashboard}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-white">
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Module {moduleId}: {moduleInfo.name}</h1>
                <p className="text-white/90 text-lg max-w-2xl">{moduleInfo.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-300">{progress}%</div>
                <div className="text-white/80">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{completedSessions.length} of {sessions.length} sessions completed</span>
            <span>{sessions.length - completedSessions.length} remaining</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {sessions.map((session) => {
            const isCompleted = completedSessions.includes(session.id);
            
            return (
              <div
                key={session.id}
                className={`
                  bg-white rounded-lg shadow-md border-l-4 transition-all duration-200
                  ${isCompleted 
                    ? 'border-green-500 ring-1 ring-green-200' 
                    : 'border-blue-500 hover:shadow-lg cursor-pointer hover:-translate-y-1'
                  }
                `}
                onClick={() => !isCompleted && handleSessionClick(session.session_number)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <PlayCircle className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Session {session.session_number}: {session.title}
                          </h3>
                          {session.estimated_time && (
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.estimated_time}
                            </span>
                          )}
                        </div>
                        
                        {session.subtitle && (
                          <p className="text-gray-600 mb-2">{session.subtitle}</p>
                        )}
                        
                        {session.transformation_promise && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                            <p className="text-blue-800 text-sm">
                              <strong>Transformation Promise:</strong> {session.transformation_promise}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                        }
                      `}>
                        {isCompleted ? 'Completed' : 'Start Session'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Completion Status */}
        {progress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">Module {moduleId} Complete!</h3>
            </div>
            <p className="text-green-100 mb-4">
              Congratulations! You've completed all sessions in this module.
            </p>
            <button 
              onClick={handleBackToDashboard}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
