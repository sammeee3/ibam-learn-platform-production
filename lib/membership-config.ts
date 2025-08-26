/**
 * IBAM Membership Configuration
 * Centralized pricing and tier configuration
 * Easy to update without changing code throughout the app
 */

// Get prices from environment variables with defaults
// This allows changing prices without redeploying code
const getPriceFromEnv = (key: string, defaultValue: number): number => {
  const envValue = process.env[key];
  return envValue ? parseFloat(envValue) : defaultValue;
};

export const MEMBERSHIP_CONFIG = {
  // Individual Memberships (7-day trial)
  ibam_member: {
    name: 'IBAM Impact Members',
    tagName: 'IBAM Impact Members', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_IBAM_MONTHLY', 10),
    annualPrice: getPriceFromEnv('PRICE_IBAM_ANNUAL', 100),
    trialDays: 7,
    features: {
      course: true,
      planner: false,
      export: false,
      analytics: false,
    },
    description: 'Access to IBAM course content',
  },
  
  entrepreneur: {
    name: 'Entrepreneur Member',
    tagName: 'Entrepreneur Member', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_ENTREPRENEUR_MONTHLY', 20),
    annualPrice: getPriceFromEnv('PRICE_ENTREPRENEUR_ANNUAL', 200),
    trialDays: 7,
    features: {
      course: true,
      planner: true,
      export: true,
      analytics: true,
    },
    description: 'Full access to course and business planner',
  },
  
  business: {
    name: 'Business Member',
    tagName: 'Business Member', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_BUSINESS_MONTHLY', 59),
    annualPrice: getPriceFromEnv('PRICE_BUSINESS_ANNUAL', 590),
    trialDays: 7,
    features: {
      course: true,
      planner: true,
      export: true,
      analytics: true,
      advancedFeatures: true,
      teamAccess: true,
    },
    description: 'Premium features for business owners',
  },
  
  // Church Partnerships (30-day trial)
  church_small: {
    name: 'Small Church Partner',
    tagName: 'Church Partner Small', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_CHURCH_SMALL_MONTHLY', 49),
    annualPrice: getPriceFromEnv('PRICE_CHURCH_SMALL_ANNUAL', 490),
    trialDays: 30,
    features: {
      course: true,
      planner: true,
      export: true,
      analytics: true,
      adminPortal: true,
      maxStudents: 250,
      ambassadorAccess: true,
    },
    description: 'For churches up to 250 members',
  },
  
  church_large: {
    name: 'Large Church Partner',
    tagName: 'Church Partner Large', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_CHURCH_LARGE_MONTHLY', 150),
    annualPrice: getPriceFromEnv('PRICE_CHURCH_LARGE_ANNUAL', 1500),
    trialDays: 30,
    features: {
      course: true,
      planner: true,
      export: true,
      analytics: true,
      adminPortal: true,
      maxStudents: 1000,
      ambassadorAccess: true,
      prioritySupport: true,
    },
    description: 'For churches up to 1000 members',
  },
  
  church_mega: {
    name: 'Mega Church Partner',
    tagName: 'Church Partner Mega', // System.io tag
    monthlyPrice: getPriceFromEnv('PRICE_CHURCH_MEGA_MONTHLY', 500),
    annualPrice: getPriceFromEnv('PRICE_CHURCH_MEGA_ANNUAL', 5000),
    trialDays: 30,
    features: {
      course: true,
      planner: true,
      export: true,
      analytics: true,
      adminPortal: true,
      maxStudents: null, // Unlimited
      ambassadorAccess: true,
      prioritySupport: true,
      customBranding: true,
    },
    description: 'For churches over 1000 members',
  },
  
  // Trial membership
  trial: {
    name: 'Trial Member',
    tagName: 'Trial Member', // System.io tag
    monthlyPrice: 0,
    annualPrice: 0,
    trialDays: 7, // Default trial length
    features: {
      course: true,
      planner: 'preview', // Can view but not save
      export: false,
      analytics: false,
    },
    description: 'Limited time trial access',
  },
};

// Helper functions for membership operations
export const MembershipUtils = {
  // Get membership tier by System.io tag
  getTierByTag(tagName: string) {
    return Object.values(MEMBERSHIP_CONFIG).find(tier => tier.tagName === tagName);
  },
  
  // Get membership tier by key
  getTierByKey(key: string) {
    return MEMBERSHIP_CONFIG[key as keyof typeof MEMBERSHIP_CONFIG];
  },
  
  // Calculate savings for annual vs monthly
  calculateAnnualSavings(tier: keyof typeof MEMBERSHIP_CONFIG) {
    const config = MEMBERSHIP_CONFIG[tier];
    const monthlyTotal = config.monthlyPrice * 12;
    const annualPrice = config.annualPrice;
    return monthlyTotal - annualPrice;
  },
  
  // Check if user has access to feature
  hasFeatureAccess(tierKey: string, feature: string): boolean {
    const tier = MEMBERSHIP_CONFIG[tierKey as keyof typeof MEMBERSHIP_CONFIG];
    if (!tier) return false;
    return tier.features[feature as keyof typeof tier.features] === true;
  },
  
  // Get trial end date from start date
  getTrialEndDate(tierKey: string, startDate: Date = new Date()): Date {
    const tier = MEMBERSHIP_CONFIG[tierKey as keyof typeof MEMBERSHIP_CONFIG];
    if (!tier) return startDate;
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + tier.trialDays);
    return endDate;
  },
  
  // Format price for display
  formatPrice(amount: number, period: 'monthly' | 'annual' = 'monthly'): string {
    if (period === 'annual') {
      return `$${amount}/year`;
    }
    return `$${amount}/month`;
  },
  
  // Check if membership should auto-renew
  shouldAutoRenew(cancelledAt: Date | null): boolean {
    return cancelledAt === null;
  },
};

// Export type for TypeScript
export type MembershipTier = typeof MEMBERSHIP_CONFIG[keyof typeof MEMBERSHIP_CONFIG];
export type MembershipKey = keyof typeof MEMBERSHIP_CONFIG;