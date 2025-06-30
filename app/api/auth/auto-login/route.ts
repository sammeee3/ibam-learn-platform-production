import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    
    if (source !== 'systeme.io') {
      return NextResponse.json({ error: 'Invalid source' }, { status: 403 });
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .single();
    
    if (!profile) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    const { data: magicLink, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: '/dashboard'
      }
    });
    
    if (error || !magicLink?.properties?.action_link) {
      return NextResponse.json({ 
        error: 'Could not generate login link' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      loginUrl: magicLink.properties.action_link
    });
    
  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://www.ibam.org',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}