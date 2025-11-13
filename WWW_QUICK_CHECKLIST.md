# www.jobagentph.com - Quick Setup Checklist

## ✅ Phase 1: Configuration (COMPLETE)
- [x] Updated .env.local with www domain
- [x] Updated .env.production with www domain
- [x] Set NEXT_PUBLIC_APP_URL=https://www.jobagentph.com
- [x] Set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=www.jobagentph.com

---

## 📋 Phase 2: Firebase Console Setup

### A. Add Custom Domain (5 min)
- [ ] Go to [Firebase Hosting](https://console.firebase.google.com/project/jobs-agency-8f28b/hosting)
- [ ] Click "Add custom domain"
- [ ] Enter: **www.jobagentph.com** (with www!)
- [ ] Click Continue
- [ ] Copy DNS records (keep page open)

**DNS Records to copy:**
```
Record 1: ______________________
Type: _____ Name: _____ Content: _____

Record 2: ______________________
Type: _____ Name: _____ Content: _____
```

### B. Add Authorized Domains (2 min)
- [ ] Go to [Firebase Auth Settings](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
- [ ] Click "Add domain"
- [ ] Add: **www.jobagentph.com**
- [ ] Click "Add domain" again
- [ ] Add: **jobagentph.com** (for redirect)
- [ ] Save

---

## 🌐 Phase 3: Cloudflare DNS Setup

### A. Access Cloudflare (2 min)
- [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
- [ ] Select: **jobagentph.com**
- [ ] Navigate to: **DNS > Records**

### B. Add DNS Records for WWW (3 min)

**Record 1 - WWW (Primary):**
- [ ] Click "Add record"
- [ ] Type: _____ (from Firebase)
- [ ] Name: **www**
- [ ] Content: _____ (from Firebase)
- [ ] Proxy status: **DNS only (grey cloud)** ⚠️ IMPORTANT
- [ ] TTL: Auto
- [ ] Save

**Record 2 - Root (For Redirect):**
- [ ] Click "Add record"
- [ ] Type: **A**
- [ ] Name: **@**
- [ ] Content: _____ (from Firebase or use 192.0.2.1)
- [ ] Proxy status: **Proxied (orange cloud)** ✓
- [ ] TTL: Auto
- [ ] Save

**Record 3 - TXT (Verification):**
- [ ] Click "Add record"
- [ ] Type: **TXT**
- [ ] Name: **www** or **@**
- [ ] Content: _____ (verification code from Firebase)
- [ ] TTL: Auto
- [ ] Save

### C. Set Up Redirect (Non-WWW → WWW) (3 min)

**Option 1: Page Rules (Classic)**
- [ ] Go to: **Rules > Page Rules**
- [ ] Click "Create Page Rule"
- [ ] URL pattern: `jobagentph.com/*`
- [ ] Click "Add a Setting"
- [ ] Select: **Forwarding URL**
- [ ] Status Code: **301 - Permanent Redirect**
- [ ] Destination URL: `https://www.jobagentph.com/$1`
- [ ] Save and Deploy

**Option 2: Redirect Rules (New - Recommended)**
- [ ] Go to: **Rules > Redirect Rules**
- [ ] Click "Create rule"
- [ ] Rule name: "Redirect to www"
- [ ] When incoming requests match:
  - Field: **Hostname**
  - Operator: **equals**
  - Value: `jobagentph.com`
- [ ] Then:
  - Type: **Dynamic**
  - Expression: `concat("https://www.", http.request.uri.path)`
  - Status code: **301**
- [ ] Save and Deploy

### D. Configure SSL/TLS (2 min)
- [ ] Go to: **SSL/TLS > Overview**
- [ ] Encryption mode: **Full**
- [ ] Go to: **SSL/TLS > Edge Certificates**
- [ ] Enable: **Always Use HTTPS** ✓
- [ ] Enable: **Automatic HTTPS Rewrites** ✓

---

## 🚀 Phase 4: Deployment

### Build and Deploy (5 min)
- [ ] Open terminal/command prompt
- [ ] Navigate to project:
  ```bash
  cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
  ```
- [ ] Build project:
  ```bash
  npm run build
  ```
- [ ] Deploy to Firebase:
  ```bash
  npm run deploy
  ```
- [ ] Wait for deployment to complete
- [ ] Note deployment URL and time

---

## ⏱️ Phase 5: Wait for DNS Propagation (15-30 min)

### Check DNS Status
- [ ] Wait 5 minutes after adding DNS records
- [ ] Check with command:
  ```bash
  nslookup www.jobagentph.com
  ```
- [ ] Should return IP address from Firebase
- [ ] Check online: [DNS Checker](https://dnschecker.org)
- [ ] Enter: www.jobagentph.com
- [ ] Wait until all regions show green

### Verify Domain in Firebase
- [ ] Go back to Firebase Hosting page
- [ ] Click "Verify" button
- [ ] Wait for verification (can take 5-30 minutes)
- [ ] Once verified, SSL certificate will be auto-provisioned

---

## ✅ Phase 6: Testing

### Primary Domain Tests (WWW)
- [ ] Visit: https://www.jobagentph.com
- [ ] Site loads correctly ✓
- [ ] SSL certificate valid (green lock) ✓
- [ ] Address bar shows: `https://www.jobagentph.com` ✓

### Redirect Tests (Non-WWW → WWW)
- [ ] Visit: http://jobagentph.com
  - Should redirect to: https://www.jobagentph.com ✓
- [ ] Visit: https://jobagentph.com
  - Should redirect to: https://www.jobagentph.com ✓
- [ ] Visit: http://www.jobagentph.com
  - Should redirect to: https://www.jobagentph.com ✓

### Functionality Tests
- [ ] Homepage loads ✓
- [ ] Navigation works ✓
- [ ] Job listings display ✓
- [ ] Search works ✓
- [ ] Login page accessible ✓
- [ ] Can sign up ✓
- [ ] Can log in ✓
- [ ] Profile page works (when logged in) ✓
- [ ] Image uploads work ✓

### Browser Tests
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari (if available) ✓
- [ ] Edge ✓
- [ ] Mobile browser ✓

### Performance Check
- [ ] No console errors ✓
- [ ] Images load correctly ✓
- [ ] Page loads fast ✓
- [ ] No redirect loops ✓

---

## 🎯 Phase 7: Final Verification

### URL Display Check
- [ ] Type `jobagentph.com` in browser
- [ ] Browser shows: `https://www.jobagentph.com` ✓
- [ ] Type `www.jobagentph.com` in browser
- [ ] Browser shows: `https://www.jobagentph.com` ✓

### SSL Certificate Check
- [ ] Click lock icon in address bar
- [ ] Certificate is valid ✓
- [ ] Issued by: Google Trust Services ✓
- [ ] Domain matches: www.jobagentph.com ✓

### Firebase Console Check
- [ ] Firebase Hosting shows domain as "Connected" ✓
- [ ] SSL status: "Active" ✓
- [ ] Last deployment successful ✓

---

## 🎉 DONE!

When all items are checked:
- [ ] All tests passing
- [ ] WWW domain working
- [ ] Redirects working
- [ ] SSL certificate valid
- [ ] Ready to announce! 🎊

---

## 📞 Quick Help

**Issue: Redirect loop**
→ Check Cloudflare SSL mode is "Full"
→ Ensure www DNS is "DNS only" (grey cloud)

**Issue: Not redirecting**
→ Verify Page Rule or Redirect Rule is active
→ Wait 5 minutes for rule to propagate

**Issue: Auth error**
→ Check both domains in Firebase Authorized Domains
→ Redeploy: `npm run deploy`

**Issue: DNS not resolving**
→ Wait longer (up to 48 hours max)
→ Check Cloudflare DNS records are correct
→ Verify TXT record for verification

---

## 📄 Detailed Guides

- [WWW_DOMAIN_SETUP.md](WWW_DOMAIN_SETUP.md) - Complete setup guide
- [WWW_SETUP_SUMMARY.md](WWW_SETUP_SUMMARY.md) - Quick summary
- [FIREBASE_CUSTOM_DOMAIN_SETUP.md](FIREBASE_CUSTOM_DOMAIN_SETUP.md) - Firebase details

---

## ⏰ Timeline Tracker

- Configuration: ✅ Complete (2025-11-13)
- Firebase Setup: ⏳ Pending (Date: _____)
- DNS Configuration: ⏳ Pending (Date: _____)
- Redirect Setup: ⏳ Pending (Date: _____)
- Deployment: ⏳ Pending (Date: _____)
- DNS Propagation: ⏳ Pending (Date: _____)
- Testing: ⏳ Pending (Date: _____)
- **GO LIVE**: ⏳ Pending (Date: _____)

**Expected Total Time**: 20-50 minutes

---

**Domain**: www.jobagentph.com
**Browser Will Show**: `https://www.jobagentph.com`
**Status**: Configured - Ready for setup
**Last Updated**: 2025-11-13
