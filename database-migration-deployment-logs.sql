-- ========================================
-- DEPLOYMENT LOGS SYSTEM - DATABASE SCHEMA
-- For both Production and Staging environments
-- ========================================

-- Create deployment_logs table
CREATE TABLE deployment_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Version & Environment Info
    version_number TEXT NOT NULL, -- e.g., "v2.3.0", "v2.3.1-hotfix"
    environment TEXT NOT NULL CHECK (environment IN ('staging', 'production')),
    
    -- Deployment Details
    deployment_date TIMESTAMPTZ DEFAULT NOW(),
    deployed_by TEXT, -- Admin email who triggered deployment
    git_commit_hash TEXT, -- Latest commit hash
    git_commit_count INTEGER, -- Number of commits in this deployment
    
    -- Change Categorization (JSONB for flexibility)
    features_added JSONB DEFAULT '[]', -- Array of feature descriptions
    bugs_fixed JSONB DEFAULT '[]', -- Array of bug fix descriptions  
    improvements JSONB DEFAULT '[]', -- Array of improvement descriptions
    breaking_changes JSONB DEFAULT '[]', -- Array of breaking changes
    database_changes JSONB DEFAULT '{}', -- Object describing DB changes needed
    
    -- Deployment Status & Control
    status TEXT DEFAULT 'completed' CHECK (status IN ('planned', 'in_progress', 'completed', 'failed', 'rolled_back')),
    rollback_available BOOLEAN DEFAULT true,
    rollback_commit_hash TEXT, -- Commit to rollback to if needed
    
    -- Additional Metadata
    deployment_duration_seconds INTEGER, -- How long deployment took
    notes TEXT, -- Admin notes about deployment
    user_impact_level TEXT DEFAULT 'low' CHECK (user_impact_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_deployment_logs_environment ON deployment_logs(environment);
CREATE INDEX idx_deployment_logs_version ON deployment_logs(version_number);
CREATE INDEX idx_deployment_logs_date ON deployment_logs(deployment_date DESC);
CREATE INDEX idx_deployment_logs_status ON deployment_logs(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_deployment_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deployment_logs_updated_at
    BEFORE UPDATE ON deployment_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_deployment_logs_updated_at();

-- Sample data structure for JSONB fields:
/*
features_added: [
  {
    "title": "Revolutionary Looking Forward System", 
    "description": "3-part progress tracking with Business Actions, Spiritual Integration, and Sharing",
    "impact": "high",
    "commit_hash": "69a74491"
  },
  {
    "title": "Smart Interactive Coaching System",
    "description": "AI-powered discovery learning with IBAM knowledge base",
    "impact": "high", 
    "commit_hash": "b261a972"
  }
]

bugs_fixed: [
  {
    "title": "Memory Practice Persistence", 
    "description": "Fixed progress lost on page refresh",
    "severity": "critical",
    "commit_hash": "28b4b364"
  }
]

database_changes: {
  "tables_modified": ["user_session_progress"],
  "columns_added": ["looking_up_subsections", "looking_forward_subsections"],
  "migration_required": true,
  "rollback_sql": "ALTER TABLE user_session_progress DROP COLUMN looking_up_subsections, DROP COLUMN looking_forward_subsections;"
}
*/

-- Insert initial deployment log for current staging version
INSERT INTO deployment_logs (
    version_number,
    environment,
    deployed_by,
    features_added,
    bugs_fixed,
    improvements,
    database_changes,
    user_impact_level,
    notes
) VALUES (
    'v2.3.0-staging',
    'staging',
    'system-auto',
    '[
        {
            "title": "Revolutionary Looking Forward System",
            "description": "3-part progress tracking with Business Actions, Spiritual Integration, and Sharing commitments",
            "impact": "high",
            "commit_hash": "69a74491"
        },
        {
            "title": "Smart Interactive Coaching System", 
            "description": "AI-powered discovery learning with IBAM knowledge base integration",
            "impact": "high",
            "commit_hash": "b261a972"
        },
        {
            "title": "Super Admin Command Center",
            "description": "Complete admin dashboard with user reports, webhook monitoring, and analytics",
            "impact": "medium",
            "commit_hash": "dac43d07"
        }
    ]'::jsonb,
    '[
        {
            "title": "Memory Practice Persistence",
            "description": "Fixed progress lost on page refresh - now persists in database",
            "severity": "critical", 
            "commit_hash": "28b4b364"
        },
        {
            "title": "Quiz Infinite Loop Prevention",
            "description": "Prevented UI freezing during quiz completion",
            "severity": "high",
            "commit_hash": "852935d6"
        }
    ]'::jsonb,
    '[
        {
            "title": "Enhanced Dashboard with Hover Popups",
            "description": "Clear progress visualization with What\'s Left popups",
            "impact": "medium",
            "commit_hash": "2725267b"
        }
    ]'::jsonb,
    '{
        "tables_modified": ["user_session_progress"],
        "columns_added": ["looking_up_subsections", "looking_forward_subsections"],
        "migration_required": true,
        "migration_sql": "ALTER TABLE user_session_progress ADD COLUMN looking_up_subsections JSONB DEFAULT \'{}\', ADD COLUMN looking_forward_subsections JSONB DEFAULT \'{}\';"
    }'::jsonb,
    'high',
    'Major release with revolutionary learning improvements, complete admin system, and critical bug fixes'
);