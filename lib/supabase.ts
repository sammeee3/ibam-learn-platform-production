import { createClient } from '@supabase/supabase-js'

// Debug logging
console.log('=== SUPABASE DEBUG ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')));
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('URL after assignment:', supabaseUrl);
console.log('Key after assignment:', !!supabaseAnonKey);

// Check if they're undefined
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables are undefined');
  console.error('URL undefined:', !supabaseUrl);
  console.error('Key undefined:', !supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase