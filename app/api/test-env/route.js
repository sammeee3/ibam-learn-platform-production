export async function GET() {
  return Response.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    allSupabaseVars: Object.keys(process.env).filter(key => key.startsWith('SUPABASE')),
    timestamp: new Date().toISOString()
  });
}
