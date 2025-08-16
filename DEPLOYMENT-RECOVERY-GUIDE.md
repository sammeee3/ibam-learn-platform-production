# Emergency Deployment Recovery Guide

## Quick Diagnosis

### Symptom: All Routes Return 404
**Cause**: Pages/App Router conflict
**Check**: Look for `pages/` directory
**Fix**: Remove `pages/` directory completely
```bash
mv pages pages_backup_$(date +%Y%m%d_%H%M%S)
git add -A && git commit -m "Remove conflicting pages directory" && git push
```

### Symptom: Build Fails with "supabaseUrl is required"
**Cause**: Missing environment variables
**Check**: Vercel project settings → Environment Variables
**Fix**: Add required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IBAM_SYSTEME_SECRET`

### Symptom: Build Shows "Route (pages)"
**Cause**: Next.js defaulting to Pages Router
**Check**: Build logs should show "Route (app)"
**Fix**: Remove any `pages/` directory

### Symptom: System.io Button Opens 404
**Cause**: HTML button pointing to wrong/broken deployment
**Check**: Console logs show correct URL
**Fix**: Update HTML button URL to working deployment

## Working Deployment URLs
- **Primary**: https://ibam-learn-platform-v3.vercel.app
- **Backup**: https://ibam-learning.vercel.app

## Critical Files to Preserve

### Authentication
- `app/api/auth/sso/route.ts` - Main SSO endpoint
- `app/dashboard/page.tsx` - User identification logic
- `app/components/common/MobileAdminMenu.tsx` - Dropdown display

### Integration
- `system-io-UPDATED-button.html` - System.io button
- `app/layout.tsx` - User profile loading
- `middleware.ts` - Route protection

### Configuration
- `next.config.js` - Next.js App Router config
- `package.json` - Dependencies
- `CLAUDE.md` - Project documentation

## Recovery Commands

### Fix Git Repository Issues
```bash
# Clean up unstaged changes
git stash

# Reset to last working commit
git reset --hard HEAD~1

# Force clean deployment
git add -A && git commit -m "Emergency recovery" && git push --force
```

### Test Deployment Health
```bash
# Test main site
curl -I https://ibam-learn-platform-v3.vercel.app/

# Test SSO endpoint
curl -I "https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=test@example.com&token=ibam-systeme-secret-2025"
```

## Rollback Procedure

### If Deployment Completely Broken
1. Go to Vercel dashboard
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Update HTML button if needed

### If Need Emergency Access
**Fallback System.io Button URL**:
```javascript
// Use if main deployment fails
var ssoUrl = 'https://ibam-learning.vercel.app/api/auth/sso?email=' + encodeURIComponent(userEmail) + '&token=ibam-systeme-secret-2025';
```

## Prevention Checklist

### Before Making Changes
- [ ] Backup current working state
- [ ] Test changes in staging first
- [ ] Verify no `pages/` directory
- [ ] Check environment variables

### After Each Deployment
- [ ] Test System.io button
- [ ] Verify user identification works
- [ ] Check build logs for "Route (app)"
- [ ] Test SSO endpoint directly

## Contact Information
- **Repository**: https://github.com/sammeee3/ibam-learn-platform-v2
- **Primary Deployment**: https://ibam-learn-platform-v3.vercel.app
- **HTML Button Location**: System.io course content