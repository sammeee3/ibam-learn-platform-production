// app/api/auth/auto-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    
    if (source !== 'systeme.io') {
      return NextResponse.json({ error: 'Invalid source' }, { status: 403, headers: corsHeaders });
    }
    
    // Get user from database
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
    }
    
    // Create a session directly
    const { data: session, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ibam-learn-platform-v3.vercel.app'}/api/auth/session?email=${email}`
      }
    });
    
    // Return direct dashboard URL with session token
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ibam-learn-platform-v3.vercel.app'}/dashboard`;
    
    return NextResponse.json({
      success: true,
      loginUrl: dashboardUrl,
      requiresAuth: true,
      email: email
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ message: 'Auto-login endpoint active', status: 'ready' }, { headers: corsHeaders });
}