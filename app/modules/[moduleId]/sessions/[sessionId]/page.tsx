'use client';

import React, { useState, useEffect, useRef } from 'react';  
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

// Mock Supabase client for demo purposes
const supabase = {
  from: (table: string) => ({
    select: (fields: string) => ({
      eq: (field: string, value: any) => ({
        single: () => Promise.resolve({
          data: mockSessionData,
          error: null
        })
      })
    })
  })
};

// Enhanced Bible Reference System  
const enhancedBibleReferences: Record<string, string> = {  
  "Genesis 1:26": "Then God said, 'Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.'",  
  "1 Peter 3:15": "But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.",  
  "Colossians 3:23": "Whatever you do, work heartily, as for the Lord and not for men,",  
  "1 Timothy 5:8": "But if anyone does not provide for his relatives, and especially for members of his household, he has denied the faith and is worse than an unbeliever.",  
  "Ephesians 4:28": "Let the thief no longer steal, but rather let him labor, doing honest work with his own hands, so that he may have something to share with anyone in need.",  
  "Luke 16:10": "One who is faithful in a very little is also faithful in much, and one who is dishonest in a very little is also dishonest in much.",  
  "Acts 16:14": "One who heard us was a woman named Lydia, from the city of Thyatira, a seller of purple goods, who was a worshiper of God. The Lord opened her heart to pay attention to what was said by Paul.",  
  "1 Thessalonians 2:9": "For you remember, brothers, our labor and toil: we worked night and day, that we might not be a burden to any of you, while we proclaimed to you the gospel of God."  
};

// Database Types - Enhanced with new fields  
interface SessionData {  
  id: string;  
  module_id: number;  
  session_number: number;  
  title: string;  
  subtitle?: string;  
  becoming_gods_entrepreneur?: { video_url?: string; };  
  content?: {  
    written_curriculum?: {  
      main_content?: string;  
      quick_version?: any;  
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
      video_url?: string;  
    };  
    growing_people?: {  
      main_content?: string;  
      video_url?: string;  
    };  
    quiz_questions?: any[];  
    faq_questions?: any[];  
    coaching_questions?: any[];  
  };  
  scripture_reference?: string;  
  video_url?: string;  
  case_study?: string;  
  business_plan_questions?: string[];  
  transformation_promise?: string;  
  resources?: {  
    books?: { title: string; author: string; url: string; }[];  
    websites?: { title: string; url: string; }[];  
    articles?: { title: string; url: string; }[];  
  };  
  created_at: string;  
  updated_at: string;  
}

// Mock session data for demo purposes
const mockSessionData = {
  id: "25",
  module_id: 2,
  session_number: 1,
  title: "Reasons for Failure - Learning from Mistakes",
  subtitle: "Transform Setbacks into Competitive Advantages",
  becoming_gods_entrepreneur: { video_url: null },
  content: {
    written_curriculum: {
      main_content: "Transform your mindset about failure from business killer to competitive advantage. Learn the Edison Principle: failure is education, not defeat. Discover the Pottery Class Wisdom: those who fail fast, learn fast, and improve fast. Master the Sailboat Principle: use opposing forces to propel you forward. Build biblical resilience through the truth that the righteous fall seven times but rise again. Develop a 5-step response strategy for turning every setback into a setup for comeback.",
      quick_version: {
        chunks: [
          {
            time: "2 Minutes",
            title: "Failure as Education, Not Death",
            content: "Thomas Edison discovered 10,000 ways NOT to make a light bulb. Each failure taught him something new. Biblical truth: The righteous fall seven times but rise again (Proverbs 24:16). Failure is not death - it is education.",
            chunk_id: 1,
            key_points: ["Edison Principle", "Biblical Truth", "Education Mindset"]
          },
          {
            time: "2 Minutes", 
            title: "The Pottery Class Revelation",
            content: "Psychology study: Class graded on QUANTITY of pots made better pots than class graded on QUALITY. Why? The quantity class failed fast, learned fast, improved fast. Take action, fail fast, learn fast.",
            chunk_id: 2,
            key_points: ["Quantity vs Quality", "Fail Fast Learn Fast", "Action Over Perfection"]
          },
          {
            time: "2 Minutes",
            title: "The Sailboat Principle", 
            content: "Sailboats use opposing winds to move forward. Your business can use opposing forces (competition, challenges, failures) to propel you forward. Turn headwinds into momentum.",
            chunk_id: 3,
            key_points: ["Opposing Forces", "Turn Challenges to Advantages", "Forward Momentum"]
          },
          {
            time: "2 Minutes",
            title: "Biblical Framework for Failure",
            content: "Scripture is full of faithful people who failed: David, Peter, Paul. God uses broken vessels. Your character is formed in the furnace of difficulty. Failure develops perseverance, character, and hope.",
            chunk_id: 4,
            key_points: ["Biblical Examples", "Character Formation", "God Uses Broken Vessels"]
          },
          {
            time: "2 Minutes",
            title: "Practical Response Strategy", 
            content: "When failure hits: 1) Stop and breathe 2) Ask What did I learn? 3) Ask How can this help me? 4) Take the next right step 5) Keep going with new wisdom. Failure is a teacher, not a verdict.",
            chunk_id: 5,
            key_points: ["5-Step Response", "Learning Questions", "Keep Moving Forward"]
          }
        ],
        total_time: "10 Minutes Total",
        description: "Core concepts for busy schedules"
      }
    },
    look_back: {
      is_first_session: false,
      previous_actions: [],
      previous_sharing_commitment: ""
    }
  },
  scripture_reference: "Proverbs 24:16",
  video_url: null,
  case_study: `
    <h3>Marcus's Lawn Care Empire - From Near-Failure to Kingdom Success</h3>
    <p>How devastating early setbacks became the foundation for a thriving business that now employs 15 people and supports 3 missionary families.</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
      <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem;">
        <h4 style="color: #dc2626; margin-bottom: 0.5rem;">🚨 The Challenge</h4>
        <p style="margin: 0;">Equipment failures, seasonal cash flow problems, and fierce competition nearly killed Marcus's lawn care business in year two.</p>
      </div>
      <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem;">
        <h4 style="color: #16a34a; margin-bottom: 0.5rem;">🎉 The Results</h4>
        <p style="margin: 0;">15 employees, 3 missionary families supported, and the strongest lawn care reputation in the county.</p>
      </div>
    </div>
    <p>Marcus learned to see each failure as education. Equipment breaking taught him about backup systems. Cash flow problems taught him about seasonal planning. Competition taught him about distinctive service. Today, Marcus's business is known for reliability, excellence, and integrity - values forged in the furnace of early failures.</p>
  `,
  business_plan_questions: [
    "How do you currently respond when business plans fail?",
    "What systems do you have for learning from mistakes?", 
    "How might your failure stories encourage other entrepreneurs?"
  ],
  transformation_promise: "Learn to transform failures into competitive advantages through biblical wisdom and practical strategies",
  resources: {
    books: [
      { title: "The Lean Startup", author: "Eric Ries", url: "https://example.com/book1" },
      { title: "Failing Forward", author: "John Maxwell", url: "https://example.com/book2" }
    ],
    websites: [
      { title: "IBAM Resource Center", url: "https://ibam.org/resources" },
      { title: "Kingdom Business Network", url: "https://kingdombusiness.org" }
    ]
  },
  created_at: "2025-06-25T21:44:24.520539",
  updated_at: "2025-06-25T21:44:24.520539"
};

interface SessionPageProps {  
  params: {  
    moduleId: string;  
    sessionId: string;  
  };  
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

// AI Message Interface - Fixed to include followUp  
interface AIMessage {  
  type: 'user' | 'ai';  
  content: string;  
  followUp?: string; // Added optional followUp property  
}

// ENHANCED VIMEO VIDEO COMPONENT WITH DEBUGGING  
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
      
    // Handle different Vimeo URL formats:  
    // https://vimeo.com/123456789/abcdef (with hash - PRIVATE VIDEOS)  
    // https://vimeo.com/123456789  
    // https://player.vimeo.com/video/123456789  
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
            <div className="bg-red-50 p-3 rounded border text-xs text-left">  
              <p className="font-medium mb-1">Expected Vimeo URL formats:</p>  
              <ul className="list-disc list-inside space-y-1">  
                <li>https://vimeo.com/123456789</li>  
                <li>https://player.vimeo.com/video/123456789</li>  
                <li>https://vimeo.com/123456789/abcdef123</li>  
              </ul>  
            </div>  
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

// FIXED: Step-by-Step Chunk Reader Component (Mobile-First)
const StepByStepChunkReader = ({ chunks, title }: { chunks: any[], title: string }) => {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const nextChunk = () => {
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
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">Excellent Work!</h3>
        <p className="text-green-700 mb-6">You've completed all reading chunks for {title}</p>
        <button 
          onClick={() => { setCurrentChunk(0); setIsCompleted(false); }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          📖 Review Again
        </button>
      </div>
    );
  }

  const chunk = chunks[currentChunk];

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">📖 {title}</h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {chunk.time || '2 Minutes'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentChunk + 1) / chunks.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span>Step {currentChunk + 1} of {chunks.length}</span>
          <span>{Math.round(((currentChunk + 1) / chunks.length) * 100)}% Complete</span>
        </div>
      </div>

      {/* Chunk Content */}
      <div className="p-6">
        {/* Chunk Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {chunk.title || `Reading Section ${currentChunk + 1}`}
        </h2>

        {/* Chunk Content */}
        {chunk.content && (
          <div className="prose prose-lg max-w-none mb-6">
            <div 
              className="text-gray-700 leading-relaxed text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: chunk.content }} 
            />
          </div>
        )}

        {/* Key Points */}
        {chunk.key_points && chunk.key_points.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">💡 Key Points:</h4>
            <ul className="space-y-2">
              {chunk.key_points.map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 font-bold mr-3 mt-1">•</span>
                  <span className="text-gray-700 text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={prevChunk}
            disabled={currentChunk === 0}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {/* Chunk Dots Navigation */}
          <div className="flex space-x-2">
            {chunks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToChunk(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentChunk 
                    ? 'bg-blue-500' 
                    : index < currentChunk 
                      ? 'bg-green-400' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextChunk}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {currentChunk === chunks.length - 1 ? 'Complete ✓' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// NEW: Enhanced Case Study Component
const EnhancedCaseStudyComponent = ({ caseStudyContent, sessionTitle }: { caseStudyContent: string; sessionTitle: string }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showQuickVersion, setShowQuickVersion] = useState(true);

  // Generate thoughtful questions based on the case study content
  const generateQuestions = () => {
    return [
      {
        id: 'challenge',
        question: `What was the biggest challenge faced in this case study, and how does it relate to your current business situation?`,
        placeholder: 'Describe the main challenge and how it connects to your experience...'
      },
      {
        id: 'application', 
        question: `Which specific strategy or principle from this case study could you implement in your business this week?`,
        placeholder: 'Name one specific action you could take...'
      },
      {
        id: 'outcome',
        question: `If you applied the same faith-driven approach, what positive outcome would you most hope to see in your business?`,
        placeholder: 'Describe your hoped-for result...'
      }
    ];
  };

  const questions = generateQuestions();

  const updateAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  return (
    <div className="space-y-6">
      {/* Reading Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowQuickVersion(true)}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            showQuickVersion 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Zap className="w-4 h-4 mr-2" />
          Quick Overview (5 min)
        </button>
        <button
          onClick={() => setShowQuickVersion(false)}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            !showQuickVersion 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Full Case Study (15 min)
        </button>
      </div>

      {/* Case Study Content */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">📊 Real Business Transformation</h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {showQuickVersion ? '5 Minutes' : '15 Minutes'}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {showQuickVersion ? (
            // Quick Overview
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h4 className="font-semibold text-blue-800 mb-2">⚡ Quick Summary</h4>
                <p className="text-gray-700 leading-relaxed">
                  This case study demonstrates how biblical business principles led to both financial success and Kingdom impact. 
                  The transformation shows practical steps you can apply in your own business journey.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">🚨 The Challenge</h5>
                  <p className="text-gray-700 text-sm">Struggling with profitability and purpose alignment</p>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">🎉 The Results</h5>
                  <p className="text-gray-700 text-sm">40% revenue increase + Kingdom impact</p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowQuickVersion(false)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  📖 Read Full Case Study
                </button>
              </div>
            </div>
          ) : (
            // Full Case Study
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: caseStudyContent }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Questions */}
      {!showQuickVersion && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            💭 Reflection Questions
          </h4>
          <p className="text-purple-700 mb-6">
            Take a few minutes to reflect on how this case study applies to your business journey:
          </p>
          
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-lg p-5 border border-purple-200">
                <h5 className="font-semibold text-gray-800 mb-3">
                  {index + 1}. {q.question}
                </h5>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            ))}
          </div>
          
          {Object.keys(answers).length > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Great work on your reflections! These insights will help you apply the case study lessons to your own business.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
    response: "This is a false dichotomy many Christians struggle with! Profit and ministry work together when done biblically. Profit provides resources for generosity, family provision, and ministry support. The key is pursuing profit through biblical means (integrity, excellence, service) and using profit for biblical purposes. A profitable business can fund far more ministry than a struggling one. Think of profit as the fuel for your Kingdom impact, not the enemy of it.",  
    followUp: "What ministry opportunities are you sensing God wants to fund through your business success?"  
  },  
  "How can I share my faith without being pushy?": {  
    response: "The most powerful witness is consistent Christian character demonstrated through your business practices. Let your integrity, generosity, and excellence speak first. Build genuine relationships with customers and employees. When people ask about your motivation or values, share naturally. Your business can become a lighthouse in your community - people will be drawn to the light they see in how you operate.",  
    followUp: "What opportunities for natural conversation do you see in your current business interactions?"  
  }  
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
        response: `Thanks for your question: "${message}". Based on today's session about Kingdom business foundations, remember that God has called you to create value through your work. Every business challenge is an opportunity to demonstrate His character. Consider how this situation might be an opportunity to show integrity, excellence, or servant leadership. What specific step could you take this week to apply biblical principles to this challenge?`,  
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

// Enhanced Looking Back Component  
const EnhancedLookingBack = ({ sessionData, pathwayMode, onComplete }: {  
  sessionData: SessionData;  
  pathwayMode: 'individual' | 'small_group';  
  onComplete: () => void;  
}) => {  
  const [actionReviews, setActionReviews] = useState<Record<string, any>>({});  
  // Fixed: Changed sharingExperience to allow boolean | null for happened property  
  const [sharingExperience, setSharingExperience] = useState<{  
    happened: boolean | null;  
    experience: string;  
    celebration: string;  
  }>({  
    happened: null,  
    experience: '',  
    celebration: ''  
  });  
  const [prayerCompleted, setPrayerCompleted] = useState(false);

  const isFirstSession = sessionData.content?.look_back?.is_first_session || sessionData.session_number === 1;  
  const previousActions = sessionData.content?.look_back?.previous_actions || [];  
  const previousSharingCommitment = sessionData.content?.look_back?.previous_sharing_commitment;

  const failureReasons = [  
    "Didn't schedule specific time",  
    "Other priorities took over",   
    "Felt uncomfortable/nervous",  
    "Lacked necessary resources",  
    "Underestimated time needed",  
    "External circumstances changed",  
    "Need to develop skills first",  
    "Other (please specify)"  
  ];

  const completionOptions = [  
    { value: 100, label: "✅ Completely accomplished", color: "green" },  
    { value: 75, label: "🎯 Mostly accomplished", color: "blue" },  
    { value: 50, label: "⚡ Partially accomplished", color: "yellow" },  
    { value: 25, label: "🌱 Started but didn't finish", color: "orange" },  
    { value: 0, label: "❌ Didn't attempt", color: "red" }  
  ];

  const updateActionReview = (actionId: string, field: string, value: any) => {  
    setActionReviews(prev => ({  
      ...prev,  
      [actionId]: {  
        ...prev[actionId],  
        [field]: value  
      }  
    }));  
  };

  const getMotivationalMessage = (percentage: number) => {  
    if (percentage >= 75) {  
      return "🎉 Excellent work! You're developing the discipline that leads to Kingdom impact. As Galatians 6:9 says, 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.'";  
    } else if (percentage >= 50) {  
      return "👏 Great progress! You're learning to be faithful in small things, which Luke 16:10 tells us leads to faithfulness in much. Keep building these habits!";  
    } else if (percentage >= 25) {  
      return "🌱 You took the first step, and that matters! Even small beginnings can lead to great things. Remember, 'faith as small as a mustard seed can move mountains' (Matthew 17:20).";  
    } else {  
      return "💪 This is how we grow! Every successful entrepreneur has faced setbacks. What matters is what you learn and how you adjust. Romans 8:28 reminds us that God works all things together for good for those who love Him.";  
    }  
  };

  const marketplacePrayer = `  
    Heavenly Father, as I begin this time of reflection and learning, I thank You for creating me in Your image with the ability to create value and serve others through my work.   
      
    Help me to see my business not just as a means of provision, but as a platform for Your Kingdom. Give me wisdom to integrate my faith with my work in ways that honor You and bless others.  
      
    As I review my previous commitments and plan new steps, grant me the humility to learn from both successes and failures. Help me to be faithful in small things, knowing that You are preparing me for greater impact.  
      
    May my business be a reflection of Your character - marked by integrity, excellence, generosity, and love. Use me to multiply disciples in the marketplace and to demonstrate Your love through how I serve customers, treat employees, and conduct business.  
      
    In Jesus' name, Amen.  
  `;

  if (isFirstSession) {  
    return (  
      <div className="space-y-6">  
        {/* Opening Prayer */}  
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">  
          <h4 className="font-bold text-blue-800 mb-3 flex items-center">  
            🙏 Opening Prayer  
          </h4>  
          <div className="bg-white p-4 rounded-lg mb-4">  
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">  
              {marketplacePrayer}  
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

        {/* First Session Celebration */}  
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg">  
          <div className="text-center">  
            <div className="text-4xl mb-4">🎉</div>  
            <h4 className="text-xl font-bold mb-3">Congratulations on Starting Your Journey!</h4>  
            <p className="text-green-100 mb-4">  
              You've taken a significant step by enrolling in this faith-driven business training and completing your first session.   
              This shows your heart for integrating your faith with your work!  
            </p>  
          </div>  
        </div>

        {/* Purpose Explanation */}  
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">  
          <h4 className="font-bold text-yellow-800 mb-3">📋 The Power of Looking Back & Looking Forward</h4>  
          <div className="space-y-3 text-gray-700">  
            <p>  
              <strong>Looking Back</strong> helps you celebrate wins, learn from setbacks, and track your growth.   
              It's not about perfection—it's about faithful progress.  
            </p>  
            <p>  
              <strong>Looking Forward</strong> turns insights into specific actions. This habit exponentially increases your likelihood of success   
              because you're moving from good intentions to concrete commitments.  
            </p>  
            <p>  
              <strong>Sharing Your Experience</strong> multiplies your learning and creates accountability. When you teach others,   
              you reinforce your own understanding and help others grow too.  
            </p>  
            <div className="bg-white p-4 rounded border-l-4 border-green-400 mt-4">  
              <p className="font-medium text-green-800">  
                🎯 Studies show that people who write down goals and share them with others are 42% more likely to achieve them!  
              </p>  
            </div>  
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

  // Regular session (not first)  
  return (  
    <div className="space-y-6">  
      {/* Opening Prayer */}  
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">  
        <h4 className="font-bold text-blue-800 mb-3 flex items-center">  
          🙏 Opening Prayer for Marketplace Growth  
        </h4>  
        <div className="bg-white p-4 rounded-lg mb-4">  
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">  
            {marketplacePrayer}  
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

      <button   
        onClick={onComplete}  
        disabled={!prayerCompleted}  
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"  
      >  
        ✅ Complete Looking Back  
      </button>  
    </div>  
  );  
};

// Progress Tracking Component  
const ProgressIndicator = ({ completedSections, lookingUpProgress, onShowDetails }: {  
  completedSections: Record<string, boolean>;  
  lookingUpProgress: Record<string, boolean>;  
  onShowDetails: () => void;  
}) => {  
  const totalSections = 3; // Looking Back, Looking Up, Looking Forward  
  const lookingUpSubsections = 8; // Added Reading tab = 8 total now
    
  const mainSectionsComplete = Object.values(completedSections).filter(Boolean).length;  
  const lookingUpComplete = Object.values(lookingUpProgress).filter(Boolean).length;  
    
  const overallProgress = Math.round(((mainSectionsComplete * 33.33) +   
    (completedSections.lookup ? (lookingUpComplete / lookingUpSubsections) * 33.33 : 0)) / 100 * 100);

  return (  
    <div className="fixed top-4 right-4 z-50">  
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs">  
        <div className="flex items-center justify-between mb-2">  
          <span className="font-semibold text-gray-800">Session Progress</span>  
          <button   
            onClick={onShowDetails}  
            className="text-blue-600 hover:text-blue-800 text-sm underline"  
          >  
            Details  
          </button>  
        </div>  
          
        <div className="mb-2">  
          <div className="flex justify-between text-sm text-gray-600 mb-1">  
            <span>Overall</span>  
            <span>{overallProgress}%</span>  
          </div>  
          <div className="w-full bg-gray-200 rounded-full h-2">  
            <div   
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"  
              style={{ width: `${overallProgress}%` }}  
            ></div>  
          </div>  
        </div>

        <div className="space-y-1 text-sm">  
          <div className={`flex items-center ${completedSections.lookback ? 'text-green-600' : 'text-gray-400'}`}>  
            {completedSections.lookback ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}  
            Looking Back  
          </div>  
          <div className={`flex items-center ${completedSections.lookup ? 'text-green-600' : 'text-gray-600'}`}>  
            {completedSections.lookup ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}  
            Looking Up ({lookingUpComplete}/{lookingUpSubsections})  
          </div>  
          <div className={`flex items-center ${completedSections.lookforward ? 'text-green-600' : 'text-gray-400'}`}>  
            {completedSections.lookforward ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}  
            Looking Forward  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};

// Progress Details Modal  
const ProgressModal = ({ isOpen, onClose, completedSections, lookingUpProgress }: {  
  isOpen: boolean;  
  onClose: () => void;  
  completedSections: Record<string, boolean>;  
  lookingUpProgress: Record<string, boolean>;  
}) => {  
  if (!isOpen) return null;

  const lookingUpSections = [  
    { key: 'wealth', label: 'Growing Wealth', icon: '💰' },  
    { key: 'people', label: 'Growing People', icon: '👥' },  
    { key: 'reading', label: 'Reading', icon: '📖' },  // ADDED BACK
    { key: 'case', label: 'Case Study', icon: '📊' },  
    { key: 'integrate', label: 'Integrating Both', icon: '🔗' },  
    { key: 'coaching', label: 'Session Coaching', icon: '🎯' },  
    { key: 'practice', label: 'Memory Practice', icon: '🧠' },  
    { key: 'resources', label: 'Resources', icon: '📚' }  
  ];

  const canProceed = Object.values(completedSections).every(Boolean) &&   
                    Object.values(lookingUpProgress).every(Boolean);

  return (  
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">  
      <div className="bg-white rounded-xl max-w-md w-full p-6">  
        <div className="flex justify-between items-center mb-4">  
          <h3 className="text-lg font-bold text-gray-800">📋 Session Completion Status</h3>  
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">  
            <X className="w-5 h-5" />  
          </button>  
        </div>

        <div className="space-y-4">  
          {/* Main Sections */}  
          <div>  
            <h4 className="font-semibold text-gray-700 mb-2">Main Sections</h4>  
            <div className="space-y-2">  
              {Object.entries(completedSections).map(([key, completed]) => (  
                <div key={key} className={`flex items-center p-2 rounded ${completed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>  
                  {completed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}  
                  <span className="capitalize">  
                    {key === 'lookback' ? 'Looking Back' : key === 'lookup' ? 'Looking Up' : 'Looking Forward'}  
                  </span>  
                </div>  
              ))}  
            </div>  
          </div>

          {/* Looking Up Subsections */}  
          <div>  
            <h4 className="font-semibold text-gray-700 mb-2">Looking Up Subsections</h4>  
            <div className="space-y-1">  
              {lookingUpSections.map((section) => (  
                <div key={section.key} className={`flex items-center p-2 rounded text-sm ${  
                  lookingUpProgress[section.key] ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'  
                }`}>  
                  {lookingUpProgress[section.key] ? <CheckCircle2 className="w-3 h-3 mr-2" /> : <Circle className="w-3 h-3 mr-2" />}  
                  <span className="mr-2">{section.icon}</span>  
                  <span>{section.label}</span>  
                </div>  
              ))}  
            </div>  
          </div>

          {/* Next Steps */}  
          <div className="bg-blue-50 p-4 rounded-lg">  
            {canProceed ? (  
              <div className="text-green-700">  
                <CheckCircle2 className="w-5 h-5 inline mr-2" />  
                <strong>Ready to proceed!</strong> You've completed all sections.  
              </div>  
            ) : (  
              <div className="text-blue-700">  
                <Circle className="w-5 h-5 inline mr-2" />  
                <strong>Complete remaining sections</strong> before moving to the next session.  
              </div>  
            )}  
          </div>  
        </div>

        <div className="flex gap-3 mt-6">  
          <button   
            onClick={onClose}  
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"  
          >  
            Continue Learning  
          </button>  
          {canProceed && (  
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">  
              Next Session →  
            </button>  
          )}  
        </div>  
      </div>  
    </div>  
  );  
};

// Action Builder Component (Enhanced V1 Version)  
const ActionBuilderComponent = ({ savedActions, onSaveAction }: {  
  savedActions: ActionCommitment[];  
  onSaveAction: (action: ActionCommitment) => void;  
}) => {  
  const [actionType, setActionType] = useState<'business' | 'discipleship' | ''>('');  
  const [helpPopup, setHelpPopup] = useState({  
    isOpen: false,  
    title: '',  
    content: ''  
  });  
    
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
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Create Your Action Commitments</h4>  
        <p className="text-gray-600">  
          Transform today's learning into specific, achievable actions. Choose at least 1 action, up to 4 total.  
        </p>  
      </div>

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

export default function SessionPage({ params = { moduleId: "2", sessionId: "1" } }: { params?: SessionPageProps['params'] }) {  
  const { moduleId, sessionId } = params;  
    
  // Enhanced state management  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);  
  const [activeTab, setActiveTab] = useState(0);  
  const [completedSections, setCompletedSections] = useState({  
    lookback: false,  
    lookup: false,  
    lookforward: false  
  });  
  
  // FIXED: Added 'reading' to lookingUpProgress - this was missing!
  const [lookingUpProgress, setLookingUpProgress] = useState({  
    wealth: false,  
    people: false,  
    reading: false,  // ADDED BACK - this was missing!
    case: false,  
    integrate: false,  
    coaching: false,  
    practice: false,  
    resources: false  
  });  
  
  const [pathwayMode, setPathwayMode] = useState<'individual' | 'small_group'>('individual');  
  const [readingMode, setReadingMode] = useState<'quick' | 'normal'>('normal');  
  const [savedActions, setSavedActions] = useState<ActionCommitment[]>([]);  
  const [sharingCommitment, setSharingCommitment] = useState('');  
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Use mock data instead of fetching from database
  const [sessionData, setSessionData] = useState<SessionData | null>(mockSessionData);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);

  // Navigation functions  
  const navigateToSession = (direction: 'prev' | 'next') => {  
    const targetSession = direction === 'next'   
      ? (sessionData?.session_number || 1) + 1   
      : (sessionData?.session_number || 1) - 1;  
      
    alert(`Would navigate to Module ${moduleId}, Session ${targetSession}`);  
  };

  const navigateTo = (path: string) => {  
    alert(`Would navigate to ${path}`);  
  };

  // FIXED: Updated Looking Up subsections to include Reading tab
  const lookingUpSections = [  
    {   
      id: 'wealth',   
      title: 'Growing Wealth',   
      icon: '💰',  
      description: 'Business Strategy & Profit'  
    },  
    {   
      id: 'people',   
      title: 'Growing People',   
      icon: '👥',  
      description: 'Identity & Discipleship'  
    },  
    {   
      id: 'reading',   
      title: 'Reading',   
      icon: '📖',  
      description: 'Curriculum Content'  
    },
    {   
      id: 'case',   
      title: 'Case Study',   
      icon: '📊',  
      description: 'Real Transformation'  
    },  
    {   
      id: 'integrate',   
      title: 'Integrating Both',   
      icon: '🔗',  
      description: 'Faith-Business Blend'  
    },  
    {   
      id: 'coaching',   
      title: 'Session Coaching',   
      icon: '🎯',  
      description: 'AI + Human Support'  
    },  
    {   
      id: 'practice',   
      title: 'Memory Practice',   
      icon: '🧠',  
      description: 'Quiz & Exercises'  
    },  
    {   
      id: 'resources',   
      title: 'Resources',   
      icon: '📚',  
      description: 'Further Learning'  
    }  
  ];

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

  // Handle saved actions  
  const handleSaveAction = (action: ActionCommitment) => {  
    if (savedActions.length >= 4) {  
      alert('Maximum 4 actions allowed per session');  
      return;  
    }  
    setSavedActions(prev => [...prev, action]);  
  };

  // FIXED: Smart Video URL Detection - checks BOTH video fields
  const getVideoUrl = (section: 'wealth' | 'people'): string | null => {
    if (!sessionData) return null;
    
    if (section === 'wealth') {
      // For Growing Wealth, check multiple possible video fields
      const wealthVideo = sessionData.video_url || 
                         sessionData.content?.growing_wealth?.video_url;
      
      console.log(`🎥 Growing Wealth video check:`, {
        main_video_url: sessionData.video_url,
        content_video_url: sessionData.content?.growing_wealth?.video_url,
        selected: wealthVideo
      });
      
      return wealthVideo || null;
    }
    
    if (section === 'people') {
      // For Growing People, check the specific field
      const peopleVideo = sessionData.becoming_gods_entrepreneur?.video_url;
      
      console.log(`🎥 Growing People video check:`, {
        becoming_gods_entrepreneur_video: peopleVideo
      });
      
      return peopleVideo || null;
    }
    
    return null;
  };

  // FIXED: Complete Tab Content Renderer with Reading Tab
  const renderTabContent = () => {
    if (!sessionData) {
      return <div className="text-center p-8 text-gray-500">Loading session data...</div>;
    }

    const currentSection = lookingUpSections[activeTab];
      
    switch (currentSection.id) {
      case 'wealth':
        const wealthVideoUrl = getVideoUrl('wealth');
        
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3">💰 Growing Wealth: Biblical Business Principles</h4>
              
              {/* FIXED: Smart video detection */}
              {wealthVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo 
                    url={wealthVideoUrl} 
                    title="Growing Wealth Video" 
                  />
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center">
                    📹 Video content will be available when uploaded to the database
                  </p>
                </div>
              )}
              
              {/* Brief overview - detailed content is in Reading tab */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Building Wealth God's Way</h3>
                  <p className="mb-4">Discover biblical principles for creating sustainable, profitable businesses that honor God and serve others.</p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-800 font-medium">
                      📖 For detailed content and step-by-step reading, visit the <strong>Reading</strong> tab above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => markLookingUpComplete('wealth')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              ✅ Complete Growing Wealth
            </button>
          </div>
        );
          
      case 'people':
        const peopleVideoUrl = getVideoUrl('people');
        
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-purple-800 mb-3">👥 Growing People: Becoming God's Entrepreneur</h4>
              
              {/* FIXED: Smart video detection */}
              {peopleVideoUrl ? (
                <div className="mb-6">
                  <VimeoVideo 
                    url={peopleVideoUrl} 
                    title="Becoming God's Entrepreneur" 
                  />
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center">
                    📹 Video content will be available when uploaded to the database
                  </p>
                </div>
              )}
              
              {/* Brief overview */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <h3 className="text-xl font-semibold mb-3">Becoming God's Entrepreneur</h3>
                  <p className="mb-4">Transform your identity from business owner to Kingdom entrepreneur.</p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-800 font-medium">
                      📖 For detailed content and step-by-step reading, visit the <strong>Reading</strong> tab above.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Scripture Study */}
              <div className="mt-6 bg-white p-4 rounded border">
                <h5 className="font-semibold text-purple-800 mb-3">📖 Scripture Study</h5>
                <div className="border-l-4 border-blue-400 pl-4">
                  <EnhancedScriptureReference reference={sessionData.scripture_reference || "Genesis 1:26"} />
                </div>
              </div>
            </div>
            <button 
              onClick={() => markLookingUpComplete('people')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              ✅ Complete Growing People
            </button>
          </div>
        );

      // NEW: Reading Tab with Step-by-Step Chunks
      case 'reading':
        const quickVersionData = sessionData.content?.written_curriculum?.quick_version;
        const chunks = quickVersionData?.chunks || [];
        
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-800 mb-3">📖 Session Reading Content</h4>
              
              {/* Reading Mode Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setReadingMode('quick')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    readingMode === 'quick'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Read (10 min)
                </button>
                <button
                  onClick={() => setReadingMode('normal')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    readingMode === 'normal'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Full Content (25 min)
                </button>
              </div>

              {/* FIXED: Render the StepByStepChunkReader */}
              {readingMode === 'quick' && chunks.length > 0 ? (
                <StepByStepChunkReader 
                  chunks={chunks} 
                  title="Quick Reading" 
                />
              ) : readingMode === 'normal' ? (
                <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                    <h3 className="text-xl font-bold">📖 Full Content</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="prose prose-lg max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        style={{ fontSize: '1.125rem', lineHeight: '1.75' }}
                        dangerouslySetInnerHTML={{ 
                          __html: sessionData.content?.written_curriculum?.main_content || 
                          "<h2>Content will be displayed here based on your selection.</h2><p>Please navigate to review the session curriculum content.</p>"
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Reading Chunks Available</h3>
                  <p className="text-yellow-700">This session's reading content is being prepared in chunk format.</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => markLookingUpComplete('reading')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              ✅ Complete Reading
            </button>
          </div>
        );
          
      case 'case':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-bold text-orange-800 mb-3">📊 Case Study: Real Business Transformation</h4>
              
              {/* NEW: Enhanced Case Study Component */}
              <EnhancedCaseStudyComponent 
                caseStudyContent={sessionData.case_study || `
                  <h3>Case Study: Business Transformation</h3>
                  <p>This case study demonstrates how biblical business principles create both financial success and Kingdom impact.</p>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem;">
                      <h4 style="color: #dc2626; margin-bottom: 0.5rem;">🚨 The Challenge</h4>
                      <p style="margin: 0;">Inconsistent profits and unclear business direction</p>
                    </div>
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem;">
                      <h4 style="color: #16a34a; margin-bottom: 0.5rem;">🎉 The Results</h4>
                      <p style="margin: 0;">40% revenue increase + Kingdom impact</p>
                    </div>
                  </div>
                  <p>The transformation process demonstrates how faith-driven business practices create sustainable success.</p>
                `}
                sessionTitle={sessionData.title}
              />
            </div>
            <button 
              onClick={() => markLookingUpComplete('case')}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              ✅ Complete Case Study
            </button>
          </div>
        );

      case 'integrate':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-800 mb-3">🔗 Integrating Wealth & People</h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-2">💡 Integration Framework</h5>
                  <ul className="space-y-2">
                    <li><strong>Profit with Purpose:</strong> Every revenue strategy includes discipleship opportunities</li>
                    <li><strong>Excellence as Evangelism:</strong> Quality work opens doors for spiritual conversations</li>
                    <li><strong>Generosity as Growth:</strong> Giving creates space for God's provision</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-2">🎯 Weekly Integration Practice</h5>
                  <textarea 
                    className="w-full p-3 border rounded"
                    rows={3}
                    placeholder="How will you integrate wealth-building and people-growing in your business this week?"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => markLookingUpComplete('integrate')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
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
              onClick={() => markLookingUpComplete('coaching')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ✅ Complete Coaching Section
            </button>
          </div>
        );
          
      case 'practice':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
              <h4 className="font-bold text-indigo-800 mb-3">🧠 Memory Reinforcement Practice</h4>
              <div className="bg-white rounded-lg border p-6">
                <h5 className="font-semibold mb-4">📝 Knowledge Check Quiz</h5>
                <div className="border rounded p-4">
                  <h6 className="font-semibold mb-3">1. What is the primary purpose of business according to Genesis 1:26?</h6>
                  <div className="space-y-2">
                    {['To make money', 'To exercise dominion and create value', 'To avoid work', 'To compete with others'].map((option, idx) => (
                      <label key={idx} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input type="radio" name="q1" value={idx} className="mr-3" />
                        {option}
                      </label>
                    ))}
                  </div>
                  <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                    Submit Quiz
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => markLookingUpComplete('practice')}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              ✅ Complete Memory Practice
            </button>
          </div>
        );
          
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-400">
              <h4 className="font-bold text-teal-800 mb-3">📚 Additional Resources & Further Reading</h4>
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
                        <a href={book.url} className="text-blue-600 hover:underline text-sm flex items-center mt-1">
                          Learn More <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Link2 className="w-5 h-5 mr-2" />
                    🌐 Helpful Websites
                  </h5>
                  <div className="space-y-3">
                    {(sessionData.resources?.websites || [
                      { title: "IBAM Resource Center", url: "https://ibam.org/resources" },
                      { title: "Kingdom Business Network", url: "https://kingdombusiness.org" }
                    ]).map((site, index) => (
                      <div key={index} className="border-l-4 border-green-400 pl-3 py-2">
                        <div className="font-medium">{site.title}</div>
                        <a href={site.url} className="text-green-600 hover:underline text-sm flex items-center mt-1">
                          Visit Site <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => markLookingUpComplete('resources')}
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors"
            >
              ✅ Complete Resources Review
            </button>
          </div>
        );
          
      default:
        return <div>Content loading...</div>;
    }
  };

  // Loading state  
  if (loading) {  
    return (  
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">  
        <div className="text-center">  
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>  
          <p className="text-gray-600">Loading session content...</p>  
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
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">  
      <h3 className="font-bold text-lg mb-3 text-gray-800">🎯 Choose Your Learning Path</h3>  
      <div className="flex gap-4">  
        <button  
          onClick={() => setPathwayMode('individual')}  
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${  
            pathwayMode === 'individual'   
              ? 'bg-blue-600 text-white shadow-lg'   
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'  
          }`}  
        >  
          <User className="w-5 h-5 mr-2" />  
          Individual Study  
        </button>  
        <button  
          onClick={() => setPathwayMode('small_group')}  
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${  
            pathwayMode === 'small_group'   
              ? 'bg-purple-600 text-white shadow-lg'   
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'  
          }`}  
        >  
          <Users className="w-5 h-5 mr-2" />  
          Small Group  
        </button>  
      </div>  
    </div>  
  );

  return (  
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">  
      {/* Progress Indicator */}  
      <ProgressIndicator   
        completedSections={completedSections}  
        lookingUpProgress={lookingUpProgress}  
        onShowDetails={() => setShowProgressModal(true)}  
      />

      {/* Progress Modal */}  
      <ProgressModal   
        isOpen={showProgressModal}  
        onClose={() => setShowProgressModal(false)}  
        completedSections={completedSections}  
        lookingUpProgress={lookingUpProgress}  
      />

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
              disabled={sessionData.session_number <= 1}  
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
              onClick={() => navigateToSession('next')}  
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"  
            >  
              Next Session  
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

          {/* Looking Up with Tabs */}  
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
              <div>  
                {/* Desktop Tabs */}  
                <div className="hidden md:block border-b bg-green-50">  
                  <div className="flex overflow-x-auto">  
                    {lookingUpSections.map((section, index) => (  
                      <button  
                        key={section.id}  
                        onClick={() => setActiveTab(index)}  
                        className={`px-4 py-3 font-medium whitespace-nowrap transition-colors min-w-0 flex-shrink-0 ${  
                          activeTab === index   
                            ? 'border-b-2 border-green-500 text-green-700 bg-white'   
                            : 'text-gray-600 hover:text-gray-800 hover:bg-green-100'  
                        }`}  
                      >  
                        <span className="mr-2">{section.icon}</span>  
                        <span className="hidden lg:inline">{section.title}</span>  
                        <span className="lg:hidden">{section.title.split(' ')[0]}</span>  
                      </button>  
                    ))}  
                  </div>  
                </div>  
                  
                {/* Mobile Cards */}  
                <div className="md:hidden bg-green-50">  
                  <div className="p-4 space-y-2">  
                    {lookingUpSections.map((section, index) => (  
                      <div key={section.id} className={`border rounded-lg overflow-hidden ${  
                        activeTab === index ? 'border-green-500 bg-white' : 'border-gray-200 bg-gray-50'  
                      }`}>  
                        <button  
                          onClick={() => setActiveTab(activeTab === index ? -1 : index)}  
                          className="w-full p-4 text-left flex items-center justify-between"  
                        >  
                          <div className="flex items-center">  
                            <span className="text-2xl mr-3">{section.icon}</span>  
                            <div>  
                              <div className="font-semibold">{section.title}</div>  
                              <div className="text-sm text-gray-600">{section.description}</div>  
                            </div>  
                          </div>  
                          {activeTab === index ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}  
                        </button>  
                        {activeTab === index && (  
                          <div className="border-t p-4 bg-white">  
                            {renderTabContent()}  
                          </div>  
                        )}  
                      </div>  
                    ))}  
                  </div>  
                </div>

                {/* Desktop Tab Content */}  
                <div className="hidden md:block p-6 bg-white">  
                  {renderTabContent()}  
                </div>  
              </div>  
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
                <ActionBuilderComponent savedActions={savedActions} onSaveAction={handleSaveAction} />

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