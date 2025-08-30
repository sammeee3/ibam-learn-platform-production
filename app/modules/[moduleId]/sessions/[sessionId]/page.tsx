'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Target,
  Book,
  Clock,
  User,
  Loader2,
  Briefcase
} from 'lucide-react';

// Add these lines here:
import type { 
  SessionData, 
  SessionPageProps,
  ActionCommitment
} from '../../../../lib/types';

// Only import needed constants

import SafeFeedbackWidget from '../../../../components/feedback/SafeFeedbackWidget';
import FloatingCoachButton from '../../../../components/coaching/FloatingCoachButton';
import { progressTracker } from '../../../../../lib/services/progressTracking';
import EnhancedLookingBack from '../../../../components/sections/LookingBack/EnhancedLookingBack';
import BeautifulLookingUpSection from '../../../../components/sections/LookingUp/BeautifulLookingUpSection';
import LookingForwardSection from '../../../../components/sections/LookingForward/LookingForwardSection';
import SessionProgressOverviewModern from '../../../../components/progress/SessionProgressOverviewModern';
import SessionResourcesSection from '../../../../components/resources/SessionResourcesSection';
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

// Helper function to get user profile ID (integer) consistently using custom auth system
const getUserProfileId = async (): Promise<number | null> => {
  try {
    // Get user email from custom auth system (same as dashboard)
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
    
    console.log('🔍 getUserProfileId - checking localStorage for email:', userEmail);
    
    if (!userEmail) {
      console.log('❌ No user email found in localStorage');
      return null;
    }
    
    // Fetch user profile using API endpoint (same as dashboard)
    console.log('🔄 Fetching user profile via API for:', userEmail);
    const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
    
    if (!response.ok) {
      console.error('❌ Profile API fetch failed:', response.status);
      return null;
    }
    
    const profile = await response.json();
    console.log('✅ Profile fetched via API:', profile);
    
    if (!profile || !profile.id) {
      console.error('❌ Profile missing ID field:', profile);
      return null;
    }
      
    console.log('✅ Found profile ID:', profile.id);
    return profile.id;
  } catch (error) {
    console.error('❌ getUserProfileId error:', error);
    return null;
  }
};

// AUTO-SAVE HOOK FUNCTION  
const useAutoSave = (sessionData, savedActions, caseAnswers, sharingCommitment) => {
  const [saveStatus, setSaveStatus] = useState('idle');
const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const supabase = createClientComponentClient();

  const saveAllUserData = useCallback(async () => {
      console.log('🔥 saveAllUserData called!', { sessionData, savedActions });
  if (!sessionData || savedActions.length === 0) return;
    
    try {
      setSaveStatus('saving');
      
      const userId = await getUserProfileId();
      if (!userId) {
        console.error('❌ Could not find user profile for auto-save');
        setSaveStatus('error');
        return;
      }

      // Use bulk save API endpoint instead of direct Supabase calls
      const response = await fetch('/api/actions/bulk-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          moduleId: sessionData.module_id,
          sessionId: sessionData.session_number,
          actions: savedActions,
          sharingCommitment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Bulk save API error:', errorData);
        throw new Error(errorData.error || 'Failed to bulk save actions');
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
    content: false,
    quiz: false,
    lookforward: false
  });
  const [sectionProgress, setSectionProgress] = useState({
    lookback: 0,
    lookup: 0,
    content: 0,
    quiz: 0,
    lookforward: 0
  });
  const [sessionProgressPercent, setSessionProgressPercent] = useState(0);
  
  const [lookingUpProgress, setLookingUpProgress] = useState({
    wealth: false,
    people: false,
    reading: false,
    case: false,
    integrate: false,
    coaching: false,
    practice: false
  });
  
  // Debounce mechanism for auto-save to prevent duplicate API calls
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleNextSession = () => {
    // FIXED: Correct session counts from production database
    const moduleSessionCounts = { 1: 4, 2: 4, 3: 5, 4: 4, 5: 5 };
    const maxSessionInModule = moduleSessionCounts[parseInt(moduleId)];
    const currentSession = parseInt(sessionId);
    
    if (currentSession < maxSessionInModule) {
      window.location.href = `/modules/${moduleId}/sessions/${currentSession + 1}`;
    } else {
      const nextModule = parseInt(moduleId) + 1;
      // Move to next module or dashboard if course complete
      if (nextModule <= 5) {
        window.location.href = `/modules/${nextModule}/sessions/1`;
      } else {
        window.location.href = '/dashboard';
      }
    }
  };
  
  const [savedActions, setSavedActions] = useState<ActionCommitment[]>([]);
  const [actionsLoaded, setActionsLoaded] = useState(false);

  const [sharingCommitment, setSharingCommitment] = useState('');

  // Granular subsection progress tracking
  const [subsectionProgress, setSubsectionProgress] = useState({
    lookback: {
      prayer: false,
      checkin: false,
      accountability: false
    },
    lookup: {
      wealth_video: false,
      reading: false,
      people_video: false,
      case_study: false,
      integration: false,
      quiz: false
    },
    lookforward: {
      actions: false,
      sharing: false
    }
  });

  // Toast notification state
  const [saveNotification, setSaveNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Real database connection
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ADD AUTO-SAVE HOOK
const { saveStatus, lastSaved, saveNow } = useAutoSave(sessionData, savedActions, {}, sharingCommitment);

  // Toast notification helper
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setSaveNotification({ show: true, type, message });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setSaveNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

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
const saveActionToDatabase = async (action: ActionCommitment): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('💾 Saving single action:', action);
    
    const userId = await getUserProfileId();
    if (!userId) {
      return { success: false, message: 'User not authenticated or profile not found' };
    }
    
    console.log('🔑 Using profile user ID:', userId);

    if (!sessionData) {
      return { success: false, message: 'No session data available' };
    }
    
    // Generate complete action sentence
    const what = action.smartData?.specific || 'complete action';
    const measurable = action.smartData?.measurable || '';
    const time = action.smartData?.timed || 'soon';
    const completeSentence = `I will ${what} ${measurable} ${time}`.trim().replace(/\s+/g, ' ');

    // Use API endpoint instead of direct Supabase call (admin permissions required)
    const response = await fetch('/api/actions/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        moduleId: sessionData.module_id,
        sessionId: sessionData.session_number,
        action,
        sharingCommitment
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API save error:', errorData);
      return { success: false, message: errorData.error || 'Failed to save action' };
    } else {
      console.log('✅ Action saved to database!');
      return { success: true, message: 'Action saved successfully!' };
    }
  } catch (error) {
    console.error('❌ Save error:', error);
    return { success: false, message: `Unexpected error: ${error.message}` };
  }
};
const handleSaveAction = async (action: ActionCommitment) => {
  if (savedActions.length >= 4) {
    showToast('error', 'Maximum 4 actions allowed per session');
    return;
  }
  
  // Show saving indicator
  showToast('info', 'Saving action...');
  
  // Add to UI immediately for better UX
  setSavedActions(prev => [...prev, action]);
  
  // Save to database
  const result = await saveActionToDatabase(action);
  
  if (result.success) {
    showToast('success', '✅ Action saved successfully! It will appear in your next session.');
  } else {
    showToast('error', `❌ Save failed: ${result.message}`);
    // Remove from UI if save failed
    setSavedActions(prev => prev.filter(a => a.id !== action.id));
  }
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
          // More helpful error message for debugging
          if (fetchError.code === 'PGRST116') {
            setError(`Session ${sessionId} not found in Module ${moduleId}. This content may not be available yet.`);
          } else {
            setError(`Failed to load session data: ${fetchError.message}`);
          }
          return;
        }

        if (!data) {
          setError(`Session not found: Module ${moduleId}, Session ${sessionId}`);
          return;
        }

        console.log('✅ Session data loaded:', data);
        // Expose resources at top level for component compatibility
        const enhancedData = {
          ...data,
          resources: data.content?.resources || null
        };
        console.log('🔧 Enhanced data with resources:', enhancedData.resources);
        setSessionData(enhancedData);
        
        // Load saved progress from database
        try {
          // Get both profile ID (for actions) and auth UUID (for progress)
          const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
          if (!userEmail) {
            console.log('⚠️ No authenticated user - progress will show as 0%');
            setSessionProgressPercent(0);
          } else {
            const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
            const profile = await response.json();
            console.log('🔍 Loading progress for user:', profile.id); // 🔧 FIX: Use profile.id consistently
            
            if (profile.id) { // 🔧 FIX: Use profile.id consistently
              // Get user's overall progress using auth UUID
              // 🔧 FIX: Use server-side API for progress loading
              const progressResponse = await fetch(`/api/progress/session?userId=${profile.id}`);
              const progressData = progressResponse.ok ? await progressResponse.json() : { sessions: [], modules: [], overallCompletion: 0 };
            console.log('📊 Progress data loaded:', progressData);
            
            // Find progress for this specific session
            const progress = progressData?.sessions?.find(
              (s: any) => s.module_id === parseInt(moduleId) && s.session_id === parseInt(sessionId)
            );
            console.log('📈 Session progress found:', progress);
            
            if (progress) {
              // 🔧 CRITICAL FIX: Restore completed sections with correct database mapping
              const restoredSections = {
                lookback: progress.lookback_completed || false,
                lookup: progress.lookup_completed || false,
                content: progress.lookup_completed || false, // Content uses lookup completion
                quiz: progress.assessment_completed || false, // Quiz uses assessment completion
                lookforward: progress.lookforward_completed || false
              };
              console.log('✅ Restored sections from DB:', {
                'DB lookback_completed': progress.lookback_completed,
                'DB lookup_completed': progress.lookup_completed,
                'DB assessment_completed': progress.assessment_completed,
                'DB lookforward_completed': progress.lookforward_completed,
                'UI sections restored': restoredSections
              });
              setCompletedSections(restoredSections);
              console.log('🎯 CRITICAL DEBUG: completedSections state updated to:', restoredSections);
              
              // Calculate section progress percentages
              const sectionProg = {
                lookback: progress.lookback_completed ? 100 : 0,
                lookup: progress.lookup_completed ? 100 : 0,
                content: progress.lookup_completed ? 100 : 0, // Content mirrors lookup
                quiz: progress.assessment_completed ? 100 : 0, // Quiz mirrors assessment
                lookforward: progress.lookforward_completed ? 100 : 0
              };
              setSectionProgress(sectionProg);
              console.log('📊 Section progress percentages:', sectionProg);
              
              // 🔧 RECALCULATE overall progress based on actual 3 DB sections
              const dbCompletedCount = [
                progress.lookback_completed,
                progress.lookup_completed,
                progress.lookforward_completed
              ].filter(Boolean).length;
              
              const recalculatedProgress = Math.round((dbCompletedCount / 3) * 100); // 3 sections: lookback, lookup, lookforward
              const dbProgress = progress.completion_percentage || 0;
              
              console.log('📊 Progress comparison:', {
                'DB stored progress': dbProgress,
                'Recalculated progress': recalculatedProgress,
                'DB sections completed': dbCompletedCount,
                'Section details': {
                  lookback: progress.lookback_completed,
                  lookup: progress.lookup_completed,
                  lookforward: progress.lookforward_completed
                }
              });
              
              // Use the recalculated progress to ensure accuracy
              setSessionProgressPercent(recalculatedProgress);
              
              // 🔧 CRITICAL FIX: Restore individual Looking Up subsection progress from localStorage
              // This fixes the video completion button reset issue on refresh
              try {
                const moduleNum = parseInt(moduleId);
                const sessionNum = parseInt(sessionId);
                
                // Restore Case Study answers
                const caseStorageKey = `case_study_answers_${moduleNum}_${sessionNum}`;
                const savedCaseAnswers = localStorage.getItem(caseStorageKey);
                if (savedCaseAnswers) {
                  const parsedAnswers = JSON.parse(savedCaseAnswers);
                  const caseCompleted = Object.values(parsedAnswers).every(answer => String(answer).trim().length > 0);
                  console.log('📚 Restored Case Study completion state:', caseCompleted);
                  
                  // Update lookingUpProgress for case study
                  setLookingUpProgress(prev => ({ ...prev, case: caseCompleted }));
                }
                
                // Restore Integration goal
                const integrationStorageKey = `integration_goal_${moduleNum}_${sessionNum}`;
                const savedIntegrationData = localStorage.getItem(integrationStorageKey);
                if (savedIntegrationData) {
                  const parsedData = JSON.parse(savedIntegrationData);
                  const integrationCompleted = parsedData.completed || false;
                  console.log('🔗 Restored Integration completion state:', integrationCompleted);
                  
                  // Update lookingUpProgress for integration
                  setLookingUpProgress(prev => ({ ...prev, integrate: integrationCompleted }));
                }
                
                // Restore Reading completion from reading component localStorage
                const readingStorageKey = `reading_answers_${moduleNum}_${sessionNum}`;
                const savedReadingAnswers = localStorage.getItem(readingStorageKey);
                if (savedReadingAnswers) {
                  try {
                    const parsedReadingAnswers = JSON.parse(savedReadingAnswers);
                    const hasReadingAnswers = Object.keys(parsedReadingAnswers).length > 0;
                    console.log('📖 Restored Reading completion state:', hasReadingAnswers);
                    
                    // Update lookingUpProgress for reading (if has answers, likely completed)
                    setLookingUpProgress(prev => ({ ...prev, reading: hasReadingAnswers }));
                  } catch (e) {
                    console.log('📖 Reading answers parsing failed, skipping');
                  }
                }
                
                // 🔧 CRITICAL FIX: Restore video completion states
                const wealthVideoStorageKey = `wealth_video_completed_${moduleNum}_${sessionNum}`;
                const peopleVideoStorageKey = `people_video_completed_${moduleNum}_${sessionNum}`;
                
                const wealthCompleted = localStorage.getItem(wealthVideoStorageKey) === 'true';
                const peopleCompleted = localStorage.getItem(peopleVideoStorageKey) === 'true';
                
                console.log('🎥 Restored video completion states:', {
                  wealth: wealthCompleted,
                  people: peopleCompleted
                });
                
                // Update lookingUpProgress for videos
                setLookingUpProgress(prev => ({
                  ...prev,
                  wealth: wealthCompleted,
                  people: peopleCompleted
                }));
                
                // 🔇 AUTO-COMPLETE INTEGRATION: Hidden section always marked complete
                // This ensures it doesn't block progress but remains hidden from UI
                setLookingUpProgress(prev => ({ ...prev, integrate: true }));
                console.log('🔇 Auto-completed hidden integration section');
                
                // If lookup section is marked complete in DB, mark individual subsections as complete
                if (progress.lookup_completed) {
                  console.log('✅ Lookup section complete in DB - marking all subsections as complete');
                  setLookingUpProgress({
                    wealth: true,
                    people: true,
                    reading: true,
                    case: true,
                    integrate: true, // Keep as complete (hidden)
                    coaching: true,
                    practice: true
                  });
                } else {
                  console.log('📝 Lookup section not complete - restored individual subsections from localStorage');
                }
                
              } catch (localStorageError) {
                console.error('⚠️ Error restoring subsection progress from localStorage:', localStorageError);
              }
              
            } else {
              console.log('⚠️ No progress found for this session');
            }
            } else {
              console.log('⚠️ No authenticated user - progress will show as 0%');
            }
          }
        } catch (error) {
          console.error('❌ Error loading progress:', error);
        }
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
        const userId = await getUserProfileId();
        if (!userId) {
          console.log('⚠️ No user profile found for action loading');
          return;
        }
        
        const { data: actions } = await supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', userId)
          .eq('session_id', sessionData.session_number) // FIXED: Use session_number instead of session UUID
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

  // Add event listener for Looking UP section expansion from Looking Back component
  useEffect(() => {
    const handleExpandLookingUp = () => {
      console.log('🎯 Custom event received: expanding Looking UP section');
      setExpandedSection('lookup');
      
      // Scroll to Looking UP section after state update
      setTimeout(() => {
        const lookingUpSection = document.querySelector('.bg-green-500');
        if (lookingUpSection) {
          lookingUpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log('📜 Scrolled to Looking UP section via custom event');
        }
      }, 100);
    };

    window.addEventListener('expandLookingUp', handleExpandLookingUp);
    
    return () => {
      window.removeEventListener('expandLookingUp', handleExpandLookingUp);
      // Cleanup save timeout on unmount to prevent memory leaks
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, []);

  // FIXED: Navigation functions with proper Next.js router and correct module progression
  const navigateToSession = (direction: 'prev' | 'next') => {
    const currentModuleId = sessionData?.module_id || 1;
    const currentSessionNumber = sessionData?.session_number || 1;
    
    // Use the same counts as handleNextSession
    const moduleSessionCounts = { 1: 4, 2: 4, 3: 5, 4: 4, 5: 5 };
    const maxSessionInModule = moduleSessionCounts[currentModuleId] || 0;
    
    if (direction === 'next') {
      // Trigger micro-survey when completing a session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('show_micro_survey', 'true');
      }
      
      if (currentSessionNumber < maxSessionInModule) {
        // Stay in current module, go to next session
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber + 1}`);
      } else if (currentModuleId < 5) {
        // Move to next module's first session
        router.push(`/modules/${currentModuleId + 1}/sessions/1`);
      } else {
        // End of course, go to dashboard
        router.push('/dashboard');
      }
    } else {
      // Previous direction
      if (currentSessionNumber > 1) {
        // Go to previous session in same module
        router.push(`/modules/${currentModuleId}/sessions/${currentSessionNumber - 1}`);
      } else if (currentModuleId > 1) {
        // Go to last session of previous module
        const prevModule = currentModuleId - 1;
        const lastSessionInPrevModule = moduleSessionCounts[prevModule] || 1;
        router.push(`/modules/${prevModule}/sessions/${lastSessionInPrevModule}`);
      }
    }
  };

const navigateTo = (path: string) => {
  window.location.href = path;
};

  // Handle section completion with database persistence
  const markSectionComplete = async (section: string) => {
    console.log(`🚀 MARKING SECTION COMPLETE: ${section}`);
    
    // Update local state immediately for responsive UI
    setCompletedSections(prev => ({
      ...prev,
      [section]: true
    }));
    
    // Update section progress
    setSectionProgress(prev => ({
      ...prev,
      [section]: 100
    }));
    
    // Calculate overall session progress based on ACTUAL database sections (3 main sections)
    const currentSections = { ...completedSections, [section]: true };
    const dbSectionCount = [
      currentSections.lookback,
      currentSections.lookup || currentSections.content || currentSections.quiz, // Any Looking Up activity
      currentSections.lookforward
    ].filter(Boolean).length;
    
    const newProgress = Math.round((dbSectionCount / 3) * 100); // 3 DB sections: lookback, lookup, lookforward
    setSessionProgressPercent(newProgress);
    console.log(`📊 CALCULATED PROGRESS: ${dbSectionCount}/3 sections = ${newProgress}%`);
    
    // Save to database with CORRECT mapping
    try {
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (userEmail) {
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        const profile = await response.json();
        const authUserId = profile.id; // 🔧 FIX: Use profile.id consistently (same as load process)
        
        if (authUserId) {
          // 🚨 CRITICAL FIX: Map UI sections to database fields correctly
          const sectionMapping = {
            'lookback': 'lookback',
            'lookup': 'lookup', 
            'content': 'lookup',    // 🔧 FIX: content is subsection of Looking Up → lookup in DB
            'quiz': 'lookup',       // 🔧 FIX: quiz is subsection of Looking Up → lookup in DB  
            'lookforward': 'lookforward'
          };
          
          const dbSection = sectionMapping[section as keyof typeof sectionMapping] || section;
          console.log(`🗄️ DB MAPPING: UI '${section}' → DB '${dbSection}'`);
          
          // Build complete section completion state for database
          const currentDbSections = {
            lookback: currentSections.lookback || false,
            lookup: currentSections.lookup || currentSections.content || currentSections.quiz || false, // Any Looking Up subsection completes lookup
            lookforward: currentSections.lookforward || false,
            assessment: false // No separate assessment in this session structure
          };
          
          // Set the newly completed section
          currentDbSections[dbSection as keyof typeof currentDbSections] = true;
          
          console.log(`💾 SAVING TO DATABASE:`, currentDbSections);
          
          // 🔧 FIX: Use server-side API to bypass RLS issues
          const progressResponse = await fetch('/api/progress/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: authUserId,
              moduleId: parseInt(moduleId),
              sessionId: parseInt(sessionId),
              section: section,
              sectionCompleted: currentDbSections,
              subsectionProgress: {
                lookingUp: lookingUpProgress // Send current subsection progress for granular tracking
              }
            })
          });
          
          if (!progressResponse.ok) {
            const errorData = await progressResponse.json();
            console.error('❌ Progress API error:', errorData);
            throw new Error(`Progress API failed: ${errorData.error}`);
          }
          
          console.log('✅ Progress saved via server API');
          
          console.log(`✅ DATABASE SAVE COMPLETED for section: ${section}`);
          
          // 🔧 REMOVED: Activity logging causing 400 errors
          // Track activity - removed due to RLS issues
        } else {
          console.error('❌ No auth user ID found');
        }
      } else {
        console.error('❌ No user email found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      showToast('error', 'Failed to save progress. Please try again.');
    }
  };

  // Enhanced subsection completion tracking
  const markSubsectionComplete = (section: string, subsection: string) => {
    console.log(`🎯 Marking subsection complete: ${section}.${subsection}`);
    
    setSubsectionProgress(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: true
      }
    }));
    
    // Show immediate feedback
    showToast('success', `✅ ${subsection.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} completed!`);
    
    // Check if entire section is now complete based on requirements
    const updatedSubsectionProgress = {
      ...subsectionProgress,
      [section]: {
        ...subsectionProgress[section as keyof typeof subsectionProgress],
        [subsection]: true
      }
    };
    
    // Define minimum requirements for each section
    const sectionRequirements = {
      lookback: ['prayer', 'accountability'], // Prayer + action review required for Looking Back
      lookup: ['reading'], // Only reading required for Looking Up  
      lookforward: ['actions'] // Only actions required for Looking Forward
    };
    
    const requirements = sectionRequirements[section as keyof typeof sectionRequirements] || [];
    const sectionSubsections = updatedSubsectionProgress[section as keyof typeof updatedSubsectionProgress];
    
    const allRequiredComplete = requirements.every(req => 
      sectionSubsections[req as keyof typeof sectionSubsections]
    );
    
    if (allRequiredComplete && !completedSections[section as keyof typeof completedSections]) {
      console.log(`✅ All required subsections complete for ${section} - marking section complete`);
      setTimeout(() => markSectionComplete(section), 500); // Small delay for UX
    }
  };

  const markLookingUpComplete = (subsection: string) => {
    console.log(`🔄 Looking Up subsection completed: ${subsection}`);
    
    // Update progress state first
    setLookingUpProgress(prev => {
      const newProgress = { ...prev, [subsection]: true };
      
      // Check if all VISIBLE subsections are complete (exclude hidden 'integrate' and 'coaching')
      const visibleSubsections = ['wealth', 'people', 'reading', 'case', 'practice'];
      const allVisibleComplete = visibleSubsections.every(sub => newProgress[sub as keyof typeof newProgress]);
      
      console.log(`📊 Looking Up progress check:`, {
        subsection,
        completed: visibleSubsections.filter(sub => newProgress[sub as keyof typeof newProgress]),
        remaining: visibleSubsections.filter(sub => !newProgress[sub as keyof typeof newProgress]),
        allComplete: allVisibleComplete
      });
      
      // Update section progress incrementally for better UX
      const completedCount = visibleSubsections.filter(sub => newProgress[sub as keyof typeof newProgress]).length;
      const progressPercent = Math.round((completedCount / visibleSubsections.length) * 100);
      setSectionProgress(prev => ({ ...prev, lookup: progressPercent }));
      console.log(`📈 Looking Up section progress: ${completedCount}/${visibleSubsections.length} = ${progressPercent}%`);
      
      // Update session progress incrementally - each subsection adds to overall progress
      const lookbackComplete = completedSections.lookback ? 1 : 0;
      const lookupPartialProgress = completedCount / visibleSubsections.length; // 0 to 1
      const lookforwardComplete = completedSections.lookforward ? 1 : 0;
      
      // Calculate incremental session progress (each section worth 33.33%)
      const incrementalSessionProgress = Math.round(((lookbackComplete + lookupPartialProgress + lookforwardComplete) / 3) * 100);
      setSessionProgressPercent(incrementalSessionProgress);
      console.log(`📊 INCREMENTAL SESSION PROGRESS: ${lookbackComplete} + ${lookupPartialProgress.toFixed(2)} + ${lookforwardComplete} = ${incrementalSessionProgress}%`);
      
      return newProgress;
    });
    
    // Handle completion outside of setState to avoid stale closure issues
    if (typeof window !== 'undefined') {
      const visibleSubsections = ['wealth', 'people', 'reading', 'case', 'practice'];
      const newLookingUpProgress = { ...lookingUpProgress, [subsection]: true };
      const allVisibleComplete = visibleSubsections.every(sub => newLookingUpProgress[sub as keyof typeof newLookingUpProgress]);
      
      if (allVisibleComplete && !completedSections.lookup) {
        console.log('🚀 All visible Looking Up subsections complete - triggering section completion');
        setTimeout(() => {
          setCompletedSections(current => {
            // Double-check to prevent duplicate updates
            if (current.lookup) {
              console.log('⚠️ Looking Up already marked complete, skipping update');
              return current;
            }
            
            const updatedSections = { ...current, lookup: true };
            
            // Calculate updated session progress immediately
            const dbSectionCount = [
              updatedSections.lookback,
              updatedSections.lookup, // Now true
              updatedSections.lookforward
            ].filter(Boolean).length;
            
            const newProgress = Math.round((dbSectionCount / 3) * 100);
            console.log(`📊 SESSION PROGRESS UPDATE: ${dbSectionCount}/3 sections = ${newProgress}%`);
            setSessionProgressPercent(newProgress);
            
            return updatedSections;
          });
        }, 200); // Slightly longer delay to ensure state is settled
      }
    }
    
    // Handle debounced save outside of setState to avoid closure issues
    if (typeof window !== 'undefined') {
      // Clear any existing save timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new debounced save with 500ms delay
      const newTimeout = setTimeout(async () => {
        const userEmail = localStorage.getItem('ibam-auth-email');
        if (userEmail) {
          try {
            const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
            const profile = await response.json();
            
            if (profile.id) {
              console.log(`💾 Debounced save: Looking Up progress for subsection: ${subsection}`);
              
              // Get current states for API call
              const currentLookingUpProgress = { ...lookingUpProgress, [subsection]: true };
              const visibleSubsections = ['wealth', 'people', 'reading', 'case', 'practice'];
              const allVisibleComplete = visibleSubsections.every(sub => currentLookingUpProgress[sub as keyof typeof currentLookingUpProgress]);
              
              await fetch('/api/progress/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: profile.id,
                  moduleId: parseInt(moduleId),
                  sessionId: parseInt(sessionId),
                  section: 'lookup',
                  sectionCompleted: {
                    lookback: completedSections.lookback,
                    lookup: allVisibleComplete, // Only mark fully complete when all visible subsections done
                    lookforward: completedSections.lookforward
                  },
                  subsectionProgress: {
                    lookingUp: currentLookingUpProgress // Send updated subsection progress
                  }
                })
              });
              console.log('✅ Debounced auto-save completed successfully');
            }
          } catch (error) {
            console.error('❌ Error in debounced auto-save:', error);
          }
        }
      }, 500); // 500ms debounce delay
      
      setSaveTimeout(newTimeout);
    }
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Streamlined Header - Clean and Professional */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Module {sessionData.module_id} • Session {sessionData.session_number}
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{sessionData.title}</h1>
                <p className="text-sm text-gray-500">{sessionData.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                ~45 min
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <BookOpen className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Modern Floating Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg p-2 mb-8 sticky top-4 z-40">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigateToSession('prev')}
              disabled={sessionData.session_number <= 1 && sessionData.module_id <= 1}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => navigateTo(`/modules/${moduleId}`)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Modules</span>
              </button>
              
              <button 
                onClick={() => navigateTo('/business-planner')}
                className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-full transition-all flex items-center"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Planner</span>
              </button>
              
              <button 
                onClick={() => navigateTo('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-full transition-all flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </button>
            </div>
            
            <button 
              onClick={handleNextSession}
              className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="hidden sm:inline mr-2">
                {sessionData.module_id === 1 && sessionData.session_number === 4 ? 'Module 2' :
                 sessionData.module_id === 2 && sessionData.session_number === 4 ? 'Module 3' :
                 'Next'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modern Session Progress Overview */}
        <SessionProgressOverviewModern 
          completedSections={completedSections}
          sectionProgress={sectionProgress}
          sessionProgressPercent={sessionProgressPercent}
          currentSection={expandedSection || undefined}
        />

        {/* Three main sections */}
        <div className="space-y-4 mb-8">
          {/* Looking Back */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 cursor-pointer transition-colors"
              onClick={(e) => {
                console.log('🔥 Looking Back clicked! Current state:', expandedSection);
                e.preventDefault();
                e.stopPropagation();
                setExpandedSection(expandedSection === 'lookback' ? null : 'lookback');
                console.log('✅ Looking Back state should change to:', expandedSection === 'lookback' ? null : 'lookback');
              }}
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
            
            {expandedSection === 'lookback' && !loading && (
              <div className="p-6 bg-blue-50">
                <EnhancedLookingBack 
                  sessionData={sessionData}
                  pathwayMode="individual"
                  onComplete={() => markSectionComplete('lookback')}
                  onSubsectionComplete={(subsection: string) => markSubsectionComplete('lookback', subsection)}
                  isCompleted={completedSections.lookback || false} // 🔧 FIX: Pass database completion state
                />
              </div>
            )}
            {expandedSection === 'lookback' && loading && (
              <div className="p-6 bg-blue-50 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-blue-600">Loading progress...</p>
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
            
            {expandedSection === 'lookup' && !loading && (
              <BeautifulLookingUpSection 
                sessionData={sessionData}
                pathwayMode="individual"
                onMarkComplete={markLookingUpComplete}
                isCompleted={completedSections.lookup || false}
                lookingUpProgress={lookingUpProgress}
              />
            )}
            {expandedSection === 'lookup' && loading && (
              <div className="p-6 bg-green-50 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-green-600">Loading progress...</p>
              </div>
            )}
          </div>
{/* Looking Forward */}
          <LookingForwardSection
            savedActions={savedActions}
            onSaveAction={handleSaveAction}
            pathwayMode="individual"
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

{/* Resources Section - Moved to Bottom */}
<div className="mt-6">
  <SessionResourcesSection sessionData={sessionData} />
</div>

{/* Feedback Widget */}
<SafeFeedbackWidget />

{/* Floating Coach Button */}
<FloatingCoachButton 
  moduleId={parseInt(params.moduleId)}
  sessionId={parseInt(params.sessionId)}
  sessionTitle={sessionData?.title}
  currentSection={expandedSection || undefined}
/>

      {/* Toast Notification */}
      {saveNotification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm transition-all duration-300 ${
          saveNotification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          saveNotification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {saveNotification.type === 'success' && '✅'}
              {saveNotification.type === 'error' && '❌'}
              {saveNotification.type === 'info' && '💾'}
            </div>
            <div className="font-medium">{saveNotification.message}</div>
            <button
              onClick={() => setSaveNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}