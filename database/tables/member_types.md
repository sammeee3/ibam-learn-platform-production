# member_types Table Analysis

## Overview
Subscription tier definitions and pricing

## Columns (Inferred from Code)
### tier_key
- **Type**: text
- **Required**: true
- **Description**: Unique tier identifier

### display_name
- **Type**: text
- **Required**: true
- **Description**: Human-readable tier name

### monthly_price
- **Type**: decimal
- **Required**: false
- **Description**: Monthly subscription cost

### features
- **Type**: jsonb
- **Required**: false
- **Description**: Available features for tier

## Usage in Application
Referenced in user registration and subscription management

## Security Concerns
- ⚠️ Pricing information should be protected
- ⚠️ Tier escalation controls not visible

## Code References
Found in: middleware.ts, auth routes, dashboard components

## Recommendations
- Implement RLS policies for user data isolation
- Move sensitive queries to API routes
- Add proper input validation
- Audit access patterns for least privilege
