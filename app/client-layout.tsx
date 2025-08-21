'use client';
import { useState, useEffect } from 'react';
import MobileAdminMenu from './components/common/MobileAdminMenu';
import DownloadModal from './components/common/DownloadModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [availableDownloads, setAvailableDownloads] = useState({
    actions: [],
    sessionData: null,
    businessPlan: null
  });
  const [userProfile, setUserProfile] = useState<{
    email: string;
    first_name: string;
    login_source: string;
  } | null>(null);

  // Fetch user data when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use same auth approach as Dashboard - check localStorage/cookies
        let userEmail = localStorage.getItem('ibam-auth-email');
        
        if (!userEmail) {
          // Try to get from cookies - check both cookie names
          const cookies = document.cookie.split(';');
          console.log('🍪 All cookies:', cookies);
          
          // Check for ibam_auth_server first
          let authCookie = cookies.find(c => c.trim().startsWith('ibam_auth_server='));
          
          // If not found, check for ibam_auth (set by Dashboard)
          if (!authCookie) {
            authCookie = cookies.find(c => c.trim().startsWith('ibam_auth='));
          }
          
          if (authCookie) {
            userEmail = decodeURIComponent(authCookie.split('=')[1]);
            localStorage.setItem('ibam-auth-email', userEmail);
            console.log('📧 Found email in cookie:', userEmail);
          }
        }
        
        // STAGING FALLBACK: If no auth found, use demo user for testing (non-production only)
        // Use URL-based detection since this runs on client-side
        const isProduction = typeof window !== 'undefined' && 
                            window.location.hostname.includes('ibam-learn-platform-v3');
        
        if (!userEmail && !isProduction) {
          console.log('🔧 STAGING: No auth found, using demo fallback');
          userEmail = 'demo@staging.test';
          localStorage.setItem('ibam-auth-email', userEmail);
        }

        console.log('Fetching profile for authenticated user:', userEmail);
        console.log('🔍 Layout: Fetching profile for user:', userEmail);

        // Try to fetch user profile, but don't block if it fails
        if (userEmail) {
          try {
            const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
            if (response.ok) {
              const profile = await response.json();
              setUserProfile(profile);
              console.log('✅ Layout: User profile loaded:', profile.first_name, profile.login_source);
            } else {
              console.log('❌ Layout: Profile fetch failed:', response.status, 'for email:', userEmail);
              // Set fallback immediately on API failure
              setUserProfile({
                email: userEmail,
                first_name: userEmail.includes('demo') ? 'Demo User' : 'User',
                login_source: userEmail.includes('demo') ? 'staging' : 'sso'
              });
            }
          } catch (err) {
            console.log('❌ Layout: Profile fetch error:', err);
            // Set fallback immediately on fetch error  
            setUserProfile({
              email: userEmail,
              first_name: userEmail.includes('demo') ? 'Demo User' : 'User',
              login_source: userEmail.includes('demo') ? 'staging' : 'sso'
            });
          }
        }

        // ALWAYS show dropdown with user data - critical for staging functionality
        if (userEmail) {
          // If we don't have a profile yet, create a fallback one
          if (!userProfile) {
            setUserProfile({
              email: userEmail,
              first_name: userEmail.includes('demo') ? 'Demo User' : 'User',
              login_source: userEmail.includes('demo') ? 'staging' : 'sso'
            });
            console.log('🔧 Layout: Using fallback profile for dropdown visibility');
          }
        }

        // Update available downloads with empty data
        setAvailableDownloads({
          actions: [],
          sessionData: null,
          businessPlan: null
        });

      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setUserProfile(null);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchUserData();
    }
  }, []);

  return (
    <>
      {children}
      {userProfile && (
        <MobileAdminMenu 
          userProfile={userProfile}
          onDownloadClick={() => setDownloadModalOpen(true)}
        />
      )}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        availableDownloads={availableDownloads}
      />
    </>
  );
}