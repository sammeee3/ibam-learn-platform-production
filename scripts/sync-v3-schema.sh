#!/bin/bash
# 🔄 BULLETPROOF V3 SCHEMA SYNC
# Automatically sync V3 production schema to match V2 staging before deployment

set -e  # Exit on any error

echo "🔍 Starting V3 schema synchronization..."

# 1. Export V2 staging schema
echo "📤 Exporting V2 staging schema..."
pg_dump -h yhfxxouswctucxvfetcq.supabase.co \
  -U postgres \
  --schema-only \
  --no-owner \
  --no-privileges \
  postgres > /tmp/v2_schema.sql

# 2. Export V3 production schema  
echo "📤 Exporting V3 production schema..."
pg_dump -h tutrnikhomrgcpkzszvq.supabase.co \
  -U postgres \
  --schema-only \
  --no-owner \
  --no-privileges \
  postgres > /tmp/v3_schema.sql

# 3. Compare schemas
echo "🔍 Comparing schemas..."
if diff /tmp/v2_schema.sql /tmp/v3_schema.sql > /tmp/schema_diff.txt; then
  echo "✅ Schemas are identical - safe to deploy!"
  exit 0
else
  echo "⚠️ Schema differences found:"
  cat /tmp/schema_diff.txt
  
  read -p "Apply V2 schema to V3? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Applying V2 schema to V3..."
    psql -h tutrnikhomrgcpkzszvq.supabase.co \
      -U postgres \
      postgres < /tmp/v2_schema.sql
    echo "✅ V3 schema updated to match V2"
  else
    echo "❌ Deployment cancelled - schemas must be identical"
    exit 1
  fi
fi