# Environment Variables for Staging Setup

## Copy/Paste for Vercel Staging Project

### Required Environment Variables

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: [COPY FROM YOUR CURRENT PRODUCTION PROJECT]

Variable Name: SUPABASE_SERVICE_ROLE_KEY  
Value: [COPY FROM YOUR CURRENT PRODUCTION PROJECT]

Variable Name: IBAM_SYSTEME_SECRET
Value: ibam-systeme-secret-2025
```

## How to Get Current Values

### Step 1: Get Your Current Production Values
1. Go to **https://vercel.com/dashboard**
2. Click on your current project: **ibam-learn-platform-v3**
3. Go to **Settings** → **Environment Variables**
4. Copy the values for:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Set in New Staging Project
1. Create **IBAM-Learning-Platform-Staging** project
2. Go to **Settings** → **Environment Variables**
3. Add these 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL = [paste your production value]
SUPABASE_SERVICE_ROLE_KEY = [paste your production value]  
IBAM_SYSTEME_SECRET = ibam-systeme-secret-2025
```

## Quick Reference Template

For easy copy/paste when setting up staging:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `[YOUR_SUPABASE_URL_HERE]`

**Variable 2:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `[YOUR_SERVICE_ROLE_KEY_HERE]`

**Variable 3:**
- Name: `IBAM_SYSTEME_SECRET`
- Value: `ibam-systeme-secret-2025`

## Testing After Setup

Once staging is deployed:
1. Open `staging-button.html` in browser
2. Click staging button
3. Should redirect to: `https://[your-staging-url].vercel.app/dashboard`
4. Verify user identification works

## Security Notes

- ✅ Same database for staging/production (safe for testing)
- ✅ Same Supabase project (controlled environment)
- ✅ Same secret token (System.io integration works)
- ✅ Staging URL separate from production (no conflicts)