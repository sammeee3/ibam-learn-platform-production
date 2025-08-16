'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  Lightbulb, 
  Clock, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  X 
} from 'lucide-react';
import type { ReadingChunk } from '../../lib/types';

interface EnhancedReadingChunksProps {
  chunks: ReadingChunk[];
  title: string;
}

// Utility functions for beautiful formatting
const calculateReadingTime = (content: string): string => {
  if (!content) return '3 min';
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(wordCount / 200)); // 200 words per minute
  return `${minutes} min`;
};

const extractKeyPoints = (content: string): string[] => {
  if (!content) return [];
  
  // Extract sentences that might be key points
  const sentences = content.replace(/<[^>]*>/g, '').split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Look for sentences with strong indicators of importance
  const keyIndicators = ['important', 'key', 'critical', 'remember', 'note that', 'essential', 'must', 'should', 'biblical', 'God', 'scripture'];
  
  const potentialKeyPoints = sentences.filter(sentence => 
    keyIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
  ).slice(0, 3);

  // If no key indicators found, take first few sentences that are substantial
  if (potentialKeyPoints.length === 0) {
    return sentences.slice(0, 3).map(s => s.trim());
  }
  
  return potentialKeyPoints.map(s => s.trim());
};

const generateChunkTitle = (content: string, index: number): string => {
  if (!content) return `Reading Section ${index + 1}`;
  
  // Extract first heading if exists
  const headingMatch = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  if (headingMatch) {
    return headingMatch[1].replace(/<[^>]*>/g, '').trim();
  }
  
  // Extract first sentence and make it title-like
  const firstSentence = content.replace(/<[^>]*>/g, '').split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length > 10 && firstSentence.length < 80) {
    return firstSentence.trim();
  }
  
  // Inspiring default titles
  const inspiringTitles = [
    'Your Divine Business Calling',
    'Faith-Driven Success Principles',
    'Biblical Marketplace Ministry',
    'Transforming Through Excellence',
    'Building Faith-Driven Impact'
  ];
  
  return inspiringTitles[index % inspiringTitles.length];
};

// GLOBAL BEAUTIFUL TYPOGRAPHY FORMATTER
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

const EnhancedReadingChunks: React.FC<EnhancedReadingChunksProps> = ({ chunks, title }) => {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedChunks, setCompletedChunks] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());
  const [showDetailTip, setShowDetailTip] = useState(true);

  const toggleChunkDetail = (chunkIndex: number) => {
    setExpandedChunks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chunkIndex)) {
        newSet.delete(chunkIndex);
      } else {
        newSet.add(chunkIndex);
      }
      return newSet;
    });
  };

  // FIXED: Manual progression only - no auto-advance
  const nextChunk = () => {
    setCompletedChunks(prev => new Set([...prev, currentChunk]));
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(currentChunk + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevChunk = () => {
    if (currentChunk > 0) {
      setCurrentChunk(currentChunk - 1);
    }
  };

  const goToChunk = (index: number) => {
    setCurrentChunk(index);
    setIsCompleted(false);
  };

  const updateAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  if (!chunks || chunks.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Reading Content Available</h3>
        <p className="text-yellow-700">Reading content will be available when the curriculum is updated.</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-3">Reading Complete!</h1>
          <p className="text-green-100 text-lg">You've completed all {chunks.length} reading sections. Excellent work!</p>
        </div>
        <div className="p-8 text-center">
          <button 
            onClick={() => { 
              setCurrentChunk(0); 
              setIsCompleted(false); 
              setCompletedChunks(new Set());
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            📖 Review Reading Again
          </button>
        </div>
      </div>
    );
  }

  const chunk = chunks[currentChunk];
  
  // Generate enhanced chunk data
  const enhancedChunk = {
    ...chunk,
    title: chunk.title || generateChunkTitle(chunk.content, currentChunk),
    time: chunk.time || calculateReadingTime(chunk.content),
    key_thought: chunk.key_thought || extractKeyPoints(chunk.content)[0] || "This section contains important principles for faith-driven entrepreneurship.",
    auto_key_points: extractKeyPoints(chunk.content)
  };

  const isExpanded = expandedChunks.has(currentChunk);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Helpful Tip Popup */}
      {showDetailTip && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lightbulb className="w-6 h-6 mr-3" />
              <p className="font-medium">💡 Tip: Each section has key content - take your time and advance when ready!</p>
            </div>
            <button 
              onClick={() => setShowDetailTip(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Simple Navigation Overview with Progress */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
          📖 {title}
        </h2>
        
        {/* Simple Chunk Progress Dots */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          {chunks.map((chunkItem, index) => (
            <button
              key={index}
              onClick={() => goToChunk(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                index === currentChunk
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : completedChunks.has(index)
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {completedChunks.has(index) ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span>Section {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="text-center text-gray-600">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((completedChunks.size) / chunks.length) * 100}%` }}
            />
          </div>
          <p className="text-sm">
            Section {currentChunk + 1} of {chunks.length} • 
            {Math.round(((completedChunks.size) / chunks.length) * 100)}% Complete
          </p>
        </div>
      </div>

      {/* FIXED: Show ONLY Current Reading Chunk */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Beautiful Chunk Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{enhancedChunk.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {enhancedChunk.time}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {currentChunk + 1} of {chunks.length}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentChunk + 1) / chunks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Beautiful Content Area - ONLY CURRENT CHUNK */}
        <div className="p-8">
          {/* Key Thought Highlight */}
          {enhancedChunk.key_thought && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-400 rounded-r-lg p-6 mb-8">
              <h4 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3" />
                💡 Key Thought
              </h4>
              <p className="text-yellow-700 font-medium text-xl leading-relaxed">
                {enhancedChunk.key_thought}
              </p>
            </div>
          )}

          {/* THIS CHUNK'S Content Only */}
          {enhancedChunk.content && (
            <div className="space-y-6 mb-8">
              <div 
                className="prose prose-xl max-w-none formatted-content"
                style={{ fontSize: '1.125rem', lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{ 
                  __html: formatContentWithBeautifulTypography(
                    isExpanded ? enhancedChunk.content : 
                    enhancedChunk.content.substring(0, 800) + (enhancedChunk.content.length > 800 ? '...' : '')
                  )
                }} 
              />
              
              {/* More Detail Toggle Button */}
              {enhancedChunk.content.length > 800 && (
                <div className="text-center">
                  <button
                    onClick={() => toggleChunkDetail(currentChunk)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      isExpanded 
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isExpanded ? (
                      <>📖 Show Quick Version <ChevronDown className="w-4 h-4 ml-2 inline" /></>
                    ) : (
                      <>📚 More Detail <ChevronRight className="w-4 h-4 ml-2 inline" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Auto-extracted Key Points for THIS chunk only */}
          {enhancedChunk.auto_key_points.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                🎯 Key Points from This Section
              </h4>
              <ul className="space-y-3">
                {enhancedChunk.auto_key_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 font-bold mr-4 mt-1 text-lg">•</span>
                    <span className="text-gray-800 leading-relaxed text-base md:text-lg">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Task Questions for THIS chunk only */}
          {enhancedChunk.task_questions && enhancedChunk.task_questions.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3" />
                🤔 Quick Reflection
              </h4>
              <div className="space-y-6">
                {enhancedChunk.task_questions.map((question, index) => (
                  <div key={index} className="bg-white rounded-lg p-5 border border-purple-200">
                    <h5 className="font-semibold text-gray-800 mb-3 text-lg">
                      {index + 1}. {question}
                    </h5>
                    <textarea
                      value={answers[`${enhancedChunk.id}-${index}`] || ''}
                      onChange={(e) => updateAnswer(`${enhancedChunk.id}-${index}`, e.target.value)}
                      placeholder="Write your reflection here..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-base"
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIXED: Manual Navigation Footer - User Controls When to Advance */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <div className="flex justify-between items-center">
            <button
              onClick={prevChunk}
              disabled={currentChunk === 0}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {currentChunk === chunks.length - 1 
                  ? "Ready to complete reading?" 
                  : `Next: ${chunks[currentChunk + 1]?.title || generateChunkTitle(chunks[currentChunk + 1]?.content || '', currentChunk + 1)}`
                }
              </p>
            </div>

            <button
              onClick={nextChunk}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {currentChunk === chunks.length - 1 ? (
                <>Complete Reading <CheckCircle className="w-4 h-4 ml-2" /></>
              ) : (
                <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedReadingChunks;