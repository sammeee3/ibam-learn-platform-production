# Modules Context

## Overview
Course module system with dynamic routing for the IBAM learning platform.

## Structure
- **[moduleId]/** - Dynamic module pages
- **[moduleId]/sessions/[sessionId]/** - Individual session pages
- **1/, 2/, 3/, 4/, 5/** - Static module overview pages
- **ARCHIVE_BACKUPS/** - Backup files for session components

## Dynamic Routing
- `/modules/[moduleId]` - Module overview page
- `/modules/[moduleId]/sessions/[sessionId]` - Individual session content

## Session Structure
Each session includes:
- Reading materials with chunked content
- Video components (Vimeo integration)
- Quiz sections with interactive elements
- Scripture references
- Action planning components
- Progress tracking

## Key Components Used
- **EnhancedReadingChunks** - Structured reading content
- **VimeoVideo** - Video playback integration
- **EnhancedQuizSection** - Interactive assessments
- **EnhancedScriptureReference** - Biblical content integration
- **ActionBuilderComponent** - Action planning tools
- **AIChatInterface** - AI coaching integration

## Session Flow
1. Looking Back - Review previous actions
2. Looking Up - Scripture and reflection
3. Content - Reading, video, and learning materials
4. Looking Forward - Action planning and next steps
5. Assessment - Knowledge checks and progress tracking

## Progress Tracking
- Session completion status
- Quiz scores and attempts
- Action item completion
- Time spent per section
- Overall module progress

## Content Management
- Structured content with metadata
- Version control for session updates
- Backup system for content changes
- Dynamic content loading based on user progress