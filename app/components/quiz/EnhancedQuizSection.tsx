// app/components/quiz/EnhancedQuizSection.tsx
'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Lightbulb, Loader2, X } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface EnhancedQuizSectionProps {
  sessionData: SessionData;
}

const EnhancedQuizSection: React.FC<EnhancedQuizSectionProps> = ({ sessionData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  // Extract quiz questions from content JSONB or FAQ questions
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

  const questions = getQuizQuestions();

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    setShowResult(prev => ({ ...prev, [questionIndex]: true }));
    
    const isCorrect = answerIndex === questions[questionIndex].correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Auto-advance after showing result (with celebration delay)
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult({});
    setScore(0);
    setIsCompleted(false);
    setShowRetry(false);
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

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className={`p-8 text-center ${
          isExcellent ? 'bg-gradient-to-r from-green-400 to-blue-500' : 
          isGood ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
          'bg-gradient-to-r from-red-400 to-pink-500'
        } text-white`}>
          <div className="text-5xl mb-4">
            {isExcellent ? '🎉' : isGood ? '👍' : '💪'}
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {isExcellent ? 'Excellent Work!' : isGood ? 'Good Job!' : 'Great Learning!'}
          </h1>
          <p className="text-lg mb-4">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
          <p className="text-lg opacity-90">
            {isExcellent ? 
              'You have excellent understanding of faith-driven business principles!' :
              isGood ?
              'You\'re building solid understanding. Keep learning!' :
              'Every question teaches valuable lessons. Learning is winning!'
            }
          </p>
        </div>
        
        <div className="p-8 text-center space-y-4">
          {!isExcellent && (
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
            >
              🔄 Try Again
            </button>
          )}
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setShowResult({});
            }}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            📖 Review Questions
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasAnswered = showResult[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

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
              Score: {score}/{questions.length}
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
                buttonStyle = "border-2 border-green-500 bg-green-50 text-green-800";
              } else if (index === selectedAnswer && index !== question.correct) {
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
                  {hasAnswered && index === selectedAnswer && index !== question.correct && (
                    <X className="w-5 h-5 text-red-600 ml-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Instant Feedback */}
        {hasAnswered && (
          <div className={`p-6 rounded-lg border-l-4 ${
            isCorrect 
              ? 'bg-green-50 border-green-400' 
              : 'bg-blue-50 border-blue-400'
          }`}>
            <div className="flex items-center mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              ) : (
                <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
              )}
              <h4 className={`text-lg font-bold ${
                isCorrect ? 'text-green-800' : 'text-blue-800'
              }`}>
                {isCorrect ? '🎉 Excellent!' : '💡 Learning Moment!'}
              </h4>
            </div>
            <p className={`text-base md:text-lg leading-relaxed ${
              isCorrect ? 'text-green-700' : 'text-blue-700'
            }`}>
              {question.explanation}
            </p>
            
            {!isCorrect && (
              <div className="mt-4 bg-white p-4 rounded border">
                <p className="text-gray-700 font-medium">
                  <strong>Remember:</strong> Learning is winning! Every question teaches valuable lessons about faith-driven business.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Question Hint */}
        {hasAnswered && currentQuestion < questions.length - 1 && (
          <div className="text-center mt-6 text-gray-600">
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Next question loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuizSection;