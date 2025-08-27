# 🔧 DNS Setup Instructions for IBAM.org

## Your DNS Provider: Namecheap

### Step 1: Login to Namecheap
1. Go to: https://www.namecheap.com
2. Sign in with your account
3. Go to "Domain List"
4. Find `ibam.org`
5. Click "Manage"

### Step 2: Go to Advanced DNS
1. Click "Advanced DNS" tab
2. You'll see your existing records (Google Workspace MX records are already there ✅)

### Step 3: Add Resend Records
You need to add 3 new records. Click "+ ADD NEW RECORD" for each:

**Example records (Resend will give you the actual values):**

#### Record 1 - MX Record (for bounce handling)
- Type: `MX`
- Host: `send` (or what Resend specifies)
- Value: `feedback-smtp.us-east-1.amazonses.com` (Resend will provide)
- Priority: `10`
- TTL: `Automatic`

#### Record 2 - CNAME (for DKIM)
- Type: `CNAME`
- Host: `resend._domainkey` (Resend will provide exact subdomain)
- Value: `resend._domainkey.resend.dev` (Resend will provide)
- TTL: `Automatic`

#### Record 3 - CNAME (for tracking)
- Type: `CNAME`  
- Host: `email` (or what Resend specifies)
- Value: `email.resend.dev` (Resend will provide)
- TTL: `Automatic`

### Step 4: Save Changes
1. Click "Save All Changes" (green checkmark)
2. Changes take 5-30 minutes to propagate

### Step 5: Verify in Resend
1. Go back to Resend dashboard
2. Click "Verify DNS Records"
3. Should show "Verified" ✅

## 🎯 Quick Access Links
- Namecheap DNS: https://ap.www.namecheap.com/domains/domaincontrolpanel/ibam.org/advancedns
- Resend Domains: https://resend.com/domains

## ⚠️ Important Notes
- Don't remove existing MX records (they're for Google Workspace)
- Resend records won't interfere with your existing email
- If you can't find Namecheap login, check:
  - Your email for Namecheap account info
  - Or contact whoever registered the domain

## Need Help?
If you get stuck, share a screenshot of:
1. The Resend "Add Domain" page showing the records
2. Your Namecheap Advanced DNS page

I can then give you exact instructions!