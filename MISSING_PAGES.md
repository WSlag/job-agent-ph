# Missing Pages & Implementation Plan - Job Agent PH

**Last Updated:** January 2025
**Application Status:** ~75% Complete (29 existing pages)
**Missing Pages:** 22 pages across different priority levels

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Existing Pages (29)](#existing-pages)
3. [Phase 1: Critical Pages](#phase-1-critical-pages-week-1)
4. [Phase 2: High-Value Pages](#phase-2-high-value-pages-week-2)
5. [Phase 3: Enhanced UX](#phase-3-enhanced-ux-week-3)
6. [Phase 4: Analytics & Advanced](#phase-4-analytics--advanced-week-4)
7. [Phase 5: Future Enhancements](#phase-5-future-enhancements)
8. [Quick Fixes](#quick-fixes)
9. [Implementation Timeline](#implementation-timeline)
10. [Technical Approach](#technical-approach)

---

## Executive Summary

This document outlines the missing pages/screens needed to complete the Job Agent PH platform. The application currently has 29 pages implemented and requires 22 additional pages to reach full functionality, plus several quick fixes for broken navigation links.

### Priority Breakdown

| Priority | Count | Description |
|----------|-------|-------------|
| **Critical** | 7 pages | Essential functionality, legal requirements, broken links |
| **High-Value** | 10 pages | Core user journeys, platform moderation |
| **Future** | 5 pages | Nice-to-have features, Phase 2 enhancements |

### Estimated Timeline

- **Total Development Time:** 92-117 hours (~18-23 working days)
- **Phase 1 (Critical):** 4-5 days
- **Phase 2 (High-Value):** 5-6 days
- **Phase 3 (Enhanced UX):** 4-5 days
- **Phase 4 (Analytics):** 5-6 days

---

## Existing Pages

### Authentication (3 pages)
- `/auth/login` - User login
- `/auth/signup` - User registration (jobhunter/agency)
- `/auth/forgot-password` - Password reset

### Public Pages (7 pages)
- `/` - Homepage with hero carousel
- `/jobs` - Browse/search jobs
- `/jobs/[id]` - Job detail page
- `/about` - About the platform
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/companies` - Browse agencies

### Job Hunter Pages (3 pages)
- `/profile` - View/edit profile
- `/profile/applications` - Track applications
- `/saved-jobs` - Saved jobs list

### Agency Pages (5 pages)
- `/agency/dashboard` - Agency dashboard
- `/agency/profile/edit` - Edit agency profile
- `/jobs/post` - Post new job
- `/jobs/edit/[id]` - Edit existing job
- `/jobs/[id]/applicants` - View job applicants

### Admin Pages (5 pages)
- `/admin/register` - Admin registration (secret key required)
- `/admin/dashboard` - Admin dashboard with stats
- `/admin/featured-jobs` - Manage carousel order
- `/admin/featured-requests` - Review featured job requests
- `/admin/fix-users` - User management utilities

### Messaging (2 pages)
- `/messages` - Conversations list
- `/messages/[id]` - Message thread

### Development/Design Pages (4 pages)
- `/header-designs` - Header design previews
- `/landing-nav-designs` - Nav design previews
- `/landing-nav-preview` - Nav preview
- `/fix-profile` - Profile fixing utility

---

## Phase 1: Critical Pages (Week 1)

**Goal:** Fix broken navigation links and add essential legal/user management pages
**Timeline:** 4-5 days
**Total Effort:** 20-27 hours

---

### 1. Terms of Service Page

**Path:** `/terms`
**Priority:** HIGH (Legal requirement)
**Effort:** 2-3 hours
**User Type:** All users

#### Why Critical
- Legal requirement for the platform
- Already referenced in footer links
- Required for user agreements during signup
- Privacy policy exists but no terms

#### Features Required
- User obligations and responsibilities
- Service terms and conditions
- Liability limitations
- Dispute resolution process
- Account termination terms
- Intellectual property rights
- Payment terms (for featured jobs)
- Modifications to terms

#### Implementation Notes
- Static content page
- Use similar layout to Privacy page
- Organize into collapsible sections
- Add "Last Updated" date
- Legal review recommended before publishing

#### Links to Update
- Homepage footer
- Signup flow (acceptance checkbox)

---

### 2. Settings Page

**Path:** `/settings`
**Priority:** HIGH
**Effort:** 6-8 hours
**User Type:** All authenticated users

#### Why Critical
- Referenced in multiple navigation components:
  - AdminSidebar (line 42: href="/admin/settings")
  - HeaderDesign2 (line 98: href="/settings")
- Essential for account management separate from profile editing

#### Features Required

**Email Preferences**
- Job alerts frequency (daily, weekly, never)
- Application updates
- Message notifications
- Platform updates and news

**Push Notification Settings**
- Browser notifications toggle
- Application status changes
- New messages
- Job recommendations

**Privacy Settings**
- Profile visibility (public, agencies only, private)
- Show/hide contact information
- Allow direct messages
- Search engine indexing

**Account Management**
- Change password
- Email address (with verification)
- Delete account (with confirmation)
- Download data (GDPR compliance)
- Session management (active devices)

**Language Preferences**
- English/Tagalog selector (placeholder for future)

#### Implementation Notes
- Use tabs for different settings sections
- Toggle switches for boolean settings
- Confirmation modals for destructive actions
- Success/error toast notifications
- Auto-save or explicit save button (recommend auto-save)

#### Components Needed
- Settings tabs component
- Toggle switch component (reuse or create)
- Password change modal
- Account deletion confirmation modal

---

### 3. Notifications Center

**Path:** `/notifications`
**Priority:** HIGH
**Effort:** 8-10 hours
**User Type:** All authenticated users

#### Why Critical
- Already linked in LandingNav3Enhanced (line 117: href="/notifications")
- Navigation link points to non-existent page
- Essential for user engagement and retention

#### Features Required

**Notification Types**
- **For Job Hunters:**
  - Application status changes
  - New messages from agencies
  - Job recommendations
  - Saved job updates (salary change, expiration)
  - Featured job expiring soon (if applicable)

- **For Agencies:**
  - New job applications
  - New messages from applicants
  - Featured job request status
  - Job expiring soon
  - Low application rate alerts

- **For Admins:**
  - New featured job requests
  - New user signups
  - Flagged content/reports

**UI Features**
- Notification list (newest first)
- Unread badge count
- Mark as read/unread
- Delete notification
- Filter by type (all, applications, messages, system)
- "Mark all as read" button
- Empty state for no notifications
- Real-time updates

**Each Notification Display**
- Icon based on type
- Title and description
- Timestamp (relative: "2h ago")
- Link to relevant page
- Read/unread indicator

#### Backend Requirements

**New Firestore Collection:** `notifications`
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'message' | 'job_recommendation' | 'system' | 'featured_request';
  title: string;
  message: string;
  linkTo?: string; // URL to navigate to
  read: boolean;
  createdAt: Date;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    conversationId?: string;
    // ... other relevant IDs
  };
}
```

**Security Rules:**
- Users can only read/write their own notifications

**Indexes Needed:**
- `userId` + `createdAt` DESC
- `userId` + `read` + `createdAt` DESC

#### Implementation Notes
- Use Firestore `onSnapshot` for real-time updates
- Implement pagination (load 20 at a time)
- Create helper function `createNotification(userId, type, data)`
- Trigger notifications from relevant actions:
  - Application status updates
  - New messages
  - Admin approvals
- Badge count in navigation (cached count)

---

### 4. FAQ / Help Center

**Path:** `/faq`
**Priority:** HIGH
**Effort:** 4-6 hours
**User Type:** All users (public)

#### Why Critical
- Referenced in multiple navigation components:
  - LandingNav3Enhanced (line 344)
  - LandingNav3 (line 248)
  - Contact page (line 267: href="/#faq")
- Reduces support burden
- Improves user experience

#### Features Required

**FAQ Categories**

1. **For Job Hunters**
   - How do I create a profile?
   - How do I apply for jobs?
   - How do I know if my application was received?
   - Can I edit my application after submitting?
   - How do I message agencies?
   - How do I save jobs?
   - What does "verified agency" mean?
   - How do I update my resume?
   - Can I delete my account?

2. **For Agencies**
   - How do I post a job?
   - How do I get verified?
   - How do I view applicants?
   - How do I message applicants?
   - What are featured jobs?
   - How do I request a featured job placement?
   - How much does it cost to post a job?
   - Can I edit/delete posted jobs?
   - How do I manage my company profile?

3. **General Questions**
   - What is Job Agent PH?
   - Is the platform free to use?
   - How do I reset my password?
   - How do I change my email address?
   - Is my data secure?
   - Who can see my profile?
   - How do I report inappropriate content?
   - Can I use the platform on mobile?

4. **Technical Support**
   - I can't log in
   - I didn't receive a verification email
   - The website is slow/not loading
   - I found a bug
   - How do I contact support?

**UI Features**
- Collapsible accordion sections
- Search functionality (filter FAQs)
- Category tabs or sections
- Table of contents
- "Was this helpful?" feedback buttons
- "Still need help? Contact us" CTA at bottom
- Related questions suggestions

#### Implementation Notes
- Store FAQ content in a separate file or config
- Consider using a CMS for easier updates (future)
- Track most viewed questions (analytics)
- Add structured data for SEO (FAQ schema)

#### Components Needed
- Accordion component (reuse or create)
- Search input with filter logic
- Category tabs component

---

### 5. Admin User Management

**Path:** `/admin/users`
**Priority:** HIGH
**Effort:** 10-12 hours
**User Type:** Admin only

#### Why Critical
- Referenced in AdminSidebar (line 37)
- Referenced in AdminDashboard (line 232)
- Essential for platform moderation and safety
- Handle disputes, verify agencies, manage abuse

#### Features Required

**User List Table**
- Display all users (job hunters, agencies, admins)
- Columns:
  - Avatar/Photo
  - Name/Company Name
  - Email
  - User Type badge
  - Verification status (agencies only)
  - Account status (active, suspended, banned)
  - Created date
  - Actions menu

**Search & Filter**
- Search by name, email, company
- Filter by user type
- Filter by verification status
- Filter by account status
- Filter by registration date range
- Sort by: newest, oldest, name A-Z

**User Actions** (dropdown menu per user)
- View details (opens modal)
- Edit user (limited fields)
- Verify agency
- Unverify agency
- Suspend account
- Ban account
- Reactivate account
- Reset password (send email)
- Delete account (with confirmation)
- View activity log
- Message user

**User Details Modal**
- Full profile information
- Registration date
- Last login
- Posted jobs count (agencies)
- Applications count (job hunters)
- Messages sent
- Reports/flags (if any)
- Activity timeline
- Account status history

**Bulk Actions**
- Select multiple users
- Bulk verify
- Bulk suspend
- Bulk export (CSV)

**Stats Cards** (top of page)
- Total users
- Total job hunters
- Total agencies (verified/unverified)
- Total admins
- New users this month
- Suspended/banned accounts

#### Backend Requirements
- Admin-only access check
- Firestore queries with pagination
- Cloud functions for user actions (optional)
- Audit log for admin actions

#### Security Notes
- Only super_admin can delete users
- Only super_admin can modify admin accounts
- Moderators can verify agencies and suspend users
- Log all admin actions

#### Implementation Notes
- Use existing table components if available
- Implement confirmation modals for destructive actions
- Show success/error toasts
- Refresh list after actions
- Consider implementing activity log in Firestore

---

### 6. Email Verification Flow

**Path:** `/auth/verify-email`
**Priority:** MEDIUM-HIGH
**Effort:** 6-8 hours
**User Type:** Newly registered users

#### Why Important
- Security best practice
- Prevent spam/fake accounts
- Validate email addresses
- Currently missing from auth flow

#### Features Required

**Verification Pending Page** (`/auth/verify-email`)
- Display after user signs up
- Message: "Please check your email to verify your account"
- Show email address sent to
- "Resend verification email" button
- Countdown timer for resend (60 seconds)
- "Wrong email?" option (redirect to settings)
- Auto-check verification status (poll every 10 seconds)
- Auto-redirect when verified

**Email Verification Handler** (`/auth/verify-email/confirm`)
- Process verification link from email
- Extract token from URL params
- Call Firebase Auth verification
- Show success/error message
- Redirect to appropriate dashboard

**Email Template**
- Welcome message
- Verification link with token
- Company branding
- Link expiration notice (24 hours)
- Support contact

#### User Flow
1. User signs up
2. Redirect to `/auth/verify-email`
3. User receives email with verification link
4. User clicks link → Opens `/auth/verify-email/confirm?token=...`
5. System verifies token and marks email as verified
6. Redirect to onboarding or dashboard

#### Backend Requirements
- Firebase Auth email verification enabled
- Email template configured in Firebase
- Firestore: Add `emailVerified` field to user profiles
- Prevent certain actions for unverified users:
  - Job hunters: Can browse but cannot apply
  - Agencies: Can set up profile but cannot post jobs

#### Implementation Notes
- Use Firebase `sendEmailVerification()`
- Use Firebase `applyActionCode()` for verification
- Handle error cases (expired token, invalid token, already verified)
- Add email verification check to protected routes
- Show banner for unverified users

---

### 7. Quick Fixes (Broken Links)

**Effort:** 1-2 hours
**Priority:** HIGH

#### Issues to Fix

1. **Update `/auth/register` to `/auth/signup`**
   - **Files to update:**
     - `app/page.tsx` (line 564)
     - Any navigation components
     - Footer links
   - **Why:** Signup page is at `/auth/signup`, not `/auth/register`

2. **Remove or Restrict Design Preview Pages**
   - **Pages to handle:**
     - `/header-designs`
     - `/landing-nav-designs`
     - `/landing-nav-preview`
   - **Options:**
     - Delete pages (recommended for production)
     - Add admin-only protection
     - Move to separate development branch

3. **Remove or Fix `/fix-profile`**
   - **Current Status:** Utility page
   - **Options:**
     - Make admin-only
     - Remove from production
     - Add proper error handling

4. **Add Terms Link**
   - Currently missing from footer "Company" section
   - Add after Privacy Policy link

#### Implementation Checklist
- [ ] Search all files for `/auth/register` references
- [ ] Update all links to `/auth/signup`
- [ ] Review and remove/protect design pages
- [ ] Handle fix-profile page
- [ ] Add Terms link to footer
- [ ] Test all footer/header links

---

## Phase 2: High-Value Pages (Week 2)

**Goal:** Complete user journeys (dashboard for hunters, user management for admins, email verification)
**Timeline:** 5-6 days
**Total Effort:** 26-32 hours

---

### 8. Job Hunter Dashboard

**Path:** `/dashboard`
**Priority:** HIGH
**Effort:** 10-12 hours
**User Type:** Job Hunter only

#### Why Important
- Job hunters have no central hub
- Agencies have `/agency/dashboard`, hunters need equivalent
- Improve user engagement and retention
- Show personalized content

#### Features Required

**Overview Stats** (4 cards at top)
- Active Applications (count with status breakdown)
- Saved Jobs (count with link to view all)
- Profile Completion (percentage with prompt)
- Messages (unread count)

**Application Status Summary**
- Visual breakdown (pie chart or progress bar)
- Count by status: Pending, Reviewing, Shortlisted, Rejected, Hired
- Click to filter applications

**Recent Applications** (last 5)
- Job title
- Company name
- Application date
- Current status (badge)
- Action button (View Details, Message Agency)

**Profile Completion Prompt** (if < 100%)
- Progress bar
- Missing items checklist:
  - [ ] Add profile photo
  - [ ] Upload resume
  - [ ] Add skills
  - [ ] Add experience
- "Complete Profile" CTA button

**Saved Jobs** (top 3-5)
- Job cards with quick apply option
- "View All Saved Jobs" link

**Recommended Jobs** (4-6 jobs)
- Based on profile skills and preferences
- Job cards with save/apply buttons
- "View More Jobs" link

**Quick Actions** (buttons/cards)
- Browse Jobs
- Edit Profile
- View Applications
- Upload Resume
- Job Alerts Settings

**Recent Activity Timeline** (optional)
- Applied to [Job Title] - 2 days ago
- Saved [Job Title] - 3 days ago
- Profile viewed by [Company] - 5 days ago

**Insights/Tips Section** (optional)
- "Profile views increased 20% this week"
- "Tip: Add 3 more skills to match more jobs"
- "Complete your profile to increase visibility"

#### Implementation Notes
- Use grid layout (responsive)
- Fetch data in parallel (Promise.all)
- Cache some data for performance
- Loading skeletons for each section
- Empty states for no data

#### Backend Requirements
- Aggregate queries for stats
- Job recommendation algorithm (simple matching by skills/category)
- Track profile completion percentage
- Track profile views (optional)

---

### 9. Job Hunter Public Profile

**Path:** `/profile/[userId]` or `/jobhunters/[userId]`
**Priority:** MEDIUM
**Effort:** 8-10 hours
**User Type:** Viewable by agencies

#### Why Important
- Agencies need to see full candidate profiles
- Currently only see basic info in applicant lists
- Better candidate evaluation and decision-making

#### Features Required

**Profile Header**
- Profile photo
- Full name
- Location
- Experience level
- "Contact" button (opens message)
- "Download Resume" button

**About Section**
- Bio/summary (if provided)
- Contact information (email, phone - if public)
- Availability status

**Skills**
- Display as badges/chips
- Highlight matching job skills (if viewed from job context)

**Experience**
- Years of experience
- Previous roles/companies (if provided - future feature)

**Education** (future)
- Degrees
- Certifications

**Resume**
- Link to download
- Or embedded PDF viewer

**Application History** (optional)
- Number of applications
- Success rate (if shared)

**Privacy Controls**
- Respect privacy settings from Settings page
- Hide contact info if set to private
- Show "Profile Hidden" if user chose private

#### Implementation Notes
- Dynamic route with userId parameter
- Check privacy settings before displaying
- Show different views based on viewer:
  - Agency: Full view (if public)
  - Other job hunters: Limited view
  - Unauthenticated: No view or limited
- Log profile views (analytics)

#### Security
- Check Firestore security rules
- Respect privacy settings
- Don't expose sensitive data

---

### 10. Agency Public Profile

**Path:** `/agencies/[agencyId]` or `/companies/[id]`
**Priority:** MEDIUM
**Effort:** 8-10 hours
**User Type:** All users (public)

#### Why Important
- Job hunters want to research companies before applying
- Transparency builds trust
- Showcase company culture and values
- SEO benefits

#### Features Required

**Company Header**
- Company logo
- Company name
- Verification badge (if verified)
- Industry/category
- Location (headquarters)
- "Contact" button
- Social media links (future)

**About Company**
- Description/mission
- Year established
- Company size
- Registration number

**Stats Card**
- Active jobs count
- Total jobs posted
- Employees hired (future)
- Average response time (future)

**Active Jobs Section**
- List all active jobs from this agency
- Job cards with apply/save buttons
- Filter by category, type, location
- "View All" link if many jobs

**Company Information**
- Contact person
- Contact details
- Office address
- Website link (if provided)

**Reviews/Ratings** (Phase 2 - future)
- Star rating
- Review count
- Recent reviews from job hunters

**Similar Companies** (optional)
- 3-4 agencies in same category

#### Implementation Notes
- Dynamic route with agencyId parameter
- Fetch agency profile + active jobs
- Use existing JobCard component
- Add structured data for SEO (Organization schema)
- Cache agency data

#### SEO Optimization
- Dynamic meta tags (title, description)
- Open Graph tags for social sharing
- Canonical URL

---

## Phase 3: Enhanced UX (Week 3)

**Goal:** Enhance transparency and user experience (company profiles, error pages, job alerts)
**Timeline:** 4-5 days
**Total Effort:** 19-24 hours

---

### 11. Custom Error Pages

**Paths:** `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`
**Priority:** MEDIUM
**Effort:** 3-4 hours
**User Type:** All users

#### Why Important
- Better user experience than default Next.js errors
- Professional appearance
- Help users navigate back to working pages
- Reduce frustration

#### Pages Needed

**404 Not Found** (`app/not-found.tsx`)
- Creative "Page Not Found" message
- Illustration or branded graphic
- Search bar to find jobs
- Quick links:
  - Home
  - Browse Jobs
  - Browse by Category
  - Contact Support
- Popular job categories
- Recent jobs (optional)

**500 Server Error** (`app/error.tsx`)
- "Something went wrong" message
- Explanation of what happened
- "Try Again" button (reload page)
- "Go Home" button
- Contact support link
- Error ID for debugging (optional)

**Global Error** (`app/global-error.tsx`)
- Fallback for critical errors
- Minimal UI (can't rely on other components)
- Simple reload button
- Logo and branding

#### Implementation Notes
- Use Framer Motion for animations
- Keep design consistent with app theme
- Make it friendly and helpful, not frustrating
- Add error logging (Sentry or similar - optional)

#### Components Needed
- Error illustration (SVG)
- Reuse existing Button, Card components

---

### 12. Job Alerts Management

**Path:** `/alerts` or `/job-alerts`
**Priority:** MEDIUM
**Effort:** 8-10 hours
**User Type:** Job Hunters only

#### Why Important
- Mentioned in requirements.md (Job Alerts feature)
- Proactive job hunting
- User retention and engagement
- Competitive feature

#### Features Required

**Create New Alert** (form/modal)
- Alert name/title
- Keywords (comma-separated or tags)
- Category (dropdown)
- Location (dropdown or input)
- Job type (checkboxes: full-time, part-time, contract)
- Location type (checkboxes: remote, hybrid, on-site)
- Salary range (min - max)
- Frequency (daily, weekly, instant)
- Enable/disable toggle
- Save button

**Active Alerts List**
- Display all user's alerts
- Each alert card shows:
  - Alert name
  - Criteria summary
  - Frequency badge
  - Recent matches count
  - Enable/disable toggle
  - Edit button
  - Delete button

**Alert Details Modal**
- Show full criteria
- Recent matching jobs (last 5)
- "View All Matches" link (filters jobs page)
- Edit/Delete buttons

**Empty State**
- "No alerts yet" message
- Explanation of how alerts work
- "Create Your First Alert" CTA

**Settings Section**
- Default frequency for new alerts
- Email notification preferences
- Push notification toggle

#### Backend Requirements

**New Firestore Collection:** `jobAlerts`
```typescript
interface JobAlert {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  category?: string;
  location?: string;
  jobType?: string[];
  locationType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  frequency: 'instant' | 'daily' | 'weekly';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSent?: Date;
  matchCount?: number;
}
```

**Cloud Function (Phase 4):**
- Scheduled function to check new jobs
- Match against alert criteria
- Send email notifications
- Track sent alerts

**Security Rules:**
- Users can only read/write their own alerts

#### Implementation Notes
- Check for matching jobs immediately after creating alert
- Show preview of current matches
- Limit alerts per user (e.g., max 5 or 10)
- Add CRUD helper functions in lib/alert-helpers.ts

---

### 13. Onboarding Flow

**Path:** `/onboarding`
**Priority:** MEDIUM
**Effort:** 8-10 hours
**User Type:** New job hunters

#### Why Important
- Improve new user experience
- Increase profile completion rate
- Guide users through setup
- Better job recommendations

#### Features Required

**Multi-Step Wizard** (4-5 steps)

**Step 1: Welcome**
- Welcome message
- Benefits of completing profile
- Estimated time: 5 minutes
- "Let's Get Started" button

**Step 2: Basic Info**
- First name, last name
- Phone number
- Location (city, country)
- "Next" button

**Step 3: Skills & Experience**
- Skills input (autocomplete tags)
- Years of experience (slider or input)
- Industry/category (dropdown)
- "Next" button

**Step 4: Resume Upload**
- Drag & drop resume upload
- Or "Browse Files" button
- Supported formats: PDF, DOC, DOCX
- Max size: 5MB
- "Skip" or "Upload" button

**Step 5: Job Preferences**
- Desired job types (checkboxes)
- Desired locations (autocomplete)
- Expected salary range
- Availability (immediately, 1 month, 3 months)
- "Next" button

**Step 6: Profile Preview**
- Show summary of entered information
- "Edit" buttons for each section
- Profile completion: 100%
- "Complete Setup" button

**Post-Completion**
- Congratulations message
- "Browse Jobs" CTA
- "Go to Dashboard" button

#### UI Features
- Progress bar at top (Step 1 of 5)
- "Back" button (except on step 1)
- "Skip" option on optional steps
- Auto-save progress (localStorage or Firestore)
- Resume later option

#### User Flow
- Trigger after signup (check if profile incomplete)
- Check if onboarding completed (flag in user profile)
- Allow users to skip and resume later
- Redirect to dashboard after completion

#### Implementation Notes
- Use multi-step form pattern
- Validate each step before proceeding
- Save to Firestore at each step or at end
- Add `onboardingCompleted: boolean` to user profile
- Create reusable multi-step form component

---

## Phase 4: Analytics & Advanced (Week 4)

**Goal:** Add analytics value for agencies and admins
**Timeline:** 5-6 days
**Total Effort:** 26-32 hours

---

### 14. Agency Analytics Dashboard

**Path:** `/agency/analytics`
**Priority:** MEDIUM
**Effort:** 10-12 hours
**User Type:** Agencies only

#### Why Important
- Value proposition for agencies
- Mentioned in requirements.md (Agency Response Rate metrics)
- Help agencies optimize job postings
- Justify featured job costs

#### Features Required

**Overview Cards** (top row)
- Total Views (all jobs, last 30 days)
- Total Applications (all jobs, last 30 days)
- Application Rate (applications / views %)
- Average Response Time (time to first status change)

**Job Performance Table**
- List all jobs with metrics
- Columns:
  - Job Title
  - Posted Date
  - Status (Active/Expired)
  - Views
  - Applications
  - Application Rate
  - Shortlisted
  - Hired
- Sort by each column
- Filter by status, date range

**Charts Section**

**1. Views & Applications Over Time**
- Line chart
- Last 30 days
- Two lines: Views (blue), Applications (green)
- Hover to see exact numbers
- Date range selector

**2. Application Funnel**
- Funnel chart
- Stages: Views → Applications → Reviewing → Shortlisted → Hired
- Show drop-off percentage between stages

**3. Top Performing Jobs**
- Bar chart
- Top 5 jobs by application count
- Click to view job details

**4. Applications by Job Type**
- Pie chart
- Full-time vs Part-time vs Contract
- Show percentage

**5. Applicant Location Distribution**
- Bar chart or map
- Top 10 locations
- Count of applicants from each

**6. Experience Level Distribution**
- Bar chart
- Entry level, Mid level, Senior, Expert
- Based on applicant experience years

**Date Range Selector**
- Last 7 days
- Last 30 days
- Last 3 months
- Last year
- Custom range

**Export Report**
- "Export as CSV" button
- Download all metrics
- Include date range in filename

#### Backend Requirements

**Track Job Views:**
- New Firestore collection: `jobViews`
```typescript
interface JobView {
  id: string;
  jobId: string;
  userId?: string; // If authenticated
  viewedAt: Date;
  userAgent?: string;
}
```

**Aggregate Queries:**
- Count views per job
- Count applications per job
- Calculate application rate
- Calculate average response time

**Security Rules:**
- Agencies can only see their own analytics
- Admins can see all analytics

**Firestore Indexes:**
- `jobViews`: jobId + viewedAt DESC
- `applications`: jobId + status + createdAt

#### Implementation Notes
- Use chart library (Chart.js, Recharts, or similar)
- Cache analytics data (update daily)
- Consider using Cloud Functions for aggregation (optional)
- Add loading skeletons for charts
- Handle empty states

#### Performance Optimization
- Use pagination for job table
- Lazy load charts
- Cache aggregated data in Firestore

---

### 15. Admin Reports/Analytics

**Path:** `/admin/reports` or `/admin/analytics`
**Priority:** MEDIUM
**Effort:** 8-10 hours
**User Type:** Admin only

#### Why Important
- Platform health monitoring
- Business insights and metrics
- Make data-driven decisions
- Track growth and engagement

#### Features Required

**Platform Overview** (cards at top)
- Total Users (with breakdown)
- Total Jobs Posted
- Total Applications
- Active Agencies (verified)
- Featured Jobs Revenue (total)
- New Users This Month

**User Growth Chart**
- Line chart
- Last 12 months
- Three lines:
  - Job Hunters (blue)
  - Agencies (green)
  - Total Users (purple)
- Monthly data points

**Job Posting Trends**
- Line chart
- Last 12 months
- Jobs posted per month
- Average applications per job

**Application Trends**
- Line chart
- Last 12 months
- Total applications per month
- Application conversion rate (applications → hired)

**Popular Job Categories**
- Horizontal bar chart
- Job count by category
- Click to view category details

**Featured Job Revenue**
- Area chart
- Revenue over time (last 12 months)
- Total count of featured requests
- Average revenue per request

**Geographic Distribution**
- Map or bar chart
- User distribution by country
- Job distribution by country
- Application distribution

**User Engagement Metrics**
- Average session duration (future)
- Page views per visit (future)
- Return user rate
- Most visited pages

**Platform Health**
- Success rate (no errors)
- Average response time
- Error count (last 24 hours)
- Active sessions

**Date Range Selector**
- Last 30 days
- Last 3 months
- Last 6 months
- Last year
- All time
- Custom range

**Export Reports**
- "Export All Metrics" button
- CSV format
- Include all data for selected date range

#### Backend Requirements

**Aggregate Queries:**
- Count users by type and date
- Count jobs by category and date
- Sum featured request payments
- Calculate growth rates

**Scheduled Tasks (optional):**
- Daily aggregation job
- Store pre-calculated metrics
- Update cache

**Security:**
- Admin only access
- Log report views (audit trail)

#### Implementation Notes
- Reuse chart components from Agency Analytics
- Use consistent color scheme
- Cache aggregated data for performance
- Consider using Google Analytics integration
- Add data refresh button

---

## Phase 5: Future Enhancements

**Status:** Low priority, Phase 2 features
**Timeline:** TBD

---

### 16. Saved Searches

**Path:** `/saved-searches`
**Priority:** LOW-MEDIUM
**User Type:** Job Hunters

#### Features
- Save search queries with filters
- Quick access to frequent searches
- Edit/delete saved searches
- Apply search with one click

**Similar To:** Job Alerts, but instant search not notifications

---

### 17. Application Detail Page

**Path:** `/applications/[id]`
**Priority:** LOW
**User Type:** Job Hunters

#### Features
- Detailed view of single application
- Full application history timeline
- Communication thread with agency
- Status change history
- Edit application (if allowed)
- Withdraw application

---

### 18. Company Reviews (Phase 2)

**Path:** `/companies/[id]/reviews`
**Priority:** LOW (Future)
**User Type:** All users

#### Features
- Job hunters can leave reviews after being hired
- Star rating system
- Review text
- Anonymous option
- Helpful votes
- Agency response to reviews
- Moderation system

**Mentioned In:** requirements.md Phase 2

---

### 19. Video Profiles (Phase 2)

**Path:** `/profile/video`
**Priority:** LOW (Future)
**User Type:** Job Hunters

#### Features
- Upload video introduction (30-60 seconds)
- Showcase personality and communication skills
- Video thumbnail on profile
- Video player in public profile
- Replace with new video

**Mentioned In:** requirements.md Phase 2

---

### 20. Resume Builder (Phase 2)

**Path:** `/resume-builder`
**Priority:** LOW (Future)
**User Type:** Job Hunters

#### Features
- Template-based resume builder
- Multiple templates
- Sections: Experience, Education, Skills, etc.
- Export as PDF
- Save multiple versions
- Preview before download

**Mentioned In:** requirements.md Phase 2

---

### 21. Blog/Career Resources

**Path:** `/blog` or `/resources`
**Priority:** LOW-MEDIUM
**User Type:** All users (public)

#### Features
- Blog posts about job hunting
- Career advice articles
- Industry insights
- Resume writing tips
- Interview preparation guides
- Search and categories
- SEO optimization

---

### 22. Advanced Search/Filters

**Path:** Enhanced `/jobs` with more filters
**Priority:** LOW-MEDIUM
**User Type:** All users

#### Features
- Advanced filter UI
- More filter options:
  - Company size
  - Benefits offered
  - Posted date
  - Response rate
- Saved search functionality
- Search history
- Boolean search operators

---

## Quick Fixes

**Effort:** 1-2 hours
**Priority:** HIGH

### Broken Links to Fix

1. **Update `/auth/register` → `/auth/signup`**
   - **Files:** `app/page.tsx` (line 564), navigation components
   - **Reason:** Signup page is at `/auth/signup`

2. **Remove Design Preview Pages**
   - **Pages:** `/header-designs`, `/landing-nav-designs`, `/landing-nav-preview`
   - **Action:** Delete or make admin-only

3. **Handle `/fix-profile`**
   - **Action:** Make admin-only or remove

4. **Add Terms Link to Footer**
   - **File:** `app/page.tsx` footer section
   - **Add:** Link to `/terms`

---

## Implementation Timeline

### Overview

| Phase | Duration | Effort | Priority |
|-------|----------|--------|----------|
| Phase 1: Critical | 4-5 days | 20-27 hours | HIGH |
| Phase 2: High-Value | 5-6 days | 26-32 hours | HIGH |
| Phase 3: Enhanced UX | 4-5 days | 19-24 hours | MEDIUM |
| Phase 4: Analytics | 5-6 days | 26-32 hours | MEDIUM |
| Quick Fixes | 2-3 hours | 1-2 hours | HIGH |
| **TOTAL** | **18-23 days** | **92-117 hours** | - |

### Week-by-Week Breakdown

**Week 1 (Phase 1)**
- Day 1: Terms of Service, Quick Fixes
- Day 2: Settings Page (part 1)
- Day 3: Settings Page (part 2), Notifications (part 1)
- Day 4: Notifications (part 2)
- Day 5: FAQ/Help Center

**Week 2 (Phase 2)**
- Day 1: Job Hunter Dashboard (part 1)
- Day 2: Job Hunter Dashboard (part 2)
- Day 3: Admin User Management (part 1)
- Day 4: Admin User Management (part 2)
- Day 5: Email Verification Flow

**Week 3 (Phase 3)**
- Day 1: Agency Public Profile
- Day 2: Job Hunter Public Profile
- Day 3: Custom Error Pages, Job Alerts (part 1)
- Day 4: Job Alerts (part 2)
- Day 5: Onboarding Flow (part 1)

**Week 4 (Phase 4)**
- Day 1: Onboarding Flow (part 2)
- Day 2: Agency Analytics (part 1)
- Day 3: Agency Analytics (part 2)
- Day 4: Admin Reports (part 1)
- Day 5: Admin Reports (part 2)

---

## Technical Approach

### Consistency Guidelines

**Follow Existing Patterns:**
- Reuse layout components (Header, Footer, BottomNav)
- Use existing UI components (Button, Card, Modal, Badge)
- Follow responsive design patterns
- Match color scheme and typography
- Use Framer Motion for animations

**Code Structure:**
```typescript
// Page structure
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// ... other imports

export default function PageName() {
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (!user) router.push('/auth/login');
    if (userType !== 'expected-type') router.push('/');
  }, [user, userType]);

  // Data loading
  useEffect(() => {
    loadData();
  }, [dependencies]);

  // Handlers
  const handleAction = async () => {
    try {
      // Action logic
      toast.success('Success!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed. Please try again.');
    }
  };

  // Loading state
  if (loading) return <LoadingSkeleton />;

  // Main render
  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Data Management

**Firestore Collections:**
- Use existing COLLECTIONS constants
- Add new collections as needed
- Document security rules

**New Collections Needed:**
- `notifications` (Phase 1)
- `jobAlerts` (Phase 3)
- `jobViews` (Phase 4 - for analytics)
- `userSettings` (optional, could use existing profile)

**Security Rules:**
- Users can only access their own data
- Admins have elevated permissions
- Validate data structure
- Use field-level security

**Indexes:**
- Document all required indexes
- Add to `firestore.indexes.json`
- Deploy with Firebase CLI

### Performance Considerations

**Loading States:**
- Use skeleton loaders for all data fetches
- Show progress indicators for actions
- Implement optimistic UI updates

**Data Fetching:**
- Use pagination for large lists
- Implement infinite scroll where appropriate
- Cache frequently accessed data
- Use React Query or SWR (optional)

**Image Optimization:**
- Use Next.js Image component
- Lazy load images below fold
- Compress uploaded images

**Code Splitting:**
- Automatic with Next.js App Router
- Use dynamic imports for heavy components

### Error Handling

**User-Facing Errors:**
- Show toast notifications
- Display helpful error messages
- Provide recovery actions

**Error Boundaries:**
- Implement at page level
- Show custom error UI
- Log errors to console (or Sentry)

**Validation:**
- Client-side validation (React Hook Form + Zod)
- Server-side validation (Firestore rules)
- Show validation errors inline

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile-First:**
- Design for mobile first
- Enhance for larger screens
- Test on actual devices

**Bottom Navigation:**
- Show on mobile only
- Hide on desktop
- Update for new pages

### Testing Approach

**Manual Testing:**
- Test all user flows
- Test on multiple devices
- Test different user types
- Test error cases

**Automated Testing (Future):**
- Unit tests for components
- Integration tests for flows
- E2E tests for critical paths

### Deployment

**Environment:**
- Development: localhost
- Staging: Vercel preview (optional)
- Production: Vercel

**Checklist Before Deploy:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Security rules updated
- [ ] Indexes deployed
- [ ] Environment variables set
- [ ] Analytics configured (optional)

---

## Success Criteria

### Phase 1 Complete
- ✅ All navigation links work
- ✅ Terms of Service accessible and compliant
- ✅ Settings page functional with all options
- ✅ Notifications center shows real-time updates
- ✅ FAQ page helps reduce support inquiries

### Phase 2 Complete
- ✅ Job hunters have personalized dashboard
- ✅ Admins can effectively manage users
- ✅ Email verification prevents spam accounts
- ✅ User profiles viewable by relevant parties

### Phase 3 Complete
- ✅ Company profiles build trust and transparency
- ✅ Error pages provide helpful recovery
- ✅ Job alerts keep users engaged
- ✅ Onboarding improves profile completion rate

### Phase 4 Complete
- ✅ Agencies have actionable insights
- ✅ Admins have platform health visibility
- ✅ Data-driven decisions possible
- ✅ Analytics inform feature development

### Overall Success
- ✅ Platform is 95%+ complete
- ✅ All user journeys are complete
- ✅ No broken links or 404 errors
- ✅ Professional appearance maintained
- ✅ User satisfaction increased
- ✅ Support burden reduced

---

## Next Steps

1. **Review & Prioritize**
   - Review this document with stakeholders
   - Confirm priorities and timeline
   - Adjust based on business needs

2. **Start with Quick Fixes**
   - Fix broken links (1-2 hours)
   - Immediate UX improvement

3. **Begin Phase 1**
   - Terms of Service (day 1)
   - Settings page (days 2-3)
   - Continue with plan

4. **Track Progress**
   - Use project management tool
   - Daily standups
   - Weekly demos

5. **Iterate and Improve**
   - Gather user feedback
   - Track analytics
   - Continuously improve

---

## Notes

- This plan assumes full-time development
- Adjust timeline for part-time or multiple developers
- Some features may be built faster than estimated
- Consider user feedback and iterate
- Technical debt should be addressed alongside new features
- Security and performance should not be compromised for speed

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Maintained By:** Development Team
