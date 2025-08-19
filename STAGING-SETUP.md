# Staging Environment Setup - URGENT ACTIONS NEEDED

## ✅ COMPLETED (Just Now)
- [x] Created staging branch
- [x] Set up GitHub Actions safety checks
- [x] Created staging HTML button

## 🚨 MANUAL STEPS REQUIRED (You Must Do These)

### 1. Create Staging Vercel Project (2 minutes)
1. Go to **https://vercel.com/dashboard**
2. Click **"Add New" → "Project"**
3. Import from GitHub: `sammeee3/ibam-learn-platform-v2`
4. **Project Name**: `IBAM-Learning-Platform-Staging`
5. **Framework**: Next.js
6. **Branch**: `staging` (IMPORTANT!)
7. Click **Deploy**

### 2. Set Environment Variables in Staging (3 minutes)
In the new staging project settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
IBAM_SYSTEME_SECRET=ibam-systeme-secret-2025
```

**Copy these from your current production deployment**

### 3. Get Staging URL (1 minute)
After deployment completes, note the staging URL:
- Should be something like: `https://ibam-learning-platform-staging.vercel.app`

### 4. Test Staging (2 minutes)
1. Open `staging-button.html` in browser
2. Click the staging button
3. Verify it redirects to staging dashboard
4. Confirm user identification works

## 🔒 PRODUCTION PROTECTION ACTIVE

Your production site now has these safeguards:
- ✅ Safety checks prevent Pages/App Router conflicts
- ✅ Staging branch for testing changes
- ✅ Automated build validation
- ✅ Critical file protection

## Next Steps After Manual Setup

1. **Test staging completely**
2. **Update System.io with staging button for testing**
3. **Create production naming plan**
4. **Set up branch protection rules**

## Emergency Contacts
- Production URL: https://ibam-learn-platform-v3.vercel.app (PROTECTED)
- Repository: https://github.com/sammeee3/ibam-learn-platform-v2
- Safety checks: Will run automatically on PRs to main

**Time remaining: 7 minutes to complete manual Vercel setup!**