# 🚨 PRODUCTION ENVIRONMENT VARIABLES CHECKLIST

## CRITICAL: Add these to Vercel Production NOW

### 1. EMAIL SERVICE (REQUIRED FOR WELCOME EMAILS)
```bash
RESEND_API_KEY="re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W"
EMAIL_FROM="IBAM Learning Platform <onboarding@resend.dev>"
EMAIL_REPLY_TO="sammeee@yahoo.com"
```

### 2. APP CONFIGURATION
```bash
NEXT_PUBLIC_APP_URL="https://ibam-learn-platform-v3.vercel.app"
```

### 3. WEBHOOK SECRET
```bash
IBAM_SYSTEME_SECRET="ibam-systeme-secret-2025"
```

### 4. SUPABASE (Should already be set)
```bash
NEXT_PUBLIC_SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_PRODUCTION_KEY]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_PRODUCTION_ANON_KEY]"
```

## 📋 HOW TO ADD IN VERCEL:

1. Go to: https://vercel.com/dashboard
2. Select: **ibam-learn-platform-production-v3**
3. Click: **Settings** → **Environment Variables**
4. For EACH variable above:
   - Click "Add New"
   - Name: Copy exact variable name
   - Value: Copy the value
   - Environment: Select "Production" ✅
   - Click "Save"

## 🔍 WHY EMAILS AREN'T SENDING:

The most likely reason is **RESEND_API_KEY is missing** in production Vercel.

Without this key, the email service returns:
```
⚠️ Resend API key not configured - email not sent
```

## ✅ AFTER ADDING VARIABLES:

1. **Redeploy** the production site (Vercel → Deployments → Redeploy)
2. **Test** with a new System.io webhook
3. **Check** your email for welcome message

## 🧪 TEST COMMAND (After fixing):
```bash
curl -X POST https://ibam-learn-platform-v3.vercel.app/api/webhooks/systemio \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $(echo -n '{"contact":{"email":"sammeee@yahoo.com","fields":[{"slug":"first_name","value":"Test"}],"tags":[{"name":"IBAM Impact Members"}]}}' | openssl dgst -sha256 -hmac 'ibam-systeme-secret-2025' -hex | cut -d' ' -f2)" \
  -H "X-Webhook-Event: CONTACT_TAG_ADDED" \
  -d '{"contact":{"email":"sammeee@yahoo.com","fields":[{"slug":"first_name","value":"Test"}],"tags":[{"name":"IBAM Impact Members"}]}}'
```

This should trigger a welcome email to sammeee@yahoo.com