import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // STAGING ONLY: Manually activate user by confirming their email
    console.log('🔧 Manual activation for staging user:', email);

    // Get the user from auth.users
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return NextResponse.json({ message: 'Failed to find user' }, { status: 500 });
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.email_confirmed_at) {
      return NextResponse.json({ message: 'User already verified' }, { status: 200 });
    }

    // Manually confirm the user's email
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          manually_activated: true,
          activation_date: new Date().toISOString()
        }
      }
    );

    if (confirmError) {
      console.error('Error confirming user:', confirmError);
      return NextResponse.json({ message: 'Failed to activate user' }, { status: 500 });
    }

    // Create user profile if it doesn't exist
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: user.id,
        email: email,
        first_name: email.split('@')[0], // Simple default name
        last_name: '',
        created_at: new Date().toISOString(),
        is_active: true,
        has_platform_access: true
      }, { 
        onConflict: 'id' 
      });

    if (profileError) {
      console.log('Profile creation warning:', profileError);
      // Don't fail for profile errors, user is still activated
    }

    console.log('✅ User manually activated:', email);
    
    return NextResponse.json({ 
      message: 'User activated successfully',
      user_id: user.id,
      email: email
    });

  } catch (error) {
    console.error('Manual activation error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}