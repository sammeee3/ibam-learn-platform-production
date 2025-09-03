import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

/**
 * SECURITY ENDPOINT: Validate user permissions for data export
 * Ensures users can only export their own data (GDPR compliant)
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, dataType } = await request.json();
    
    // Input validation
    if (!userId || !dataType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate data type
    const allowedTypes = ['progress', 'certificate', 'business_plan'];
    if (!allowedTypes.includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Get user email from auth cookie (security layer)
    const authCookie = request.cookies.get('ibam_auth_server')?.value;
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user exists and matches the requesting user
    const { data: userProfile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, auth_user_id')
      .eq('email', authCookie)
      .single();

    if (error || !userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Security check: Ensure user can only export their own data
    const userIdMatch = userProfile.auth_user_id === userId || userProfile.id.toString() === userId;
    
    if (!userIdMatch) {
      console.warn(`Export permission denied: User ${userProfile.email} attempted to export data for ${userId}`);
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Additional checks based on data type
    if (dataType === 'certificate') {
      // Verify user has completed at least one module
      const { data: completedModules } = await supabaseAdmin
        .from('module_completion')
        .select('module_id, completion_percentage')
        .eq('user_id', userProfile.auth_user_id)
        .eq('completion_percentage', 100);

      if (!completedModules || completedModules.length === 0) {
        return NextResponse.json(
          { error: 'No completed modules found - certificate cannot be generated' },
          { status: 422 }
        );
      }
    }

    if (dataType === 'business_plan') {
      // Verify user has business plan data
      const { data: businessPlan } = await supabaseAdmin
        .from('business_plans')
        .select('id')
        .eq('user_id', userProfile.auth_user_id)
        .single();

      if (!businessPlan) {
        return NextResponse.json(
          { error: 'No business plan data found' },
          { status: 422 }
        );
      }
    }

    // Log successful validation for audit
    console.log(`Export validated: ${userProfile.email} requesting ${dataType}`);

    return NextResponse.json({
      success: true,
      message: 'Export permission granted',
      userId: userProfile.auth_user_id,
      email: userProfile.email
    });

  } catch (error: any) {
    console.error('Export validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed', details: error.message },
      { status: 500 }
    );
  }
}