'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';
import { BookOpen, CheckCircle, Lock, Play, Award, ArrowRight } from 'lucide-react';

// Supabase client - Replace your current dashboard page.tsx with this
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardState {
  user: User | null;
  hasCompletedPreAssessment: boolean;
  hasCompletedPostAssessment: boolean;
  completedModules: number[];
  isLoading: boolean;
  error: string | null;
}

interface Module {
  id: number;
  title: string;
  sessions: number;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
}

const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    user: null,
    hasCompletedPreAssessment: false,
    hasCompletedPostAssessment: false,
    completedModules: [] as number[],
    isLoading: true,
    error: null,
  });

  const modules: Module[] = [
    {
      id: 1,
      title: "Foundational Principles",
      sessions: 4,
      description: "Business as God's gift, working with church leaders, godly guidelines",
      isLocked: !state.hasCompletedPreAssessment,
      isCompleted: state.completedModules.includes(1),
    },
    {
      id: 2,
      title: "Success and Failure Factors", 
      sessions: 4,
      description: "Understanding failure reasons, success factors, and God's will",
      isLocked: !state.completedModules.includes(1),
      isCompleted: state.completedModules.includes(2),
    },
    {
      id: 3,
      title: "Marketing Excellence",
      sessions: 5,
      description: "Marketing triangle, selling process, market research, competition",
      isLocked: !state.completedModules.includes(2),
      isCompleted: state.completedModules.includes(3),
    },
    {
      id: 4,
      title: "Financial Management",
      sessions: 4,
      description: "Funding, budgeting, investor requirements, listening to your business",
      isLocked: !state.completedModules.includes(3),
      isCompleted: state.completedModules.includes(4),
    },
    {
      id: 5,
      title: "Business Planning",
      sessions: 3,
      description: "Homework, writing your plan, implementation and launch",
      isLocked: !state.completedModules.includes(4),
      isCompleted: state.completedModules.includes(5),
    },
  ];

  // Check pre-assessment completion in database
  const checkPreAssessmentCompletion = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id')
        .eq('user_id', userId)
        .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7') // Pre-assessment ID
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking pre-assessment:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking pre-assessment:', error);
      return false;
    }
  };

  // Check post-assessment completion in database
  const checkPostAssessmentCompletion = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('id')
        .eq('user_id', userId)
        .eq('assessment_id', '4a70a585-ae69-4b93-92d0-a03ba789d853') // Post-assessment ID
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking post-assessment:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking post-assessment:', error);
      return false;
    }
  };

  // Check module completion based on session progress (20 sessions total)
  const checkModuleCompletion = async (userId: string): Promise<number[]> => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('session_id, completion_percentage')
        .eq('user_id', userId)
        .gte('completion_percentage', 100);

      if (error) {
        console.error('Error checking session completion:', error);
        return [];
      }

      // Calculate module completion based on session completion
      // Module 1: Sessions 1-4, Module 2: Sessions 5-8, Module 3: Sessions 9-13, 
      // Module 4: Sessions 14-17, Module 5: Sessions 18-20
      const completedSessions: number[] = data?.map(progress => progress.session_id) || [];
      const completedModules: number[] = [];

      // Module session ranges
      const moduleRanges: Array<{ module: number; start: number; end: number }> = [
        { module: 1, start: 1, end: 4 },    // 4 sessions
        { module: 2, start: 5, end: 8 },    // 4 sessions  
        { module: 3, start: 9, end: 13 },   // 5 sessions
        { module: 4, start: 14, end: 17 },  // 4 sessions
        { module: 5, start: 18, end: 20 },  // 3 sessions
      ];

      for (const range of moduleRanges) {
        const moduleSessions: number[] = [];
        for (let session = range.start; session <= range.end; session++) {
          moduleSessions.push(session);
        }

        // Check if all sessions in this module are completed
        const moduleComplete = moduleSessions.every((sessionId: number) => 
          completedSessions.includes(sessionId)
        );

        if (moduleComplete) {
          completedModules.push(range.module);
        }
      }

      return completedModules;
    } catch (error) {
      console.error('Error checking module completion:', error);
      return [];
    }
  };

  // Load user data and assessment status
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          setState(prev => ({ ...prev, error: 'Authentication error', isLoading: false }));
          return;
        }

        if (!user) {
          setState(prev => ({ ...prev, error: 'User not found', isLoading: false }));
          return;
        }

        // Check assessment completions and module progress
        const [preAssessmentCompleted, postAssessmentCompleted, completedModules] = await Promise.all([
          checkPreAssessmentCompletion(user.id),
          checkPostAssessmentCompletion(user.id),
          checkModuleCompletion(user.id),
        ]);

        setState({
          user,
          hasCompletedPreAssessment: preAssessmentCompleted,
          hasCompletedPostAssessment: postAssessmentCompleted,
          completedModules,
          isLoading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading user data:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to load user data', 
          isLoading: false 
        }));
      }
    };

    loadUserData();
  }, []);

  // Handle pre-assessment click
  const handlePreAssessmentClick = () => {
    window.location.href = '/assessment';
  };

  // Handle module click
  const handleModuleClick = (moduleId: number) => {
    if (modules.find(m => m.id === moduleId)?.isLocked) {
      return; // Don't navigate if locked
    }
    window.location.href = `/modules/${moduleId}/sessions/1`;
  };

  // Handle continue learning click
  const handleContinueLearning = () => {
    // Find the first incomplete module
    const nextModule = modules.find(module => !module.isCompleted && !module.isLocked);
    if (nextModule) {
      window.location.href = `/modules/${nextModule.id}/sessions/1`;
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    let totalSteps = 6; // Pre-assessment + 5 modules
    let completedSteps = 0;

    if (state.hasCompletedPreAssessment) completedSteps++;
    completedSteps += state.completedModules.length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{state.error}</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const allModulesCompleted = state.completedModules.length === 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {state.user?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Pre-Assessment: {state.hasCompletedPreAssessment ? '✓' : '○'}</span>
            <span>Modules: {state.completedModules.length}/5</span>
            <span>Post-Assessment: {state.hasCompletedPostAssessment ? '✓' : '○'}</span>
          </div>
        </div>

        {/* Pre-Assessment Section */}
        {!state.hasCompletedPreAssessment && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Start Your Journey</h2>
            </div>
            <p className="text-blue-100 mb-6 text-lg">
              Take the pre-assessment to unlock your Faith-Driven Business learning path and begin Module 1.
            </p>
            <button
              onClick={handlePreAssessmentClick}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Take Pre-Assessment
            </button>
          </div>
        )}

        {/* Continue Learning Button */}
        {state.hasCompletedPreAssessment && !allModulesCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Ready to Continue Learning?</h3>
                <p className="text-green-600">Jump back into your Faith-Driven Business training</p>
              </div>
              <button
                onClick={handleContinueLearning}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
              >
                Continue Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`
                bg-white rounded-lg shadow-md p-6 transition-all duration-200
                ${module.isLocked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg cursor-pointer hover:-translate-y-1'
                }
                ${module.isCompleted ? 'ring-2 ring-green-200' : ''}
              `}
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-3
                    ${module.isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : module.isLocked 
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-100 text-blue-600'
                    }
                  `}>
                    {module.isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : module.isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{module.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Module {module.id}</h3>
                    <p className="text-sm text-gray-600">{module.sessions} sessions</p>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold text-lg mb-2">{module.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`
                  text-sm px-3 py-1 rounded-full
                  ${module.isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : module.isLocked 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-blue-100 text-blue-800'
                  }
                `}>
                  {module.isCompleted ? 'Completed' : module.isLocked ? 'Locked' : 'Available'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Post-Assessment & Completion Section */}
        {allModulesCompleted && !state.hasCompletedPostAssessment && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Almost There!</h2>
            </div>
            <p className="text-yellow-100 mb-6 text-lg">
              You've completed all modules! Take your final assessment to measure your transformation and earn your Faith-Driven Business certificate.
            </p>
            <button 
              onClick={() => window.location.href = '/assessment/post'}
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center"
            >
              <Award className="w-5 h-5 mr-2" />
              Take Final Assessment
            </button>
          </div>
        )}

        {allModulesCompleted && state.hasCompletedPostAssessment && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Congratulations!</h2>
            </div>
            <p className="text-green-100 mb-6 text-lg">
              You've earned your Faith-Driven Business certificate! Your transformation journey is complete and your business is equipped for Kingdom impact.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center">
              <Award className="w-5 h-5 mr-2" />
              View Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// File: /app/dashboard/page.tsx
// This replaces your current localStorage-based dashboard