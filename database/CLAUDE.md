# Database Context - IBAM Learning Platform

Generated: 2025-08-15T19:25:06.207Z

## Overview
This documentation is generated from code analysis of the IBAM learning platform codebase.

## Database Architecture
- **Platform**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom middleware
- **Access Control**: Row Level Security (RLS) policies (status unknown)
- **Client Access**: Via Supabase JavaScript client

## Discovered Tables
- **user_profiles** - User account and subscription information
- **user_progress** - Session completion and progress tracking
- **sessions** - Individual learning sessions within modules
- **member_types** - Subscription tiers and access levels
- **subscription_tiers** - Purpose inferred from code usage
- **modules** - Course modules containing grouped sessions
- **assessments** - Pre and post-course evaluations
- **business_plans** - User-generated business planning data

## 🚨 Critical Security Issues Found
🔴 CRITICAL: Hardcoded secret "ibam-systeme-secret-2025" in auth routes
🔴 CRITICAL: Hardcoded Supabase key in app/direct-access/page.tsx:9
🔴 CRITICAL: httpOnly: false in cookie settings (app/api/auth/sso/route.ts:44)
🟡 HIGH: Service role key used extensively without proper scoping
🟡 HIGH: No webhook signature validation in systemio route
🟡 HIGH: Client-side database queries expose potential data
🟢 MEDIUM: Complex middleware authentication logic
🟢 MEDIUM: No rate limiting on API endpoints
🟢 MEDIUM: Verbose error logging may expose system info

## Common Query Patterns
- `SELECT * FROM user_profiles WHERE email = ? (auth routes)`
- `SELECT * FROM user_progress WHERE user_id = ? (dashboard)`
- `SELECT * FROM sessions WHERE module_id = ? (modules)`
- `INSERT INTO user_profiles (email, subscription_tier) VALUES (?, ?)`
- `UPDATE user_progress SET completion_percentage = ? WHERE session_id = ?`

## Access Patterns
- **Client-side**: Uses NEXT_PUBLIC_SUPABASE_ANON_KEY with RLS
- **API routes**: Uses SUPABASE_SERVICE_ROLE_KEY (admin access)
- **Middleware**: Validates sessions using service role key

## Immediate Security Actions Required
1. **Move hardcoded secrets to environment variables**
2. **Fix cookie security settings (httpOnly: true)**
3. **Remove client-side Supabase key exposure**
4. **Implement webhook signature validation**
5. **Audit RLS policies (not visible in code)**
6. **Add rate limiting to API endpoints**

## Files Generated
- `tables/` - Individual table analysis
- `security/` - Security assessment and recommendations
- `relationships.md` - Table relationships and data flow
