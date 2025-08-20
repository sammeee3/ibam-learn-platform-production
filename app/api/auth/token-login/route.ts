import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';
import { getSecureConfig } from '@/lib/config/security';
import { validateInput, TokenLoginSchema, sanitizeUserInput } from '@/lib/validation/schemas';

const supabase = supabaseAdmin;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Sanitize and validate input
    const sanitizedBody = sanitizeUserInput(body);
    
    // Validate input schema
    const validation = await validateInput(TokenLoginSchema)(sanitizedBody);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid input: ${validation.error}` 
      }, { status: 400 });
    }
    
    const { email, secret } = validation.data;

    // Use secure configuration
    const config = getSecureConfig();
    const SYSTEME_SECRET = config.auth.systemeSecret;
    
    if (secret !== SYSTEME_SECRET) {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    // Verify user exists
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Generate magic link that goes through YOUR callback
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: 'https://ibam-learn-platform-v3.vercel.app/auth/callback?next=/dashboard'
      }
    });

    if (error || !data?.properties?.action_link) {
      return NextResponse.json({ success: false, error: 'Failed to create magic link' }, { status: 500 });
    }

    console.log('Generated magic link for:', email);

    const response = NextResponse.json({
      success: true,
      loginUrl: data.properties.action_link
    });

    response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('Token login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', 'https://www.ibam.org');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}