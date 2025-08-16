import { NextRequest, NextResponse } from 'next/server';

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
    
    // Go back to direct-access page
    return NextResponse.json({
      success: true,
      loginUrl: 'https://ibam-learn-platform-v3.vercel.app/direct-access'
    }, { headers: corsHeaders });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}
