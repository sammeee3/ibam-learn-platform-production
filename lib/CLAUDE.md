# Lib Directory Context

## Overview
Core utility functions, types, and shared logic for the IBAM learning platform.

## Files
- **supabase.ts** - Supabase client configuration and initialization
- **enhanced-auth.ts** - Enhanced authentication utilities and helpers
- **donation-helpers.ts** - Donation system utility functions

## Key Features

### Supabase Integration
- Client-side and server-side Supabase clients
- Authentication helper functions
- Database query utilities
- Session management

### Enhanced Authentication
- Multi-provider authentication support
- JWT token validation and management
- User session utilities
- Permission and role checking

### Donation System
- Payment processing helpers
- Donation goal tracking
- Financial calculation utilities
- Fundraising analytics

## Usage Patterns
- Import utilities across the application
- Centralized configuration management
- Type-safe database operations
- Consistent error handling

## Dependencies
- Supabase JavaScript client
- JWT libraries for token management
- Date utilities for time calculations
- Validation libraries for data integrity

## Best Practices
- Use TypeScript for all utility functions
- Implement proper error handling
- Follow functional programming patterns where possible
- Maintain consistent API interfaces