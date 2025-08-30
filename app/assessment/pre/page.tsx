'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

// Supabase client
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

const PreAssessment: React.FC = () => {
  const STORAGE_KEY = 'ibam_pre_assessment_draft';
  
  // Initialize state from localStorage if available
  const getInitialState = (): AssessmentState => {
    if (typeof window === 'undefined') {
      return {
        currentQuestion: 0,
        answers: {},
        isSubmitting: false,
        isCompleted: false,
        error: null,
      };
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Only restore if saved within last 24 hours
        if (Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000) {
          console.log('🔄 Restored assessment draft from localStorage');
          return {
            currentQuestion: parsedData.currentQuestion || 0,
            answers: parsedData.answers || {},
            isSubmitting: false,
            isCompleted: false,
            error: null,
          };
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load assessment draft:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    
    return {
      currentQuestion: 0,
      answers: {},
      isSubmitting: false,
      isCompleted: false,
      error: null,
    };
  };
  
  const [state, setState] = useState<AssessmentState>(getInitialState());

  // Auto-save assessment draft when state changes
  useEffect(() => {
    const hasAnswers = Object.keys(state.answers).length > 0;
    
    if (hasAnswers && !state.isCompleted && !state.isSubmitting) {
      const saveTimeout = setTimeout(() => {
        try {
          const draftData = {
            currentQuestion: state.currentQuestion,
            answers: state.answers,
            timestamp: Date.now()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
          console.log('💾 Assessment draft auto-saved');
        } catch (error) {
          console.warn('Failed to save assessment draft:', error);
        }
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [state.currentQuestion, state.answers, state.isCompleted, state.isSubmitting, STORAGE_KEY]);

  // Pre-assessment questions
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
      text: "What is your primary motivation for taking this course?",
      options: [
        "To learn how to start a faith-based business",
        "To integrate my faith more deeply into my existing business",
        "To multiply disciples through my marketplace influence",
        "To develop biblical business strategies and practices"
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

  // Check if user has already completed pre-assessment
  useEffect(() => {
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
          .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7')
          .single();

        if (data && !error) {
          setState(prev => ({ ...prev, isCompleted: true }));
        }
      } catch (error) {
        console.error('Error checking existing assessment:', error);
      }
    };

    checkExistingAssessment();
  }, []);

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

      // Prepare responses for database (match your assessment_responses structure)
      const responses = Object.entries(state.answers).map(([questionIndex, answerIndex]) => ({
        question_id: parseInt(questionIndex) + 1,
        answer_index: answerIndex,
        answer_text: questions[parseInt(questionIndex)].options[answerIndex],
      }));

      // Calculate total score (for your total_score column)
      const totalScore = Object.values(state.answers).reduce((sum, answerIndex) => sum + (answerIndex + 1), 0);

      // Insert assessment response
      const { error } = await supabase
        .from('assessment_responses')
        .insert({
          user_id: profile.auth_user_id,
          assessment_id: 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7', // Pre-assessment ID
          responses: responses,
          total_score: totalScore,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setState(prev => ({ ...prev, isSubmitting: false, isCompleted: true }));
      
      // Clear the draft on successful submission
      localStorage.removeItem(STORAGE_KEY);

    } catch (error) {
      console.error('Error submitting assessment:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Failed to submit assessment. Please try again.',
      }));
    }
  };

  // Handle continue to dashboard
  const handleContinue = () => {
    window.location.href = '/modules/1';
  };

  // If already completed, show completion message
  if (state.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for completing the pre-assessment. You've unlocked Module 1 and can now begin your 
              Faith-Driven Business learning journey!
            </p>
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              Continue to Module 1
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pre-Course Assessment</h1>
                <p className="text-gray-600">Help us personalize your learning experience</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Question {state.currentQuestion + 1} of {questions.length}</div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${state.answers[state.currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
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
                    Complete Assessment
                    <CheckCircle className="w-5 h-5 ml-2" />
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
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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

export default PreAssessment;

// File: /app/assessment/pre/page.tsx  
// This saves to database and unlocks Module 1