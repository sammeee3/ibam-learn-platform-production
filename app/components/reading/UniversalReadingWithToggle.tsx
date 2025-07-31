// app/components/reading/UniversalReadingWithToggle.tsx
'use client';

import { useState, useRef } from 'react';
import { BookOpen, Zap, FileText } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface UniversalReadingWithToggleProps {
  sessionData: SessionData;
  title: string;
}

// Utility function for reading time calculation
const calculateReadingTime = (content: string): string => {
  if (!content) return '3 min';
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(wordCount / 200)); // 200 words per minute
  return `${minutes} min`;
};

// Content formatting function
const formatContentWithBeautifulTypography = (content: string) => {
  if (!content) return "Content is being prepared for this section.";

  return content
    // Convert Markdown to HTML first - IMPROVED PATTERNS
    .replace(/###\s*(.+?)(\n|$)/g, "<h3>$1</h3>")
    .replace(/##\s*(.+?)(\n|$)/g, "<h2>$1</h2>") 
    .replace(/#\s*(.+?)(\n|$)/g, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>")
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/^(?!<[h|p|u|o|l|s])/gm, "<p>")
    .replace(/(?<![>])\n(?!<)/g, " ")
    // Format headings with gorgeous blue styling - FULL RESTORATION
    .replace(/<h1[^>]*>/g, '<h1 class="text-4xl font-bold text-blue-800 mb-6 mt-8 leading-tight">')
    .replace(/<h2[^>]*>/g, '<h2 class="text-3xl font-bold text-blue-800 mb-4 mt-6 leading-tight">')
    .replace(/<h3[^>]*>/g, '<h3 class="text-2xl font-semibold text-blue-700 mb-3 mt-5 leading-tight">')
    .replace(/<h4[^>]*>/g, '<h4 class="text-xl font-semibold text-blue-600 mb-2 mt-4">')
    .replace(/<h5[^>]*>/g, '<h5 class="text-lg font-semibold text-blue-600 mb-2 mt-3">')
    .replace(/<h6[^>]*>/g, '<h6 class="text-base font-semibold text-blue-600 mb-2 mt-3">')
    // Format paragraphs with excellent reading font - RESTORED
    .replace(/<p[^>]*>/g, '<p class="text-gray-800 leading-relaxed mb-6 text-lg">')
    // Format lists beautifully - RESTORED  
    .replace(/<ul[^>]*>/g, '<ul class="space-y-3 mb-6 ml-6">')
    .replace(/<ol[^>]*>/g, '<ol class="space-y-3 mb-6 ml-6 list-decimal">')
    .replace(/<li[^>]*>/g, '<li class="text-gray-800 leading-relaxed text-lg mb-2">')
    // Format emphasis beautifully - RESTORED
    .replace(/<strong[^>]*>/g, '<strong class="font-bold text-gray-900">')
    .replace(/<em[^>]*>/g, '<em class="italic text-gray-700">');
};

const UniversalReadingWithToggle: React.FC<UniversalReadingWithToggleProps> = ({ 
  sessionData, 
  title 
}) => {
  const [showQuickVersion, setShowQuickVersion] = useState(true);
  const readingRef = useRef<HTMLDivElement>(null);

  // Smart content detection - works for ALL module structures
  const chunks = sessionData.content?.written_curriculum?.quick_version?.chunks || [];
  const mainContent = sessionData.content?.written_curriculum?.main_content;
  const hasChunks = chunks.length > 0;
  
  // CRITICAL: Handle ALL possible content structures
  const hasAnyContent = chunks.length > 0 || (mainContent && mainContent.length > 500);
  const shouldShowToggle = hasAnyContent;
  const hasMainContent = mainContent && mainContent.length > 100;
  
  // If no proper content structure, create fallback
  const effectiveContent = hasMainContent ? mainContent : 
    hasChunks ? chunks.map(c => c.content).join('\n\n') : 
    'Content is being prepared for this session.';

  const handleToggle = (showFull: boolean) => {
    setShowQuickVersion(!showFull);
    setTimeout(() => {
      if (readingRef.current) {
        readingRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };

  // Extract quick summary from content
  const getQuickSummary = () => {
    if (hasChunks) {
      return chunks.slice(0, 3).map((chunk, index) => (
        <div key={index} className="mb-4">
          <h6 className="font-semibold text-gray-800 mb-2">{chunk.title || `Section ${index + 1}`}</h6>
          <p className="text-gray-700">{chunk.key_thought || chunk.content?.substring(0, 200) + '...'}</p>
        </div>
      ));
    } else if (hasMainContent) {
      // Extract first few paragraphs as quick version
      const paragraphs = effectiveContent.split('\n\n').filter(p => p.trim().length > 50);
      return paragraphs.slice(0, 3).map((para, index) => (
        <div key={index} className="mb-4">
          <p className="text-gray-700">{para.substring(0, 300)}...</p>
        </div>
      ));
    }
    return <p className="text-gray-700">Core concepts and principles for faith-driven business.</p>;
  };

  return (
    <div className="space-y-6" ref={readingRef}>
      {/* Universal Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <BookOpen className="w-8 h-8 mr-3" />
              📖 {title}
            </h3>
            <p className="text-blue-100 text-lg">
              Master biblical business principles through comprehensive learning
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <div className="text-2xl font-bold">✓</div>
              <div className="text-sm text-blue-100">Ready to Learn</div>
            </div>
          </div>
        </div>
      </div>

      {/* UNIVERSAL TOGGLE BUTTONS - Same as Module 1 */}
      {(hasChunks || hasMainContent) && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleToggle(false)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              showQuickVersion
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className="w-5 h-5 mr-2" />
            📖 Quick Overview (5 min)
          </button>
          <button
            onClick={() => handleToggle(true)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              !showQuickVersion
                ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            📚 Full Content (15 min)
          </button>
        </div>
      )}

      {/* UNIVERSAL CONTENT DISPLAY */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">
              {showQuickVersion ? '⚡ Quick Overview' : '📚 Complete Content'}
            </h4>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {showQuickVersion ? '5 Minutes' : '15 Minutes'}
            </span>
          </div>
        </div>
        
        <div className="p-8">
          {showQuickVersion ? (
            // QUICK VERSION - Works for all modules
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h5 className="text-xl font-semibold text-blue-800 mb-3">⚡ Key Concepts</h5>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  Essential principles for today's learning - perfect for busy schedules.
                </p>
              </div>
              
              <div className="space-y-4">
                {getQuickSummary()}
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => handleToggle(true)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  📚 Read Full Content
                </button>
              </div>
            </div>
          ) : (
            // FULL CONTENT - Works for all modules
            <div className="space-y-6">
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg">
                <h5 className="text-xl font-semibold text-indigo-800 mb-3">📚 Complete Learning Content</h5>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Comprehensive curriculum with detailed explanations and practical applications.
                </p>
              </div>
              
              <div className="prose prose-xl max-w-none formatted-content" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                <div 
                  className="text-gray-700 leading-relaxed formatted-content"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContentWithBeautifulTypography(effectiveContent) 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalReadingWithToggle;