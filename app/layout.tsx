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
        // SECURITY FIX: Validate server-side authentication first
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        if (!sessionResponse.ok) {
          console.log('No valid server session - user not authenticated');
          setUserProfile(null);
          return;
        }

        const sessionData = await sessionResponse.json();
        const userEmail = sessionData.email;
        
        if (!userEmail) {
          console.log('No user email in session');
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
          console.log('❌ Layout: Profile fetch failed:', response.status);
          setUserProfile(null);
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