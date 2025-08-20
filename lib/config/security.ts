/**
 * Secure Configuration Management
 * 
 * This module provides centralized, validated configuration management
 * with environment-specific settings and security controls.
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
  };
  auth: {
    systemeSecret: string;
    jwtSecret?: string;
  };
  security: {
    environment: 'development' | 'staging' | 'production';
    corsOrigins: string[];
    rateLimiting: boolean;
    secretLogging: boolean;
  };
}

/**
 * Validates that all required environment variables are present
 */
function validateEnvironmentVariables(): void {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'IBAM_SYSTEME_SECRET'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`🚨 SECURITY: Missing required environment variables: ${missing.join(', ')}`);
  }

  // Additional validation: Check for production credentials in non-production environments
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const isProduction = process.env.NODE_ENV === 'production';
  const hasProductionDB = supabaseUrl.includes('tutrnikhomrgcpkzszvq');

  if (!isProduction && hasProductionDB) {
    console.warn('⚠️ WARNING: Production database detected in non-production environment');
  }
}

/**
 * Gets the current environment type
 */
function getEnvironment(): 'development' | 'staging' | 'production' {
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.VERCEL_ENV === 'preview') return 'staging';
  return 'development';
}

/**
 * Gets environment-specific CORS origins
 */
function getCorsOrigins(): string[] {
  const environment = getEnvironment();
  
  switch (environment) {
    case 'production':
      return [
        'https://www.ibam.org',
        'https://ibam.org'
      ];
    case 'staging':
      return [
        'https://www.ibam.org',
        'https://ibam.org',
        'https://ibam-learn-platform-staging-v2-jeff-samuelsons-projects.vercel.app'
      ];
    case 'development':
      return [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://www.ibam.org',
        'https://ibam.org'
      ];
    default:
      return [];
  }
}

/**
 * Creates a secure, validated configuration object
 */
export function getSecureConfig(): EnvironmentConfig {
  validateEnvironmentVariables();
  
  const environment = getEnvironment();
  
  return {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
    },
    auth: {
      systemeSecret: process.env.IBAM_SYSTEME_SECRET!,
      jwtSecret: process.env.JWT_SECRET
    },
    security: {
      environment,
      corsOrigins: getCorsOrigins(),
      rateLimiting: environment === 'production',
      secretLogging: environment === 'development' // Only allow in development
    }
  };
}

/**
 * Security logging helper that respects environment settings
 */
export function secureLog(message: string, sensitive: boolean = false): void {
  const config = getSecureConfig();
  
  if (sensitive && !config.security.secretLogging) {
    console.log('[REDACTED] Sensitive information not logged in this environment');
    return;
  }
  
  console.log(message);
}

/**
 * Validates that current environment matches expected environment
 */
export function validateEnvironment(expected: 'development' | 'staging' | 'production'): boolean {
  const current = getEnvironment();
  
  if (current !== expected) {
    console.warn(`⚠️ Environment mismatch: expected ${expected}, got ${current}`);
    return false;
  }
  
  return true;
}

/**
 * Export types for use in other modules
 */
export type { EnvironmentConfig };