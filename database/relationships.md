# Database Relationships

## Inferred Relationships

### user_profiles ← user_progress
- `user_progress.user_id` references `user_profiles.user_id`
- One user can have many progress records

### sessions ← user_progress  
- `user_progress.session_id` references `sessions.id`
- One session can have many user progress records

### modules ← sessions
- `sessions.module_id` references `modules.id`
- One module contains many sessions

### member_types ← user_profiles
- `user_profiles.subscription_tier` references `member_types.tier_key`
- One tier can have many users

## Data Flow
1. User authenticates → user_profiles lookup
2. User accesses course → sessions query
3. User progresses → user_progress insert/update
4. Dashboard loads → aggregate progress by user_id

## Critical Dependencies
- All user data depends on proper user_id isolation
- Session progression depends on module ordering
- Subscription features depend on tier validation
