import { createClient } from '@supabase/supabase-js'

let _supabase: ReturnType<typeof createClient> | null = null;

// Lazy initialization to prevent build-time environment variable requirements
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration incomplete');
      }
      
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase[prop as keyof typeof _supabase];
  }
});

export default supabase;