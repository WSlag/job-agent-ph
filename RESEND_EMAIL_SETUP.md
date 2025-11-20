# Resend Email Setup Guide

## Migration Complete!

Your email system has been successfully migrated from Gmail/nodemailer to **Resend** - a modern, reliable email API service.

## What Changed?

- **Before**: Used Gmail SMTP with nodemailer
- **After**: Using Resend API (faster, more reliable, better deliverability)
- **Package**: Installed `resend` npm package
- **Email templates**: All preserved and working (no changes needed)

## Setup Steps

### 1. Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. **Free tier includes**: 100 emails per day (perfect for your needs!)

### 2. Verify Your Domain

To send emails from `contact@jobagentph.com`, you need to verify the domain in Resend:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `jobagentph.com`
4. Resend will provide DNS records (SPF, DKIM, DMARC)
5. Add these DNS records to your Cloudflare DNS:

**Example DNS records (Resend will give you exact values):**
```
Type: TXT
Name: jobagentph.com
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [Resend will provide this]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
```

6. Wait 5-10 minutes for DNS propagation
7. Click **Verify** in Resend dashboard

### 3. Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `Job Agent PH Production`
4. Copy the API key (starts with `re_`)

### 4. Update Environment Variables

**Development (.env.local):**
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=contact@jobagentph.com
```

**Production (.env.production):**
```env
RESEND_API_KEY=re_your_production_api_key_here
EMAIL_FROM=contact@jobagentph.com
```

**Important**: Replace the placeholder values with your actual Resend API key!

### 5. Deploy to Production

After adding the API key to both environment files:

```bash
# Build and deploy
npm run build
# Deploy to Cloudflare Pages (or your hosting)
```

Make sure to add `RESEND_API_KEY` and `EMAIL_FROM` to your Cloudflare Pages environment variables in the dashboard.

## Email Features That Will Work

All existing email functionality continues to work:

1. **Agency Welcome Emails** - Sent when agencies sign up
2. **Contact Form Notifications** - Admin receives submissions
3. **Contact Form Confirmations** - Users receive confirmation emails

## Testing Emails

After setup, test by:

1. Creating a new agency account (tests welcome email)
2. Submitting contact form (tests admin notification + user confirmation)

## Troubleshooting

### Emails not sending?
- Check Resend API key is correct in environment variables
- Verify domain is verified in Resend dashboard
- Check Resend dashboard logs for error messages

### Domain verification failing?
- Ensure DNS records are exactly as Resend provides
- Wait 10-15 minutes for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify records are live

### "Invalid API key" error?
- Make sure API key starts with `re_`
- Check for spaces/typos in environment variable
- Regenerate API key in Resend dashboard if needed

## Support

- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **Resend Support**: Available in dashboard
- **DNS Help**: Cloudflare DNS management at [dash.cloudflare.com](https://dash.cloudflare.com)

## Next Steps

1. ✅ Sign up for Resend account
2. ✅ Verify jobagentph.com domain
3. ✅ Get API key
4. ✅ Update environment variables
5. ✅ Deploy to production
6. ✅ Test email sending

---

**Migration completed**: Email system now using Resend for better deliverability and reliability!
