# 🚀 Quick Security Reference Card

## ⚡ Quick Actions Needed Before Deployment

### 1️⃣ Revoke Old Firebase Keys (5 min)
```
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=jobs-agency-8f28b
2. Click: firebase-adminsdk-fbsvc@jobs-agency-8f28b.iam.gserviceaccount.com
3. Click: KEYS tab
4. Delete keys with IDs:
   - YOUR_PRIVATE_KEY_ID
   - 751d401a66e293597a747bb5a037dddcdffe0ec1
5. Keep only: b2af3cdb2cb3...
```

### 2️⃣ Generate New Gmail App Password (3 min)
```
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in as: contact@jobagentph.com
3. Delete old password for "JobAgentPH"
4. Create new:
   - App: Mail / Other (JobAgentPH Email Service)
   - Device: Other (JobAgentPH Production)
5. Copy the 16-character password
6. Update .env.local: GMAIL_APP_PASSWORD=<new-password>
```

### 3️⃣ Test Locally (2 min)
```bash
npm run dev
# Visit: http://localhost:3000/admin/register
# Test secret: YOUR_ADMIN_SECRET_KEY
```

### 4️⃣ Deploy (5 min)
```bash
npm run build
firebase deploy --only hosting
```

---

## 🔑 New Credentials Reference

### Admin Secret Key (Server-side ONLY)
```
YOUR_ADMIN_SECRET_KEY
```
**Usage:** Admin registration at `/admin/register`
**⚠️ Never use NEXT_PUBLIC_ prefix!**

### Firebase Service Account Key
```
Key ID: b2af3cdb2cb37dfe02f74bc025205c1c9176b6ae
Status: Active ✓
```
**Already configured in:**
- .env.local
- .env.production
- apphosting.yaml

### Gmail App Password
```
Status: ⚠️ NEEDS UPDATE
Old: hdtxupfvhyfphbkc (revoked)
New: [Generate following steps above]
```

---

## ✅ Security Verification Commands

### Check for old secrets:
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph

# Should return nothing:
grep -r "wTFuf7yrYxrWKPNToc7x3KF74bmsY3rSgHD9K6abpz8" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "hdtxupfvhyfphbkc" . --exclude-dir=node_modules --exclude-dir=.git
```

### Verify admin secret is server-side only:
```bash
# Should show ADMIN_SECRET_KEY (no NEXT_PUBLIC_ prefix):
grep "ADMIN_SECRET_KEY" .env.production
grep "ADMIN_SECRET_KEY" apphosting.yaml
```

### Test security headers:
```bash
# After deployment:
curl -I https://your-domain.com
# Should see: X-Frame-Options, CSP, HSTS, etc.
```

---

## 📋 Quick Deploy Checklist

Before running `firebase deploy`:

- [ ] Old Firebase keys deleted from Console
- [ ] New Gmail app password generated
- [ ] `.env.local` updated with new Gmail password
- [ ] Tested admin registration locally
- [ ] `npm run build` completes successfully
- [ ] No old secrets in codebase (grep check)

After deployment:

- [ ] Visit production URL and verify it loads
- [ ] Test admin registration in production
- [ ] Check Firebase Console for errors
- [ ] Verify security headers with curl
- [ ] Monitor Firebase usage for 24 hours

---

## 🆘 Emergency Contacts

- Firebase Console: https://console.firebase.google.com/project/jobs-agency-8f28b
- Security Issues: Review `SECURITY_CHECKLIST.md`
- Full Guide: See `FINAL_SECURITY_STEPS.md`

---

**⏱️ Total Time: ~15 minutes**
**📅 Next Review: Monthly (rotate admin secret)**