# Security Checklist for Production Deployment

## ⚠️ CRITICAL: Pre-Deployment Security Checklist

### 🔴 IMMEDIATE ACTIONS REQUIRED

**Date Created:** November 19, 2024
**Last Updated:** November 19, 2024
**Status:** SECURITY HARDENING IN PROGRESS

---

## 1. CREDENTIAL ROTATION (CRITICAL - DO IMMEDIATELY)

### GitHub Personal Access Token
- [ ] Revoke exposed token at: https://github.com/settings/tokens
- [ ] Generate new token with minimum required permissions
- [ ] Update git remote with new token
- [ ] Never commit tokens to repository

### Firebase Service Account
- [ ] Go to Firebase Console → Project Settings → Service Accounts
- [ ] Delete ALL existing service account keys
- [ ] Generate new service account key
- [ ] Store securely (never in git)
- [ ] Update environment variables with new key

### Gmail App Password
- [ ] Revoke existing app password at: https://myaccount.google.com/apppasswords
- [ ] Generate new app-specific password
- [ ] Update GMAIL_APP_PASSWORD in production environment
- [ ] Test email functionality

### Admin Secret Key
- [ ] Generate new cryptographically secure key:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
  ```
- [ ] Update ADMIN_SECRET_KEY (NOT NEXT_PUBLIC_) in all environments
- [ ] Verify server-side validation is working

---

## 2. GIT REPOSITORY CLEANUP (CRITICAL)

### Remove Sensitive Files from History
- [ ] Backup repository before cleanup
- [ ] Remove serviceAccountKey.json from git history
- [ ] Remove firebase-service-account.json if present
- [ ] Remove any .env files from history
- [ ] Force push cleaned history to remote
- [ ] Notify all team members to re-clone repository

### Verify .gitignore
- [ ] Ensure these patterns are in .gitignore:
  ```
  .env*.local
  .env
  .env.production
  serviceAccountKey.json
  firebase-service-account.json
  **/service-account*.json
  ```

---

## 3. ENVIRONMENT VARIABLES (HIGH PRIORITY)

### Development (.env.local)
- [ ] Never commit this file
- [ ] Use only for local development
- [ ] Ensure ADMIN_SECRET_KEY has no NEXT_PUBLIC_ prefix

### Production Environment
- [ ] Set all environment variables in hosting platform (Vercel/Firebase)
- [ ] Remove NEXT_PUBLIC_ prefix from ADMIN_SECRET_KEY
- [ ] Verify Firebase credentials are server-side only
- [ ] Test that client-side Firebase config is working

### Client vs Server Variables
- [ ] NEXT_PUBLIC_* variables are client-exposed (use only for public data)
- [ ] Non-prefixed variables are server-only (use for secrets)
- [ ] Audit all NEXT_PUBLIC_ variables for sensitive data

---

## 4. CODE SECURITY (HIGH PRIORITY)

### Admin Authentication
- [ ] Admin secret validation happens server-side via API route
- [ ] No client-side secret validation
- [ ] Rate limiting applied to validation endpoint
- [ ] Failed attempts are logged for monitoring

### API Security
- [ ] All API routes have rate limiting
- [ ] Authentication checks on protected routes
- [ ] Input validation and sanitization
- [ ] Error messages don't expose sensitive info

### Security Headers
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Strict-Transport-Security (HSTS)
- [ ] Content-Security-Policy configured
- [ ] Permissions-Policy restricts unused features

---

## 5. FIREBASE SECURITY (HIGH PRIORITY)

### Firestore Rules
- [ ] Remove all debug/temporary rules
- [ ] Enforce authentication requirements
- [ ] Implement role-based access control
- [ ] Test rules with Firebase emulator
- [ ] Deploy production rules

### Storage Rules
- [ ] File type validation
- [ ] Size limits enforced
- [ ] User-based access control
- [ ] No public write access

### Firebase Console
- [ ] Enable App Check for API abuse prevention
- [ ] Configure domain restrictions
- [ ] Set up usage alerts
- [ ] Review audit logs regularly

---

## 6. DEPENDENCY SECURITY (MEDIUM PRIORITY)

### Package Audit
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update outdated packages
- [ ] Review dependencies for known issues
- [ ] Enable Dependabot or similar service

### Bundle Security
- [ ] Build production bundle
- [ ] Verify no secrets in client bundle:
  ```bash
  grep -r "password\|secret\|key\|token" .next/static/
  ```
- [ ] Check bundle size for anomalies

---

## 7. MONITORING & LOGGING (MEDIUM PRIORITY)

### Error Monitoring
- [ ] Set up Sentry or similar service
- [ ] Configure error alerting
- [ ] Ensure no sensitive data in error logs
- [ ] Test error reporting

### Security Monitoring
- [ ] Log authentication attempts
- [ ] Monitor rate limit violations
- [ ] Set up alerts for suspicious activity
- [ ] Regular security audit schedule

---

## 8. TESTING CHECKLIST (BEFORE DEPLOYMENT)

### Functionality Tests
- [ ] Admin registration with new API route
- [ ] User authentication flow
- [ ] File uploads to Firebase Storage
- [ ] Email sending functionality
- [ ] Rate limiting effectiveness

### Security Tests
- [ ] Try to access admin secret from browser console
- [ ] Test rate limiting by exceeding limits
- [ ] Verify security headers with curl:
  ```bash
  curl -I https://your-domain.com
  ```
- [ ] Check for exposed endpoints
- [ ] Test CORS configuration

---

## 9. DEPLOYMENT CHECKLIST (FINAL STEPS)

### Pre-Deployment
- [ ] All critical security issues resolved
- [ ] Production build successful
- [ ] Environment variables set in hosting platform
- [ ] Domain configured correctly
- [ ] SSL/TLS certificate active

### Post-Deployment
- [ ] Verify site loads correctly
- [ ] Test authentication flows
- [ ] Check browser console for errors
- [ ] Verify security headers are applied
- [ ] Monitor error logs for issues

### Emergency Contacts
- [ ] Document who to contact for security issues
- [ ] Have rollback plan ready
- [ ] Know how to disable site if compromised

---

## 10. ONGOING SECURITY MAINTENANCE

### Daily
- [ ] Monitor error logs
- [ ] Check for suspicious activity

### Weekly
- [ ] Review authentication logs
- [ ] Check rate limiting metrics
- [ ] Verify backups are working

### Monthly
- [ ] Rotate admin secret key
- [ ] Run security audit
- [ ] Update dependencies
- [ ] Review Firebase usage and costs

### Quarterly
- [ ] Rotate all service account keys
- [ ] Full security assessment
- [ ] Penetration testing (if applicable)
- [ ] Update security documentation

---

## INCIDENT RESPONSE PLAN

### If Credentials Are Exposed
1. **Immediately** rotate affected credentials
2. Check logs for unauthorized access
3. Notify affected users if data was accessed
4. Document the incident
5. Update security procedures

### If Site Is Compromised
1. Take site offline immediately
2. Preserve logs for investigation
3. Identify and patch vulnerability
4. Restore from clean backup
5. Implement additional monitoring

---

## SECURITY CONTACTS

**Firebase Support:** https://firebase.google.com/support
**GitHub Security:** security@github.com
**Your Security Team:** [Add your contacts here]

---

## NOTES

- All credentials mentioned in old documentation have been rotated
- Never share or commit actual credentials
- Always use environment variables for secrets
- Regular security audits are essential
- Keep this checklist updated

---

**Remember:** Security is an ongoing process, not a one-time task. Stay vigilant and keep your systems updated.

**Last Security Audit:** November 19, 2024
**Next Scheduled Audit:** [Add date]
**Document Version:** 1.0