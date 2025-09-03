import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Fetch user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            // Still set basic user info from auth
            setUser({
              id: session.user.id,
              email: session.user.email,
              membership_level: 'trial',
              membership_features: { course: true, planner: false }
            });
          } else {
            // Set full user info from profile
            setUser({
              id: session.user.id,
              email: session.user.email,
              membership_level: profile.membership_tier || 'trial',
              membership_features: profile.membership_features || { course: true, planner: false },
              trial_ends_at: profile.trial_ends_at,
              first_name: profile.first_name,
              last_name: profile.last_name
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile on sign in
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email,
            membership_level: profile?.membership_tier || 'trial',
            membership_features: profile?.membership_features || { course: true, planner: false },
            trial_ends_at: profile?.trial_ends_at,
            first_name: profile?.first_name,
            last_name: profile?.last_name
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signOut };
}