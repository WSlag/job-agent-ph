# WWW Domain Setup Summary

## ✅ Configuration Complete - www.jobagentph.com

Your app is now configured to display **www.jobagentph.com** in the browser!

---

## What Users Will See

- **In Browser Address Bar**: `https://www.jobagentph.com`
- **If they type**: `jobagentph.com` → Redirects to `www.jobagentph.com`
- **If they type**: `http://www.jobagentph.com` → Redirects to `https://www.jobagentph.com`

---

## Environment Variables Updated

### .env.local and .env.production:
```env
NEXT_PUBLIC_APP_URL=https://www.jobagentph.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=www.jobagentph.com
```

All other Firebase settings remain the same.

---

## Quick Setup Steps

### 1. Firebase Console (5 minutes)

**Add Custom Domain:**
1. Go to: https://console.firebase.google.com/project/jobs-agency-8f28b/hosting
2. Click: "Add custom domain"
3. Enter: `www.jobagentph.com` (with www!)
4. Copy DNS records

**Add Authorized Domains:**
1. Go to: https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings
2. Add: `www.jobagentph.com`
3. Add: `jobagentph.com` (for redirect)

---

### 2. Cloudflare DNS (10 minutes)

**Add DNS Records from Firebase:**

For www (Primary):
```
Type: CNAME or A
Name: www
Content: <from Firebase>
Proxy: DNS only (grey cloud)
```

For root (Redirect):
```
Type: A
Name: @
Content: <from Firebase or dummy IP>
Proxy: Proxied (orange cloud)
```

TXT for verification:
```
Type: TXT
Name: www or @
Content: <verification from Firebase>
```

**Set up Redirect (Non-www to www):**

Go to: Rules > Page Rules
- URL: `jobagentph.com/*`
- Action: Forwarding URL (301)
- Destination: `https://www.jobagentph.com/$1`

Or use: Rules > Redirect Rules (newer method)
- When: hostname equals "jobagentph.com"
- Then: concat("https://www.", http.request.uri.path)
- Status: 301

**SSL Settings:**
- SSL/TLS mode: Full
- Always Use HTTPS: Enabled

---

### 3. Deploy (5 minutes)

```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npm run deploy
```

---

### 4. Test (After 15-30 minutes)

- [ ] Visit https://www.jobagentph.com ✓ Works
- [ ] Visit http://jobagentph.com → Redirects to https://www.jobagentph.com ✓
- [ ] Visit https://jobagentph.com → Redirects to https://www.jobagentph.com ✓
- [ ] Address bar shows: `https://www.jobagentph.com` ✓
- [ ] Login/Signup works ✓

---

## Important Differences from Non-WWW Setup

| Aspect | Non-WWW (Old) | WWW (Current) |
|--------|---------------|---------------|
| Primary URL | jobagentph.com | www.jobagentph.com |
| Display in Browser | `https://jobagentph.com` | `https://www.jobagentph.com` |
| Firebase Domain | jobagentph.com | www.jobagentph.com |
| Auth Domain | jobagentph.com | www.jobagentph.com |
| Redirect | www → non-www | non-www → www |
| Cloudflare DNS for primary | @ with DNS only | www with DNS only |

---

## DNS Configuration Visual

```
User types: jobagentph.com
     ↓
Cloudflare catches (proxied @ record)
     ↓
Page Rule/Redirect Rule triggers
     ↓
301 Redirect to www.jobagentph.com
     ↓
DNS lookup for www.jobagentph.com (DNS only)
     ↓
Firebase Hosting serves site
     ↓
User sees: https://www.jobagentph.com ✓
```

---

## Files Modified

1. `.env.local` - Updated URLs to www
2. `.env.production` - Updated URLs to www
3. `WWW_DOMAIN_SETUP.md` - Detailed setup guide (created)
4. `WWW_SETUP_SUMMARY.md` - This file (created)

---

## Cloudflare Page Rule Example

**Rule #1: Redirect root to www**
- URL: `jobagentph.com/*`
- Setting: Forwarding URL
- Status Code: 301 (Permanent Redirect)
- Destination URL: `https://www.jobagentph.com/$1`

Save this rule and it will:
- `jobagentph.com` → `https://www.jobagentph.com`
- `http://jobagentph.com` → `https://www.jobagentph.com`
- `jobagentph.com/jobs` → `https://www.jobagentph.com/jobs`
- etc.

---

## Why WWW?

Advantages of using www:
- Clearer separation of domain vs subdomain
- Easier to set up CDN or load balancing later
- Cookie scope control
- Traditional and familiar to users
- More flexible DNS management

Both www and non-www work perfectly fine - it's just a preference!

---

## Troubleshooting Quick Fixes

**Redirect loop?**
- Check Cloudflare SSL is "Full" (not Flexible)
- Ensure www DNS is "DNS only" (grey cloud)

**Root domain not redirecting?**
- Verify Cloudflare Page Rule is active
- Check it's set to 301, not 302

**Auth error?**
- Add BOTH domains to Firebase Authorized Domains
- Redeploy after changes

**Certificate error?**
- Wait 10-15 minutes for Firebase SSL provisioning
- Check domain is verified in Firebase

---

## Support Documentation

- **Detailed Guide**: [WWW_DOMAIN_SETUP.md](WWW_DOMAIN_SETUP.md)
- **General Setup**: [FIREBASE_CUSTOM_DOMAIN_SETUP.md](FIREBASE_CUSTOM_DOMAIN_SETUP.md)
- **Quick Reference**: [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)
- **Checklist**: [DOMAIN_SETUP_CHECKLIST.md](DOMAIN_SETUP_CHECKLIST.md)

---

## Ready to Go!

Your configuration is complete. Just follow the 4 steps above:
1. Firebase Console - Add www.jobagentph.com
2. Cloudflare DNS - Add records and redirect
3. Deploy - `npm run deploy`
4. Test - Visit https://www.jobagentph.com

**Expected Time**: 20-50 minutes (including DNS propagation)

---

**Domain**: www.jobagentph.com
**Status**: ✅ Configured and ready
**Last Updated**: 2025-11-13
