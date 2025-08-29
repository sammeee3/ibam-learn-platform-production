#!/bin/bash

# 🚨 STAGING-ONLY DEPLOYMENT SCRIPT
# This script prevents accidental production deployments

echo "🚨 DEPLOYMENT SAFETY PROTOCOL ACTIVE"
echo "======================================"
echo ""

# Safety check
echo "🔍 Checking deployment safety..."
echo ""

# Verify we're in staging repository
if [[ ! -f "DEPLOYMENT-SAFETY.md" ]]; then
    echo "❌ ERROR: DEPLOYMENT-SAFETY.md not found!"
    echo "❌ This script must run from staging repository only"
    exit 1
fi

echo "✅ Safety file found - staging repository confirmed"

# Build check
echo "🔨 Running build check..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Build failed! Cannot deploy."
    exit 1
fi
echo "✅ Build successful"

# Confirm staging deployment
echo ""
echo "🎯 DEPLOYMENT TARGET: STAGING ONLY"
echo "📍 Repository: ibam-learn-platform-staging"
echo "🚫 Production deployment: BLOCKED"
echo ""

read -p "Proceed with STAGING deployment only? (y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Deployment cancelled by user"
    exit 0
fi

# Deploy to staging ONLY
echo ""
echo "🚀 Deploying to STAGING environment..."
echo "🚫 Production flag --prod is BANNED"
echo ""

vercel --yes

echo ""
echo "✅ STAGING deployment complete"
echo "🛡️ Production remains protected"
echo "📋 Review deployment at the staging URL provided above"