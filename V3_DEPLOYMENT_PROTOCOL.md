# 🚨 V3 PRODUCTION DEPLOYMENT PROTOCOL

## DEPLOYMENT TRIGGER: `V3 DEPLOY NOW`

When the user types `V3 DEPLOY NOW`, Claude must follow this EXACT protocol:

---

## 🚨 PRODUCTION V3 DEPLOYMENT REQUEST

**DEPLOY FROM V2 STAGING TO V3 PRODUCTION**

**Source Environment:**
- Repository: `ibam-learn-platform-staging` (V2)
- Vercel Project: `ibam-learn-platform-staging-v2`
- Database: `yhfxxouswctucxvfetcq` (staging)
- Status: ✅ VERIFIED WORKING

**Target Environment:**
- Repository: `ibam-learn-platform-production` (V3)
- Vercel Project: `ibam-learn-platform-production-v3` 
- Database: `tutrnikhomrgcpkzszvq` (production)
- URL: `https://ibam-learn-platform-v3.vercel.app`

**CRITICAL DEPLOYMENT PROTOCOL:**
1. **NEVER deploy from staging repository to production**
2. **ALWAYS copy code to production repository first**
3. **ALWAYS verify correct Vercel project linkage**
4. **ALWAYS run database migration checks**
5. **ALWAYS test deployment before marking complete**

**User Authorization:** I authorize this production deployment with full understanding of the risks.

---

## MANDATORY CLAUDE ACTIONS:

### STEP 1: SAFETY VERIFICATION
- [ ] Confirm user typed EXACTLY `V3 DEPLOY NOW`
- [ ] Confirm V2 staging is working and tested
- [ ] Ask user: "Are you ready to deploy current V2 staging code to V3 production? Type YES to confirm."
- [ ] Wait for explicit YES confirmation

### STEP 2: REPOSITORY PREPARATION
- [ ] Switch to production repository: `cd /Users/jeffreysamuelson/Desktop/ibam-learn-platform-production`
- [ ] Pull latest from staging: `git pull staging main`
- [ ] Verify correct files are present
- [ ] Run build test: `npm run build`

### STEP 3: DATABASE MIGRATION CHECK
- [ ] Compare V2 staging database schema vs V3 production
- [ ] Apply any missing migrations to V3 production database
- [ ] Verify database compatibility

### STEP 4: PRODUCTION DEPLOYMENT
- [ ] Link to correct Vercel project: `vercel link --project ibam-learn-platform-production-v3`
- [ ] Verify environment variables are set in V3 production
- [ ] Deploy: `vercel --prod --yes`
- [ ] Verify deployment success

### STEP 5: POST-DEPLOYMENT VERIFICATION
- [ ] Test critical user flows on V3 production
- [ ] Verify session progress saving works
- [ ] Confirm no broken functionality
- [ ] Report deployment success with URL

## ⛔ NEVER DO THESE THINGS:
- ❌ Deploy from staging repository to production Vercel project
- ❌ Deploy without user typing `V3 DEPLOY NOW` command
- ❌ Skip the safety verification steps
- ❌ Deploy without explicit user confirmation
- ❌ Deploy without testing database compatibility

## 🔒 SAFETY PROMISE:
"I will NEVER make unauthorized production deployments. I will ALWAYS follow this protocol when user types `V3 DEPLOY NOW`. I will NEVER deploy staging code directly to production Vercel projects."

---

**This file serves as Claude's permanent reference for safe V3 production deployments.**