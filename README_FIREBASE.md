# Firebase Quick Reference - Job Agency PH

## ✅ Firebase Status: FULLY CONFIGURED

Your Firebase project is set up and secured! All security rules are deployed and active.

---

## 🚀 Quick Commands

```bash
# Deploy all rules
firebase deploy --only firestore:rules,storage

# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy Storage rules only
firebase deploy --only storage

# View current indexes
firebase firestore:indexes

# Start local emulators for testing
firebase emulators:start

# View all projects
firebase projects:list
```

---

## 📋 Project Info

- **Project ID:** `jobs-agency-8f28b`
- **Project Number:** `926738060539`
- **Region:** asia-southeast1 (Firestore)
- **Storage:** US-CENTRAL1

---

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/jobs-agency-8f28b/overview)
- [Firestore Database](https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/databases/-default-/data)
- [Firestore Rules](https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/rules)
- [Storage](https://console.firebase.google.com/project/jobs-agency-8f28b/storage)
- [Authentication](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/users)

---

## ⚠️ CRITICAL: Next Steps

### 1. Rotate Your Credentials (DO THIS NOW)

Your Firebase service account key is exposed. You must:

1. Go to [Service Accounts](https://console.firebase.google.com/project/jobs-agency-8f28b/settings/serviceaccounts/adminsdk)
2. Click "Generate New Private Key"
3. Update `.env.local` with new credentials:

```env
FIREBASE_PROJECT_ID=jobs-agency-8f28b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jobs-agency-8f28b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[NEW KEY HERE]\n-----END PRIVATE KEY-----"
```

4. Delete the old `FIREBASE_SERVICE_ACCOUNT_KEY` line
5. Restart your dev server: `npm run dev`

### 2. Verify an Agency Account

To test job posting, you need a verified agency:

1. Create an agency account in your app
2. Go to [Firestore Database](https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/databases/-default-/data)
3. Find the agency in `agencies` collection
4. Set `verified: true`

---

## 🛡️ Security Features Active

✅ Authentication required
✅ Role-based access (Job Hunter vs Agency)
✅ Only verified agencies can post jobs
✅ File type & size validation
✅ Data sanitization rules
✅ Owner-only operations

---

## 📚 Documentation

- [FIREBASE_SETUP_REPORT.md](FIREBASE_SETUP_REPORT.md) - Full setup details
- [SECURITY.md](SECURITY.md) - Security guide
- [QUICK_START.md](QUICK_START.md) - Getting started
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - All changes

---

## 🧪 Test Your Setup

Run these tests to verify everything works:

```bash
# 1. Start dev server
npm run dev

# 2. Test these pages:
# - http://localhost:3000/profile
# - http://localhost:3000/saved-jobs
# - http://localhost:3000/jobs
# - http://localhost:3000/auth/login

# 3. Try uploading a file
# 4. Try creating a job (as verified agency)
# 5. Try applying to a job (as job hunter)
```

---

## 🆘 Having Issues?

1. **Rules not working?**
   - Check [Rules Playground](https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/rules)
   - Verify authentication in your app

2. **File upload failing?**
   - Check file size (5MB images, 10MB resumes)
   - Check file type (PDF, images only)
   - Check [Storage Rules](https://console.firebase.google.com/project/jobs-agency-8f28b/storage/rules)

3. **Index errors?**
   - Click the link in error message
   - Or add to `firestore.indexes.json` and deploy

4. **App not connecting?**
   - Check `.env.local` has all variables
   - Restart dev server
   - Check Firebase Console for errors

---

**All set! 🎉** Your Firebase is configured and secured. Remember to rotate your credentials!
