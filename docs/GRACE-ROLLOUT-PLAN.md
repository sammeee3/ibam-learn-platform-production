# Grace Features Rollout Plan

## Phase 1: Foundation (Week 1) ✅ SAFE
**Risk Level: Minimal**
- [ ] Deploy feature flag system to production
- [ ] Add grace-features-config.ts
- [ ] Wrap existing sessions with EnhancedSessionTemplate
- [ ] Enable for test users only (you + team)
- [ ] Monitor with no visible changes to other users

## Phase 2: Soft UI Enhancements (Week 2) 🟡 LOW RISK  
**Risk Level: Low**
- [ ] Enable encouragement messages (10% of users)
- [ ] Add streak indicators (visual only, no functionality)
- [ ] Add optional Kingdom Purpose field (not required)
- [ ] Monitor engagement metrics
- [ ] Gather user feedback via in-app survey

## Phase 3: Gradual Feature Release (Weeks 3-4) 🟠 MEDIUM RISK
**Risk Level: Medium**
- [ ] Enable for 25% of users
- [ ] Add balance indicators (suggestions only)
- [ ] Implement Kingdom filter (optional checkbox)
- [ ] A/B test completion rates
- [ ] Monitor support tickets

## Phase 4: Full Features (Week 5) 🔴 HIGHER RISK
**Risk Level: Higher** 
- [ ] Enable grace release after 2 deferrals
- [ ] Implement 2x2 soft limits (warnings, not blocks)
- [ ] Add Sabbath session notifications
- [ ] 50% rollout
- [ ] Prepare rollback plan

## Phase 5: Production Release (Week 6)
- [ ] Review all metrics
- [ ] Fix any issues from beta
- [ ] 100% rollout with kill switch ready
- [ ] Documentation and training

## Monitoring & Metrics

### Key Metrics to Track:
```typescript
interface GraceMetrics {
  // Engagement
  sessionCompletionRate: number;
  actionCompletionRate: number;
  deferralsPerUser: number;
  
  // Adoption
  kingdomPurposeUsage: number; // % who fill it
  balanceAchieved: number; // % with balanced actions
  graceReleasesUsed: number;
  
  // User Satisfaction
  npsScore: number;
  supportTickets: number;
  userFeedback: string[];
}
```

### Rollback Triggers:
- Session completion drops >10%
- Support tickets increase >25%  
- Major bug discovered
- Negative user feedback >20%

## Implementation Code

### 1. Add to your session page:
```typescript
// app/modules/[moduleId]/sessions/[sessionId]/page.tsx
import EnhancedSessionTemplate from '@/components/sessions/EnhancedSessionTemplate';

export default function SessionPage({ params }) {
  const { user } = useUser();
  
  return (
    <EnhancedSessionTemplate 
      userEmail={user?.email}
      moduleId={params.moduleId}
      sessionId={params.sessionId}
    >
      {/* Your existing session content */}
      <ExistingSessionContent />
    </EnhancedSessionTemplate>
  );
}
```

### 2. Environment Variables:
```env
# .env.staging
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_GRACE_FEATURES=true
NEXT_PUBLIC_GRACE_ROLLOUT_PERCENTAGE=10

# .env.production  
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_GRACE_FEATURES=false
NEXT_PUBLIC_GRACE_ROLLOUT_PERCENTAGE=0
```

### 3. Quick Feature Toggle:
```typescript
// Emergency kill switch in Supabase
// Create table: feature_flags
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_name text UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  rollout_percentage integer DEFAULT 0,
  test_users text[],
  updated_at timestamp DEFAULT now()
);

// Insert grace features flag
INSERT INTO feature_flags (feature_name, enabled, rollout_percentage, test_users)
VALUES ('grace_features', false, 0, ARRAY['sammeee@yahoo.com']);
```

## Testing Checklist

### Before Each Phase:
- [ ] Test with test user account
- [ ] Verify existing functionality unchanged
- [ ] Check mobile responsiveness
- [ ] Test with/without features enabled
- [ ] Verify database migrations
- [ ] Review error logging

### Regression Tests:
- [ ] User can complete session without grace features
- [ ] Actions save correctly
- [ ] Progress tracking works
- [ ] Quiz scoring unaffected
- [ ] Video playback normal
- [ ] Navigation smooth

## Support & Communication

### User Communication:
1. **Soft Launch Email** (Phase 2):
   - "We're testing small improvements to make sessions more encouraging"
   - No mention of major changes

2. **Feature Announcement** (Phase 4):
   - "New: Kingdom purpose tracking and grace-based progress"
   - Tutorial video/guide

3. **Full Launch** (Phase 5):
   - Celebration email
   - Feature highlights
   - Success stories

### Support Preparation:
- FAQ document for support team
- Screenshots of new features
- Rollback procedure documented
- Quick reference guide

## Risk Mitigation

### Database Backups:
- Daily backups before rollout
- Test restore procedure
- Separate grace_features tables initially

### Code Safety:
- Feature branch: `feature/grace-system`
- Staging deployment first
- Gradual production merge
- Git tags for each phase

### User Safety:
- Opt-out mechanism available
- Data privacy maintained
- No breaking changes to API
- Backward compatibility assured

## Success Criteria

### Phase 1-2 Success:
- No increase in errors
- Test users can see features
- No performance degradation

### Phase 3-4 Success:
- Positive user feedback >70%
- Action completion rate stable or increased
- No critical bugs

### Phase 5 Success:
- Session completion +5% or stable
- User satisfaction improved
- Support tickets manageable
- Team confident in system

## Emergency Procedures

### Quick Rollback:
```bash
# 1. Disable in database
UPDATE feature_flags SET enabled = false WHERE feature_name = 'grace_features';

# 2. Or environment variable
NEXT_PUBLIC_GRACE_FEATURES=false

# 3. Or code change (fastest)
// grace-features-config.ts
export function shouldShowGraceFeatures() {
  return false; // Emergency override
}
```

### Monitoring Commands:
```sql
-- Check feature usage
SELECT COUNT(*) FROM user_action_steps 
WHERE kingdom_purpose IS NOT NULL
AND created_at > now() - interval '1 day';

-- Check deferrals
SELECT COUNT(*), deferrals 
FROM user_action_steps 
GROUP BY deferrals;

-- User feedback
SELECT * FROM session_feedback 
WHERE feedback_text LIKE '%grace%' 
OR feedback_text LIKE '%kingdom%';
```

## Timeline

**Week 1**: Setup & Testing (You only)
**Week 2**: 10% Rollout (Soft features)
**Week 3-4**: 25-50% Rollout (More features)
**Week 5**: 75% Rollout (Full features)
**Week 6**: 100% Production

This gives you 6 weeks of controlled rollout with multiple abort points and careful monitoring.