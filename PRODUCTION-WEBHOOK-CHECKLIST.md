# System.io Webhook Production Deployment Checklist

## Current Staging Status ✅
- **Endpoint**: `/api/webhooks/systemio` - ACTIVE
- **Security**: HMAC-SHA256 signature validation - WORKING
- **Rate Limiting**: 10 requests/minute per IP - IMPLEMENTED
- **User Creation**: Auth users + profiles + magic tokens - FUNCTIONAL
- **Course Assignment**: Tag-based mapping system - CONFIGURED

## Production Requirements

### 1. Environment Variables (CRITICAL)
**Required in Vercel Production Environment:**
```
IBAM_SYSTEME_SECRET="[PRODUCTION_SECRET_FROM_SYSTEMIO]"
NEXT_PUBLIC_SUPABASE_URL="[PRODUCTION_SUPABASE_URL]"
SUPABASE_SERVICE_ROLE_KEY="[PRODUCTION_SERVICE_KEY]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PRODUCTION_ANON_KEY]"
RESEND_API_KEY="[PRODUCTION_RESEND_KEY]"
EMAIL_FROM="IBAM Learning Platform <[PRODUCTION_EMAIL]>"
EMAIL_REPLY_TO="[PRODUCTION_REPLY_EMAIL]"
```

### 2. System.io Configuration
- [ ] Generate new PRODUCTION webhook secret in System.io dashboard
- [ ] Configure webhook URL: `https://ibam-learn-platform-production-v3.vercel.app/api/webhooks/systemio`
- [ ] Set webhook events:
  - `CONTACT_TAG_ADDED`
  - `CONTACT_TAG_REMOVED`
- [ ] Configure signature header: `X-Webhook-Signature`
- [ ] Test with System.io test event feature

### 3. Database Verification
- [ ] Verify production database has required tables:
  - `user_profiles` with magic_token columns
  - `webhook_logs` for monitoring
- [ ] Confirm RLS policies allow service_role operations
- [ ] Test magic token expiry (7 days)

### 4. Email Service (Resend)
- [ ] Verify production Resend API key
- [ ] Configure production FROM email address
- [ ] Test welcome email delivery
- [ ] Verify magic link URLs point to production domain

### 5. Security Validation
- [ ] Different webhook secret from staging
- [ ] HMAC signature validation working
- [ ] Rate limiting active (10 req/min)
- [ ] No sensitive data in logs

### 6. Testing Steps
1. **Dry Run Test**:
   ```bash
   curl -X GET https://ibam-learn-platform-production-v3.vercel.app/api/webhooks/systemio
   ```

2. **Signature Test** (after System.io configuration):
   - Use System.io test feature
   - Verify signature validation passes
   - Check user creation in production database

3. **End-to-End Test**:
   - Add test tag in System.io
   - Verify user receives welcome email
   - Test magic link login
   - Confirm course assignment

### 7. Monitoring Setup
- [ ] Check webhook logs: `/api/webhooks/health-monitor`
- [ ] Monitor error rates in Vercel dashboard
- [ ] Set up alerts for failed webhooks

### 8. Rollback Plan
- Keep staging webhook active as backup
- Document production webhook secret securely
- Have database backup before go-live

## Current Blockers
- ⚠️ Need production webhook secret from System.io
- ⚠️ Production email configuration pending

## Ready for Production?
- [x] Code tested and working in staging
- [x] Security measures implemented
- [x] Database schema aligned
- [ ] Production environment variables set
- [ ] System.io production configuration complete
- [ ] End-to-end testing passed