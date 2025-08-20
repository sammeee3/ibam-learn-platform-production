/**
 * Input Validation Schemas
 * 
 * Centralized validation schemas using Zod for all API inputs.
 * This ensures consistent validation across all routes.
 */

import { z } from 'zod';

// Base schemas for common types
export const EmailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .transform(email => email.toLowerCase().trim());

export const TokenSchema = z.string()
  .min(8, 'Token too short')
  .max(200, 'Token too long')
  .regex(/^[a-zA-Z0-9\-_]+$/, 'Invalid token format');

export const NameSchema = z.string()
  .min(1, 'Name required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Invalid characters in name');

// Authentication schemas
export const SSORequestSchema = z.object({
  email: EmailSchema,
  token: TokenSchema,
  source: z.enum(['systemio', 'manual', 'sso', 'test']).optional(),
  clearSession: z.string().optional()
});

export const DirectAuthSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8, 'Password too short').max(128, 'Password too long'),
  rememberMe: z.boolean().optional()
});

export const TokenLoginSchema = z.object({
  email: EmailSchema,
  secret: TokenSchema
});

// Webhook schemas
export const SystemIOWebhookSchema = z.object({
  contact: z.object({
    email: EmailSchema,
    first_name: NameSchema.optional(),
    last_name: NameSchema.optional(),
    id: z.string().optional(),
    fields: z.array(z.object({
      slug: z.string(),
      value: z.any()
    })).optional(),
    tags: z.array(z.object({
      name: z.string(),
      id: z.string().optional()
    })).optional()
  }),
  tag: z.object({
    name: z.string().min(1).max(100),
    id: z.string().optional()
  }).optional(),
  event_type: z.string().optional(),
  timestamp: z.string().optional()
});

export const DonationSchema = z.object({
  donor: z.object({
    firstName: NameSchema,
    lastName: NameSchema,
    email: EmailSchema,
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
    prayerRequests: z.string().max(1000).optional()
  }),
  amount: z.number().min(1, 'Amount must be at least $1').max(50000, 'Amount too large'),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'annual']),
  paymentMethod: z.enum(['credit-card', 'ach']),
  coverFees: z.boolean().optional(),
  paymentDetails: z.object({
    // Credit card fields
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    cardCode: z.string().optional(),
    // ACH fields
    accountType: z.enum(['checking', 'savings']).optional(),
    routingNumber: z.string().length(9).optional(),
    accountNumber: z.string().min(4).max(20).optional(),
    accountHolderName: NameSchema.optional(),
    // Billing
    billingAddress: z.string().max(200).optional(),
    billingCity: z.string().max(100).optional(),
    billingState: z.string().length(2).optional(),
    billingZip: z.string().regex(/^\d{5}(-\d{4})?$/).optional()
  })
});

// User profile schemas
export const UserProfileSchema = z.object({
  email: EmailSchema,
  first_name: NameSchema,
  last_name: NameSchema,
  member_type_key: z.enum(['impact_member', 'startup_business', 'church_leader']),
  primary_role_key: z.enum(['course_student', 'trainer', 'admin']),
  location_country: z.string().max(100).optional(),
  has_platform_access: z.boolean().default(true),
  is_active: z.boolean().default(true)
});

// API request helpers
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Session schemas
export const SessionSchema = z.object({
  userId: z.string().uuid(),
  email: EmailSchema,
  role: z.enum(['student', 'trainer', 'admin']),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.date()
});

/**
 * Validation middleware wrapper
 */
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> => {
    try {
      const validatedData = await schema.parseAsync(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return { 
          success: false, 
          error: `${firstError.path.join('.')}: ${firstError.message}` 
        };
      }
      return { success: false, error: 'Validation failed' };
    }
  };
}

/**
 * Sanitize HTML input to prevent XSS
 */
export function sanitizeHTML(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize user input
 */
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeHTML(input.trim());
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeUserInput(value);
    }
    return sanitized;
  }
  
  return input;
}