# Hooks Directory Context

## Overview
Custom React hooks for the IBAM learning platform providing reusable state management and logic.

## Files
- **useAuth.ts** - Authentication state and user management
- **useSupabaseClient.ts** - Supabase client access and utilities
- **useUsers.ts** - User data management and operations

## Key Hooks

### useAuth
- Manages user authentication state
- Provides login/logout functionality
- Handles session management
- Returns current user information and auth status

### useSupabaseClient
- Provides configured Supabase client instance
- Handles client initialization
- Manages connection state
- Provides database operation utilities

### useUsers
- User profile management
- User data CRUD operations
- User preference handling
- Profile update utilities

## Usage Patterns
- Import hooks in components that need the functionality
- Use TypeScript for proper typing
- Handle loading and error states consistently
- Implement proper cleanup in useEffect hooks

## Integration
- Works with Supabase authentication system
- Integrates with Next.js App Router
- Supports server and client-side rendering
- Provides real-time data updates where applicable

## Best Practices
- Follow React hooks rules (only call at top level)
- Implement proper dependency arrays in useEffect
- Handle edge cases and error states
- Use memo and callback hooks for performance optimization