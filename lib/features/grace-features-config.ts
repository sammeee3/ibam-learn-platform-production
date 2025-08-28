// Grace Features Configuration
// This allows gradual rollout without breaking existing functionality

export interface GraceFeatureFlags {
  // Core Features
  enableGraceSystem: boolean;
  enableKingdomPurpose: boolean;
  enableActionBalance: boolean;
  enableSabbathSessions: boolean;
  enableGraceRelease: boolean;
  
  // UI Enhancements
  showEncouragementMessages: boolean;
  showStreakIndicators: boolean;
  showKingdomFilter: boolean;
  showBalanceWarnings: boolean;
  
  // Rollout Settings
  rolloutPercentage: number; // 0-100
  testUserEmails: string[]; // Specific users to always show features
  excludedUserEmails: string[]; // Users to never show features
}

// Default configuration - start conservative
const defaultConfig: GraceFeatureFlags = {
  // Start with UI enhancements only (low risk)
  enableGraceSystem: false,
  enableKingdomPurpose: true, // Just adds optional field
  enableActionBalance: false,
  enableSabbathSessions: false,
  enableGraceRelease: false,
  
  // Safe UI additions
  showEncouragementMessages: true,
  showStreakIndicators: true,
  showKingdomFilter: false,
  showBalanceWarnings: false,
  
  // Gradual rollout
  rolloutPercentage: 0, // Start at 0%
  testUserEmails: [
    'sammeee@yahoo.com', // You can test first
    'jeff@ibamonline.org'
  ],
  excludedUserEmails: []
};

// Environment-specific configurations
const configs = {
  development: {
    ...defaultConfig,
    enableGraceSystem: true,
    enableKingdomPurpose: true,
    enableActionBalance: true,
    showKingdomFilter: true,
    showBalanceWarnings: true,
    rolloutPercentage: 100 // All features in dev
  },
  staging: {
    ...defaultConfig,
    enableKingdomPurpose: true,
    showEncouragementMessages: true,
    showStreakIndicators: true,
    rolloutPercentage: 10 // 10% of staging users
  },
  production: {
    ...defaultConfig,
    rolloutPercentage: 0 // Start with test users only
  }
};

// Get current environment config
export function getGraceFeatures(): GraceFeatureFlags {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
  return configs[env as keyof typeof configs] || defaultConfig;
}

// Check if user should see grace features
export function shouldShowGraceFeatures(userEmail?: string): boolean {
  const config = getGraceFeatures();
  
  // Check if user is in test group
  if (userEmail && config.testUserEmails.includes(userEmail)) {
    return true;
  }
  
  // Check if user is excluded
  if (userEmail && config.excludedUserEmails.includes(userEmail)) {
    return false;
  }
  
  // Random rollout based on percentage
  if (config.rolloutPercentage > 0) {
    // Use email hash for consistent experience per user
    const hash = userEmail ? 
      userEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
      Math.random() * 100;
    return (hash % 100) < config.rolloutPercentage;
  }
  
  return false;
}

// Individual feature checks
export function isFeatureEnabled(feature: keyof GraceFeatureFlags, userEmail?: string): boolean {
  if (!shouldShowGraceFeatures(userEmail)) {
    return false;
  }
  
  const config = getGraceFeatures();
  return config[feature] as boolean;
}