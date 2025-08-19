# user_progress Table Analysis

## Overview
Tracks user completion of sessions and modules

## Columns (Inferred from Code)
### user_id
- **Type**: uuid
- **Required**: true
- **Description**: References user_profiles.user_id

### session_id
- **Type**: number
- **Required**: true
- **Description**: References sessions.id

### completion_percentage
- **Type**: number
- **Required**: true
- **Description**: Progress percentage (0-100)

### last_accessed_at
- **Type**: timestamptz
- **Required**: true
- **Description**: Last activity timestamp

### quiz_score
- **Type**: number
- **Required**: false
- **Description**: Assessment score if completed

## Usage in Application
Core progress tracking, used in dashboard and module navigation

## Security Concerns
- ⚠️ User data isolation depends on RLS policies
- ⚠️ Accessed from client-side code in some areas

## Code References
Found in: middleware.ts, auth routes, dashboard components

## Recommendations
- Implement RLS policies for user data isolation
- Move sensitive queries to API routes
- Add proper input validation
- Audit access patterns for least privilege
