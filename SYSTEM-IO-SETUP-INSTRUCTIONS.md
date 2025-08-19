# System.io Seamless Integration Setup

## The Solution: URL Parameter Method

Instead of trying to detect user email with JavaScript (which System.io blocks for security), we use URL parameters to pass the email automatically.

## Step 1: Create Button Link in System.io

In your System.io course or member area, create a button/link with this URL structure:

```
https://yourdomain.com/course-access?email=[Email]
```

Where:
- `yourdomain.com/course-access` = The page where you embed the button HTML
- `[Email]` = System.io's merge tag that gets replaced with the user's actual email

## Step 2: System.io Button Setup

1. In System.io, go to your course or member area page
2. Add a Button or Link element  
3. Set the button URL to: `https://ibam.org/course-access?email=[Email]`
4. System.io will automatically replace `[Email]` with the logged-in user's email

## Step 3: Embed Button HTML

On the `https://ibam.org/course-access` page, embed the `BUTTON-SEAMLESS-URL-PARAM.html` code.

## How It Works

1. **User clicks button in System.io** → System.io replaces `[Email]` with actual email
2. **User lands on your page** → URL contains `?email=user@example.com`
3. **Button detects email** → Automatically extracted from URL parameter
4. **Seamless login** → No prompts, direct access to IBAM platform

## Example Flow

1. User logged into System.io as `jkramer2194@gmail.com`
2. Clicks button → Redirected to `https://ibam.org/course-access?email=jkramer2194@gmail.com`
3. JavaScript reads URL parameter → Gets `jkramer2194@gmail.com`
4. Automatic login → Opens IBAM platform with correct email

## Benefits

✅ **Zero prompts** - No email input required  
✅ **Works for any user** - Dynamic email detection  
✅ **Secure** - Uses System.io's built-in merge tags  
✅ **Reliable** - No JavaScript detection issues  
✅ **Universal** - Works on mobile and desktop  

## Testing

To test, visit: `https://ibam.org/course-access?email=sammeee@yahoo.com`

The button should automatically detect and use the email parameter.