/**
 * Secure CORS Configuration
 * 
 * Environment-aware CORS settings that provide security without breaking functionality.
 */

import { NextResponse } from 'next/server';
import { getSecureConfig } from '@/lib/config/security';

interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Get CORS configuration based on environment
 */
function getCorsConfig(): CorsOptions {
  const config = getSecureConfig();
  
  return {
    origin: config.security.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  
  // Exact match
  if (allowedOrigins.includes(origin)) return true;
  
  // Pattern matching for development
  if (process.env.NODE_ENV === 'development') {
    return allowedOrigins.some(allowed => 
      allowed.includes('localhost') && origin.includes('localhost')
    );
  }
  
  return false;
}

/**
 * Generate CORS headers for a response
 */
export function corsHeaders(request?: Request): Record<string, string> {
  const config = getCorsConfig();
  const origin = request?.headers.get('origin');
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': config.methods?.join(', ') || 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': config.allowedHeaders?.join(', ') || 'Content-Type',
    'Access-Control-Max-Age': config.maxAge?.toString() || '86400',
    'Vary': 'Origin'
  };
  
  // Set origin header
  if (origin && isOriginAllowed(origin, config.origin as string[])) {
    headers['Access-Control-Allow-Origin'] = origin;
    if (config.credentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
  } else {
    headers['Access-Control-Allow-Origin'] = 'null';
  }
  
  // Security headers
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['X-XSS-Protection'] = '1; mode=block';
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  
  return headers;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handlePreflight(request: Request): NextResponse {
  const headers = corsHeaders(request);
  
  return new NextResponse(null, {
    status: 200,
    headers
  });
}

/**
 * Add CORS headers to a response
 */
export function withCors(response: NextResponse, request?: Request): NextResponse {
  const headers = corsHeaders(request);
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * CORS middleware wrapper for API routes
 */
export function withCorsMiddleware(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handlePreflight(request);
    }
    
    // Call the original handler
    const response = await handler(request, ...args);
    
    // Add CORS headers to the response
    return withCors(response, request);
  };
}

/**
 * Validate request origin for sensitive operations
 */
export function validateOrigin(request: Request, strictMode: boolean = false): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const config = getCorsConfig();
  
  // In strict mode, require both origin and referer
  if (strictMode) {
    if (!origin || !referer) return false;
    
    const refererOrigin = new URL(referer).origin;
    return isOriginAllowed(origin, config.origin as string[]) && 
           isOriginAllowed(refererOrigin, config.origin as string[]);
  }
  
  // Regular mode, check origin or referer
  if (origin) {
    return isOriginAllowed(origin, config.origin as string[]);
  }
  
  if (referer) {
    const refererOrigin = new URL(referer).origin;
    return isOriginAllowed(refererOrigin, config.origin as string[]);
  }
  
  return false;
}

/**
 * Log CORS violations for monitoring
 */
export function logCorsViolation(request: Request, reason: string): void {
  const origin = request.headers.get('origin');
  const userAgent = request.headers.get('user-agent');
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  console.warn('🚨 CORS Violation:', {
    reason,
    origin,
    ip,
    userAgent,
    timestamp: new Date().toISOString()
  });
}