# Scripts Directory

This directory contains utility scripts for Job Agent PH development and testing.

## Available Scripts

### 1. Create Test Admin (`create-test-admin.ts`)

Creates a test admin user for local development and testing.

**Usage:**
```bash
npx tsx scripts/create-test-admin.ts
```

**What it does:**
- Creates Firebase Auth user for admin
- Creates `users` collection document
- Creates `admins` collection document with super_admin role
- Provides login credentials

**Default Credentials:**
- Email: `admin@jobagentph.com`
- Password: `***REMOVED***`
- Role: Super Admin

**Access:**
- Login: `http://localhost:3000/auth/login`
- Dashboard: `http://localhost:3000/admin/dashboard`

---

### 2. Seed Featured Jobs Data (`seed-featured-jobs.ts`)

Creates comprehensive test data for the featured jobs system.

**Usage:**
```bash
npx tsx scripts/seed-featured-jobs.ts
```

**What it creates:**

**3 Test Agencies:**
1. TechHire Global (`techhire@example.com` / `***REMOVED***`)
2. HealthCare Staffing Inc. (`healthcare@example.com` / `***REMOVED***`)
3. Engineering Talent Solutions (`engineering@example.com` / `***REMOVED***`)

**5 Sample Jobs:**
1. Senior Full-Stack Developer (Singapore) - Technology
2. Registered Nurse - ICU (Dubai) - Healthcare
3. Structural Engineer (Toronto) - Engineering
4. Digital Marketing Manager (London) - Marketing
5. Hospitality Manager (Sydney) - Hospitality

**Featured Requests:**
- **3 Pending:** Ready for admin review
- **1 Approved:** Job is featured on homepage carousel
- **1 Rejected:** Example of rejection workflow

**Test Flow:**
1. Login as agency → See jobs on dashboard
2. Request featured placement for a job
3. Login as admin → See pending requests
4. Approve/reject requests
5. Manage carousel order
6. View featured jobs on homepage

---

## Prerequisites

### Environment Variables Required:

Create `.env.local` file with:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for scripts)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key\n-----END PRIVATE KEY-----"

# Admin Secret Key
NEXT_PUBLIC_ADMIN_SECRET_KEY=your_super_secret_key
```

### Dependencies:

```bash
npm install firebase-admin dotenv tsx
```

---

## Common Issues & Solutions

### Issue: "Firebase Admin initialization failed"
**Solution:** Check your Firebase Admin SDK credentials in `.env.local`

### Issue: "Email already exists"
**Solution:** Scripts will use existing users instead of creating duplicates

### Issue: "Permission denied"
**Solution:** Ensure Firestore security rules allow admin writes during development

---

## Development Tips

### Run Scripts During Development:
```bash
# Start fresh with test data
npx tsx scripts/create-test-admin.ts
npx tsx scripts/seed-featured-jobs.ts

# Start dev server
npm run dev
```

### Clean Up Test Data:
Use Firebase Console to delete test collections:
- `users` > delete test users
- `agencies` > delete test agencies
- `jobs` > delete test jobs
- `featuredRequests` > delete test requests

### Customize Test Data:
Edit the scripts to create custom test scenarios:
- Add more agencies in `testAgencies` array
- Add more jobs in `sampleJobs` array
- Adjust featured request statuses

---

## Script Architecture

Both scripts follow this pattern:

1. **Initialize Firebase Admin**
   - Load environment variables
   - Connect to Firebase with admin credentials

2. **Create/Update Data**
   - Check for existing data
   - Create Firebase Auth users
   - Create Firestore documents

3. **Output Summary**
   - Display created credentials
   - Show access URLs
   - Provide next steps

---

## Security Notes

⚠️ **IMPORTANT:**
- These scripts are for **development and testing only**
- Never run in production
- Never commit `.env.local` to version control
- Change default passwords immediately after creation
- Use strong admin secret keys in production

---

## Future Scripts (Planned)

- `delete-test-data.ts` - Clean up all test data
- `create-sample-applications.ts` - Seed job applications
- `generate-analytics-data.ts` - Create analytics test data
- `backup-firestore.ts` - Backup Firestore data
- `migrate-featured-jobs.ts` - Migration script for schema updates

---

For more information, see: [FEATURED_JOBS_IMPLEMENTATION.md](../FEATURED_JOBS_IMPLEMENTATION.md)
