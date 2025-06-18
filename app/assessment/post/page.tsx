'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// IDENTICAL questions to pre-assessment - for accurate comparison
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

export default function PostAssessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(assessmentQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [preAssessmentData, setPreAssessmentData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const answeredQuestions = answers.filter(answer => answer !== -1).length;
  const progressPercentage = Math.round((answeredQuestions / assessmentQuestions.length) * 100);

  // Load pre-assessment data on mount
  useEffect(() => {
    const preData = localStorage.getItem('ibam-pre-assessment-final');
    if (preData) {
      setPreAssessmentData(JSON.parse(preData));
    } else {
      // No pre-assessment found - redirect to take it first
      router.push('/assessment/pre');
    }
  }, [router]);

  // Auto-save to localStorage
  useEffect(() => {
    if (answeredQuestions > 0) {
      setSaveStatus('saving');
      const saveTimer = setTimeout(() => {
        localStorage.setItem('ibam-post-assessment', JSON.stringify({
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

  const calculateComparison = () => {
    if (!preAssessmentData) return null;

    const preAnswers = preAssessmentData.answers;
    const improvements = answers.map((postScore, index) => ({
      category: assessmentQuestions[index].category,
      preScore: preAnswers[index],
      postScore: postScore,
      improvement: postScore - preAnswers[index],
      improvementPercent: ((postScore - preAnswers[index]) / preAnswers[index]) * 100
    }));

    const totalPreScore = preAnswers.reduce((sum: number, score: number) => sum + score, 0);
    const totalPostScore = answers.reduce((sum, score) => sum + score, 0);
    const overallImprovement = totalPostScore - totalPreScore;
    const overallImprovementPercent = (overallImprovement / totalPreScore) * 100;

    const biggestGains = improvements
      .filter(item => item.improvement > 0)
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 3);

    return {
      improvements,
      totalPreScore,
      totalPostScore,
      overallImprovement,
      overallImprovementPercent,
      biggestGains,
      averagePreScore: totalPreScore / assessmentQuestions.length,
      averagePostScore: totalPostScore / assessmentQuestions.length
    };
  };

  const completeAssessment = () => {
    // Save final assessment
    localStorage.setItem('ibam-post-assessment-completed', 'true');
    localStorage.setItem('ibam-post-assessment-final', JSON.stringify({
      answers,
      completedAt: new Date().toISOString(),
      totalQuestions: assessmentQuestions.length
    }));
    
    // Save comparison data
    const comparison = calculateComparison();
    if (comparison) {
      localStorage.setItem('ibam-assessment-comparison', JSON.stringify(comparison));
    }
    
    setShowResults(true);
  };

  const isComplete = answers.every(answer => answer !== -1);
  const comparison = calculateComparison();

  if (showResults && comparison) {
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
                    Course Value Demonstration
                  </div>
                  <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                    Your Growth Results
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      Module 1 Complete
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                      {comparison.overallImprovement > 0 ? '+' : ''}{comparison.overallImprovement.toFixed(1)} points gained
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
              >
                🏠 <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          
          {/* Overall Results */}
          <div className="bg-gradient-to-r from-[#10b981]/10 to-[#4ECDC4]/10 rounded-2xl border-2 border-[#10b981]/20 p-6 md:p-8 mb-8">
            <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">🎯</span>
              Course Value Delivered
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before Score */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-gray-600 mb-2">Before Course</div>
                  <div className="text-4xl font-bold text-[#ef4444]">
                    {comparison.averagePreScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </div>

              {/* After Score */}
              <div className="bg-white rounded-xl p-6 border border-[#10b981]/20">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="text-gray-600 mb-2">After Course</div>
                  <div className="text-4xl font-bold text-[#10b981]">
                    {comparison.averagePostScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </div>

              {/* Improvement */}
              <div className="bg-white rounded-xl p-6 border border-[#4ECDC4]/20">
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-gray-600 mb-2">Improvement</div>
                  <div className="text-4xl font-bold text-[#4ECDC4]">
                    +{(comparison.averagePostScore - comparison.averagePreScore).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {comparison.overallImprovementPercent > 0 ? '+' : ''}{comparison.overallImprovementPercent.toFixed(0)}% Growth
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biggest Gains */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 mb-8">
            <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">🏆</span>
              Your Biggest Improvements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparison.biggestGains.map((gain, index) => (
                <div key={index} className="bg-gradient-to-r from-[#10b981]/10 to-[#4ECDC4]/10 rounded-xl p-6 border border-[#10b981]/20">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="font-semibold text-[#2C3E50] mb-2">
                      {gain.category}
                    </div>
                    <div className="text-3xl font-bold text-[#10b981] mb-1">
                      +{gain.improvement.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {gain.preScore.toFixed(1)} → {gain.postScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 mb-8">
            <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📊</span>
              Complete Before vs After Comparison
            </h3>
            
            <div className="space-y-6">
              {comparison.improvements.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-[#2C3E50] text-lg">
                      {item.category}
                    </h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.improvement > 0 ? 'bg-green-100 text-green-700' :
                      item.improvement === 0 ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.improvement > 0 ? '+' : ''}{item.improvement.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Before Course</div>
                      <div className="text-2xl font-bold text-[#ef4444]">{item.preScore}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">After Course</div>
                      <div className="text-2xl font-bold text-[#10b981]">{item.postScore}/10</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full bg-[#ef4444] opacity-50"
                        style={{width: `${(item.preScore / 10) * 100}%`}}
                      ></div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 mt-2">
                      <div 
                        className="h-4 rounded-full bg-[#10b981]"
                        style={{width: `${(item.postScore / 10) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => router.push('/modules/2')}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📚</div>
              <div className="font-bold text-[#2C3E50] mb-2">Continue to Module 2</div>
              <div className="text-gray-600">Build on your foundation with advanced concepts</div>
            </button>
            
            <button 
              onClick={() => router.push('/business-planner')}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📊</div>
              <div className="font-bold text-[#2C3E50] mb-2">Business Planner</div>
              <div className="text-gray-600">Apply your improved skills to your business plan</div>
            </button>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">🏠</div>
              <div className="font-bold text-[#2C3E50] mb-2">Dashboard</div>
              <div className="text-gray-600">Return to your learning dashboard</div>
            </button>
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
                  Measure Your Growth
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  Post-Course Assessment
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
            <span className="text-4xl md:text-5xl">📈</span>
            Measure Your Growth - Same Questions, New Skills
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              You're retaking the exact same assessment from before the course. 
              Rate yourself honestly based on your current abilities - we'll show you the amazing progress you've made!
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Same 1-10 scale as before</div>
                <div className="text-gray-600">We'll calculate your improvement automatically</div>
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
            
            {/* Show pre-score for comparison */}
            {preAssessmentData && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Your previous score:</div>
                <div className="text-2xl font-bold text-[#ef4444]">
                  {preAssessmentData.answers[currentQuestion]}/10
                </div>
              </div>
            )}
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
            
            {answers[currentQuestion] !== -1 && preAssessmentData && (
              <div className="mt-4 text-center">
                <span className="text-lg font-semibold text-[#4ECDC4]">
                  Current: {answers[currentQuestion]}/10
                </span>
                <span className="mx-4 text-gray-400">vs</span>
                <span className="text-lg font-semibold text-[#ef4444]">
                  Before: {preAssessmentData.answers[currentQuestion]}/10
                </span>
                {answers[currentQuestion] !== preAssessmentData.answers[currentQuestion] && (
                  <div className={`mt-2 font-bold ${
                    answers[currentQuestion] > preAssessmentData.answers[currentQuestion] 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {answers[currentQuestion] > preAssessmentData.answers[currentQuestion] ? '↗️' : '↘️'} 
                    {answers[currentQuestion] > preAssessmentData.answers[currentQuestion] ? '+' : ''}
                    {answers[currentQuestion] - preAssessmentData.answers[currentQuestion]} point change
                  </div>
                )}
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
                📊 See Your Growth Results
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