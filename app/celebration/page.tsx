// Celebration Page with Post-Assessment Guard
// File: /app/celebration/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Award, 
  Star, 
  Trophy, 
  Download, 
  Share2, 
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import PostAssessmentInlineModal from '../components/PostAssessmentInlineModal';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CelebrationState {
  loading: boolean;
  courseCompleted: boolean;
  postAssessmentCompleted: boolean;
  showPostAssessmentModal: boolean;
  userProgress: any;
}

const CelebrationPage: React.FC = () => {
  const [state, setState] = useState<CelebrationState>({
    loading: true,
    courseCompleted: false,
    postAssessmentCompleted: false,
    showPostAssessmentModal: false,
    userProgress: null
  });

  const checkCompletionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      // Check if course is completed (Module 5, Session 5 = 100%)
      const { data: courseProgress } = await supabase
        .from('user_progress')
        .select('completion_percentage, completed_at')
        .eq('user_id', user.id)
        .eq('module_id', 5)
        .eq('session_id', 5)
        .single();

      const courseCompleted = courseProgress && 
        courseProgress.completion_percentage === 100 && 
        courseProgress.completed_at !== null;

      // Check if post-assessment is completed
      const { data: postAssessment } = await supabase
        .from('assessment_responses')
        .select('id, completed_at')
        .eq('user_id', user.id)
        .eq('assessment_id', '4a70a585-ae69-4b93-92d0-a03ba789d853') // Your original post-assessment ID
        .single();

const postAssessmentCompleted = postAssessment && postAssessment.completed_at;

      console.log('🎯 Celebration page access check:', {
        courseCompleted,
        postAssessmentCompleted,
        canAccess: courseCompleted && postAssessmentCompleted
      });

      setState({
        loading: false,
        courseCompleted: !!courseCompleted,
        postAssessmentCompleted: !!postAssessmentCompleted,
        showPostAssessmentModal: !!courseCompleted && !postAssessmentCompleted,
        userProgress: courseProgress
      });

    } catch (error) {
      console.error('Error checking completion status:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkCompletionStatus();

    // Listen for post-assessment completion
    const handlePostAssessmentComplete = () => {
      setState(prev => ({
        ...prev,
        postAssessmentCompleted: true,
        showPostAssessmentModal: false
      }));
    };

    window.addEventListener('message', (event) => {
      if (event.data.type === 'POST_ASSESSMENT_COMPLETED') {
        handlePostAssessmentComplete();
      }
    });

    return () => {
      window.removeEventListener('message', handlePostAssessmentComplete);
    };
  }, []);

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your progress...</p>
        </div>
      </div>
    );
  }

  // Course not completed - redirect to dashboard
  if (!state.courseCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Yet Complete</h1>
          <p className="text-gray-600 mb-6">
            You need to complete all 5 modules before accessing the celebration page. 
            Keep going - you're doing great!
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Course completed but post-assessment not done - show modal
  if (!state.postAssessmentCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Almost There!</h1>
          <p className="text-gray-600 mb-6">
            You've completed the course! Please complete the final assessment to unlock your celebration.
          </p>
        </div>

        <PostAssessmentInlineModal 
          isOpen={state.showPostAssessmentModal}
          onComplete={() => {
            setState(prev => ({
              ...prev,
              postAssessmentCompleted: true,
              showPostAssessmentModal: false
            }));
          }}
        />
      </div>
    );
  }

  // Full celebration page - both course and post-assessment completed!
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Confetti Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 left-1/4 w-5 h-5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 right-1/3 w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-80 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Main Celebration */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Congratulations! 🎉
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
              You've Completed the International Business As Mission Course!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You are now equipped to multiply disciples through excellent, faith-driven business practices. 
              Your marketplace ministry journey begins now!
            </p>
          </div>

          {/* Completion Badges */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Completed</h3>
              <p className="text-gray-600 text-sm">All 5 modules successfully finished</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Complete</h3>
              <p className="text-gray-600 text-sm">Pre and post evaluations finished</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Multiply</h3>
              <p className="text-gray-600 text-sm">Equipped for marketplace discipleship</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </button>
            <button className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share Achievement
            </button>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Next Steps in Faith-Driven Business</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Implement your business plan using the AVODAH model</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Connect with local church leaders about your marketplace ministry</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Begin identifying potential disciples in your business network</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Long-term Vision:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" />
                    <span>Multiply disciples who will start their own faith-driven businesses</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" />
                    <span>Create positive community impact through biblical business practices</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" />
                    <span>Become a mentor for other faith-driven entrepreneurs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationPage;