import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  const supabase = supabaseAdmin;
  
  try {
    // First try with all expected columns - CRITICAL: Include 'id' field for action saving and 'auth_user_id' for progress tracking
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id, auth_user_id, first_name, last_name, email, login_source, learning_path, learning_mode')
      .eq('email', email)
      .single();
    
    // If that fails, try with just basic columns
    if (error && error.message?.includes('column')) {
      console.log('Trying with basic columns only...');
      const { data: basicProfile, error: basicError } = await supabase
        .from('user_profiles')
        .select('id, auth_user_id, first_name, last_name, email')
        .eq('email', email)
        .single();
      
      if (basicError) {
        console.error('Basic profile fetch error:', basicError);
        return NextResponse.json({ 
          error: 'Profile not found', 
          details: basicError.message,
          email: email
        }, { status: 404 });
      }
      
      // Return basic profile with defaults
      profile = {
        ...basicProfile,
        login_source: 'direct',
        learning_path: null,
        learning_mode: null
      };
    } else if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json({ 
        error: 'Profile not found', 
        details: error.message,
        email: email
      }, { status: 404 });
    }
    
    // Enhance profile with additional data for profile page
    if (!profile) {
      return NextResponse.json({ 
        error: 'Profile not found after processing', 
        email: email
      }, { status: 404 });
    }
    
    const enhancedProfile = {
      id: profile.id,
      auth_user_id: profile.auth_user_id,
      email: profile.email,
      firstName: profile.first_name || 'Student',
      lastName: profile.last_name || '',
      loginSource: profile.login_source || 'direct', // Critical for System.io vs Direct user detection
      membershipLevel: 'Basic Member', // TODO: Get from actual membership data
      completedModules: 0, // TODO: Calculate from progress data
      totalModules: 5, // TODO: Get from course structure
      overallProgress: 0, // TODO: Calculate from completed sessions
      createdAt: (profile as any).created_at || new Date().toISOString(),
      lastActive: (profile as any).last_active || new Date().toISOString()
    };
    
    return NextResponse.json(enhancedProfile);
    
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}