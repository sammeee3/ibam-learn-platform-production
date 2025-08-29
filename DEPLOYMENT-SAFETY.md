# 🚨 DEPLOYMENT SAFETY RULES - CRITICAL

## ⛔ PRODUCTION DEPLOYMENT PROHIBITION

**NEVER DEPLOY EXPERIMENTAL CODE TO PRODUCTION**

### 🔴 BANNED COMMANDS:
```bash
vercel --prod
vercel --prod --yes
npm run deploy:prod
```

### ✅ ALLOWED STAGING COMMANDS ONLY:
```bash
vercel
vercel --yes
npm run deploy:staging
```

## 📋 PRE-DEPLOYMENT CHECKLIST

Before ANY deployment, Claude must:

1. ✅ **Confirm Staging Only**: Ask user "Deploy to STAGING only?" 
2. ✅ **Build Check**: Run `npm run build` first
3. ✅ **TypeScript Check**: Verify no blocking errors
4. ✅ **Database Safety**: Confirm no schema changes
5. ✅ **User Approval**: Get explicit "yes" for staging deploy

## 🛡️ SAFETY MECHANISMS

### Deployment Script (staging-only):
```bash
#!/bin/bash
echo "🚨 STAGING DEPLOYMENT ONLY - NO PRODUCTION!"
echo "Deploying to staging environment..."
vercel --yes
echo "✅ Staging deployment complete"
echo "❌ Production deployment BLOCKED"
```

## 📞 EMERGENCY PROTOCOL

If production was accidentally deployed:
1. Immediately inform user
2. Check production status
3. Offer to rollback if needed
4. Document incident

## 🎯 CLAUDE BEHAVIOR RULES

- **ALWAYS** ask before deploying
- **NEVER** use `--prod` flag
- **ALWAYS** confirm staging destination
- **NEVER** assume deployment approval
- **ALWAYS** run safety checks first

This file serves as a permanent reminder and safety protocol.