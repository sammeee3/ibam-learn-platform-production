# 🚀 ACTION PLAN: Complete Staging Database Sync

## Current Status
- ✅ **Code**: Staging and production code are in sync (same repo)
- ❌ **Database**: Staging has wrong schema (14 columns vs 35 in production)
- ❌ **Service Key**: Staging service role key is invalid/expired

## Step-by-Step Instructions

### 📌 STEP 1: Get Staging Service Role Key
1. Go to: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq
2. Navigate to: **Settings → API**
3. Find the **service_role** key (NOT the anon key!)
4. Copy the entire key (starts with `eyJ...`)

### 📌 STEP 2: Update the Key in .env.local
1. Open `/Users/jeffreysamuelson/Desktop/ibam-learn-platform-staging/.env.local`
2. Replace line 4: `SUPABASE_SERVICE_ROLE_KEY="[paste your new key here]"`
3. Save the file

### 📌 STEP 3: Reset Staging Database Schema
1. Go to: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql/new
2. Copy ALL the SQL from: `COMPLETE-STAGING-RESET.sql`
3. Paste and run it
4. You should see:
   - "Backed up X sessions" 
   - "✅ Schema reset complete!"

### 📌 STEP 4: Import Production Data
1. In terminal, run:
```bash
cd /Users/jeffreysamuelson/Desktop/ibam-learn-platform-staging
node AUTOMATED-STAGING-SYNC.js
```
2. You should see:
   - "✅ Successfully imported 22 sessions!"
   - "🎉 SUCCESS! Staging now matches production exactly!"

### 📌 STEP 5: Verify Everything Works
1. Test staging site: https://ibam-learn-platform-staging-v2-om0npwraj-ibam-projects.vercel.app
2. Check:
   - Module 1 Session 4 loads (was missing before)
   - Module 5 has all 5 sessions
   - Module 3 → Module 4 transition works

## What This Achieves
- ✅ Staging database will have EXACT same structure as production
- ✅ All 22 sessions from production copied to staging
- ✅ Complete data isolation (staging ↔ production)
- ✅ Safe testing environment that mirrors production

## Files Created for This Process
1. `COMPLETE-STAGING-RESET.sql` - SQL to reset schema
2. `AUTOMATED-STAGING-SYNC.js` - Script to copy data
3. `ACTION-PLAN-STAGING-SYNC.md` - This guide

## If Something Goes Wrong
- Your old data is backed up in `sessions_old_backup_aug24_2025` table
- To restore: `ALTER TABLE sessions_old_backup_aug24_2025 RENAME TO sessions;`