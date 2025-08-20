import { createClient } from '@supabase/supabase-js'

// Secure debug logging (development only)
const isDevelopment = process.env.NODE_ENV === 'development'
if (isDevelopment) {
  console.log('=== SUPABASE DEBUG (DEV ONLY) ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('SUPABASE_URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_KEY configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  // URLs and keys never logged for security
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (isDevelopment) {
  console.log('Configuration loaded successfully');
}

// Check if configuration is missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please check environment variables are set correctly');
  throw new Error('Supabase configuration incomplete');
}

// Create Supabase client
let supabase;
try {
  if (isDevelopment) {
    console.log('🔧 Creating Supabase client...');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  if (isDevelopment) {
    console.log('✅ Supabase client created successfully');
  }
} catch (error) {
  console.error('❌ Supabase client creation failed:', error);
  throw error;
}

export { supabase };
export default supabase;