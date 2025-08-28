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
    
    console.log('Received request:', { userId, sessionId, moduleId, progress });

    // Ensure userId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(userId)) {
      console.error('Invalid UUID format:', userId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Get the user_profiles.id for this auth user
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    let userProfileId: number | null = null;
    
    if (profileError || !profile) {
      console.log('User profile not found, will use UUID for session_progress only');
    } else {
      // Check if the profile.id is a number (for user_session_progress table)
      // In some cases it might be the same UUID
      if (typeof profile.id === 'number') {
        userProfileId = profile.id;
      }
    }
    
    const actualUserId = userId; // UUID for session_progress table

    // Parse session ID correctly (e.g., "1-1" means module 1, session 1)
    const [modId, sessId] = sessionId.split('-').map(Number);
    const actualModuleId = Number(modId || moduleId || 1);
    const actualSessionId = Number(sessId || 1);
    
    // Validate that we have valid numbers
    if (isNaN(actualModuleId) || isNaN(actualSessionId)) {
      console.error('Invalid module or session ID:', { moduleId: actualModuleId, sessionId: actualSessionId });
      return NextResponse.json({ error: 'Invalid module or session ID' }, { status: 400 });
    }

    // Calculate which sections are completed based on progress percentage
    const lookbackCompleted = progress >= 25;
    const lookupCompleted = progress >= 50;
    const assessmentCompleted = progress >= 75;
    const lookforwardCompleted = progress === 100;

    // First update the OLD session_progress table for backward compatibility
    // This table uses UUID for user_id and integer for module_id
    await supabaseAdmin
      .from('session_progress')
      .upsert({
        user_id: actualUserId, // UUID
        session_id: sessionId, // String like "1-1"
        module_id: actualModuleId, // Integer
        overall_progress: progress,
        completed_sections: progress >= 25 ? ['lookback', 'lookup', 'quiz', 'lookforward'].slice(0, Math.floor(progress / 25)) : [],
        lookback_completed: lookbackCompleted,
        lookup_completed: lookupCompleted,
        lookforward_completed: lookforwardCompleted,
        quiz_completed: assessmentCompleted,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,session_id'
      });

    // NOW update the CORRECT user_session_progress table that the session page actually reads!
    // The progressTracker service expects the user_id to be the auth UUID
    const progressData: any = {
      user_id: actualUserId, // Use the auth UUID - this is what progressTracker expects!
      module_id: actualModuleId, 
      session_id: actualSessionId,
      lookback_completed: lookbackCompleted,
      lookup_completed: lookupCompleted,
      lookforward_completed: lookforwardCompleted,
      assessment_completed: assessmentCompleted,
      completion_percentage: progress,
      last_accessed: new Date().toISOString(),
      time_spent_seconds: progress * 10,
      video_watch_percentage: progress >= 50 ? 100 : 0,
      quiz_score: assessmentCompleted ? 100 : null,
      quiz_attempts: assessmentCompleted ? 1 : 0
    };

    console.log('Updating user_session_progress with:', progressData);

    const { error: sessionProgressError } = await supabaseAdmin
      .from('user_session_progress')
      .upsert(progressData, {
        onConflict: 'user_id,module_id,session_id'
      });

    if (sessionProgressError) {
      console.error('Error updating user_session_progress:', sessionProgressError);
      // Try to understand the error better
      if (sessionProgressError.message.includes('violates foreign key')) {
        console.error('Foreign key issue - user may not exist in user_profiles table');
      }
      // Don't fail entirely, session_progress was still updated
    } else {
      console.log('Successfully updated user_session_progress table');
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