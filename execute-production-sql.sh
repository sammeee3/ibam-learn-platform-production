#!/bin/bash

# 🛠️ Execute SQL on Production Database via curl
# This script uses direct HTTP API calls to execute SQL statements

echo "🚀 Executing SQL on Production Database"
echo "📍 Target: tutrnikhomrgcpkzszvq.supabase.co"
echo ""

# Production database credentials
SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0"

echo "📋 Creating user_feedback table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS user_feedback (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), type text NOT NULL CHECK (type IN ('"'"'bug'"'"', '"'"'feature'"'"')), description text NOT NULL, user_email text, page_url text, user_agent text, screenshot_data text, status text DEFAULT '"'"'pending'"'"' CHECK (status IN ('"'"'pending'"'"', '"'"'in_progress'"'"', '"'"'completed'"'"', '"'"'rejected'"'"')), priority text DEFAULT '"'"'medium'"'"' CHECK (priority IN ('"'"'low'"'"', '"'"'medium'"'"', '"'"'high'"'"', '"'"'critical'"'"')), created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());"
  }'

echo ""
echo "📋 Creating admin_tasks table..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS admin_tasks (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), title text NOT NULL, description text, type text DEFAULT '"'"'general'"'"' CHECK (type IN ('"'"'bug_fix'"'"', '"'"'feature_request'"'"', '"'"'improvement'"'"', '"'"'general'"'"')), status text DEFAULT '"'"'pending'"'"' CHECK (status IN ('"'"'pending'"'"', '"'"'in_progress'"'"', '"'"'completed'"'"', '"'"'cancelled'"'"')), priority text DEFAULT '"'"'medium'"'"' CHECK (priority IN ('"'"'low'"'"', '"'"'medium'"'"', '"'"'high'"'"', '"'"'critical'"'"')), source text DEFAULT '"'"'manual'"'"' CHECK (source IN ('"'"'user_feedback'"'"', '"'"'manual'"'"', '"'"'system'"'"', '"'"'production_feedback'"'"', '"'"'staging_feedback'"'"')), source_id text, assigned_to text, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), completed_at timestamp with time zone);"
  }'

echo ""
echo "📊 Creating indexes..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC); CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status); CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(type);"
  }'

echo ""
echo "📊 Creating more indexes..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_at ON admin_tasks(created_at DESC); CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status); CREATE INDEX IF NOT EXISTS idx_admin_tasks_source ON admin_tasks(source);"
  }'

echo ""
echo "🔧 Testing table creation..."

echo "   Testing user_feedback table..."
curl -X GET "$SUPABASE_URL/rest/v1/user_feedback?limit=1" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json"

echo ""
echo "   Testing admin_tasks table..." 
curl -X GET "$SUPABASE_URL/rest/v1/admin_tasks?limit=1" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json"

echo ""
echo "✅ Production database setup completed!"
echo "🔄 You can now test SYNC command to pull from both databases"