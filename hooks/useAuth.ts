import { useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  membership_level?: string;
  membership_features?: any;
  trial_ends_at?: string;
  first_name?: string;
  last_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual auth check
    // For now, simulate loading and set test user
    const timer = setTimeout(() => {
      setUser({ 
        id: 'test-user-123',
        email: 'test@example.com',
        membership_level: 'trial',
        membership_features: { course: true, planner: false }
      });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
}