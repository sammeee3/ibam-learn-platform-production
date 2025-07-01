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
    
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
    }
    
    return NextResponse.json({
      success: true,
      loginUrl: `https://ibam-learn-platform-v3.vercel.app/dashboard?userId=${user.id}`
    }, { headers: corsHeaders });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}