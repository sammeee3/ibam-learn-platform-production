# Business Planner Components Context

## Overview
React components for the business planning tool within the IBAM learning platform.

## Main Component
- **BusinessPlannerApp.jsx** - Root application component orchestrating the entire business planning experience

## Component Categories

### Section Components (`sections/`)
- **BusinessBasics.jsx** - Core business information and overview
- **FaithDrivenPurpose.jsx** - Faith integration and purpose definition
- **MarketOpportunity.jsx** - Market analysis and opportunity assessment
- **MarketValidation.jsx** - Market validation and customer research
- **FinancialPlanning.jsx** - Financial projections and planning
- **OperationsPlanning.jsx** - Operational strategy and planning
- **LegalCompliance.jsx** - Legal requirements and compliance
- **RiskManagement.jsx** - Risk assessment and mitigation
- **ImplementationPlan.jsx** - Step-by-step implementation roadmap
- **KPIDashboard.jsx** - Key performance indicators tracking
- **ScalingFramework.jsx** - Growth and scaling strategies
- **ReadinessAssessment.jsx** - Business readiness evaluation
- **CoachingReviews.jsx** - AI coaching feedback and reviews
- **WinsTracking.jsx** - Achievement and milestone tracking
- **Dashboard.jsx** - Overview dashboard for plan status

### Shared Components (`shared/`)
- **AICoaching.jsx** - AI coaching interface and recommendations
- **AutoSave.jsx** - Automatic plan saving functionality
- **FormComponents.jsx** - Reusable form elements and validation
- **Navigation.jsx** - Section navigation and progress tracking

## Architecture
- Modular section-based design
- Shared state management across sections
- Progressive disclosure of complexity
- AI-driven guidance and recommendations

## Key Features
- Real-time auto-save functionality
- AI coaching integration
- Progress tracking and validation
- Export capabilities
- Responsive design for all devices

## Data Flow
- Central state management through BusinessPlannerApp
- Section-specific data validation
- Auto-save triggers on form changes
- AI coaching based on completion status

## Integration Points
- Supabase for data persistence
- AI services for coaching recommendations
- Export services for document generation
- Progress tracking for learning analytics