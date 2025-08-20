import { createClient } from '@supabase/supabase-js'

// SECURE Supabase configuration - NO HARDCODED CREDENTIALS
// All credentials must be provided via environment variables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('🚨 SECURITY: Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('🚨 SECURITY: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('🚨 SECURITY: Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Export configured clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Export individual values for backward compatibility
export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }