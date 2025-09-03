import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';
import type { UserProgress, ModuleProgress, SessionProgress } from '@/lib/services/exportService';

/**
 * API ENDPOINT: Export User Progress Data
 * Provides comprehensive progress data for PDF/report generation
 * Security: User can only access their own data
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const authCookie = request.cookies.get('ibam_auth_server')?.value;
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, first_name, last_name, auth_user_id')
      .eq('email', authCookie)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get module completion data
    const { data: moduleCompletions, error: moduleError } = await supabaseAdmin
      .from('module_completion')
      .select(`
        module_id,
        completion_percentage,
        sessions_completed,
        total_sessions,
        total_time_spent_seconds,
        completed_at,
        last_accessed
      `)
      .eq('user_id', userProfile.auth_user_id)
      .order('module_id');

    if (moduleError) {
      console.error('Module completion fetch error:', moduleError);
    }

    // Get session progress data
    const { data: sessionProgress, error: sessionError } = await supabaseAdmin
      .from('user_session_progress')
      .select(`
        module_id,
        session_id,
        completion_percentage,
        lookback_completed,
        lookup_completed,
        lookforward_completed,
        assessment_completed,
        time_spent_seconds,
        quiz_score,
        last_accessed,
        completed_at
      `)
      .eq('user_id', userProfile.auth_user_id)
      .order('module_id, session_id');

    if (sessionError) {
      console.error('Session progress fetch error:', sessionError);
    }

    // Get session metadata for names
    const { data: sessionMetadata, error: metadataError } = await supabaseAdmin
      .from('session_metadata')
      .select('module_id, session_id, title, description')
      .order('module_id, session_id');

    if (metadataError) {
      console.error('Session metadata fetch error:', metadataError);
    }

    // Module names mapping
    const moduleNames: Record<number, string> = {
      1: 'Foundational Principles',
      2: 'Success & Failure Stories', 
      3: 'Marketing & Customer Development',
      4: 'Financial Management',
      5: 'Business Planning & Strategy'
    };

    // Build comprehensive progress structure
    const modules: ModuleProgress[] = (moduleCompletions || []).map(moduleComp => {
      const moduleSessions = (sessionProgress || [])
        .filter(sp => sp.module_id === moduleComp.module_id);

      const sessions: SessionProgress[] = moduleSessions.map(sp => {
        const metadata = sessionMetadata?.find(sm => 
          sm.module_id === sp.module_id && sm.session_id === sp.session_id
        );

        return {
          sessionId: sp.session_id,
          sessionName: metadata?.title || `Session ${sp.session_id}`,
          completion: sp.completion_percentage || 0,
          sections: {
            lookback: sp.lookback_completed || false,
            lookup: sp.lookup_completed || false,
            lookforward: sp.lookforward_completed || false,
            assessment: sp.assessment_completed || false
          },
          timeSpent: sp.time_spent_seconds || 0,
          quizScore: sp.quiz_score || undefined
        };
      });

      return {
        moduleId: moduleComp.module_id,
        moduleName: moduleNames[moduleComp.module_id] || `Module ${moduleComp.module_id}`,
        completion: moduleComp.completion_percentage || 0,
        sessionsCompleted: moduleComp.sessions_completed || 0,
        totalSessions: moduleComp.total_sessions || 0,
        timeSpent: moduleComp.total_time_spent_seconds || 0,
        completedAt: moduleComp.completed_at || undefined,
        sessions
      };
    });

    // Calculate overall completion
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.completion === 100).length;
    const overallCompletion = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Calculate total time spent
    const totalTimeSpent = modules.reduce((sum, module) => sum + module.timeSpent, 0);

    // Build final progress object
    const progressData: UserProgress = {
      userId: userProfile.auth_user_id,
      email: userProfile.email,
      firstName: userProfile.first_name || 'User',
      lastName: userProfile.last_name || '',
      modules,
      overallCompletion,
      totalTimeSpent,
      completedAt: completedModules === totalModules && totalModules > 0 
        ? modules.filter(m => m.completedAt).sort((a, b) => 
            new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
          )[0]?.completedAt
        : undefined
    };

    // Security headers
    const response = NextResponse.json(progressData);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error: any) {
    console.error('Export progress error:', error);
    return NextResponse.json(
      { error: 'Failed to export progress data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for specific module certificate data
 */
export async function POST(request: NextRequest) {
  try {
    const { moduleId } = await request.json();

    if (!moduleId || typeof moduleId !== 'number') {
      return NextResponse.json(
        { error: 'Valid module ID required' },
        { status: 400 }
      );
    }

    // Get full progress data (reuse GET logic)
    const progressResponse = await GET(request);
    
    if (!progressResponse.ok) {
      return progressResponse;
    }

    const progressData: UserProgress = await progressResponse.json();
    const requestedModule = progressData.modules.find(m => m.moduleId === moduleId);

    if (!requestedModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    if (requestedModule.completion < 100) {
      return NextResponse.json(
        { error: 'Module not completed - certificate not available' },
        { status: 422 }
      );
    }

    // Return user progress with specific module highlighted
    return NextResponse.json({
      ...progressData,
      certificateModule: requestedModule
    });

  } catch (error: any) {
    console.error('Certificate data error:', error);
    return NextResponse.json(
      { error: 'Failed to get certificate data', details: error.message },
      { status: 500 }
    );
  }
}