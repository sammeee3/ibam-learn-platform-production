# Environment Variables Verification Checklist
**Date: August 27, 2025**
**Status: REVIEW REQUIRED**

## 🔴 PRODUCTION ENVIRONMENT (Vercel: ibam-learn-platform-production-v3)

### Required Variables:
```bash
# ✅ CORRECT - DO NOT CHANGE
NEXT_PUBLIC_SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"
NEXT_PUBLIC_APP_URL="https://ibam-learn-platform-v3.vercel.app"

# ⚠️ VERIFY IN VERCEL DASHBOARD
SUPABASE_SERVICE_ROLE_KEY="[CHECK VERCEL - Should be production key]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[CHECK VERCEL - Should be production anon key]"

# ✅ WEBHOOK SECRET - MUST BE THIS EXACT VALUE
IBAM_SYSTEME_SECRET="ibam-systeme-secret-2025"

# ✅ EMAIL SERVICE (Production)
RESEND_API_KEY="re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W"
EMAIL_FROM="IBAM Learning Platform <noreply@ibam-learn.com>"
EMAIL_REPLY_TO="support@ibam-learn.com"
```

### Verification Steps:
1. Go to: https://vercel.com/ibam-projects/ibam-learn-platform-production-v3/settings/environment-variables
2. Check each variable matches above
3. Special attention to IBAM_SYSTEME_SECRET - MUST be "ibam-systeme-secret-2025"

---

## 🟡 STAGING ENVIRONMENT (Vercel: ibam-learn-platform-staging)

### Required Variables:
```bash
# ✅ CORRECT - DO NOT CHANGE
NEXT_PUBLIC_SUPABASE_URL="https://yhfxxouswctucxvfetcq.supabase.co"
NEXT_PUBLIC_APP_URL="https://ibam-learn-platform-staging.vercel.app"

# ✅ STAGING KEYS (Already in .env.local)
SUPABASE_SERVICE_ROLE_KEY="sb_secret_7qGEl5QH2rI90yV9mLwumA_XP040VQx"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_Dp09PaxcR55pPqyfqp_cPA_6d4JLbQX"

# ✅ WEBHOOK SECRET - MUST BE THIS EXACT VALUE
IBAM_SYSTEME_SECRET="staging-secret-2025-secure"

# ✅ EMAIL SERVICE (Staging)
RESEND_API_KEY="re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W"
EMAIL_FROM="IBAM Learning Platform <onboarding@resend.dev>"
EMAIL_REPLY_TO="sammeee@yahoo.com"
```

### Verification Steps:
1. Go to: https://vercel.com/ibam-projects/ibam-learn-platform-staging/settings/environment-variables
2. Check each variable matches above
3. Special attention to IBAM_SYSTEME_SECRET - MUST be "staging-secret-2025-secure"

---

## 🚨 CRITICAL CHECKS:

### 1. Database URLs MUST be different:
- ❌ WRONG: Both using same Supabase URL
- ✅ RIGHT: 
  - Production: tutrnikhomrgcpkzszvq.supabase.co
  - Staging: yhfxxouswctucxvfetcq.supabase.co

### 2. Webhook Secrets MUST be different:
- ❌ WRONG: Both using same secret
- ✅ RIGHT:
  - Production: "ibam-systeme-secret-2025"
  - Staging: "staging-secret-2025-secure"

### 3. App URLs MUST point to correct domains:
- ❌ WRONG: Production using staging URL
- ✅ RIGHT:
  - Production: https://ibam-learn-platform-v3.vercel.app
  - Staging: https://ibam-learn-platform-staging.vercel.app

---

## 📝 ACTION ITEMS:

### For Production:
- [ ] Verify IBAM_SYSTEME_SECRET = "ibam-systeme-secret-2025"
- [ ] Verify NEXT_PUBLIC_APP_URL = "https://ibam-learn-platform-v3.vercel.app"
- [ ] Verify Supabase URL = production database
- [ ] Add production Supabase keys if missing

### For Staging:
- [ ] Verify IBAM_SYSTEME_SECRET = "staging-secret-2025-secure"
- [ ] Verify NEXT_PUBLIC_APP_URL = "https://ibam-learn-platform-staging.vercel.app"
- [ ] Verify Supabase URL = staging database
- [ ] All variables already in .env.local

---

## ✅ EXPECTED RESULT:

When properly configured:
1. **Production webhooks** → Production database → Real users
2. **Staging webhooks** → Staging database → Test users
3. **No cross-contamination** between environments
4. **"Staging Work Only" tag** → Only creates users in staging

---

## 🔧 HOW TO UPDATE IN VERCEL:

1. Go to Vercel Dashboard
2. Select the project (production or staging)
3. Settings → Environment Variables
4. Add or update each variable
5. Select "Production" environment for production vars
6. Save changes
7. Redeploy for changes to take effect

⚠️ **IMPORTANT**: After updating environment variables, you must redeploy for changes to take effect!