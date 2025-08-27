# 📧 Resend Email Setup for IBAM.org

## Quick Setup (5 minutes)

### Step 1: Add Domain to Resend
1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `ibam.org`
4. Click "Add"

### Step 2: Copy DNS Records
Resend will show 3 records:
- 1 MX record (for bounce handling)
- 2 CNAME records (for DKIM signing)

### Step 3: Add to Google Workspace DNS
1. Go to: https://domains.google.com
2. Select `ibam.org`
3. Go to DNS → Manage Custom Records
4. Add each record from Resend

### Step 4: Verify in Resend
1. Back in Resend, click "Verify DNS Records"
2. Wait 2-5 minutes for DNS propagation
3. Status will change to "Verified" ✅

### Step 5: Test
Run this command:
```bash
./test-production-email.sh
```

## Environment Variables (Already Set)
```bash
EMAIL_FROM="IBAM Training <training@ibam.org>"
EMAIL_REPLY_TO="training@ibam.org"
```

## Why This Prevents Spam
✅ Sends from YOUR domain (not resend.dev)
✅ Proper SPF/DKIM authentication
✅ Professional appearance
✅ Better deliverability

## Free Tier Limits
- 100 emails/day
- 3,000 emails/month
- Perfect for your current usage

Need help? The DNS changes take effect in 5-10 minutes.