// app/components/quiz/SimpleReliableQuizSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, RotateCcw } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface SimpleReliableQuizSectionProps {
  sessionData: SessionData;
  onCompletion?: (completed: boolean, score?: { percentage: number, correct: number, total: number }) => void;
  onScoreAvailable?: (score: { percentage: number, correct: number, total: number }) => void;
}

const SimpleReliableQuizSection: React.FC<SimpleReliableQuizSectionProps> = ({ 
  sessionData, 
  onCompletion, 
  onScoreAvailable 
}) => {
  const moduleId = sessionData.module_id;
  const sessionNum = sessionData.session_number;
  
  // Storage key for this specific quiz
  const storageKey = `simple_quiz_${moduleId}_${sessionNum}`;
  
  // Get quiz questions from session data
  const getQuizQuestions = () => {
    let questions: any[] = [];
    
    if (sessionData.content) {
      const quizData = sessionData.content as any;
      if (quizData.quiz_questions) {
        questions = quizData.quiz_questions;
      } else if (quizData.quiz) {
        questions = quizData.quiz;
      }
    }
    
    // Fallback to FAQ questions if no quiz data
    if (questions.length === 0 && sessionData.faq_questions) {
      questions = sessionData.faq_questions.slice(0, 8).map((faq: any, index: number) => ({
        question: typeof faq === 'string' ? faq : faq.question,
        options: [
          "Biblical principles create competitive advantages",
          "Faith and business should be completely separate", 
          "Profit is more important than integrity",
          "Success requires compromising values"
        ],
        correct: 0,
        explanation: "Biblical business principles build trust, integrity, and excellence that customers value and create sustainable competitive advantages."
      }));
    }
    
    // Final fallback - default questions
    if (questions.length === 0) {
      questions = [
        {
          question: "What is the primary purpose of work according to Genesis 1:28?",
          options: [
            "To exercise dominion and create value for others",
            "To accumulate personal wealth only",
            "To compete aggressively with others", 
            "To work as little as possible"
          ],
          correct: 0,
          explanation: "God calls us to exercise dominion through meaningful work that creates value and serves others."
        },
        {
          question: "How should biblical entrepreneurs view their business?",
          options: [
            "As a platform for ministry and service",
            "As completely separate from faith",
            "As only a way to make money",
            "As less important than church"
          ],
          correct: 0,
          explanation: "Business can be a powerful platform for demonstrating God's character and serving others."
        },
        {
          question: "What does Proverbs 11:1 teach about business practices?",
          options: [
            "Honest scales and fair dealing please the Lord",
            "Deception is acceptable if profitable",
            "Business ethics are optional",
            "Profit justifies any means"
          ],
          correct: 0,
          explanation: "God delights in honest business practices and fair dealing with all people."
        },
        {
          question: "According to Proverbs 22:29, what leads to business success?",
          options: [
            "Skilled and diligent work",
            "Cutting corners and shortcuts",
            "Taking advantage of others",
            "Working without ethics"
          ],
          correct: 0,
          explanation: "Those skilled in their work will serve before kings - excellence and diligence lead to success."
        },
        {
          question: "What does Matthew 5:16 say about our work?",
          options: [
            "Let your good works shine so others glorify God",
            "Hide your faith in business settings",
            "Work only for personal recognition",
            "Business success doesn't matter to God"
          ],
          correct: 0,
          explanation: "Our excellent work should point others to God and bring Him glory."
        },
        {
          question: "How should we treat employees according to Ephesians 6:9?",
          options: [
            "With fairness, knowing God is Master of all",
            "As inferior and expendable",
            "Only focused on minimum wage",
            "Without consideration for their needs"
          ],
          correct: 0,
          explanation: "We should treat employees fairly, remembering that God is the Master of both employer and employee."
        },
        {
          question: "What does 1 Corinthians 10:31 teach about business?",
          options: [
            "Do everything for the glory of God",
            "Business is secular and separate from faith",
            "Only church activities glorify God",
            "Work is a necessary evil"
          ],
          correct: 0,
          explanation: "Whether eating, drinking, or doing business - do it all for God's glory."
        },
        {
          question: "According to Proverbs 16:11, what should characterize our pricing?",
          options: [
            "Honest weights and measures belong to the Lord",
            "Overcharge whenever possible",
            "Price based on what customers don't know",
            "Accuracy in pricing is not important"
          ],
          correct: 0,
          explanation: "God expects honesty and accuracy in all our business dealings and pricing."
        }
      ];
    }
    
    return questions.slice(0, 8); // Ensure exactly 8 questions
  };

  const questions = getQuizQuestions();
  
  // Simple state structure - no complex nested objects
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hasNotifiedScore, setHasNotifiedScore] = useState(false);
  
  // Load saved state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const data = JSON.parse(saved);
          if (data.answers && Array.isArray(data.answers)) {
            setAnswers(data.answers);
            setCurrentQuestion(data.currentQuestion || 0);
            setShowResults(data.showResults || false);
            setQuizCompleted(data.completed || false);
            console.log('📚 Restored simple quiz state:', data);
          }
        }
      } catch (error) {
        console.warn('Failed to load quiz state:', error);
      }
    }
  }, [storageKey]);
  
  // Save state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = {
        answers,
        currentQuestion,
        showResults,
        completed: quizCompleted,
        timestamp: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [answers, currentQuestion, showResults, quizCompleted, storageKey]);
  
  // Calculate score
  const calculateScore = () => {
    const correct = answers.filter((answer, index) => 
      answer !== undefined && answer === questions[index]?.correct
    ).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };
  
  // Handle answer selection
  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };
  
  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered - show results
      setShowResults(true);
      
      // Notify parent of score availability
      if (!hasNotifiedScore && onScoreAvailable) {
        const score = calculateScore();
        console.log('📊 Notifying parent of quiz score:', score);
        onScoreAvailable(score);
        setHasNotifiedScore(true);
      }
    }
  };
  
  // Complete quiz with 60% threshold check  
  const completeQuiz = () => {
    const score = calculateScore();
    
    if (score.percentage >= 60) {
      setQuizCompleted(true);
      console.log('✅ AUTOMATIC QUIZ: Quiz completed with passing score:', score);
      
      // 🔧 REVERT TO ORIGINAL APPROACH: Use same method as manual button
      // Save to localStorage for persistence
      const moduleNum = sessionData.module_id;
      const sessionNum = sessionData.session_number;
      const practiceStorageKey = `practice_quiz_completed_${moduleNum}_${sessionNum}`;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(practiceStorageKey, 'true');
        console.log('💾 AUTOMATIC QUIZ: Saved Memory Practice completion to localStorage');
      }
      
      onCompletion?.(true, score);
    } else {
      alert(`Score: ${score.percentage}%. You need 60% or higher to complete. Please review and retake.`);
    }
  };

  
  // Reset quiz
  const resetQuiz = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizCompleted(false);
    setHasNotifiedScore(false);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };
  
  // Get current question data
  const question = questions[currentQuestion];
  const hasAnswered = answers[currentQuestion] !== undefined;
  const score = calculateScore();
  
  if (questions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quiz Loading</h3>
        <p className="text-gray-600">Quiz questions will be available when content is ready.</p>
      </div>
    );
  }
  
  // Quiz completed view
  if (quizCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Memory Practice Complete!</h1>
          <p className="text-lg">Final Score: {score.correct}/{score.total} ({score.percentage}%)</p>
          <p className="text-green-100 mt-2">Great work! You can now continue with the session.</p>
        </div>
        
        <div className="p-6 bg-green-50">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              ✅ Memory Practice Complete ({score.percentage}%)
            </div>
            
            <div className="mt-6">
              <button
                onClick={resetQuiz}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center mx-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Results view with 60% threshold
  if (showResults) {
    const canComplete = score.percentage >= 60;
    
    return (
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-2xl font-bold mb-2">Quiz Results</h1>
          <p className="text-lg">Score: {score.correct}/{score.total} ({score.percentage}%)</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correct;
              
              return (
                <div key={index} className={`border rounded-lg p-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <p className="text-sm mb-2">{q.question}</p>
                  {!isCorrect && (
                    <div className="text-sm">
                      <p className="text-red-600">Your answer: {q.options[userAnswer]}</p>
                      <p className="text-green-600">Correct: {q.options[q.correct]}</p>
                      <p className="text-gray-600 mt-1">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center space-y-4">
            {canComplete ? (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    🎉 Congratulations! You scored {score.percentage}% and can advance.
                  </p>
                </div>
                <button
                  onClick={completeQuiz}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
                >
                  ✅ Complete Memory Practice ({score.percentage}%)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                  <p className="text-orange-800 font-medium">
                    You scored {score.percentage}%. You need 60% or higher to advance.
                  </p>
                  <p className="text-orange-700 text-sm mt-1">
                    Review the explanations above and try again!
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold"
                >
                  📚 Try Again
                </button>
              </div>
            )}
            
            <button
              onClick={resetQuiz}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium ml-4"
            >
              🔄 Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main quiz interface
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">🧠 Memory Practice</h1>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option: string, index: number) => {
            const isSelected = answers[currentQuestion] === index;
            const isCorrect = index === question.correct;
            
            let buttonClass = "w-full p-4 border-2 rounded-lg text-left transition-colors ";
            
            if (hasAnswered) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }
            } else {
              buttonClass += isSelected 
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-gray-200 bg-white text-gray-800 hover:border-gray-300";
            }
            
            return (
              <button
                key={index}
                onClick={() => !hasAnswered && selectAnswer(index)}
                disabled={hasAnswered}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="font-bold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {hasAnswered && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {hasAnswered && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-blue-800 mb-2">
              {answers[currentQuestion] === question.correct ? '✅ Correct!' : '💡 Learning Moment'}
            </h4>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}
        
        <div className="text-center">
          {hasAnswered ? (
            <button
              onClick={nextQuestion}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'View Results'}
            </button>
          ) : (
            <p className="text-gray-500">Select an answer to continue</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleReliableQuizSection;