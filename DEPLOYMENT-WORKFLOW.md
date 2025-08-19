# 🚀 PROFESSIONAL DEPLOYMENT WORKFLOW

## Repository Setup
- **Staging Repo**: `ibam-learn-platform-staging` (daily development)
- **Production Repo**: `ibam-learn-platform-v2` (stable releases)

## Daily Development Workflow

### 1. Work in Staging
```bash
cd ibam-learn-platform-staging
# Make your changes
git add .
git commit -m "Your changes"
git push origin main  # → Auto-deploys STAGING only
```

### 2. Test in Staging
- Staging URL: https://ibam-learn-platform-staging-v2-jeff-samuelsons-projects.vercel.app
- Verify all functionality works
- Test with staging database

### 3. Promote to Production (when ready)
```bash
# Push staging code to production repo
git push production main  # → Auto-deploys PRODUCTION only
```

## Perfect Isolation Achieved
- ✅ Staging pushes → Only staging deploys
- ✅ Production promotions → Only production deploys  
- ✅ Separate databases maintained
- ✅ Zero cross-deployment risk

## For Future Sessions
When you say "deploy to production", Claude will:
1. Verify staging is working
2. Run: `git push production main`
3. Monitor production deployment
4. Confirm success

🎯 **Enterprise-grade deployment control achieved!**

## ✅ ISOLATION TEST
- Staging repo connected to staging Vercel project
- Production repo connected to production Vercel project  
- This change should ONLY deploy to staging
- Test time: August 19, 2025 9:45 PM

## 🚀 PRODUCTION PROMOTION TEST
- Promoting this change from staging to production
- Should trigger production deployment only
- Testing complete dual-repository workflow
- Promotion time: August 19, 2025 9:50 PM