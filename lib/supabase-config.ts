import { createClient } from '@supabase/supabase-js'

// Centralized Supabase configuration with staging fallbacks
// This ensures all API routes work during build time while maintaining proper environment separation

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhfxxouswctucxvfetcq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTgwNTMsImV4cCI6MjAzOTgzNDA1M30.VFU7vCVXxnLWrkqx_iwJjBaKzHl5iKJOS1q5J9jpPsg'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inloa3h4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'

// Export configured clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Export individual values for backward compatibility
export { supabaseUrl, supabaseAnonKey, supabaseServiceKey }