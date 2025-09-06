import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie
    const authCookie = request.cookies.get('ibam_auth_server');
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(authCookie.value);
    const userEmail = userData.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 401 });
    }

    // Connect to database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get business plan data grouped by logical plans
    const { data: businessPlanData, error: planError } = await supabase
      .from('business_plan_data')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false });

    if (planError) {
      console.error('Error fetching business plans:', planError);
      return NextResponse.json({ error: 'Failed to fetch business plans' }, { status: 500 });
    }

    // Group business plan data into logical plans
    // For now, create a single plan per user since we don't have plan_id in the database
    if (!businessPlanData || businessPlanData.length === 0) {
      return NextResponse.json([]);
    }

    // Calculate completion percentage based on sections filled
    const totalSections = ['vision', 'target_market', 'revenue_model', 'marketing_strategy'].length;
    const completedSections = new Set(businessPlanData.map(item => item.section)).size;
    const completionPercentage = Math.round((completedSections / totalSections) * 100);

    // Create a single business plan from all the data
    const businessPlan = {
      id: 'main-plan', // Single plan ID since we don't have separate plans
      name: 'My Business Plan',
      completionPercentage,
      lastModified: businessPlanData[0]?.updated_at || new Date().toISOString()
    };

    return NextResponse.json([businessPlan]);

  } catch (error) {
    console.error('Error in business plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}