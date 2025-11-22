# Database Migration: Legal Compliance Fields

## Overview

This migration script adds legal compliance fields to existing users and agencies in the Firestore database. It's required before deploying the updated Firestore security rules.

## What This Migration Does

### For Users Collection:
- Adds `termsAcceptedAt` (set to user's `createdAt`)
- Adds `termsVersion` (set to current version)
- Adds `privacyAcceptedAt` (set to user's `createdAt`)
- Adds `privacyVersion` (set to current version)
- For job hunters: adds `ageVerified: true` (grandfather clause)

### For JobHunters Collection:
- Same as users, plus explicit `ageVerified: true`
- Note: `dateOfBirth` will be requested on next profile update

### For Agencies Collection:
- Same as users, plus:
- Adds `agencyTermsAcceptedAt` (set to agency's `createdAt`)
- Adds `agencyTermsVersion` (set to current version)

## Prerequisites

1. **Firebase Admin SDK Service Account Key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Save it as `scripts/serviceAccountKey.json`
   - **IMPORTANT:** Add this file to `.gitignore`!

2. **Dependencies**
   ```bash
   npm install firebase-admin
   npm install -D ts-node @types/node
   ```

3. **Backup Your Database** (Recommended)
   - Export your Firestore data before running the migration
   - Firebase Console → Firestore Database → Import/Export

## How to Run

### Option 1: Using ts-node (Recommended)

```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npx ts-node scripts/migrate-legal-compliance.ts
```

### Option 2: Compile first, then run

```bash
npx tsc scripts/migrate-legal-compliance.ts
node scripts/migrate-legal-compliance.js
```

## Expected Output

```
🚀 Starting Legal Compliance Migration
=====================================
📅 Timestamp: 2025-11-22T...
📋 Terms Version: 1.0
📋 Privacy Version: 1.1
📋 Agency Terms Version: 1.0

📝 Migrating users collection...
  ✅ Committed batch of 500 users
  ✅ Committed final batch of 123 users
  ✅ Users migration complete: 623/623 updated

📝 Migrating jobHunters collection...
  ✅ Committed batch of 500 job hunters
  ✅ Committed final batch of 45 job hunters
  ✅ Job hunters migration complete: 545/545 updated

📝 Migrating agencies collection...
  ✅ Committed batch of 78 agencies
  ✅ Agencies migration complete: 78/78 updated

=====================================
✅ Migration Complete
=====================================
⏱️  Duration: 12.34s

📊 Summary:
   Users: 623/623 updated
   Job Hunters: 545/545 updated
   Agencies: 78/78 updated

✅ No errors encountered

📝 Next Steps:
   1. Verify the migration in Firestore Console
   2. Deploy the updated firestore.rules
   3. Monitor for any issues with new user signups
```

## Verification

After running the migration:

1. **Check Firestore Console:**
   - Open any user document → verify `termsAcceptedAt`, `termsVersion`, etc. exist
   - Open any agency document → verify `agencyTermsAcceptedAt`, `agencyTermsVersion`, etc. exist

2. **Sample Verification Query (Firestore Console):**
   ```javascript
   // In Firestore Console, go to users collection
   // Click "Filter" and check that all documents have:
   // - termsAcceptedAt (timestamp)
   // - termsVersion (string)
   // - privacyAcceptedAt (timestamp)
   // - privacyVersion (string)
   ```

## Rollback (If Needed)

If something goes wrong, you can rollback by:

1. **Restore from backup** (if you created one)
2. **Or manually remove the fields** (Firestore Console)
3. **Or run this rollback script:**

```typescript
// scripts/rollback-legal-compliance.ts
const batch = db.batch();
const users = await db.collection('users').get();

for (const doc of users.docs) {
  batch.update(doc.ref, {
    termsAcceptedAt: FieldValue.delete(),
    termsVersion: FieldValue.delete(),
    privacyAcceptedAt: FieldValue.delete(),
    privacyVersion: FieldValue.delete(),
    ageVerified: FieldValue.delete(),
  });
}

await batch.commit();
```

## Troubleshooting

### Error: "Cannot find module './serviceAccountKey.json'"
- Make sure you downloaded your service account key
- Place it in `scripts/serviceAccountKey.json`
- File path must be exact

### Error: "Permission denied"
- Your service account needs Firestore Admin permissions
- Go to Firebase Console → IAM & Admin → IAM
- Check that your service account has "Cloud Datastore User" or "Owner" role

### Error: "Document not found"
- Some users might have been deleted
- The script will skip them and continue

### Large Database (10,000+ users)
- The script processes in batches of 500
- For very large databases, consider running during off-peak hours
- Monitor Firestore quotas (reads/writes)

## Post-Migration Steps

1. ✅ Verify migration completed successfully
2. ✅ Deploy updated `firestore.rules` to Firebase
3. ✅ Test new user signup with legal acceptance
4. ✅ Monitor error logs for any issues
5. ✅ Update all team members about the change

## Important Notes

- **Run this migration ONLY ONCE**
- **Existing users are grandfathered in** (ageVerified: true, using their createdAt date)
- **New users MUST accept terms** during signup (enforced by updated rules)
- **The migration is idempotent** - safe to run multiple times (only updates missing fields)
- **Agencies cannot self-modify legal fields** after creation (protected by rules)

## Support

If you encounter issues:
1. Check the error output from the script
2. Verify your service account permissions
3. Check Firestore Console for partial updates
4. Contact the development team

---

**Last Updated:** November 22, 2025
**Script Version:** 1.0
