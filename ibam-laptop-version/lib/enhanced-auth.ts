// lib/enhanced-auth.ts
// Enhanced authentication system for IBAM Learning Platform
// Connects Supabase auth with your flexible tier system and existing advanced platform

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// ===================================================
// TYPES AND INTERFACES
// ===================================================

export interface SubscriptionTier {
  tier_key: string;
  display_name: string;
  description: string;
  monthly_price: number;
  tier_level: number;
  badge_color: string;
  badge_icon: string;
  features: any;
  limits: any;
  is_active: boolean;
}

export interface EnhancedUserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  subscription_status: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  trial_end_date?: string;
  systemio_contact_id?: string;
  systemio_subscription_id?: string;
  phone?: string;
  location?: string;
  business_experience?: string;
  church_name?: string;
  church_role?: string;
  is_business_ambassador?: boolean;
  onboarding_completed?: boolean;
  assessment_completed?: boolean;
  current_course_module?: number;
  last_activity?: string;
  ai_interaction_count: number;
  coaching_preferences: any;
  tier_config_cache: any;
  // From tier system
  tier_display_name?: string;
  tier_level?: number;
  badge_color?: string;
  badge_icon?: string;
  tier_features?: any;
  tier_limits?: any;
  created_at: string;
  updated_at: string;
}

// ===================================================
// ENHANCED AUTHENTICATION CLIENT
// ===================================================

export const createEnhancedAuth = () => {
  const supabase = createClientComponentClient();
  
  return {
    // ===================================
    // STANDARD AUTH METHODS
    // ===================================
    
    signUp: async (email: string, password: string, metadata?: any) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      return { data, error };
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    getSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    },

    getUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    },

    // ===================================
    // ENHANCED PROFILE METHODS
    // ===================================

    getEnhancedProfile: async (authUserId?: string): Promise<EnhancedUserProfile | null> => {
      try {
        let userId = authUserId;
        
        // If no userId provided, get current user
        if (!userId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;
          userId = user.id;
        }

        const { data, error } = await supabase
          .from('user_tier_details')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching enhanced profile:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in getEnhancedProfile:', error);
        return null;
      }
    },

    createUserProfile: async (authUser: any, tierKey: string = 'trial'): Promise<{ success: boolean; profile?: any; error?: string }> => {
      try {
        const profileData = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          subscription_tier: tierKey,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          onboarding_completed: false,
          assessment_completed: false,
          current_course_module: 1,
          ai_interaction_count: 0,
          coaching_preferences: {},
          tier_config_cache: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) throw error;

        console.log('✅ User profile created:', data.id);
        return { success: true, profile: data };
      } catch (error) {
        console.error('❌ Error creating user profile:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    },

    // ===================================
    // TIER MANAGEMENT
    // ===================================

    getAllTiers: async (): Promise<SubscriptionTier[]> => {
      try {
        const { data, error } = await supabase
          .from('member_types')
          .select('*')
          .eq('is_active', true)
          .order('tier_level');

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching tiers:', error);
        return [];
      }
    },

    getTierByKey: async (tierKey: string): Promise<SubscriptionTier | null> => {
      try {
        const { data, error } = await supabase
          .from('member_types')
          .select('*')
          .eq('tier_key', tierKey)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching tier:', error);
        return null;
      }
    },

    // ===================================
    // ACCESS CONTROL
    // ===================================

    canUserAccessFeature: async (userId: string, featureName: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase
          .rpc('can_user_access_feature', {
            p_user_id: userId,
            p_feature_name: featureName
          });

        if (error) throw error;
        return data === true;
      } catch (error) {
        console.error('Error checking feature access:', error);
        return false;
      }
    }
  };
};

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

export const getTierBadge = (tier: SubscriptionTier) => {
  return {
    label: tier.display_name,
    color: `bg-${tier.badge_color}-100 text-${tier.badge_color}-800`,
    icon: tier.badge_icon,
    level: tier.tier_level
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const canUserUpgradeTo = (currentTierLevel: number, targetTierLevel: number): boolean => {
  return targetTierLevel > currentTierLevel;
};

export const getUserTierStatus = (profile: EnhancedUserProfile) => {
  const now = new Date();
  const trialEnd = profile.trial_end_date ? new Date(profile.trial_end_date) : null;
  const subscriptionEnd = profile.subscription_end_date ? new Date(profile.subscription_end_date) : null;

  if (profile.subscription_tier === 'trial') {
    if (trialEnd && now > trialEnd) {
      return { status: 'trial_expired', message: 'Trial has expired' };
    } else {
      const daysLeft = trialEnd ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return { status: 'trial_active', message: `${daysLeft} days left in trial` };
    }
  }

  if (subscriptionEnd && now > subscriptionEnd) {
    return { status: 'subscription_expired', message: 'Subscription has expired' };
  }

  return { status: 'active', message: 'Subscription active' };
};

// ===================================================
// EXPORT MAIN HOOK
// ===================================================

export const useEnhancedAuth = () => createEnhancedAuth();