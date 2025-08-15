import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  // Use environment variable with fallback for backward compatibility
  const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'ibam-systeme-secret-2025';
  
  if (!email || token !== SYSTEME_SECRET) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
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
          // Set cookie client-side
          document.cookie = "ibam_auth=${email}; path=/; max-age=${60*60*24*7}; secure; samesite=lax";
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
      'Set-Cookie': `ibam_auth=${email}; Path=/; Max-Age=${60*60*24*7}; HttpOnly; Secure; SameSite=Lax`
    }
  });
}