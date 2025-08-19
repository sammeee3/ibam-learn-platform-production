# App Directory Context

## Overview
This is the main Next.js App Router directory containing all pages, components, and API routes.

## Structure
- **api/** - API routes for authentication, webhooks, sessions, and data management
- **auth/** - Authentication pages (login, signup, callbacks)
- **modules/** - Course module pages with dynamic routing
- **dashboard/** - Main user dashboard
- **business-planner/** - Business planning tool with React components
- **components/** - Reusable React components organized by feature
- **lib/** - App-specific utilities and types

## Key Features
- Module-based learning system with sessions
- Dynamic routing for courses and sessions
- Authentication system with multiple providers
- Business planning tool with AI coaching
- Assessment system (pre/post assessments)
- Progress tracking and analytics

## Component Architecture
- Components are organized by feature/domain
- Shared components in `/components/common/`
- Feature-specific components in dedicated folders
- Uses TypeScript for type safety

## Authentication
- Multiple auth strategies: SSO, direct login, token-based
- Session management with middleware
- Protected routes and user role management