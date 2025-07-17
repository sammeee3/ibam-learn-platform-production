import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('donation_goals')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Supabase connection failed',
        supabaseError: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Everything working!',
      goalData: data
    });

  } catch (error) {
    return NextResponse.json({
      error: 'API failed',
      message: error.message
    }, { status: 500 });
  }
}
