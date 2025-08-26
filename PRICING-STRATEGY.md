# IBAM Membership Pricing Strategy

## Official Pricing Structure (Effective 2025)

### Individual Memberships
All individual memberships include a **7-day free trial**.

| Membership | Monthly | Annual | Savings | Features |
|------------|---------|--------|---------|----------|
| **IBAM Impact Members** | $10 | $100 | $20/year | Course access only |
| **Entrepreneur** | $20 | $200 | $40/year | Course + Business Planner |
| **Business** | $59 | $590 | $118/year | All features + Advanced tools |

### Church Partnerships
All church partnerships include a **30-day free trial** for evaluation.

| Partnership | Monthly | Annual | Savings | Student Limit |
|-------------|---------|--------|---------|---------------|
| **Small Church** | $49 | $490 | $98/year | Up to 250 members |
| **Large Church** | $150 | $1,500 | $300/year | Up to 1,000 members |
| **Mega Church** | $500 | $5,000 | $1,000/year | Unlimited |

## Auto-Renewal Policy
- All memberships **auto-renew** unless cancelled
- Cancellation can be done anytime through System.io
- Access continues until the end of the paid period

## System.io Tag Configuration
These exact tag names must be used in System.io:

### Individual Tags
- `Trial Member` - For free trials
- `IBAM Impact Members` - Basic membership
- `Entrepreneur Member` - Full access membership
- `Business Member` - Premium business features

### Church Tags
- `Church Partner Small` - Small church partnership
- `Church Partner Large` - Large church partnership
- `Church Partner Mega` - Mega church partnership

## Price Configuration
Prices can be easily updated via environment variables without code changes:

```env
# Individual Pricing
PRICE_IBAM_MONTHLY=10
PRICE_IBAM_ANNUAL=100
PRICE_ENTREPRENEUR_MONTHLY=20
PRICE_ENTREPRENEUR_ANNUAL=200
PRICE_BUSINESS_MONTHLY=59
PRICE_BUSINESS_ANNUAL=590

# Church Pricing
PRICE_CHURCH_SMALL_MONTHLY=49
PRICE_CHURCH_SMALL_ANNUAL=490
PRICE_CHURCH_LARGE_MONTHLY=150
PRICE_CHURCH_LARGE_ANNUAL=1500
PRICE_CHURCH_MEGA_MONTHLY=500
PRICE_CHURCH_MEGA_ANNUAL=5000
```

## Implementation Details
- Pricing configuration: `/lib/membership-config.ts`
- Webhook processing: `/app/api/webhooks/systemio/route.ts`
- Environment variables: `.env.local` (copy from `.env.pricing.example`)

## Mission Focus
As a Christian non-profit, 100% of membership fees go directly to:
- Funding entrepreneurs in remote areas
- Supporting local church business initiatives
- Alleviating poverty through business development
- Spreading the Gospel through marketplace ministry

## Future Price Adjustments
The system is designed for easy price updates:
1. Update environment variables
2. Restart the application
3. New prices take effect immediately
4. Existing members keep their current rates until renewal

---
*Last Updated: November 2025*
*Contact: IBAM Development Team*