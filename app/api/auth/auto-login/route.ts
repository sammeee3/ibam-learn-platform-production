// app/api/auth/auto-login/route.ts
// Creates magic links for System.io users

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin
const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CORS headers for all responses
const corsHeaders = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: NextRequest) {
 try {
   const { email, source } = await req.json();
   
   // Verify request is from System.io
   if (source !== 'systeme.io') {
     return NextResponse.json(
       { error: 'Invalid source' }, 
       { status: 403, headers: corsHeaders }
     );
   }
   
   // Check if user exists
   const { data: profile } = await supabase
     .from('user_profiles')
     .select('id, email')
     .eq('email', email)
     .single();
   
   if (!profile) {
     return NextResponse.json({ 
       error: 'User not found. Please wait for account creation.' 
     }, { status: 404, headers: corsHeaders });
   }
   
   // Generate magic link
   const { data: magicLink, error } = await supabase.auth.admin.generateLink({
     type: 'recovery',
     email: email,
     options: {
redirectTo: '/dashboard'
     }
   });
   
   if (error || !magicLink?.properties?.action_link) {
     return NextResponse.json({ 
       error: 'Could not generate login link' 
     }, { status: 500, headers: corsHeaders });
   }
   
   // Return the magic link
   return NextResponse.json({
     success: true,
     loginUrl: magicLink.properties.action_link
   }, { headers: corsHeaders });
   
 } catch (error) {
   console.error('Auto-login error:', error);
   return NextResponse.json({ 
     error: 'Internal server error' 
   }, { status: 500, headers: corsHeaders });
 }
}

// Handle OPTIONS preflight requests
export async function OPTIONS(req: NextRequest) {
 return new NextResponse(null, {
   status: 200,
   headers: corsHeaders,
 });
}

// Handle GET requests (for testing)
export async function GET() {
 return NextResponse.json({ 
   message: 'Auto-login endpoint active. Use POST method.',
   status: 'ready'
 }, { headers: corsHeaders });
}