import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// SUPER ADMIN EMAILS - Add your email(s) here
const SUPER_ADMIN_EMAILS = [
  'sammeee@yahoo.com', // Jeffrey Samuelson
  // Add more admin emails as needed
];

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie/session
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('ibam_auth')?.value ||
                  request.cookies.get('ibam_auth_server')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      // Try to get user from database by email stored in localStorage
      const email = request.headers.get('x-user-email');
      
      if (!email || !SUPER_ADMIN_EMAILS.includes(email)) {
        return NextResponse.json({ error: 'Unauthorized - Admin access only' }, { status: 403 });
      }
    } else if (!SUPER_ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access only' }, { status: 403 });
    }

    // User is authorized - allow access
    return NextResponse.json({ authorized: true });
    
  } catch (error) {
    console.error('Admin auth check error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}