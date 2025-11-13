# Domain Setup Guide for jobagentph.com

## Overview
This guide will help you deploy your Job Agent PH application to **jobagentph.com** using Cloudflare DNS.

---

## Prerequisites
- Domain: **jobagentph.com** (registered in Cloudflare)
- Firebase project: **jobs-agency-8f28b**
- Deployment platform choice: **Vercel (Recommended)** or **Firebase Hosting**

---

## Step 1: Firebase Console Configuration

### 1.1 Add Authorized Domain to Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com/project/jobs-agency-8f28b/authentication/settings)
2. Navigate to: **Authentication > Settings > Authorized domains**
3. Click **Add domain** and add:
   - `jobagentph.com`
   - `www.jobagentph.com`

### 1.2 Update Firebase Auth Domain (if using custom domain)

The app is currently configured to use `jobagentph.com` as the auth domain in production.

---

## Step 2: Choose Your Deployment Platform

### Option A: Deploy to Vercel (Recommended for Next.js)

#### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 Deploy to Vercel
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
vercel login
vercel --prod
```

#### 2.3 Add Environment Variables in Vercel Dashboard

Go to your Vercel project settings and add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDv8O0G7bLxquHRCZj9Y8XpWxgldJbAD24
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobagentph.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jobs-agency-8f28b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jobs-agency-8f28b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=926738060539
NEXT_PUBLIC_FIREBASE_APP_ID=1:926738060539:web:b6534d906922dde2a2cc5e
FIREBASE_PROJECT_ID=jobs-agency-8f28b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@jobs-agency-8f28b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMpw+Wp36k3YTt\nA5Jtb0fXyz4M4/Yr9D/4O5Zf2w1fSsGHd27/vysTYxXeXS7L7PjK6OVtr6TxG4z5\n4Nt5yHg8g4qj0kweXgtGKPH7ORxPWI5aOgKuCmoEtE1HJ7EfegCRquV0sjsU69Hb\nmBZ3sonW59IGPLGuR1jyItB7dRTtVW8eZLE20MkVbFPw5mlnbdt0gHjUtXLtNpy8\nmif81Zpjg+wGUbc6OiDnl8PkePHVNb7mTz+R+eM2ONPOzybbTRQNojUMFbTc9cCW\n3f2QDL3P3VVcjwNV2YsSrjpyB3AxYL96sGY2fDInAdQtKr9R5cL+mBzAohCqhI5s\nNzL/9bqVAgMBAAECggEAGaWSAYpKB7UvFFjPP+GjOjrhMtJaplV8ssoc5TRZb6i5\nqhVglrJJXqubMPuygqHW5+7Z2a4aWJDgUOxJ9PAXiVXeyPrwyRl2BjvZX2df0d3C\nMTJ15YOul5pU2ObzfoNWkOq+yKoRV2TaLs/XePap6YGxw1BV4AZW8jlEsUQR9E/4\nCm9CcPrf1608lfZKQjTQZjPc92iIUsNygHvRam9ExFaUIdWYMtZkSqi3McedTOa8\ndfuAyFjhJR5eXoX1nU/zjCKnwumdeAGW+fx7o8svI+YT/38UtL4X5QJuuwssUh1Z\n6VPwMlUSUGMD0SuMukd+m27Hux7FqmPIzvgwY+XgfQKBgQD3gsCTvreoHGO3R1pB\nCE4YTzS9yopDNc1g9HaPiGi/YHMinsMxMmwTzXndu2fAXvFrSBJ8Ls3XuYLLFogk\nKB5S5SGqz+fBCBRyeOo//PWcOycvLyN6omCk12gyaOuLRWhsPaQuxRXgcukQso+O\nzGIZ6k3TMVVHUhcOZggRB38sJwKBgQDTq/761OmxhcOf1eAPi3IYRUyhGQVyoSGw\nnAX8sJ/f6v3SFo3eMn1RDR5fBcnfn9i/Uc81KbR2Bs9MPNVkKQzggztgcw7tJEy3\nxAMWfoYJU/bkg+oj/vj1GLIbMLqp0HUBNXJoLz+V86RuMRh/G0+UKpiM4+k8Y6KL\noInbjfpM4wKBgDIUFnrOP8KX2+UdXrmBwKtSe01bSZZHsIJJdCOeafMuxJzgmoW9\nufhXvqyKWnelvhsCvhq6LZPUSQ5mRK1sIJaNHb69yhpYVCrFJEBGIju2DDuTwg3y\nBLPVkZOBfwbyyCn+XtXHsqFzHozuU/WEjOTJb22nsaV4iomzQzaO2cBJAoGAeIEM\nkkQwHs5mRlJ+UpsygzrAm14hSdcN1PueNPNgsRuZEMeiUIMx8LilN7eV6+eWf6TV\ncBCkGiVaUq63VWRBXneXkBswvjTSMDQ5Bc9WA213uzSWUZPQq8g5bV1ah16TnfKN\nhV6Qto+UZt8wcPxdW568ZklB+Q1H9nGYyhOUEb0CgYBvFzT5kbiZJ+g88H1RLX7c\niycjhJNNks3A0BJFDmwYnu4vOHoJxN9eYWopbvw7fwcqfijQd6ew8TopMpplpf2V\n+5lGlatRJYR51Eg7qJVhv5xQ+bn+qttfa3q7Nh7aZ1YYxvXx2i9zDGyO1fQ6KYJE\nWUnEuSTbPWY3wvbi/Jcj7Q==\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_ADMIN_SECRET_KEY=wTFuf7yrYxrWKPNToc7x3KF74bmsY3rSgHD9K6abpz8
NEXT_PUBLIC_APP_URL=https://jobagentph.com
```

#### 2.4 Connect Custom Domain in Vercel

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add `jobagentph.com` and `www.jobagentph.com`
4. Vercel will provide DNS records for Cloudflare

---

### Option B: Deploy to Firebase Hosting

#### 2.1 Update package.json scripts
Add these scripts to your package.json:
```json
"export": "next build && next export",
"deploy": "npm run export && firebase deploy --only hosting"
```

#### 2.2 Deploy
```bash
cd c:\Users\HP\Desktop\jobAgency\job-agent-ph
npm run build
npm run export
firebase deploy --only hosting
```

#### 2.3 Connect Custom Domain
```bash
firebase hosting:channel:deploy production
firebase hosting:sites:create jobagentph
firebase target:apply hosting production jobagentph
```

---

## Step 3: Cloudflare DNS Configuration

### For Vercel Deployment:

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: **jobagentph.com**
3. Go to **DNS > Records**
4. Add the following records:

**If Vercel provides CNAME:**
```
Type: CNAME
Name: @
Content: cname.vercel-dns.com (or the CNAME Vercel provides)
Proxy status: DNS only (grey cloud)
TTL: Auto
```

```
Type: CNAME
Name: www
Content: cname.vercel-dns.com (or the CNAME Vercel provides)
Proxy status: DNS only (grey cloud)
TTL: Auto
```

**If Vercel provides A records:**
```
Type: A
Name: @
Content: 76.76.21.21 (Vercel's IP - use the one they provide)
Proxy status: Proxied (orange cloud) ✓
TTL: Auto
```

```
Type: CNAME
Name: www
Content: jobagentph.com
Proxy status: Proxied (orange cloud) ✓
TTL: Auto
```

### For Firebase Hosting:

Firebase will provide specific DNS records. Add them in Cloudflare DNS.

---

## Step 4: Cloudflare Settings (Important!)

### 4.1 SSL/TLS Settings
1. Go to **SSL/TLS** in Cloudflare
2. Set SSL/TLS encryption mode to: **Full (strict)**

### 4.2 Enable Always Use HTTPS
1. Go to **SSL/TLS > Edge Certificates**
2. Enable **Always Use HTTPS**

### 4.3 Enable Auto Minify (Optional)
1. Go to **Speed > Optimization**
2. Enable Auto Minify for JavaScript, CSS, and HTML

### 4.4 Configure Page Rules (Optional)
Create a page rule to redirect www to non-www or vice versa:
- URL pattern: `www.jobagentph.com/*`
- Setting: Forwarding URL (301 - Permanent Redirect)
- Destination: `https://jobagentph.com/$1`

---

## Step 5: Verify Deployment

1. Wait 5-10 minutes for DNS propagation
2. Visit https://jobagentph.com
3. Check SSL certificate (should show as secure)
4. Test Firebase Auth (login/signup should work)
5. Test image uploads to Firebase Storage

### Debugging DNS
Check DNS propagation:
```bash
nslookup jobagentph.com
```

Or use online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

---

## Step 6: Post-Deployment Tasks

### 6.1 Update Google Search Console
- Add https://jobagentph.com to Google Search Console
- Submit sitemap

### 6.2 Update Social Media Links
- Update Facebook, Twitter, LinkedIn with new domain

### 6.3 Set up Analytics (if not already done)
- Google Analytics
- Facebook Pixel
- Other tracking tools

### 6.4 Enable Cloudflare Web Analytics (Optional)
1. Go to **Analytics > Web Analytics** in Cloudflare
2. Enable for jobagentph.com

---

## Troubleshooting

### Issue: "Too Many Redirects"
**Solution:** Change Cloudflare SSL mode to "Full (strict)"

### Issue: Firebase Auth not working
**Solution:**
1. Verify `jobagentph.com` is added to Firebase Authorized Domains
2. Check that `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is set to `jobagentph.com`

### Issue: Images not loading
**Solution:** Check CORS settings in Firebase Storage rules

### Issue: 404 on page refresh
**Solution:** Ensure Vercel/Firebase rewrites are configured correctly

---

## Important Notes

1. **Environment Variables**: Never commit `.env.local` or `.env.production` to Git
2. **Firebase Private Key**: Keep your Firebase private key secure
3. **DNS Propagation**: Can take up to 48 hours (usually 5-30 minutes)
4. **SSL Certificate**: Automatic with Vercel and Cloudflare
5. **Cloudflare Proxy**: Orange cloud = proxied (recommended), Grey cloud = DNS only

---

## Quick Command Reference

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Firebase
```bash
npm run build && npm run export && firebase deploy --only hosting
```

### Check DNS
```bash
nslookup jobagentph.com
```

### View Deployment Logs (Vercel)
```bash
vercel logs
```

---

## Support

For issues with:
- **Domain/DNS**: Cloudflare Support
- **Hosting**: Vercel Support or Firebase Support
- **Firebase Services**: Firebase Console > Support

---

## Files Modified/Created

1. `.env.local` - Updated with production domain
2. `.env.production` - Created for production environment
3. `.env.example` - Updated with domain notes
4. `firebase.json` - Added hosting configuration
5. `vercel.json` - Created for Vercel deployment
6. `DOMAIN_SETUP_GUIDE.md` - This guide

---

**Last Updated**: 2025-11-13
**Domain**: jobagentph.com
**Project**: Job Agent PH
**Firebase Project**: jobs-agency-8f28b
