# IBAM Learning Platform: System Architecture & Requirements Specification

**Document Version:** 1.1  
**Created:** August 22, 2025  
**Last Updated:** August 22, 2025  
**Status:** Work in Progress - Growth-Ready Foundation

---

## Executive Summary

The IBAM Learning Platform v2 is evolving into a sophisticated multi-tenant SaaS platform that serves multiple user types through a dual membership and management role system. The platform integrates with System.io for membership management and financial transactions while providing flexible access control for various organizational structures.

### Key Objectives:
- **Multi-Tenant Architecture**: Support individual members and church organizations
- **White-Label Capabilities**: Enable church partners to brand their platforms
- **Flexible Role System**: Accommodate both paid memberships and management roles
- **Scalable Integration**: Seamless System.io webhook integration for automated user provisioning
- **Security-First Design**: Enterprise-grade security with comprehensive monitoring

---

## Current System Overview

### Technology Stack
- **Framework**: Next.js 14 with TypeScript (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSO support
- **Styling**: Tailwind CSS
- **Payment Integration**: System.io webhooks
- **Security**: Automated monitoring with visual dashboard

### Existing Features
- Module-based learning system
- AI coaching integration
- Business planner tool
- Progress tracking
- Assessment system
- Donation capabilities
- Security monitoring dashboard
- Magic token authentication for seamless SSO

### Current Architecture Status
✅ **OPERATIONAL & SECURE** - A-Grade Security Rating  
✅ **Dual Repository Deployment** - Staging/Production isolation  
✅ **System.io Integration** - Automated user provisioning  
✅ **Enterprise Security** - Comprehensive threat monitoring

---

## Business Requirements

### Vision Statement
Create a flexible learning platform that serves individual entrepreneurs and church organizations through tiered membership levels while providing comprehensive management tools for platform administrators and church leaders.

### Core Business Objectives
1. **Revenue Growth**: Multiple membership tiers with recurring System.io integration
2. **Church Partnerships**: White-labeled platforms for church business ministry programs
3. **Scalability**: Support growth from individual users to large church networks
4. **User Experience**: Seamless access across different user types and organizations
5. **Management Efficiency**: Streamlined administration for all stakeholder types

---

## User Role Architecture

### Dual Role System Design

The platform operates on **two independent but connected role systems**:

#### 1. Membership Levels (System.io Driven)
**Purpose**: Determines platform access based on payment/subscription
**Management**: Automated via System.io webhooks

| Membership Level | System.io Product | Platform Access | Launch Phase |
|------------------|-------------------|-----------------|--------------|
| Basic Member | Basic Subscription | Core courses, basic tools | Phase 1 ✅ |
| Entrepreneur Member | Entrepreneur Package | Advanced courses, business planner | Phase 1 ✅ |
| Advanced Business Member | Premium Package | All content, AI coaching | Phase 1 ✅ |
| Small Church Partner | Church Tier 1 | Branded platform, 50 users | Phase 1 ✅ |
| Medium Church Partner | Church Tier 2 | Branded platform, 150 users | Phase 1 ✅ |
| Large Church Partner | Church Tier 3 | Branded platform, 500+ users | Phase 1 ✅ |

**Future Growth Options (Built-in but Not Initially Active):**
| Membership Level | System.io Product | Platform Access | Launch Phase |
|------------------|-------------------|-----------------|--------------|
| Small Church Premium | Church Tier 1 White | White-label platform, 50 users | Phase 2 🔮 |
| Medium Church Premium | Church Tier 2 White | White-label platform, 150 users | Phase 2 🔮 |
| Large Church Premium | Church Tier 3 White | White-label platform, 500+ users | Phase 2 🔮 |

#### 2. Platform Roles (Internal Management)
**Purpose**: Defines what users can DO within the platform
**Management**: Manual assignment by administrators

| Platform Role | Capabilities | Membership Independence |
|---------------|--------------|------------------------|
| Super Admin | Full system access, security dashboard | Yes |
| Platform Admin | User management, content management | Yes |
| Content Creator | Course creation, material updates | Yes |
| Support Specialist | User assistance, basic analytics | Yes |
| Church Leader | Church platform management | Requires Church Partner membership |
| Business Ambassador | Group management, student tracking | Appointed by Church Leader |
| Student/Learner | Course access, progress tracking | Based on membership level |

### Church Partner Ecosystem

#### Church Leader Workflow (Phase 1 - Branded Platform):
1. **Purchase** Church Partner membership via System.io
2. **Receive** automated access to branded church platform at `ibam.com/churches/[church-name]`
3. **Configure** church branding (logo, colors, welcome message)
4. **Appoint** Business Ambassadors within their organization
5. **Create** groups and manage student enrollments
6. **Track** progress across all church groups

#### Future Enhanced Workflow (Phase 2 - White-Label Option):
1. **Purchase** Church Premium membership via System.io
2. **Receive** white-label platform setup instructions
3. **Configure** custom domain (e.g., `business.firstbaptist.com`)
4. **Complete self-service branding setup** with AI guidance
5. **Manage** fully independent platform experience

#### Business Ambassador Capabilities:
- Create and manage small groups
- Add/remove students from their groups
- Access course materials and business planner
- Conduct training sessions (in-person, online, individual)
- Track group progress and completion
- Generate reports for Church Leader

---

## Technical Architecture

### Growth-Ready Foundation Design

**Core Principle**: Build architecture that supports **configuration-driven growth** rather than code rewrites.

### Database Schema (Future-Proof Design)

#### Current Tables (Existing):
- `user_profiles` - Basic user information
- `user_progress` - Learning progress tracking
- `sessions` - Course session data
- `magic_tokens` - Secure authentication tokens

#### New Tables (Growth-Ready):

```sql
-- 🚀 GROWTH-READY: Membership Management
membership_levels (
  id, 
  name,                      -- 'Small Church Partner'
  system_io_product_id,      -- Maps to System.io products
  tier_size,                 -- 'small', 'medium', 'large'
  branding_level,            -- 'ibam_partnership', 'white_label'
  max_users, 
  features_enabled_json,     -- Flexible feature toggles
  pricing_tier,
  is_active,                 -- Easy enable/disable new tiers
  launch_phase               -- 'phase_1', 'phase_2', 'future'
)

-- 🚀 GROWTH-READY: Role-Based Access Control
platform_roles (
  id, name, description, 
  permissions_json,          -- Flexible permission sets
  hierarchy_level, 
  is_system_role,
  applies_to_context         -- 'global', 'church', 'group'
)

user_memberships (
  user_id, membership_level_id, 
  system_io_transaction_id, 
  status,                    -- 'active', 'cancelled', 'upgraded'
  valid_from, valid_until, 
  auto_renew,
  upgrade_eligible_date      -- When they can upgrade tiers
)

user_platform_roles (
  user_id, platform_role_id, 
  assigned_by, assigned_at, 
  context_id, context_type,  -- Supports church/group specific roles
  role_metadata_json         -- Flexible role-specific data
)

-- 🚀 GROWTH-READY: Church Multi-Tenancy
church_organizations (
  id, name, 
  url_slug,                  -- 'first-baptist' for ibam.com/churches/first-baptist
  custom_domain,             -- NULL for Phase 1, domain for Phase 2
  ssl_enabled,               -- Future white-label support
  branding_level,            -- 'ibam_partnership' or 'white_label'
  branding_config_json,      -- Flexible branding options
  owner_user_id,
  membership_level_id,
  max_students,
  features_enabled_json,     -- Church-specific feature flags
  setup_completed,           -- Onboarding progress
  created_at, is_active
)

church_groups (
  id, church_id, name, 
  ambassador_user_id,
  group_type,                -- 'small_group', 'individual', 'online'
  max_students,
  meeting_schedule_json,     -- Flexible meeting data
  created_at, is_active
)

church_students (
  id, church_id, group_id, user_id,
  enrolled_by, enrolled_at, 
  status,                    -- 'active', 'completed', 'paused'
  progress_data_json         -- Flexible progress tracking
)

-- 🚀 GROWTH-READY: Feature Management
feature_flags (
  id, name, description,
  is_enabled,                -- Global feature toggle
  target_membership_levels,  -- JSON array of applicable tiers
  target_branding_levels,    -- JSON array of applicable branding
  rollout_percentage,        -- A/B testing support
  created_at, updated_at
)
```

### Growth-Ready Architecture Patterns

#### 1. Configuration-Driven Pricing
```typescript
// Easy to add new tiers without code changes
interface MembershipConfig {
  tierSize: 'small' | 'medium' | 'large'
  brandingLevel: 'ibam_partnership' | 'white_label'
  maxUsers: number
  featuresEnabled: string[]
  pricingTier: number
  launchPhase: 'phase_1' | 'phase_2' | 'future'
}

// Example configurations:
const membershipConfigs = {
  small_ibam: {
    tierSize: 'small',
    brandingLevel: 'ibam_partnership',
    maxUsers: 50,
    featuresEnabled: ['basic_branding', 'group_management'],
    launchPhase: 'phase_1'
  },
  small_white: {  // Ready but inactive
    tierSize: 'small', 
    brandingLevel: 'white_label',
    maxUsers: 50,
    featuresEnabled: ['custom_domain', 'white_label', 'group_management'],
    launchPhase: 'phase_2'
  }
}
```

#### 2. Feature Flag System
```typescript
// Easy to enable new features per tier
class FeatureManager {
  async isFeatureEnabled(
    featureName: string, 
    membershipLevel: string,
    brandingLevel: string
  ): Promise<boolean>
  
  async enableFeatureForTier(
    featureName: string,
    targetTiers: string[]
  ): Promise<void>
}

// Usage examples:
await features.isFeatureEnabled('custom_domain', 'small', 'white_label')
await features.isFeatureEnabled('advanced_analytics', 'large', 'ibam_partnership')
```

#### 3. Scalable Church Configuration
```typescript
interface ChurchConfig {
  brandingLevel: 'ibam_partnership' | 'white_label'
  customDomain?: string           // NULL for Phase 1
  urlSlug: string                // first-baptist
  brandingOptions: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    welcomeMessage: string
    showIbamBranding: boolean    // false for white-label
  }
  featuresEnabled: string[]
  maxStudents: number
}
```

### Permission System Design

#### Permission Categories:
- **SYSTEM**: Platform administration
- **CONTENT**: Course and material management  
- **CHURCH**: Church platform management
- **GROUP**: Group and student management
- **ANALYTICS**: Reporting and progress viewing
- **SECURITY**: Security dashboard and monitoring

#### Sample Permissions:
```json
{
  "SYSTEM_ADMIN": ["*"],
  "CHURCH_LEADER": [
    "CHURCH_MANAGE_SETTINGS",
    "CHURCH_APPOINT_AMBASSADORS", 
    "CHURCH_VIEW_ALL_GROUPS",
    "ANALYTICS_CHURCH_REPORTS"
  ],
  "BUSINESS_AMBASSADOR": [
    "GROUP_CREATE",
    "GROUP_MANAGE_STUDENTS",
    "CONTENT_ACCESS_MATERIALS",
    "ANALYTICS_GROUP_REPORTS"
  ]
}
```

---

## System.io Integration Requirements

### Webhook Data Flow

#### Membership Purchase Event:
```json
{
  "event": "purchase_completed",
  "customer": {
    "email": "leader@church.com",
    "first_name": "John",
    "last_name": "Smith"
  },
  "product": {
    "id": "church_tier_2",
    "name": "Medium Church Partner"
  },
  "transaction": {
    "id": "txn_12345",
    "amount": 299.00
  }
}
```

#### Automated Processing:
1. **Validate** webhook signature (HMAC-SHA256)
2. **Create** user account if not exists
3. **Assign** membership level based on product ID
4. **Provision** church organization (for church tiers)
5. **Generate** magic token for seamless login
6. **Send** welcome email with platform access

### Required System.io Product Mapping:
| System.io Product ID | Internal Membership | User Limit | Features |
|---------------------|---------------------|------------|----------|
| `basic_member` | Basic Member | 1 | Core courses |
| `entrepreneur_member` | Entrepreneur Member | 1 | + Business planner |
| `advanced_member` | Advanced Business Member | 1 | + AI coaching |
| `church_tier_1` | Small Church Partner | 50 | + IBAM-branded platform |
| `church_tier_2` | Medium Church Partner | 150 | + Advanced analytics |
| `church_tier_3` | Large Church Partner | 500+ | + Priority support |

### Multi-Role Architecture for Cross-Organization Users

#### The Challenge:
**One email address needs multiple roles across different contexts**
- User could be a "Church Leader" at First Baptist
- Same user could be a "Business Ambassador" at Second Presbyterian  
- Same user could be an "Individual Entrepreneur Member"
- Super Admin needs ability to assign/remove any role to any user

#### Solution: Context-Aware Role System
```typescript
interface UserRole {
  userId: string
  roleId: string
  context: {
    type: 'global' | 'church' | 'group' | 'individual'
    contextId?: string  // church_id or group_id
    contextName?: string // 'First Baptist Church'
  }
  assignedBy: string
  assignedAt: Date
  isActive: boolean
}

// Example: One user with multiple roles
const exampleUser = "john@email.com"
const johnRoles = [
  {
    userId: "john@email.com",
    roleId: "church_leader", 
    context: { type: 'church', contextId: 'church_123', contextName: 'First Baptist' }
  },
  {
    userId: "john@email.com", 
    roleId: "business_ambassador",
    context: { type: 'church', contextId: 'church_456', contextName: 'Second Presbyterian' }
  },
  {
    userId: "john@email.com",
    roleId: "entrepreneur_member",
    context: { type: 'individual' }
  }
]
```

---

## Security & Access Control

### Current Security Status: A-Grade ✅
- HMAC webhook validation
- Automated security monitoring
- Session management with httpOnly cookies
- Rate limiting on authentication endpoints
- Security dashboard with real-time alerts

### Role-Based Security Implementation:
- **Permission-based access control** (not role name checking)
- **Audit trails** for all role assignments and changes
- **Context-aware permissions** (church-specific, group-specific)
- **Escalation protection** (prevent accidental privilege elevation)

### Church Multi-Tenancy Security:
- **Data isolation** between church organizations
- **Student privacy** protection within groups
- **Ambassador boundaries** (can't access other ambassadors' groups)
- **Church leader oversight** of all church activities

---

## Scalability Considerations

### Technical Scalability:
- **Database partitioning** by church organization
- **Caching strategies** for role permissions
- **CDN integration** for white-labeled assets
- **Background job processing** for large operations

### Business Scalability:
- **Flexible membership pricing** via System.io
- **Automated church provisioning** without manual intervention
- **Self-service church management** reducing support overhead
- **Modular feature enabling** based on membership tier

---

## Implementation Roadmap

### Phase 1: Foundation & Core Church Features (Weeks 1-4)
**Goal**: Launch with size-based church tiers and IBAM branding

#### Week 1-2: Growth-Ready Foundation
- [ ] **Database schema migration** with future-proof design
- [ ] **Feature flag system** implementation
- [ ] **Permission system** with growth capabilities
- [ ] **System.io webhook enhancements** for church tiers

#### Week 3-4: Church Platform Core
- [ ] **Church organization management** (IBAM-branded)
- [ ] **Church leader dashboard** with basic branding options
- [ ] **Business ambassador tools** and group management
- [ ] **Student enrollment and progress tracking**

**Launch Result**: Churches can purchase Small/Medium/Large tiers, get branded platforms at `ibam.com/churches/[name]`

### Phase 2: Growth Options (When Market Demands - Months Later)
**Goal**: Add white-label options without disrupting existing churches

#### Easy Additions (Configuration Changes):
- [ ] **New pricing tiers** via admin interface
- [ ] **Enhanced feature toggles** for different membership levels
- [ ] **Upgraded analytics** for premium tiers
- [ ] **Priority support routing** for premium customers

#### Moderate Complexity (Weeks 1-2):
- [ ] **Custom domain setup** workflow with AI guidance
- [ ] **White-label theme system** with church-specific CSS
- [ ] **Advanced branding options** (custom headers, footers)
- [ ] **Premium dashboard components**

#### Future Advanced Features (Months):
- [ ] **Full SSL automation** for custom domains
- [ ] **Advanced integrations** per church
- [ ] **Custom curriculum upload** capabilities
- [ ] **Enterprise analytics suite**

### Phase 3: Scale & Optimization (Ongoing)
- [ ] **Performance monitoring** and optimization
- [ ] **A/B testing framework** for pricing and features
- [ ] **Advanced security monitoring** for multi-tenant data
- [ ] **Automated customer success** workflows

### Growth Path Benefits:
✅ **Launch quickly** with core value proposition  
✅ **Validate market demand** before complex features  
✅ **Add capabilities** based on real customer feedback  
✅ **No technical debt** - architecture supports all growth options  
✅ **Minimal risk** - new features don't break existing functionality

---

## Open Questions & Decisions Needed

### System.io Integration:
- [ ] **Exact webhook payload format** - Need System.io documentation
- [ ] **Product ID mapping** - Confirm System.io product identifiers
- [ ] **Subscription management** - How to handle renewals/cancellations

### Church Platform Details:
- [ ] **White-labeling scope** - Full subdomain vs. branded sections?
- [ ] **Student account creation** - Church Leader adds vs. self-registration?
- [ ] **Cross-church visibility** - Can students see other churches?

### Technical Decisions:
- [ ] **Migration strategy** - How to handle existing users?
- [ ] **Performance requirements** - Expected concurrent users per church?
- [ ] **Backup strategy** - Church data backup and recovery?

### Business Rules:
- [ ] **Ambassador limits** - How many per church?
- [ ] **Group size limits** - Maximum students per group?
- [ ] **Content restrictions** - Different materials for different tiers?

---

## Risk Assessment

### Technical Risks:
- **Database migration complexity** - Mitigation: Thorough testing in staging
- **Performance degradation** - Mitigation: Load testing and optimization
- **Security vulnerabilities** - Mitigation: Security audits and monitoring

### Business Risks:
- **System.io integration failure** - Mitigation: Robust error handling and manual fallbacks
- **Church adoption resistance** - Mitigation: Comprehensive onboarding and training
- **Scalability bottlenecks** - Mitigation: Performance monitoring and auto-scaling

### Operational Risks:
- **Support overhead increase** - Mitigation: Self-service tools and documentation
- **Data privacy compliance** - Mitigation: Privacy-by-design and audit trails
- **Financial integration errors** - Mitigation: Transaction logging and reconciliation

---

## Success Metrics

### Technical KPIs:
- System uptime > 99.9%
- Page load times < 2 seconds
- Security incidents = 0
- Automated provisioning success rate > 99%

### Business KPIs:
- Church partner adoption rate
- Student engagement metrics per church
- Revenue growth via tiered memberships
- Support ticket reduction through self-service

### User Experience KPIs:
- Church leader onboarding completion rate
- Business ambassador utilization
- Student course completion rates
- Platform satisfaction scores

---

## Appendices

### A. Current System URLs
- **Production**: https://ibam-learn-platform-production-v3-qvh1exnnp.vercel.app
- **Staging**: https://ibam-learn-platform-staging-v2-om0npwraj-ibam-projects.vercel.app

### B. Technical Dependencies
- Next.js 14+ with App Router
- Supabase for database and authentication
- System.io for payment processing
- Vercel for hosting and deployment

### C. Security Documentation
- Security monitoring dashboard at `/admin/security`
- Automated threat detection and alerting
- HMAC webhook signature validation
- Enterprise-grade session management

---

**Document Status**: Living document - will be updated as requirements evolve and decisions are made.

**Next Review Date**: Upon completion of Phase 1 implementation

**Stakeholders**: Platform Owner, Development Team, Church Partner Beta Testers