import { createClient } from '@supabase/supabase-js';

// Centralized Super Admin Configuration
export const SUPER_ADMIN_EMAILS = [
  'sammeee@yahoo.com',      // Jeffrey Samuelson - Primary Admin
  'jeff@ibamonline.org',    // IBAM Admin Email
  'admin@ibam.org',         // Organization Admin
];

// Admin permission levels
export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export interface AdminUser {
  email: string;
  role: AdminRole;
  permissions: string[];
}

// Get admin user info
export const getAdminUser = (email: string): AdminUser | null => {
  if (SUPER_ADMIN_EMAILS.includes(email)) {
    return {
      email,
      role: 'super_admin',
      permissions: [
        'admin_dashboard',
        'user_management', 
        'analytics',
        'security_dashboard',
        'webhook_management',
        'deployment_logs',
        'system_configuration'
      ]
    };
  }
  return null;
};

// Check if user has admin access
export const isAdminUser = (email: string): boolean => {
  return SUPER_ADMIN_EMAILS.includes(email);
};

// Check specific permission
export const hasPermission = (email: string, permission: string): boolean => {
  const user = getAdminUser(email);
  return user ? user.permissions.includes(permission) : false;
};

// Client-side auth check hook
export const useAdminAuth = () => {
  const checkAdminAuth = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { 
          isAuthorized: false, 
          error: 'Not logged in',
          redirectTo: '/auth/login'
        };
      }

      const email = user.email || '';
      
      if (!isAdminUser(email)) {
        return { 
          isAuthorized: false, 
          error: 'Insufficient permissions',
          redirectTo: '/dashboard'
        };
      }

      return { 
        isAuthorized: true, 
        user: getAdminUser(email),
        email 
      };
    } catch {
      return { 
        isAuthorized: false, 
        error: 'Authentication failed',
        redirectTo: '/auth/login'
      };
    }
  };

  return { checkAdminAuth };
};

// Server-side auth validation
export const validateAdminAuth = async (request: Request) => {
  try {
    // Extract auth info from request headers or cookies
    // This is a simplified version - implement according to your auth system
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return { 
        isValid: false, 
        error: 'No authorization header',
        status: 401 
      };
    }

    // TODO: Implement proper token validation
    // For now, assume valid if header exists
    const email = 'sammeee@yahoo.com'; // Extract from validated token
    
    if (!isAdminUser(email)) {
      return { 
        isValid: false, 
        error: 'Insufficient permissions',
        status: 403 
      };
    }

    return { 
      isValid: true, 
      user: getAdminUser(email) 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Authentication validation failed',
      status: 500 
    };
  }
};

// Redirect helper for unauthorized access
export const handleUnauthorizedAccess = (router: { push: (path: string) => void }, error: string = 'Access denied') => {
  console.warn(`Unauthorized admin access attempt: ${error}`);
  
  // Log the security incident
  if (typeof window !== 'undefined') {
    // Client-side logging
    fetch('/api/security/log-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'unauthorized_admin_access',
        description: error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    }).catch(console.error);
  }

  // Show alert and redirect
  alert('⛔ Admin access only. This incident has been logged.');
  router.push('/dashboard');
};

// Admin middleware component (React components should be in separate files)
// This is a utility function only - actual React components should be created separately
export const createAdminAuthWrapper = () => {
  // Returns utility functions for components to use
  return {
    checkAuth: async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return { 
            isAuthorized: false, 
            error: 'Not logged in',
            redirectTo: '/auth/login'
          };
        }

        const email = user.email || '';
        
        if (!isAdminUser(email)) {
          return { 
            isAuthorized: false, 
            error: 'Insufficient permissions',
            redirectTo: '/dashboard'
          };
        }

        return { 
          isAuthorized: true, 
          user: getAdminUser(email),
          email 
        };
      } catch (error) {
        return { 
          isAuthorized: false, 
          error: 'Authentication failed',
          redirectTo: '/auth/login'
        };
      }
    }
  };
};

// Export additional utilities
export default {
  SUPER_ADMIN_EMAILS,
  isAdminUser,
  hasPermission,
  getAdminUser,
  useAdminAuth,
  validateAdminAuth,
  handleUnauthorizedAccess,
  createAdminAuthWrapper
};