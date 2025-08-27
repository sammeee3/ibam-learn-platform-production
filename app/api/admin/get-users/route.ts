import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Direct Supabase connection for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all users directly
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, email, created_at, pre_assessment_completed')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ users: [], error: error.message });
    }

    return NextResponse.json({ 
      users: users || [],
      count: users?.length || 0 
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ users: [], error: 'Failed to fetch users' });
  }
}