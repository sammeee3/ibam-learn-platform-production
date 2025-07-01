import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { email, secret } = await request.json();
    
    if (secret !== 'ibam-systeme-secret-2025') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401, headers: corsHeaders });
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error || !data) {
      return NextResponse.json({ error: 'Failed to get users' }, { status: 500, headers: corsHeaders });
    }
    
    const user = data.users.find((u: any) => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
    }
    
    // Use the auto-session route instead
    return NextResponse.json({
      success: true,
      loginUrl: `https://ibam-learn-platform-v3.vercel.app/auth/auto-session?userId=${user.id}&redirect=/dashboard`
    }, { headers: corsHeaders });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}
