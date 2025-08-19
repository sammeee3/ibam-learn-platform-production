# API Routes Context

## Overview
Next.js API routes handling backend functionality for the IBAM learning platform.

## Structure
- **auth/** - Authentication endpoints (login, logout, session management, SSO)
- **webhooks/** - External service webhooks (SystemIO, church leader notifications)
- **sessions/** - Session data management and progress tracking
- **progress/** - User progress tracking endpoints
- **discipleship/** - Discipleship course data endpoints

## Authentication Routes
- `sso/route.ts` - Single Sign-On authentication
- `direct-auth/route.ts` - Direct authentication
- `token-login/route.ts` - Token-based login
- `session/route.ts` - Session validation and management
- `me/route.ts` - Current user information

## Key Features
- JWT token validation and generation
- Supabase integration for data persistence
- Webhook handling for external integrations
- Session state management
- User progress tracking

## Security
- Middleware protection for sensitive routes
- Token validation on protected endpoints
- Secure cookie handling for authentication
- CORS configuration for external webhooks

## Database Integration
- Uses Supabase client for database operations
- Handles user profiles, sessions, and progress data
- Implements proper error handling and logging