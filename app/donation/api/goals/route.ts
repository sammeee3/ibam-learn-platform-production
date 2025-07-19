import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: goal, error } = await supabase
      .from('donation_goals')
      .select('*')
      .eq('year', 2026)
      .single();

    if (error) {
      console.error('Error fetching goal:', error);
      return NextResponse.json(
        { error: 'Failed to fetch goal data' },
        { status: 500 }
      );
    }

    const progress = goal ? (goal.current_amount / goal.target_amount) * 100 : 0;

    return NextResponse.json({
      current: goal?.current_amount || 0,
      target: goal?.target_amount || 2000,
      progress: progress,
      description: goal?.description || 'Jeff & Julie 2026 Ministry Launch Fund'
    });

  } catch (error) {
    console.error('Goal fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}