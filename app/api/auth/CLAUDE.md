# Authentication API Routes Context

## Overview
Authentication endpoints for the IBAM learning platform supporting multiple auth strategies.

## Routes

### Core Auth Routes
- **sso/route.ts** - Single Sign-On authentication with external providers
- **direct-auth/route.ts** - Direct username/password authentication
- **direct-login/route.ts** - Direct login endpoint
- **token-login/route.ts** - Token-based authentication for external integrations
- **auto-login/route.ts** - Automatic login for trusted sources

### Magic Token System (NEW)
- **get-magic-token/route.ts** - Retrieves magic tokens for passwordless auth
- **magic-token/route.ts** - Authenticates users via magic tokens
- **systemio-auto-login/route.ts** - Auto-detection and login for System.io users

### Session Management
- **session/route.ts** - Session validation and management
- **me/route.ts** - Current user information endpoint
- **logout/route.ts** - User logout and session cleanup

### External Integrations
- **systemio-bridge/route.ts** - SystemIO integration bridge
- **callback/route.ts** - OAuth callback handling

## Authentication Flow

### Traditional Flow
1. User initiates login through chosen method
2. Credentials/tokens validated
3. JWT token generated and stored in secure cookie
4. User redirected to dashboard or intended destination
5. Session maintained through middleware validation

### System.io Magic Token Flow (NEW)
1. User purchases course in System.io
2. System.io sends webhook to `/api/webhooks/systemio`
3. Webhook creates user account with magic token
4. User clicks HTML button in System.io
5. SSO route validates and logs user in automatically
6. User redirected to dashboard with full access

## Security Features
- JWT token validation
- Secure HTTP-only cookies
- CSRF protection
- Rate limiting on auth endpoints
- Secure session management

## External Integrations
- SystemIO for course enrollment
- SSO providers for enterprise authentication
- Token-based API access for partner integrations

## Error Handling
- Consistent error response format
- Proper HTTP status codes
- Secure error messages (no sensitive info exposure)
- Logging for audit trails