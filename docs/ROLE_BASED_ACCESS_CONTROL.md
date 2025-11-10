# Role-Based Access Control (RBAC) Guide

This document explains how to use the role-based access control system in the Job Agent PH application.

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Components & Hooks](#components--hooks)
4. [Usage Examples](#usage-examples)
5. [Route Protection](#route-protection)
6. [Best Practices](#best-practices)

---

## Overview

The application implements a comprehensive role-based access control system that:

- Shows/hides components based on user authentication status
- Displays different UI elements for different user roles (Admin, Agency, Job Hunter)
- Prompts guests to sign up when accessing protected features
- Protects routes at both client and server level

---

## User Roles

### Guest (Unauthenticated)
- Can browse homepage, job listings, and company pages
- Sees signup prompts when trying to apply, save jobs, or message agencies
- Limited to read-only access

### Job Hunter (`jobhunter`)
- Can apply to jobs
- Can save jobs (synced to account)
- Can message agencies
- Can track applications
- Has access to profile and saved jobs pages

### Agency (`agency`)
- Can post and edit job listings
- Can view and manage applicants
- Can message job hunters
- Has access to agency dashboard
- Cannot apply to jobs

### Admin (`admin`)
- Can manage users
- Can feature jobs
- Can approve/reject featured job requests
- Has access to admin dashboard
- Platform-wide management capabilities

---

## Components & Hooks

### 1. SignupModal

A complete authentication modal with signup and login forms.

**Features:**
- Email/password signup and login
- Google and Facebook social login
- Form validation with visual feedback
- Password strength indicator
- Context-aware messaging (explains why signup is needed)

**Usage:**
```tsx
import SignupModal from '@/components/auth/SignupModal';

<SignupModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  context={{
    action: 'apply',
    title: 'Sign up to apply',
    description: 'Create a free account to apply to this job',
    benefit: 'Get real-time updates and directly message agencies',
    jobId: job.id,
    returnUrl: `/jobs/${job.id}`,
    userType: 'jobhunter', // Optional: defaults to 'jobhunter'
  }}
  onSuccess={() => {
    // Called after successful authentication
    console.log('User signed up/logged in');
  }}
/>
```

---

### 2. useRequireAuth Hook

A custom hook that wraps actions requiring authentication.

**Features:**
- Automatically checks if user is authenticated
- Shows signup modal if not authenticated
- Verifies user has required role
- Manages modal state

**Usage:**
```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

function JobDetailsPage() {
  const {
    handleAction,
    showAuthPrompt,
    setShowAuthPrompt,
    authPromptContext,
    isAuthenticated,
    hasRequiredRole,
  } = useRequireAuth(
    {
      action: 'apply',
      title: 'Sign up to apply',
      description: 'Create a free account to apply to this job',
      benefit: 'Get real-time updates and directly message agencies',
      jobId: job.id,
      returnUrl: `/jobs/${job.id}`,
      requiredUserType: 'jobhunter', // Optional
      signupUserType: 'jobhunter', // Optional
    },
    () => {
      // This callback only runs if authenticated and has correct role
      setShowApplicationModal(true);
    }
  );

  return (
    <>
      <button onClick={handleAction}>Apply Now</button>

      <SignupModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        context={authPromptContext}
      />
    </>
  );
}
```

---

### 3. RoleGuard Component

Shows content only to users with specific roles.

**Usage:**
```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

// Show only to agencies
<RoleGuard allowedRoles={['agency']}>
  <PostJobButton />
</RoleGuard>

// Show only to job hunters, with fallback
<RoleGuard
  allowedRoles={['jobhunter']}
  fallback={<p>Only job hunters can apply</p>}
>
  <ApplyButton />
</RoleGuard>

// Show to multiple roles
<RoleGuard allowedRoles={['agency', 'admin']}>
  <ManageJobsPanel />
</RoleGuard>

// With loading state
<RoleGuard allowedRoles={['jobhunter']} showLoading>
  <ApplicationHistory />
</RoleGuard>
```

---

### 4. RequireAuth Component

Shows content only to authenticated users (any role).

**Usage:**
```tsx
import { RequireAuth } from '@/components/auth/RoleGuard';

// Show only to logged-in users
<RequireAuth fallback={<LoginPrompt />}>
  <UserDashboard />
</RequireAuth>

// Simple auth check
<RequireAuth>
  <SaveButton />
</RequireAuth>

// With loading state
<RequireAuth showLoading>
  <ProtectedContent />
</RequireAuth>
```

---

### 5. IfGuest Component

Shows content only to unauthenticated users.

**Usage:**
```tsx
import { IfGuest } from '@/components/auth/RoleGuard';

<IfGuest>
  <div className="banner">
    <h3>Sign up to unlock all features!</h3>
    <SignupButton />
  </div>
</IfGuest>
```

---

### 6. IfRole Component

Shows content only to users with a specific role.

**Usage:**
```tsx
import { IfRole } from '@/components/auth/RoleGuard';

<IfRole role="agency">
  <PostJobButton />
</IfRole>

<IfRole role="admin">
  <AdminPanel />
</IfRole>

<IfRole role="jobhunter">
  <ApplyButton />
</IfRole>
```

---

### 7. AuthRequiredButton Component

A button that automatically handles authentication checks.

**Features:**
- Built-in auth checking
- Automatic signup modal display
- Role verification
- Wraps the standard Button component

**Usage:**
```tsx
import AuthRequiredButton from '@/components/auth/AuthRequiredButton';

<AuthRequiredButton
  action="apply"
  promptTitle="Sign up to apply"
  promptDescription="Create a free account to apply to this job"
  promptBenefit="Get real-time updates and message agencies"
  jobId={job.id}
  returnUrl={`/jobs/${job.id}`}
  requiredUserType="jobhunter"
  onClick={() => setShowApplicationModal(true)}
  variant="primary"
  size="lg"
  fullWidth
>
  Apply Now
</AuthRequiredButton>

// Save job button example
<AuthRequiredButton
  action="save"
  promptTitle="Sign up to save jobs"
  promptDescription="Create an account to save and organize your job searches"
  promptBenefit="Build your personalized job collection"
  onClick={handleSaveJob}
  variant="outline"
  icon={<Bookmark />}
>
  Save Job
</AuthRequiredButton>
```

---

## Usage Examples

### Example 1: Job Details Page with Apply Button

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthRequiredButton from '@/components/auth/AuthRequiredButton';
import ApplicationModal from '@/components/applications/ApplicationModal';

export default function JobDetailsPage({ job }) {
  const { user, userType } = useAuth();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>

      <AuthRequiredButton
        action="apply"
        promptTitle="Sign up to apply"
        promptDescription="Create a free account to apply to this job"
        promptBenefit="Get real-time updates and directly message agencies"
        jobId={job.id}
        returnUrl={`/jobs/${job.id}`}
        requiredUserType="jobhunter"
        onClick={() => setShowApplicationModal(true)}
        variant="primary"
        size="lg"
      >
        Apply Now
      </AuthRequiredButton>

      {showApplicationModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </div>
  );
}
```

---

### Example 2: Navigation with Role-Based Items

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { RoleGuard, IfRole, IfGuest } from '@/components/auth/RoleGuard';
import Link from 'next/link';

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return <NavSkeleton />;
  }

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/jobs">Browse Jobs</Link>

      <IfRole role="agency">
        <Link href="/jobs/post">Post Job</Link>
        <Link href="/agency/dashboard">Dashboard</Link>
      </IfRole>

      <IfRole role="jobhunter">
        <Link href="/profile/applications">Applications</Link>
        <Link href="/saved-jobs">Saved Jobs</Link>
      </IfRole>

      <RoleGuard allowedRoles={['agency', 'jobhunter']}>
        <Link href="/messages">Messages</Link>
      </RoleGuard>

      <IfRole role="admin">
        <Link href="/admin/dashboard">Admin Panel</Link>
      </IfRole>

      <IfGuest>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/signup">Sign Up</Link>
      </IfGuest>
    </nav>
  );
}
```

---

### Example 3: Dashboard with Multiple Role Checks

```tsx
'use client';

import { RoleGuard, RequireAuth } from '@/components/auth/RoleGuard';
import AgencyDashboard from '@/components/agency/AgencyDashboard';
import JobHunterDashboard from '@/components/jobhunter/JobHunterDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginPrompt from '@/components/auth/LoginPrompt';

export default function DashboardPage() {
  return (
    <RequireAuth fallback={<LoginPrompt />}>
      <div>
        <RoleGuard allowedRoles={['agency']}>
          <AgencyDashboard />
        </RoleGuard>

        <RoleGuard allowedRoles={['jobhunter']}>
          <JobHunterDashboard />
        </RoleGuard>

        <RoleGuard allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleGuard>
      </div>
    </RequireAuth>
  );
}
```

---

## Route Protection

### Middleware (Server-Side)

The application includes middleware that protects routes at the server level.

**Protected Routes:**
- `/profile/*` - User profile and settings
- `/agency/*` - Agency dashboard and features
- `/admin/*` - Admin panel
- `/messages/*` - Messaging system
- `/notifications` - Notifications page
- `/saved-jobs` - Saved jobs page
- `/applications` - Applications tracking

**Public Routes:**
- `/` - Homepage
- `/jobs/*` - Job listings and details
- `/companies` - Company directory
- `/about` - About page
- `/auth/*` - Authentication pages

**How it works:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = ['/profile', '/agency', '/admin', '/messages', '/notifications', '/saved-jobs', '/applications']
    .some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for auth session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```

---

### Client-Side Protection

In addition to middleware, pages can implement their own client-side checks:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/protected-page');
    }

    if (!loading && userType !== 'agency') {
      router.push('/'); // Redirect non-agencies
    }
  }, [user, userType, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || userType !== 'agency') {
    return null;
  }

  return <PageContent />;
}
```

---

## Best Practices

### 1. Always Use Loading States

Prevent flash of wrong content by checking the `loading` state:

```tsx
const { user, userType, loading } = useAuth();

if (loading) {
  return <Skeleton />;
}

return user ? <AuthenticatedView /> : <GuestView />;
```

---

### 2. Use Appropriate Components for Each Use Case

| Use Case | Component/Hook |
|----------|----------------|
| Simple role check | `<IfRole>` or `<RoleGuard>` |
| Auth check (any role) | `<RequireAuth>` |
| Guest-only content | `<IfGuest>` |
| Button with auth | `<AuthRequiredButton>` |
| Custom action with auth | `useRequireAuth` hook |

---

### 3. Provide Clear Context in Auth Prompts

Always explain WHY authentication is needed:

```tsx
context={{
  action: 'apply',
  title: 'Sign up to apply', // Clear action
  description: 'Create a free account to apply to this job', // What they need to do
  benefit: 'Get real-time updates and directly message agencies', // Why they should do it
}}
```

---

### 4. Implement Both Server and Client Protection

For sensitive routes, use both:

1. **Middleware** (server-side) - Prevents unauthorized access
2. **Client-side checks** - Better UX with immediate feedback

---

### 5. Handle Role Mismatches Gracefully

Don't just hide content - provide helpful feedback:

```tsx
<RoleGuard
  allowedRoles={['jobhunter']}
  fallback={
    <div className="alert">
      <p>Only job hunters can apply to jobs.</p>
      <Link href="/auth/signup?type=jobhunter">Create a Job Hunter Account</Link>
    </div>
  }
>
  <ApplyButton />
</RoleGuard>
```

---

### 6. Use Consistent Naming

Follow these conventions:

- `action` - Describes what the user wants to do (apply, save, message)
- `userType` - The role type (jobhunter, agency, admin)
- `requiredUserType` - The role required for an action
- `signupUserType` - The role to assign on signup (defaults to jobhunter)

---

## Migration Guide

### Replacing Old Alert-Based Patterns

**Before:**
```tsx
const handleSave = () => {
  if (!user) {
    alert('Please log in to save jobs');
    router.push('/auth/login');
    return;
  }
  saveJob();
};

<button onClick={handleSave}>Save Job</button>
```

**After:**
```tsx
const [showAuthModal, setShowAuthModal] = useState(false);

const handleSave = () => {
  if (!user) {
    setShowAuthModal(true);
    return;
  }
  saveJob();
};

return (
  <>
    <button onClick={handleSave}>Save Job</button>
    <SignupModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      context={{
        action: 'save',
        title: 'Sign up to save jobs',
        description: 'Create an account to save jobs',
        benefit: 'Build your personalized job collection',
      }}
    />
  </>
);
```

**Or even better, use AuthRequiredButton:**
```tsx
<AuthRequiredButton
  action="save"
  promptTitle="Sign up to save jobs"
  promptDescription="Create an account to save jobs"
  promptBenefit="Build your personalized job collection"
  onClick={saveJob}
  variant="outline"
>
  Save Job
</AuthRequiredButton>
```

---

## Summary

The role-based access control system provides:

✅ **Completed SignupModal** - Full authentication flow with email and social login
✅ **useRequireAuth hook** - Easy auth checking for any action
✅ **RoleGuard components** - Declarative role-based rendering
✅ **AuthRequiredButton** - Drop-in replacement for auth-protected buttons
✅ **Consistent auth prompts** - No more alerts, professional modals instead
✅ **Server-side protection** - Middleware secures routes at the edge
✅ **Loading states** - Prevents flash of wrong content

For questions or issues, refer to the component source code or contact the development team.
