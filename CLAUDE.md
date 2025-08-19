# IBAM Learning Platform v2

## Project Overview
This is a Next.js-based learning platform for IBAM (International Business and Ministry) focused on discipleship training and business development education.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript (App Router ONLY)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSO support
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **PDF Generation**: @react-pdf/renderer
- **Document Export**: docx library
- **Forms**: React Hook Form with Zod validation

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture
- **app/** - Next.js App Router structure (MUST NOT have conflicting pages/ directory)
- **components/** - Reusable React components
- **lib/** - Utility functions and shared logic
- **hooks/** - Custom React hooks
- **public/** - Static assets

## CRITICAL DEPLOYMENT NOTES
- **App Router Only**: This project uses Next.js App Router exclusively
- **NO pages/ directory**: Any pages/ directory will break deployments (causes 404s on all routes)
- **Environment Variables Required**: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Vercel
- **Build Process**: Must show "Route (app)" not "Route (pages)" in build output

## CURRENT STATUS: ✅ OPERATIONAL
**Last Verified**: Aug 19, 2025 11:42 AM
- ✅ **Production URL**: https://ibam-learn-platform-v3.vercel.app
- ✅ **Production Deployment**: Auto-deploys from main branch via GitHub integration
- ✅ **Staging URL**: https://ibam-learn-platform-staging-v2-1o9m2nvzl.vercel.app
- ✅ **System.io Integration**: Manual email entry system implemented (merge tags limitations discovered)
- ✅ **Staging System.io Integration**: Working correctly with staging database and deployment
- ✅ **User Identification**: Dashboard shows user names and dropdown works
- ✅ **All API Routes**: Working correctly with App Router
- ✅ **Build Errors Fixed**: systemio-bridge route now deploys successfully
- ✅ **Email Entry Form**: IBAM-themed form with animated fish, validation, and security warnings
- ✅ **Staging Email Form**: SYSTEMIO-EMAIL-FORM-STAGING.html pointing to correct deployment URL
- ✅ **Production Database Backup**: Available via CLI and Supabase dashboard
- ✅ **Database Projects**: Production (tutrnikhomrgcpkzszvq) and Staging (yhfxxouswctucxvfetcq) environments

## Key Features
- Module-based learning system with sessions
- Assessment system (pre/post assessments)
- Business planner tool
- AI coaching integration
- Progress tracking
- SSO authentication
- **System.io Integration** - Automated user creation and seamless access
- **Webhook System** - Automatic user enrollment from external platforms
- **Magic Token Authentication** - Passwordless access for external users
- Donation system
- Admin dashboard

## Authentication Flow
- Multiple auth routes supporting direct login, SSO, and token-based auth
- **Webhook-based user creation** - Automatic account setup from System.io
- **Magic token system** - Secure passwordless authentication
- **SSO integration** - Seamless access from external platforms
- Session management with JWT tokens
- Middleware for route protection

## User Identification System
- **Dashboard Title**: Shows "Welcome Back, Entrepreneur, [FirstName]!" 
- **Dropdown Menu**: Displays user email in Account section
- **localStorage Setup**: Email stored via URL parameter from SSO redirect
- **Cookie Strategy**: Both ibam_auth (client) and ibam_auth_server (server) cookies

## Database Structure
- User profiles and authentication
- **Magic token storage** - Secure token management in user_profiles table
- Course modules and sessions
- Progress tracking
- Assessment results
- Business plan data

## System.io Integration
- **Webhook Endpoint**: `/api/webhooks/systemio` - Receives user enrollment data and creates complete user accounts
- **Magic Token System**: Automatic passwordless authentication for external users (24-hour expiry)
- **Email Entry Form**: `SYSTEMIO-EMAIL-FORM.html` - Beautiful manual email entry with IBAM theming
- **Staging Email Form**: `SYSTEMIO-EMAIL-FORM-STAGING.html` - Staging version with proper deployment URL
- **Technical Limitation**: System.io merge tags (`[Email]`) only work in emails/redirects, not HTML buttons
- **Current Solution**: Manual email entry with validation, localStorage memory, and security warnings
- **Automatic User Creation**: Webhook creates auth users + user profiles + magic tokens
- **Database Integration**: Works with both production and staging environments
- **Environment Isolation**: Staging uses staging database (yhfxxouswctucxvfetcq), production uses production database (tutrnikhomrgcpkzszvq)

## DEPLOYMENT PROCESS 🚀

**Staging Deployment Method**: Automatic GitHub Integration ✅
- **Repository**: https://github.com/sammeee3/ibam-learn-platform-v2
- **Staging Project**: `ibam-learn-platform-staging-v2`
- **Auto-Deploy Branch**: `staging`
- **Process**: Push to staging → Automatic deployment to staging environment

**Production Deployment Method**: Manual Vercel CLI ✅
- **Production Project**: `ibam-learn-platform-production-v3` (DISCONNECTED from Git)
- **Target URL**: https://ibam-learn-platform-v3.vercel.app
- **Process**: Manual deployment using Vercel CLI commands

### Manual Production Deployment Options

**Option 1: Vercel Dashboard Manual Deploy**
1. Go to Vercel Dashboard → `ibam-learn-platform-production-v3`
2. Click "Deployments" → "Create Deployment"
3. Select branch `main` → Deploy

**Option 2: Re-connect Git Temporarily** 
1. Connect production project to Git when ready to deploy
2. Push to main branch → Auto-deploy
3. Disconnect Git again for safety

**Option 3: CLI Deploy (if permissions allow)**
```bash
# Deploy current branch to production project
vercel --prod --scope jeff-samuelsons-projects

# Or specify project ID directly
vercel --prod --token [YOUR_TOKEN]
```

### Deployment Workflow
1. **Test in Staging**: Push changes to `staging` branch → Auto-deploys to staging
2. **Verify Staging**: Test all functionality in staging environment
3. **Merge to Main**: Create PR from staging → main (when ready for production)
4. **Deploy Production**: Run `vercel --prod` command manually
5. **Verify Production**: Confirm deployment success
- **Process**: `vercel deploy` from staging branch
- **Working URL**: https://ibam-learn-platform-staging-v2-1o9m2nvzl.vercel.app

**Deployment Verification Commands**:
```bash
# Test production deployment success
curl -I "https://ibam-learn-platform-v3.vercel.app/api/auth/sso-debug"
# Should return: HTTP/2 200

# Test SSO flow
curl -I "https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=test@example.com&token=ibam-systeme-secret-2025"
# Should return: HTTP/2 307 with dashboard redirect
```

## Important Notes
- Uses Supabase for backend services
- Implements comprehensive session tracking
- Supports multiple user types (learners, trainers, admins)
- **Full System.io integration** - Automated enrollment and access
- **CORS-compliant authentication** - Works across domains
- Includes donation/payment functionality
- Mobile-responsive design