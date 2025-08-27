# Services Registered & Integrations
**Date: August 26, 2025**
**User: Jeff Samuelson (sammeee@yahoo.com)**

## 🎯 Services Signed Up For Today

### 1. Resend Email Service
- **Sign-up Date**: August 26, 2025
- **Account Email**: sammeee@yahoo.com  
- **API Key**: re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W
- **Default From**: onboarding@resend.dev (development)
- **Purpose**: Sending welcome emails with magic links, membership updates
- **Plan**: Free tier (suitable for development)
- **Dashboard**: https://resend.com/dashboard

## 📧 Email Configuration
- **From Address**: IBAM Learning Platform <onboarding@resend.dev>
- **Reply-To**: sammeee@yahoo.com
- **Templates**: Welcome email, Membership updates

## 🔗 System.io Integration (Existing)
- **Webhook URL**: https://ibam-learn-platform-staging.vercel.app/api/webhooks/systemio
- **Secret Key**: staging-secret-2025-secure
- **Events Configured**: TAG_ADDED, TAG_REMOVED, CONTACT_CREATED, CONTACT_UPDATED

## 🚀 Vercel Deployment (Existing)
- **Account**: Jeff Samuelson's Projects
- **Staging Project**: ibam-learn-platform-staging
- **Production Project**: ibam-learn-platform-production-v3
- **CLI Access**: Configured with Vercel CLI 46.0.1

## 💾 Supabase (Existing)
- **Staging Database**: yhfxxouswctucxvfetcq (Aug 17, 2025)
- **Production Database**: tutrnikhomrgcpkzszvq (June 3, 2025)
- **Features Used**: Auth, Database, Real-time subscriptions

## 🎨 Other Services Mentioned
- **Hotjar**: Analytics tracking (to be configured on production URL)
- **System.io**: External platform for member management
- **GitHub**: Code repository hosting

## 📝 Notes for Production Setup

When moving to production, you'll need to:
1. Upgrade Resend to paid plan for custom domain
2. Configure production email domain (e.g., noreply@ibam-learn.com)
3. Set production webhook secret for System.io
4. Update all environment variables in Vercel
5. Configure Hotjar tracking on production domain

## 🔐 Security Reminder
- All API keys have been documented
- Production keys should be different from staging
- Never commit API keys to GitHub
- Use Vercel environment variables for deployment