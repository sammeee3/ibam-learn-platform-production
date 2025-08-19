# Components Context

## Overview
Reusable React components organized by feature and functionality for the IBAM learning platform.

## Structure
- **actions/** - Action planning and accountability components
- **case-study/** - Case study display components
- **coaching/** - AI coaching interface components
- **common/** - Shared utility components
- **feedback/** - User feedback and survey components
- **quiz/** - Interactive quiz and assessment components
- **reading/** - Content reading and display components
- **scripture/** - Biblical content and reference components
- **sections/** - Session section components (Looking Back/Up/Forward)
- **video/** - Video playback and integration components

## Key Components

### Common Components
- **VisionStatement** - Display organization vision
- **DownloadModal** - File download interface
- **MobileAdminMenu** - Mobile navigation for admin

### Learning Components
- **EnhancedReadingChunks** - Structured content reading
- **UniversalReadingWithToggle** - Flexible content display
- **EnhancedQuizSection** - Interactive assessments
- **VimeoVideo** - Video integration with Vimeo

### Session Components
- **BeautifulLookingUpSection** - Scripture and reflection
- **LookingForwardSection** - Action planning
- **ActionAccountabilityReview** - Action accountability tracking

### Coaching Components
- **AIChatInterface** - AI coaching chat interface
- **SafeFeedbackWidget** - User feedback collection

## Design Patterns
- Uses TypeScript for type safety
- Implements responsive design with Tailwind CSS
- Follows component composition patterns
- Includes accessibility features
- Uses React hooks for state management

## Integration Points
- Supabase for data persistence
- AI services for coaching features
- Video services (Vimeo) for content
- Form libraries for user input
- Export services for document generation

## Styling
- Tailwind CSS for consistent styling
- Component-specific CSS modules where needed
- Responsive design patterns
- Accessibility-first approach