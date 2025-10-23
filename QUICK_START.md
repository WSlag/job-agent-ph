# Quick Start Guide - Job Agency PH

## 🚀 Getting Started After Updates

This guide helps you quickly get up and running with the recent security and feature updates.

---

## ⚡ 5-Minute Security Setup

### Step 1: Secure Your Firebase Credentials (CRITICAL)

1. **Generate a new Firebase service account key:**
   ```
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project: jobs-agency-8f28b
   - Navigate to: Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
   ```

2. **Update your `.env.local` file:**
   ```bash
   # Open .env.local and replace the FIREBASE_SERVICE_ACCOUNT_KEY with these:

   FIREBASE_PROJECT_ID=jobs-agency-8f28b
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jobs-agency-8f28b.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR NEW PRIVATE KEY]\n-----END PRIVATE KEY-----"
   ```

   **Important:**
   - Copy values from the JSON file you just downloaded
   - Keep the `\n` characters in the private key
   - Wrap the private key in double quotes
   - Delete the old `FIREBASE_SERVICE_ACCOUNT_KEY` line

3. **Verify the app still works:**
   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 and try logging in.

### Step 2: Deploy Firebase Security Rules

1. **Install Firebase CLI (if not installed):**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not done):**
   ```bash
   firebase init
   # Select: Firestore, Storage
   # Use existing project: jobs-agency-8f28b
   # Keep default file names
   ```

4. **Deploy security rules:**
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

5. **Verify deployment:**
   - Go to Firebase Console > Firestore Database > Rules
   - You should see the new rules deployed
   - Go to Storage > Rules - verify storage rules are deployed

### Step 3: Test the New Pages

Visit these URLs to verify everything works:

- Profile page: http://localhost:3000/profile
- Saved jobs: http://localhost:3000/saved-jobs
- Password reset: http://localhost:3000/auth/forgot-password
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact
- Privacy: http://localhost:3000/privacy
- Companies: http://localhost:3000/companies

---

## 📦 What's New

### New Pages
✅ **Profile Management** (`/profile`)
- Edit your profile information
- Change password
- Upload resume and profile picture

✅ **Saved Jobs** (`/saved-jobs`)
- View all your saved jobs (now synced across devices!)
- Automatically migrates from localStorage

✅ **Password Reset** (`/auth/forgot-password`)
- Reset your password via email

✅ **About Page** (`/about`)
- Company mission, vision, and values

✅ **Contact Page** (`/contact`)
- Contact form and support information

✅ **Privacy Policy** (`/privacy`)
- Comprehensive privacy policy

✅ **Companies Directory** (`/companies`)
- Browse all hiring companies

### New Security Features
✅ **Input Validation** (`lib/validation.ts`)
- 20+ validation functions for all user inputs
- Protection against XSS and injection attacks

✅ **Firestore Security Rules**
- Role-based access control
- Data validation at the database level
- Prevents unauthorized access

✅ **Storage Security Rules**
- File type and size validation
- Prevents malicious file uploads

---

## 🔧 Developer Workflow

### Running the App
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Firebase Commands
```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage

# Deploy both
firebase deploy --only firestore:rules,storage

# View logs
firebase functions:log
```

### Testing New Features

1. **Test Profile Page:**
   - Login as job hunter
   - Go to `/profile`
   - Update your information
   - Upload a resume
   - Change password

2. **Test Saved Jobs:**
   - Login as job hunter
   - Go to `/jobs`
   - Save a job (bookmark icon)
   - Go to `/saved-jobs`
   - Verify job appears
   - Remove a saved job

3. **Test Password Reset:**
   - Logout
   - Click "Forgot password?" on login page
   - Enter your email
   - Check email for reset link
   - Reset password

4. **Test Companies Page:**
   - Go to `/companies`
   - Search for companies
   - Click "View Open Positions"

---

## 🐛 Troubleshooting

### "Firebase Admin initialization error"
**Problem:** App crashes on startup with Firebase error

**Solution:**
1. Check `.env.local` has all required variables
2. Verify private key is properly formatted (keep `\n` characters)
3. Ensure private key is wrapped in double quotes
4. Restart dev server: `npm run dev`

### "Permission denied" errors in Firestore
**Problem:** Can't read/write to Firestore

**Solution:**
1. Deploy security rules: `firebase deploy --only firestore:rules`
2. Check Firebase Console > Firestore Database > Rules
3. Verify rules were deployed successfully
4. Check browser console for specific permission errors

### "Storage upload failed"
**Problem:** Can't upload resume or profile picture

**Solution:**
1. Deploy storage rules: `firebase deploy --only storage`
2. Check file size (max 10MB for resumes, 5MB for images)
3. Check file type (PDF, DOC, DOCX for resumes; JPG, PNG for images)
4. Check Firebase Console > Storage > Rules

### "Cannot find module '@/lib/validation'"
**Problem:** TypeScript error about missing validation module

**Solution:**
1. Verify `lib/validation.ts` file exists
2. Restart TypeScript server in VS Code
3. Clear Next.js cache: `rm -rf .next` and restart dev server

### Profile page shows "Profile not found"
**Problem:** User has no profile document in Firestore

**Solution:**
1. This happens for users created before the profile system
2. User needs to complete their profile by going through signup again, OR
3. Manually create a document in Firestore:
   - Collection: `jobHunters` or `agencies`
   - Document ID: user's UID
   - Required fields: see signup page for structure

---

## 📝 Checklist for Production Deployment

Before deploying to production:

### Security
- [ ] Rotated Firebase credentials
- [ ] Updated environment variables on hosting platform (Vercel/Netlify)
- [ ] Deployed Firestore security rules
- [ ] Deployed Storage security rules
- [ ] Removed old FIREBASE_SERVICE_ACCOUNT_KEY from .env
- [ ] Verified `.env.local` is in `.gitignore`

### Features
- [ ] Tested all new pages (profile, saved-jobs, etc.)
- [ ] Tested file uploads
- [ ] Tested password reset flow
- [ ] Tested form validation
- [ ] Verified mobile responsiveness

### Configuration
- [ ] Updated contact email in Contact page
- [ ] Updated company info in About page
- [ ] Set up email forwarding for support@jobagencyph.com
- [ ] Updated NEXT_PUBLIC_APP_URL in production

### Performance
- [ ] Tested with realistic data volumes
- [ ] Checked loading times
- [ ] Verified Firebase quota limits
- [ ] Set up monitoring/error tracking

---

## 🆘 Need Help?

### Documentation
- [SECURITY.md](SECURITY.md) - Security guide and best practices
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Detailed changes and roadmap
- [.env.example](.env.example) - Environment variable template

### Common Tasks

**How do I add a new validation?**
- Add function to `lib/validation.ts`
- Follow existing patterns
- Export the function
- Use in your form component

**How do I update Firestore rules?**
- Edit `firestore.rules`
- Run `firebase deploy --only firestore:rules`
- Test in Firebase Console using "Rules Playground"

**How do I update Storage rules?**
- Edit `storage.rules`
- Run `firebase deploy --only storage`
- Test by uploading a file

**How do I add a new page?**
- Create file in `app/[page-name]/page.tsx`
- Use existing pages as templates
- Add link in header or footer

---

## 🎯 Quick Reference

### File Structure
```
job-agent-ph/
├── app/
│   ├── profile/page.tsx          # New: Profile management
│   ├── saved-jobs/page.tsx       # New: Saved jobs
│   ├── auth/forgot-password/     # New: Password reset
│   ├── about/page.tsx            # New: About page
│   ├── contact/page.tsx          # New: Contact page
│   ├── privacy/page.tsx          # New: Privacy policy
│   └── companies/page.tsx        # New: Companies directory
├── lib/
│   ├── validation.ts             # New: Validation library
│   └── firebase-admin.ts         # Updated: Secure credentials
├── firestore.rules               # New: Database security
├── storage.rules                 # New: Storage security
├── .env.example                  # New: Template
├── SECURITY.md                   # New: Security guide
├── IMPLEMENTATION_SUMMARY.md     # New: Full documentation
└── QUICK_START.md                # This file
```

### Key Files to Configure
1. `.env.local` - Your local environment variables
2. `firestore.rules` - Database security rules
3. `storage.rules` - File storage security rules

### Important URLs
- Firebase Console: https://console.firebase.google.com/
- Your project: https://console.firebase.google.com/project/jobs-agency-8f28b
- Local dev: http://localhost:3000

---

**Ready to go!** 🎉

If you've completed the 5-minute security setup above, your app is now more secure and has all the new features ready to use!
