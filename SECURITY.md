# Security Guide - Job Agency PH

## 🚨 IMMEDIATE ACTIONS REQUIRED

### 1. Rotate Firebase Credentials
Your Firebase service account private key has been exposed in `.env.local`. You must:

1. **Go to Firebase Console** → Project Settings → Service Accounts
2. **Generate a new private key** (this will invalidate the old one)
3. **Update your `.env.local`** with the new credentials using the secure method below
4. **Never commit** `.env.local` to version control

### 2. Deploy Firebase Security Rules

The security rules have been created but need to be deployed to Firebase:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init

# Deploy security rules
firebase deploy --only firestore:rules,storage
```

---

## 🔐 Secure Environment Variable Setup

### For Local Development

Update your `.env.local` with individual fields (more secure):

```env
# Method 1 (Recommended): Individual fields
FIREBASE_PROJECT_ID=jobs-agency-8f28b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jobs-agency-8f28b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_NEW_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

**Important Notes:**
- The private key must be enclosed in double quotes
- Keep the `\n` characters in the key
- Remove the old `FIREBASE_SERVICE_ACCOUNT_KEY` variable

### For Production (Vercel, Netlify, etc.)

#### Option A: Individual Environment Variables
Set these in your hosting platform's environment variable settings:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

#### Option B: Base64 Encoded Service Account
1. Download your service account JSON file
2. Encode it to base64:
   ```bash
   # On Linux/Mac
   cat service-account.json | base64 -w 0

   # On Windows (PowerShell)
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
   ```
3. Set `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in your hosting platform

---

## 🛡️ Security Features Implemented

### 1. Firestore Security Rules
✅ User authentication required for most operations
✅ Role-based access control (Job Hunter vs Agency)
✅ Data validation (string lengths, email formats, etc.)
✅ Owner-only operations for profile updates
✅ Verified agencies only can post jobs
✅ Prevents privilege escalation (self-verification)

**Location:** `firestore.rules`

### 2. Storage Security Rules
✅ File type validation (PDFs, images only)
✅ File size limits (5MB for images, 10MB for resumes)
✅ User-owned file uploads and deletions
✅ Public read for company logos and job images
✅ Private resumes (authenticated users only)

**Location:** `storage.rules`

### 3. Input Validation Library
✅ Email validation
✅ Phone number validation
✅ String sanitization (XSS prevention)
✅ HTML sanitization
✅ File upload validation
✅ Password strength checking
✅ Rate limiting (basic implementation)

**Location:** `lib/validation.ts`

---

## 📋 Security Checklist

### Before Deploying to Production

- [ ] Rotate Firebase service account key
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Set up environment variables securely on hosting platform
- [ ] Remove `.env.local` from version control (already in `.gitignore`)
- [ ] Enable Firebase Authentication email verification
- [ ] Set up HTTPS only (most hosting platforms do this automatically)
- [ ] Configure CORS for Firebase Storage
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable Firebase App Check (prevents API abuse)
- [ ] Review and test all security rules
- [ ] Implement rate limiting on API routes
- [ ] Set up automated security scanning (Dependabot, Snyk)

### Optional but Recommended

- [ ] Enable 2FA for Firebase Console access
- [ ] Set up Firebase Performance Monitoring
- [ ] Configure Firebase Analytics with privacy settings
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Add security headers (X-Frame-Options, etc.)
- [ ] Set up automated backups for Firestore
- [ ] Implement audit logging for critical operations
- [ ] Add CAPTCHA for signup/login forms
- [ ] Enable Firebase Authentication rate limiting

---

## 🔍 Using the Validation Library

### Example: Validating Job Posting

```typescript
import {
  validateJobTitle,
  validateJobDescription,
  validateSalaryRange,
  validateSkills
} from '@/lib/validation';

// In your job posting form
const titleValidation = validateJobTitle(jobTitle);
if (!titleValidation.valid) {
  console.error(titleValidation.error);
  return;
}

const descValidation = validateJobDescription(description);
if (!descValidation.valid) {
  console.error(descValidation.error);
  return;
}

const salaryValidation = validateSalaryRange(salaryMin, salaryMax);
if (!salaryValidation.valid) {
  console.error(salaryValidation.error);
  return;
}

const skillsValidation = validateSkills(skills);
if (!skillsValidation.valid) {
  console.error(skillsValidation.error);
  return;
}

// Use sanitized values
const sanitizedData = {
  title: titleValidation.sanitized,
  description: descValidation.sanitized,
  skills: skillsValidation.sanitized,
  // ... other fields
};
```

### Example: File Upload Validation

```typescript
import { validateFile } from '@/lib/validation';

const fileValidation = validateFile(resumeFile, {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf'],
  allowedExtensions: ['.pdf']
});

if (!fileValidation.valid) {
  alert(fileValidation.error);
  return;
}
```

### Example: Rate Limiting

```typescript
import { checkRateLimit } from '@/lib/validation';

// In your API route or form submission
const rateLimit = checkRateLimit(
  `login:${email}`,
  5,  // max 5 attempts
  300000  // per 5 minutes
);

if (!rateLimit.allowed) {
  const waitTime = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
  alert(`Too many attempts. Please try again in ${waitTime} seconds.`);
  return;
}
```

---

## 🚫 Common Vulnerabilities to Avoid

### 1. Never Trust Client-Side Data
❌ **Bad:**
```typescript
// Trusting user input directly
await createJob({ title: userInput });
```

✅ **Good:**
```typescript
const validation = validateJobTitle(userInput);
if (!validation.valid) throw new Error(validation.error);
await createJob({ title: validation.sanitized });
```

### 2. Never Expose Sensitive Data in Error Messages
❌ **Bad:**
```typescript
catch (error) {
  alert(`Database error: ${error.message}`);
}
```

✅ **Good:**
```typescript
catch (error) {
  console.error('Database error:', error);
  alert('An error occurred. Please try again later.');
}
```

### 3. Never Allow Unauthenticated File Uploads
❌ **Bad:**
```typescript
// No auth check before upload
const uploadResume = async (file) => {
  return await storage.ref(`resumes/${file.name}`).put(file);
};
```

✅ **Good:**
```typescript
const uploadResume = async (file) => {
  if (!currentUser) throw new Error('Authentication required');
  const validation = validateFile(file);
  if (!validation.valid) throw new Error(validation.error);
  return await storage.ref(`resumes/${currentUser.uid}/${file.name}`).put(file);
};
```

---

## 📞 Security Incident Response

If you discover a security vulnerability:

1. **Do not** disclose it publicly
2. Immediately revoke compromised credentials
3. Review audit logs for suspicious activity
4. Update security rules if needed
5. Notify affected users if data was compromised
6. Document the incident and response

---

## 🔗 Additional Resources

- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/security-headers)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---

**Last Updated:** 2025-10-23
**Next Review:** Schedule quarterly security audits
