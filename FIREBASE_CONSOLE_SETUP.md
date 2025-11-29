# Firebase Console Setup Guide
## Creating Job Posting Limits Configuration

This guide will walk you through creating the required configuration document in Firebase Console.

---

## Step-by-Step Instructions

### 1. Access Firebase Console

1. Open your browser and go to: **https://console.firebase.google.com/project/jobs-agency-8f28b/firestore**
2. This will take you directly to your Firestore Database

### 2. Navigate to Firestore Database

If the link above doesn't work:
1. Go to **https://console.firebase.google.com**
2. Click on your project: **jobs-agency-8f28b**
3. In the left sidebar, click on **Firestore Database**
4. Make sure you're on the **Data** tab

### 3. Create New Collection

1. Click the **"Start collection"** button (if this is your first collection)
   - OR click **"+ Add collection"** if you already have collections
2. In the "Collection ID" field, enter: **`jobPostingLimits`**
3. Click **"Next"**

### 4. Create the Configuration Document

1. In the "Document ID" field, enter: **`default`**
   - ⚠️ **Important**: Use exactly `default` (all lowercase)
2. Click **"Add field"** to start adding fields

### 5. Add Configuration Fields

Add each field one by one. Click **"Add field"** button for each:

#### Field 1: freeTierLimit
- **Field name**: `freeTierLimit`
- **Field type**: `number`
- **Value**: `2`

#### Field 2: premiumTierLimit
- **Field name**: `premiumTierLimit`
- **Field type**: `number`
- **Value**: `-1`
  - ℹ️ Note: -1 means "unlimited"

#### Field 3: premiumMonthlyPrice
- **Field name**: `premiumMonthlyPrice`
- **Field type**: `number`
- **Value**: `5000`

#### Field 4: premiumCurrency
- **Field name**: `premiumCurrency`
- **Field type**: `string`
- **Value**: `PHP`

#### Field 5: featuredJobBasePrice
- **Field name**: `featuredJobBasePrice`
- **Field type**: `number`
- **Value**: `1000`

#### Field 6: updatedAt
- **Field name**: `updatedAt`
- **Field type**: `timestamp`
- **Value**: Click the **clock icon** → Select **"Set to current time"**

### 6. Save the Document

1. Review all fields to make sure they match exactly as shown above
2. Click the **"Save"** button

### 7. Verify the Configuration

After saving, you should see:
```
Collection: jobPostingLimits
  └─ Document: default
       ├─ freeTierLimit: 2
       ├─ premiumTierLimit: -1
       ├─ premiumMonthlyPrice: 5000
       ├─ premiumCurrency: "PHP"
       ├─ featuredJobBasePrice: 1000
       └─ updatedAt: [timestamp]
```

---

## Visual Guide

### What it should look like:

```
┌─────────────────────────────────────────────────────┐
│ Firestore Database                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ✓ jobPostingLimits                                 │
│   └─ default                                        │
│      ├─ freeTierLimit: 2                           │
│      ├─ premiumTierLimit: -1                       │
│      ├─ premiumMonthlyPrice: 5000                  │
│      ├─ premiumCurrency: "PHP"                     │
│      ├─ featuredJobBasePrice: 1000                 │
│      └─ updatedAt: November 28, 2025 at 1:30:00 PM │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Problem: Can't find "Start collection" button
**Solution**: Make sure you're on the **Data** tab in Firestore Database

### Problem: Getting permission errors
**Solution**: Make sure you're logged in with an account that has Owner or Editor role on the Firebase project

### Problem: Fields are not saving
**Solution**:
1. Check that field names are exactly as shown (case-sensitive)
2. Make sure field types match (number vs string vs timestamp)
3. Click "Save" button at the bottom

---

## What This Configuration Does

| Field | Purpose |
|-------|---------|
| `freeTierLimit` | Maximum number of lifetime job posts for free tier (2) |
| `premiumTierLimit` | Maximum jobs for premium tier (-1 = unlimited) |
| `premiumMonthlyPrice` | Cost of premium subscription in pesos (₱5,000) |
| `premiumCurrency` | Currency code for pricing (PHP) |
| `featuredJobBasePrice` | Additional cost for featured job placement (₱1,000) |
| `updatedAt` | Timestamp when config was last updated |

---

## Next Steps After Configuration

Once you've created this configuration:

1. ✅ **Configuration is complete!**
2. 🔄 **Run the migration script** to set up subscriptions for existing agencies:
   ```bash
   npx ts-node --esm scripts/migrate-subscriptions.ts
   ```
3. 🧪 **Test the system**:
   - Try posting a job as a new agency
   - Verify free tier limit (2 posts)
   - Test premium upgrade flow

---

## Need Help?

If you encounter any issues:
1. Check the [Firebase Console](https://console.firebase.google.com/project/jobs-agency-8f28b)
2. Verify Firestore Database is enabled
3. Check browser console for any error messages
4. Make sure you have proper permissions on the project

---

## Quick Reference

**Direct Link**: https://console.firebase.google.com/project/jobs-agency-8f28b/firestore

**Configuration Summary**:
- Collection: `jobPostingLimits`
- Document: `default`
- Free tier: 2 lifetime posts
- Premium: ₱5,000/month for unlimited posts
- Featured jobs: +₱1,000 (requires premium)
