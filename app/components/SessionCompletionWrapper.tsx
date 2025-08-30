// Session Completion Wrapper with Post-Assessment Detection
// File: /components/SessionCompletionWrapper.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PostAssessmentInlineModal from './PostAssessmentInlineModal';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SessionCompletionWrapperProps {
  children: React.ReactNode;
  moduleId: number;
  sessionId: number;
}

const SessionCompletionWrapper: React.FC<SessionCompletionWrapperProps> = ({
  children,
  moduleId,
  sessionId
}) => {
  const [showPostAssessment, setShowPostAssessment] = useState(false);
  const [postAssessmentCompleted, setPostAssessmentCompleted] = useState(false);

  // Check if this is Module 5, Session 5 and if post-assessment is needed
  const checkPostAssessmentStatus = async () => {
    // Only check for Module 5, Session 5
    if (moduleId !== 5 || sessionId !== 5) return;

    try {
      // Use custom auth system
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (!userEmail) return;
      
      const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      const profile = await profileResponse.json();
      if (!profile.id) return; // 🔧 FIX: Use profile.id consistently

      // Check if post-assessment already completed
      const { data: assessmentData, error } = await supabase
        .from('assessment_responses')
        .select('id')
        .eq('user_id', profile.id) // 🔧 FIX: Use profile.id consistently
        .eq('assessment_id', 'c88g5b79-9bd5-42bb-9767-7fe2d0f920c8') // Post-assessment ID
        .single();

      const isCompleted = assessmentData && !error;
      setPostAssessmentCompleted(!!isCompleted);


      console.log('🎯 Post-assessment status for Module 5 Session 5:', {
        completed: isCompleted,
        shouldShow: !isCompleted
      });

    } catch (error) {
      console.error('Error checking post-assessment status:', error);
    }
  };

  // Listen for session completion events
  useEffect(() => {
    checkPostAssessmentStatus();

    // Listen for session completion events from child components
    const handleSessionComplete = (event: CustomEvent) => {
      const { moduleId: completedModule, sessionId: completedSession, completion } = event.detail;
      
      console.log('🎉 Session completed:', { completedModule, completedSession, completion });

      // If Module 5, Session 5 is completed and post-assessment not done, show modal
      if (completedModule === 5 && completedSession === 5 && completion === 100 && !postAssessmentCompleted) {
        console.log('🚨 Triggering post-assessment modal!');
        setShowPostAssessment(true);
      }
    };

    window.addEventListener('sessionCompleted' as any, handleSessionComplete);
    
    return () => {
      window.removeEventListener('sessionCompleted' as any, handleSessionComplete);
    };
  }, [moduleId, sessionId, postAssessmentCompleted]);

  // Listen for post-assessment completion
  useEffect(() => {
    const handlePostAssessmentComplete = () => {
      console.log('✅ Post-assessment completed, hiding modal');
      setShowPostAssessment(false);
      setPostAssessmentCompleted(true);
    };

    window.addEventListener('message', (event) => {
      if (event.data.type === 'POST_ASSESSMENT_COMPLETED') {
        handlePostAssessmentComplete();
      }
    });

    return () => {
      window.removeEventListener('message', handlePostAssessmentComplete);
    };
  }, []);

  // Auto-check if we should show post-assessment when component mounts
  useEffect(() => {
    const autoCheckCompletion = async () => {
      // Only for Module 5, Session 5
      if (moduleId !== 5 || sessionId !== 5) return;
      if (postAssessmentCompleted) return;

      try {
        // Use custom auth system
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
        if (!userEmail) return;
        
        const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        const profile = await profileResponse.json();
        if (!profile.id) return; // 🔧 FIX: Use profile.id consistently

        // Check if this session is already completed
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('completion_percentage, completed_at')
          .eq('user_id', profile.id) // 🔧 FIX: Use profile.id consistently
          .eq('module_id', moduleId)
          .eq('session_id', sessionId)
          .single();

        // If session is already 100% complete, show post-assessment immediately
        if (progressData && progressData.completion_percentage === 100 && progressData.completed_at) {
          console.log('📚 Module 5 Session 5 already complete, checking post-assessment...');
          if (!postAssessmentCompleted) {
            setShowPostAssessment(true);
          }
        }

      } catch (error) {
        console.error('Error auto-checking completion:', error);
      }
    };

    autoCheckCompletion();
  }, [moduleId, sessionId, postAssessmentCompleted]);

  return (
    <>
      {children}
      
      {/* Mandatory Post-Assessment Inline Modal - No Popups! */}
      <PostAssessmentInlineModal 
        isOpen={showPostAssessment && moduleId === 5 && sessionId === 5}
        onComplete={() => {
          setShowPostAssessment(false);
          setPostAssessmentCompleted(true);
          // Trigger celebration or redirect
          window.location.href = '/celebration';
        }}
      />
    </>
  );
};

export default SessionCompletionWrapper;

// Usage Instructions:
// 1. Wrap your session components with this wrapper
// 2. Pass moduleId and sessionId as props
// 3. Make sure session components dispatch 'sessionCompleted' events when done
// 
// Example:
// <SessionCompletionWrapper moduleId={5} sessionId={5}>
//   <YourSessionComponent />
// </SessionCompletionWrapper>
//
// In your session component, when 100% complete, dispatch:
// window.dispatchEvent(new CustomEvent('sessionCompleted', {
//   detail: { moduleId: 5, sessionId: 5, completion: 100 }
// }));