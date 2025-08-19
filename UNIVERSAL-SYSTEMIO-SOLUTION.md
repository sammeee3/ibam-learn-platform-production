# Universal System.io Integration Solution

## The Problem
- System.io `[Email]` merge tags don't work in HTML buttons
- Need one solution that works for any user
- Need automatic user creation in Supabase

## The Solution
Use System.io's **conditional redirect** feature to create a universal button.

## Step 1: Deploy Updated SSO Route
The SSO route now:
✅ Creates new users automatically if they don't exist
✅ Creates complete user profiles in Supabase
✅ Works for any email address

## Step 2: Test the Updated Solution

**Test Existing User:**
```
https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=sammeee@yahoo.com&token=ibam-systeme-secret-2025&source=test
```

**Test New User Creation:**
```
https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=brandnewuser123@test.com&token=ibam-systeme-secret-2025&source=test
```

## Step 3: Universal System.io Button

**Option A: Use System.io Contact Fields**
In System.io, create a button with URL:
```
https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=[Contact Email]&token=ibam-systeme-secret-2025&source=systemio
```

**Option B: Use System.io Custom Code**
Add this JavaScript to your System.io page:
```javascript
function accessIBAM() {
    // Get current logged-in user's email from System.io
    var userEmail = getCurrentUserEmail(); // System.io function
    var url = 'https://ibam-learn-platform-v3.vercel.app/api/auth/sso?email=' + 
              encodeURIComponent(userEmail) + 
              '&token=ibam-systeme-secret-2025&source=systemio';
    window.open(url, '_blank');
}
```

**Option C: Webhook Approach (BEST)**
1. Set up System.io webhook when user accesses course
2. Webhook creates user in IBAM platform
3. Redirect to IBAM with pre-created account

## Testing Protocol

1. **Test with your email:** Does it log you in?
2. **Test with new email:** Does it create a new user?
3. **Check database:** Is the new user created in `user_profiles`?
4. **Test dashboard access:** Can new user access modules?

## Expected Results
- ✅ Existing users: Instant login
- ✅ New users: Account created + instant login  
- ✅ Universal: Works for any System.io user
- ✅ Scalable: No need for individual buttons