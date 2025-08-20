import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin API: Getting user list from staging database');

    // Query user_profiles table
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        email, 
        first_name,
        last_name,
        member_type_key,
        primary_role_key,
        has_platform_access,
        is_active,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (profileError) {
      console.error('Error querying user_profiles:', profileError);
      return NextResponse.json({ 
        error: 'Failed to fetch user profiles',
        details: profileError.message 
      }, { status: 500 });
    }

    // Query auth users (requires admin client)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    let authUserCount = 0;
    let authUserList: any[] = [];
    
    if (authError) {
      console.error('Error querying auth users:', authError);
      authUserCount = 0;
      authUserList = [`Error: ${authError.message}`];
    } else if (authUsers?.users) {
      authUserCount = authUsers.users.length;
      authUserList = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        confirmed: !!user.email_confirmed_at,
        lastSignIn: user.last_sign_in_at || 'Never',
        created: user.created_at
      }));
    }

    // Format user profiles for response
    const userProfiles = profiles || [];
    const formattedProfiles = userProfiles.map(user => ({
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No name',
      email: user.email,
      type: user.member_type_key || 'Unknown',
      role: user.primary_role_key || 'Unknown', 
      access: user.has_platform_access ? 'Yes' : 'No',
      status: user.is_active ? 'Active' : 'Inactive',
      created: new Date(user.created_at).toLocaleDateString()
    }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: 'staging (yhfxxouswctucxvfetcq)',
      summary: {
        profileCount: userProfiles.length,
        authCount: authUserCount,
        tablesMatch: userProfiles.length === authUserCount
      },
      userProfiles: formattedProfiles,
      authUsers: authUserList,
      message: `Found ${userProfiles.length} user profiles and ${authUserCount} auth users`
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}