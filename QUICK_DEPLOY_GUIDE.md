# Quick Deploy Guide - jobagentph.com

## Prerequisites Checklist
- [x] Domain registered: jobagentph.com (Cloudflare)
- [x] Firebase project: jobs-agency-8f28b
- [x] App already deployed: job-agent-ph--jobs-agency-8f28b.asia-east1.hosted.app
- [ ] Custom domain configured in Firebase
- [ ] DNS records added in Cloudflare
- [ ] Domain verified

---

## Step-by-Step Quick Guide

### 1. Add Custom Domain in Firebase (5 minutes)
```
1. Open: https://console.firebase.google.com/project/jobs-agency-8f28b/hosting
2. Click: "Add custom domain"
3. Enter: jobagentph.com
4. Copy the DNS records Firebase provides
```

### 2. Configure DNS in Cloudflare (5 minutes)
```
1. Open: https://dash.cloudflare.com
2. Select: jobagentph.com
3. Go to: DNS > Records
4. Add records from Firebase:
   - A or CNAME record for @ (root domain)
   - TXT record for verification
   - CNAME for www (optional)
5. Important: Set proxy to "DNS only" (grey cloud)
```

### 3. Add Authorized Domains in Firebase Auth (2 minutes)
```
1. Open: https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings
2. Scroll to: "Authorized domains"
3. Click: "Add domain"
4. Add: jobagentph.com
5. Add: www.jobagentph.com (if using www)
```

### 4. Verify Domain in Firebase (5-30 minutes)
```
1. Go back to Firebase Hosting
2. Click: "Verify"
3. Wait for DNS propagation
4. Firebase will auto-provision SSL certificate
```

### 5. Deploy Latest Build (5 minutes)
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npm run build
firebase deploy --only hosting
```

### 6. Test Your Site (2 minutes)
```
1. Visit: https://jobagentph.com
2. Test login/signup
3. Test job listings
4. Check SSL certificate (should be valid)
```

---

## Commands Cheat Sheet

### Deploy
```bash
# Deploy hosting only
npm run deploy

# Deploy everything
npm run deploy:all

# Deploy with Firebase CLI
firebase deploy --only hosting
```

### Check Status
```bash
# Check DNS
nslookup jobagentph.com

# Check hosting sites
firebase hosting:sites:list

# View deployment history
firebase hosting:channel:list
```

### Development
```bash
# Run locally
npm run dev

# Build for production
npm run build

# Analyze bundle
npm run analyze
```

---

## Troubleshooting Quick Fixes

### Domain verification failed?
```bash
# Check TXT record
nslookup -type=TXT jobagentph.com

# Wait 10-30 minutes and try again
```

### Too many redirects?
```
1. Cloudflare: Set proxy to "DNS only" (grey cloud)
2. Cloudflare SSL: Set to "Full" (not Full Strict)
```

### Auth not working?
```
1. Check authorized domains in Firebase Auth
2. Check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobagentph.com
3. Redeploy: npm run deploy
```

### 404 on page refresh?
```
Already fixed in firebase.json with rewrites!
Just redeploy if needed.
```

---

## Important URLs

- **Your App**: https://jobagentph.com (after setup)
- **Firebase Console**: https://console.firebase.google.com/project/jobs-agency-8f28b
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Current Deployment**: https://job-agent-ph--jobs-agency-8f28b.asia-east1.hosted.app

---

## Environment Variables (Already Configured)

Production domain is set in `.env.local` and `.env.production`:
```
NEXT_PUBLIC_APP_URL=https://jobagentph.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobagentph.com
```

All other Firebase credentials remain the same.

---

## Timeline

- **DNS Setup**: 5-10 minutes
- **DNS Propagation**: 5-30 minutes (max 48 hours)
- **SSL Certificate**: Automatic (5-10 minutes after verification)
- **Total Time**: 15-45 minutes

---

## Files You've Updated

1. `.env.local` - Production domain
2. `.env.production` - Production environment
3. `next.config.ts` - Static export config
4. `firebase.json` - Hosting config
5. `package.json` - Deploy scripts
6. `.gitignore` - Ignore production env file

---

## Next Steps After Going Live

1. Submit sitemap to Google Search Console
2. Update social media links
3. Set up Google Analytics (if not done)
4. Configure email forwarding
5. Monitor Firebase Analytics

---

**Need detailed instructions?** See [FIREBASE_CUSTOM_DOMAIN_SETUP.md](FIREBASE_CUSTOM_DOMAIN_SETUP.md)

**For general deployment info?** See [DOMAIN_SETUP_GUIDE.md](DOMAIN_SETUP_GUIDE.md)
