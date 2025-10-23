# 🔒 SECURITY TODO - CRITICAL FOR PRODUCTION

## ⚠️ URGENT: Firestore Security Rules Need to be Tightened

**Current Status:** The Firestore rules for the `jobs` collection are WIDE OPEN for development.

**Current Rule (TEMPORARY - DO NOT USE IN PRODUCTION):**
```javascript
// Jobs collection
match /jobs/{jobId} {
  // TEMPORARY: Wide open for debugging - MUST RESTRICT LATER
  allow read, write: if isAuthenticated();
}
```

---

## 📋 Required Changes Before Production

### 1. **Restore Proper Authentication Checks**
Change from `isAuthenticated()` to `isAgency()` to ensure only agencies can create jobs.

### 2. **Add Field Validation**
Restore validation for:
- ✅ Required fields: `title`, `description`, `companyName`, `agencyId`, `location`, `country`, `locationType`, `jobType`, `currency`, `experienceRequired`, `skills`, `postedAt`, `isActive`
- ✅ String length validation for `title` (3-200), `description` (10-10000), `companyName` (2-200)
- ✅ Job type enum: `['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']`
- ✅ Location type enum: `['On-site', 'Remote', 'Hybrid']`
- ✅ Salary range validation (if provided): min >= 0, max <= 10,000,000
- ✅ Experience required: 0-50 years
- ✅ Skills array: size 0-50

### 3. **Add Ownership Checks**
- Only the agency that created a job can update/delete it
- Verify `agencyId == request.auth.uid`

### 4. **Prevent Unauthorized Modifications**
- Prevent changing `agencyId` after creation
- Prevent changing `createdAt` timestamp

---

## 📝 Recommended Secure Rule (Copy this when ready)

```javascript
// Jobs collection
match /jobs/{jobId} {
  // Anyone can read active jobs
  allow read: if true;

  // Only verified agencies can create jobs
  allow create: if isAgency() &&
                  request.resource.data.keys().hasAll([
                    'title', 'description', 'companyName', 'agencyId', 'location',
                    'country', 'locationType', 'jobType', 'currency',
                    'experienceRequired', 'skills', 'postedAt', 'isActive'
                  ]) &&
                  request.resource.data.agencyId == request.auth.uid &&
                  validateStringLength(request.resource.data.title, 3, 200) &&
                  validateStringLength(request.resource.data.description, 10, 10000) &&
                  validateStringLength(request.resource.data.companyName, 2, 200) &&
                  request.resource.data.jobType in ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'] &&
                  request.resource.data.locationType in ['On-site', 'Remote', 'Hybrid'] &&
                  // Salary fields are optional, validate only if present
                  (!request.resource.data.keys().hasAny(['salaryMin']) ||
                   (request.resource.data.salaryMin is number && request.resource.data.salaryMin >= 0)) &&
                  (!request.resource.data.keys().hasAny(['salaryMax']) ||
                   (request.resource.data.salaryMax is number && request.resource.data.salaryMax >= 0 && request.resource.data.salaryMax <= 10000000)) &&
                  request.resource.data.experienceRequired is number &&
                  request.resource.data.experienceRequired >= 0 &&
                  request.resource.data.experienceRequired <= 50 &&
                  request.resource.data.skills is list &&
                  request.resource.data.skills.size() >= 0 &&
                  request.resource.data.skills.size() <= 50 &&
                  request.resource.data.postedAt is timestamp &&
                  request.resource.data.isActive is bool;

  // Only the agency that posted the job can update it
  allow update: if isAgency() &&
                  resource.data.agencyId == request.auth.uid &&
                  // Prevent changing agencyId
                  request.resource.data.agencyId == resource.data.agencyId;

  // Only the agency that posted the job can delete it
  allow delete: if isAgency() &&
                  resource.data.agencyId == request.auth.uid;
}
```

---

## 🚀 How to Deploy Secure Rules

1. **Open** `firestore.rules` file
2. **Replace** the jobs collection rule with the secure version above
3. **Test locally** if possible
4. **Deploy** with: `firebase deploy --only firestore:rules`
5. **Verify** in Firebase Console that rules are active

---

## ⏰ Timeline

- **Development/Testing:** Current wide-open rules are OK
- **Before Production:** MUST implement secure rules
- **Before Public Launch:** CRITICAL - Do not skip this step!

---

## 📚 Additional Security Considerations

1. **User Setup:** Ensure all users have proper documents in `/users/` collection with `userType` field
2. **Agency Verification:** Consider implementing agency verification workflow
3. **Rate Limiting:** Consider adding rate limits on job creation
4. **Input Sanitization:** Ensure all user inputs are sanitized on the client side
5. **Storage Rules:** Current storage rules are secure, but review them periodically

---

## 🔗 Related Files

- Firestore Rules: `firestore.rules`
- Storage Rules: `storage.rules`
- Job Helpers: `lib/job-helpers.ts`
- Firestore Helpers: `lib/firestore-helpers.ts`

---

**Last Updated:** 2025-10-23
**Status:** ⚠️ TEMPORARY DEVELOPMENT RULES ACTIVE
**Action Required:** Yes, before production deployment

