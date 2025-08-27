# 🧪 Super Admin Testing Dashboard Instructions

## Access URL
**Staging URL**: https://ibam-learn-platform-staging-v2-om0npwraj-ibam-projects.vercel.app/admin/testing

## Login Requirements
- **Email**: sammeee3@gmail.com (Super Admin only)
- Must be logged in as Super Admin to access

## Features

### 1. Quick Testing Scenarios
The dashboard provides instant one-click buttons to set any user to specific progress levels:

- **0% - Fresh Start**: Resets user completely
- **25% - Early Progress**: Completes introduction sections  
- **50% - Halfway**: Completes half of the session
- **75% - Almost Done**: Only quiz remaining
- **99% - Trigger Modal**: Sets up for feedback modal testing (complete Looking Forward to trigger)
- **100% - Complete**: Marks session as fully complete

### 2. User Management
- **Select Test User**: Choose any user from dropdown
- **Clear All Progress**: Reset user's entire progress history
- **View as User**: Open session page as selected user

### 3. Module & Session Selection
- Choose specific module (1-4)
- Choose specific session (1-4)
- Test any combination instantly

### 4. Special Testing Actions
- **Test Feedback Modal**: Sets user to 99% (complete Looking Forward section to trigger modal)
- **Skip Pre-Assessment**: Bypass assessment requirement instantly
- **Open Session Page**: Direct link to selected module/session

## Testing Workflow

### To Test Session Feedback Modal:
1. Login as Super Admin (sammeee3@gmail.com)
2. Go to Testing Dashboard
3. Select user: sammeee@yahoo.com (or any test user)
4. Select Module 1, Session 1
5. Click "99% - Trigger Modal" button
6. Click "View as User" to open session
7. Complete the Looking Forward section
8. Feedback modal will appear at 100% completion!

### To Test Different Progress States:
1. Select any user
2. Choose module and session
3. Click any percentage button
4. User is instantly set to that progress level
5. View as user to see the results

## Benefits
- ✅ No more manual SQL queries
- ✅ Test any scenario in seconds
- ✅ Visual progress indicators
- ✅ Clear, user-friendly interface
- ✅ Secure admin-only access
- ✅ Real-time database updates
- ✅ Instant feedback on actions

## Notes
- Changes are immediate and affect real database
- Use test accounts for safety (like sammeee@yahoo.com)
- Modal shows once per session per user
- Clear progress to reset and test again