'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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

        // Fetch user's action steps from the correct table
        const { data: actionSteps, error: actionsError } = await supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (actionsError) {
          console.error('Error fetching actions:', actionsError);
        } else {
          console.log('Fetched action steps:', actionSteps?.length || 0, 'items');
          
          // Transform the data to match what downloadService expects
          const transformedActions = actionSteps?.map(step => ({
            type: step.action_type || 'business',
            generatedStatement: step.generated_statement,
            smartData: {
              timed: step.timed,
              measurable: step.measurable,
              achievable: step.achievable,
              relevant: step.relevant
            },
            completed: step.completed || false,
            // Include other fields that might be useful
            specificAction: step.specific_action,
            ministryMinded: step.ministry_minded,
            relational: step.relational,
            accountabilityPartner: step.accountability_partner,
            createdAt: step.created_at
          })) || [];

          // Update available downloads
          setAvailableDownloads({
            actions: transformedActions,
            sessionData: null, // TODO: Fetch session data if needed
            businessPlan: null // TODO: Fetch business plan if needed
          });
        }

      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    fetchUserData();
  }, []);

  // Function to refresh data when download modal opens
  const handleOpenDownloadModal = async () => {
    // Refresh data before opening modal
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: actionSteps } = await supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Transform the data
        const transformedActions = actionSteps?.map(step => ({
          type: step.action_type || 'business',
          generatedStatement: step.generated_statement,
          smartData: {
            timed: step.timed,
            measurable: step.measurable,
            achievable: step.achievable,
            relevant: step.relevant
          },
          completed: step.completed || false,
          specificAction: step.specific_action,
          ministryMinded: step.ministry_minded,
          relational: step.relational,
          accountabilityPartner: step.accountability_partner,
          createdAt: step.created_at
        })) || [];

        setAvailableDownloads({
          actions: transformedActions,
          sessionData: null,
          businessPlan: null
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    
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