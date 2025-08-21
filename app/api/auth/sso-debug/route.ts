import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  // Get the actual environment variable
  const SYSTEME_SECRET = process.env.IBAM_SYSTEME_SECRET || 'not-set';
  
  let debugInfo: any = {
    email,
    receivedToken: token,
    expectedToken: SYSTEME_SECRET,
    tokenMatch: token === SYSTEME_SECRET,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  // If token matches, try the user validation
  if (token === SYSTEME_SECRET && email) {
    const supabase = supabaseAdmin;
    
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      debugInfo.profileExists = !!existingProfile;
      debugInfo.profileError = profileError?.message;
      
      if (!existingProfile) {
        // Check auth users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        debugInfo.authError = authError?.message;
        
        if (!authError) {
          const userAuth = authUsers.users.find(user => user.email === email);
          debugInfo.authUserExists = !!userAuth;
        }
      }
    } catch (error: any) {
      debugInfo.error = error.message;
    }
  }
  
  return NextResponse.json(debugInfo);
}