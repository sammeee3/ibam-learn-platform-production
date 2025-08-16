# Webhooks API Context

## Overview
Webhook endpoints for external service integrations with the IBAM learning platform.

## Webhook Routes

### SystemIO Integration
- **systemio/route.ts** - Main SystemIO webhook for course enrollments and updates
- **systeme-membership/route.ts** - Membership status updates from SystemIO
- **systeme-church-leader/route.ts** - Church leader role assignments

### Monitoring & Testing
- **health-monitor/route.ts** - Health check endpoint for monitoring services
- **test-simulation/route.ts** - Testing endpoint for webhook simulation

## Key Functions

### SystemIO Webhooks
- **Automatic User Creation** - Creates complete user profiles from webhook data
- **Magic Token Generation** - Generates secure tokens for passwordless access
- **Course Assignment** - Maps System.io tags to IBAM courses automatically
- **Auth User Creation** - Creates Supabase auth users with email confirmation
- Handle course enrollment notifications
- Process membership tier changes
- Update user access permissions
- Sync user data between platforms

### Membership Management
- Track membership status changes
- Handle subscription updates
- Process payment confirmations
- Manage access level modifications

### Church Leader Management
- Process leader role assignments
- Handle permission updates
- Sync leadership data
- Manage organizational hierarchies

## Security
- Webhook signature validation
- Rate limiting protection
- Source IP verification where applicable
- Secure payload processing

## Data Processing
- JSON payload parsing
- Data validation and sanitization
- **Complete user profile creation** - Auth users + user profiles + magic tokens
- **Tag-based course mapping** - Automatic course assignment from System.io tags
- Database updates via Supabase
- Error handling and retry logic

## Magic Token System
- **24-hour token expiry** - Secure time-limited access
- **Unique token generation** - Cryptographically secure random tokens
- **Database storage** - Tokens stored in user_profiles.magic_token column
- **Automatic refresh** - New tokens generated as needed

## Monitoring
- Request logging for audit trails
- Performance metrics tracking
- Error rate monitoring
- Integration health checks

## Integration Points
- SystemIO course platform
- Payment processing systems
- Church management systems
- Monitoring and alerting services