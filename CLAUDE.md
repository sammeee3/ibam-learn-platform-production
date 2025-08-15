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
- Donation system
- Admin dashboard

## Authentication Flow
- Multiple auth routes supporting direct login, SSO, and token-based auth
- Session management with JWT tokens
- Middleware for route protection

## Database Structure
- User profiles and authentication
- Course modules and sessions
- Progress tracking
- Assessment results
- Business plan data

## Important Notes
- Uses Supabase for backend services
- Implements comprehensive session tracking
- Supports multiple user types (learners, trainers, admins)
- Includes donation/payment functionality
- Mobile-responsive design