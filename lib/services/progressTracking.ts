import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export class ProgressTracker {
  private supabase;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Track user progress in a session
   */
  async updateSessionProgress({
    userId,
    moduleId,
    sessionId,
    section,
    subsection,
    sectionCompleted,
    timeSpentSeconds = 0,
    videoWatchPercentage,
    quizScore,
    quizAttempts
  }: {
    userId: string;
    moduleId: number;
    sessionId: number;
    section?: string;
    subsection?: string;
    sectionCompleted?: {
      lookback?: boolean;
      lookup?: boolean;
      lookforward?: boolean;
      assessment?: boolean;
    };
    timeSpentSeconds?: number;
    videoWatchPercentage?: number;
    quizScore?: number;
    quizAttempts?: number;
  }) {
    try {
      // Get existing progress or create new
      const { data: existing } = await this.supabase
        .from('user_session_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .eq('session_id', sessionId)
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
      const updatedProgress = {
        user_id: userId,
        module_id: moduleId,
        session_id: sessionId,
        last_section: section || currentProgress.last_section,
        last_subsection: subsection || currentProgress.last_subsection,
        lookback_completed: sectionCompleted?.lookback ?? currentProgress.lookback_completed,
        lookup_completed: sectionCompleted?.lookup ?? currentProgress.lookup_completed,
        lookforward_completed: sectionCompleted?.lookforward ?? currentProgress.lookforward_completed,
        assessment_completed: sectionCompleted?.assessment ?? currentProgress.assessment_completed,
        time_spent_seconds: currentProgress.time_spent_seconds + timeSpentSeconds,
        video_watch_percentage: Math.max(
          currentProgress.video_watch_percentage || 0,
          videoWatchPercentage || 0
        ),
        quiz_score: quizScore ?? currentProgress.quiz_score,
        quiz_attempts: (currentProgress.quiz_attempts || 0) + (quizAttempts || 0),
        last_accessed: new Date().toISOString()
      };

      // Calculate completion percentage
      const completedSections = [
        updatedProgress.lookback_completed,
        updatedProgress.lookup_completed,
        updatedProgress.lookforward_completed,
        updatedProgress.assessment_completed
      ].filter(Boolean).length;
      
      const totalSections = updatedProgress.assessment_completed !== null ? 4 : 3;
      updatedProgress.completion_percentage = Math.round((completedSections / totalSections) * 100);

      // Set completed_at if 100% complete
      if (updatedProgress.completion_percentage === 100 && !currentProgress.completed_at) {
        updatedProgress.completed_at = new Date().toISOString();
      }

      // Upsert the progress record
      const { data, error } = await this.supabase
        .from('user_session_progress')
        .upsert(updatedProgress)
        .select()
        .single();

      if (error) throw error;

      // Update module completion
      await this.updateModuleCompletion(userId, moduleId);

      return { success: true, data };
    } catch (error) {
      console.error('Error updating session progress:', error);
      return { success: false, error };
    }
  }

  /**
   * Update overall module completion status
   */
  async updateModuleCompletion(userId: string, moduleId: number) {
    try {
      // Get all sessions for this module
      const { data: sessions } = await this.supabase
        .from('user_session_progress')
        .select('completion_percentage, time_spent_seconds')
        .eq('user_id', userId)
        .eq('module_id', moduleId);

      if (!sessions || sessions.length === 0) return;

      const totalSessions = this.getTotalSessionsForModule(moduleId);
      const completedSessions = sessions.filter(s => s.completion_percentage === 100).length;
      const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.time_spent_seconds || 0), 0);
      const moduleCompletion = Math.round((completedSessions / totalSessions) * 100);

      const moduleData = {
        user_id: userId,
        module_id: moduleId,
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

      await this.supabase
        .from('module_completion')
        .upsert(moduleData);

    } catch (error) {
      console.error('Error updating module completion:', error);
    }
  }

  /**
   * Get user's continue session (last incomplete session)
   */
  async getContinueSession(userId: string) {
    try {
      const { data, error } = await this.supabase
        .rpc('get_user_continue_session', { p_user_id: userId });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting continue session:', error);
      return null;
    }
  }

  /**
   * Get user's overall progress
   */
  async getUserProgress(userId: string) {
    try {
      const { data: modules } = await this.supabase
        .from('module_completion')
        .select('*')
        .eq('user_id', userId)
        .order('module_id');

      const { data: sessions } = await this.supabase
        .from('user_session_progress')
        .select('*')
        .eq('user_id', userId)
        .order('module_id, session_id');

      return {
        modules: modules || [],
        sessions: sessions || [],
        overallCompletion: this.calculateOverallCompletion(modules || [])
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { modules: [], sessions: [], overallCompletion: 0 };
    }
  }

  /**
   * Log user activity
   */
  async logActivity({
    userId,
    activityType,
    activityData,
    moduleId,
    sessionId,
    pageUrl,
    userAgent,
    timeOnPageSeconds
  }: {
    userId: string;
    activityType: string;
    activityData?: any;
    moduleId?: number;
    sessionId?: number;
    pageUrl?: string;
    userAgent?: string;
    timeOnPageSeconds?: number;
  }) {
    try {
      const deviceInfo = this.parseUserAgent(userAgent || navigator.userAgent);
      
      await this.supabase
        .from('user_activity_log')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData || {},
          module_id: moduleId,
          session_id: sessionId,
          page_url: pageUrl || window.location.href,
          referrer_url: document.referrer,
          user_agent: userAgent || navigator.userAgent,
          device_type: deviceInfo.deviceType,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          time_on_page_seconds: timeOnPageSeconds,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Helper function to get total sessions per module
   */
  private getTotalSessionsForModule(moduleId: number): number {
    const moduleSessions: { [key: number]: number } = {
      1: 4, // Module 1 has 4 sessions
      2: 4, // Module 2 has 4 sessions
      3: 5, // Module 3 has 5 sessions
      4: 4, // Module 4 has 4 sessions
      5: 5, // Module 5 has 5 sessions
    };
    return moduleSessions[moduleId] || 4;
  }

  /**
   * Calculate overall course completion
   */
  private calculateOverallCompletion(modules: any[]): number {
    if (modules.length === 0) return 0;
    const totalModules = 5;
    const completedModules = modules.filter(m => m.status === 'completed').length;
    return Math.round((completedModules / totalModules) * 100);
  }

  /**
   * Parse user agent for device info
   */
  private parseUserAgent(userAgent: string) {
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    
    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';
    
    let os = 'Unknown';
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iOS|iPhone|iPad/i.test(userAgent)) os = 'iOS';
    
    return { deviceType, browser, os };
  }
}

// Export singleton instance
export const progressTracker = new ProgressTracker();