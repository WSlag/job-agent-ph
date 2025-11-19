# 🔐 Final Security Steps Before Deployment

## ⚠️ CRITICAL: Complete These Steps Before Going Live

**Estimated Time:** 30-45 minutes
**Required Access:** Firebase Console, Google Account Settings

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting, ensure you have:
- [ ] Access to Firebase Console (https://console.firebase.google.com)
- [ ] Access to your Google Account (contact@jobagentph.com)
- [ ] Firebase CLI installed and logged in
- [ ] Code changes committed to git
- [ ] Backup of all current credentials (just in case)

---

## STEP 1: REVOKE OLD FIREBASE SERVICE ACCOUNT KEYS (15 minutes)

### Why This Is Critical
The old Firebase service account keys were exposed in git history. Anyone with these keys has **full admin access** to your Firebase project. You must revoke them immediately.

### Instructions

#### 1.1 Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Sign in with your Google account
3. Select your project: **jobs-agency-8f28b**

#### 1.2 Navigate to Service Accounts
1. Click the **⚙️ Settings** icon (top left)
2. Click **Project Settings**
3. Click the **Service Accounts** tab
4. You should see: `firebase-adminsdk-fbsvc@jobs-agency-8f28b.iam.gserviceaccount.com`

#### 1.3 View Existing Keys
1. Click **Manage service account keys in Google Cloud Console**
   (This will open a new tab to Google Cloud Console)
2. Or directly go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=jobs-agency-8f28b

#### 1.4 Identify and Delete Old Keys
Look for these **COMPROMISED** key IDs that must be deleted:

**🔴 DELETE THESE KEYS:**
- Key ID: `YOUR_PRIVATE_KEY_ID`
- Key ID: `751d401a66e293597a747bb5a037dddcdffe0ec1`

**How to Delete:**
1. Click on the service account email: `firebase-adminsdk-fbsvc@jobs-agency-8f28b.iam.gserviceaccount.com`
2. Click the **KEYS** tab
3. For each old key:
   - Find the key by its ID (first 8 characters are shown)
   - Click the **⋮** (three dots) menu
   - Click **Delete**
   - Confirm the deletion

#### 1.5 Verify New Key Is Active
Look for the **NEW** key (keep this one):
- Key ID: `b2af3cdb2cb37dfe02f74bc025205c1c9176b6ae`
- Created: Recently (today's date)
- Status: Active ✓

**✅ Checkpoint:** You should now have only ONE active key (the new one).

---

## STEP 2: GENERATE NEW GMAIL APP PASSWORD (10 minutes)

### Why This Is Critical
Your Gmail app password `hdtxupfvhyfphbkc` was exposed in `.env.local`. While this file isn't committed to git, it's best practice to rotate this credential.

### Instructions

#### 2.1 Access Google Account Security
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with: **contact@jobagentph.com**
3. You may need to verify your identity

#### 2.2 Revoke Old App Password
1. Look for existing app passwords in the list
2. Find the one used for "job-agent-ph" or "JobAgentPH"
3. Click **Delete** or the **X** icon next to it
4. Confirm deletion

**Note:** If you don't see the old password listed, it may have already been deleted or created without a name.

#### 2.3 Generate New App Password
1. Click **Select app** dropdown
2. Choose **Mail** (or "Other (custom name)")
3. If you chose "Other", enter: **JobAgentPH Email Service**
4. Click **Select device** dropdown
5. Choose **Other (custom name)**
6. Enter: **JobAgentPH Production Server**
7. Click **Generate**

#### 2.4 Save the New Password
You'll see a 16-character password like: `abcd efgh ijkl mnop`

**IMPORTANT:** Copy this password immediately! You won't be able to see it again.

```
New Gmail App Password: ____ ____ ____ ____
(Write it here temporarily, then delete after updating files)
```

#### 2.5 Update Environment Variables

**Update `.env.local`:**
```bash
# Open the file
code c:\Users\HP\Desktop\jobAgency\job-agent-ph\.env.local

# Find this line:
GMAIL_APP_PASSWORD=hdtxupfvhyfphbkc

# Replace with (remove spaces):
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**If deploying to Firebase App Hosting, update `apphosting.yaml`:**
```bash
# Add this variable to the file
  - variable: GMAIL_APP_PASSWORD
    value: abcdefghijklmnop
```

**If using Firebase Functions, update functions config:**
```bash
firebase functions:config:set gmail.password="abcdefghijklmnop"
```

**✅ Checkpoint:** Gmail app password is rotated and updated in environment files.

---

## STEP 3: VERIFY CREDENTIALS ARE UPDATED (5 minutes)

### 3.1 Check All Environment Files

Run these commands to verify credentials are correct:

```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph

# Check .env.local
echo "Checking .env.local..."
grep "ADMIN_SECRET_KEY" .env.local
# Should show: ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY

# Check .env.production
echo "Checking .env.production..."
grep "ADMIN_SECRET_KEY" .env.production
# Should show: ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY
# Should NOT show: NEXT_PUBLIC_ADMIN_SECRET_KEY

# Check apphosting.yaml
echo "Checking apphosting.yaml..."
grep "ADMIN_SECRET_KEY" apphosting.yaml
# Should show: ADMIN_SECRET_KEY with new value (no NEXT_PUBLIC_ prefix)
```

### 3.2 Verify No Old Secrets Remain

```bash
# Search for old admin secret (should find nothing)
grep -r "wTFuf7yrYxrWKPNToc7x3KF74bmsY3rSgHD9K6abpz8" . --exclude-dir=node_modules --exclude-dir=.git

# Search for old Gmail password (should find nothing)
grep -r "hdtxupfvhyfphbkc" . --exclude-dir=node_modules --exclude-dir=.git
```

**✅ Checkpoint:** No old credentials found in codebase.

---

## STEP 4: TEST LOCALLY WITH NEW CREDENTIALS (10 minutes)

### 4.1 Clear Cache and Rebuild
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph

# Clear Next.js cache
rm -rf .next

# Rebuild with new credentials
npm run build
```

### 4.2 Test Critical Features

**Start Development Server:**
```bash
npm run dev
```

**Test Checklist:**

1. **Firebase Connection** (http://localhost:3000)
   - [ ] Homepage loads without errors
   - [ ] Check browser console for Firebase errors
   - [ ] No authentication errors

2. **Admin Registration** (http://localhost:3000/admin/register)
   - [ ] Enter the new admin secret: `YOUR_ADMIN_SECRET_KEY`
   - [ ] Click "Verify Secret"
   - [ ] Should show: "Secret key validated successfully!"
   - [ ] **If it fails, stop here and troubleshoot**

3. **Email Functionality** (http://localhost:3000/contact)
   - [ ] Submit contact form
   - [ ] Check if email is sent successfully
   - [ ] Verify no Gmail authentication errors

4. **Authentication Flow**
   - [ ] Try signing up a new user
   - [ ] Try logging in
   - [ ] Check session cookie is set

**✅ Checkpoint:** All critical features work with new credentials.

---

## STEP 5: COMMIT CREDENTIAL UPDATES (Optional)

**⚠️ WARNING:** Only commit non-secret files!

```bash
# If you updated apphosting.yaml with Gmail password
git add apphosting.yaml
git commit -m "Security: Update Gmail app password in apphosting.yaml"
git push origin main

# DO NOT COMMIT .env.local or .env.production
```

---

## STEP 6: DEPLOY TO FIREBASE HOSTING (15 minutes)

### 6.1 Build for Production
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph

# Build production bundle
npm run build
```

**Expected Output:**
```
✓ Compiled successfully in 55s
✓ Generating static pages (36/36)
```

### 6.2 Deploy to Firebase Hosting
```bash
# Deploy hosting only (first time)
firebase deploy --only hosting

# Or deploy everything (hosting + rules)
firebase deploy
```

**Expected Output:**
```
✓ Deploy complete!
Project Console: https://console.firebase.google.com/project/jobs-agency-8f28b/overview
Hosting URL: https://jobs-agency-8f28b.web.app
```

### 6.3 Verify Deployment

**Check Hosting URL:**
1. Open: https://jobs-agency-8f28b.web.app (or your custom domain)
2. Verify homepage loads
3. Check browser console for errors

**Test Security Headers:**
```bash
curl -I https://jobs-agency-8f28b.web.app
```

**Should see these headers:**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: ...
```

**✅ Checkpoint:** Application is live and secure!

---

## STEP 7: POST-DEPLOYMENT VERIFICATION (10 minutes)

### 7.1 Test Production Admin Registration
1. Go to: https://your-domain.com/admin/register
2. Enter new admin secret: `YOUR_ADMIN_SECRET_KEY`
3. Verify it works via server-side validation

### 7.2 Check Firebase Logs
1. Open Firebase Console: https://console.firebase.google.com/project/jobs-agency-8f28b/overview
2. Go to **Firestore Database** → **Usage** tab
3. Look for unusual spikes (indicates unauthorized access)
4. Go to **Authentication** → **Users**
5. Verify no unknown user accounts

### 7.3 Monitor for Security Issues

**First 24 Hours:**
- [ ] Check Firebase usage every 6 hours
- [ ] Monitor error logs in Firebase Console
- [ ] Watch for failed authentication attempts
- [ ] Check rate limiting is working

**First Week:**
- [ ] Daily Firebase usage checks
- [ ] Review audit logs
- [ ] Monitor costs for anomalies

---

## 🎯 FINAL SECURITY CHECKLIST

Before considering deployment complete:

### Firebase Security
- [ ] Old service account keys deleted from Firebase Console
- [ ] Only new key (b2af3cdb2cb3...) is active
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] No unauthorized users in Authentication

### Credentials
- [ ] Old admin secret rotated (new: YOUR_ADMIN_SECRET_KEY)
- [ ] Old Gmail app password revoked
- [ ] New Gmail app password generated and tested
- [ ] All .env files updated with new credentials
- [ ] apphosting.yaml updated with new credentials

### Code Security
- [ ] Admin secret has NO `NEXT_PUBLIC_` prefix
- [ ] Server-side validation working via `/api/admin/validate-secret`
- [ ] No old secrets in codebase (verified with grep)
- [ ] Production build successful
- [ ] No secrets in .next/static/ folder

### Deployment
- [ ] Application deployed to Firebase Hosting
- [ ] Security headers verified with curl
- [ ] Admin registration tested in production
- [ ] Email functionality working
- [ ] Rate limiting active on auth endpoints

### Monitoring
- [ ] Firebase audit logs reviewed
- [ ] No suspicious activity detected
- [ ] Error monitoring configured
- [ ] Usage alerts set up

---

## ⚠️ IMPORTANT REMINDERS

### Never Commit These Files:
- `.env.local` ❌
- `.env.production` ❌
- `serviceAccountKey.json` ❌
- `firebase-service-account.json` ❌
- Any file with actual credentials ❌

### Always Use Environment Variables:
- ✅ Server-side: `ADMIN_SECRET_KEY`, `FIREBASE_PRIVATE_KEY`, `GMAIL_APP_PASSWORD`
- ✅ Client-side: `NEXT_PUBLIC_FIREBASE_API_KEY` (public, safe to expose)

### Security Best Practices:
- 🔄 Rotate admin secret monthly
- 🔄 Rotate Firebase keys quarterly
- 📊 Monitor Firebase usage daily
- 🔍 Review audit logs weekly
- 🛡️ Keep security dependencies updated

---

## 🆘 TROUBLESHOOTING

### Issue: Admin Secret Validation Fails

**Symptoms:** "Invalid secret key" error in production

**Solutions:**
1. Verify `ADMIN_SECRET_KEY` is set in `apphosting.yaml` (no NEXT_PUBLIC_ prefix)
2. Check Firebase App Hosting environment variables
3. Redeploy with `firebase deploy`
4. Clear browser cache and try again

### Issue: Firebase Authentication Errors

**Symptoms:** "Permission denied" or "Invalid credentials"

**Solutions:**
1. Verify new Firebase private key is correctly set
2. Check Firebase Console → Service Accounts → Keys
3. Ensure only new key (b2af3cdb2cb3...) is active
4. Redeploy application

### Issue: Email Not Sending

**Symptoms:** Contact form fails, no emails received

**Solutions:**
1. Verify new Gmail app password is correct (no spaces)
2. Check Gmail account hasn't locked the app password
3. Test with: `npm run dev` locally first
4. Check Firebase Functions logs for errors

### Issue: Rate Limiting Too Strict

**Symptoms:** Users getting "Too many requests" error

**Solutions:**
1. Review rate limits in `lib/rate-limit.ts`
2. Adjust limits based on actual usage
3. Consider implementing Redis for distributed rate limiting
4. Add IP whitelist for known services

---

## 📞 SUPPORT CONTACTS

- **Firebase Support:** https://firebase.google.com/support
- **Google Account Issues:** https://support.google.com/accounts
- **Security Concerns:** Document in `SECURITY.md` and act immediately

---

## ✅ COMPLETION CONFIRMATION

Once you've completed all steps:

```bash
# Create a deployment record
echo "Deployment Date: $(date)" > LAST_DEPLOYMENT.txt
echo "Admin Secret: YOUR_ADMIN_SECRET_KEY" >> LAST_DEPLOYMENT.txt
echo "Firebase Key ID: b2af3cdb2cb3..." >> LAST_DEPLOYMENT.txt
echo "All security steps completed: YES" >> LAST_DEPLOYMENT.txt
```

**🎉 CONGRATULATIONS!** Your application is now securely deployed to Firebase Hosting!

---

**Document Version:** 1.0
**Last Updated:** November 19, 2025
**Next Security Review:** December 19, 2025