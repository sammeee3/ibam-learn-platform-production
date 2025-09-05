'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Module1Redirect() {
  const router = useRouter();
  const [isCheckingAssessment, setIsCheckingAssessment] = useState(true);

  useEffect(() => {
    const checkPreAssessmentStatus = async () => {
      try {
        // Get user email from auth
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
        
        if (!userEmail) {
          console.log('❌ No user email found - redirecting to login');
          router.replace('/auth/login');
          return;
        }

        // Check if user has completed pre-assessment
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          console.error('❌ Profile fetch failed:', response.status);
          // If can't check, go to Session 1 as fallback
          router.replace('/modules/1/sessions/1');
          return;
        }
        
        const profile = await response.json();
        console.log('🔍 Checking pre-assessment status for:', profile);
        
        // Check if pre-assessment is completed
        if (!profile.pre_assessment_completed) {
          console.log('🎯 User needs pre-assessment - redirecting');
          router.replace('/assessment/pre');
        } else {
          console.log('✅ Pre-assessment completed - going to Session 1');
          router.replace('/modules/1/sessions/1');
        }
        
      } catch (error) {
        console.error('❌ Error checking pre-assessment:', error);
        // If error checking, go to Session 1 as fallback
        router.replace('/modules/1/sessions/1');
      } finally {
        setIsCheckingAssessment(false);
      }
    };

    checkPreAssessmentStatus();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {isCheckingAssessment ? 'Checking your progress...' : 'Taking you to Session 1...'}
        </p>
      </div>
    </div>
  );
}