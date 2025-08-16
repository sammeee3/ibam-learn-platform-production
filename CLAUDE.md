# IBAM Learning Platform v2

## Project Overview
This is a Next.js-based learning platform for IBAM (International Business and Ministry) focused on discipleship training and business development education.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
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
- **app/** - Next.js App Router structure
- **components/** - Reusable React components
- **lib/** - Utility functions and shared logic
- **hooks/** - Custom React hooks
- **public/** - Static assets

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

## Database Structure
- User profiles and authentication
- **Magic token storage** - Secure token management in user_profiles table
- Course modules and sessions
- Progress tracking
- Assessment results
- Business plan data

## System.io Integration
- **Webhook Endpoint**: `/api/webhooks/systemio` - Receives user enrollment data
- **Magic Token System**: Automatic passwordless authentication for external users
- **HTML Button**: `system-io-FINAL-working.html` - Ready-to-use System.io integration
- **Automatic User Creation**: Webhook creates complete user profiles with platform access
- **Seamless Access**: One-click login from System.io to IBAM platform

## Important Notes
- Uses Supabase for backend services
- Implements comprehensive session tracking
- Supports multiple user types (learners, trainers, admins)
- **Full System.io integration** - Automated enrollment and access
- **CORS-compliant authentication** - Works across domains
- Includes donation/payment functionality
- Mobile-responsive design