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
    // Get users from user_profiles table
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, first_name, last_name')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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

    // Update session progress
    const { error } = await supabaseAdmin
      .from('session_progress')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        module_id: moduleId,
        overall_progress: progress,
        completed_sections: progress >= 25 ? ['lookback'] : [],
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
      .eq('id', userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}