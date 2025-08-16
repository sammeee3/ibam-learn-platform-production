'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample assessment questions
const assessmentQuestions = [
  {
    id: 1,
    category: 'Vision & Purpose',
    question: 'How clearly can you articulate your business vision in terms of kingdom impact?',
    options: [
      'I have no clear vision for kingdom impact',
      'I have some ideas but they\'re not well defined',
      'I have a fairly clear vision with some details',
      'I have a very clear and detailed kingdom vision',
      'I can articulate a compelling vision that inspires others'
    ]
  },
  {
    id: 2,
    category: 'Market Understanding',
    question: 'How well do you understand your target customers and their needs?',
    options: [
      'I have little to no understanding of my target market',
      'I have basic assumptions but limited research',
      'I have some research and customer feedback',
      'I have solid market research and regular customer interaction',
      'I have deep market insights and strong customer relationships'
    ]
  },
  {
    id: 3,
    category: 'Financial Management',
    question: 'How confident are you in managing business finances and cash flow?',
    options: [
      'I have no experience with business finances',
      'I understand basics but feel overwhelmed',
      'I can handle basic financial tasks with some help',
      'I\'m confident in most financial management areas',
      'I excel at financial planning and analysis'
    ]
  },
  {
    id: 4,
    category: 'Leadership & Team',
    question: 'How prepared are you to lead and develop a team with kingdom values?',
    options: [
      'I have no leadership experience',
      'I have limited leadership experience',
      'I have some leadership skills but need development',
      'I\'m a capable leader with room for growth',
      'I\'m an experienced leader who develops others'
    ]
  },
  {
    id: 5,
    category: 'Ministry Integration',
    question: 'How prepared are you to integrate faith and business effectively?',
    options: [
      'I\'m unsure how to connect faith and business',
      'I have some ideas but lack practical experience',
      'I have basic understanding and some experience',
      'I\'m confident in integrating faith and business',
      'I can mentor others in faith-business integration'
    ]
  },
  {
    id: 6,
    category: 'Resilience & Perseverance',
    question: 'How do you typically respond to business setbacks and challenges?',
    options: [
      'I tend to give up when faced with major obstacles',
      'I struggle with setbacks but eventually bounce back',
      'I handle most challenges with moderate resilience',
      'I bounce back from setbacks relatively quickly',
      'I view setbacks as learning opportunities and grow stronger'
    ]
  }
];

export default function Assessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(assessmentQuestions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const answeredQuestions = answers.filter(answer => answer !== -1).length;
  const progressPercentage = Math.round((answeredQuestions / assessmentQuestions.length) * 100);

  // Auto-save
  useEffect(() => {
    if (answeredQuestions > 0) {
      setSaveStatus('saving');
      const saveTimer = setTimeout(() => {
        localStorage.setItem('ibam-assessment', JSON.stringify(answers));
        setSaveStatus('saved');
      }, 500);
      return () => clearTimeout(saveTimer);
    }
  }, [answers, answeredQuestions]);

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateResults = () => {
    const categories = {
      'Vision & Purpose': [],
      'Market Understanding': [],
      'Financial Management': [],
      'Leadership & Team': [],
      'Ministry Integration': [],
      'Resilience & Perseverance': []
    };

    answers.forEach((answer, index) => {
      if (answer !== -1) {
        const category = assessmentQuestions[index].category as keyof typeof categories;
        categories[category].push(answer + 1); // Convert to 1-5 scale
      }
    });

    const categoryAverages = Object.entries(categories).map(([category, scores]) => ({
      category,
      average: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      maxScore: 5
    }));

    const overallAverage = categoryAverages.reduce((sum, cat) => sum + cat.average, 0) / categoryAverages.length;

    return { categoryAverages, overallAverage };
  };

  const getRecommendation = (score: number) => {
    if (score >= 4.5) return { level: 'Advanced', color: '#10b981', description: 'You demonstrate strong capabilities in this area.' };
    if (score >= 3.5) return { level: 'Proficient', color: '#4ECDC4', description: 'You have solid skills with room for refinement.' };
    if (score >= 2.5) return { level: 'Developing', color: '#f59e0b', description: 'You have basic understanding; focus on growth here.' };
    if (score >= 1.5) return { level: 'Beginner', color: '#ef4444', description: 'This area needs significant development and training.' };
    return { level: 'Foundation', color: '#6b7280', description: 'Start with foundational learning in this area.' };
  };

  const results = calculateResults();

  if (showResults) {
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
                    Entrepreneurial Assessment
                  </div>
                  <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                    Your Results
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      Assessment Complete
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
          
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
            <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">🏆</span>
              Overall Entrepreneurial Readiness
            </h2>
            <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-6xl font-bold" style={{color: getRecommendation(results.overallAverage).color}}>
                  {results.overallAverage.toFixed(1)}
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#2C3E50]">
                    {getRecommendation(results.overallAverage).level}
                  </div>
                  <div className="text-lg text-gray-600">
                    {getRecommendation(results.overallAverage).description}
                  </div>
                </div>
              </div>
              
              {/* Overall Progress Bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="h-4 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(results.overallAverage / 5) * 100}%`,
                    backgroundColor: getRecommendation(results.overallAverage).color
                  }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">
                Score: {results.overallAverage.toFixed(1)} out of 5.0
              </div>
            </div>
          </div>

          {/* Category Results */}
          <div className="mb-8">
            <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📊</span>
              Detailed Category Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.categoryAverages.map((category, index) => {
                const recommendation = getRecommendation(category.average);
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6">
                    <h3 className="font-bold text-[#2C3E50] text-lg mb-4">
                      {category.category}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-bold" style={{color: recommendation.color}}>
                        {category.average.toFixed(1)}
                      </div>
                      <div>
                        <div className="font-semibold" style={{color: recommendation.color}}>
                          {recommendation.level}
                        </div>
                        <div className="text-sm text-gray-600">
                          {recommendation.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Progress Bar */}
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${(category.average / 5) * 100}%`,
                          backgroundColor: recommendation.color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 mb-8">
            <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">💡</span>
              Recommended Next Steps
            </h3>
            
            <div className="space-y-6">
              <div className="bg-[#4ECDC4]/10 rounded-xl p-6 border border-[#4ECDC4]/20">
                <h4 className="font-semibold text-[#2C3E50] text-lg mb-3">
                  🎯 Focus Areas for Growth
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {results.categoryAverages
                    .filter(cat => cat.average < 3.5)
                    .slice(0, 3)
                    .map((cat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#f59e0b] mt-1">•</span>
                        <span><strong>{cat.category}:</strong> Consider additional training and practice in this area</span>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-[#10b981]/10 rounded-xl p-6 border border-[#10b981]/20">
                <h4 className="font-semibold text-[#2C3E50] text-lg mb-3">
                  ✅ Your Strengths
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {results.categoryAverages
                    .filter(cat => cat.average >= 3.5)
                    .slice(0, 3)
                    .map((cat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#10b981] mt-1">•</span>
                        <span><strong>{cat.category}:</strong> You demonstrate solid capabilities here</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => router.push('/modules')}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📚</div>
              <div className="font-bold text-[#2C3E50] mb-2">Continue Learning</div>
              <div className="text-gray-600">Focus on modules that address your growth areas</div>
            </button>
            
            <button 
              onClick={() => router.push('/business-planner')}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📊</div>
              <div className="font-bold text-[#2C3E50] mb-2">Business Planner</div>
              <div className="text-gray-600">Apply your insights to your business plan</div>
            </button>
            
            <button 
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers(new Array(assessmentQuestions.length).fill(-1));
              }}
              className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">🔄</div>
              <div className="font-bold text-[#2C3E50] mb-2">Retake Assessment</div>
              <div className="text-gray-600">Re-evaluate your progress after learning</div>
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
                  Entrepreneurial Readiness
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  Assessment Tool
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
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
            >
              🏠 <span className="hidden sm:inline">Dashboard</span>
            </button>
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
            <span className="text-4xl md:text-5xl">📋</span>
            Entrepreneurial Readiness Assessment
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              This assessment will help you understand your current entrepreneurial readiness across key areas. 
              Answer honestly to get the most accurate results and personalized recommendations.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">⏱️</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Estimated time: 5-10 minutes</div>
                <div className="text-gray-600">{assessmentQuestions.length} questions • Your progress is automatically saved</div>
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
          <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-8 leading-relaxed">
            {assessmentQuestions[currentQuestion].question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {assessmentQuestions[currentQuestion].options.map((option, index) => (
              <label 
                key={index}
                className={`flex items-start gap-4 p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-[#4ECDC4] bg-[#4ECDC4]/10'
                    : 'border-gray-200 hover:border-[#4ECDC4]/50 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => selectAnswer(currentQuestion, index)}
                  className="w-6 h-6 text-[#4ECDC4] mt-1"
                />
                <div>
                  <div className="font-semibold text-[#2C3E50] mb-1">
                    Level {index + 1}
                  </div>
                  <div className="text-gray-700 text-lg leading-relaxed">
                    {option}
                  </div>
                </div>
              </label>
            ))}
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
                onClick={() => setShowResults(true)}
                disabled={answers.includes(-1)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
              >
                📊 View Results
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(assessmentQuestions.length - 1, currentQuestion + 1))}
                disabled={answers[currentQuestion] === -1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="grid grid-cols-6 gap-2">
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