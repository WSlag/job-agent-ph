# Domain Setup Checklist for jobagentph.com

## Phase 1: Configuration (COMPLETED ✅)

- [x] Update environment variables with production domain
- [x] Create `.env.production` file
- [x] Configure `next.config.ts` for static export
- [x] Update `firebase.json` with hosting configuration
- [x] Add deployment scripts to `package.json`
- [x] Update `.gitignore` to protect sensitive files
- [x] Create setup documentation

---

## Phase 2: Firebase Console Setup (TODO)

### A. Add Custom Domain
- [ ] Go to [Firebase Hosting](https://console.firebase.google.com/project/jobs-agency-8f28b/hosting)
- [ ] Click "Add custom domain"
- [ ] Enter: `jobagentph.com`
- [ ] Click "Continue"
- [ ] Copy DNS records provided by Firebase
- [ ] Keep this page open for verification later

### B. Add Authorized Domains for Firebase Auth
- [ ] Go to [Firebase Authentication](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
- [ ] Scroll to "Authorized domains"
- [ ] Click "Add domain"
- [ ] Add: `jobagentph.com`
- [ ] Click "Add domain" again
- [ ] Add: `www.jobagentph.com`
- [ ] Save changes

---

## Phase 3: Cloudflare DNS Configuration (TODO)

### A. Access Cloudflare Dashboard
- [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
- [ ] Select domain: `jobagentph.com`
- [ ] Navigate to: DNS > Records

### B. Add DNS Records (From Firebase)
- [ ] Add A or CNAME record for root domain (@)
  - Type: _________ (from Firebase)
  - Name: @
  - Content: _________ (from Firebase)
  - Proxy status: **DNS only** (grey cloud) ⚠️ IMPORTANT
  - TTL: Auto

- [ ] Add TXT record for domain verification
  - Type: TXT
  - Name: @
  - Content: _________ (verification code from Firebase)
  - TTL: Auto

- [ ] Add CNAME record for www subdomain (optional)
  - Type: CNAME
  - Name: www
  - Content: jobagentph.com
  - Proxy status: **DNS only** (grey cloud)
  - TTL: Auto

### C. Cloudflare SSL/TLS Settings
- [ ] Go to: SSL/TLS > Overview
- [ ] Set encryption mode to: **Full** (not Full Strict)
- [ ] Go to: SSL/TLS > Edge Certificates
- [ ] Enable: **Always Use HTTPS**
- [ ] Enable: **Automatic HTTPS Rewrites**

### D. Optional: Page Rules for Redirect
- [ ] Go to: Rules > Page Rules
- [ ] Create page rule:
  - URL pattern: `www.jobagentph.com/*`
  - Setting: Forwarding URL (301 - Permanent Redirect)
  - Destination: `https://jobagentph.com/$1`
- [ ] Save and Deploy

---

## Phase 4: Domain Verification (TODO)

- [ ] Wait 5-10 minutes for DNS propagation
- [ ] Go back to Firebase Hosting page
- [ ] Click "Verify" button
- [ ] Wait for Firebase to verify domain ownership
- [ ] Check verification status (can take up to 30 minutes)
- [ ] Wait for SSL certificate provisioning (automatic)

### Check DNS Propagation:
```bash
nslookup jobagentph.com
```

Or use online tools:
- [ ] Check on [DNS Checker](https://dnschecker.org)
- [ ] Check on [What's My DNS](https://www.whatsmydns.net)

---

## Phase 5: Deployment (TODO)

### A. Build and Deploy
- [ ] Open terminal/command prompt
- [ ] Navigate to project directory:
  ```bash
  cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
  ```
- [ ] Build the project:
  ```bash
  npm run build
  ```
- [ ] Deploy to Firebase:
  ```bash
  firebase deploy --only hosting
  ```
  Or use the shortcut:
  ```bash
  npm run deploy
  ```

### B. Monitor Deployment
- [ ] Wait for deployment to complete
- [ ] Check Firebase Console for deployment status
- [ ] Note deployment URL and time

---

## Phase 6: Testing & Verification (TODO)

### A. Basic Access Tests
- [ ] Visit https://jobagentph.com
- [ ] Verify site loads correctly
- [ ] Check SSL certificate (green lock icon in browser)
- [ ] Verify no security warnings

### B. Functionality Tests
- [ ] Test homepage navigation
- [ ] Test job listings page
- [ ] Test job detail pages
- [ ] Test search functionality
- [ ] Test filters and sorting

### C. Authentication Tests
- [ ] Test login page
- [ ] Test signup page
- [ ] Test Google sign-in
- [ ] Test logout
- [ ] Test password reset (if implemented)

### D. Protected Routes Tests (if logged in)
- [ ] Test profile page
- [ ] Test agency dashboard (if agency)
- [ ] Test admin panel (if admin)
- [ ] Test job posting (if agency)
- [ ] Test applications page

### E. Firebase Integration Tests
- [ ] Test image upload (profile picture, company logo)
- [ ] Test data saving to Firestore
- [ ] Test real-time updates
- [ ] Test file storage operations

### F. Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari (if available)
- [ ] Test on Edge
- [ ] Test on mobile browsers

### G. Mobile Responsive Testing
- [ ] Test on mobile device
- [ ] Test tablet view
- [ ] Test landscape/portrait modes
- [ ] Verify touch interactions work

### H. Performance Tests
- [ ] Check page load speed
- [ ] Verify images load correctly
- [ ] Check for console errors
- [ ] Test navigation speed

---

## Phase 7: Post-Launch Setup (TODO)

### A. SEO Configuration
- [ ] Create and submit sitemap.xml to Google Search Console
- [ ] Add site to Bing Webmaster Tools
- [ ] Set up Google Analytics (if not done)
- [ ] Verify Open Graph tags for social sharing
- [ ] Test social media preview cards

### B. Monitoring & Analytics
- [ ] Enable Firebase Performance Monitoring
- [ ] Set up Firebase Analytics
- [ ] Configure error tracking
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Create alert rules for critical issues

### C. Social Media & Marketing
- [ ] Update Facebook business page with new domain
- [ ] Update Twitter profile with new domain
- [ ] Update LinkedIn company page
- [ ] Update Instagram bio link
- [ ] Announce domain launch

### D. Email Configuration (Optional)
- [ ] Set up email forwarding (e.g., info@jobagentph.com)
- [ ] Configure SPF records in Cloudflare
- [ ] Configure DKIM records (if sending emails)
- [ ] Test email deliverability

### E. Security Hardening
- [ ] Enable Firebase App Check
- [ ] Review Firestore Security Rules
- [ ] Review Storage Security Rules
- [ ] Enable Cloudflare WAF (optional)
- [ ] Set up rate limiting
- [ ] Enable 2FA on Firebase account
- [ ] Enable 2FA on Cloudflare account

### F. Backup & Documentation
- [ ] Document deployment process
- [ ] Create backup schedule for Firestore
- [ ] Document rollback procedure
- [ ] Create incident response plan
- [ ] Store credentials securely (password manager)

---

## Phase 8: Final Verification (TODO)

### A. Complete System Check
- [ ] All features working on production domain
- [ ] No console errors in browser
- [ ] All links working correctly
- [ ] Forms submitting correctly
- [ ] Images displaying properly
- [ ] Authentication working flawlessly

### B. Performance Verification
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check Core Web Vitals
- [ ] Verify mobile performance
- [ ] Test with slow network simulation

### C. DNS & SSL Check
- [ ] DNS fully propagated worldwide
- [ ] SSL certificate valid and trusted
- [ ] HTTPS redirect working
- [ ] www redirect working (if configured)

### D. Documentation Review
- [ ] All setup documentation complete
- [ ] Troubleshooting guide accessible
- [ ] Team members briefed (if applicable)
- [ ] Credentials documented securely

---

## Rollback Plan (In Case of Issues)

### Quick Rollback Steps:
1. [ ] Remove custom domain from Firebase Console
2. [ ] Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://job-agent-ph--jobs-agency-8f28b.asia-east1.hosted.app
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobs-agency-8f28b.firebaseapp.com
   ```
3. [ ] Redeploy: `npm run deploy`
4. [ ] Update Firebase Authorized Domains
5. [ ] Notify users if necessary

---

## Timeline Tracker

- [ ] **Configuration**: ✅ Completed (2025-11-13)
- [ ] **Firebase Setup**: ___ (Date: ______)
- [ ] **DNS Configuration**: ___ (Date: ______)
- [ ] **Domain Verification**: ___ (Date: ______)
- [ ] **Deployment**: ___ (Date: ______)
- [ ] **Testing**: ___ (Date: ______)
- [ ] **Go Live**: ___ (Date: ______)

**Expected Total Time**: 15-45 minutes (plus DNS propagation)

---

## Important Notes

⚠️ **Critical Settings**:
- Cloudflare proxy MUST be "DNS only" (grey cloud) for Firebase Hosting
- Firebase Auth domain MUST match your custom domain
- SSL mode in Cloudflare should be "Full" (not Full Strict)

💡 **Tips**:
- DNS propagation usually takes 5-30 minutes, but can take up to 48 hours
- Keep Firebase Console and Cloudflare Dashboard open in separate tabs
- Take screenshots of DNS settings for reference
- Test thoroughly before announcing to users

🆘 **If You Get Stuck**:
- Check [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) troubleshooting section
- Check [FIREBASE_CUSTOM_DOMAIN_SETUP.md](FIREBASE_CUSTOM_DOMAIN_SETUP.md) for detailed steps
- Contact Firebase Support or Cloudflare Support

---

## Completion Status

**Overall Progress**: Phase 1 Complete (1/8)

**Current Phase**: Phase 2 - Firebase Console Setup

**Next Action**: Add custom domain in Firebase Console

---

## Quick Links

- [Firebase Console - Hosting](https://console.firebase.google.com/project/jobs-agency-8f28b/hosting)
- [Firebase Console - Authentication](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [DNS Checker](https://dnschecker.org)
- [SSL Checker](https://www.ssllabs.com/ssltest/)

---

**Last Updated**: 2025-11-13
**Domain**: jobagentph.com
**Status**: Ready for Firebase & DNS Setup
