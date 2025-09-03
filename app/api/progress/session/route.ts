import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('🔍 Incoming request body:', JSON.stringify(requestBody, null, 2));
    
    const {
      userId,
      moduleId,
      sessionId,
      section,
      sectionCompleted,
      timeSpentSeconds = 0,
      videoWatchPercentage,
      quizScore,
      quizAttempts,
      subsectionProgress // NEW: Track individual subsection progress
    } = requestBody;

    // Enhanced validation with type checking
    if (!userId || !moduleId || !sessionId) {
      console.error('❌ Missing required fields:', { userId, moduleId, sessionId });
      return NextResponse.json(
        { error: 'Missing required fields: userId, moduleId, sessionId' }, 
        { status: 400 }
      );
    }
    
    // Ensure proper data types
    const validUserId = String(userId);
    const validModuleId = parseInt(String(moduleId));
    const validSessionId = parseInt(String(sessionId));
    
    if (isNaN(validModuleId) || isNaN(validSessionId)) {
      console.error('❌ Invalid moduleId or sessionId:', { moduleId, sessionId, validModuleId, validSessionId });
      return NextResponse.json(
        { error: 'Invalid moduleId or sessionId format' }, 
        { status: 400 }
      );
    }

    console.log('🔄 Server-side progress update for:', { validUserId, validModuleId, validSessionId, section });

    // Use admin client to bypass RLS
    const supabase = supabaseAdmin;

    // Get existing progress or create new
    const { data: existing } = await supabase
      .from('user_session_progress')
      .select('*')
      .eq('user_id', validUserId)
      .eq('module_id', validModuleId)
      .eq('session_id', validSessionId)
      .single();

    const currentProgress = existing || {
      lookback_completed: false,
      lookup_completed: false,
      lookforward_completed: false,
      assessment_completed: false,
      time_spent_seconds: 0,
      quiz_attempts: 0,
      video_watch_percentage: 0
    };

    // Update section completion status
    const updatedProgress: any = {
      user_id: validUserId,
      module_id: validModuleId,
      session_id: validSessionId,
      last_section: section || currentProgress.last_section,
      lookback_completed: sectionCompleted?.lookback ?? currentProgress.lookback_completed,
      lookup_completed: sectionCompleted?.lookup ?? currentProgress.lookup_completed,
      lookforward_completed: sectionCompleted?.lookforward ?? currentProgress.lookforward_completed,
      assessment_completed: sectionCompleted?.assessment ?? currentProgress.assessment_completed,
      time_spent_seconds: (currentProgress.time_spent_seconds || 0) + (timeSpentSeconds || 0),
      video_watch_percentage: Math.max(
        currentProgress.video_watch_percentage || 0,
        videoWatchPercentage || 0
      ),
      quiz_score: quizScore ?? currentProgress.quiz_score,
      quiz_attempts: (currentProgress.quiz_attempts || 0) + (quizAttempts || 0),
      last_accessed: new Date().toISOString(),
      // 🔧 CRITICAL FIX: Store individual subsection progress for persistence
      looking_up_subsections: subsectionProgress?.lookingUp || currentProgress.looking_up_subsections || {},
      // 🎯 NEW: Store individual Looking Forward subsection progress 
      looking_forward_subsections: subsectionProgress?.lookingForward || currentProgress.looking_forward_subsections || {}
    };

    // Calculate completion percentage with granular subsection progress
    // Each main section: ~33% (Looking Back, Looking Up, Looking Forward)
    // Looking Up has 5 active subsections: wealth, people, reading, case, practice (integrate is hidden/auto-complete)
    
    let totalProgress = 0;
    
    // Looking Back (33% if complete)
    if (updatedProgress.lookback_completed) {
      totalProgress += 33;
    }
    
    // Looking Up (33% with granular subsection tracking)
    if (updatedProgress.lookup_completed) {
      totalProgress += 33; // All subsections complete
    } else if (subsectionProgress?.lookingUp) {
      // Calculate granular Looking Up progress based on completed subsections
      const lookupSubsections = ['wealth', 'people', 'reading', 'case', 'practice']; // 5 visible subsections
      const completedCount = lookupSubsections.filter(sub => subsectionProgress.lookingUp[sub]).length;
      const lookupProgress = (completedCount / lookupSubsections.length) * 33;
      totalProgress += lookupProgress;
      
      console.log(`📊 Looking Up granular progress: ${completedCount}/${lookupSubsections.length} = ${Math.round(lookupProgress)}%`);
    }
    
    // Looking Forward (33% if complete, or granular based on 3 parts)
    if (updatedProgress.lookforward_completed) {
      totalProgress += 33; // All 3 parts complete
    } else if (subsectionProgress?.lookingForward) {
      // Calculate granular Looking Forward progress based on 3 parts
      const lookForwardParts = ['business_actions_completed', 'spiritual_integration_completed', 'sharing_person_completed'];
      const forwardCompletedCount = lookForwardParts.filter(part => subsectionProgress.lookingForward[part]).length;
      const forwardProgress = (forwardCompletedCount / lookForwardParts.length) * 33;
      totalProgress += forwardProgress;
      
      console.log(`📊 Looking Forward granular progress: ${forwardCompletedCount}/${lookForwardParts.length} = ${Math.round(forwardProgress)}%`);
    }
    
    updatedProgress.completion_percentage = Math.min(100, Math.round(totalProgress));
    
    console.log(`📊 Total session progress: ${updatedProgress.completion_percentage}% (Looking Back: ${updatedProgress.lookback_completed ? '✅' : '❌'}, Looking Up: ${updatedProgress.lookup_completed ? '✅' : Math.round((subsectionProgress?.lookingUp ? Object.values(subsectionProgress.lookingUp).filter(Boolean).length : 0) / 5 * 33)}%, Looking Forward: ${updatedProgress.lookforward_completed ? '✅' : '❌'})`);

    // Set completed_at if 100% complete
    if (updatedProgress.completion_percentage === 100 && !currentProgress.completed_at) {
      updatedProgress.completed_at = new Date().toISOString();
    }

    console.log('💾 Saving progress with admin client:', updatedProgress);

    // Upsert the progress record using admin client with explicit conflict resolution
    const { data, error } = await supabase
      .from('user_session_progress')
      .upsert(updatedProgress, { 
        onConflict: 'user_id,module_id,session_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        updatedProgress: JSON.stringify(updatedProgress, null, 2)
      });
      throw error;
    }

    console.log('✅ Progress saved successfully:', data);

    // Update module completion
    await updateModuleCompletion(supabase, validUserId, validModuleId);

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ Server error updating progress:', {
      message: error.message,
      stack: error.stack,
      error: error
    });
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message }, 
      { status: 500 }
    );
  }
}

async function updateModuleCompletion(supabase: any, userId: string, moduleId: number) {
  try {
    console.log('🔄 Updating module completion for user:', userId, 'module:', moduleId);
    
    // Ensure proper data types
    const validUserId = String(userId);
    const validModuleId = parseInt(String(moduleId));
    
    if (isNaN(validModuleId)) {
      console.error('❌ Invalid moduleId in updateModuleCompletion:', moduleId);
      return;
    }
    
    // Get all sessions for this module
    const { data: sessions, error: sessionError } = await supabase
      .from('user_session_progress')
      .select('completion_percentage, time_spent_seconds')
      .eq('user_id', validUserId)
      .eq('module_id', validModuleId);

    if (sessionError) {
      console.error('❌ Error fetching sessions for module completion:', sessionError);
      return;
    }

    if (!sessions || sessions.length === 0) {
      console.log('⚠️ No sessions found for module completion calculation');
      return;
    }

    const totalSessions = getTotalSessionsForModule(validModuleId);
    const completedSessions = sessions.filter((s: any) => s.completion_percentage === 100).length;
    const totalTimeSpent = sessions.reduce((sum: number, s: any) => sum + (s.time_spent_seconds || 0), 0);
    const moduleCompletion = Math.round((completedSessions / totalSessions) * 100);

    console.log('📊 Module completion calculation:', {
      totalSessions,
      completedSessions,
      moduleCompletion: `${moduleCompletion}%`
    });

    const moduleData: any = {
      user_id: validUserId,
      module_id: validModuleId,
      sessions_completed: completedSessions,
      total_sessions: totalSessions,
      completion_percentage: moduleCompletion,
      total_time_spent_seconds: totalTimeSpent,
      status: moduleCompletion === 0 ? 'not_started' : 
              moduleCompletion === 100 ? 'completed' : 'in_progress',
      last_accessed: new Date().toISOString()
    };

    if (moduleCompletion === 100) {
      moduleData.completed_at = new Date().toISOString();
    }

    const { error: upsertError } = await supabase
      .from('module_completion')
      .upsert(moduleData);

    if (upsertError) {
      console.error('❌ Error upserting module completion:', upsertError);
    } else {
      console.log('✅ Module completion updated successfully');
    }

  } catch (error) {
    console.error('❌ Error in updateModuleCompletion:', error);
  }
}

function getTotalSessionsForModule(moduleId: number): number {
  const moduleSessions: { [key: number]: number } = {
    1: 4, // Module 1 has 4 sessions
    2: 4, // Module 2 has 4 sessions
    3: 5, // Module 3 has 5 sessions
    4: 4, // Module 4 has 4 sessions
    5: 5, // Module 5 has 5 sessions
  };
  return moduleSessions[moduleId] || 4;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      console.error('❌ GET request missing userId');
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const validUserId = String(userId);
    console.log('🔍 GET request for user:', validUserId);

    const supabase = supabaseAdmin;

    const { data: modules } = await supabase
      .from('module_completion')
      .select('*')
      .eq('user_id', validUserId)
      .order('module_id');

    const { data: sessions } = await supabase
      .from('user_session_progress')
      .select('*')
      .eq('user_id', validUserId)
      .order('module_id, session_id');

    const overallCompletion = calculateOverallCompletion(modules || []);

    return NextResponse.json({
      modules: modules || [],
      sessions: sessions || [],
      overallCompletion
    });

  } catch (error) {
    console.error('Error getting user progress:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function calculateOverallCompletion(modules: any[]): number {
  if (modules.length === 0) return 0;
  const totalModules = 5;
  const completedModules = modules.filter(m => m.status === 'completed').length;
  return Math.round((completedModules / totalModules) * 100);
}