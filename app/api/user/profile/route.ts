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
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, email, login_source, learning_path, learning_mode')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json(profile);
    
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}