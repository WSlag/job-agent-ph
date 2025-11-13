# Firebase Custom Domain Setup for jobagentph.com

## Current Deployment Status
Your app is already deployed on Firebase App Hosting:
- **Current URL**: `job-agent-ph--jobs-agency-8f28b.asia-east1.hosted.app`
- **Target Domain**: `jobagentph.com`
- **DNS Provider**: Cloudflare

---

## Step 1: Add Custom Domain in Firebase Console

### 1.1 Navigate to Firebase Hosting
1. Go to [Firebase Console](https://console.firebase.google.com/project/jobs-agency-8f28b/hosting)
2. Click on **Hosting** in the left sidebar
3. Find your site: **job-agent-ph**

### 1.2 Add Custom Domain
1. Click **Add custom domain**
2. Enter: `jobagentph.com`
3. Click **Continue**
4. Firebase will provide DNS records to add in Cloudflare

---

## Step 2: Update Firebase Authorized Domains

### 2.1 Add Domain to Firebase Auth
1. Go to [Firebase Authentication Settings](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add these domains:
   - `jobagentph.com`
   - `www.jobagentph.com`
5. Click **Add**

---

## Step 3: Configure Cloudflare DNS

Firebase will provide you with DNS records. Add them in Cloudflare:

### 3.1 Login to Cloudflare
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select: **jobagentph.com**
3. Go to **DNS > Records**

### 3.2 Add DNS Records (From Firebase)

Firebase typically provides these types of records:

**Option A: A Record (Most Common)**
```
Type: A
Name: @
Content: <IP address from Firebase>
Proxy status: DNS only (grey cloud) - IMPORTANT!
TTL: Auto
```

**Option B: CNAME Record**
```
Type: CNAME
Name: @
Content: <hostname from Firebase>
Proxy status: DNS only (grey cloud) - IMPORTANT!
TTL: Auto
```

**For www subdomain:**
```
Type: CNAME
Name: www
Content: jobagentph.com
Proxy status: DNS only (grey cloud) - IMPORTANT!
TTL: Auto
```

### 3.3 TXT Record for Verification
Firebase will also provide a TXT record for domain verification:
```
Type: TXT
Name: @
Content: <verification code from Firebase>
TTL: Auto
```

**IMPORTANT**:
- Keep Cloudflare proxy status as "DNS only" (grey cloud) for Firebase Hosting
- Firebase handles SSL automatically, no need for Cloudflare proxy

---

## Step 4: Wait for Verification

1. After adding DNS records in Cloudflare, go back to Firebase Console
2. Click **Verify** to check if DNS records are configured correctly
3. Verification can take 5-30 minutes (sometimes up to 48 hours)
4. Firebase will automatically provision an SSL certificate

---

## Step 5: Update Environment Variables

Your environment is already configured with the production domain:

**Current Configuration:**
- `.env.local`: `NEXT_PUBLIC_APP_URL=https://jobagentph.com`
- `.env.production`: Created with production settings
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobagentph.com`

No additional changes needed!

---

## Step 6: Cloudflare Additional Settings (Optional but Recommended)

### 6.1 SSL/TLS Settings
1. Go to **SSL/TLS** in Cloudflare
2. Set encryption mode to: **Full** (not Full Strict, since Firebase handles SSL)

### 6.2 Enable Always Use HTTPS
1. Go to **SSL/TLS > Edge Certificates**
2. Enable **Always Use HTTPS**

### 6.3 Configure Redirect (www to non-www or vice versa)
If you want to redirect www to non-www:

1. Go to **Rules > Page Rules** in Cloudflare
2. Create a page rule:
   - URL pattern: `www.jobagentph.com/*`
   - Setting: Forwarding URL (301 - Permanent Redirect)
   - Destination: `https://jobagentph.com/$1`

---

## Step 7: Deploy Latest Changes

Since you've updated the config, redeploy your app:

### Using Firebase CLI:
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npm run build
firebase deploy --only hosting
```

### Or if already set up with App Hosting:
Your app may auto-deploy on git push, or use:
```bash
firebase apphosting:rollouts:create job-agent-ph
```

---

## Step 8: Verify Deployment

After DNS propagation (5-30 minutes):

1. Visit https://jobagentph.com
2. Check SSL certificate (should be valid and issued by Google)
3. Test authentication (login/signup)
4. Test Firebase features (jobs listing, uploads, etc.)

### Check DNS Propagation:
```bash
nslookup jobagentph.com
```

Online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

---

## Troubleshooting

### Issue: "Domain verification failed"
**Solution:**
1. Double-check TXT record in Cloudflare
2. Wait 10-30 minutes for DNS propagation
3. Try verification again in Firebase Console

### Issue: "Too Many Redirects"
**Solution:**
1. Make sure Cloudflare proxy is set to "DNS only" (grey cloud)
2. Check Cloudflare SSL mode is set to "Full" (not Full Strict)

### Issue: Firebase Auth not working on custom domain
**Solution:**
1. Verify `jobagentph.com` is in Firebase Authorized Domains
2. Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` environment variable
3. Redeploy the app after changes

### Issue: 404 errors on page refresh
**Solution:**
- Already configured in [firebase.json](firebase.json) with rewrites
- Should work automatically

---

## Important Notes

1. **DNS Only Mode**: Firebase Hosting requires Cloudflare proxy to be disabled (grey cloud)
2. **SSL Certificate**: Firebase provides free SSL, issued by Google Trust Services
3. **Propagation Time**: DNS changes can take up to 48 hours (usually 5-30 minutes)
4. **No Server Restart Needed**: Changes take effect immediately after deployment

---

## Firebase Hosting Commands

### Deploy hosting only:
```bash
npm run deploy
```

### Deploy everything (hosting, functions, firestore rules):
```bash
npm run deploy:all
```

### View deployment history:
```bash
firebase hosting:channel:list
```

### Check hosting status:
```bash
firebase hosting:sites:list
```

---

## Current Configuration Summary

### Files Updated:
1. [.env.local](job-agent-ph/.env.local) - Local development with production domain
2. [.env.production](job-agent-ph/.env.production) - Production environment variables
3. [next.config.ts](job-agent-ph/next.config.ts) - Static export for Firebase Hosting
4. [firebase.json](job-agent-ph/firebase.json) - Hosting configuration with rewrites
5. [package.json](job-agent-ph/package.json) - Added deployment scripts

### Environment Variables Set:
- `NEXT_PUBLIC_APP_URL=https://jobagentph.com`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobagentph.com`

### Deployment Region:
- **Current**: asia-east1 (Taiwan)
- **Optimized for**: Philippines and Asia-Pacific region

---

## Next Steps After Domain is Live

1. **Update Social Media**
   - Update Facebook, Twitter, LinkedIn with new domain
   - Update Open Graph tags if needed

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Add domain to Bing Webmaster Tools
   - Set up Google Analytics (if not done)

3. **Email Configuration**
   - Set up email forwarding (e.g., info@jobagentph.com)
   - Configure SPF/DKIM records if sending emails

4. **Monitoring**
   - Enable Firebase Performance Monitoring
   - Set up error tracking (Firebase Crashlytics for web)
   - Monitor usage with Firebase Analytics

---

## Support Links

- [Firebase Hosting Custom Domain Docs](https://firebase.google.com/docs/hosting/custom-domain)
- [Firebase Console - Your Project](https://console.firebase.google.com/project/jobs-agency-8f28b)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Firebase Support](https://firebase.google.com/support)

---

**Last Updated**: 2025-11-13
**Domain**: jobagentph.com
**Firebase Project**: jobs-agency-8f28b
**Hosting Region**: asia-east1
**Current Deployment**: job-agent-ph--jobs-agency-8f28b.asia-east1.hosted.app
