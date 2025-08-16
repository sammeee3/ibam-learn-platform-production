# System.io Integration - Critical Lessons Learned

## Overview
This document captures critical lessons learned during System.io integration troubleshooting to prevent future issues.

## Core Integration Components

### 1. HTML Button (system-io-UPDATED-button.html)
**Purpose**: Embedded in System.io courses to provide seamless login
**Critical Requirements**:
- Must point to correct Vercel deployment URL
- Email detection with multiple fallback methods
- Opens in new window with `window.open(ssoUrl, '_blank', 'noopener,noreferrer')`

### 2. SSO Route (/api/auth/sso/route.ts)
**Purpose**: Handles authentication from System.io button
**Critical Features**:
- Email parameter from URL
- Token validation (ibam-systeme-secret-2025)
- Direct redirect to /dashboard with email parameter
- Dual cookie strategy (ibam_auth + ibam_auth_server)

### 3. Dashboard User Identification
**Purpose**: Shows user names and proper identification
**Requirements**:
- Reads email from URL parameter on load
- Sets localStorage for user identification
- Displays "Welcome Back, Entrepreneur, [FirstName]!"
- Dropdown shows email in Account section

## Critical Deployment Issues & Solutions

### Issue 1: Pages/App Router Conflict
**Problem**: Having both `app/` and `pages/` directories causes Next.js to default to Pages Router
**Symptoms**: 
- Build output shows "Route (pages)" instead of "Route (app)"
- All API routes return 404
- Only 404 page is built

**Solution**: Remove any `pages/` directory completely
**Prevention**: Never create files in `pages/` directory

### Issue 2: Environment Variables Missing
**Problem**: Supabase client initialization fails during build
**Symptoms**: "supabaseUrl is required" error during build
**Solution**: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel
**Prevention**: Use lazy initialization for Supabase clients in API routes

### Issue 3: Multiple Vercel Deployments Confusion
**Problem**: Repository connected to multiple Vercel projects
**Symptoms**: Commits deploy to different URLs, causing confusion
**Solution**: Use single primary deployment (ibam-learn-platform-v3.vercel.app)
**Prevention**: Disconnect unused Vercel projects

## Working Configuration (REFERENCE)

### HTML Button URL
```javascript
var ssoUrl = 'https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=' + encodeURIComponent(userEmail) + '&token=ibam-systeme-secret-2025';
```

### SSO Route Key Features
```typescript
// Direct redirect to dashboard with email
const dashboardUrl = new URL('/dashboard', request.url);
dashboardUrl.searchParams.set('email', email);

// Dual cookie strategy
response.cookies.set('ibam_auth', email, { httpOnly: false });
response.cookies.set('ibam_auth_server', email, { httpOnly: true });
```

### Dashboard Email Setup
```typescript
useEffect(() => {
  const email = searchParams?.get('email') || null;
  if (email) {
    localStorage.setItem('ibam-auth-email', email);
    router.push('/dashboard'); // Clean URL
  }
}, [searchParams, router]);
```

## Testing Checklist

### Before Deployment
- [ ] Verify no `pages/` directory exists
- [ ] Build output shows "Route (app)" not "Route (pages)"
- [ ] Environment variables set in Vercel
- [ ] HTML button points to correct deployment URL

### After Deployment
- [ ] System.io button opens new window
- [ ] SSO route returns 302 redirect (not 404)
- [ ] Dashboard loads with email parameter
- [ ] User name appears in dashboard title
- [ ] Email appears in dropdown Account section

## Common Mistakes to Avoid

1. **Never create pages/ directory** - Breaks App Router completely
2. **Don't change SSO redirect target** - Must go directly to /dashboard
3. **Don't skip email URL parameter** - Required for localStorage setup
4. **Don't forget dual cookies** - Both client and server cookies needed
5. **Don't initialize Supabase at module level** - Use lazy initialization

## Emergency Recovery

### If All Deployments Show 404:
1. Check for `pages/` directory - remove if exists
2. Verify environment variables in Vercel
3. Check build logs for "Route (app)" vs "Route (pages)"

### If System.io Button Fails:
1. Verify HTML button URL points to working deployment
2. Test SSO route directly in browser
3. Check console logs for JavaScript errors

### If User Names Don't Show:
1. Verify email parameter in dashboard URL
2. Check localStorage is being set
3. Verify user profile API is working
4. Check dual cookie strategy implementation

## Version History
- **Aug 16, 2025**: Resolved Pages/App Router conflict
- **Aug 16, 2025**: Fixed user identification system
- **Aug 16, 2025**: Established dual cookie strategy