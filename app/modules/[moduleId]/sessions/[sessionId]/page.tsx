'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useCallback, useRef } from 'react';
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

// Add these lines here:
import type { 
  SessionData, 
  SessionPageProps, 
  ReadingChunk, 
  ActionCommitment, 
  PreviousAction, 
  AIMessage, 
  ActionStep,
  PathwayMode,
  SectionCompletionState,
  LookingUpProgressState,
  AutoSaveHookReturn
} from '../../../../lib/types';

import { 
  enhancedBibleReferences,
  aiCoachingResponses,
  biblicalMotivationalMessages,
  pathwayPrayers,
  inspiringSectionTitles
} from '../../../../lib/constants';

import { VimeoVideo } from '../../../../components/video/VimeoVideo';
import AIChatInterface from '../../../../components/coaching/AIChatInterface';
import { calculateReadingTime, parseMainContentIntoChunks, extractKeyPoints } from '../../../../lib/utils';
import AnonymousSessionSurvey from '../../../../components/feedback/AnonymousSessionSurvey';
import ActionBuilderComponent from '../../../../components/actions/ActionBuilderComponent';
import EnhancedScriptureReference from '../../../../components/scripture/EnhancedScriptureReference';
import VisionStatement from '../../../../components/common/VisionStatement';
import EnhancedQuizSection from '../../../../components/quiz/EnhancedQuizSection';
import EnhancedReadingChunks from '../../../../components/reading/EnhancedReadingChunks';
import UniversalReadingWithToggle from '../../../../components/reading/UniversalReadingWithToggle';
import EnhancedLookingBack from '../../../../components/sections/LookingBack/EnhancedLookingBack';
import BeautifulLookingUpSection from '../../../../components/sections/LookingUp/BeautifulLookingUpSection';
import LookingForwardSection from '../../../../components/sections/LookingForward/LookingForwardSection';
import BeautifulCaseStudyComponent from '../../../../components/case-study/BeautifulCaseStudyComponent';
// Real Supabase client
const supabase = createClientComponentClient();

// Database Types - Enhanced with new fields

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


// Enhanced Action Step Accountability System


// AUTO-SAVE HOOK FUNCTION  
const useAutoSave = (sessionData, savedActions, caseAnswers, sharingCommitment) => {
  const [saveStatus, setSaveStatus] = useState('idle');
const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const supabase = createClientComponentClient();

  const saveAllUserData = useCallback(async () => {
      console.log('🔥 saveAllUserData called!', { sessionData, savedActions }); // ADD THIS LINE
  if (!sessionData || savedActions.length === 0) return;
    
    try {
      setSaveStatus('saving');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for (const action of savedActions) {     
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for (const action of savedActions) {
        await supabase.from('user_action_steps').upsert({
          user_id: user?.id || '550e8400-e29b-41d4-a716-446655440000',
          module_id: sessionData.module_id,
// NEW (matches database):
          session_id: sessionData.session_number,
          action_type: action.type,
          specific_action: action.smartData?.specific || action.generatedStatement || 'No description',
          timed: action.smartData?.timed || 'No time specified',
          generated_statement: action.generatedStatement,
          person_to_tell: sharingCommitment,
          completed: false,
          created_at: new Date().toISOString()
        });
      }
        await supabase.from('user_action_steps').upsert({
          user_id: user?.id || '550e8400-e29b-41d4-a716-446655440000',
          module_id: sessionData.module_id,
// NEW (matches database):
          session_id: sessionData.session_number,
          action_type: action.type,
          specific_action: action.smartData?.specific || action.generatedStatement || 'No description',
          timed: action.smartData?.timed || 'No time specified',
          generated_statement: action.generatedStatement,
          person_to_tell: sharingCommitment,
          completed: false,
          created_at: new Date().toISOString()
        });
      }

      setSaveStatus('saved');
      setLastSaved(new Date());
      console.log('✅ Actions saved!');
      
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    }
  }, [sessionData, savedActions, sharingCommitment, supabase]);

  return { saveStatus, lastSaved, saveNow: saveAllUserData };
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
  const [actionsLoaded, setActionsLoaded] = useState(false);

  const [sharingCommitment, setSharingCommitment] = useState('');

  // Real database connection
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ADD AUTO-SAVE HOOK
const { saveStatus, lastSaved, saveNow } = useAutoSave(sessionData, savedActions, {}, sharingCommitment);

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
// Direct action save function
const saveActionToDatabase = async (action: ActionCommitment) => {
  try {
console.log('💾 Saving single action:', action);
console.log('🔍 Action details:', {
  id: action.id,
  type: action.type,
  smartData: action.smartData,
  generatedStatement: action.generatedStatement
});    
const { data: { user } } = await supabase.auth.getUser();
const testUserId = user?.id || '0571f8be-e6d4-4158-9301-a6cf2183e40f'; // Test user ID
console.log('🔑 Using user ID:', testUserId);

    if (!sessionData) {
      console.log('❌ No session data');
      return;
    }
    // Generate complete action sentence
const what = action.smartData?.specific || 'complete action';
const measurable = action.smartData?.measurable || '';
const time = action.smartData?.timed || 'soon';

const completeSentence = `I will ${what} ${measurable} ${time}`.trim().replace(/\s+/g, ' ');
console.log('🔧 GENERATED SENTENCE:', completeSentence);

    const { error } = await supabase.from('user_action_steps').upsert({
      user_id: user?.id || '0571f8be-e6d4-4158-9301-a6cf2183e40f',
      module_id: sessionData.module_id,
// NEW (matches database):
session_id: sessionData.session_number,
action_type: action.type,
specific_action: action.smartData?.specific || action.generatedStatement || 'No description',
      timed: action.smartData?.timed || 'No time specified',
      generated_statement: completeSentence,
      person_to_tell: sharingCommitment,
      completed: false,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('❌ Save failed:', error);
    } else {
      console.log('✅ Action saved to database!');
    }
  } catch (error) {
    console.error('❌ Save error:', error);
  }
};
const handleSaveAction = (action: ActionCommitment) => {
  if (savedActions.length >= 4) {
    alert('Maximum 4 actions allowed per session');
    return;
  }
  setSavedActions(prev => [...prev, action]);
  
  // Save this specific action immediately
  saveActionToDatabase(action); // NEW: Direct save function
  alert('Action saved to database!');
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
console.log('🔍 Raw database data - case_study field:', data?.content?.case_study);
console.log('🔍 Type of case_study:', typeof data?.content?.case_study);

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
  // Load saved actions when page loads
  useEffect(() => {
    const loadSavedActions = async () => {
      if (!sessionData) return;
      
      try {
        const { data: actions } = await supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', '0571f8be-e6d4-4158-9301-a6cf2183e40f')
          .eq('session_id', sessionData.id)
          .eq('module_id', sessionData.module_id);
        
        if (actions && actions.length > 0) {
          // Convert database format back to action format

          const convertedActions = actions.map(action => ({
  id: action.id,
  type: action.action_type,
  smartData: {
    specific: action.specific_action || '',
    measurable: action.measurable || '',
    ministryMinded: action.ministry_minded || '',
    achievable: action.achievable || 'Achievable within current resources',
    relevant: action.relevant || '',
    relational: action.relational || '',
    timed: action.timed || ''
  },
  generatedStatement: action.generated_statement || '',
  completed: action.completed || false
}));
          console.log('✅ Loaded saved actions:', convertedActions);
          setActionsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading actions:', error);
      }
    };

    loadSavedActions();
  }, [sessionData]);
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
  };


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
        🎯 <strong>✅ INITIAL USER FEEDBACK:</strong> Testing LOG IN and test user feedback.| tell Jeff email: jsamuelson@ibam.org
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
          <LookingForwardSection
            savedActions={savedActions}
            onSaveAction={handleSaveAction}
            pathwayMode={pathwayMode}
            sharingCommitment={sharingCommitment}
            setSharingCommitment={setSharingCommitment}
            actionsLoaded={actionsLoaded}
            setSavedActions={setSavedActions}
            onMarkComplete={markSectionComplete}
            onNavigateTo={navigateTo}
            isExpanded={expandedSection === 'lookforward'}
            onToggleExpanded={() => setExpandedSection(expandedSection === 'lookforward' ? null : 'lookforward')}
          />
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