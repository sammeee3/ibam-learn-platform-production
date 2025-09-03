import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

// Super admin email validation
const SUPER_ADMIN_EMAILS = [
  'sammeee@yahoo.com',
  'sammeee3@gmail.com', 
  'sj614+superadmin@proton.me'
];

async function validateSuperAdmin(request: NextRequest) {
  try {
    // Get user from session/auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { isValid: false, error: 'No authorization header' };
    }

    // For now, we'll use a simple approach - in production you'd validate JWT
    // This is a placeholder for proper auth validation
    return { isValid: true, email: 'sammeee3@gmail.com' }; // Temporary for development
  } catch (error) {
    return { isValid: false, error: 'Auth validation failed' };
  }
}

// GET - Fetch deployment logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching deployment logs...');

    // Validate super admin access
    const { isValid } = await validateSuperAdmin(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const environment = url.searchParams.get('environment');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('deployment_logs')
      .select('*')
      .order('deployment_date', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (environment && environment !== 'all') {
      query = query.eq('environment', environment);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data: deployments, error } = await query;

    if (error) {
      console.error('❌ Error fetching deployment logs:', error);
      return NextResponse.json({ error: 'Failed to fetch deployment logs' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabaseAdmin
      .from('deployment_logs')
      .select('*', { count: 'exact', head: true });
    
    if (environment && environment !== 'all') {
      countQuery = countQuery.eq('environment', environment);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count } = await countQuery;

    console.log(`✅ Successfully fetched ${deployments?.length || 0} deployment logs`);

    return NextResponse.json({
      deployments: deployments || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('❌ Server error fetching deployment logs:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create new deployment log
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new deployment log...');

    // Validate super admin access
    const { isValid, email } = await validateSuperAdmin(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      version_number,
      environment,
      git_commit_hash,
      git_commit_count,
      features_added = [],
      bugs_fixed = [],
      improvements = [],
      breaking_changes = [],
      database_changes = {},
      status = 'completed',
      rollback_available = true,
      rollback_commit_hash,
      user_impact_level = 'low',
      notes,
      deployment_duration_seconds
    } = body;

    // Validation
    if (!version_number || !environment) {
      return NextResponse.json({ 
        error: 'Missing required fields: version_number, environment' 
      }, { status: 400 });
    }

    if (!['staging', 'production'].includes(environment)) {
      return NextResponse.json({ 
        error: 'Environment must be either "staging" or "production"' 
      }, { status: 400 });
    }

    // Check if version already exists in this environment
    const { data: existingVersion } = await supabaseAdmin
      .from('deployment_logs')
      .select('id')
      .eq('version_number', version_number)
      .eq('environment', environment)
      .single();

    if (existingVersion) {
      return NextResponse.json({ 
        error: `Version ${version_number} already exists in ${environment}` 
      }, { status: 409 });
    }

    // Create deployment log
    const deploymentData = {
      version_number,
      environment,
      deployed_by: email,
      git_commit_hash,
      git_commit_count,
      features_added,
      bugs_fixed,
      improvements,
      breaking_changes,
      database_changes,
      status,
      rollback_available,
      rollback_commit_hash,
      user_impact_level,
      notes,
      deployment_duration_seconds,
      deployment_date: new Date().toISOString()
    };

    const { data: deployment, error } = await supabaseAdmin
      .from('deployment_logs')
      .insert(deploymentData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating deployment log:', error);
      return NextResponse.json({ error: 'Failed to create deployment log' }, { status: 500 });
    }

    console.log(`✅ Successfully created deployment log: ${version_number} (${environment})`);

    return NextResponse.json({ 
      success: true, 
      deployment,
      message: `Deployment log created for ${version_number} in ${environment}` 
    });

  } catch (error) {
    console.error('❌ Server error creating deployment log:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update existing deployment log
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Updating deployment log...');

    // Validate super admin access
    const { isValid } = await validateSuperAdmin(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing deployment log ID' }, { status: 400 });
    }

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.deployment_date;

    const { data: deployment, error } = await supabaseAdmin
      .from('deployment_logs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating deployment log:', error);
      return NextResponse.json({ error: 'Failed to update deployment log' }, { status: 500 });
    }

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment log not found' }, { status: 404 });
    }

    console.log(`✅ Successfully updated deployment log ID: ${id}`);

    return NextResponse.json({ 
      success: true, 
      deployment,
      message: 'Deployment log updated successfully' 
    });

  } catch (error) {
    console.error('❌ Server error updating deployment log:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove deployment log (use with caution)
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Deleting deployment log...');

    // Validate super admin access
    const { isValid } = await validateSuperAdmin(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing deployment log ID' }, { status: 400 });
    }

    // First check if deployment exists
    const { data: existingDeployment } = await supabaseAdmin
      .from('deployment_logs')
      .select('version_number, environment')
      .eq('id', id)
      .single();

    if (!existingDeployment) {
      return NextResponse.json({ error: 'Deployment log not found' }, { status: 404 });
    }

    // Delete deployment log
    const { error } = await supabaseAdmin
      .from('deployment_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting deployment log:', error);
      return NextResponse.json({ error: 'Failed to delete deployment log' }, { status: 500 });
    }

    console.log(`✅ Successfully deleted deployment log: ${existingDeployment.version_number} (${existingDeployment.environment})`);

    return NextResponse.json({ 
      success: true,
      message: `Deployment log ${existingDeployment.version_number} deleted successfully` 
    });

  } catch (error) {
    console.error('❌ Server error deleting deployment log:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}