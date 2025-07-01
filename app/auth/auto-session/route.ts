import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Get user details
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (!user || !user.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Generate magic link for immediate use
    const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.user.email!,
      options: {
        redirectTo: `${request.nextUrl.origin}${redirect}`
      }
    });

    if (magicLink?.properties?.action_link) {
      // Redirect to the magic link which will log them in
      return NextResponse.redirect(magicLink.properties.action_link);
    }
  } catch (error) {
    console.error('Auto-session error:', error);
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
