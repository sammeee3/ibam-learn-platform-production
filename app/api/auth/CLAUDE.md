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

### Session Management
- **session/route.ts** - Session validation and management
- **me/route.ts** - Current user information endpoint
- **logout/route.ts** - User logout and session cleanup

### External Integrations
- **systemio-bridge/route.ts** - SystemIO integration bridge
- **callback/route.ts** - OAuth callback handling

## Authentication Flow
1. User initiates login through chosen method
2. Credentials/tokens validated
3. JWT token generated and stored in secure cookie
4. User redirected to dashboard or intended destination
5. Session maintained through middleware validation

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