# 🔄 Security Fix Rollback Instructions

## Quick Rollback (if anything breaks)

### 1. Restore Original Files
```bash
# Restore auth routes
cp ./security-backups/route.ts.sso.backup app/api/auth/sso/route.ts
cp ./security-backups/route.ts.direct-auth.backup app/api/auth/direct-auth/route.ts  
cp ./security-backups/route.ts.token-login.backup app/api/auth/token-login/route.ts

# Restore client page
cp ./security-backups/page.tsx.direct-access.backup app/direct-access/page.tsx
```

### 2. Remove Environment Variables (if needed)
In your hosting platform (Vercel/etc), remove:
- `IBAM_SYSTEME_SECRET`
- Any other newly added variables

### 3. Redeploy
```bash
# Force redeploy with original code
git add . && git commit -m "Rollback security changes" && git push
```

## What Was Changed
- ✅ Added environment variable fallbacks to auth routes
- ✅ Fixed cookie security settings
- ✅ Removed hardcoded Supabase key from client code
- ✅ All changes maintain backward compatibility

## Verification Steps
After rollback, test:
1. SSO login: `/api/auth/sso?email=test@example.com&token=ibam-systeme-secret-2025`
2. Direct auth: `/api/auth/direct-auth`
3. Dashboard access: `/dashboard`
4. No 500 errors in console

## Emergency Contact
If rollback fails, the original hardcoded values were:
- Secret: `ibam-systeme-secret-2025`
- Supabase key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in backup files)

## Files Backed Up
- `./security-backups/route.ts.sso.backup`
- `./security-backups/route.ts.direct-auth.backup`
- `./security-backups/route.ts.token-login.backup`
- `./security-backups/page.tsx.direct-access.backup`