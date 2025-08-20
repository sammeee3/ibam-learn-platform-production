import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';
import { getSecureConfig } from '@/lib/config/security';
import { validateInput, SSORequestSchema, sanitizeUserInput } from '@/lib/validation/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Sanitize and validate input
  const rawData = {
    email: searchParams.get('email'),
    token: searchParams.get('token'),
    source: 'direct-auth'
  };
  
  const sanitizedData = sanitizeUserInput(rawData);
  
  // Validate input schema
  const validation = await validateInput(SSORequestSchema)(sanitizedData);
  
  if (!validation.success) {
    console.error('Direct auth validation failed:', validation.error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  const { email, token } = validation.data;
  
  // Use secure configuration
  const config = getSecureConfig();
  const SYSTEME_SECRET = config.auth.systemeSecret;
  
  if (!email || token !== SYSTEME_SECRET) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = supabaseAdmin;
  
  // Verify user exists
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();
  
  if (!userProfile) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Create response with HTML that sets cookie AND redirects
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center;">
            <h2>Authenticating...</h2>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
        <script>
          // HYBRID COOKIES: Set both server and client cookies
          // Client cookie for UI state (no sensitive data)
          document.cookie = "ibam_auth=authenticated; path=/; max-age=${60*60*24*7}; secure; samesite=lax";
          // Short delay then redirect
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 100);
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      // Server cookie with sensitive data (httpOnly for security)
      'Set-Cookie': `ibam_auth_server=${email}; Path=/; Max-Age=${60*60*24*7}; HttpOnly; Secure; SameSite=Lax`
    }
  });
}