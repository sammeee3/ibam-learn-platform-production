// Debug Environment Variables Endpoint
export async function GET() {
  return Response.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE')),
    timestamp: new Date().toISOString()
  });
}
