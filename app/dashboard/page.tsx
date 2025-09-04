'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, BookOpen, Award, Play, Clock, CheckCircle, Lock, Users, PlaneTakeoff, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import LearningPathOnboarding from '../components/common/LearningPathOnboarding';
import SafeFeedbackWidget from '../components/feedback/SafeFeedbackWidget';

// Supabase configuration - Use environment variables for proper staging/production isolation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// IBAM Logo Component
interface IBAMLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: React.CSSProperties;
}

const IBAMLogo: React.FC<IBAMLogoProps> = ({
  size = 'medium',
  className = '',
  style = {}
}: IBAMLogoProps) => {
  const sizeMap = {
    small: { width: '24px', height: 'auto' },
    medium: { width: '40px', height: 'auto' },
    large: { width: '60px', height: 'auto' },
    xlarge: { width: '120px', height: 'auto' }
  };

  const logoFile = size === 'small'
    ? '/images/branding/mini-logo.png'
    : '/images/branding/ibam-logo.png';

  return (
    <img
      src={logoFile}
      alt="IBAM Logo"
      className={className}
      style={{ ...sizeMap[size], ...style }}
      onError={(e) => {
        e.currentTarget.src = '/images/branding/ibam-logo.png';
      }}
    />
  );
};
// Type Definitions - Fixed to match Supabase return types
interface UserProgressRaw {
 session_id: number;
 completion_percentage: number;
 last_accessed: string; // Updated to match user_session_progress table
 module_id: number;
}

interface UserProgress {
 id: number;
 session_id: number;
 completion_percentage: number;
 completed_at: string | null;
 last_accessed_at: string;
 quiz_score: number | null;
}

interface SessionData {
 id: number;
 module_id: number;
 session_number: number;
 title: string;
 subtitle: string;
}

interface ModuleProgress {
 module_id: number;
 total_sessions: number;
 completed_sessions: number;
 completion_percentage: number;
}

interface RecentActivityRaw {
 session_id: number;
 completion_percentage: number;
 last_accessed_at: string;
 sessions: {
   title: string;
   module_id: number;
   session_number: number;
 };
}

interface RecentActivity {
 session_id: number;
 completion_percentage: number;
 last_accessed_at: string;
 sessions: {
   title: string;
   module_id: number;
   session_number: number;
 };
}

// Known module structure from database
const MODULE_CONFIG = [
 { id: 1, title: "Foundational Principles", sessions: 4, color: "from-blue-400 to-blue-600", description: "Biblical foundations for business" },
 { id: 2, title: "Success and Failure Factors", sessions: 4, color: "from-green-400 to-green-600", description: "Learning from setbacks and victories" },
 { id: 3, title: "Marketing Excellence", sessions: 5, color: "from-purple-400 to-purple-600", description: "Ethical marketing and sales strategies" },
 { id: 4, title: "Financial Management", sessions: 4, color: "from-orange-400 to-orange-600", description: "Biblical approach to business finances" },
 { id: 5, title: "Business Planning", sessions: 5, color: "from-indigo-400 to-indigo-600", description: "Strategic planning with divine guidance" }
];

const IBAMDashboard: React.FC = () => {
  // NEW AUTHENTICATION CODE STARTS HERE
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check for email in URL from SSO redirect
    const email = searchParams?.get('email') || null;
    
    if (email) {
      console.log('📧 Setting up localStorage for email:', email);
      // Set in localStorage for client-side use
      localStorage.setItem('ibam-auth-email', email);
      
      // CRITICAL: Set cookie that middleware expects
      document.cookie = `ibam_auth=${email}; path=/; max-age=${60*60*24*7}; secure; samesite=lax`;
      
      // Redirect to clean dashboard URL (without email in URL)
      setTimeout(() => {
        router.push('/dashboard');
      }, 100); // Small delay to ensure localStorage is set
    }

  }, [searchParams, router]);

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
  // NEW AUTHENTICATION CODE ENDS HERE

  // YOUR EXISTING CODE CONTINUES BELOW
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTrainersModal, setShowTrainersModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [dataSource, setDataSource] = useState<'real' | 'mock'>('mock');
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    login_source: string;
    learning_path?: string;
    learning_mode?: string;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  // Continue Where You Left Off State
  const [continueSession, setContinueSession] = useState<{
    module_id: number;
    session_id: number;
    last_section: string;
    completion_percentage: number;
  } | null>(null);

  // Super Admin Check
  const isSuperAdmin = userProfile?.email === 'sammeee@yahoo.com' || 
                       userProfile?.email === 'sj614+superadmin@proton.me';

  // Fetch last accessed session
  const fetchLastAccessedSession = async (userId: string) => {
    console.log('🔍 Fetching last session for user:', userId);
    
    const { data, error } = await supabase
      .from('user_session_progress')
      .select('module_id, session_id, completion_percentage, last_accessed, last_section')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.log('❌ Error fetching last session:', error);
      return null;
    }

    console.log('✅ Found last session:', data);
    
    return {
      module_id: parseInt(data.module_id || '1'),
      session_id: parseInt(data.session_id || '1'),
      last_section: data.last_section || 'lookback',
      completion_percentage: data.completion_percentage
    };
  };

 // Mock data for fallback - CLEAN SLATE FOR NEW USERS
 const mockModuleProgress: ModuleProgress[] = [
   { module_id: 1, total_sessions: 4, completed_sessions: 0, completion_percentage: 0 },
   { module_id: 2, total_sessions: 4, completed_sessions: 0, completion_percentage: 0 },
   { module_id: 3, total_sessions: 5, completed_sessions: 0, completion_percentage: 0 },
   { module_id: 4, total_sessions: 4, completed_sessions: 0, completion_percentage: 0 },
   { module_id: 5, total_sessions: 5, completed_sessions: 0, completion_percentage: 0 }
 ];

 // CLEAN RECENT ACTIVITY FOR NEW USERS
 const mockRecentActivity: RecentActivity[] = [];

 // Updated trainers array with photo paths
 const trainers = [
   { 
     name: "John", 
     experience: "30+ years", 
     expertise: ["Entrepreneurship", "Cross-Cultural Ministry"], 
     background: "Business mentorship across cultures",
     photoPath: "/john.png"
   },
   { 
     name: "Jeff", 
     experience: "30+ years", 
     expertise: ["Business", "Closed Countries Ministry"], 
     background: "Marketplace ministry in challenging environments",
     photoPath: "/jeff.png"
   },
   { 
     name: "Steve", 
     experience: "30+ years", 
     expertise: ["Retail", "Marketplace Ministry"], 
     background: "Retail industry and faith integration",
     photoPath: "/steve.png"
   },
   { 
     name: "Daniel", 
     experience: "30+ years", 
     expertise: ["Consultancy", "Cross-Cultural Living"], 
     background: "International business consultancy",
     photoPath: "/daniel.png"
   },
   { 
     name: "Roy", 
     experience: "30+ years", 
     expertise: ["Business Ownership", "Family Leadership"], 
     background: "Business ownership and leadership development",
     photoPath: "/roy.png"
   },
   { 
     name: "Dan", 
     experience: "30+ years", 
     expertise: ["Diverse Industries", "Discipleship"], 
     background: "Multi-industry experience and discipleship",
     photoPath: "/dan.png"
   }
 ];

// Get the actual logged-in user ID using custom auth
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Use custom auth system
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
    if (!userEmail) {
      console.log('No user logged in');
      return null;
    }
    
    const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
    const profile = await profileResponse.json();
    if (!profile.id) {
      console.error('User profile not found');
      return null;
    }
    
    console.log('🔍 Profile.id (integer):', profile.id);
    console.log('🔍 Profile.auth_user_id (UUID):', profile.auth_user_id);
    
    // Use integer ID for database queries (user_session_progress table uses integers)
    return String(profile.id); // Returns integer ID for database compatibility
  } catch (error) {
    console.error('Error in getCurrentUserId:', error);
    return null;
  }
};

 // Calculate module progress from raw data
 const calculateModuleProgress = (sessions: SessionData[], progress: UserProgressRaw[]): ModuleProgress[] => {
   const progressMap = new Map<number, { total: number; completed: number }>();
  
   // Initialize all modules
   MODULE_CONFIG.forEach(module => {
     progressMap.set(module.id, { total: module.sessions, completed: 0 });
   });

   // Count actual sessions from database
   sessions.forEach(session => {
     const moduleId = Number(session.module_id);
     if (!progressMap.has(moduleId)) {
       progressMap.set(moduleId, { total: 0, completed: 0 });
     }
     // Update total if different from config (use actual database count)
     const current = progressMap.get(moduleId)!;
     progressMap.set(moduleId, { ...current, total: current.total });
   });

   // Count completed sessions
   progress.forEach(p => {
     const session = sessions.find(s => s.id === p.session_id);
     if (session && p.completion_percentage === 100) {
       const moduleId = Number(session.module_id);
       const current = progressMap.get(moduleId);
       if (current) {
         progressMap.set(moduleId, { ...current, completed: current.completed + 1 });
       }
     }
   });

   // Convert to final format
   return Array.from(progressMap.entries())
     .map(([moduleId, stats]) => ({
       module_id: moduleId,
       total_sessions: stats.total,
       completed_sessions: stats.completed,
       completion_percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
     }))
     .sort((a, b) => a.module_id - b.module_id);
 };

 // Load dashboard data with comprehensive error handling
 const loadDashboardData = async (): Promise<void> => {
   try {
     setLoading(true);
    
     // Get user ID
     const currentUserId = await getCurrentUserId();
     if (!currentUserId) {
       console.log('❌ No current user ID found');
       return;
     }
     
     console.log('✅ Current user ID:', currentUserId);
     setUserId(currentUserId);
    
     // Try to get sessions data
     const { data: sessions, error: sessionsError } = await supabase
       .from('sessions')
       .select('id, module_id, session_number, title, subtitle');
    
     if (sessionsError) {
       throw new Error(`Sessions query failed: ${sessionsError.message}`);
     }

     if (!sessions || sessions.length === 0) {
       console.log('⚠️ No sessions found in database, using mock data');
       setDataSource('mock');
       setModuleProgress(mockModuleProgress);
       setRecentActivity(mockRecentActivity);
       return;
     }

     // Get progress data from server-side API (bypasses RLS issues)
     const dashboardResponse = await fetch(`/api/dashboard?userId=${currentUserId}`);
     const dashboardData = await dashboardResponse.json();
     const progress = dashboardData.progress || [];
     
     if (!dashboardResponse.ok) {
       console.log('⚠️ Dashboard API failed, using mock data');
       setDataSource('mock');
       setModuleProgress(mockModuleProgress);
       setRecentActivity(mockRecentActivity);
       return;
     }

     // Calculate module progress
     const moduleData = calculateModuleProgress(sessions, progress || []);
     setModuleProgress(moduleData);

     // Use progress data for recent activity (already fetched from API)
     const activityData = progress.slice(0, 5); // Get first 5 items
     
     if (activityData && activityData.length > 0) {
       console.log('✅ Using real activity data from API');
       
       // Transform the data - need to get session titles from sessions data
       const transformedActivity: RecentActivity[] = activityData.map((item: any) => {
         // Find matching session from sessions data
         const sessionInfo = sessions.find(s => s.id === item.session_id);
         
         return {
           session_id: item.session_id,
           completion_percentage: item.completion_percentage,
           last_accessed_at: item.updated_at,
           sessions: {
             title: sessionInfo?.title || `Session ${item.session_id}`,
             module_id: item.module_id,
             session_number: sessionInfo?.session_number || 1
           }
         };
       });
       setRecentActivity(transformedActivity);
       setDataSource('real');
     } else {
       console.log('ℹ️ No recent activity found, using mock data');
       setRecentActivity(mockRecentActivity);
     }

     console.log('✅ Dashboard data loaded successfully');
    
   } catch (error) {
     console.error('❌ Error loading dashboard data:', error);
     setDataSource('mock');
     setModuleProgress(mockModuleProgress);
     setRecentActivity(mockRecentActivity);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   loadDashboardData();
 
    // Load continue session data
const loadContinueData = async () => {
  // Use custom auth system
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
  if (userEmail) {
    const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
    const profile = await profileResponse.json();
    if (profile.id) {
      console.log('🔍 Using profile.id for Continue Session:', String(profile.id));
      
      // Use dashboard API instead of direct database query
      const dashboardResponse = await fetch(`/api/dashboard?userId=${profile.id}`);
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        const lastSession = dashboardData.lastSession;
        if (lastSession) {
          setContinueSession({
            module_id: lastSession.module_id,
            session_id: lastSession.session_id,
            last_section: lastSession.last_section || 'lookback',
            completion_percentage: lastSession.completion_percentage
          });
        }
      }
    }
  }
};
    loadContinueData();
}, []);

// Separate useEffect for user profile fetching
useEffect(() => {
  const fetchUserProfile = async () => {
    // Try localStorage first, then cookies
    let userEmail = localStorage.getItem('ibam-auth-email');
    
    if (!userEmail) {
      // Try to get from cookie
      const cookies = document.cookie.split(';');
      console.log('🍪 All cookies:', cookies);
      const authCookie = cookies.find(c => c.trim().startsWith('ibam_auth_server='));
      console.log('🔍 Found auth cookie:', authCookie);
      if (authCookie) {
        userEmail = decodeURIComponent(authCookie.split('=')[1]);
        console.log('📧 Extracted email from cookie:', userEmail);
        // Set in localStorage for future use
        localStorage.setItem('ibam-auth-email', userEmail);
      }
    }
    
    console.log('🔍 Checking for user email (localStorage + cookies):', userEmail);
    
    if (userEmail) {
      try {
        console.log('🔄 Fetching user profile for:', userEmail);
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          console.log('✅ User profile loaded:', profile.first_name, profile.login_source);
          
          // Show onboarding if no learning preferences are set (first time users)
          // Only show for users who haven't seen it before
          const hasSeenOnboarding = localStorage.getItem('ibam-learning-path-onboarding');
          if ((!profile.learning_path || !profile.learning_mode) && !hasSeenOnboarding) {
            setShowOnboarding(true);
          }
        } else {
          console.log('❌ Profile fetch failed:', response.status);
        }
      } catch (error) {
        console.log('❌ Profile fetch error:', error);
      }
    } else {
      console.log('❌ No user email found in localStorage');
    }
  };

  // Delay slightly to ensure localStorage is set after SSO redirect
  const timer = setTimeout(fetchUserProfile, 100);
  return () => clearTimeout(timer);
}, []);

// Close user menu when clicking outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (showUserMenu) {
      const target = event.target as HTMLElement;
      // Don't close if clicking on the dropdown menu itself
      const dropdownMenu = document.querySelector('.user-dropdown-menu');
      const userButton = document.querySelector('.user-menu-button');
      
      if (dropdownMenu && (dropdownMenu.contains(target) || userButton?.contains(target))) {
        return;
      }
      
      setShowUserMenu(false);
    }
  };

  if (showUserMenu) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [showUserMenu]);

// Handle learning preferences selection from onboarding
const handleLearningPathSelect = async (learningPath: 'depth' | 'overview', learningMode: 'individual' | 'group') => {
  if (!userProfile?.email) return;

  try {
    const response = await fetch('/api/user/learning-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userProfile.email,
        learning_path: learningPath,
        learning_mode: learningMode,
      }),
    });

    if (response.ok) {
      // Update local state
      setUserProfile(prev => prev ? { 
        ...prev, 
        learning_path: learningPath,
        learning_mode: learningMode 
      } : null);
      setShowOnboarding(false);
      // Mark onboarding as seen
      localStorage.setItem('ibam-learning-path-onboarding', 'true');
      console.log('✅ Learning preferences saved:', learningPath, learningMode);
    } else {
      console.error('Failed to save learning preferences');
      // Even if save fails, don't show onboarding again
      localStorage.setItem('ibam-learning-path-onboarding', 'true');
      setShowOnboarding(false);
    }
  } catch (error) {
    console.error('Error saving learning preferences:', error);
  }
};

// Logout handler
const handleLogout = async () => {
  try {
    console.log('🚪 Starting logout process');
    
    // Clear all localStorage items
    const localStorageKeys = [
      'ibam-auth-email',
      'ibam_session',
      'ibam_profile',
      'ibam-learning-path-onboarding',
      'ibam-user-data',
      'ibam-auth-token'
    ];
    
    localStorageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear all session storage
    sessionStorage.clear();
    
    // Call logout API to clear server-side session and Supabase auth
    const response = await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.error('Logout API failed:', response.status);
    }
    
    // Clear all cookies on client side as backup
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;`;
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;domain=${window.location.hostname};`;
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;domain=.${window.location.hostname};`;
    });
    
    console.log('✅ Logout complete - redirecting to login');
    
    // Force redirect to login
    window.location.replace('/auth/login');
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Force redirect even if API call fails
    window.location.replace('/auth/login');
  }
};

 // Helper functions
 const getModuleProgress = (moduleId: number): number => {
   const progress = moduleProgress.find(m => m.module_id === moduleId);
   return progress?.completion_percentage ?? 0;
 };

 const getModuleStatus = (moduleId: number): 'completed' | 'in-progress' | 'available' | 'locked' => {
   const progress = getModuleProgress(moduleId);
   if (progress === 100) return 'completed';
   if (progress > 0) return 'in-progress';
   if (moduleId === 1) return 'available';
  
   const prevProgress = getModuleProgress(moduleId - 1);
   return prevProgress === 100 ? 'available' : 'locked';
 };

 const getModuleInfo = (moduleId: number) => {
   return MODULE_CONFIG.find(m => m.id === moduleId) ?? MODULE_CONFIG[0];
 };

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
         <p className="text-gray-600">Loading your dashboard...</p>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Header */}
     <div className="bg-gradient-to-r from-teal-400 to-slate-700 text-white shadow-lg">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <IBAMLogo size="large" />
             <div>
               <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome Back, Entrepreneur{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
              </h1>
               <p className="text-teal-100 mt-1">Your faith-driven business journey continues</p>
             </div>

           </div>
           <div className="hidden sm:flex items-center space-x-4">
             <span className="text-sm">{new Date().toLocaleDateString()}</span>
             
             {/* Developer Info - Only for Super Admins */}
             {isSuperAdmin && (
               <>
                 {/* Database Environment Indicator */}
                 <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                   <div className={`w-2 h-2 rounded-full ${
                     typeof window !== 'undefined' && (
                       window.location.hostname.includes('staging') || 
                       window.location.hostname.includes('ibam-learn-platform-v2.vercel.app')
                     ) ? 'bg-green-400' : 'bg-blue-400'
                   }`}></div>
                   <span className="text-xs font-medium">
                     {typeof window !== 'undefined' && (
                       window.location.hostname.includes('staging') || 
                       window.location.hostname.includes('ibam-learn-platform-v2.vercel.app')
                     ) ? 'STAGING' : 'PRODUCTION'}
                   </span>
                 </div>
               </>
             )}

             {/* Admin Analytics Dashboard Link - Only for super admins */}
             {isSuperAdmin && (
               <a 
                 href="/admin" 
                 className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                 title="Super Admin Command Center"
               >
                 🛡️ Admin Dashboard
               </a>
             )}

             {/* User Profile Dropdown */}
             {userProfile?.email && (
               <div className="relative">
                 <button
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="user-menu-button flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-colors"
                 >
                   <User className="w-4 h-4" />
                   <span className="text-sm font-medium">
                     {userProfile.first_name || userProfile.email.split('@')[0]}
                   </span>
                 </button>
                 
                 {showUserMenu && (
                   <div 
                     className="user-dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                     onClick={(e) => e.stopPropagation()}
                   >
                     <div className="px-4 py-3 border-b">
                       <p className="text-sm font-medium text-gray-900">
                         {userProfile.first_name} {userProfile.last_name}
                       </p>
                       <p className="text-xs text-gray-500">{userProfile.email}</p>
                       <p className="text-xs text-blue-600 mt-1">
                         Source: {userProfile.login_source || 'Direct'}
                       </p>
                     </div>
                     <div className="py-1">
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           console.log('Navigating to /profile');
                           setShowUserMenu(false);
                           router.push('/profile');
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                         View Profile
                       </button>
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           console.log('Navigating to /settings');
                           setShowUserMenu(false);
                           router.push('/settings');
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                         Settings
                       </button>
                       {userProfile.email === 'sammeee@yahoo.com' && (
                         <button
                           onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             console.log('Navigating to /admin');
                             setShowUserMenu(false);
                             router.push('/admin');
                           }}
                           className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-bold"
                         >
                           🛡️ Admin Command Center
                         </button>
                       )}
                       <button
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           console.log('Logging out');
                           setShowUserMenu(false);
                           handleLogout();
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                       >
                         Sign Out
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
       </div>
     </div>

     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Getting Started Banner for New Users */}
       {!continueSession && (
         <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-xl p-8 mb-8 text-white">
           <div className="flex flex-col md:flex-row items-center justify-between">
             <div className="mb-4 md:mb-0">
               <h2 className="text-3xl font-bold mb-2">
                 🎯 New Here? Start Your Journey!
               </h2>
               <p className="text-lg text-blue-100">
                 Learn the IBAM method and choose your learning path
               </p>
             </div>
             
             <a
               href="/getting-started"
               className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center"
             >
               Getting Started Guide
               <ArrowRight className="w-6 h-6 ml-2" />
             </a>
           </div>
         </div>
       )}

       {/* Continue Where You Left Off Section */}
       {continueSession && (
         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-xl mb-8">
           <div className="flex items-center justify-between">
             <div className="text-white">
               <h2 className="text-2xl font-bold mb-2 flex items-center">
                 <Play className="w-8 h-8 mr-3" />
                 Continue Your Journey
               </h2>
               <p className="text-blue-100 text-lg">
                 Module {continueSession.module_id}, Session {continueSession.session_id}
               </p>
               <div className="flex items-center mt-2">
                 <div className="bg-white/20 rounded-full h-2 w-48 mr-3">
                   <div 
                     className="bg-white rounded-full h-2 transition-all"
                     style={{ width: `${continueSession.completion_percentage}%` }}
                   />
                 </div>
                 <span className="text-sm text-blue-100">
                   {continueSession.completion_percentage}% complete
                 </span>
               </div>
             </div>
             
             <button
               onClick={async () => {
                 try {
                   console.log('🎯 Dashboard smart resume triggered');
                   
                   // Get user's session progress to determine where to resume
                   const userEmail = localStorage.getItem('ibam-auth-email');
                   if (userEmail) {
                     const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
                     const profile = await profileResponse.json();
                     
                     if (profile.id) {
                       // Get detailed session progress to determine resume point
                       const progressResponse = await fetch(`/api/progress/session?userId=${profile.id}&sessionId=${continueSession.session_id}`);
                       const progressData = await progressResponse.json();
                       
                       let resumeHash = '';
                       
                       // Smart resume logic based on completion status
                       if (progressData?.sectionCompleted) {
                         const { lookback, lookup, content, quiz, lookforward } = progressData.sectionCompleted;
                         
                         // Resume at the first incomplete section
                         if (!lookback) {
                           resumeHash = '#lookback';
                         } else if (!lookup) {
                           // For Looking Up, check subsection progress
                           if (progressData.subsectionProgress?.lookingUp) {
                             const lookingUpProgress = progressData.subsectionProgress.lookingUp;
                             // Find first incomplete subsection
                             const subsections = ['wealth', 'people', 'reading', 'case', 'practice'];
                             const firstIncomplete = subsections.find(sub => !lookingUpProgress[sub]);
                             resumeHash = firstIncomplete ? `#lookup-${firstIncomplete}` : '#lookup';
                           } else {
                             resumeHash = '#lookup';
                           }
                         } else if (!content) {
                           resumeHash = '#content';
                         } else if (!quiz) {
                           resumeHash = '#quiz';
                         } else if (!lookforward) {
                           resumeHash = '#lookforward';
                         }
                       }
                       
                       // Navigate with smart resume location
                       const targetUrl = `/modules/${continueSession.module_id}/sessions/${continueSession.session_id}${resumeHash}`;
                       console.log(`🚀 Dashboard smart resume: Navigating to ${targetUrl}`);
                       router.push(targetUrl);
                       
                     } else {
                       // Fallback to basic navigation
                       router.push(`/modules/${continueSession.module_id}/sessions/${continueSession.session_id}`);
                     }
                   } else {
                     // No user auth - basic navigation
                     router.push(`/modules/${continueSession.module_id}/sessions/${continueSession.session_id}`);
                   }
                 } catch (error) {
                   console.error('Dashboard resume error:', error);
                   // Fallback to basic navigation on error
                   router.push(`/modules/${continueSession.module_id}/sessions/${continueSession.session_id}`);
                 }
               }}
               className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg flex items-center"
             >
               Continue Session
               <ArrowRight className="w-6 h-6 ml-2" />
             </button>
           </div>
         </div>
       )}


       {/* Course Information with integrated Meet Your Trainers - Moved above modules */}
       <div className="mb-8">
         <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 rounded-xl p-6 border border-blue-200 shadow-lg">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Course Information Side */}
             <div className="space-y-4">
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Want to Learn More?</h3>
               <p className="text-gray-700 text-lg leading-relaxed">Explore our complete course curriculum, meet all trainers, and see success stories.</p>
               <button
                 onClick={() => router.push('/course-info')}
                 className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
               >
                 Course Information
               </button>
             </div>
             
             {/* Meet Your Trainers Side */}
             <div className="space-y-4">
               <div className="flex items-center space-x-3">
                 <Users className="w-8 h-8 text-purple-600" />
                 <h3 className="text-2xl font-bold text-gray-900">Meet Your Trainers</h3>
               </div>
               <p className="text-gray-700 text-lg leading-relaxed">180+ years combined experience guiding entrepreneurs</p>
               <button
                 onClick={() => setShowTrainersModal(true)}
                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
               >
                 View Trainer Profiles
               </button>
             </div>
           </div>
         </div>
       </div>

       {/* Learning Modules */}
       <div className="mb-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Journey</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MODULE_CONFIG.map((module) => {
             const status = getModuleStatus(module.id);
             const progress = getModuleProgress(module.id);
            
             return (
               <div key={module.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200">
                 <div className={`bg-gradient-to-r ${module.color} p-4`}>
                   <div className="flex items-center justify-between text-white">
                     <div className="flex items-center space-x-2">
                       <BookOpen className="w-5 h-5" />
                       <span className="font-semibold">Module {module.id}</span>
                     </div>
                     {status === 'completed' && <CheckCircle className="w-5 h-5" />}
                     {status === 'locked' && <Lock className="w-5 h-5" />}
                   </div>
                 </div>
                
                 <div className="p-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                   <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  
                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                     <span>{module.sessions} Sessions</span>
                     <span>{progress}% Complete</span>
                   </div>
                  
                   <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                     <div
                       className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-300`}
                       style={{ width: `${progress}%` }}
                     ></div>
                   </div>
                  
                   <button
                     onClick={() => router.push(`/modules/${module.id}`)}
                     disabled={status === 'locked'}
                     className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                       status === 'locked'
                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                         : `bg-gradient-to-r ${module.color} text-white hover:shadow-lg hover:scale-105`
                     }`}
                   >
                     {status === 'locked' ? 'Complete Previous Module' :
                      status === 'completed' ? 'Review Module' :
                      status === 'in-progress' ? 'Continue Learning' : 'Start Module'}
                   </button>
                 </div>
               </div>
             );
           })}
           
           {/* Business Planner - Positioned directly after Module 5 in grid */}
           <div 
             onClick={() => router.push('/business-planner')}
             className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
           >
             <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4">
               <div className="flex items-center justify-between text-white">
                 <div className="flex items-center space-x-2">
                   <PlaneTakeoff className="w-5 h-5" />
                   <span className="font-semibold">Business Planner</span>
                 </div>
               </div>
             </div>
            
             <div className="p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Business Plan</h3>
               <p className="text-gray-600 text-sm mb-4">Create your faith-driven business plan with AI-powered guidance</p>
              
               <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                 <span>Interactive Tool</span>
                 <span>Ready to Use</span>
               </div>
              
               <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                 <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full w-full"></div>
               </div>
              
               <button className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:shadow-lg hover:scale-105">
                 Launch Business Planner
               </button>
             </div>
           </div>
           
         </div>
       </div>

       {/* Recent Activity */}
       {recentActivity.length > 0 && (
         <div className="bg-white rounded-xl shadow-sm p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
           <div className="space-y-3">
             {recentActivity.map((activity, index) => (
               <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                 <Play className="w-5 h-5 text-teal-600" />
                 <div className="flex-1">
                   <p className="font-medium text-gray-900">{activity.sessions.title}</p>
                   <p className="text-sm text-gray-500">Module {activity.sessions.module_id} • {activity.completion_percentage}% complete</p>
                 </div>
                 <div className="text-sm text-gray-500">
                   {new Date(activity.last_accessed_at).toLocaleDateString()}
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}
     </div>

     {/* Trainers Modal - UPDATED WITH PHOTOS */}
     {showTrainersModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl max-w-5xl w-full max-h-[80vh] overflow-y-auto">
           <div className="p-6 border-b">
             <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-gray-900">Meet Your Trainers</h2>
               <button
                 onClick={() => setShowTrainersModal(false)}
                 className="text-gray-400 hover:text-gray-600 text-2xl"
               >
                 ✕
               </button>
             </div>
             <p className="text-gray-600 mt-2">180+ years of combined marketplace ministry experience</p>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {trainers.map((trainer, index) => (
               <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                 <div className="flex flex-col items-center text-center">
                   {/* Real Photo */}
                   <div className="w-20 h-20 mb-4 relative overflow-hidden rounded-full border-3 border-teal-200">
                     <img 
                       src={trainer.photoPath}
                       alt={`${trainer.name} - IBAM Trainer`}
                       className="w-full h-full object-cover"
                       onLoad={() => console.log(`✅ Trainer photo loaded: ${trainer.photoPath}`)}
                       onError={(e) => {
                         console.log(`❌ Trainer photo failed: ${trainer.photoPath}`);
                         // Fallback to gradient circle with initials
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         const fallback = target.nextElementSibling as HTMLElement;
                         if (fallback) fallback.style.display = 'flex';
                       }}
                     />
                     {/* Fallback circle - hidden by default */}
                     <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                       {trainer.name[0]}
                     </div>
                   </div>
                   <div>
                     <h3 className="font-semibold text-gray-900 text-lg">{trainer.name}</h3>
                     <p className="text-sm text-teal-600 font-medium mb-3">{trainer.experience}</p>
                   </div>
                 </div>
                 <p className="text-sm text-gray-700 mb-4 text-center">{trainer.background}</p>
                 <div className="flex flex-wrap justify-center gap-2">
                   {trainer.expertise.map((skill, i) => (
                     <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                       {skill}
                     </span>
                   ))}
                 </div>
               </div>
             ))}
           </div>
           <div className="p-6 border-t bg-gray-50 text-center">
             <p className="text-gray-600 mb-4">Ready to learn from these experienced mentors?</p>
             <button
               onClick={() => {
                 setShowTrainersModal(false);
                 router.push('/trainers');
               }}
               className="bg-gradient-to-r from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
             >
               Learn More About Our Team
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Learning Path Onboarding Modal */}
     <LearningPathOnboarding
       isOpen={showOnboarding}
       onClose={() => {
         setShowOnboarding(false);
         localStorage.setItem('ibam-learning-path-onboarding', 'true');
       }}
       onSelect={handleLearningPathSelect}
     />

     {/* Feedback Widget - Always visible */}
     <SafeFeedbackWidget />

     {/* IBAM Footer */}
     <footer className="bg-white border-t border-gray-200 py-8 mt-12">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row items-center justify-between">
           <div className="flex items-center space-x-4 mb-4 md:mb-0">
             <IBAMLogo size="medium" />
             <div className="text-sm text-gray-600">
               <p className="font-semibold">International Business As Mission</p>
               <p>Multiplying Followers of Jesus through marketplace entrepreneurship</p>
             </div>
           </div>
           <div className="flex items-center space-x-6 text-sm text-gray-600">
             <span>© 2025 IBAM</span>
             <a
               href="https://www.ibam.org"
               target="_blank"
               rel="noopener noreferrer"
               className="hover:text-teal-600 transition-colors"
             >
               www.ibam.org
             </a>
           </div>
         </div>
       </div>
     </footer>
   </div>
 );
};

export default IBAMDashboard;