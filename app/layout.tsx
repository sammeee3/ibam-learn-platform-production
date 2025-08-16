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
        // Get email from localStorage (set by our SSO process)
        const userEmail = localStorage.getItem('ibam-auth-email');
        
        if (!userEmail) {
          console.log('No user email in localStorage');
          return;
        }

        console.log('Fetching profile for user:', userEmail);

        // Fetch user profile using API endpoint
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          console.log('✅ Layout: User profile loaded:', profile.first_name, profile.login_source);
        } else {
          console.log('❌ Layout: Profile fetch failed:', response.status);
        }

        // Skip action steps for now - will be loaded when needed
        console.log('Skipping action steps fetch - no user auth yet');
        
        // Update available downloads with empty data
        setAvailableDownloads({
          actions: [],
          sessionData: null,
          businessPlan: null
        });

      } catch (error) {
        console.error('Error in fetchUserData:', error);
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
        
        {/* Admin Menu and Download Modal */}
        <MobileAdminMenu
          userProfile={userProfile}
          onDownloadClick={handleOpenDownloadModal}
        />
        
        <DownloadModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          availableDownloads={availableDownloads}
        />
      </body>
    </html>
  );
}