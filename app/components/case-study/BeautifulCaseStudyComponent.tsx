'use client';

import { useState, useEffect, useCallback } from 'react';
import { Target, MessageCircle } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface BeautifulCaseStudyProps {
  sessionData: SessionData;
  sessionTitle: string;
  onComplete?: () => void; // 🔧 NEW: Callback when case study is completed
}

const BeautifulCaseStudyComponent: React.FC<BeautifulCaseStudyProps> = ({ 
  sessionData, 
  sessionTitle,
  onComplete
}) => {
  const [caseAnswers, setCaseAnswers] = useState<Record<string, string>>({
    discovery: '',
    application: '',
    transformation: ''
  });
  const [answersSaved, setAnswersSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 🔧 NEW: Storage key for session-specific saves
  const storageKey = `case_study_answers_${sessionData.module_id}_${sessionData.session_number}`;
  
  // 🔧 NEW: Load saved answers on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsedAnswers = JSON.parse(saved);
          console.log('📚 Restored case study answers from localStorage:', parsedAnswers);
          setCaseAnswers(parsedAnswers);
          
          // Check if case study was completed
          const allAnswered = Object.values(parsedAnswers).every(answer => String(answer).trim().length > 0);
          setIsCompleted(allAnswered);
        } catch (error) {
          console.error('Error loading saved case study answers:', error);
        }
      }
    }
  }, [storageKey]);
  
  // 🔧 NEW: Autosave answers with debouncing
  const autosaveAnswers = useCallback(
    (newAnswers: Record<string, string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(newAnswers));
        console.log('💾 Auto-saved case study answers:', newAnswers);
      }
    },
    [storageKey]
  );


  const caseStudyContent = sessionData.content?.case_study ? 
    `<h3>${sessionData.content.case_study.title}</h3>
     <h4>The Challenge</h4>
     <p>${sessionData.content.case_study.challenge}</p>
     <h4>The Strategy</h4>
     <p>${sessionData.content.case_study.strategy}</p>
     <h4>The Results</h4>
     <p>${sessionData.content.case_study.results}</p>` :
    `<h3>Business Transformation Case Study</h3>
     <p>This case study demonstrates how biblical business principles create both financial success and Faith-Driven Impact.</p>`;

  // Format case study content properly
  const formatCaseStudyContent = (content: string) => {
    if (!content) return "Case study content is being prepared.";
    
    return content
      // Remove markdown symbols and convert to HTML
      .replace(/#{3}\s*(.+?)(\n|$)/g, "<h3>$1</h3>")
      .replace(/#{2}\s*(.+?)(\n|$)/g, "<h2>$1</h2>")
      .replace(/#{1}\s*(.+?)(\n|$)/g, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>")
      .replace(/\n\s*\n/g, "</p><p>")
      .replace(/^(?!<[h|p|u|o|l|s])/gm, "<p>")
      .replace(/(?<!>)\n(?!<)/g, " ")
      // Apply beautiful purple theme styling
      .replace(/<h1[^>]*>/g, '<h1 class="text-4xl font-bold text-purple-800 mb-6 mt-8 leading-tight">')
      .replace(/<h2[^>]*>/g, '<h2 class="text-3xl font-bold text-purple-700 mb-4 mt-6 leading-tight">')
      .replace(/<h3[^>]*>/g, '<h3 class="text-2xl font-semibold text-purple-600 mb-3 mt-5 leading-tight">')
      .replace(/<p[^>]*>/g, '<p class="text-gray-800 leading-relaxed mb-6 text-lg">')
      .replace(/<ul[^>]*>/g, '<ul class="space-y-3 mb-6 ml-6 list-disc">')
      .replace(/<ol[^>]*>/g, '<ol class="space-y-3 mb-6 ml-6 list-decimal">')
      .replace(/<li[^>]*>/g, '<li class="text-gray-800 leading-relaxed text-lg mb-2">')
      .replace(/<strong[^>]*>/g, '<strong class="font-bold text-purple-900">')
      .replace(/<em[^>]*>/g, '<em class="italic text-purple-700">');
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...caseAnswers, [questionId]: value };
    setCaseAnswers(newAnswers);
    setAnswersSaved(false);
    
    // 🔧 AUTO-SAVE: Save immediately on every keystroke
    autosaveAnswers(newAnswers);
    
    // 🔧 CHECK COMPLETION: Auto-complete when all answers are filled
    const allAnswered = Object.values(newAnswers).every(answer => answer.trim().length > 0);
    if (allAnswered && !isCompleted) {
      setIsCompleted(true);
      console.log('📚 Case study auto-completed - calling parent onComplete callback');
      onComplete?.();
    }
  };

  const saveAnswers = () => {
    // In production, this would save to database
    console.log('Case study insights saved:', caseAnswers);
    setAnswersSaved(true);
    setTimeout(() => setAnswersSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Beautiful Case Study Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3" />
              📊 Real Business Transformation Story
            </h3>
            <p className="text-purple-100 text-lg">
              Learn from real entrepreneurs who integrated faith and business successfully
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <div className="text-2xl font-bold">💡</div>
              <div className="text-sm text-purple-100">Wisdom Applied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Content */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-4">
          <h4 className="text-xl font-bold">📖 Transformation Story</h4>
        </div>
        
        <div className="p-8">
          {/* Beautiful formatted content */}
          <div className="prose prose-xl max-w-none">
            <div 
              className="formatted-case-content"
              dangerouslySetInnerHTML={{ 
                __html: formatCaseStudyContent(caseStudyContent) 
              }} 
            />
          </div>

          {/* Discovery Questions Section */}
          <div className="mt-12 border-t-4 border-purple-200 pt-8">
            <h3 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
              <MessageCircle className="w-8 h-8 mr-3" />
              🤔 Your Discovery Questions
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              These questions help you extract maximum value from this case study and apply it to your unique situation.
            </p>

            <div className="space-y-8">
              {/* Question 1: What? */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-bold text-purple-800 mb-3 text-lg">
                  1. WHAT stood out? (Discovery)
                </h4>
                <p className="text-gray-600 mb-3">
                  What specific strategies, principles, or decisions in this case study caught your attention? 
                  What surprised you about their approach?
                </p>
                <textarea
                  value={caseAnswers.discovery}
                  onChange={(e) => handleAnswerChange('discovery', e.target.value)}
                  placeholder="Write your observations here..."
                  className="w-full p-4 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-base"
                  rows={4}
                />
              </div>

              {/* Question 2: So What? */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h4 className="font-bold text-indigo-800 mb-3 text-lg">
                  2. SO WHAT does this mean? (Application)
                </h4>
                <p className="text-gray-600 mb-3">
                  How do these principles relate to your current business challenges? 
                  What parallels do you see between their situation and yours?
                </p>
                <textarea
                  value={caseAnswers.application}
                  onChange={(e) => handleAnswerChange('application', e.target.value)}
                  placeholder="Connect this to your business..."
                  className="w-full p-4 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base"
                  rows={4}
                />
              </div>

              {/* Question 3: Now What? */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-bold text-green-800 mb-3 text-lg">
                  3. NOW WHAT will you do? (Transformation)
                </h4>
                <p className="text-gray-600 mb-3">
                  Based on this case study, what ONE specific action will you take this week? 
                  How will you implement these principles in your business?
                </p>
                <textarea
                  value={caseAnswers.transformation}
                  onChange={(e) => handleAnswerChange('transformation', e.target.value)}
                  placeholder="Your action step inspired by this case..."
                  className="w-full p-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none text-base"
                  rows={4}
                />
              </div>
            </div>

            {/* Save/Complete Button */}
            <div className="mt-8 text-center">
              {isCompleted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">Case Study Complete!</h4>
                  <p className="text-green-700 mb-4">Your insights have been automatically saved and your progress updated.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-lg mb-1">✅</div>
                      <div className="font-semibold text-green-800 text-sm">Discovery</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-lg mb-1">✅</div>
                      <div className="font-semibold text-green-800 text-sm">Application</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-lg mb-1">✅</div>
                      <div className="font-semibold text-green-800 text-sm">Transformation</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={saveAnswers}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    💾 Save My Insights
                  </button>
                  {answersSaved && (
                    <p className="mt-3 text-green-600 font-semibold animate-pulse">
                      ✅ Your insights have been saved!
                    </p>
                  )}
                  <p className="mt-3 text-gray-600 text-sm">
                    💡 Your answers are automatically saved as you type
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautifulCaseStudyComponent;