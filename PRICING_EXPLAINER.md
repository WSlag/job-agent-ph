# Pricing Explainer Modal

## Overview

A beautiful, interactive modal that educates agency users about the job posting pricing system. Built using the same design patterns as the existing onboarding wizard.

---

## What's Included

### Components Created

1. **PricingExplainerModal** ([components/pricing/PricingExplainerModal.tsx](components/pricing/PricingExplainerModal.tsx))
   - 5-step interactive wizard
   - Smooth animations using Framer Motion
   - Progress indicators
   - Automatic tracking when users complete viewing

2. **Updated SubscriptionStatusCard** ([components/subscription/SubscriptionStatusCard.tsx](components/subscription/SubscriptionStatusCard.tsx))
   - Added help icon (?) button
   - Triggers pricing modal when clicked

### Type Updates

Added tracking fields to Agency type ([types/index.ts](types/index.ts)):
```typescript
pricingExplainerSeen?: boolean;
pricingExplainerSeenAt?: Date;
```

---

## How It Works

### User Flow

1. **Trigger**: User clicks the help icon (?) in the SubscriptionStatusCard
2. **Modal Opens**: 5-step pricing explainer appears
3. **Navigation**: User can go back/forward through steps or skip
4. **Completion**: When user finishes, tracking data is saved to Firestore

### Modal Steps

#### Step 1: Welcome
- Overview of pricing philosophy
- Quick stats: "2 free posts" and "₱5,000/month"

#### Step 2: Free Tier
- Explains 2 lifetime free posts
- Lists what's included
- Important note about limit

#### Step 3: Premium Tier
- ₱5,000/month for unlimited posts
- Premium benefits listed
- Featured jobs information (₱10,000 additional)

#### Step 4: How Billing Works
- 3-step payment process
- Payment methods (GCash, Bank Transfer, PayMaya)
- Monthly subscription details

#### Step 5: Get Started
- Summary of all pricing
- Encouragement to start posting

---

## Where to Find It

### Current Triggers

1. **Agency Dashboard** - Click the help icon (?) in the Subscription Status card

### Potential Future Triggers

You can easily add the modal to other locations:

```tsx
import PricingExplainerModal from '@/components/pricing/PricingExplainerModal'

// In your component
const [showPricing, setShowPricing] = useState(false)

// Trigger button
<button onClick={() => setShowPricing(true)}>
  Learn About Pricing
</button>

// Modal
<PricingExplainerModal
  isOpen={showPricing}
  onClose={() => setShowPricing(false)}
  onComplete={() => {
    // Optional callback after user completes viewing
    console.log('User viewed pricing')
  }}
/>
```

---

## Tracking & Analytics

### What's Tracked

When a user completes the pricing explainer:
- `pricingExplainerSeen` → `true`
- `pricingExplainerSeenAt` → Current timestamp

### Where It's Saved

Stored in the agency's document in Firestore:
```
agencies/{agencyId}
  └─ pricingExplainerSeen: true
  └─ pricingExplainerSeenAt: Timestamp
```

### Use Cases

- **Onboarding Analytics**: Track how many new agencies view pricing
- **Support**: See if user has viewed pricing before asking support questions
- **Marketing**: Identify users who haven't seen pricing yet for targeted messaging

---

## Design Features

### Animations
- Smooth fade-in/fade-out transitions
- Slide animations between steps
- Backdrop blur effect

### Responsive
- Works on mobile and desktop
- Maximum height constraint for scrolling
- Touch-friendly buttons

### Accessibility
- Clear progress indicators
- Skip functionality
- Close button always visible
- Keyboard navigation support (ESC to close)

---

## Customization

### Updating Prices

To update pricing displayed in the modal:

1. Open [components/pricing/PricingExplainerModal.tsx](components/pricing/PricingExplainerModal.tsx)
2. Search for the price values:
   - Line ~159: Free tier limit (currently "2")
   - Line ~160: Premium price (currently "₱5,000")
   - Line ~252: Premium price again (currently "₱5,000")
   - Line ~330: Featured job price (currently "₱10,000")

### Adding/Removing Steps

To modify the steps:

1. Edit the `steps` array (lines 16-42)
2. Add/remove step content in the main render section
3. Update step indicator count

### Changing Colors

The modal uses Tailwind CSS classes:
- Primary blue: `bg-blue-600`, `text-blue-600`
- Success green: `bg-green-600`, `text-green-600`
- Warning yellow: `bg-yellow-600`, `text-yellow-600`

---

## Testing Checklist

- [ ] Modal opens when clicking help icon in SubscriptionStatusCard
- [ ] All 5 steps display correctly
- [ ] Navigation (Back/Next) works smoothly
- [ ] Skip button closes modal
- [ ] Close (X) button works
- [ ] Clicking backdrop closes modal
- [ ] Progress bar updates on each step
- [ ] Tracking saves to Firestore on completion
- [ ] Modal works on mobile devices
- [ ] Animations are smooth

---

## Future Enhancements

### Suggested Improvements

1. **Auto-show for New Users**
   - Show pricing modal automatically for agencies < 24 hours old
   - Similar to existing onboarding wizard

2. **Contextual Triggers**
   - Show when user reaches 1/2 free posts
   - Show when job creation is blocked due to limits

3. **A/B Testing**
   - Track conversion rates after viewing pricing
   - Test different pricing messaging

4. **Video Tour**
   - Add video explaining premium benefits
   - Screen recording of upgrade process

5. **FAQ Section**
   - Add expandable FAQ to final step
   - Common questions about billing

---

## Related Files

### Components
- [components/pricing/PricingExplainerModal.tsx](components/pricing/PricingExplainerModal.tsx)
- [components/subscription/SubscriptionStatusCard.tsx](components/subscription/SubscriptionStatusCard.tsx)

### Types
- [types/index.ts](types/index.ts) - Agency interface with tracking fields

### Similar Patterns
- [components/onboarding/AgencyOnboardingWizard.tsx](components/onboarding/AgencyOnboardingWizard.tsx) - Original wizard this is based on
- [contexts/OnboardingContext.tsx](contexts/OnboardingContext.tsx) - Onboarding tracking pattern

---

## Support

If you need to modify the pricing explainer:

1. **Content Changes**: Edit [components/pricing/PricingExplainerModal.tsx](components/pricing/PricingExplainerModal.tsx)
2. **Styling**: Update Tailwind classes in the component
3. **Tracking**: Modify the `handleComplete` function
4. **Triggers**: Add buttons in other components following the example above

---

## Summary

✅ **5-step pricing wizard** - Educates users on free and premium tiers
✅ **Beautiful animations** - Smooth Framer Motion transitions
✅ **Automatic tracking** - Saves view status to Firestore
✅ **Easy to trigger** - Help icon in subscription card
✅ **Reusable** - Can be added to any page
✅ **Responsive** - Works on all devices

The pricing explainer is ready to use! Users can now learn about your pricing model in an engaging, interactive way.
