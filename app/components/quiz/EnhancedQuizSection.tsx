// app/components/quiz/EnhancedQuizSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Lightbulb, X, ChevronRight } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface EnhancedQuizSectionProps {
  sessionData: SessionData;
  onCompletion?: (completed: boolean) => void;
}

const EnhancedQuizSection: React.FC<EnhancedQuizSectionProps> = ({ sessionData, onCompletion }) => {
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

  const questions = getQuizQuestions();

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
      onCompletion?.(true);
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
  
  // Trigger completion callback when quiz is finished (only once)
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);
  
  useEffect(() => {
    if (isCompleted && !hasTriggeredCompletion) {
      onCompletion?.(true);
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

  // Check if all questions have been answered (regardless of correctness)
  const allQuestionsAnswered = questionResults.every(result => result !== null);
  
  if (isCompleted || allQuestionsAnswered) {
    const currentScore = getCurrentScore();
    const percentage = Math.round((currentScore / questions.length) * 100);
    const isExcellent = percentage >= 80; // 80% or higher is excellent
    
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
              {isExcellent ? '🧠' : '📚'}
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {isExcellent ? 'Knowledge Mastery Complete!' : 'Quiz Complete!'}
            </h1>
            <p className="text-xl mb-4">
              {isExcellent ? 'Excellent Score:' : 'Your Score:'} {currentScore} out of {questions.length} ({percentage}%)
            </p>
            <p className="text-lg opacity-90">
              {isExcellent 
                ? "Outstanding! You've demonstrated strong understanding of faith-driven business principles."
                : `You've completed the quiz! ${percentage >= 60 ? 'Good effort!' : 'Consider reviewing the material and trying again.'}`
              }
            </p>
          </div>
        </div>
        
        {/* Individual Question Progress Display */}
        <div className="p-6 bg-green-50">
          <h3 className="text-xl font-bold text-green-800 mb-4 text-center">🎯 Your Perfect Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">Question {index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 truncate">{question.question}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 text-center space-y-4">
          {!isCompleted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                {percentage >= 80 ? 
                  'Great job! You can complete this section or retake for a perfect score.' :
                  'You can complete this section now or retake to improve your score.'
                }
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isCompleted && (
              <button
                onClick={() => {
                  setIsCompleted(true);
                  onCompletion?.(true);
                  console.log('✅ Quiz marked as complete by user choice');
                }}
                className={`${
                  percentage >= 80 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
              >
                ✅ Complete Quiz & Continue
              </button>
            )}
            
            <button
              onClick={resetQuiz}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              🔄 Retake Quiz
            </button>
            
            {isCompleted && (
              <div className="text-green-600 font-semibold">
                ✅ Section Completed Successfully!
              </div>
            )}
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