import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json(
    {
      message: 'Auto-login endpoint is active',
      method: 'Please use POST method with email in the body',
      endpoint: '/api/auth/auto-login',
      expectedBody: {
        email: 'user@example.com'
      }
    },
    {
      status: 200,
      headers: corsHeaders
    }
  );
}

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user from database - Fix the type issue here
    const { data: listUsersResponse, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError || !listUsersResponse) {
      console.error('Error listing users:', listError);
      return NextResponse.json(
        { error: 'Failed to retrieve users' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Now we can safely access the users array
    const user = listUsersResponse.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Generate magic link
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      }
    });

    if (magicLinkError || !magicLinkData) {
      console.error('Error generating magic link:', magicLinkError);
      return NextResponse.json(
        { error: 'Failed to generate magic link' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Return the magic link URL
    return NextResponse.json(
      {
        success: true,
        url: magicLinkData.properties.action_link,
        // Alternative naming for compatibility
        magicLink: magicLinkData.properties.action_link
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}