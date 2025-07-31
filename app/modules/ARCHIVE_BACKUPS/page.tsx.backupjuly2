'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Target,
  Download,
  Play,
  Heart,
  Users,
  Briefcase,
  HelpCircle,
  Book,
  Lightbulb,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Zap,
  Star,
  Link2,
  Send,
  Bot,
  ExternalLink,
  X,
  CheckCircle2,
  Circle,
  FileText
} from 'lucide-react';

// Real Supabase client
const supabase = createClientComponentClient();

// Enhanced Bible Reference System
const enhancedBibleReferences: Record<string, string> = {
  "Genesis 1:26": "Then God said, 'Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.'",
  "1 Peter 3:15": "But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.",
  "Colossians 3:23": "Whatever you do, work heartily, as for the Lord and not for men,",
  "1 Timothy 5:8": "But if anyone does not provide for his relatives, and especially for members of his household, he has denied the faith and is worse than an unbeliever.",
  "Ephesians 4:28": "Let the thief no longer steal, but rather let him labor, doing honest work with his own hands, so that he may have something to share with anyone in need.",
  "Luke 16:10": "One who is faithful in a very little is also faithful in much, and one who is dishonest in a very little is also dishonest in much.",
  "Acts 16:14": "One who heard us was a woman named Lydia, from the city of Thyatira, a seller of purple goods, who was a worshiper of God. The Lord opened her heart to pay attention to what was said by Paul.",
  "1 Thessalonians 2:9": "For you remember, brothers, our labor and toil: we worked night and day, that we might not be a burden to any of you, while we proclaimed to you the gospel of God.",
  "Proverbs 24:16": "For the righteous falls seven times and rises again, but the wicked stumble in times of calamity.",
  "Ephesians 2:10": "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
};

// Database Types - Enhanced with new fields
interface SessionData {
  id: string;
  module_id: number;
  session_number: number;
  title: string;
  subtitle?: string;
  becoming_gods_entrepreneur?: { video_url?: string | null; };
  content?: {
    written_curriculum?: {
      main_content?: string;
      quick_version?: {
        chunks?: ReadingChunk[];
      };
    };
    look_back?: {
      vision_statement?: string;
      reflection_questions?: string[];
      is_first_session?: boolean;
      previous_actions?: PreviousAction[];
      previous_sharing_commitment?: string;
    };
    look_forward?: {
      commitment_prompt?: string;
      application_questions?: string[];
      multiplication_challenges?: string[];
    };
    growing_wealth?: {
      main_content?: string;
      video_url?: string | null;
    };
    growing_people?: {
      main_content?: string;
      video_url?: string | null;
    };
    quiz_questions?: any[];
    faq_questions?: any[];
    coaching_questions?: any[];
  };
  scripture_reference?: string;
  video_url?: string | null;
  case_study?: string;
  business_plan_questions?: string[];
  faq_questions?: string[];  // ✅ FIXED: Added FAQ questions from database
  transformation_promise?: string;
  resources?: {
    books?: { title: string; author: string; url: string; }[];
    websites?: { title: string; url: string; }[];
    articles?: { title: string; url: string; }[];
  };
  created_at: string;
  updated_at: string;
}

interface SessionPageProps {
  params: {
    moduleId: string;
    sessionId: string;
  };
}

// Reading Chunk Interface
interface ReadingChunk {
  id: string;
  title: string;
  content: string;
  key_thought: string;
  summary: string;
  task_questions: string[];
  time: string;
  order: number;
}

// Enhanced Action Commitment Interface
interface ActionCommitment {
  id: string;
  type: 'business' | 'discipleship';
  smartData: {
    specific: string;
    measurable?: string;
    ministryMinded?: string;
    achievable: string;
    relevant?: string;
    relational?: string;
    timed: string;
  };
  generatedStatement: string;
  completed: boolean;
  completionNotes?: string;
  learningReflection?: string;
  impactAssessment?: string;
  obstacleIdentification?: string;
}

// Previous Action Interface
interface PreviousAction {
  id: string;
  type: 'business' | 'discipleship';
  statement: string;
  completion_percentage: number;
  completed_status: null | number;
  failure_reason: string;
  lesson_learned: string;
}

// AI Message Interface
interface AIMessage {
  type: 'user' | 'ai';
  content: string;
  followUp?: string;
}

// ENHANCED VIMEO VIDEO COMPONENT
const VimeoVideo = ({ url, title }: { url: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log(`🎥 VimeoVideo Component - ${title}:`, url);

  // Extract video ID and hash from various Vimeo URL formats
  const extractVimeoData = (vimeoUrl: string): { videoId: string; hash?: string } | null => {
    console.log('🔗 Processing Vimeo URL:', vimeoUrl);
    
    if (!vimeoUrl) {
      console.log('❌ No URL provided');
      return null;
    }
    
    // Handle different Vimeo URL formats
    const patterns = [
      { regex: /vimeo\.com\/(\d+)\/([\w\d]+)/, hasHash: true },  // with hash first (private videos)
      { regex: /vimeo\.com\/(\d+)/, hasHash: false },
      { regex: /player\.vimeo\.com\/video\/(\d+)/, hasHash: false },
      { regex: /vimeo\.com\/video\/(\d+)/, hasHash: false }
    ];

    for (const pattern of patterns) {
      const match = vimeoUrl.match(pattern.regex);
      if (match && match[1]) {
        const result = {
          videoId: match[1],
          hash: pattern.hasHash && match[2] ? match[2] : undefined
        };
        console.log('✅ Extracted video data:', result);
        return result;
      }
    }
    
    console.log('❌ Failed to match Vimeo URL pattern');
    return null;
  };

  const vimeoData = extractVimeoData(url);

  // If we can't extract video data, show error state
  if (!vimeoData || !vimeoData.videoId) {
    console.log('🚨 Video Configuration Error for:', title);
    return (
      <div className="relative w-full bg-red-100 border-2 border-red-300 rounded-lg" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-red-700">
          <div className="text-center p-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="font-semibold text-lg mb-2">Video Configuration Error</p>
            <p className="text-sm mb-2">Could not load video from: {url}</p>
          </div>
        </div>
      </div>
    );
  }

  // Create proper Vimeo embed URL with hash if available (for private videos)
  const embedUrl = vimeoData.hash 
    ? `https://player.vimeo.com/video/${vimeoData.videoId}?h=${vimeoData.hash}&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`
    : `https://player.vimeo.com/video/${vimeoData.videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`;
    
  if (vimeoData.hash) {
    console.log('🔐 Private video detected - using hash:', vimeoData.hash);
  }
  console.log('✅ Generated embed URL:', embedUrl);

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p className="font-semibold">Loading {title}...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-100 text-red-700 z-10">
          <div className="text-center p-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="font-semibold">Failed to Load Video</p>
            <p className="text-sm">Please check your internet connection</p>
            <button 
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Vimeo iframe */}
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        loading="lazy"
        onLoad={() => {
          console.log('✅ Video loaded successfully');
          setIsLoading(false);
        }}
        onError={() => {
          console.log('❌ Video failed to load');
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

// Enhanced Scripture Reference Component
const EnhancedScriptureReference: React.FC<{ reference: string; children?: React.ReactNode }> = ({ reference, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const verseText = enhancedBibleReferences[reference];

  return (
    <>
      <span
        ref={elementRef}
        className="relative inline-block cursor-pointer text-blue-600 font-semibold border-b-2 border-dotted border-blue-400 hover:text-blue-800 hover:border-blue-600 transition-all duration-200 px-1 py-0.5 rounded"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered ? 'linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)' : 'transparent'
        }}
      >
        {children || reference}
      </span>
      
      {isHovered && verseText && (
        <div 
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ 
            left: popupPosition.x,
            top: popupPosition.y,
            maxWidth: '400px'
          }}
        >
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-2xl p-6 relative">
            <div className="flex items-center mb-3 pb-2 border-b border-blue-100">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <div className="font-bold text-blue-800 text-lg">{reference}</div>
            </div>
            <div className="text-gray-700 leading-relaxed italic text-base">
              "{verseText}"
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-200"></div>
          </div>
        </div>
      )}
    </>
  );
};

// Vision Statement Component
const VisionStatement: React.FC = () => {
  return (
    <div className="relative mb-6 bg-gradient-to-r from-teal-400 to-slate-700 rounded-2xl p-6 md:p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="text-3xl md:text-4xl mb-4 animate-pulse">✨</div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
          Multiplying Followers of Jesus while building profitable businesses
        </h2>
        <p className="text-teal-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
          Your journey of faith-driven entrepreneurship transforms lives and communities
        </p>
      </div>
    </div>
  );
};

// Utility functions for beautiful formatting
const calculateReadingTime = (content: string): string => {
  if (!content) return '3 min';
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(wordCount / 200)); // 200 words per minute
  return `${minutes} min`;
};

const parseMainContentIntoChunks = (mainContent: string): ReadingChunk[] => {
  if (!mainContent) return [];
  
  const sectionRegex = /##\s*🔥\s*READING BLOCK[^:]*:\s*([^(]+)\s*\(([^)]+)\)/gi;
  const sections = mainContent.split(sectionRegex);
  const chunks: ReadingChunk[] = [];
  
  if (sections.length < 3) {
    return [{
      id: 'main_1',
      title: 'Session Reading Content',
      content: mainContent,
      key_thought: extractKeyPoints(mainContent)[0] || 'This section contains important principles for faith-driven entrepreneurship.',
      summary: 'Core session content for faith-driven business principles.',
      task_questions: ['What is the main insight you gained from this reading?', 'How can you apply this principle in your business this week?'],
      time: calculateReadingTime(mainContent),
      order: 1
    }];
  }
  
  for (let i = 1; i < sections.length; i += 3) {
    const title = sections[i]?.trim() || `Reading Section ${Math.ceil(i/3)}`;
    const timeString = sections[i + 1]?.trim() || '5 min';
    const content = sections[i + 2]?.trim() || '';
    
    if (content) {
      chunks.push({
        id: `main_${Math.ceil(i/3)}`,
        title: title,
        content: content,
        key_thought: extractKeyPoints(content)[0] || 'Important principles for faith-driven entrepreneurship.',
        summary: `Key insights from: ${title}`,
        task_questions: [
          `What stood out to you most in "${title}"?`,
          'How does this principle apply to your current business situation?'
        ],
        time: timeString,
        order: Math.ceil(i/3)
      });
    }
  }
  
  return chunks.length > 0 ? chunks : [{
    id: 'main_1',
    title: 'Session Reading Content',
    content: mainContent,
    key_thought: extractKeyPoints(mainContent)[0] || 'This section contains important principles for faith-driven entrepreneurship.',
    summary: 'Core session content for faith-driven business principles.',
    task_questions: ['What is the main insight you gained from this reading?', 'How can you apply this principle in your business this week?'],
    time: calculateReadingTime(mainContent),
    order: 1
  }];
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

// GLOBAL BEAUTIFUL TYPOGRAPHY FORMATTER - MOVED OUTSIDE COMPONENT
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
    .replace(/<em[^>]*>/g, '<em class="italic text-gray-700">');}

// GLOBAL CASE STUDY FORMATTER - MOVED OUTSIDE COMPONENT  
const formatCaseStudyContent = (content: string) => {
  if (!content) return "Content is being prepared for this case study.";
  
  return content
    // Format headings with gorgeous styling - RESTORED
    .replace(/<h1[^>]*>/g, '<h1 class="text-4xl font-bold text-orange-800 mb-6 mt-8 leading-tight">')
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
    // Format emphasis - RESTORED
    .replace(/<strong[^>]*>/g, '<strong class="font-bold text-gray-900">')
    .replace(/<em[^>]*>/g, '<em class="italic text-gray-700">')
    // Format blockquotes - RESTORED
    .replace(/<blockquote[^>]*>/g, '<blockquote class="bg-blue-50 border-l-4 border-blue-400 pl-6 py-4 my-6 rounded-r-lg italic text-blue-800">')
    .replace(/<\/blockquote>/g, '</blockquote>');
};

// NEW UNIVERSAL READING COMPONENT - Works for ALL modules
const UniversalReadingWithToggle = ({ sessionData, title }: { 
  sessionData: SessionData; 
  title: string 
}) => {
  const [showQuickVersion, setShowQuickVersion] = useState(true);
  const readingRef = useRef<HTMLDivElement>(null);

  // Smart content detection - works for ALL module structures
  const chunks = sessionData.content?.written_curriculum?.quick_version?.chunks || [];
  const mainContent = sessionData.content?.written_curriculum?.main_content;
  
  // CRITICAL: Handle ALL possible content structures
  const hasChunks = chunks.length > 0;
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

// NEW UNIVERSAL CASE STUDY COMPONENT - Works for ALL modules
const UniversalCaseStudyWithToggle = ({ sessionData, sessionTitle }: { 
  sessionData: SessionData; 
  sessionTitle: string 
}) => {
  const [showQuickVersion, setShowQuickVersion] = useState(true);
  const caseStudyRef = useRef<HTMLDivElement>(null);

  // Smart case study content detection
  const caseStudyContent = sessionData.case_study || 
    `
    <h3>Business Transformation Case Study</h3>
    <p>This case study demonstrates how biblical business principles create both financial success and kingdom impact.</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
      <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem;">
        <h4 style="color: #dc2626; margin-bottom: 0.5rem;">🚨 The Challenge</h4>
        <p style="margin: 0;">Struggling with profitability and unclear business direction</p>
      </div>
      <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem;">
        <h4 style="color: #16a34a; margin-bottom: 0.5rem;">🎉 The Results</h4>
        <p style="margin: 0;">40% revenue increase + kingdom impact</p>
      </div>
    </div>
    <p>The transformation demonstrates how faith-driven business practices create sustainable success.</p>
    `;

  const handleToggle = (showFull: boolean) => {
    setShowQuickVersion(!showFull);
    setTimeout(() => {
      if (caseStudyRef.current) {
        caseStudyRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-6" ref={caseStudyRef}>
      {/* Universal Case Study Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3" />
              📊 Real Business Transformation
            </h3>
            <p className="text-orange-100 text-lg">
              Discover how biblical principles create both profit and kingdom impact
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <div className="text-2xl font-bold">40%</div>
              <div className="text-sm text-orange-100">Revenue Increase</div>
            </div>
          </div>
        </div>
      </div>

      {/* UNIVERSAL CASE STUDY TOGGLE - Same as Module 1 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleToggle(false)}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            showQuickVersion 
              ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Zap className="w-5 h-5 mr-2" />
          📊 Quick Overview (5 min)
        </button>
        <button
          onClick={() => handleToggle(true)}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            !showQuickVersion 
              ? 'bg-red-500 text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-5 h-5 mr-2" />
          📖 Full Case Study (15 min)
        </button>
      </div>

      {/* UNIVERSAL CASE STUDY CONTENT */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold">
              {showQuickVersion ? '⚡ Quick Summary' : '📖 Complete Case Study'}
            </h4>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {showQuickVersion ? '5 Minutes' : '15 Minutes'}
            </span>
          </div>
        </div>
        
        <div className="p-8">
          {showQuickVersion ? (
            // QUICK CASE STUDY OVERVIEW
            <div className="space-y-6">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                <h5 className="text-xl font-semibold text-orange-800 mb-3">⚡ Quick Summary</h5>
                <p className="text-gray-700 leading-relaxed text-lg">
                  This case study demonstrates how biblical business principles led to both financial success and kingdom impact. 
                  The transformation shows practical steps you can apply in your own business journey.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <h6 className="font-semibold text-red-800 mb-3 text-lg flex items-center">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    🚨 The Challenge
                  </h6>
                  <p className="text-gray-800 text-lg leading-relaxed">Struggling with profitability and purpose alignment</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h6 className="font-semibold text-green-800 mb-3 text-lg flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    🎉 The Results
                  </h6>
                  <p className="text-gray-800 text-lg leading-relaxed">40% revenue increase + kingdom impact</p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => handleToggle(true)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  📖 Read Full Case Study
                </button>
              </div>
            </div>
          ) : (
            // FULL CASE STUDY CONTENT
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <h5 className="text-xl font-semibold text-red-800 mb-3">📖 Complete Case Study</h5>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Comprehensive business transformation story with detailed analysis and actionable insights.
                </p>
              </div>
              
              <div className="prose prose-xl max-w-none formatted-content" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                <div 
                  className="text-gray-700 leading-relaxed formatted-content"
                  dangerouslySetInnerHTML={{ 
                    __html: formatCaseStudyContent(caseStudyContent) 
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

// ENHANCED: Beautiful Step-by-Step Reading Chunks with Quick/Full Toggle
const EnhancedReadingChunks = ({ chunks, title }: { chunks: ReadingChunk[], title: string }) => {
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
    <div className="space-y-6">
      {/* Helpful Tip Popup */}
      {showDetailTip && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lightbulb className="w-6 h-6 mr-3" />
              <p className="font-medium">💡 Tip: Click "More Detail" on any section for deeper content!</p>
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

      {/* Current Reading Chunk with Quick/Full Toggle */}
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

        {/* Beautiful Content Area */}
        <div className="p-8">
          {/* Key Thought Highlight (Beautiful Yellow Box) */}
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

          {/* Quick Version Content */}
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

          {/* Auto-extracted Key Points */}
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

          {/* Summary Box */}
          {enhancedChunk.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3" />
                📋 Section Summary
              </h4>
              <p className="text-blue-700 leading-relaxed text-lg">
                {enhancedChunk.summary}
              </p>
            </div>
          )}

          {/* Task Questions for this chunk */}
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

        {/* Simple Navigation Footer */}
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

// Enhanced Action Step Accountability System
interface ActionStep {
  id: string;
  user_id?: string;
  session_id: string;
  module_id: number;
  session_number: number;
  type: 'business' | 'discipleship';
  specific: string;
  measurable?: string;
  ministryMinded?: string;
  achievable: string;
  relevant?: string;
  relational?: string;
  timed: string;
  generated_statement: string;
  person_to_tell: string;
  completed: boolean;
  completion_notes?: string;
  learning_reflection?: string;
  created_at: string;
}

// AI Coaching responses
const aiCoachingResponses: Record<string, { response: string; followUp: string; }> = {
  "How do I apply this to my business?": {
    response: "Great question! Start with one specific area where you can demonstrate excellence this week. For example, if you run a service business, focus on exceeding one customer's expectations through quality and genuine care. As Colossians 3:23 reminds us, 'Whatever you do, work heartily, as for the Lord and not for men.' This isn't about perfection - it's about intentionality. What's one specific way you could show God's character through your business this week?",
    followUp: "What type of business are you in? I can give more specific guidance."
  },
  "What if I'm just starting out?": {
    response: "Starting out is actually a blessing! You have the opportunity to build biblical foundations from day one. Focus on three things: 1) Integrity in all dealings, no matter how small, 2) Excellence in your craft - become genuinely skilled at what you do, 3) Service heart - always ask 'How can I truly help this person?' Remember Luke 16:10 - 'One who is faithful in very little is also faithful in much.' God is watching how you handle these early opportunities.",
    followUp: "What's the biggest challenge you're facing as you start your business?"
  },
  "How do I balance profit and ministry?": {
    response: "This is a false dichotomy many Christians struggle with! Profit and ministry work together when done biblically. Profit provides resources for generosity, family provision, and ministry support. The key is pursuing profit through biblical means (integrity, excellence, service) and using profit for biblical purposes. A profitable business can fund far more ministry than a struggling one. Think of profit as the fuel for your Faith-Driven impact, not the enemy of it.",
    followUp: "What ministry opportunities are you sensing God wants to fund through your business success?"
  },
  "How can I share my faith without being pushy?": {
    response: "The most powerful witness is consistent Christian character demonstrated through your business practices. Let your integrity, generosity, and excellence speak first. Build genuine relationships with customers and employees. When people ask about your motivation or values, share naturally. Your business can become a lighthouse in your community - people will be drawn to the light they see in how you operate.",
    followUp: "What opportunities for natural conversation do you see in your current business interactions?"
  }
  // ✅ TODO: Integrate sessionData.faq_questions here for session-specific coaching responses
  // This will allow FAQ content from database to enhance the AI coaching experience
};

// Biblical Motivational Messages for Progress Mindset
const biblicalMotivationalMessages = {
  learningFromFailure: [
    "💪 Romans 8:28 - 'God works all things together for good for those who love Him.' This setback is preparing you for something better!",
    "🌱 James 1:2-4 - 'Consider it pure joy when you face trials, because you know that the testing of your faith produces perseverance.' You're growing stronger!",
    "⚡ Proverbs 24:16 - 'Though the righteous fall seven times, they rise again.' Getting back up is what makes you righteous, not never falling!",
    "🎯 Philippians 3:13-14 - 'Forgetting what is behind and straining toward what is ahead, I press on toward the goal.' Your best days are ahead!"
  ],
  progressCelebration: [
    "🎉 Galatians 6:9 - 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.' Keep going!",
    "👑 2 Timothy 2:15 - 'Be diligent to present yourself approved to God, a worker who does not need to be ashamed.' Your faithful work honors God!",
    "⭐ Luke 16:10 - 'Whoever is faithful in very little is also faithful in much.' These small steps are building something great!",
    "🔥 1 Corinthians 15:58 - 'Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain.'"
  ],
  faithfulPractice: [
    "🏋️ Just like physical exercise, spiritual and business disciplines require consistent practice. You don't expect to lift heavy weights on day one!",
    "🎯 Each action step is practice in faithfulness. God is more interested in your character development than your perfection.",
    "🌟 You're created in God's image - you have divine creativity and problem-solving ability built into your DNA. Trust the process!",
    "💎 Every 'failure' is actually data that helps you improve. God uses everything to shape you into who He's calling you to become."
  ]
};

// Enhanced Action Review Component for Looking Back
const ActionAccountabilityReview = ({ 
  sessionData, 
  pathwayMode, 
  onComplete 
}: {
  sessionData: SessionData;
  pathwayMode: 'individual' | 'small_group';
  onComplete: () => void;
}) => {
  const [previousActions, setPreviousActions] = useState<ActionStep[]>([]);
  const [actionReviews, setActionReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState<string | null>(null);

  // Load previous session's action steps
  useEffect(() => {
    const loadPreviousActions = async () => {
      try {
        setLoading(true);
        
        // Calculate previous session
        const currentModule = sessionData.module_id;
        const currentSession = sessionData.session_number;
        let prevModule = currentModule;
        let prevSession = currentSession - 1;
        
        if (prevSession < 1) {
          prevModule = currentModule - 1;
          prevSession = 4; // Assuming 4 sessions per module
        }
        
        if (prevModule < 1) {
          // No previous session
          setLoading(false);
          return;
        }

        // Try to fetch from a hypothetical user_action_steps table
        // For now, we'll simulate this data
        const mockPreviousActions: ActionStep[] = [
          {
            id: 'action_1',
            session_id: `${prevModule}_${prevSession}`,
            module_id: prevModule,
            session_number: prevSession,
            type: 'business',
            specific: 'Call 5 potential customers to discuss their biggest business challenges',
            achievable: 'Realistic within my current skill level and available time',  // ✅ FIXED: Added required field
            timed: 'Wednesday and Thursday between 2-4 PM',
            generated_statement: 'I will call 5 potential customers to discuss their biggest business challenges | When: Wednesday and Thursday between 2-4 PM',
            person_to_tell: 'Sarah',
            completed: false,
            created_at: new Date().toISOString()
          },
          {
            id: 'action_2',
            session_id: `${prevModule}_${prevSession}`,
            module_id: prevModule,
            session_number: prevSession,
            type: 'discipleship',
            specific: 'Have coffee with John from accounting and ask about his family',
            achievable: 'Appropriate given my existing relationship with John',  // ✅ FIXED: Added required field
            timed: 'Friday at 3 PM at the coffee shop',
            generated_statement: 'I will have coffee with John from accounting and ask about his family | When: Friday at 3 PM',
            person_to_tell: 'Mary',
            completed: false,
            created_at: new Date().toISOString()
          }
        ];

        setPreviousActions(mockPreviousActions);
      } catch (error) {
        console.error('Error loading previous actions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreviousActions();
  }, [sessionData]);

  const updateActionReview = (actionId: string, field: string, value: any) => {
    setActionReviews(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        [field]: value
      }
    }));
  };

  const markCompleted = (actionId: string) => {
    updateActionReview(actionId, 'completed', true);
    setCelebrating(actionId);
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setCelebrating(null);
    }, 3000);
  };

  const getDanSullivanQuestions = (actionType: 'business' | 'discipleship') => {
    return [
      "What did you discover from this experience?",
      "How is this different than you expected?", 
      "What would you do differently next time?",
      "What capability do you need to develop?",
      "What did you learn about yourself?",
      "How can this learning help you win next time?"
    ];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          <span>Loading your previous commitments...</span>
        </div>
      </div>
    );
  }

  if (previousActions.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-3">🎉 Welcome to Your Learning Journey!</h4>
        <p className="text-blue-700">
          This is your first session or you haven't created action steps yet. 
          Action steps from today's session will appear here next time for accountability review.
        </p>
        <button 
          onClick={onComplete}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          ✅ Continue to Learning
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Three Thirds Reminder for Small Groups */}
      {pathwayMode === 'small_group' && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
          <h5 className="font-bold mb-2">👥 Three Thirds Approach Reminder</h5>
          <p className="text-sm text-purple-100">
            <strong>Looking Back (10-15 min):</strong> Prayer + action sharing + wins + vision reminder
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-600" />
          📊 Action Step Accountability Review
        </h4>
        <p className="text-gray-600 mb-6">
          Let's review the action steps you committed to in your last session. Remember: Learning is winning!
        </p>

        <div className="space-y-6">
          {previousActions.map((action, index) => {
            const review = actionReviews[action.id] || {};
            const isCompleted = review.completed || false;
            const isCelebrating = celebrating === action.id;

            return (
              <div key={action.id} className={`border rounded-lg p-6 transition-all ${
                isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                {/* Celebration Animation */}
                {isCelebrating && (
                  <div className="text-center mb-4 animate-pulse">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-green-800 font-bold text-lg">
                      Fantastic! You completed this action step!
                    </p>
                  </div>
                )}

                {/* Action Summary */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">
                        {action.type === 'business' ? '💼' : '❤️'}
                      </span>
                      <h5 className="font-semibold text-gray-800 text-lg">
                        Action {index + 1}: {action.type === 'business' ? 'Business' : 'Discipleship'}
                      </h5>
                    </div>
                    <p className="text-gray-700 text-base mb-2">
                      <strong>What:</strong> {action.specific}
                    </p>
                    <p className="text-gray-700 text-base mb-2">
                      <strong>When:</strong> {action.timed}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Tell:</strong> Did you tell {action.person_to_tell} about your learning?
                    </p>
                  </div>
                  
                  {!isCompleted && (
                    <button
                      onClick={() => markCompleted(action.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      ✅ Mark Complete
                    </button>
                  )}
                </div>

                {/* Completion Questions */}
                {isCompleted ? (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <h6 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      🎉 Excellent Work! Share Your Win
                    </h6>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-green-700 mb-1">
                          What was the best outcome from completing this action?
                        </label>
                        <textarea
                          value={review.celebration_notes || ''}
                          onChange={(e) => updateActionReview(action.id, 'celebration_notes', e.target.value)}
                          placeholder="Share your win and what you learned..."
                          className="w-full p-3 border border-green-300 rounded-lg text-sm bg-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-green-700 mb-1">
                          Did you tell {action.person_to_tell} about your learning?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_${action.id}`}
                              value="yes"
                              checked={review.shared_learning === 'yes'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Yes! ✅
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_${action.id}`}
                              value="no"
                              checked={review.shared_learning === 'no'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Not yet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <h6 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      💡 Learning from Your Experience
                    </h6>
                    <p className="text-blue-700 text-sm mb-4">
                      <strong>Remember:</strong> Not completing an action is still learning! Every experience teaches valuable lessons.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          What did you discover from this experience?
                        </label>
                        <textarea
                          value={review.learning_discovery || ''}
                          onChange={(e) => updateActionReview(action.id, 'learning_discovery', e.target.value)}
                          placeholder="What did you learn about yourself, your business, or the situation?"
                          className="w-full p-3 border border-blue-300 rounded-lg text-sm bg-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          What would you do differently next time?
                        </label>
                        <textarea
                          value={review.different_approach || ''}
                          onChange={(e) => updateActionReview(action.id, 'different_approach', e.target.value)}
                          placeholder="How would you approach this differently to win next time?"
                          className="w-full p-3 border border-blue-300 rounded-lg text-sm bg-white"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          Did you tell {action.person_to_tell} about any learning from this session?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_incomplete_${action.id}`}
                              value="yes"
                              checked={review.shared_learning === 'yes'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Yes ✅
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_incomplete_${action.id}`}
                              value="no"
                              checked={review.shared_learning === 'no'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Not yet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={onComplete}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ✅ Complete Accountability Review
          </button>
        </div>
      </div>
    </div>
  );
};

  // DIFFERENT prayers for Individual vs Small Group
  const individualPrayer = `
    Heavenly Father, as I begin this time of personal reflection and learning, I thank You for creating me in Your image with the ability to create value and serve others through my work. 
    
    Help me to see my business not just as a means of provision, but as a platform for Your Faith-Driven purposes. Give me wisdom to integrate my faith with my work in ways that honor You and bless others.
    
    As I review my previous commitments and plan new steps, grant me the humility to learn from both successes and failures. Help me to be faithful in small things, knowing that You are preparing me for greater impact.
    
    May my business be a reflection of Your character - marked by integrity, excellence, generosity, and love. Use me to multiply disciples in the marketplace.
    
    In Jesus' name, Amen.
  `;

  const groupPrayer = `
    Heavenly Father, we gather as believers called to the marketplace, united in our desire to honor You through our businesses.
    
    Thank You for each person in this group and the unique gifts, experiences, and challenges they bring. Help us to learn from each other, encourage one another, and hold each other accountable in love.
    
    As we share our victories and failures, our dreams and fears, create bonds of fellowship that strengthen our resolve and sharpen our focus. May iron sharpen iron as we discuss how to integrate our faith with our work.
    
    Use our businesses collectively to transform our community and extend Your Faith-Driven impact. Help us to support each other not just in business success, but in spiritual growth and disciple-making.
    
    May our group be a source of wisdom, encouragement, and accountability for each member.
    
    In Jesus' name, Amen.
  `;

// Updated Looking Back Component using Action Accountability System
const EnhancedLookingBack = ({ sessionData, pathwayMode, onComplete }: {
  sessionData: SessionData;
  pathwayMode: 'individual' | 'small_group';
  onComplete: () => void;
}) => {
  const [prayerCompleted, setPrayerCompleted] = useState(false);

  const isFirstSession = sessionData.content?.look_back?.is_first_session || 
                        (sessionData.module_id === 1 && sessionData.session_number === 1);

  // DIFFERENT prayers for Individual vs Small Group
  const individualPrayer = `
    Heavenly Father, as I begin this time of personal reflection and learning, I thank You for creating me in Your image with the ability to create value and serve others through my work. 
    
    Help me to see my business not just as a means of provision, but as a platform for Your Faith-Driven purposes. Give me wisdom to integrate my faith with my work in ways that honor You and bless others.
    
    As I review my previous commitments and plan new steps, grant me the humility to learn from both successes and failures. Help me to be faithful in small things, knowing that You are preparing me for greater impact.
    
    May my business be a reflection of Your character - marked by integrity, excellence, generosity, and love. Use me to multiply disciples in the marketplace.
    
    In Jesus' name, Amen.
  `;

  const groupPrayer = `
    Heavenly Father, we gather as believers called to the marketplace, united in our desire to honor You through our businesses.
    
    Thank You for each person in this group and the unique gifts, experiences, and challenges they bring. Help us to learn from each other, encourage one another, and hold each other accountable in love.
    
    As we share our victories and failures, our dreams and fears, create bonds of fellowship that strengthen our resolve and sharpen our focus. May iron sharpen iron as we discuss how to integrate our faith with our work.
    
    Use our businesses collectively to transform our community and extend Your Faith-Driven impact. Help us to support each other not just in business success, but in spiritual growth and disciple-making.
    
    May our group be a source of wisdom, encouragement, and accountability for each member.
    
    In Jesus' name, Amen.
  `;

  // First session experience
  if (isFirstSession) {
    return (
      <div className="space-y-6">
        {/* Different Opening Prayer based on mode */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center">
            🙏 Opening Prayer
          </h4>
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
              {pathwayMode === 'individual' ? individualPrayer : groupPrayer}
            </div>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="prayer-check"
              checked={prayerCompleted}
              onChange={(e) => setPrayerCompleted(e.target.checked)}
              className="mr-3 w-4 h-4" 
            />
            <label htmlFor="prayer-check" className="text-gray-700">
              {pathwayMode === 'individual' ? 
                "I have prayed this prayer (or my own version)" : 
                "We have prayed together as a group"
              }
            </label>
          </div>
        </div>

        {/* First Session Celebration - Different for Individual vs Group */}
        <div className={`text-white p-6 rounded-lg ${
          pathwayMode === 'individual' 
            ? 'bg-gradient-to-r from-green-400 to-blue-500' 
            : 'bg-gradient-to-r from-purple-400 to-pink-500'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-3">
              {pathwayMode === 'individual' 
                ? "Congratulations on Starting Your Personal Journey!" 
                : "Congratulations on Forming Your Learning Group!"
              }
            </h4>
            <p className={`mb-4 ${pathwayMode === 'individual' ? 'text-green-100' : 'text-purple-100'}`}>
              {pathwayMode === 'individual' 
                ? "You've taken a significant step by committing to personal growth in faith-driven entrepreneurship. This shows your heart for integrating your faith with your work!"
                : "You've gathered as believers committed to growing together in marketplace ministry. The accountability and encouragement you'll provide each other will multiply your impact!"
              }
            </p>
          </div>
        </div>

        {/* Vision Statement Reminder */}
        <div className="bg-gradient-to-r from-teal-400 to-slate-700 rounded-lg p-6 text-white">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">✨ Our Vision</h4>
            <p className="text-lg">
              Multiplying Followers of Jesus while building profitable businesses
            </p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          disabled={!prayerCompleted}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Complete Looking Back
        </button>
      </div>
    );
  }

  // Regular session - use Action Accountability Review
  return (
    <div className="space-y-6">
      {/* Opening Prayer */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center">
          🙏 {pathwayMode === 'individual' ? 'Personal Opening Prayer' : 'Group Opening Prayer'}
        </h4>
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
            {pathwayMode === 'individual' ? individualPrayer : groupPrayer}
          </div>
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="prayer-check"
            checked={prayerCompleted}
            onChange={(e) => setPrayerCompleted(e.target.checked)}
            className="mr-3 w-4 h-4" 
          />
          <label htmlFor="prayer-check" className="text-gray-700">
            {pathwayMode === 'individual' ? 
              "I have prayed this prayer (or my own version)" : 
              "We have prayed together as a group"
            }
          </label>
        </div>
      </div>

      {/* Action Accountability Review */}
      {prayerCompleted && (
        <ActionAccountabilityReview 
          sessionData={sessionData}
          pathwayMode={pathwayMode}
          onComplete={onComplete}
        />
      )}

      {!prayerCompleted && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-600">Complete the opening prayer to begin your accountability review.</p>
        </div>
      )}
    </div>
  );
};

// Action Builder Component with Individual vs Small Group Differences
const ActionBuilderComponent = ({ savedActions, onSaveAction, pathwayMode }: {
  savedActions: ActionCommitment[];
  onSaveAction: (action: ActionCommitment) => void;
  pathwayMode: 'individual' | 'small_group';
}) => {
  const [actionType, setActionType] = useState<'business' | 'discipleship' | ''>('');
  const [helpPopup, setHelpPopup] = useState({
    isOpen: false,
    title: '',
    content: ''
  });
  const [accountabilityPartner, setAccountabilityPartner] = useState('');
    
  const [businessForm, setBusinessForm] = useState({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timed: ''
  });
    
  const [discipleshipForm, setDiscipleshipForm] = useState({
    specific: '',
    ministryMinded: '',
    achievable: '',
    relational: '',
    timed: ''
  });

  const helpContent = {
    'business-specific': {
      title: 'Making Business Actions Specific',
      content: `
        <p><strong>✅ Good Example:</strong> "Call 5 potential customers to discuss their biggest business challenges and document responses in CRM"</p>
        <p><strong>❌ Poor Example:</strong> "Do some marketing"</p>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Include numbers when possible (how many, how much)</li>
          <li>Name specific people or types of people</li>
          <li>Describe the exact action you'll take</li>
          <li>Include where you'll document or track results</li>
        </ul>
      `
    },
    'disciple-specific': {
      title: 'Specific Discipleship Actions',
      content: `
        <p><strong>✅ Good Example:</strong> "Have coffee with Sarah from accounting and ask about her family and work stress"</p>
        <p><strong>❌ Poor Example:</strong> "Be more spiritual at work"</p>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Name the specific person you'll connect with</li>
          <li>Plan specific conversation topics or questions</li>
          <li>Focus on building the relationship first</li>
          <li>Look for natural opportunities to share your faith journey</li>
        </ul>
      `
    }
  };

  const showHelp = (type: string) => {
    const help = helpContent[type as keyof typeof helpContent];
    if (help) {
      setHelpPopup({ isOpen: true, title: help.title, content: help.content });
    }
  };

  const handleSave = () => {
    if (!actionType) return;

    const newAction: ActionCommitment = {
      id: `action_${Date.now()}`,
      type: actionType,
      smartData: actionType === 'business' ? businessForm : discipleshipForm,
      generatedStatement: generateActionStatement(),
      completed: false
    };

    onSaveAction(newAction);
    
    if (actionType === 'business') {
      setBusinessForm({ specific: '', measurable: '', achievable: '', relevant: '', timed: '' });
    } else {
      setDiscipleshipForm({ specific: '', ministryMinded: '', achievable: '', relational: '', timed: '' });
    }
    setActionType('');
  };

  const generateActionStatement = (): string => {
    if (actionType === 'business') {
      return `I will ${businessForm.specific} ${businessForm.timed ? '| When: ' + businessForm.timed : ''}`;
    } else {
      return `I will ${discipleshipForm.specific} ${discipleshipForm.timed ? '| When: ' + discipleshipForm.timed : ''}`;
    }
  };

  const HelpPopup = ({ isOpen, onClose, title, content }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mt-4 text-center">
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💡 Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          {pathwayMode === 'individual' ? 'Create Your Action Commitments' : 'Create Group Action Commitments'}
        </h4>
        <p className="text-gray-600">
          {pathwayMode === 'individual' 
            ? 'Transform today\'s learning into specific, achievable actions. Choose at least 1 action, up to 4 total.'
            : 'Work with your group to create action commitments with built-in accountability. Each person should have at least 1 action.'
          }
        </p>
      </div>

      {/* Accountability Section - Different for Individual vs Group */}
      {pathwayMode === 'small_group' && (
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-3">👥 Group Accountability Setup</h5>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Your Accountability Partner from Today's Group:</label>
              <input
                type="text"
                value={accountabilityPartner}
                onChange={(e) => setAccountabilityPartner(e.target.value)}
                placeholder="Name and contact info of your partner..."
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="text-sm text-gray-600">
              💡 <strong>Group Rule:</strong> Your accountability partner will check in with you mid-week about your action commitments. 
              Be specific so they know exactly how to help you succeed!
            </div>
          </div>
        </div>
      )}

      {/* Action Type Selector */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActionType('business')}
          className={`p-4 rounded-xl border-2 transition-all ${
            actionType === 'business'
              ? 'border-teal-400 bg-teal-50 text-teal-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Target className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">Business Action</div>
          <div className="text-xs">Classic SMART format</div>
        </button>
        
        <button
          onClick={() => setActionType('discipleship')}
          className={`p-4 rounded-xl border-2 transition-all ${
            actionType === 'discipleship'
              ? 'border-teal-400 bg-teal-50 text-teal-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Heart className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">Discipleship Action</div>
          <div className="text-xs">Faith-driven SMART format</div>
        </button>
      </div>

      {/* Business SMART Form */}
      {actionType === 'business' && (
        <div className="bg-white rounded-lg p-6 border">
          <h5 className="font-semibold text-gray-800 mb-4">💼 Business Action Builder</h5>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                📝 <strong>S</strong>pecific: What exactly will you do?
                <button 
                  onClick={() => showHelp('business-specific')}
                  className="w-5 h-5 bg-teal-400 text-white rounded-full flex items-center justify-center text-xs hover:bg-teal-500"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                value={businessForm.specific}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, specific: e.target.value }))}
                placeholder="e.g., Call 5 potential customers to discuss their biggest business challenges"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                📊 <strong>M</strong>easurable: How will you know it's done?
              </label>
              <input
                type="text"
                value={businessForm.measurable}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, measurable: e.target.value }))}
                placeholder="e.g., Complete all 5 calls and document their responses in CRM"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                ⏰ <strong>T</strong>ime-bound: When will you do this?
              </label>
              <input
                type="text"
                value={businessForm.timed}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, timed: e.target.value }))}
                placeholder="e.g., Wednesday and Thursday between 2-4 PM from my office"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            {/* Action Preview */}
            {(businessForm.specific || businessForm.timed) && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h6 className="font-semibold text-green-800 mb-2">📋 Your Action Preview:</h6>
                <p className="text-green-700">
                  💼 <strong>Business Action:</strong> {businessForm.specific} 
                  {businessForm.timed && (
                    <span> | <strong>When:</strong> {businessForm.timed}</span>
                  )}
                </p>
                {pathwayMode === 'small_group' && accountabilityPartner && (
                  <p className="text-green-600 text-sm mt-2">
                    👥 <strong>Accountability Partner:</strong> {accountabilityPartner}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discipleship SMART Form */}
      {actionType === 'discipleship' && (
        <div className="bg-white rounded-lg p-6 border">
          <h5 className="font-semibold text-gray-800 mb-4">❤️ Discipleship Action Builder</h5>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                👥 <strong>S</strong>pecific: What exactly will you do, with whom?
                <button 
                  onClick={() => showHelp('disciple-specific')}
                  className="w-5 h-5 bg-teal-400 text-white rounded-full flex items-center justify-center text-xs hover:bg-teal-500"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                value={discipleshipForm.specific}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, specific: e.target.value }))}
                placeholder="e.g., Have coffee with Sarah from accounting and ask about her family and work stress"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                💒 <strong>M</strong>inistry-minded: How might this open spiritual conversations?
              </label>
              <input
                type="text"
                value={discipleshipForm.ministryMinded}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, ministryMinded: e.target.value }))}
                placeholder="e.g., Listen for opportunities to share how prayer helps me handle work stress"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                ⏰ <strong>T</strong>imed: When and where will this happen?
              </label>
              <input
                type="text"
                value={discipleshipForm.timed}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, timed: e.target.value }))}
                placeholder="e.g., Friday at 3 PM at the coffee shop near our office"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            {/* Action Preview */}
            {(discipleshipForm.specific || discipleshipForm.timed) && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h6 className="font-semibold text-green-800 mb-2">📋 Your Action Preview:</h6>
                <p className="text-green-700">
                  ❤️ <strong>Discipleship Action:</strong> {discipleshipForm.specific} 
                  {discipleshipForm.timed && (
                    <span> | <strong>When:</strong> {discipleshipForm.timed}</span>
                  )}
                </p>
                {pathwayMode === 'small_group' && accountabilityPartner && (
                  <p className="text-green-600 text-sm mt-2">
                    👥 <strong>Accountability Partner:</strong> {accountabilityPartner}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      {actionType && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={!actionType || (actionType === 'business' && !businessForm.specific) || (actionType === 'discipleship' && !discipleshipForm.specific)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Save This Action
          </button>
          
          {savedActions.length < 4 && savedActions.length > 0 && (
            <button 
              onClick={() => setActionType('')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ➕ Add Another Action
            </button>
          )}
        </div>
      )}

      <HelpPopup 
        isOpen={helpPopup.isOpen}
        onClose={() => setHelpPopup(prev => ({ ...prev, isOpen: false }))}
        title={helpPopup.title}
        content={helpPopup.content}
      />
    </div>
  );
};

// Anonymous Session Survey Component
const AnonymousSessionSurvey = () => {
  const [surveyResponses, setSurveyResponses] = useState({
    content_effectiveness: 0,
    learning_format: 0,
    recommendation: 0
  });
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitSurvey = () => {
    // In production, this would send to analytics/feedback system
    console.log('Anonymous Survey Submitted:', { surveyResponses, comments });
    setSubmitted(true);
    setTimeout(() => {
      alert('Thank you for your anonymous feedback! This helps us improve the training for future participants. 🙏');
    }, 500);
  };

  const resetSurvey = () => {
    setSurveyResponses({ content_effectiveness: 0, learning_format: 0, recommendation: 0 });
    setComments('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🙏</div>
          <h4 className="text-xl font-bold text-green-800 mb-2">Thank You!</h4>
          <p className="text-green-700 mb-4">Your anonymous feedback has been submitted and will help us improve this training.</p>
          <button 
            onClick={resetSurvey}
            className="text-green-600 hover:text-green-800 underline text-sm"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold mb-3 flex items-center">
        <Star className="w-6 h-6 mr-2" />
        📊 Anonymous Session Feedback
      </h4>
      <p className="text-pink-100 mb-6">Help us improve! Your responses are completely anonymous and help us enhance the training experience.</p>
      
      <div className="space-y-6">
        {/* Question 1: Content Effectiveness */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">💎 How effective was today's content for your business growth?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, content_effectiveness: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.content_effectiveness === rating
                    ? 'bg-yellow-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '😕' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🤩'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Not helpful</span>
            <span>Extremely valuable</span>
          </div>
        </div>

        {/* Question 2: Learning Format */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">🎯 How engaging was the learning format (videos, activities, interactions)?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, learning_format: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.learning_format === rating
                    ? 'bg-green-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '💤' : rating === 2 ? '😴' : rating === 3 ? '👍' : rating === 4 ? '🚀' : '⚡'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Boring</span>
            <span>Highly engaging</span>
          </div>
        </div>

        {/* Question 3: Recommendation */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">🤝 How likely are you to recommend this session to other Christian entrepreneurs?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, recommendation: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.recommendation === rating
                    ? 'bg-blue-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '👎' : rating === 2 ? '🤷' : rating === 3 ? '👌' : rating === 4 ? '👏' : '🙌'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Would not recommend</span>
            <span>Absolutely recommend!</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">💬 Additional Comments or Suggestions (Optional)</h5>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any specific feedback, suggestions for improvement, or what you found most valuable..."
            className="w-full p-3 bg-white/20 backdrop-blur rounded-lg text-white placeholder-white/70 border border-white/30 resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        {Object.values(surveyResponses).every(rating => rating > 0) && (
          <div className="text-center">
            <button
              onClick={submitSurvey}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg"
            >
              🙏 Submit Anonymous Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Coaching Chat Component
const AIChatInterface = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { type: 'ai', content: "Hi! I'm your faith-driven business coach. I'm here to help you apply today's session to your specific business situation. What questions do you have?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const quickPrompts = [
    "How do I apply this to my business?",
    "What if I'm just starting out?",
    "How do I balance profit and ministry?",
    "How can I share my faith without being pushy?"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = aiCoachingResponses[message] || {
        response: `Thanks for your question: "${message}". Based on today's session about Faith-Driven business foundations, remember that God has called you to create value through your work. Every business challenge is an opportunity to demonstrate His character. Consider how this situation might be an opportunity to show integrity, excellence, or servant leadership. What specific step could you take this week to apply biblical principles to this challenge?`,
        followUp: "Would you like me to elaborate on any specific aspect?"
      };

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response,
        followUp: response.followUp 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
        <h5 className="font-semibold flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          🤖 AI Faith-Business Coach
        </h5>
        <p className="text-sm text-blue-100">Context-aware coaching for today's session</p>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-sm">{message.content}</div>
              {message.followUp && (
                <div className="mt-2 text-xs opacity-75 italic">{message.followUp}</div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="text-xs font-medium text-gray-600 mb-2">Quick Questions:</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            placeholder="Ask about applying today's lesson to your business..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// BEAUTIFUL ACCORDION/SWIPE LOOKING UP SECTION
const BeautifulLookingUpSection = ({ 
  sessionData, 
  pathwayMode = 'individual', 
  onMarkComplete 
}: {
  sessionData: SessionData;
  pathwayMode: 'individual' | 'small_group';
  onMarkComplete: (section: string) => void;
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lookingUpSections = [
    {
      id: 'wealth',
      title: 'GROW Business',
      icon: '💰',
      description: 'Business Strategy & Profit',
      gradient: 'from-green-400 to-blue-500',
      hoverGradient: 'from-green-500 to-blue-600'
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: '📖',
      description: 'Curriculum Content',
      gradient: 'from-blue-400 to-indigo-500',
      hoverGradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'people',
      title: 'GROW Impact',
      icon: '👥',
      description: 'Identity & Discipleship',
      gradient: 'from-purple-400 to-pink-500',
      hoverGradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'case',
      title: 'Case Study',
      icon: '📊',
      description: 'Real Transformation',
      gradient: 'from-orange-400 to-red-500',
      hoverGradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'integrate',
      title: 'Integrating Both',
      icon: '🔗',
      description: 'Faith-Business Blend',
      gradient: 'from-teal-400 to-cyan-500',
      hoverGradient: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'coaching',
      title: 'Session Coaching',
      icon: '🎯',
      description: 'AI + Human Support',
      gradient: 'from-indigo-400 to-purple-500',
      hoverGradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'practice',
      title: 'Memory Practice',
      icon: '🧠',
      description: 'Quiz & Exercises',
      gradient: 'from-pink-400 to-rose-500',
      hoverGradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: '📚',
      description: 'Further Learning',
      gradient: 'from-emerald-400 to-green-500',
      hoverGradient: 'from-emerald-500 to-green-600'
    }
  ];

  // Smart Video URL Detection
  const getVideoUrl = (section: 'wealth' | 'people'): string | null => {
    if (!sessionData) return null;
    
    if (section === 'wealth') {
      return sessionData.video_url || null;
    }
    
    if (section === 'people') {
      return sessionData.becoming_gods_entrepreneur?.video_url || null;
    }
    
    return null;
  };

  // Render content for each section
  const renderSectionContent = (section: any) => {
    switch (section.id) {
      case 'wealth':
        const wealthVideoUrl = getVideoUrl('wealth');
        
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3">💰 GROW Business: Biblical Business Principles</h4>
              
              {wealthVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo url={wealthVideoUrl} title="GROW Business Video" />
                </div>
              ) : (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <p className="text-blue-800 font-medium mb-2">
                      📹 Business Video Available Soon
                    </p>
                    <p className="text-blue-600 text-sm">
                      Business videos are being added to this session
                    </p>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Building Wealth God's Way</h3>
                  <p className="mb-4">Discover biblical principles for creating sustainable, profitable businesses that honor God and serve others.</p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-800 font-medium">
                      📖 For detailed content and step-by-step reading, visit the <strong>Reading</strong> tab.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onMarkComplete('wealth')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              ✅ Complete GROW Business
            </button>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-800 mb-3">📖 Session Reading Content</h4>
              
              <UniversalReadingWithToggle 
                sessionData={sessionData}
                title="Session Reading" 
              />
            </div>
            <button 
              onClick={() => onMarkComplete('reading')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              ✅ Complete Reading
            </button>
          </div>
        );

      case 'people':
        const peopleVideoUrl = getVideoUrl('people');
        
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-purple-800 mb-3">👥 GROW Impact: Becoming God's Entrepreneur</h4>
              
              {peopleVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo url={peopleVideoUrl} title="GROW Impact Video" />
                </div>
              ) : (
                <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-purple-800 font-medium mb-2">
                      👥 Impact Video Status
                    </p>
                    <p className="text-purple-600 text-sm">
                      Impact videos for this module are being created and will be available soon
                    </p>
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Becoming God's Entrepreneur</h3>
                  <p className="mb-4">Transform your identity from business owner to Faith-Driven entrepreneur.</p>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-4 rounded border">
                <h5 className="font-semibold text-purple-800 mb-3">📖 Scripture Study</h5>
                <div className="border-l-4 border-blue-400 pl-4">
                  <EnhancedScriptureReference reference={sessionData.scripture_reference || "Genesis 1:26"} />
                </div>
              </div>
            </div>
            <button 
              onClick={() => onMarkComplete('people')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              ✅ Complete GROW Impact
            </button>
          </div>
        );

      case 'case':
        return (
          <div className="space-y-6">
            <UniversalCaseStudyWithToggle 
              sessionData={sessionData}
              sessionTitle={sessionData.title}
            />
            <button 
              onClick={() => onMarkComplete('case')}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              ✅ Complete Case Study
            </button>
          </div>
        );

      case 'integrate':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-400">
              <h4 className="font-bold text-teal-800 mb-3">🔗 Integrating Business & Impact</h4>
              
              {pathwayMode === 'individual' ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">💡 Personal Integration Framework</h5>
                    <ul className="space-y-2 mb-4">
                      <li><strong>Profit with Purpose:</strong> Every revenue strategy includes discipleship opportunities</li>
                      <li><strong>Excellence as Evangelism:</strong> Quality work opens doors for spiritual conversations</li>
                      <li><strong>Generosity as Growth:</strong> Giving creates space for God's provision</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">🎯 Personal Integration Planning</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">This Week's Integration Goal:</label>
                        <textarea 
                          className="w-full p-3 border rounded"
                          rows={2}
                          placeholder="How will you integrate wealth-building and people-growing in your business this week?"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">👥 Group Integration Workshop</h5>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-400 pl-4">
                        <h6 className="font-medium text-green-800">Step 1: Pair & Share (10 minutes)</h6>
                        <p className="text-sm text-gray-600">Form pairs. Each person shares their biggest business challenge and biggest ministry opportunity.</p>
                      </div>
                      
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h6 className="font-medium text-blue-800">Step 2: Group Brainstorm (15 minutes)</h6>
                        <p className="text-sm text-gray-600">Each pair presents one integration challenge to the group.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => onMarkComplete('integrate')}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors"
            >
              ✅ Complete Integration
            </button>
          </div>
        );

      case 'coaching':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">🎯 Session-Specific Coaching</h4>
              <div className="mb-6">
                <h5 className="font-semibold mb-3">🤖 AI Coaching (Available Now)</h5>
                <AIChatInterface />
              </div>
            </div>
            <button 
              onClick={() => onMarkComplete('coaching')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ✅ Complete Coaching Section
            </button>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <EnhancedQuizSection sessionData={sessionData} />
            <button 
              onClick={() => onMarkComplete('practice')}
              className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition-colors"
            >
              ✅ Complete Memory Practice
            </button>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
              <h4 className="font-bold text-emerald-800 mb-3">📚 Additional Resources & Further Reading</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    📖 Recommended Books
                  </h5>
                  <div className="space-y-3">
                    {(sessionData.resources?.books || [
                      { title: "Business for the Glory of God", author: "Wayne Grudem", url: "https://example.com/book1" },
                      { title: "The Purpose Driven Life", author: "Rick Warren", url: "https://example.com/book2" }
                    ]).map((book, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-3 py-2">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-600">by {book.author}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    🌐 Helpful Websites
                  </h5>
                  <div className="space-y-3">
                    {(sessionData.resources?.websites || [
                      { title: "IBAM Resource Center", url: "https://ibam.org/resources" },
                      { title: "Faith-Driven Business Network", url: "https://faithdrivenbusiness.org" }
                    ]).map((site, index) => (
                      <div key={index} className="border-l-4 border-green-400 pl-3 py-2">
                        <div className="font-medium">{site.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onMarkComplete('resources')}
              className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition-colors"
            >
              ✅ Complete Resources Review
            </button>
          </div>
        );

      default:
        return <div>Content loading...</div>;
    }
  };

  // Handle swipe navigation for mobile
  const handleSwipe = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSwipeIndex < lookingUpSections.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else if (direction === 'prev' && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(currentSwipeIndex - 1);
    }
  };

  // Desktop Accordion Style
  const DesktopAccordion = () => (
    <div className="space-y-4">
      {lookingUpSections.map((section, index) => (
        <div key={section.id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className={`w-full p-6 text-left transition-all duration-300 bg-gradient-to-r ${section.gradient} hover:${section.hoverGradient} text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-4">{section.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                  <p className="text-white/80 text-sm">{section.description}</p>
                </div>
              </div>
              <div className="transform transition-transform duration-200">
                {expandedSection === section.id ? 
                  <ChevronDown className="w-6 h-6" /> : 
                  <ChevronRight className="w-6 h-6" />
                }
              </div>
            </div>
          </button>
          
          {expandedSection === section.id && (
            <div className="p-6 bg-gray-50 border-t animate-in slide-in-from-top-2 duration-300">
              {renderSectionContent(section)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Mobile Swipe Carousel
  const MobileSwipeCarousel = () => {
    const currentSection = lookingUpSections[currentSwipeIndex];
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with swipe navigation */}
        <div className={`p-4 bg-gradient-to-r ${currentSection.gradient} text-white`}>
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => handleSwipe('prev')}
              disabled={currentSwipeIndex === 0}
              className="p-2 rounded-full bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            <div className="text-center">
              <span className="text-2xl block mb-1">{currentSection.icon}</span>
              <h3 className="font-bold text-lg">{currentSection.title}</h3>
              <p className="text-white/80 text-sm">{currentSection.description}</p>
            </div>
            
            <button 
              onClick={() => handleSwipe('next')}
              disabled={currentSwipeIndex === lookingUpSections.length - 1}
              className="p-2 rounded-full bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center space-x-2">
            {lookingUpSections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSwipeIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSwipeIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center mt-2 text-white/80 text-sm">
            {currentSwipeIndex + 1} of {lookingUpSections.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderSectionContent(currentSection)}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Content */}
      <div className="p-6 bg-green-50">
        {isMobile ? <MobileSwipeCarousel /> : <DesktopAccordion />}
      </div>
    </div>
  );
};

// ENHANCED: Beautiful Quiz Section with Confidence Builder Approach
const EnhancedQuizSection = ({ sessionData }: { sessionData: SessionData }) => {
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

// Main Session Page Component
export default function SessionPage({ params }: SessionPageProps) {
  const { moduleId, sessionId } = params;
  const router = useRouter();
  
  // Enhanced state management
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState({
    lookback: false,
    lookup: false,
    lookforward: false
  });
  
  const [lookingUpProgress, setLookingUpProgress] = useState({
    wealth: false,
    people: false,
    reading: false,
    case: false,
    integrate: false,
    coaching: false,
    practice: false,
    resources: false
  });
  const handleNextSession = () => {
    const moduleSessionCounts = { 1: 4, 2: 4, 3: 5, 4: 4, 5: 3 };
    const maxSessionInModule = moduleSessionCounts[parseInt(moduleId)];
    const currentSession = parseInt(sessionId);
    
    if (currentSession < maxSessionInModule) {
      window.location.href = `/modules/${moduleId}/sessions/${currentSession + 1}`;
    } else {
      const nextModule = parseInt(moduleId) + 1;
      if (nextModule <= 5) {
        window.location.href = `/modules/${nextModule}/sessions/1`;
      } else {
        window.location.href = '/dashboard';
      }
    }
  };
  
  const [pathwayMode, setPathwayMode] = useState<'individual' | 'small_group'>('individual');
  const [savedActions, setSavedActions] = useState<ActionCommitment[]>([]);
  const [sharingCommitment, setSharingCommitment] = useState('');

  // Real database connection
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add beautiful typography styles - RESTORED AND ENHANCED
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .formatted-content h1, .formatted-content h2, .formatted-content h3, 
      .formatted-content h4, .formatted-content h5, .formatted-content h6 {
        color: #1e40af !important;
        font-weight: bold !important;
        line-height: 1.3 !important;
        margin-top: 2rem !important;
        margin-bottom: 1rem !important;
      }
      .formatted-content h1 {
        font-size: 2.5rem !important;
        margin-bottom: 1.5rem !important;
      }
      .formatted-content h2 {
        font-size: 2rem !important;
        margin-bottom: 1.25rem !important;
      }
      .formatted-content h3 {
        font-size: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
      .formatted-content p {
        color: #1f2937 !important;
        line-height: 1.7 !important;
        margin-bottom: 1.5rem !important;
        font-size: 1.125rem !important;
      }
      .formatted-content ul, .formatted-content ol {
        margin-bottom: 1.5rem !important;
        margin-left: 1rem !important;
        padding-left: 1rem !important;
      }
      .formatted-content li {
        color: #1f2937 !important;
        margin-bottom: 0.75rem !important;
        font-size: 1.125rem !important;
        line-height: 1.6 !important;
      }
      .formatted-content strong {
        color: #111827 !important;
        font-weight: 600 !important;
      }
      .formatted-content em {
        color: #374151 !important;
        font-style: italic !important;
      }
      .formatted-content blockquote {
        background-color: #eff6ff !important;
        border-left: 4px solid #3b82f6 !important;
        padding: 1rem 1.5rem !important;
        margin: 1.5rem 0 !important;
        border-radius: 0 0.5rem 0.5rem 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle saved actions
  const handleSaveAction = (action: ActionCommitment) => {
    if (savedActions.length >= 4) {
      alert('Maximum 4 actions allowed per session');
      return;
    }
    setSavedActions(prev => [...prev, action]);
  };

  // Data fetching with real Supabase
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .eq('module_id', parseInt(moduleId))
          .eq('session_number', parseInt(sessionId))
          .single();

        if (fetchError) {
          console.error('Database error:', fetchError);
          setError(`Failed to load session data: ${fetchError.message}`);
          return;
        }

        if (!data) {
          setError(`Session not found: Module ${moduleId}, Session ${sessionId}`);
          return;
        }

        console.log('✅ Session data loaded:', data);
        setSessionData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to connect to database');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId && sessionId) {
      fetchSessionData();
    }
  }, [moduleId, sessionId]);

  // FIXED: Navigation functions with proper Next.js router and correct module progression
  const navigateToSession = (direction: 'prev' | 'next') => {
    const currentModuleId = sessionData?.module_id || 1;
    const currentSessionNumber = sessionData?.session_number || 1;
    
    if (direction === 'next') {
      // Module 1 has 4 sessions, Module 2 has 4 sessions
      if (currentModuleId === 1 && currentSessionNumber < 4) {
        // Stay in Module 1
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber + 1}`);
      } else if (currentModuleId === 1 && currentSessionNumber === 4) {
        // Move to Module 2 Session 1 (NOT Module 5!)
        router.push(`/modules/2/sessions/1`);
      } else if (currentModuleId === 2 && currentSessionNumber < 4) {
        // Stay in Module 2
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber + 1}`);
      } else if (currentModuleId === 2 && currentSessionNumber === 4) {
        // Move to Module 3 Session 1
        router.push(`/modules/3/sessions/1`);
      } else {
        // For other modules, increment session within module
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber + 1}`);
      }
    } else {
      // Previous direction
      if (currentSessionNumber > 1) {
        // Go to previous session in same module
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber - 1}`);
      } else if (currentModuleId > 1) {
        // Go to last session of previous module
        const prevModule = currentModuleId - 1;
        const lastSessionInPrevModule = prevModule === 1 ? 4 : 4; // Both have 4 sessions
        router.push(`/modules/${prevModule}/sessions/${lastSessionInPrevModule}`);
      }
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Handle section completion
  const markSectionComplete = (section: string) => {
    setCompletedSections(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const markLookingUpComplete = (subsection: string) => {
    setLookingUpProgress(prev => {
      const newProgress = { ...prev, [subsection]: true };
      
      // If all subsections complete, mark main section complete
      if (Object.values(newProgress).every(Boolean)) {
        setCompletedSections(current => ({ ...current, lookup: true }));
      }
      
      return newProgress;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Session...</h2>
          <p className="text-gray-600">Module {moduleId}, Session {sessionId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Looking for: Module {moduleId}, Session {sessionId}
          </p>
          <button 
            onClick={() => navigateTo(`/modules/${moduleId}`)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  // Pathway Toggle Component
  const PathwayToggle = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="font-bold text-lg mb-3 text-gray-800">🎯 Choose Your Learning Path</h3>
      <p className="text-gray-600 mb-4 text-sm">
        This choice changes your exercises, prayers, and accountability approach throughout the session.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => setPathwayMode('individual')}
          className={`flex flex-col items-start p-6 rounded-lg font-medium transition-all text-left ${
            pathwayMode === 'individual' 
              ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center mb-3">
            <User className="w-6 h-6 mr-3" />
            <span className="text-lg font-bold">Individual Study</span>
          </div>
          <ul className={`text-sm space-y-1 ${pathwayMode === 'individual' ? 'text-blue-100' : 'text-gray-600'}`}>
            <li>• Personal reflection questions</li>
            <li>• Individual prayer & meditation</li>
            <li>• Self-guided action planning</li>
            <li>• Private learning pace</li>
          </ul>
        </button>
        <button
          onClick={() => setPathwayMode('small_group')}
          className={`flex flex-col items-start p-6 rounded-lg font-medium transition-all text-left ${
            pathwayMode === 'small_group' 
              ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center mb-3">
            <Users className="w-6 h-6 mr-3" />
            <span className="text-lg font-bold">Small Group</span>
          </div>
          <ul className={`text-sm space-y-1 ${pathwayMode === 'small_group' ? 'text-purple-100' : 'text-gray-600'}`}>
            <li>• Group discussion prompts</li>
            <li>• Collaborative prayer time</li>
            <li>• Accountability partnerships</li>
            <li>• Shared learning experience</li>
          </ul>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Success Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 text-center text-sm">
        🎯 <strong>✅ UNIVERSAL TOGGLE FIX:</strong> Reading & Case Study toggles now work in ALL modules (1-5) | Same blue buttons as Module 1!
      </div>

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Faith-Driven Business Mastery → Module {sessionData.module_id} → Session {sessionData.session_number}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{sessionData.title}</h1>
            <p className="text-gray-600 mt-2">{sessionData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <VisionStatement />

        {/* Navigation Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800">🧭 Session Navigation</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button 
              onClick={() => navigateToSession('prev')}
              disabled={sessionData.session_number <= 1 && sessionData.module_id <= 1}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Session
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={() => navigateTo(`/modules/${moduleId}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                📋 Module Overview
              </button>
              <button 
                onClick={() => navigateTo('/dashboard')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                🏠 Dashboard
              </button>
            </div>
            
            <button 
              onClick={handleNextSession}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {sessionData.module_id === 1 && sessionData.session_number === 4 ? 'Module 2 →' :
               sessionData.module_id === 2 && sessionData.session_number === 4 ? 'Module 3 →' :
               'Next Session'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Pathway Toggle */}
        <PathwayToggle />

        {/* Three main sections */}
        <div className="space-y-4 mb-8">
          {/* Looking Back */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookback' ? null : 'lookback')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">👀 LOOKING BACK</h3>
                    <p className="text-blue-100">Accountability & Previous Commitments</p>
                  </div>
                </div>
                {expandedSection === 'lookback' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookback' && (
              <div className="p-6 bg-blue-50">
                <EnhancedLookingBack 
                  sessionData={sessionData}
                  pathwayMode={pathwayMode}
                  onComplete={() => markSectionComplete('lookback')}
                />
              </div>
            )}
          </div>

          {/* Looking Up with Beautiful Accordion/Swipe */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-green-500 hover:bg-green-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookup' ? null : 'lookup')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">📖 LOOKING UP</h3>
                    <p className="text-green-100">Scripture + Business Learning + Integration</p>
                  </div>
                </div>
                {expandedSection === 'lookup' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookup' && (
              <BeautifulLookingUpSection 
                sessionData={sessionData}
                pathwayMode={pathwayMode}
                onMarkComplete={markLookingUpComplete}
              />
            )}
          </div>

          {/* Looking Forward */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-orange-500 hover:bg-orange-600 text-white p-6 cursor-pointer transition-colors"
              onClick={() => setExpandedSection(expandedSection === 'lookforward' ? null : 'lookforward')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-2xl font-bold">🎯 LOOKING FORWARD</h3>
                    <p className="text-orange-100">Action Planning + Commitments + Feedback</p>
                  </div>
                </div>
                {expandedSection === 'lookforward' ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
            
            {expandedSection === 'lookforward' && (
              <div className="p-6 bg-orange-50 space-y-8">
                {/* IBAM Business Planner Integration */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">💼 IBAM Business Planner Integration</h4>
                      <p className="text-purple-100">Apply today's learning directly to your business plan</p>
                    </div>
                    <button 
                      onClick={() => navigateTo('/business-planner')}
                      className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
                    >
                      Open Business Planner →
                    </button>
                  </div>
                </div>

                {/* Action Builder Component */}
                <ActionBuilderComponent 
                  savedActions={savedActions} 
                  onSaveAction={handleSaveAction}
                  pathwayMode={pathwayMode}
                />

                {/* Saved Actions Display */}
                {savedActions.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-4">Your Saved Actions ({savedActions.length}/4)</h4>
                    <div className="space-y-3">
                      {savedActions.map((action, index) => (
                        <div key={action.id} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-700">
                              {action.type === 'business' ? '💼' : '❤️'} {action.generatedStatement}
                            </p>
                            <button 
                              onClick={() => setSavedActions(prev => prev.filter(a => a.id !== action.id))}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sharing Commitment */}
                <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-400">
                  <h4 className="font-bold text-indigo-800 mb-3">🤝 Multiplication Through Sharing</h4>
                  <p className="text-gray-700 mb-4">
                    One of the best ways to reinforce your learning is to share it with others. When you teach, you learn twice!
                  </p>
                  <div className="bg-white p-4 rounded border">
                    <label className="block font-medium text-gray-700 mb-2">
                      Who will you share today's key insights with this week? (Enter one name)
                    </label>
                    <input
                      type="text"
                      value={sharingCommitment}
                      onChange={(e) => setSharingCommitment(e.target.value)}
                      placeholder="e.g., John, Sarah, my spouse, my business partner..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      💡 This person will appear in your next session's accountability check. Feel free to share with as many people as you want, 
                      but commit to at least this one conversation.
                    </p>
                  </div>
                </div>

                {/* Anonymous Session Feedback Survey */}
                <AnonymousSessionSurvey />

                <button 
                  onClick={() => markSectionComplete('lookforward')}
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
                >
                  ✅ Complete Looking Forward
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transformation Promise */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold mb-3">✨ Your Transformation Promise</h3>
          <p className="text-lg">{sessionData.transformation_promise}</p>
        </div>
      </div>
    </div>
  );
}