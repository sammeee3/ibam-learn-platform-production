#!/bin/bash

# Script to update local .env.local after key rotation

echo "🔄 Updating local environment with new keys"
echo "=========================================="
echo ""

# Create backup of current .env.local
cp .env.local .env.local.backup.$(date +%Y%m%d)
echo "✅ Backed up current .env.local"

echo ""
echo "📝 After rotating keys in Supabase, update these values:"
echo ""
echo "1. STAGING Keys (from https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/settings/api):"
echo "   - Copy the new 'anon' key"
echo "   - Copy the new 'service_role' key"
echo ""
echo "2. Update .env.local with:"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=[new anon key]"
echo "   SUPABASE_SERVICE_ROLE_KEY=[new service role key]"
echo ""
echo "3. Restart your development server:"
echo "   npm run dev"
echo ""
echo "✅ Vercel will update automatically thanks to the integration!"