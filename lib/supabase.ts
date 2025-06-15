import { createClient } from '@supabase/supabase-js'
import { env } from 'next-runtime-env';

const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL')!
const supabaseAnonKey = env('NEXT_PUBLIC_SUPABASE_ANON_KEY')!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase