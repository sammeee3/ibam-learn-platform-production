# Environment Variables Documentation
**Last Updated: August 26, 2025**

## 🔐 Critical Environment Variables

### Staging Environment
```bash
# 🔒 SECURE: All keys stored in Vercel environment variables
# ⚠️ NEVER put real secrets in documentation files

# Supabase (Staging Database)
NEXT_PUBLIC_SUPABASE_URL="https://yhfxxouswctucxvfetcq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[SECURE_IN_VERCEL_ENV_VARS]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[SECURE_IN_VERCEL_ENV_VARS]"

# System.io Webhook Security
IBAM_SYSTEME_SECRET="[SECURE_IN_VERCEL_ENV_VARS]"

# Resend Email Service (Added Aug 26, 2025)
RESEND_API_KEY="[SECURE_IN_VERCEL_ENV_VARS]"
EMAIL_FROM="IBAM Learning Platform <onboarding@resend.dev>"
EMAIL_REPLY_TO="sammeee@yahoo.com"
```

### Production Environment
```bash
# Supabase (Production Database)
NEXT_PUBLIC_SUPABASE_URL="https://tutrnikhomrgcpkzszvq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[PRODUCTION_KEY_SECURE]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PRODUCTION_ANON_KEY]"

# System.io Webhook Security
IBAM_SYSTEME_SECRET="[PRODUCTION_SECRET_REQUIRED]"

# Resend Email Service
RESEND_API_KEY="[PRODUCTION_RESEND_KEY_REQUIRED]"
EMAIL_FROM="IBAM Learning Platform <noreply@ibam-learn.com>"
EMAIL_REPLY_TO="support@ibam-learn.com"
```

## 📊 Database References

### Staging Database
- **Project ID**: yhfxxouswctucxvfetcq
- **Created**: August 17, 2025
- **URL**: https://yhfxxouswctucxvfetcq.supabase.co
- **Purpose**: Development and testing

### Production Database  
- **Project ID**: tutrnikhomrgcpkzszvq
- **Created**: June 3, 2025
- **URL**: https://tutrnikhomrgcpkzszvq.supabase.co
- **Purpose**: Live user data

## 🚀 Deployment URLs

### Staging
- **Primary**: https://ibam-learn-platform-staging.vercel.app
- **Latest Deployment**: https://ibam-learn-platform-staging-a7jogrbs9-ibam-projects.vercel.app

### Production
- **Primary**: https://ibam-learn-platform-production-v3.vercel.app
- **Latest Deployment**: https://ibam-learn-platform-production-v3-qvh1exnnp.vercel.app

## ⚠️ Security Notes

1. **Keys Rotated**: All staging keys rotated on Aug 24, 2025 after GitHub exposure
2. **Never Commit**: Production keys should NEVER be in code
3. **Vercel Config**: Set environment variables in Vercel dashboard for deployments
4. **Local Dev**: Use .env.local file (git-ignored)

## 🔧 Setting Environment Variables

### Local Development
1. Create `.env.local` file in project root
2. Copy staging environment variables above
3. Never commit this file

### Vercel Deployment
1. Go to Vercel dashboard → Settings → Environment Variables
2. Add each variable for Preview and Production environments
3. Redeploy after adding variables

## 🎯 Required for Features

- **Webhook Processing**: IBAM_SYSTEME_SECRET
- **Email Sending**: RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO
- **Database Access**: All SUPABASE_* variables
- **Authentication**: NEXT_PUBLIC_SUPABASE_* variables