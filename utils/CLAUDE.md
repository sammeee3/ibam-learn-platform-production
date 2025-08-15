# Utils Directory Context

## Overview
Utility functions and helper modules for the IBAM learning platform.

## Structure
- **supabase/** - Supabase-specific utilities and server configurations

## Files
- **supabase/server.js** - Server-side Supabase configuration and utilities

## Key Features

### Supabase Server Utilities
- Server-side Supabase client configuration
- Database connection management
- Server-side authentication helpers
- API route utilities for database operations

## Usage Patterns
- Import utilities in API routes and server components
- Use for server-side data operations
- Handle authentication on the server side
- Manage database connections and queries

## Integration
- Works with Next.js API routes
- Supports server-side rendering
- Integrates with authentication middleware
- Handles database operations securely

## Best Practices
- Use server-side utilities for sensitive operations
- Implement proper error handling
- Follow security best practices for database access
- Maintain separation between client and server utilities