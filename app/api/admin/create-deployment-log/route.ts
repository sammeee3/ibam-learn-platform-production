import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-config';

// This endpoint can be called automatically during deployment to log changes
// It analyzes git commits and automatically categorizes changes
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Auto-creating deployment log from git data...');

    const body = await request.json();
    const {
      version_number,
      environment,
      git_commits = [], // Array of commit objects with hash, message, author, date
      deployed_by,
      deployment_start_time,
      deployment_end_time
    } = body;

    // Validation
    if (!version_number || !environment) {
      return NextResponse.json({ 
        error: 'Missing required fields: version_number, environment' 
      }, { status: 400 });
    }

    // Calculate deployment duration
    let deployment_duration_seconds: number | null = null;
    if (deployment_start_time && deployment_end_time) {
      deployment_duration_seconds = Math.floor(
        (new Date(deployment_end_time).getTime() - new Date(deployment_start_time).getTime()) / 1000
      );
    }

    // Analyze commits and categorize changes
    const categorizedChanges = analyzeCommits(git_commits);

    // Determine user impact level based on changes
    const user_impact_level = determineImpactLevel(categorizedChanges);

    // Check for database changes
    const database_changes = detectDatabaseChanges(git_commits);

    // Create deployment log
    const deploymentData = {
      version_number,
      environment,
      deployed_by: deployed_by || 'automated-system',
      git_commit_hash: git_commits.length > 0 ? git_commits[0].hash : null,
      git_commit_count: git_commits.length,
      features_added: categorizedChanges.features,
      bugs_fixed: categorizedChanges.bugs,
      improvements: categorizedChanges.improvements,
      breaking_changes: categorizedChanges.breaking_changes,
      database_changes,
      status: 'completed',
      rollback_available: true,
      rollback_commit_hash: git_commits.length > 1 ? git_commits[git_commits.length - 1].hash : null,
      user_impact_level,
      notes: `Automatically generated from ${git_commits.length} commits`,
      deployment_duration_seconds,
      deployment_date: deployment_end_time || new Date().toISOString()
    };

    // Check if version already exists
    const { data: existingVersion } = await supabaseAdmin
      .from('deployment_logs')
      .select('id')
      .eq('version_number', version_number)
      .eq('environment', environment)
      .single();

    if (existingVersion) {
      console.log(`⚠️ Version ${version_number} already exists in ${environment}, updating...`);
      
      const { data: deployment, error } = await supabaseAdmin
        .from('deployment_logs')
        .update(deploymentData)
        .eq('id', existingVersion.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating deployment log:', error);
        return NextResponse.json({ error: 'Failed to update deployment log' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        deployment,
        action: 'updated',
        message: `Deployment log updated for ${version_number} in ${environment}` 
      });

    } else {
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
        action: 'created',
        message: `Deployment log created for ${version_number} in ${environment}`,
        summary: {
          features: categorizedChanges.features.length,
          bugs: categorizedChanges.bugs.length,
          improvements: categorizedChanges.improvements.length,
          commits: git_commits.length,
          impact: user_impact_level
        }
      });
    }

  } catch (error) {
    console.error('❌ Server error creating deployment log:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Analyze git commits and categorize them into features, bugs, improvements
function analyzeCommits(commits: any[]) {
  const features: any[] = [];
  const bugs: any[] = [];
  const improvements: any[] = [];
  const breaking_changes: any[] = [];

  // Keywords for categorization
  const featureKeywords = ['feat', 'feature', 'add', 'new', 'implement', 'create', '🎯', '🚀', '✨'];
  const bugKeywords = ['fix', 'bug', 'hotfix', 'patch', 'resolve', 'issue', '🔧', '🚨', '❌'];
  const improvementKeywords = ['improve', 'enhance', 'refactor', 'update', 'optimize', 'perf', '🎨', '⚡', '📊'];
  const breakingKeywords = ['breaking', 'breaking change', 'major', 'remove', 'delete', '💥', '🔥'];

  commits.forEach(commit => {
    const message = commit.message?.toLowerCase() || '';
    const hash = commit.hash?.substring(0, 8);
    
    // Check for breaking changes first
    if (breakingKeywords.some(keyword => message.includes(keyword))) {
      breaking_changes.push({
        title: extractTitle(commit.message),
        description: commit.message,
        migration_required: message.includes('schema') || message.includes('database'),
        commit_hash: hash
      });
    }
    // Check for features
    else if (featureKeywords.some(keyword => message.includes(keyword))) {
      features.push({
        title: extractTitle(commit.message),
        description: commit.message,
        impact: determineCommitImpact(commit.message),
        commit_hash: hash
      });
    }
    // Check for bug fixes
    else if (bugKeywords.some(keyword => message.includes(keyword))) {
      bugs.push({
        title: extractTitle(commit.message),
        description: commit.message,
        severity: determineBugSeverity(commit.message),
        commit_hash: hash
      });
    }
    // Check for improvements
    else if (improvementKeywords.some(keyword => message.includes(keyword))) {
      improvements.push({
        title: extractTitle(commit.message),
        description: commit.message,
        impact: determineCommitImpact(commit.message),
        commit_hash: hash
      });
    }
    // Default to improvement if no clear category
    else {
      improvements.push({
        title: extractTitle(commit.message),
        description: commit.message,
        impact: 'low',
        commit_hash: hash
      });
    }
  });

  return { features, bugs, improvements, breaking_changes };
}

// Extract a clean title from commit message
function extractTitle(message: string): string {
  if (!message) return 'Untitled Change';
  
  // Remove emoji prefixes and clean up
  const cleaned = message
    .replace(/^(🎯|🚀|✨|🔧|🚨|❌|🎨|⚡|📊|💥|🔥)\s*/, '')
    .replace(/^(feat|fix|add|update|improve|enhance|refactor):\s*/i, '')
    .split('\n')[0]
    .trim();
  
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Determine commit impact level
function determineCommitImpact(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('critical') || msg.includes('major') || msg.includes('revolutionary')) {
    return 'high';
  } else if (msg.includes('important') || msg.includes('significant') || msg.includes('enhance')) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Determine bug severity
function determineBugSeverity(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('critical') || msg.includes('urgent') || msg.includes('blocking')) {
    return 'critical';
  } else if (msg.includes('important') || msg.includes('major')) {
    return 'high';
  } else if (msg.includes('minor') || msg.includes('small')) {
    return 'low';
  } else {
    return 'medium';
  }
}

// Determine overall user impact level
function determineImpactLevel(changes: any): string {
  const { features, bugs, breaking_changes } = changes;
  
  // Breaking changes = critical impact
  if (breaking_changes.length > 0) {
    return 'critical';
  }
  
  // High impact features or critical bugs = high impact
  const highImpactFeatures = features.filter(f => f.impact === 'high').length;
  const criticalBugs = bugs.filter(b => b.severity === 'critical').length;
  
  if (highImpactFeatures > 0 || criticalBugs > 0 || features.length > 3) {
    return 'high';
  }
  
  // Multiple changes = medium impact
  if (features.length > 1 || bugs.length > 2) {
    return 'medium';
  }
  
  return 'low';
}

// Detect database changes from commit messages
function detectDatabaseChanges(commits: any[]) {
  const changes: any = {};
  
  commits.forEach(commit => {
    const message = commit.message?.toLowerCase() || '';
    
    if (message.includes('database') || message.includes('schema') || message.includes('migration')) {
      changes.migration_required = true;
    }
    
    if (message.includes('add column') || message.includes('new column')) {
      changes.columns_added = changes.columns_added || [];
      // Try to extract column names (basic regex)
      const columnMatch = message.match(/add(?:ing)?\s+column\s+([a-zA-Z_]+)/);
      if (columnMatch) {
        changes.columns_added.push(columnMatch[1]);
      }
    }
    
    if (message.includes('alter table') || message.includes('modify table')) {
      changes.tables_modified = changes.tables_modified || [];
      const tableMatch = message.match(/(?:alter|modify)\s+table\s+([a-zA-Z_]+)/);
      if (tableMatch) {
        changes.tables_modified.push(tableMatch[1]);
      }
    }
  });
  
  return changes;
}