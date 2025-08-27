# System.io Webhook Configuration
**Last Updated:** August 27, 2025

## 🎯 CORRECT WEBHOOK ENDPOINTS

### PRODUCTION Webhook (LIVE CUSTOMERS)
- **URL:** `https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio`
- **Secret:** `ibam-systeme-secret-2025`
- **Database:** Production (tutrnikhomrgcpkzszvq)
- **Purpose:** Real customer purchases
- **Tags:** 
  - IBAM Impact Members
  - Entrepreneur Member
  - Business Member
  - Church Partner Small/Large/Mega

### STAGING Webhook (TESTING ONLY)
- **URL:** `https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio`
- **Secret:** `staging-secret-2025-secure`
- **Database:** Staging (yhfxxouswctucxvfetcq)
- **Purpose:** Testing and development
- **Tags:**
  - Test tags only
  - Staging Test Member

## ⚠️ CRITICAL CONFIGURATION

### In System.io Dashboard:
1. **Production Webhook:**
   - Name: "IBAM Production"
   - URL: `https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio`
   - Events: TAG_ADDED, TAG_REMOVED, CONTACT_CREATED
   - Secret: `ibam-systeme-secret-2025`

2. **Staging Webhook:**
   - Name: "IBAM Staging/Testing"
   - URL: `https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio`
   - Events: Same as production
   - Secret: `staging-secret-2025-secure`

## 🔧 Environment Variables to Update

### Production (Vercel Dashboard → ibam-learn-platform-production-v3)
```bash
IBAM_SYSTEME_SECRET="ibam-systeme-secret-2025"
NEXT_PUBLIC_APP_URL="https://ibam-learn-platform-v3.vercel.app"
NEXT_PUBLIC_SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"
```

### Staging (Vercel Dashboard → ibam-learn-platform-staging)
```bash
IBAM_SYSTEME_SECRET="staging-secret-2025-secure"
NEXT_PUBLIC_APP_URL="https://ibam-learn-platform-staging.vercel.app"
NEXT_PUBLIC_SUPABASE_URL="https://yhfxxouswctucxvfetcq.supabase.co"
```

## ✅ How to Test

### Test Production Webhook:
```bash
curl -X POST https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $(echo -n '{"contact":{"email":"test@example.com"}}' | openssl dgst -sha256 -hmac 'ibam-systeme-secret-2025' -hex | cut -d' ' -f2)" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d '{"contact":{"email":"test@example.com"}}'
```

### Test Staging Webhook:
```bash
curl -X POST https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $(echo -n '{"contact":{"email":"test@example.com"}}' | openssl dgst -sha256 -hmac 'staging-secret-2025-secure' -hex | cut -d' ' -f2)" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d '{"contact":{"email":"test@example.com"}}'
```

## 🚨 IMPORTANT NOTES

1. **NEVER** use staging webhook URL for production customers
2. **ALWAYS** test in staging first before production changes
3. **VERIFY** the correct database is being used (check Supabase URL)
4. **MONITOR** webhook logs in admin dashboard after configuration

## 📊 Current Status
- ✅ Production webhook endpoint: ACTIVE
- ✅ Staging webhook endpoint: ACTIVE
- ⚠️ System.io configuration: NEEDS UPDATE (pointing to wrong URL)