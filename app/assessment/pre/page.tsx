'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Standardized 10 questions (1-10 scale) - IDENTICAL to post-assessment
const assessmentQuestions = [
  {
    id: 1,
    category: 'Business Confidence',
    question: 'How confident are you in your ability to start and run a successful faith-driven business?',
    subtitle: 'Rate your overall confidence level in entrepreneurship'
  },
  {
    id: 2,
    category: 'Financial Management',
    question: 'How comfortable are you with managing business finances, cash flow, and budgeting?',
    subtitle: 'Include bookkeeping, financial planning, and money management'
  },
  {
    id: 3,
    category: 'Marketing Skills',
    question: 'How effective are you at marketing your business and attracting customers?',
    subtitle: 'Include social media, networking, and customer acquisition'
  },
  {
    id: 4,
    category: 'Leadership Ability',
    question: 'How prepared are you to lead a team and build organizational culture?',
    subtitle: 'Include hiring, training, and developing others'
  },
  {
    id: 5,
    category: 'Faith Integration',
    question: 'How well can you integrate your faith values into business practices?',
    subtitle: 'Include biblical principles in decision-making and operations'
  },
  {
    id: 6,
    category: 'Goal Clarity',
    question: 'How clear are you about your business vision, mission, and strategic goals?',
    subtitle: 'Include both kingdom impact and business objectives'
  },
  {
    id: 7,
    category: 'Networking Skills',
    question: 'How effectively can you build relationships and professional networks?',
    subtitle: 'Include partnerships, mentors, and industry connections'
  },
  {
    id: 8,
    category: 'Problem Solving',
    question: 'How confident are you in solving complex business challenges and obstacles?',
    subtitle: 'Include crisis management and creative solutions'
  },
  {
    id: 9,
    category: 'Time Management',
    question: 'How well do you manage your time and prioritize business activities?',
    subtitle: 'Include productivity, delegation, and work-life balance'
  },
  {
    id: 10,
    category: 'Risk Tolerance',
    question: 'How comfortable are you with taking calculated business risks and making tough decisions?',
    subtitle: 'Include investment decisions and strategic pivots'
  }
];

export default function PreAssessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(assessmentQuestions.length).fill(-1));
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const answeredQuestions = answers.filter(answer => answer !== -1).length;
  const progressPercentage = Math.round((answeredQuestions / assessmentQuestions.length) * 100);

  // Auto-save to localStorage
  useEffect(() => {
    if (answeredQuestions > 0) {
      setSaveStatus('saving');
      const saveTimer = setTimeout(() => {
        localStorage.setItem('ibam-pre-assessment', JSON.stringify({
          answers,
          completedAt: new Date().toISOString(),
          totalQuestions: assessmentQuestions.length
        }));
        setSaveStatus('saved');
      }, 500);
      return () => clearTimeout(saveTimer);
    }
  }, [answers, answeredQuestions]);

  const selectAnswer = (questionIndex: number, rating: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = rating;
    setAnswers(newAnswers);
    
    // Auto-advance after selection
    setTimeout(() => {
      if (questionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      }
    }, 300);
  };

  const completeAssessment = () => {
    // Mark assessment as completed
    localStorage.setItem('ibam-pre-assessment-completed', 'true');
    localStorage.setItem('ibam-pre-assessment-final', JSON.stringify({
      answers,
      completedAt: new Date().toISOString(),
      totalQuestions: assessmentQuestions.length
    }));
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const isComplete = answers.every(answer => answer !== -1);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fafc'}}>
      {/* IBAM Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <div>
                <div className="text-white/90 text-sm md:text-base mb-1">
                  Required Before Course Access
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  Pre-Course Assessment
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: '#10b981'}}></span>
                    {progressPercentage}% complete
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      saveStatus === 'saved' ? 'bg-green-400' :
                      saveStatus === 'saving' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></span>
                    <span className="hidden sm:inline">
                      Question {currentQuestion + 1} of {assessmentQuestions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #4ECDC4 0%, #10b981 100%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        
        {/* Instructions */}
        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">📊</span>
            Baseline Assessment - Measure Your Starting Point
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              This assessment establishes your baseline across 10 key entrepreneurial areas. 
              After completing the course, you'll retake this same assessment to measure your growth and the value you've gained.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Rate yourself honestly (1-10 scale)</div>
                <div className="text-gray-600">Your progress is automatically saved • This unlocks your course content</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 mb-8">
          
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
                {currentQuestion + 1}
              </div>
              <div>
                <div className="font-semibold text-[#2C3E50] text-lg">
                  {assessmentQuestions[currentQuestion].category}
                </div>
                <div className="text-gray-500 text-sm">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-3 leading-relaxed">
            {assessmentQuestions[currentQuestion].question}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {assessmentQuestions[currentQuestion].subtitle}
          </p>

          {/* Rating Scale */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>1 - No Experience/Very Poor</span>
              <span>5 - Average/Moderate</span>
              <span>10 - Expert/Excellent</span>
            </div>
            
            <div className="grid grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  onClick={() => selectAnswer(currentQuestion, rating)}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${
                    answers[currentQuestion] === rating
                      ? 'bg-[#4ECDC4] text-white shadow-lg scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            
            {answers[currentQuestion] !== -1 && (
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold text-[#4ECDC4]">
                  You selected: {answers[currentQuestion]}/10
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg text-gray-600 hover:text-[#4ECDC4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {currentQuestion === assessmentQuestions.length - 1 ? (
              <button
                onClick={completeAssessment}
                disabled={!isComplete}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
              >
                🚀 Complete & Access Course
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(assessmentQuestions.length - 1, currentQuestion + 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg text-white transition-all"
                style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="grid grid-cols-10 gap-2">
            {assessmentQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                  index === currentQuestion
                    ? 'bg-[#4ECDC4] text-white'
                    : answers[index] !== -1
                      ? 'bg-[#10b981] text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* IBAM Footer */}
      <footer style={{background: '#2C3E50'}} className="text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img 
                src="/images/branding/mini-logo.png" 
                alt="IBAM Mini Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-bold">International Business as Mission</span>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">
              © 2025 IBAM International Business as Mission. Equipping entrepreneurs to transform communities through faith-driven business.
            </p>
            <p style={{color: '#4ECDC4'}} className="text-base md:text-lg mt-2 font-semibold">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}