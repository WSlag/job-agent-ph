# User Repair Tool Documentation

## Overview

The User Repair Tool is an administrative utility designed to diagnose and fix orphaned user accounts in the Job Agent PH platform. An "orphaned user" is someone who exists in Firebase Authentication but lacks corresponding profile documents in Firestore, preventing them from appearing in the admin dashboard and using the application properly.

## Problem Statement

### What is an Orphaned User?

The application uses a denormalized database architecture where user data exists in two locations:

1. **Firebase Authentication** - Handles login credentials and authentication
2. **Firestore Database** - Stores user profiles in two collections:
   - Base profile in `users/{userId}` collection
   - Extended profile in role-specific collection (`jobHunters`, `agencies`, or `admins`)

### How Orphaned Users Occur

Orphaned users can be created when:
- User signup fails after Auth creation but before Firestore writes complete
- Network interruptions during registration
- Validation errors in Firestore security rules
- Manual user creation in Firebase Console without corresponding Firestore documents
- Google OAuth signup failures

### Impact

An orphaned user can:
- ✅ Log in successfully (Firebase Auth works)
- ❌ NOT appear in admin dashboards (no Firestore documents)
- ❌ NOT use the application features (app expects Firestore profile)
- ❌ Experience errors and blank pages

## Solution Architecture

### Components Created

The User Repair Tool consists of three main components:

1. **Diagnostic API Route** - [`/api/admin/diagnose-user`](app/api/admin/diagnose-user/route.ts)
2. **Repair API Route** - [`/api/admin/repair-user`](app/api/admin/repair-user/route.ts)
3. **Admin UI** - [`/admin/user-repair`](app/(authenticated)/admin/user-repair/page.tsx)
4. **Standalone HTML Tool** - [`/test-repair.html`](public/test-repair.html)

## Features

### 1. Diagnostic Endpoint

**Endpoint:** `GET /api/admin/diagnose-user?email={email}`

**Purpose:** Investigates a user's current state across Firebase Auth and Firestore.

**Returns:**
```json
{
  "email": "user@example.com",
  "timestamp": "2025-11-29T12:05:30.127Z",
  "auth": {
    "exists": true,
    "data": {
      "uid": "abc123...",
      "email": "user@example.com",
      "emailVerified": true,
      "disabled": false,
      "creationTime": "...",
      "lastSignInTime": "...",
      "providerData": [...]
    }
  },
  "firestore": {
    "users": { "exists": false, "data": null },
    "jobHunters": { "exists": false, "data": null },
    "agencies": { "exists": false, "data": null },
    "admins": { "exists": false, "data": null }
  },
  "issues": [
    "Missing base user document in users collection",
    "No role-specific profile found"
  ],
  "recommendations": [
    "Create users/{userId} document",
    "Run repair script with appropriate userType"
  ],
  "summary": {
    "isOrphaned": true,
    "isIncomplete": true,
    "isInconsistent": false,
    "canRepair": true
  }
}
```

### 2. Repair Endpoint

**Endpoint:** `POST /api/admin/repair-user`

**Request Body:**
```json
{
  "userId": "abc123...",
  "userType": "agency",
  "profileData": {
    "companyName": "Company Name"
  }
}
```

**Purpose:** Creates missing Firestore documents for orphaned users.

**Response:**
```json
{
  "success": true,
  "message": "User repaired successfully",
  "userId": "abc123...",
  "email": "user@example.com",
  "userType": "agency",
  "createdDocuments": ["users", "agencies"],
  "skippedDocuments": [],
  "timestamp": "2025-11-29T12:10:00.000Z"
}
```

### 3. Admin UI

**URL:** `/admin/user-repair`

**Features:**
- Email input field
- One-click diagnostic
- One-click repair (appears when user can be repaired)
- Detailed diagnostic results display
- Success confirmation
- Full JSON output for debugging

### 4. Standalone HTML Tool

**URL:** `/test-repair.html`

**Features:**
- Works independently of React/Next.js
- Simple button interface
- Real-time console output
- Auto-redirect to agencies page on success

## Usage Guide

### Using the Admin UI

1. **Access the Tool:**
   - Navigate to `/admin/user-repair` in your browser
   - Or click "User Repair" in the admin sidebar menu

2. **Diagnose a User:**
   - Enter the user's email address
   - Click "Run Diagnostic"
   - Review the diagnostic results

3. **Repair the User:**
   - If the summary shows "Can Repair: Yes"
   - Click "Repair User"
   - Wait for success confirmation
   - User should now appear in admin dashboard

### Using the HTML Tool

1. **Access:** Navigate to `/test-repair.html`
2. **Enter email** in the input field
3. **Click "1. Diagnose User"**
4. **Review output** in the log area
5. **Click "2. Repair User"** if repair is possible
6. **Confirm** when prompted to go to agencies page

### Using API Endpoints Directly

#### Via Browser Console:

```javascript
// Diagnose
fetch('/api/admin/diagnose-user?email=user@example.com')
  .then(res => res.json())
  .then(data => console.log(data));

// Repair
fetch('/api/admin/repair-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'USER_ID_FROM_DIAGNOSTIC',
    userType: 'agency',
    profileData: { companyName: 'Company Name' }
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Via cURL:

```bash
# Diagnose
curl "http://localhost:3000/api/admin/diagnose-user?email=user@example.com"

# Repair
curl -X POST "http://localhost:3000/api/admin/repair-user" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","userType":"agency","profileData":{"companyName":"Company"}}'
```

## Data Schemas

### Base Users Document

Created in `users/{userId}` collection:

```typescript
{
  email: string
  userType: 'jobhunter' | 'agency' | 'admin'
  createdAt: Date
  updatedAt: Date
  termsAcceptedAt?: Date
  termsVersion?: string
  privacyAcceptedAt?: Date
  privacyVersion?: string
}
```

### Agency Profile Document

Created in `agencies/{userId}` collection:

```typescript
{
  email: string
  userType: 'agency'
  companyName: string
  contactPerson?: string
  description?: string
  website?: string
  phone?: string
  address?: string
  logoUrl?: string
  verified: false
  isVerified: false
  verificationStatus: 'unverified'
  certifications: []
  ratings: []
  averageRating: 0
  totalRatings: 0
  jobsPosted: []
  status: 'active'
  createdAt: Date
  updatedAt: Date
}
```

### Job Hunter Profile Document

Created in `jobHunters/{userId}` collection:

```typescript
{
  email: string
  userType: 'jobhunter'
  firstName: string
  lastName: string
  phone?: string
  address?: string
  bio?: string
  dateOfBirth?: Date
  ageVerified?: boolean
  skills: []
  experience: []
  education: []
  certifications: []
  resume?: string
  profilePicture?: string
  status: 'active'
  createdAt: Date
  updatedAt: Date
}
```

### Admin Profile Document

Created in `admins/{userId}` collection:

```typescript
{
  email: string
  userType: 'admin'
  firstName: string
  lastName: string
  role: 'super_admin' | 'moderator'
  permissions: Permission[]
  status: 'active'
  createdAt: Date
  updatedAt: Date
}
```

## Security

### Authentication

All endpoints require:
- Valid admin session cookie
- Admin must be logged in
- Session verified via Firebase Admin SDK

### Authorization

Endpoints check for `MANAGE_USERS` permission:
- Super admins: Have all permissions automatically
- Moderators: Must explicitly have `MANAGE_USERS` permission

### Audit Logging

All repair operations are logged to `auditLogs` collection:

```typescript
{
  adminId: string
  adminName: string
  action: 'user_repaired'
  resourceType: 'user'
  resourceId: string
  details: {
    userType: string
    createdDocuments: string[]
    skippedDocuments: string[]
    email: string
  }
  timestamp: Date
  ipAddress: null
  userAgent: null
}
```

## Use Cases

### 1. Fix Specific Orphaned User

**Scenario:** User reports they can't access their account after signing up.

**Steps:**
1. Get user's email from support ticket
2. Navigate to `/admin/user-repair`
3. Enter email and diagnose
4. Click repair if user is orphaned
5. Inform user their account is fixed

### 2. Investigate Login Issues

**Scenario:** User can log in but sees blank pages or errors.

**Steps:**
1. Use diagnostic tool to check user's profile status
2. Review which documents exist/missing
3. Repair missing documents
4. Verify user can access features

### 3. Bulk Orphan Detection (Future Enhancement)

**Planned Feature:** Find all orphaned users in the system

**Implementation:** Create `/api/admin/find-orphaned-users` endpoint that:
- Lists all Firebase Auth users
- Checks each for Firestore documents
- Returns list of orphaned users
- Allows batch repair

### 4. Preventive Maintenance

**Scenario:** Regular system health checks

**Steps:**
1. Periodically scan for orphaned users
2. Generate reports of data inconsistencies
3. Proactively fix issues before users report them

## Troubleshooting

### Error: "Not authenticated"

**Cause:** No valid admin session cookie

**Solution:**
- Ensure you're logged in as an admin
- Clear browser cookies and log in again
- Check if session expired

### Error: "Unauthorized: MANAGE_USERS permission required"

**Cause:** Admin doesn't have required permission

**Solution:**
- Check admin's permissions in Firestore
- Super admins automatically have this permission
- Moderators need explicit `MANAGE_USERS` permission

### Error: "User not found in Firebase Authentication"

**Cause:** User doesn't exist in Auth, only email was provided

**Solution:**
- Verify email is correct
- Check Firebase Console Authentication tab
- User may have been deleted from Auth

### Error: "Internal server error"

**Cause:** Various backend issues

**Solution:**
- Check server console logs for details
- Verify Firebase Admin SDK is configured
- Check environment variables are set
- Review Firestore security rules

### User Still Not Appearing After Repair

**Possible Causes:**
1. Browser cache - Hard refresh the page (Ctrl+Shift+R)
2. Wrong user type - Check diagnostic results for detected user type
3. Firestore security rules blocking reads
4. Admin dashboard query filters excluding the user

**Solution:**
- Clear browser cache
- Verify documents exist in Firestore Console
- Check user's `status` field is 'active'
- Review admin dashboard query logic

## File Locations

```
job-agent-ph/
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── diagnose-user/
│   │       │   └── route.ts          # Diagnostic API
│   │       └── repair-user/
│   │           └── route.ts          # Repair API
│   └── (authenticated)/
│       └── admin/
│           └── user-repair/
│               └── page.tsx          # Admin UI
├── components/
│   └── layout/
│       └── AdminSidebar.tsx         # Navigation menu (includes User Repair link)
├── public/
│   └── test-repair.html             # Standalone HTML tool
└── lib/
    ├── firebase-admin.ts            # Admin SDK configuration
    ├── collections.ts               # Collection names
    └── permission-helpers.ts        # Permission checks
```

## Best Practices

### Before Running Repair

1. ✅ Always run diagnostic first
2. ✅ Review what documents are missing
3. ✅ Verify user type is correct
4. ✅ Check if user has Auth account
5. ✅ Note any existing documents (won't be overwritten)

### After Running Repair

1. ✅ Verify user appears in admin dashboard
2. ✅ Check both `users` and role-specific collections in Firestore
3. ✅ Test user can log in
4. ✅ Verify user can access app features
5. ✅ Review audit logs for the operation

### Safety Measures

- Repair is **idempotent** - safe to run multiple times
- Won't overwrite existing documents
- Logs all operations for audit trail
- Can be rolled back by deleting created documents

## Rollback Strategy

If repair creates incorrect data:

### Option 1: Manual Deletion

1. Go to Firebase Console → Firestore Database
2. Navigate to the affected collection
3. Delete the document(s)
4. Re-run repair with correct parameters

### Option 2: Use Permanent Delete Function

```typescript
import { permanentlyDeleteUser } from '@/lib/user-moderation-helpers';

await permanentlyDeleteUser(userId, adminId);
```

This removes documents from both base and role-specific collections.

### Option 3: Firestore Console

Delete documents directly from Firestore Console:
- `users/{userId}`
- `agencies/{userId}` or `jobHunters/{userId}` or `admins/{userId}`

**Note:** Firebase Auth user remains intact - you can retry repair with corrected data.

## Future Enhancements

### Planned Features

1. **Bulk Orphan Detection**
   - Scan all Auth users
   - Generate report of orphaned accounts
   - Batch repair capability

2. **Data Validation**
   - Verify profile completeness
   - Check for missing required fields
   - Suggest data corrections

3. **Migration Tools**
   - Import users from external systems
   - Sync with existing databases
   - Bulk user creation

4. **Monitoring Dashboard**
   - Real-time orphan detection
   - Alert on registration failures
   - Health check metrics

5. **Automated Recovery**
   - Auto-detect orphaned users
   - Queue for manual review
   - Scheduled cleanup jobs

## Support

### Getting Help

- Review this documentation
- Check server console logs
- Examine Firebase Console
- Review audit logs for repair history

### Reporting Issues

When reporting issues with the User Repair Tool, include:
1. User's email address
2. Diagnostic results (JSON output)
3. Error messages from console
4. Screenshots of the issue
5. Steps to reproduce

## Changelog

### Version 1.0.0 (2025-11-29)

**Initial Release:**
- Diagnostic API endpoint
- Repair API endpoint
- Admin UI interface
- Standalone HTML tool
- Navigation menu integration
- Audit logging
- Permission-based access control
- Support for all three user types (jobhunter, agency, admin)

**Case Study - First Success:**
- Fixed orphaned user: `exultantcreationsinc2018@gmail.com`
- User existed in Firebase Auth via Google OAuth
- Missing both `users` and `agencies` documents
- Successfully repaired and now visible in admin dashboard
- User can now receive messages and use platform features

## Conclusion

The User Repair Tool is now a permanent part of your administrative toolkit. Keep it accessible for:
- Quick troubleshooting of user issues
- Regular system health checks
- Preventive maintenance
- Supporting users who experience signup problems

Remember: This tool exists because registration can fail in various ways. Having a reliable repair mechanism ensures no user is left unable to access their account.
