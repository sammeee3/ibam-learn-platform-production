import { createClient } from '@supabase/supabase-js'

// SECURE Supabase configuration - NO HARDCODED CREDENTIALS
// All credentials must be provided via environment variables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization variables
let _supabase: ReturnType<typeof createClient> | null = null
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

// Lazy supabase client getter
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      if (!supabaseUrl) {
        throw new Error('🚨 SECURITY: Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      }
      
      if (!supabaseAnonKey) {
        throw new Error('🚨 SECURITY: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
      }
      
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase[prop as keyof typeof _supabase]
  }
})

// Lazy supabase admin client getter
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      if (!supabaseUrl) {
        throw new Error('🚨 SECURITY: Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      }
      
      if (!supabaseServiceKey) {
        throw new Error('🚨 SECURITY: Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
      }
      
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    }
    return _supabaseAdmin[prop as keyof typeof _supabaseAdmin]
  }
})

// Export individual values for backward compatibility
export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }