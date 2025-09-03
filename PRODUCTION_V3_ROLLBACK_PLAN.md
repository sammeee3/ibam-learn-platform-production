# 🚨 PRODUCTION V3 ROLLBACK PLAN

**Date:** 2025-09-03  
**Environment:** Production V3 (tutrnikhomrgcpkzszvq)  
**Purpose:** Emergency recovery procedures for failed deployment

## ⚡ QUICK ROLLBACK COMMANDS

### Immediate Vercel Rollback
```bash
# Roll back to previous deployment
vercel rollback https://ibam-learn-platform-v3.vercel.app --yes

# Or roll back to specific deployment
vercel rollback [PREVIOUS_DEPLOYMENT_URL] --yes
```

### Emergency Database Restoration
```sql
-- Restore user_profiles from backup
DROP TABLE user_profiles;
ALTER TABLE user_profiles_backup_20250903 RENAME TO user_profiles;

-- Restore user_progress if needed
DROP TABLE user_progress;
ALTER TABLE user_progress_backup_20250903 RENAME TO user_progress;

-- Restore sessions if needed  
DROP TABLE sessions;
ALTER TABLE sessions_backup_20250903 RENAME TO sessions;

-- Restore magic_tokens if needed
DROP TABLE magic_tokens;
ALTER TABLE magic_tokens_backup_20250903 RENAME TO magic_tokens;
```

## 📋 ROLLBACK SCENARIOS

### Scenario 1: Deployment Build Failure
**Symptoms:** 
- Build fails during Vercel deployment
- Error messages in deployment logs
- Site becomes inaccessible

**Actions:**
1. ✅ **No database changes made** - users still have access to old version
2. Check Vercel deployment logs for specific error
3. Fix build issues in staging first
4. Retry deployment when fixed

**Risk Level:** 🟢 LOW - No user impact

---

### Scenario 2: Database Schema Issues
**Symptoms:**
- Users can't log in
- Admin dashboard shows database errors
- API endpoints return 500 errors

**Actions:**
1. 🔴 **IMMEDIATE:** Rollback Vercel deployment
   ```bash
   vercel rollback https://ibam-learn-platform-v3.vercel.app --yes
   ```

2. 🔴 **Database Recovery** (if schema migration was applied):
   ```sql
   -- Remove added columns if they cause issues
   ALTER TABLE user_profiles DROP COLUMN IF EXISTS pre_assessment_completed;
   ALTER TABLE user_profiles DROP COLUMN IF EXISTS subscription_tier;
   ALTER TABLE user_profiles DROP COLUMN IF EXISTS member_type;
   
   -- Or full table restoration
   DROP TABLE user_profiles;
   ALTER TABLE user_profiles_backup_20250903 RENAME TO user_profiles;
   ```

3. ✅ **Verify user access restored**

**Risk Level:** 🔴 HIGH - User access interrupted

---

### Scenario 3: Data Corruption/Loss
**Symptoms:**
- Users report missing data
- Progress lost
- Profile information incorrect

**Actions:**
1. 🔴 **STOP ALL OPERATIONS** immediately
2. 🔴 **Full database restoration:**
   ```sql
   -- Restore all backed up tables
   DROP TABLE user_profiles;
   DROP TABLE user_progress;
   DROP TABLE sessions;
   DROP TABLE magic_tokens;
   
   ALTER TABLE user_profiles_backup_20250903 RENAME TO user_profiles;
   ALTER TABLE user_progress_backup_20250903 RENAME TO user_progress;
   ALTER TABLE sessions_backup_20250903 RENAME TO sessions;
   ALTER TABLE magic_tokens_backup_20250903 RENAME TO magic_tokens;
   ```

3. 🔴 **Rollback Vercel deployment**
4. 🔴 **Notify users of temporary service interruption**

**Risk Level:** 🔴 CRITICAL - Data loss

---

### Scenario 4: Performance Issues
**Symptoms:**
- Site loads slowly
- Database queries timeout
- Users report sluggish performance

**Actions:**
1. 🟡 **Monitor for 15 minutes** - may be temporary
2. 🟡 **Check database performance:**
   ```sql
   -- Check for missing indexes
   SELECT schemaname, tablename, indexname 
   FROM pg_indexes 
   WHERE tablename IN ('user_profiles', 'user_progress', 'sessions');
   
   -- Check query performance
   SELECT query, mean_exec_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC LIMIT 10;
   ```

3. 🟡 **If performance doesn't improve:** Rollback deployment

**Risk Level:** 🟡 MEDIUM - Service degradation

## 🛠️ ROLLBACK PROCEDURES

### A. Pre-Rollback Checklist
- [ ] Identify specific failure symptoms
- [ ] Document current error messages
- [ ] Verify backup files exist and are accessible
- [ ] Notify key stakeholders of rollback decision
- [ ] Prepare user communication if needed

### B. Vercel Rollback Steps
```bash
# 1. List recent deployments
vercel ls --team ibam-projects

# 2. Identify last working deployment
vercel inspect [DEPLOYMENT_URL]

# 3. Rollback to last working version
vercel rollback [WORKING_DEPLOYMENT_URL] --yes

# 4. Verify rollback success
curl -I https://ibam-learn-platform-v3.vercel.app
```

### C. Database Rollback Steps
```sql
-- 1. Connect to production database
-- Use Supabase dashboard or CLI

-- 2. Verify backup tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%backup_20250903';

-- 3. Restore specific table (example)
BEGIN;
DROP TABLE user_profiles;
ALTER TABLE user_profiles_backup_20250903 RENAME TO user_profiles;
-- Test queries here
COMMIT; -- or ROLLBACK; if issues

-- 4. Verify data integrity
SELECT COUNT(*) FROM user_profiles;
SELECT * FROM user_profiles LIMIT 5;
```

## 📞 EMERGENCY CONTACTS

### Technical Escalation
- **Primary:** Jeff Samuelson (System Owner)
- **Database:** Supabase Support (if needed)
- **Hosting:** Vercel Support (if needed)

### Communication Plan
1. **Internal:** Notify team immediately
2. **Users:** Status page update if downtime > 15 minutes
3. **Stakeholders:** Email update within 1 hour

## ⚠️ POST-ROLLBACK ACTIONS

### Immediate (0-1 hour)
- [ ] Verify all systems operational
- [ ] Test user login functionality  
- [ ] Check admin dashboard access
- [ ] Monitor error logs for issues

### Short-term (1-24 hours)
- [ ] Analyze root cause of failure
- [ ] Update rollback procedures based on lessons learned
- [ ] Prepare improved deployment plan
- [ ] Schedule post-mortem meeting

### Long-term (1-7 days)
- [ ] Implement fixes in staging environment
- [ ] Conduct thorough testing of fixes
- [ ] Update monitoring and alerts
- [ ] Document improvements for future deployments

## 🔍 VERIFICATION COMMANDS

### Test User Access
```bash
# Check site accessibility
curl -I https://ibam-learn-platform-v3.vercel.app

# Check admin dashboard  
curl -I https://ibam-learn-platform-v3.vercel.app/admin

# Test API endpoint
curl https://ibam-learn-platform-v3.vercel.app/api/admin/stats
```

### Database Health Check
```sql
-- Check table counts
SELECT 
  'user_profiles' as table_name, COUNT(*) as count 
FROM user_profiles
UNION ALL
SELECT 
  'user_progress' as table_name, COUNT(*) as count 
FROM user_progress;

-- Check recent activity
SELECT COUNT(*) 
FROM user_profiles 
WHERE updated_at > NOW() - INTERVAL '1 hour';
```

## 📊 SUCCESS METRICS

**Rollback is successful when:**
- ✅ Site loads normally (< 3 second response time)
- ✅ Users can log in successfully
- ✅ Admin dashboard accessible
- ✅ Database queries complete without errors
- ✅ No increase in error rates
- ✅ User data intact and accessible

## 🚀 RECOVERY TIMELINE

| Time | Action | Responsible |
|------|--------|-------------|
| 0-5 min | Identify issue, make rollback decision | Tech Team |
| 5-15 min | Execute Vercel rollback | Tech Team |
| 15-30 min | Execute database rollback (if needed) | Database Admin |
| 30-60 min | Verify systems operational | Tech Team |
| 1-2 hours | User communication, root cause analysis | Management |

---

## ⚡ EMERGENCY HOTLINE

**If all else fails:**
1. 🔴 **Contact Vercel Support:** Emergency escalation
2. 🔴 **Contact Supabase Support:** Database recovery assistance  
3. 🔴 **Manual DNS redirect:** Point to static maintenance page

**Remember:** User data safety is the top priority. When in doubt, rollback first, investigate later.

---

*This rollback plan is designed to minimize user impact and ensure rapid recovery from deployment failures. Keep this document accessible during deployment activities.*