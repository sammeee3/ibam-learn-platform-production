import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'sammeee@yahoo.com';
    
    console.log(`Checking progress tables for: ${email}`);
    
    const supabase = supabaseAdmin;
    
    // 1. Find user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json({
        error: `User not found with email: ${email}`,
        details: profileError?.message
      }, { status: 404 });
    }

    // 2. Check user_progress table (should have data)
    const { data: userProgressData, error: userProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', String(userProfile.id))
      .order('updated_at', { ascending: false });

    // 3. Check user_session_progress table (should be empty)  
    const { data: sessionProgressData, error: sessionProgressError } = await supabase
      .from('user_session_progress')
      .select('*')
      .eq('user_id', parseInt(String(userProfile.id)))
      .order('updated_at', { ascending: false });

    // 4. Check module_completions table
    const { data: moduleCompletions, error: moduleError } = await supabase
      .from('module_completions')
      .select('*')
      .eq('user_id', String(userProfile.id))
      .order('module_id');

    // 5. Count action steps
    const { count: actionCount } = await supabase
      .from('user_action_steps')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', String(userProfile.id));

    return NextResponse.json({
      success: true,
      email,
      generatedAt: new Date().toISOString(),
      userInfo: {
        id: userProfile.id,
        email: userProfile.email,
        fullName: userProfile.full_name,
        createdAt: userProfile.created_at,
        lastActivity: userProfile.updated_at
      },
      progressTables: {
        user_progress: {
          recordCount: userProgressData?.length || 0,
          hasData: (userProgressData?.length || 0) > 0,
          data: userProgressData || [],
          error: userProgressError?.message
        },
        user_session_progress: {
          recordCount: sessionProgressData?.length || 0,
          hasData: (sessionProgressData?.length || 0) > 0,
          data: sessionProgressData || [],
          error: sessionProgressError?.message
        },
        module_completions: {
          recordCount: moduleCompletions?.length || 0,
          hasData: (moduleCompletions?.length || 0) > 0,
          data: moduleCompletions || [],
          error: moduleError?.message
        },
        user_action_steps: {
          recordCount: actionCount || 0,
          hasData: (actionCount || 0) > 0
        }
      },
      summary: {
        userExists: true,
        hasProgressData: (userProgressData?.length || 0) > 0,
        hasSessionProgressData: (sessionProgressData?.length || 0) > 0,
        totalSessions: userProgressData?.length || 0,
        completedSessions: userProgressData?.filter(p => p.completion_percentage === 100).length || 0,
        totalActions: actionCount || 0,
        lastProgressUpdate: userProgressData?.[0]?.updated_at || userProgressData?.[0]?.last_accessed
      }
    });

  } catch (error) {
    console.error('Progress table check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check progress tables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}