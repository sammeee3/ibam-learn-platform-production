// app/components/quiz/EnhancedQuizSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Lightbulb, X, ChevronRight } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface EnhancedQuizSectionProps {
  sessionData: SessionData;
  onCompletion?: (completed: boolean, score?: { percentage: number, correct: number, total: number }) => void;
  onScoreAvailable?: (score: { percentage: number, correct: number, total: number }) => void;
}

const EnhancedQuizSection: React.FC<EnhancedQuizSectionProps> = ({ sessionData, onCompletion, onScoreAvailable }) => {
  // 🧠 NEW INDIVIDUAL QUESTION PERSISTENCE SYSTEM
  const moduleId = sessionData.module_id;
  const sessionNum = sessionData.session_number;
  
  // 🔧 Individual question storage keys 
  const getQuestionStorageKey = (questionIndex: number) => 
    `quiz_question_${moduleId}_${sessionNum}_${questionIndex}`;
  const getQuizStateStorageKey = () => 
    `quiz_state_${moduleId}_${sessionNum}`;

  // Extract quiz questions from content JSONB or FAQ questions (moved up)
  const getQuizQuestions = () => {
    // First try to get from content JSONB structure
    let questions: any[] = [];
    
    if (sessionData.content) {
      // Check various possible locations for quiz data
      const contentStr = JSON.stringify(sessionData.content);
      if (contentStr.includes('quiz')) {
        // Try different possible quiz structures
        const quizData = sessionData.content as any;
        if (quizData.quiz_questions) {
          questions = quizData.quiz_questions;
        } else if (quizData.quiz) {
          questions = quizData.quiz;
        }
      }
    }
    
    // If no quiz in content, create questions from FAQ
    if (questions.length === 0 && sessionData.faq_questions) {
      questions = sessionData.faq_questions.slice(0, 5).map((faq: any, index: number) => {
        if (typeof faq === 'string') {
          return {
            question: faq,
            options: [
              "Integrity and excellent service build trust",
              "Biblical principles limit business success", 
              "Faith and business should be separate",
              "Profit is more important than principles"
            ],
            correct: 0,
            explanation: "Biblical business principles create competitive advantages through trust, integrity, and excellent service that customers value."
          };
        } else if (typeof faq === 'object' && faq.question) {
          return {
            question: faq.question,
            options: [
              "Focus on serving others through your business",
              "Compromise your values for short-term gain",
              "Avoid discussing faith in business contexts",
              "Prioritize profit over people"
            ],
            correct: 0,
            explanation: faq.answer || "The biblical approach focuses on serving others with integrity and excellence."
          };
        }
        return null;
      }).filter(Boolean);
    }

    // Default questions if nothing found
    if (questions.length === 0) {
      questions = [
        {
          question: "According to Genesis 1:26, what is the primary purpose of human work?",
          options: [
            "To exercise dominion and create value",
            "To accumulate personal wealth",
            "To compete with others", 
            "To avoid responsibility"
          ],
          correct: 0,
          explanation: "God created humans in His image to exercise dominion and steward creation through meaningful work."
        },
        {
          question: "How should faith-driven entrepreneurs view their business?",
          options: [
            "As a platform for ministry and service",
            "As separate from their spiritual life",
            "As only a way to make money",
            "As less important than church activities"
          ],
          correct: 0,
          explanation: "Business can be a powerful platform for demonstrating God's character and serving others."
        }
      ];
    }

    return questions;
  };
  
  // 🧠 Initialize individual question progress from localStorage
  const getInitialQuestionStates = (questions: any[]) => {
    if (typeof window === 'undefined') {
      return {
        questionResults: new Array(questions.length).fill(null),
        currentQuestion: 0,
        isCompleted: false
      };
    }
    
    try {
      // Load individual question results (NEVER expire - permanent learning progress)
      const questionResults = questions.map((_, index) => {
        const saved = localStorage.getItem(getQuestionStorageKey(index));
        return saved ? JSON.parse(saved) : null;
      });
      
      // Load general quiz state
      const quizState = localStorage.getItem(getQuizStateStorageKey());
      const savedState = quizState ? JSON.parse(quizState) : null;
      
      // Calculate completion based on individual question results
      const allQuestionsAnsweredCorrectly = questionResults.every(result => 
        result && result.isCorrect
      );
      
      console.log('🧠 Restored quiz progress:', {
        questionResults,
        allCorrect: allQuestionsAnsweredCorrectly,
        savedCurrentQuestion: savedState?.currentQuestion
      });
      
      return {
        questionResults,
        currentQuestion: allQuestionsAnsweredCorrectly ? 0 : (savedState?.currentQuestion || 0),
        isCompleted: allQuestionsAnsweredCorrectly
      };
    } catch (error) {
      console.warn('Failed to load individual question progress:', error);
      return {
        questionResults: new Array(questions.length).fill(null),
        currentQuestion: 0,
        isCompleted: false
      };
    }
  };
  
  // Get quiz questions first to initialize state
  const quizQuestions = getQuizQuestions();
  const initialQuestionStates = getInitialQuestionStates(quizQuestions);
  
  // 🧠 NEW STATE STRUCTURE - Individual question tracking
  const [questionResults, setQuestionResults] = useState<Array<{
    selectedAnswer: number;
    isCorrect: boolean;
    showResult: boolean;
  } | null>>(initialQuestionStates.questionResults);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestionStates.currentQuestion);
  const [isCompleted, setIsCompleted] = useState(initialQuestionStates.isCompleted);
  const [celebrationActive, setCelebrationActive] = useState(false);
  
  // 🎓 NEW MASTERY-BASED FLOW STATES
  const [quizStage, setQuizStage] = useState<'initial' | 'review' | 'mastery'>('initial');
  const [reviewQuestions, setReviewQuestions] = useState<number[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const questions = getQuizQuestions();

  // 🎓 MASTERY-BASED FLOW HELPERS
  const getIncorrectQuestions = () => {
    return questionResults
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result && !result.isCorrect)
      .map(({ index }) => index);
  };
  
  const getCorrectQuestions = () => {
    return questionResults
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result && result.isCorrect)
      .map(({ index }) => index);
  };
  
  const getAllAnsweredQuestions = () => {
    return questionResults.filter(result => result !== null).length;
  };
  
  const startReviewMode = () => {
    const incorrect = getIncorrectQuestions();
    if (incorrect.length > 0) {
      setReviewQuestions(incorrect);
      setCurrentReviewIndex(0);
      setQuizStage('review');
    } else {
      // All correct, go straight to mastery
      setQuizStage('mastery');
    }
  };
  
  const completeReview = () => {
    setQuizStage('mastery');
  };

  // 🧠 NEW ANSWER HANDLING - Individual question persistence
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const isCorrect = answerIndex === questions[questionIndex].correct;
    
    // Create question result
    const questionResult = {
      selectedAnswer: answerIndex,
      isCorrect,
      showResult: true
    };
    
    // Update local state
    setQuestionResults(prev => {
      const newResults = [...prev];
      newResults[questionIndex] = questionResult;
      return newResults;
    });
    
    // 💾 PERMANENT STORAGE: Save individual question result (never expires)
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        getQuestionStorageKey(questionIndex), 
        JSON.stringify(questionResult)
      );
      console.log(`🧠 Saved question ${questionIndex} result:`, questionResult);
    }
    
    if (isCorrect) {
      setCelebrationActive(true);
      setTimeout(() => setCelebrationActive(false), 2000);
    }
  };
  
  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      // Move to next unanswered question
      let nextQuestion = currentQuestion + 1;
      while (nextQuestion < questions.length && questionResults[nextQuestion]?.isCorrect) {
        nextQuestion++;
      }
      
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        // Save current question position
        if (typeof window !== 'undefined') {
          localStorage.setItem(getQuizStateStorageKey(), JSON.stringify({
            currentQuestion: nextQuestion,
            timestamp: Date.now()
          }));
        }
      } else {
        // Check if all questions are correct
        checkQuizCompletion();
      }
    } else {
      checkQuizCompletion();
    }
  };
  
  // 🧠 NEW COMPLETION LOGIC - All questions must be answered correctly
  const checkQuizCompletion = () => {
    const allCorrect = questionResults.every((result, index) => 
      result && result.isCorrect && index < questions.length
    );
    
    if (allCorrect) {
      setIsCompleted(true);
      const currentScore = getCurrentScore();
      const scoreData = {
        percentage: Math.round((currentScore / questions.length) * 100),
        correct: currentScore,
        total: questions.length
      };
      onCompletion?.(true, scoreData);
      console.log('🎉 Quiz completed! All questions answered correctly.');
    }
  };

  // 🧠 NEW: Save quiz state (but individual questions saved separately)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const quizState = {
        currentQuestion,
        isCompleted,
        timestamp: Date.now()
      };
      localStorage.setItem(getQuizStateStorageKey(), JSON.stringify(quizState));
      console.log('💾 Saved quiz state:', quizState);
    }
  }, [currentQuestion, isCompleted]);
  
  // Notify parent when score becomes available (initial attempt complete)
  const [hasNotifiedScore, setHasNotifiedScore] = useState(false);
  
  useEffect(() => {
    const allAnswered = questionResults.every(result => result !== null);
    if (allAnswered && quizStage === 'initial' && !hasNotifiedScore && onScoreAvailable) {
      const scoreData = getCurrentScoreData();
      console.log('🎯 Notifying parent of score availability:', scoreData);
      onScoreAvailable(scoreData);
      setHasNotifiedScore(true);
    }
  }, [questionResults, quizStage, hasNotifiedScore]);
  
  // Trigger completion callback when quiz is finished (only once)
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);
  
  useEffect(() => {
    if (isCompleted && !hasTriggeredCompletion) {
      const currentScore = getCurrentScore();
      const scoreData = {
        percentage: Math.round((currentScore / questions.length) * 100),
        correct: currentScore,
        total: questions.length
      };
      onCompletion?.(true, scoreData);
      setHasTriggeredCompletion(true);
      console.log('🎉 Quiz completion callback triggered (once)');
    }
  }, [isCompleted, hasTriggeredCompletion, onCompletion]);
  
  // 🧠 NEW RESET: Clear all individual question progress (for admin/debug purposes)
  const resetQuiz = () => {
    if (typeof window !== 'undefined') {
      // Clear individual question results
      questions.forEach((_, index) => {
        localStorage.removeItem(getQuestionStorageKey(index));
      });
      // Clear quiz state
      localStorage.removeItem(getQuizStateStorageKey());
      console.log('🔄 Reset all quiz progress - individual questions cleared');
    }
    
    // Reset component state
    setQuestionResults(new Array(questions.length).fill(null));
    setCurrentQuestion(0);
    setIsCompleted(false);
    setCelebrationActive(false);
    
    // 🎓 Reset mastery-based flow states
    setQuizStage('initial');
    setReviewQuestions([]);
    setCurrentReviewIndex(0);
  };
  
  // 🧠 Calculate current score from individual question results
  const getCurrentScore = () => {
    return questionResults.filter(result => result && result.isCorrect).length;
  };

  if (questions.length === 0) {
    return (
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-pink-600" />
        <h3 className="text-lg font-semibold text-pink-800 mb-2">Quiz Content Loading</h3>
        <p className="text-pink-700">Quiz questions will be available when the content is updated.</p>
      </div>
    );
  }

  // 🎓 STAGE 3: MASTERY CONFIRMATION - Final completion with celebration
  if (quizStage === 'mastery' || isCompleted) {
    const currentScore = getCurrentScore();
    const incorrectQuestions = getIncorrectQuestions();
    const percentage = Math.round((currentScore / questions.length) * 100);
    const isMastery = percentage >= 80; // 80% or higher is mastery
    
    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 text-center relative overflow-hidden">
          {/* Celebration animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 text-3xl animate-bounce">🎉</div>
            <div className="absolute top-8 right-8 text-2xl animate-pulse">⭐</div>
            <div className="absolute bottom-6 left-8 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🏆</div>
            <div className="absolute bottom-4 right-6 text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
          </div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-bounce">
              {isMastery ? '🏆' : '📚'}
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {isMastery ? 'MASTERY ACHIEVED!' : 'Learning Complete!'}
            </h1>
            <p className="text-xl mb-4">
              Final Score: {currentScore} out of {questions.length} ({percentage}%)
            </p>
            <p className="text-lg opacity-90">
              {isMastery 
                ? "🌟 Outstanding! You've mastered these faith-driven business principles!"
                : `✅ Great work! You've completed the learning process and can now continue.`
              }
            </p>
          </div>
        </div>
        
        {/* Mastery Progress Display */}
        <div className="p-6 bg-green-50">
          <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
            🎯 Your Learning Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((question, index) => {
              const result = questionResults[index];
              const isCorrect = result?.isCorrect || false;
              return (
                <div key={index} className={`rounded-lg p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-orange-600 mr-2" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                      Question {index + 1} {isCorrect ? '✓ Mastered' : '💡 Learned'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{question.question}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Single Clear Completion Button */}
        <div className="p-6 bg-gray-50 text-center">
          {!isCompleted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                🎓 You've completed the learning process and can now continue with the session.
              </p>
            </div>
          )}
          
          <div className="space-y-8">
            {!isCompleted && (
              <button
                onClick={() => {
                  setIsCompleted(true);
                  const currentScore = getCurrentScore();
                  const scoreData = {
                    percentage: Math.round((currentScore / questions.length) * 100),
                    correct: currentScore,
                    total: questions.length
                  };
                  onCompletion?.(true, scoreData);
                  console.log('✅ Quiz mastery confirmed - section complete');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                🏆 Confirm Mastery & Continue Session
              </button>
            )}
            
            {isCompleted && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <div className="text-green-700 font-bold text-lg">✅ MASTERY CONFIRMED!</div>
                <p className="text-green-600">You can continue with the session</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={resetQuiz}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎓 STAGE 2: TARGETED REVIEW - Show only incorrect questions for focused learning
  if (quizStage === 'review' && reviewQuestions.length > 0) {
    const currentReviewQuestionIndex = reviewQuestions[currentReviewIndex];
    const question = questions[currentReviewQuestionIndex];
    const result = questionResults[currentReviewQuestionIndex];
    
    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Review Mode Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-bold">🎯 Targeted Review Mode</h1>
            <div className="flex items-center space-x-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Review {currentReviewIndex + 1} of {reviewQuestions.length}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Question {currentReviewQuestionIndex + 1}
              </span>
            </div>
          </div>
          <p className="text-orange-100">Let's focus on mastering these concepts</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentReviewIndex + 1) / reviewQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Review Question Content */}
        <div className="p-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Lightbulb className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">Learning Opportunity</span>
            </div>
            <p className="text-orange-700 text-sm">
              This question needs attention. Review the explanation and try again.
            </p>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-tight">
            {question.question}
          </h2>

          {/* Previous Answer Review */}
          {result && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <X className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Previous Answer</span>
              </div>
              <p className="text-red-700">"{question.options[result.selectedAnswer]}"</p>
            </div>
          )}

          {/* Correct Answer & Explanation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">Correct Answer</span>
            </div>
            <p className="text-green-700 font-medium mb-3">"{question.options[question.correct]}"</p>
            <p className="text-green-600 text-sm">{question.explanation}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (currentReviewIndex > 0) {
                  setCurrentReviewIndex(currentReviewIndex - 1);
                }
              }}
              disabled={currentReviewIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Previous
            </button>

            <span className="text-gray-600">
              {currentReviewIndex + 1} of {reviewQuestions.length} concepts to master
            </span>

            {currentReviewIndex < reviewQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentReviewIndex(currentReviewIndex + 1)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Next Review →
              </button>
            ) : (
              <button
                onClick={completeReview}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Complete Review 🎯
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 🎓 STAGE 1: INITIAL ATTEMPT - Check if all questions answered, then move to appropriate stage
  const allQuestionsAnswered = questionResults.every(result => result !== null);
  
  // Get current score for UI display
  const getCurrentScoreData = () => {
    const currentScore = getCurrentScore();
    return {
      percentage: Math.round((currentScore / questions.length) * 100),
      correct: currentScore,
      total: questions.length
    };
  };
  
  if (allQuestionsAnswered && quizStage === 'initial') {
    const currentScore = getCurrentScore();
    const incorrectQuestions = getIncorrectQuestions();
    const percentage = Math.round((currentScore / questions.length) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 text-center relative overflow-hidden">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-3xl font-bold mb-4">Initial Attempt Complete!</h1>
          <p className="text-xl mb-4">
            Score: {currentScore} out of {questions.length} ({percentage}%)
          </p>
        </div>
        
        {/* Results Summary */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Mastered Concepts */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-green-800">Mastered ({currentScore})</h3>
              </div>
              {getCorrectQuestions().map(index => (
                <div key={index} className="text-sm text-green-700 mb-1">
                  ✓ Question {index + 1}
                </div>
              ))}
            </div>

            {/* Needs Review */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-6 h-6 text-orange-600 mr-2" />
                <h3 className="text-lg font-bold text-orange-800">Needs Review ({incorrectQuestions.length})</h3>
              </div>
              {incorrectQuestions.map(index => (
                <div key={index} className="text-sm text-orange-700 mb-1">
                  💡 Question {index + 1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="text-center space-y-4">
            {incorrectQuestions.length > 0 ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    🎯 Let's review the {incorrectQuestions.length} concepts that need attention for mastery.
                  </p>
                </div>
                <button
                  onClick={startReviewMode}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                >
                  📚 Review Missed Concepts ({incorrectQuestions.length})
                </button>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    🏆 Perfect! You got all questions correct. You've achieved mastery!
                  </p>
                </div>
                <button
                  onClick={() => setQuizStage('mastery')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                >
                  🎉 Celebrate Mastery
                </button>
              </>
            )}
            
            <button
              onClick={resetQuiz}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors ml-4"
            >
              🔄 Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 🧠 NEW: Main quiz interface with individual question tracking
  const question = questions[currentQuestion];
  const currentResult = questionResults[currentQuestion];
  const hasAnswered = currentResult !== null;
  const isCorrect = currentResult?.isCorrect || false;

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Beautiful Quiz Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">🧠 Knowledge Confidence Builder</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Score: {getCurrentScore()}/{questions.length}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-tight">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-4 mb-6">
          {question.options.map((option: string, index: number) => {
            let buttonStyle = "border-2 border-gray-200 bg-white hover:border-gray-300 text-gray-800";
            
            if (hasAnswered) {
              if (index === question.correct) {
                buttonStyle = `border-2 border-green-500 bg-green-50 text-green-800 ${celebrationActive ? 'animate-pulse shadow-lg' : ''}`;
              } else if (index === currentResult?.selectedAnswer && index !== question.correct) {
                buttonStyle = "border-2 border-red-500 bg-red-50 text-red-800";
              } else {
                buttonStyle = "border-2 border-gray-200 bg-gray-50 text-gray-600";
              }
            }

            return (
              <button
                key={index}
                onClick={() => !hasAnswered && handleAnswerSelect(currentQuestion, index)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-lg text-left transition-all ${buttonStyle} ${
                  !hasAnswered ? 'hover:shadow-md transform hover:scale-[1.02]' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold mr-3 text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1 text-base md:text-lg">{option}</span>
                  {hasAnswered && index === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
                  )}
                  {hasAnswered && index === currentResult?.selectedAnswer && index !== question.correct && (
                    <X className="w-5 h-5 text-red-600 ml-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Feedback with User Control */}
        {hasAnswered && (
          <div className={`p-6 rounded-lg border-l-4 transition-all ${
            isCorrect 
              ? `bg-green-50 border-green-400 ${celebrationActive ? 'shadow-xl ring-2 ring-green-200' : ''}` 
              : 'bg-blue-50 border-blue-400'
          }`}>
            <div className="flex items-center mb-3">
              {isCorrect ? (
                <CheckCircle className={`w-6 h-6 text-green-600 mr-3 ${celebrationActive ? 'animate-bounce' : ''}`} />
              ) : (
                <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
              )}
              <h4 className={`text-lg font-bold ${
                isCorrect ? 'text-green-800' : 'text-blue-800'
              }`}>
                {isCorrect ? '🎉 Excellent Work!' : '💡 Great Learning Moment!'}
              </h4>
              {isCorrect && celebrationActive && (
                <div className="ml-3 text-2xl animate-bounce">🎊</div>
              )}
            </div>
            <p className={`text-base md:text-lg leading-relaxed mb-4 ${
              isCorrect ? 'text-green-700' : 'text-blue-700'
            }`}>
              {question.explanation}
            </p>
            
            {!isCorrect && (
              <div className="mt-4 bg-white p-4 rounded border border-blue-200">
                <p className="text-blue-800 font-medium">
                  <strong>Keep Growing:</strong> Every question builds your wisdom as a faith-driven entrepreneur. You're learning valuable biblical business principles!
                </p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={handleContinue}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center mx-auto"
              >
                {currentQuestion < questions.length - 1 ? 'Continue to Next Question' : 'Complete Quiz'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
};

export default EnhancedQuizSection;