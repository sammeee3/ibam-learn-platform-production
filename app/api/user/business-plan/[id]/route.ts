import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .select('id, full_name, email')
      .eq('email', userEmail)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get business plan data
    const { data: businessPlanData, error: planError } = await supabase
      .from('business_plan_data')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('updated_at', { ascending: false });

    if (planError) {
      console.error('Error fetching business plan:', planError);
      return NextResponse.json({ error: 'Failed to fetch business plan' }, { status: 500 });
    }

    if (!businessPlanData || businessPlanData.length === 0) {
      return NextResponse.json({ error: 'Business plan not found' }, { status: 404 });
    }

    // Structure the business plan data for export
    const businessPlan = {
      id: params.id,
      name: 'My Business Plan',
      user: {
        name: userProfile.full_name || userEmail,
        email: userProfile.email
      },
      sections: businessPlanData.reduce((acc: any, item: any) => {
        acc[item.section] = {
          question: item.question,
          answer: item.answer,
          updated_at: item.updated_at
        };
        return acc;
      }, {}),
      totalSections: businessPlanData.length,
      lastUpdated: businessPlanData[0]?.updated_at || new Date().toISOString(),
      created_at: businessPlanData[businessPlanData.length - 1]?.created_at || new Date().toISOString()
    };

    return NextResponse.json(businessPlan);

  } catch (error) {
    console.error('Error in business plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}