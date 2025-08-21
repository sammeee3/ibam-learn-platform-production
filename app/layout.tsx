'use client';
import { useState, useEffect } from 'react';
import MobileAdminMenu from './components/common/MobileAdminMenu';
import DownloadModal from './components/common/DownloadModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          // Try to get from cookie
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(c => c.trim().startsWith('ibam_auth_server='));
          if (authCookie) {
            userEmail = decodeURIComponent(authCookie.split('=')[1]);
            localStorage.setItem('ibam-auth-email', userEmail);
          }
        }
        
        if (!userEmail) {
          console.log('No user email found in localStorage/cookies');
          setUserProfile(null);
          return;
        }

        console.log('Fetching profile for authenticated user:', userEmail);

        // Fetch user profile using API endpoint
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          console.log('✅ Layout: User profile loaded:', profile.first_name, profile.login_source);
        } else {
          console.log('❌ Layout: Profile fetch failed:', response.status, 'for email:', userEmail);
          // TEMP FIX: Show dropdown with demo user for staging testing
          if (userEmail) {
            setUserProfile({
              email: userEmail,
              first_name: 'Demo User',
              login_source: 'demo'
            });
            console.log('🔧 Layout: Using demo profile for testing');
          } else {
            setUserProfile(null);
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

    fetchUserData();
  }, []);

  // Function to refresh data when download modal opens
  const handleOpenDownloadModal = async () => {
    // Skip data refresh for now - just open modal
    console.log('Opening download modal with current data');
    setDownloadModalOpen(true);
  };

  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        {children}
        
        {/* Admin Menu and Download Modal - Only show for authenticated users */}
        {userProfile && (
          <>
            <MobileAdminMenu
              userProfile={userProfile}
              onDownloadClick={handleOpenDownloadModal}
            />
            
            <DownloadModal
              isOpen={downloadModalOpen}
              onClose={() => setDownloadModalOpen(false)}
              availableDownloads={availableDownloads}
            />
          </>
        )}
      </body>
    </html>
  );
}