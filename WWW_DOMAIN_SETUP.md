# www.jobagentph.com Setup Guide

## Configuration Updated for WWW Subdomain

Your app is now configured to use **www.jobagentph.com** as the primary domain. The browser will display `https://www.jobagentph.com` in the address bar.

---

## What Was Changed

### Environment Variables Updated:
- ✅ `NEXT_PUBLIC_APP_URL=https://www.jobagentph.com`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=www.jobagentph.com`
- ✅ Updated in both `.env.local` and `.env.production`

### Redirect Behavior:
- **www.jobagentph.com** → Primary domain (users will see this)
- **jobagentph.com** → Redirects to www.jobagentph.com

---

## Firebase Console Setup

### Step 1: Add Custom Domain in Firebase

1. Go to [Firebase Hosting](https://console.firebase.google.com/project/jobs-agency-8f28b/hosting)
2. Click **"Add custom domain"**
3. Enter: `www.jobagentph.com` (with www)
4. Click **Continue**
5. Copy the DNS records Firebase provides

### Step 2: Add Authorized Domains in Firebase Auth

1. Go to [Firebase Authentication](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
2. Scroll to **Authorized domains**
3. Click **Add domain**
4. Add: `www.jobagentph.com`
5. Also add: `jobagentph.com` (for redirect)
6. Save changes

---

## Cloudflare DNS Configuration

### Primary DNS Records (From Firebase):

After adding the domain in Firebase, you'll get specific DNS records. Add them in Cloudflare:

#### For www subdomain (Primary):
```
Type: CNAME
Name: www
Content: <hostname from Firebase>
Proxy status: DNS only (grey cloud) ⚠️ IMPORTANT
TTL: Auto
```

Or if Firebase provides an A record:
```
Type: A
Name: www
Content: <IP address from Firebase>
Proxy status: DNS only (grey cloud) ⚠️ IMPORTANT
TTL: Auto
```

#### For root domain (Redirect to www):

**Option 1: Using Cloudflare Page Rule (Recommended)**
1. First, add an A record pointing to Firebase:
```
Type: A
Name: @
Content: <IP from Firebase or use 192.0.2.1 as placeholder>
Proxy status: Proxied (orange cloud) ✓
TTL: Auto
```

2. Then create a Page Rule in Cloudflare:
   - Go to: Rules > Page Rules
   - URL pattern: `jobagentph.com/*`
   - Setting: Forwarding URL (301 - Permanent Redirect)
   - Destination: `https://www.jobagentph.com/$1`
   - Save and Deploy

**Option 2: Using Cloudflare Redirect Rules (New Method)**
1. Go to: Rules > Redirect Rules
2. Create a new rule:
   - Name: "Redirect root to www"
   - When incoming requests match: `hostname equals "jobagentph.com"`
   - Then: Dynamic redirect
   - Expression: `concat("https://www.", http.request.uri.path)`
   - Status code: 301
   - Save and Deploy

#### TXT Record for Verification:
```
Type: TXT
Name: _acme-challenge.www
Content: <verification code from Firebase>
TTL: Auto
```

---

## Cloudflare Settings

### SSL/TLS Configuration:
1. Go to **SSL/TLS > Overview**
2. Set mode to: **Full** (not Full Strict)

### Always Use HTTPS:
1. Go to **SSL/TLS > Edge Certificates**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

### HSTS (Optional but Recommended):
1. Go to **SSL/TLS > Edge Certificates**
2. Enable **HSTS**
3. Settings:
   - Max Age: 6 months (15768000)
   - Include subdomains: Off
   - Preload: Off (initially)

---

## Deployment

Deploy with the updated configuration:

```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npm run build
npm run deploy
```

Or:
```bash
firebase deploy --only hosting
```

---

## Testing Checklist

After deployment and DNS propagation:

### Primary Domain (www):
- [ ] Visit https://www.jobagentph.com
- [ ] Verify site loads correctly
- [ ] Check SSL certificate (green lock)
- [ ] Test login/signup
- [ ] Test all features

### Root Domain Redirect:
- [ ] Visit http://jobagentph.com
- [ ] Should redirect to https://www.jobagentph.com
- [ ] Visit https://jobagentph.com
- [ ] Should redirect to https://www.jobagentph.com

### Verify URL in Browser:
- [ ] Address bar shows: `https://www.jobagentph.com`
- [ ] No redirect loops
- [ ] SSL certificate valid

---

## DNS Records Summary

After Firebase provides the records, your Cloudflare DNS should look like:

```
Type | Name  | Content                    | Proxy Status
-----|-------|----------------------------|-------------
A    | www   | <IP from Firebase>         | DNS only
A    | @     | <IP from Firebase/dummy>   | Proxied
TXT  | www   | <Firebase verification>    | DNS only
```

Plus redirect rule or page rule for @ → www

---

## Important Notes

1. **DNS Proxy for www**: Must be "DNS only" (grey cloud) for Firebase
2. **Root domain can be proxied**: Since it's just redirecting to www
3. **Both domains in Auth**: Add both `www.jobagentph.com` and `jobagentph.com` to Firebase Authorized Domains
4. **Primary domain**: Firebase hosting is on `www.jobagentph.com`

---

## Troubleshooting

### Issue: Redirect loop on www
**Solution:**
- Check Cloudflare SSL mode is "Full" (not Flexible)
- Ensure www DNS proxy is "DNS only" (grey cloud)
- Clear browser cache

### Issue: Root domain (no www) not redirecting
**Solution:**
- Verify Cloudflare Page Rule or Redirect Rule is active
- Check rule is set to 301 redirect
- Wait 5 minutes for rule to propagate

### Issue: Firebase Auth error
**Solution:**
- Verify both domains in Firebase Authorized Domains:
  - `www.jobagentph.com`
  - `jobagentph.com`
- Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=www.jobagentph.com`
- Redeploy after changes

### Issue: SSL certificate error
**Solution:**
- Wait for Firebase to provision SSL (5-10 minutes)
- Verify domain is verified in Firebase Console
- Check DNS propagation is complete

---

## Quick Commands

### Check DNS:
```bash
nslookup www.jobagentph.com
nslookup jobagentph.com
```

### Deploy:
```bash
npm run deploy
```

### Test redirect:
```bash
curl -I http://jobagentph.com
curl -I https://jobagentph.com
```
(Should show 301 redirect to www)

---

## Timeline

- **DNS Setup**: 10 minutes
- **DNS Propagation**: 5-30 minutes
- **SSL Certificate**: 5-10 minutes (automatic)
- **Total Time**: 20-50 minutes

---

## Configuration Files Updated

1. `.env.local` - `NEXT_PUBLIC_APP_URL=https://www.jobagentph.com`
2. `.env.production` - `NEXT_PUBLIC_APP_URL=https://www.jobagentph.com`
3. Both files - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=www.jobagentph.com`

---

## Next Steps

1. [ ] Add `www.jobagentph.com` as custom domain in Firebase
2. [ ] Configure DNS in Cloudflare (www subdomain)
3. [ ] Set up redirect from root to www (Page Rule or Redirect Rule)
4. [ ] Add both domains to Firebase Authorized Domains
5. [ ] Deploy: `npm run deploy`
6. [ ] Wait for DNS propagation (15-30 min)
7. [ ] Test: https://www.jobagentph.com
8. [ ] Verify redirect: http://jobagentph.com → https://www.jobagentph.com

---

**Domain**: www.jobagentph.com (Primary)
**Redirect**: jobagentph.com → www.jobagentph.com
**Status**: Configured, ready for Firebase and DNS setup
**Last Updated**: 2025-11-13
