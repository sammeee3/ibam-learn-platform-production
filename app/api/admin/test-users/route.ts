import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client with service role key
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

export async function GET(request: NextRequest) {
  try {
    // First try to get real auth users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 50
    });

    if (authData && authData.users && authData.users.length > 0) {
      console.log('Found auth users:', authData.users.length);
      const users = authData.users.map(user => ({
        id: user.id, // This should be a proper UUID
        email: user.email || 'No email',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || ''
      }));
      return NextResponse.json({ users });
    }

    // Fallback to user_profiles table
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, first_name, last_name')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('User profiles found:', profiles?.length || 0);

    // If no profiles exist, create a test user
    if (!profiles || profiles.length === 0) {
      // Create test user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: 'sammeee@yahoo.com',
        email_confirm: true,
        user_metadata: {
          first_name: 'Jeff',
          last_name: 'Samuelson'
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return NextResponse.json({ 
          users: [{
            id: 'test-user-1',
            email: 'sammeee@yahoo.com',
            first_name: 'Jeff',
            last_name: 'Samuelson'
          }]
        });
      }

      if (authUser) {
        // Create user profile
        await supabaseAdmin
          .from('user_profiles')
          .upsert({
            id: authUser.user.id,
            email: 'sammeee@yahoo.com',
            first_name: 'Jeff',
            last_name: 'Samuelson',
            pre_assessment_completed: true
          });

        return NextResponse.json({ 
          users: [{
            id: authUser.user.id,
            email: 'sammeee@yahoo.com',
            first_name: 'Jeff',
            last_name: 'Samuelson'
          }]
        });
      }
    }

    return NextResponse.json({ users: profiles });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, moduleId, progress } = body;

    // Check if userId is a valid UUID or needs conversion
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let actualUserId = userId;
    
    // If it's not a UUID, try to find the actual user
    if (!uuidRegex.test(userId)) {
      console.log('Non-UUID user ID received:', userId);
      
      // Try to find user by the numeric ID in user_profiles
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (profile) {
        actualUserId = profile.id;
        console.log('Found user profile with ID:', actualUserId);
      } else {
        // Create a new user if not found
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: `test-user-${userId}@example.com`,
          email_confirm: true
        });
        
        if (authError) {
          console.error('Error creating user:', authError);
          return NextResponse.json({ error: 'Could not find or create user' }, { status: 400 });
        }
        
        actualUserId = authUser.user.id;
        console.log('Created new user with UUID:', actualUserId);
      }
    }

    // Calculate sections based on progress
    let completedSections: string[] = [];
    if (progress >= 25) completedSections.push('lookback');
    if (progress >= 50) completedSections.push('lookup');
    if (progress >= 75) completedSections.push('quiz');
    if (progress === 100) completedSections.push('lookforward');

    // Update session progress
    const { error } = await supabaseAdmin
      .from('session_progress')
      .upsert({
        user_id: actualUserId,
        session_id: sessionId,
        module_id: moduleId,
        overall_progress: progress,
        completed_sections: completedSections,
        lookback_completed: progress >= 25,
        lookup_completed: progress >= 50,
        lookforward_completed: progress === 100,
        quiz_completed: progress >= 75,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,session_id'
      });

    if (error) {
      console.error('Error updating progress:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also mark pre-assessment as completed
    await supabaseAdmin
      .from('user_profiles')
      .update({ 
        pre_assessment_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', actualUserId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}