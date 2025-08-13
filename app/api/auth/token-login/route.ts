export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secret } = body;

    if (secret !== 'ibam-systeme-secret-2025') {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Generate magic link with CORRECT redirect
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` // EXPLICIT dashboard redirect
      }
    });

    if (sessionError || !sessionData.properties?.action_link) {
      return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
    }

    // Add token confirmation parameter
    const loginUrl = `${sessionData.properties.action_link}&redirect_to=/dashboard`;

    const response = NextResponse.json({
      success: true,
      loginUrl: loginUrl
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