'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Sample business plan sections
const businessPlanSections = [
  {
    id: 'vision',
    title: 'Vision & Mission',
    description: 'Define your God-given purpose and direction',
    icon: '🎯',
    questions: [
      'How does your business reflect God\'s character and values?',
      'What impact do you want your business to have on your community?',
      'How can your business serve as a platform for spiritual conversations?'
    ],
    completed: false,
    responses: ['', '', '']
  },
  {
    id: 'market',
    title: 'Market Analysis',
    description: 'Understanding your customers and competition',
    icon: '📊',
    questions: [
      'Who is your target customer and what are their needs?',
      'How will you reach and serve your customers with excellence?',
      'What makes your approach unique in the marketplace?'
    ],
    completed: false,
    responses: ['', '', '']
  },
  {
    id: 'operations',
    title: 'Operations & Management',
    description: 'How your business will function day-to-day',
    icon: '⚙️',
    questions: [
      'What key processes will ensure quality and efficiency?',
      'How will you build a team that shares your values?',
      'What systems will support growth and sustainability?'
    ],
    completed: false,
    responses: ['', '', '']
  },
  {
    id: 'finances',
    title: 'Financial Projections',
    description: 'Stewarding resources and planning for growth',
    icon: '💰',
    questions: [
      'What are your startup costs and funding sources?',
      'How will you price your products/services competitively?',
      'What financial milestones will indicate success?'
    ],
    completed: false,
    responses: ['', '', '']
  },
  {
    id: 'ministry',
    title: 'Ministry Integration',
    description: 'How business and ministry work together',
    icon: '✝️',
    questions: [
      'How will you maintain Christian witness in daily operations?',
      'What opportunities for discipleship exist in your business?',
      'How will you partner with local church and ministry leaders?'
    ],
    completed: false,
    responses: ['', '', '']
  }
];

export default function BusinessPlanner() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState('vision');
  const [sections, setSections] = useState(businessPlanSections);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const currentSectionData = sections.find(s => s.id === currentSection) || sections[0];
  const completedSections = sections.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedSections / sections.length) * 100);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setSaveStatus('saving');
      // TODO: Save to Supabase
      localStorage.setItem('ibam-business-plan', JSON.stringify(sections));
      setSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [sections]);

  const updateResponse = (questionIndex: number, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === currentSection 
        ? {
            ...section,
            responses: section.responses.map((response, index) => 
              index === questionIndex ? value : response
            ),
            completed: section.responses.every((r, i) => 
              i === questionIndex ? value.trim() !== '' : r.trim() !== ''
            )
          }
        : section
    ));
  };

  const exportBusinessPlan = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      completedSections: completedSections,
      totalSections: sections.length,
      sections: sections
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IBAM-Business-Plan.json';
    link.click();
    URL.revokeObjectURL(url);
  };

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
                  Business Planning Tool
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  Your Faith-Driven Business Plan
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
                      {saveStatus === 'saved' ? 'All changes saved' :
                       saveStatus === 'saving' ? 'Saving...' : 'Save error'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
              >
                🏠 <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <button 
                onClick={exportBusinessPlan}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm md:text-base font-medium text-white transition-all"
              >
                📥 Export Plan
              </button>
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

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        {/* Introduction */}
        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">💼</span>
            Build Your Faith-Driven Business Plan
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-4">
              Create a comprehensive business plan that integrates biblical principles with sound business practices. 
              Your responses from the learning sessions are automatically included here.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Progress: {completedSections} of {sections.length} sections</div>
                <div className="text-gray-600">Complete all sections for a comprehensive plan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 sticky top-4">
              <h3 className="font-bold text-[#2C3E50] text-lg mb-6">Plan Sections</h3>
              
              <div className="space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      currentSection === section.id
                        ? 'bg-[#4ECDC4]/10 border-2 border-[#4ECDC4]'
                        : 'hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{section.icon}</span>
                      <span className="font-semibold text-[#2C3E50]">{section.title}</span>
                      {section.completed && (
                        <span className="text-[#10b981] text-xl">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Section Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
              
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl md:text-6xl">{currentSectionData.icon}</span>
                  <div>
                    <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl">
                      {currentSectionData.title}
                    </h2>
                    <p className="text-gray-600 text-lg">{currentSectionData.description}</p>
                  </div>
                </div>
                
                {currentSectionData.completed && (
                  <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-[#10b981] font-semibold">
                      <span className="text-xl">✓</span>
                      Section Complete
                    </div>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {currentSectionData.questions.map((question, index) => (
                  <div key={index}>
                    <label className="block font-bold text-[#2C3E50] text-lg md:text-xl mb-4">
                      {index + 1}. {question}
                    </label>
                    <textarea
                      value={currentSectionData.responses[index]}
                      onChange={(e) => updateResponse(index, e.target.value)}
                      className="w-full h-32 md:h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent text-lg"
                      placeholder="Provide a detailed response that will become part of your business plan..."
                    />
                  </div>
                ))}
              </div>

              {/* Section Navigation */}
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <button
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === currentSection);
                    if (currentIndex > 0) {
                      setCurrentSection(sections[currentIndex - 1].id);
                    }
                  }}
                  disabled={sections.findIndex(s => s.id === currentSection) === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg text-gray-600 hover:text-[#4ECDC4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Section
                </button>
                
                <button
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === currentSection);
                    if (currentIndex < sections.length - 1) {
                      setCurrentSection(sections[currentIndex + 1].id);
                    }
                  }}
                  disabled={sections.findIndex(s => s.id === currentSection) === sections.length - 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}
                >
                  Next Section →
                </button>
              </div>
            </div>

            {/* Plan Summary */}
            {completedSections === sections.length && (
              <div className="mt-8 bg-[#10b981] text-white rounded-2xl p-6 md:p-8 text-center">
                <div className="text-5xl md:text-6xl mb-4">🏆</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Business Plan Complete!</h3>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Congratulations! You've completed your Faith-Driven business plan.
                </p>
                <button 
                  onClick={exportBusinessPlan}
                  className="bg-white text-[#10b981] px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  📄 Download Your Plan
                </button>
              </div>
            )}
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