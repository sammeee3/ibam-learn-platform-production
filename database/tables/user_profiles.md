# user_profiles Table Analysis

## Overview
User account information and subscription details

## Columns (Inferred from Code)
### email
- **Type**: text
- **Required**: true
- **Description**: User email address (used as identifier)

### subscription_tier
- **Type**: text
- **Required**: false
- **Description**: User membership level (trial, paid, etc.)

### created_at
- **Type**: timestamptz
- **Required**: false
- **Description**: Account creation timestamp

### user_id
- **Type**: uuid
- **Required**: true
- **Description**: Primary key reference to auth.users

## Usage in Application
Primary user data storage, referenced in all auth flows

## Security Concerns
- ⚠️ Accessed via service role key in middleware
- ⚠️ Email used as identifier in SSO flows
- ⚠️ No visible RLS policies in code

## Code References
Found in: middleware.ts, auth routes, dashboard components

## Recommendations
- Implement RLS policies for user data isolation
- Move sensitive queries to API routes
- Add proper input validation
- Audit access patterns for least privilege
