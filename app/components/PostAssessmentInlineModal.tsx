// Fixed Post-Assessment Modal Component - No Popups, Same Questions as Pre-Assessment
// File: /components/PostAssessmentInlineModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, ArrowRight, Award, TrendingUp, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface AssessmentState {
  currentQuestion: number;
  answers: Record<number, number>;
  isSubmitting: boolean;
  isCompleted: boolean;
  error: string | null;
}

interface PostAssessmentInlineModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const PostAssessmentInlineModal: React.FC<PostAssessmentInlineModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestion: 0,
    answers: {},
    isSubmitting: false,
    isCompleted: false,
    error: null,
  });

  // EXACT same questions as pre-assessment for before/after comparison
  const questions: Question[] = [
    {
      id: 1,
      text: "How would you describe your current understanding of integrating faith with business?",
      options: [
        "I'm just beginning to explore this concept",
        "I have some understanding but want to learn more",
        "I'm fairly knowledgeable but need practical application",
        "I'm experienced and looking to deepen my approach"
      ]
    },
    {
      id: 2,
      text: "What is your current business experience level?",
      options: [
        "I'm planning to start my first business",
        "I have a startup (less than 2 years)",
        "I have an established business (2-5 years)",
        "I'm an experienced business owner (5+ years)"
      ]
    },
    {
      id: 3,
      text: "How familiar are you with using business as a vehicle for discipleship?",
      options: [
        "This is a completely new concept to me",
        "I've heard about it but don't know how to implement it",
        "I understand the concept but need practical strategies",
        "I'm already implementing some discipleship strategies"
      ]
    },
    {
      id: 4,
      text: "What is your primary motivation for your business?",
      options: [
        "Learning how to start a faith-based business",
        "Integrating my faith more deeply into my existing business",
        "Multiplying disciples through my marketplace influence",
        "Developing biblical business strategies and practices"
      ]
    },
    {
      id: 5,
      text: "How confident are you in your ability to write a comprehensive business plan?",
      options: [
        "Not confident at all - I need significant help",
        "Somewhat confident but need guidance",
        "Fairly confident with some areas of uncertainty",
        "Very confident in my business planning abilities"
      ]
    },
    {
      id: 6,
      text: "What's your current understanding of biblical financial principles in business?",
      options: [
        "I'm not familiar with biblical financial principles",
        "I know some principles but struggle with application",
        "I understand the principles and apply some of them",
        "I have strong knowledge and consistent application"
      ]
    },
    {
      id: 7,
      text: "How important is it to you that your business creates positive community impact?",
      options: [
        "I haven't really considered this aspect",
        "It's somewhat important but not my primary focus",
        "It's very important and influences my decisions",
        "It's central to my business mission and strategy"
      ]
    },
    {
      id: 8,
      text: "What best describes your current relationship with your local church regarding your business?",
      options: [
        "My business and church involvement are completely separate",
        "I attend church but don't connect it to my business",
        "I see some connections but don't know how to strengthen them",
        "I actively collaborate with church leaders in my business approach"
      ]
    },
    {
      id: 9,
      text: "How equipped do you feel to handle the challenges and failures that come with business?",
      options: [
        "I feel unprepared and anxious about potential challenges",
        "I have some strategies but lack confidence",
        "I feel moderately prepared with room for improvement",
        "I feel well-equipped with strong biblical foundations"
      ]
    },
    {
      id: 10,
      text: "What is your vision for the ultimate impact of your business?",
      options: [
        "Primarily financial success and personal fulfillment",
        "Financial success with some positive community impact",
        "Sustainable business that significantly serves others",
        "A business that multiplies disciples and transforms communities"
      ]
    }
  ];

  // Check if user has already completed post-assessment
  useEffect(() => {
    if (!isOpen) return;
    
    const checkExistingAssessment = async () => {
      try {
        // Use custom auth system
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
        if (!userEmail) return;
        
        const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        const profile = await profileResponse.json();
        if (!profile.auth_user_id) return;

        const { data, error } = await supabase
          .from('assessment_responses')
          .select('id')
          .eq('user_id', profile.auth_user_id)
          .eq('assessment_id', '4a70a585-ae69-4b93-92d0-a03ba789d853') // Using your original post-assessment ID
          .single();

        if (data && !error) {
          setState(prev => ({ ...prev, isCompleted: true }));
          setTimeout(() => onComplete(), 1500); // Auto-complete if already done
        }
      } catch (error) {
        console.error('Error checking existing assessment:', error);
      }
    };

    checkExistingAssessment();
  }, [isOpen, onComplete]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answerIndex,
      },
    }));
  };

  // Handle next question
  const handleNext = () => {
    if (state.currentQuestion < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  // Submit assessment to database
  const handleSubmit = async () => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));

      // Use custom auth system
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (!userEmail) {
        throw new Error('User not authenticated');
      }
      
      const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      const profile = await profileResponse.json();
      if (!profile.auth_user_id) {
        throw new Error('User profile not found');
      }

      // Prepare responses for database
      const responses = Object.entries(state.answers).map(([questionIndex, answerIndex]) => ({
        question_id: parseInt(questionIndex) + 1,
        answer_index: answerIndex,
        answer_text: questions[parseInt(questionIndex)].options[answerIndex],
      }));

      // Calculate total score
      const totalScore = Object.values(state.answers).reduce((sum, answerIndex) => sum + (answerIndex + 1), 0);

      // Insert assessment response with your original post-assessment ID
      const { error } = await supabase
        .from('assessment_responses')
        .insert({
          user_id: profile.auth_user_id,
          assessment_id: '4a70a585-ae69-4b93-92d0-a03ba789d853', // Your original post-assessment ID
          responses: responses,
          total_score: totalScore,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setState(prev => ({ ...prev, isSubmitting: false, isCompleted: true }));

      // Auto-close after completion
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (error) {
      console.error('Error submitting assessment:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Failed to submit assessment. Please try again.',
      }));
    }
  };

  if (!isOpen) return null;

  // If already completed, show brief success message
  if (state.isCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete! 🎉</h1>
          <p className="text-gray-600 mb-4">
            Thank you for completing the post-course assessment. You can now access your celebration!
          </p>
          <div className="animate-pulse text-green-600 font-medium">
            Redirecting to celebration...
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[state.currentQuestion];
  const isLastQuestion = state.currentQuestion === questions.length - 1;
  const hasAnswered = state.answers[state.currentQuestion] !== undefined;
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Post-Course Assessment</h1>
                <p className="text-green-100">Compare your growth and transformation</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">Question {state.currentQuestion + 1} of {questions.length}</div>
              <div className="w-32 bg-green-400 bg-opacity-30 rounded-full h-2 mt-1">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">Measuring Your Growth</h3>
                <p className="text-green-700 text-sm">
                  These are the same questions from your pre-assessment to measure your learning progress.
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.text}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                    ${state.answers[state.currentQuestion] === index
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${state.answers[state.currentQuestion] === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {state.answers[state.currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{state.error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={state.currentQuestion === 0}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-colors
                ${state.currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswered || state.isSubmitting}
                className={`
                  px-8 py-3 rounded-lg font-semibold transition-colors flex items-center
                  ${!hasAnswered || state.isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                {state.isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Course
                    <Award className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-colors flex items-center
                  ${!hasAnswered
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAssessmentInlineModal;