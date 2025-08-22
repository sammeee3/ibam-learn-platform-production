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
    // First try with all expected columns
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email, login_source, learning_path, learning_mode')
      .eq('email', email)
      .single();
    
    // If that fails, try with just basic columns
    if (error && error.message?.includes('column')) {
      console.log('Trying with basic columns only...');
      const { data: basicProfile, error: basicError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, email')
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
    
    return NextResponse.json(profile);
    
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}