# Resend API Key Configuration

## Your API Key (Created Aug 26, 2025)
```
RESEND_API_KEY=re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W
```

## Where to Add This Key:

### 1. Local Development (.env.local)
Add to your `.env.local` file:
```
RESEND_API_KEY=re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W
EMAIL_FROM=IBAM Learning Platform <noreply@ibam-learn.com>
EMAIL_REPLY_TO=support@ibam-learn.com
```

### 2. Vercel Staging Environment
1. Go to: https://vercel.com/sammeee3/ibam-learn-platform-staging-v2/settings/environment-variables
2. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_TttZ8Gyf_3JWqBwf6BaHoSzPYVTKirH4W`
   - Environment: All (Production, Preview, Development)

### 3. Vercel Production Environment
1. Go to: https://vercel.com/sammeee3/ibam-learn-platform-production-v3/settings/environment-variables
2. Add same variable as above

## What This Enables:
- ✅ Welcome emails with magic links (7-day expiry)
- ✅ Membership update notifications
- ✅ 100 free emails per day
- ✅ Beautiful HTML email templates

## Test Email Sending:
1. Go to webhook monitor: http://localhost:3001/admin/webhooks
2. Click "Test IBAM Member" button
3. Check console for email send confirmation

## Security Note:
- This key is for sammeee@yahoo.com's Resend account
- Keep this file private (already in .gitignore)
- Never commit this key to GitHub