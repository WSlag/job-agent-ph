# Verification Checklist - Job Agency PH

**Date:** October 23, 2025
**Status:** Dev server running at http://localhost:3000
**Credentials:** ✅ Updated with new private key

---

## ✅ Completed

- [x] Firebase credentials rotated
- [x] Dev server started successfully
- [x] All code committed and pushed to GitHub
- [x] Firebase security rules deployed
- [x] Storage security rules deployed

---

## 🧪 Testing Checklist

### 1. Basic Functionality Tests

#### Public Pages (No Auth Required)
- [ ] Visit http://localhost:3000 - Home page loads
- [ ] Visit http://localhost:3000/jobs - Job listings display
- [ ] Visit http://localhost:3000/about - About page loads
- [ ] Visit http://localhost:3000/contact - Contact page loads
- [ ] Visit http://localhost:3000/privacy - Privacy policy loads
- [ ] Visit http://localhost:3000/companies - Companies directory loads
- [ ] Click a job card - Job details page opens
- [ ] Filter jobs by country/type/salary - Results update

#### Authentication Flow
- [ ] Go to http://localhost:3000/auth/signup
- [ ] Create a **Job Hunter** account
- [ ] Verify redirect after signup
- [ ] Log out
- [ ] Go to http://localhost:3000/auth/login
- [ ] Log in with job hunter credentials
- [ ] Go to http://localhost:3000/auth/forgot-password
- [ ] Test password reset email (check your inbox)

---

### 2. Job Hunter Features

**Prerequisites:** Logged in as Job Hunter

#### Profile Management
- [ ] Go to http://localhost:3000/profile
- [ ] Update your full name
- [ ] Update location
- [ ] Add skills (type and press Enter)
- [ ] Remove a skill
- [ ] Add phone number
- [ ] Write a bio
- [ ] Upload a resume (PDF, max 10MB)
- [ ] Upload a profile picture (JPG/PNG, max 5MB)
- [ ] Click "Save Changes"
- [ ] Verify success message
- [ ] Refresh page - changes should persist

#### Password Change
- [ ] Go to http://localhost:3000/profile
- [ ] Click "Security" tab
- [ ] Enter new password (min 8 characters)
- [ ] Confirm new password
- [ ] Click "Update Password"
- [ ] Verify success message
- [ ] Log out and log in with new password

#### Job Application
- [ ] Go to http://localhost:3000/jobs
- [ ] Click on a job
- [ ] Click "Apply Now"
- [ ] Fill in cover letter
- [ ] Upload resume (or use existing)
- [ ] Submit application
- [ ] Verify success message

#### Saved Jobs
- [ ] Go to http://localhost:3000/jobs
- [ ] Click bookmark icon on a job card
- [ ] Go to http://localhost:3000/saved-jobs
- [ ] Verify job appears in saved list
- [ ] Click "Remove" on a saved job
- [ ] Verify it's removed from list

#### Applications Tracking
- [ ] Go to http://localhost:3000/profile/applications
- [ ] Verify your applications are listed
- [ ] Filter by status (All, Pending, Reviewing, etc.)
- [ ] Check application details

---

### 3. Agency Features

**Prerequisites:** Need a verified agency account

#### Create Agency Account
- [ ] Log out from job hunter account
- [ ] Go to http://localhost:3000/auth/signup
- [ ] Create an **Agency** account
- [ ] Fill in company details
- [ ] Verify redirect after signup

#### Verify Agency (Manual Step)
Since only verified agencies can post jobs, you need to verify manually:

1. Go to Firebase Console: https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/databases/-default-/data
2. Navigate to `agencies` collection
3. Find your agency document (use the email you signed up with)
4. Click on the document
5. Find the `verified` field
6. Change it from `false` to `true`
7. Click "Update"

**After verification:**

#### Agency Profile
- [ ] Go to http://localhost:3000/profile
- [ ] Update company name
- [ ] Update contact email
- [ ] Add phone number
- [ ] Add company address
- [ ] Add registration number
- [ ] Add website URL
- [ ] Write company description
- [ ] Upload company logo (JPG/PNG, max 5MB)
- [ ] Click "Save Changes"
- [ ] Verify success message

#### Post a Job
- [ ] Go to http://localhost:3000/jobs/post (or agency dashboard)
- [ ] Fill in job title (min 3, max 200 chars)
- [ ] Write job description (min 50, max 10,000 chars)
- [ ] Select job type (full-time, part-time, etc.)
- [ ] Enter location
- [ ] Set salary range (min/max)
- [ ] Add skills (at least 1)
- [ ] Select country
- [ ] Click "Post Job"
- [ ] Verify success message
- [ ] Job should appear in job listings

#### Agency Dashboard
- [ ] Go to http://localhost:3000/agency/dashboard
- [ ] View statistics (total jobs, active jobs, applications)
- [ ] See list of your posted jobs
- [ ] Edit a job (update details)
- [ ] Deactivate a job
- [ ] Reactivate a job

#### Manage Applicants
- [ ] Post a job (if you haven't already)
- [ ] Have a job hunter apply (use different browser/incognito)
- [ ] Go to job details page
- [ ] Click "View Applicants"
- [ ] See list of applicants
- [ ] View applicant resume
- [ ] Change application status:
  - [ ] Set to "Reviewing"
  - [ ] Set to "Shortlisted"
  - [ ] Set to "Accepted"
  - [ ] Set to "Rejected"
- [ ] Verify status updates in real-time

---

### 4. Messaging System

**Prerequisites:** Job hunter has applied to a job

#### Start Conversation (Job Hunter)
- [ ] Go to http://localhost:3000/profile/applications
- [ ] Click "Message" on an application
- [ ] Opens conversation with agency
- [ ] Type a message
- [ ] Send message
- [ ] Verify message appears

#### Reply to Message (Agency)
- [ ] Log in as agency
- [ ] Go to http://localhost:3000/messages
- [ ] See unread message indicator
- [ ] Click on conversation
- [ ] See job hunter's message
- [ ] Type a reply
- [ ] Send reply
- [ ] Verify reply appears

#### Message Templates
- [ ] In conversation, look for template buttons
- [ ] Click "Request Interview"
- [ ] Message is pre-filled
- [ ] Customize and send

---

### 5. Security Tests

#### Authentication Protection
- [ ] Log out completely
- [ ] Try to access http://localhost:3000/profile
- [ ] Should redirect to login page
- [ ] Try to access http://localhost:3000/saved-jobs
- [ ] Should redirect to login page
- [ ] Try to access http://localhost:3000/jobs/post
- [ ] Should redirect to login page

#### Role-Based Access
- [ ] Log in as Job Hunter
- [ ] Try to access http://localhost:3000/jobs/post
- [ ] Should show error or redirect (job hunters can't post)
- [ ] Try to access http://localhost:3000/agency/dashboard
- [ ] Should show error or redirect

- [ ] Log in as **Unverified** Agency
- [ ] Try to post a job
- [ ] Should fail with permission error

- [ ] Log in as **Verified** Agency
- [ ] Should be able to post jobs

#### File Upload Validation
- [ ] Try to upload 11MB resume (should fail - max 10MB)
- [ ] Try to upload 6MB profile picture (should fail - max 5MB)
- [ ] Try to upload .exe file as resume (should fail - wrong type)
- [ ] Try to upload .txt file as resume (should fail - wrong type)
- [ ] Upload valid PDF resume (should succeed)
- [ ] Upload valid JPG/PNG image (should succeed)

#### Data Validation
In profile page:
- [ ] Try to save with name less than 2 chars (should fail)
- [ ] Try to save with invalid email format (should fail)
- [ ] Try to save with phone in wrong format (should show warning)
- [ ] Add 51+ skills (should fail - max 50)

In job posting:
- [ ] Try to post job with title < 3 chars (should fail)
- [ ] Try to post job with description < 50 chars (should fail)
- [ ] Try to post with salary min > max (should fail)
- [ ] Try to post with no skills (should fail - min 1)

---

### 6. Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

Test these key features:
- [ ] Login/Signup
- [ ] Profile page
- [ ] Job application
- [ ] File uploads
- [ ] Messaging

---

### 7. Mobile Responsiveness

On mobile device or browser DevTools:
- [ ] Home page displays correctly
- [ ] Job listings are readable
- [ ] Job details page is usable
- [ ] Profile page is editable
- [ ] Forms are usable
- [ ] Navigation menu works
- [ ] Messages are readable

---

### 8. Performance Tests

- [ ] Job listings page loads in < 3 seconds
- [ ] Job details page loads in < 2 seconds
- [ ] Profile page loads in < 2 seconds
- [ ] Messages load in < 2 seconds
- [ ] File uploads show progress
- [ ] No console errors in browser DevTools
- [ ] No memory leaks (check DevTools Memory tab)

---

### 9. Firebase Console Verification

#### Firestore Data
Visit: https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/databases/-default-/data

- [ ] `users` collection has your test users
- [ ] `jobHunters` collection has job hunter profiles
- [ ] `agencies` collection has agency profiles
- [ ] `jobs` collection has posted jobs
- [ ] `applications` collection has submitted applications
- [ ] `conversations` collection has message threads
- [ ] `savedJobs` collection has user saved jobs

#### Storage Files
Visit: https://console.firebase.google.com/project/jobs-agency-8f28b/storage

- [ ] `resumes/` folder has uploaded resumes
- [ ] `profile-pictures/` folder has profile pictures
- [ ] `company-logos/` folder has company logos
- [ ] Files are organized by userId

#### Security Rules
Visit: https://console.firebase.google.com/project/jobs-agency-8f28b/firestore/rules

- [ ] Firestore rules show latest version (deployed today)
- [ ] Test rules in Rules Playground:
  - Unauthenticated read/write → Denied ✓
  - Job hunter can apply → Allowed ✓
  - Unverified agency can't post → Denied ✓
  - Verified agency can post → Allowed ✓

Visit: https://console.firebase.google.com/project/jobs-agency-8f28b/storage/rules

- [ ] Storage rules show latest version (deployed today)
- [ ] File size limits are enforced
- [ ] File type restrictions are active

---

### 10. Error Scenarios

Test error handling:
- [ ] Submit form with missing required fields
- [ ] Try to apply to same job twice
- [ ] Try to save job that doesn't exist
- [ ] Try to access deleted conversation
- [ ] Network disconnection during upload
- [ ] Browser back button during form submission

---

## 🐛 Issue Tracking

If you find any issues during testing, document them here:

### Critical Issues
- [ ] Issue 1:
- [ ] Issue 2:

### Non-Critical Issues
- [ ] Issue 1:
- [ ] Issue 2:

---

## 📊 Test Results Summary

**Date Tested:** __________
**Tester:** __________
**Environment:** Development

| Category | Tests Passed | Tests Failed | Pass Rate |
|----------|--------------|--------------|-----------|
| Public Pages | __ / 8 | __ | __% |
| Authentication | __ / 5 | __ | __% |
| Job Hunter Features | __ / 15 | __ | __% |
| Agency Features | __ / 12 | __ | __% |
| Messaging | __ / 8 | __ | __% |
| Security | __ / 15 | __ | __% |
| Mobile | __ / 7 | __ | __% |
| Performance | __ / 8 | __ | __% |
| **TOTAL** | __ / 78 | __ | __% |

---

## ✅ Production Readiness Checklist

Before deploying to production:

### Security
- [x] Credentials rotated
- [ ] Firebase App Check enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Error tracking setup (Sentry/LogRocket)
- [ ] Rate limiting implemented

### Configuration
- [ ] Production environment variables set
- [ ] NEXT_PUBLIC_APP_URL updated to production URL
- [ ] Firebase quotas checked and upgraded if needed
- [ ] Backup strategy in place
- [ ] Monitoring and alerts configured

### Documentation
- [x] README updated
- [x] Security guide available
- [x] Quick start guide available
- [ ] User guide created
- [ ] Admin guide created

### Features
- [ ] Email notifications implemented
- [ ] Pagination added
- [ ] Loading states improved
- [ ] Error messages user-friendly
- [ ] Admin interface for agency verification

---

## 📞 Next Steps

If all tests pass, you're ready for:
1. Beta testing with real users
2. Production deployment (Vercel/Netlify)
3. Phase 2 features (email notifications, pagination)
4. Marketing and user acquisition

---

**Happy Testing! 🚀**

Your app is looking great! Let me know if you find any issues during testing.
