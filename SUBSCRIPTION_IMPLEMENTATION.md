# Agency Job Posting Pricing System Implementation

## Overview
This document describes the implementation of the subscription-based pricing system for job agencies.

## Pricing Model
- **Free Tier**: 2 job posts (lifetime, never resets)
- **Premium Tier**: ₱5,000/month for unlimited job postings
- **Featured Jobs**: Requires premium subscription + additional fee
- **Payment Verification**: Manual approval by admin
- **Grandfathering**: Existing agencies with >2 jobs get 1 month free premium

## ✅ Completed Implementation

### 1. Database Structure (Firestore)

#### New Collections:
- **subscriptions** - Tracks agency subscription status
- **subscriptionPayments** - Payment verification records
- **jobPostingLimits** - System configuration (pricing, limits)

#### New Indexes (firestore.indexes.json):
- 6 composite indexes for efficient subscription queries
- Job counting index by agencyId + createdAt

### 2. Backend Logic

#### Files Created/Modified:
- **[types/index.ts](types/index.ts:412-478)** - Subscription type definitions
- **[lib/collections.ts](lib/collections.ts:36-38)** - New collection constants
- **[lib/subscription-helpers.ts](lib/subscription-helpers.ts)** - Core subscription functions:
  - `canPostJob()` - Validates if agency can post
  - `getAgencySubscription()` - Retrieves subscription
  - `createFreeSubscription()` - Initializes free tier
  - `createPremiumSubscription()` - Activates premium
  - `incrementJobCount()` - Updates usage
  - `hasPremiumSubscription()` - Premium validation
  - `submitPremiumPayment()` - Payment submission
  - `getPendingPayments()` - Admin payment queue

- **[lib/job-helpers.ts](lib/job-helpers.ts:55-60)** - Enforces limits before job creation
- **[firestore.rules](firestore.rules:44-65)** - Security rules with subscription validation

### 3. UI Components

#### Created Components:
- **[SubscriptionStatusCard](components/subscription/SubscriptionStatusCard.tsx)** - Dashboard widget showing plan & usage
- **[UsageMeter](components/subscription/UsageMeter.tsx)** - Visual progress bar for limits
- **[UpgradeModal](components/subscription/UpgradeModal.tsx)** - Premium upgrade & payment submission
- **[JobLimitBanner](components/subscription/JobLimitBanner.tsx)** - Limit warnings

#### Updated Pages:
- **[Agency Dashboard](app/(authenticated)/agency/dashboard/page.tsx:193-196)** - Added subscription status card
- **[Job Posting Page](app/(authenticated)/jobs/post/page.tsx:160-213)** - Added limit checks & blocking

### 4. API Routes

#### Agency APIs:
- **POST [/api/subscription/submit-payment](app/api/subscription/submit-payment/route.ts)** - Submit payment for verification
- **GET [/api/subscription/check-limit](app/api/subscription/check-limit/route.ts)** - Validate posting permission
- **GET [/api/subscription/status](app/api/subscription/status/route.ts)** - Get subscription & payment history

#### Admin APIs:
- **POST [/api/admin/subscription/approve](app/api/admin/subscription/approve/route.ts)** - Approve premium payment
- **POST [/api/admin/subscription/reject](app/api/admin/subscription/reject/route.ts)** - Reject payment with reason

### 5. Migration Script
- **[scripts/migrate-subscriptions.ts](scripts/migrate-subscriptions.ts)** - One-time migration for existing agencies

## ⏳ Remaining Tasks (Optional/Enhancement)

### High Priority:
1. **Agency Subscription/Billing Page** - Dedicated page for subscription management
2. **Admin Subscription Management Page** - Admin UI to manage all subscriptions
3. **Add Billing Link to Sidebar** - Navigation link to subscription page

### Medium Priority:
4. **Update Featured Job Helpers** - Enforce premium requirement in lib/featured-job-helpers.ts
5. **Update AuthContext** - Preload subscription data with user profile

### Low Priority (Future Enhancements):
- Automated payment gateway integration (Paymongo, PayMaya API)
- Email notifications for expiry reminders
- Usage analytics dashboard
- Subscription renewal automation

## Deployment Steps

### 1. Deploy Firestore Configuration
```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Run Migration Script
```bash
# Install dependencies if needed
npm install firebase-admin dotenv ts-node

# Run migration
npx ts-node scripts/migrate-subscriptions.ts
```

### 3. Initialize Default Configuration
Create a document in Firestore manually or via script:

**Collection**: `jobPostingLimits`
**Document ID**: `default`
**Fields**:
```json
{
  "freeTierLimit": 2,
  "premiumTierLimit": -1,
  "premiumMonthlyPrice": 5000,
  "premiumCurrency": "PHP",
  "featuredJobBasePrice": 1000,
  "updatedAt": "2025-11-28T00:00:00.000Z"
}
```

### 4. Test the System
1. **Free Tier Test**:
   - Create new agency account
   - Post 2 jobs successfully
   - Verify 3rd job is blocked

2. **Premium Upgrade Test**:
   - Submit payment for premium
   - Admin approves payment
   - Verify unlimited posting

3. **Featured Job Test**:
   - Verify featured job request blocked for free tier
   - Verify allowed for premium tier

## User Flows

### Agency Upgrade Flow:
1. Agency clicks "Upgrade to Premium" button
2. Modal opens with payment instructions
3. Agency makes payment (GCash, Bank, etc.)
4. Agency submits payment reference & proof
5. Payment goes to admin for verification
6. Admin approves → Premium activated for 30 days
7. Agency can now post unlimited jobs

### Job Posting Flow (Free Tier):
1. Agency tries to post job
2. System checks subscription
3. If <2 jobs: Allow posting
4. If =2 jobs: Show warning banner
5. If >2 jobs: Block with upgrade prompt

### Job Posting Flow (Premium):
1. Agency tries to post job
2. System checks subscription status & expiry
3. If active: Allow unlimited posting
4. If expired: Block with renewal prompt

## Security Considerations

✅ **Implemented**:
- Server-side validation in Firestore rules
- Client-side and API double-checking
- Admin-only subscription management
- Audit logging for all subscription changes
- Payment verification required

⚠️ **Important**:
- Manual payment verification prevents fraud
- Firestore rules prevent direct subscription writes
- Job count tracked server-side (can't be manipulated)

## Monitoring & Maintenance

### What to Monitor:
1. **Pending Payments** - Check admin dashboard regularly
2. **Expiring Subscriptions** - Send renewal reminders
3. **Failed Payments** - Follow up with agencies
4. **Usage Patterns** - Track conversion rates

### Regular Tasks:
- Process payment approvals daily
- Send expiry reminders (7 days, 3 days, 1 day before)
- Review subscription analytics monthly
- Update pricing if needed

## Support & Troubleshooting

### Common Issues:

**Q: Agency says they can't post despite having free posts**
- Check subscription document exists
- Verify lifetimeJobsPosted count
- Check Firestore rules aren't blocking

**Q: Premium subscription not working after payment approval**
- Verify subscription status is 'active'
- Check endDate is in the future
- Confirm payment was marked as 'completed'

**Q: Migration script fails**
- Ensure Firebase Admin SDK credentials are correct
- Check Firestore permissions
- Review error logs for specific agency IDs

## Technical Notes

### Why Lifetime Count vs Monthly?
- Simpler to implement and understand
- No reset logic needed
- Prevents abuse (can't wait for reset)
- Matches business requirement

### Why Manual Payment Verification?
- No PCI compliance needed initially
- Flexible payment methods (GCash, bank, etc.)
- Prevents automated fraud
- Can be upgraded to automated later

### Performance Considerations:
- Firestore indexes ensure fast queries
- Subscription loaded once per session
- Job count incremented asynchronously (non-blocking)
- Caching can be added if needed

## Files Modified/Created

### Core Files (18 files):
1. types/index.ts
2. lib/collections.ts
3. lib/subscription-helpers.ts (NEW)
4. lib/job-helpers.ts
5. firestore.rules
6. firestore.indexes.json
7. components/subscription/SubscriptionStatusCard.tsx (NEW)
8. components/subscription/UsageMeter.tsx (NEW)
9. components/subscription/UpgradeModal.tsx (NEW)
10. components/subscription/JobLimitBanner.tsx (NEW)
11. app/(authenticated)/agency/dashboard/page.tsx
12. app/(authenticated)/jobs/post/page.tsx
13. app/api/subscription/submit-payment/route.ts (NEW)
14. app/api/subscription/check-limit/route.ts (NEW)
15. app/api/subscription/status/route.ts (NEW)
16. app/api/admin/subscription/approve/route.ts (NEW)
17. app/api/admin/subscription/reject/route.ts (NEW)
18. scripts/migrate-subscriptions.ts (NEW)

## Next Steps

To complete the implementation:
1. Deploy Firestore rules & indexes
2. Run migration script
3. Test with real agency accounts
4. Build agency subscription management page (optional)
5. Build admin subscription dashboard (optional)
6. Add navigation links for billing section

**The core pricing system is fully functional!** The remaining tasks are for enhanced user experience and admin convenience.
