# Header Components Documentation

Complete guide for using all header components in the Job Agent PH application.

## Table of Contents

1. [Overview](#overview)
2. [AgencyDashboardHeader](#agencydashboardheader)
3. [DetailPageHeader](#detailpageheader)
4. [ListingHeader](#listingheader)
5. [UserDashboardHeader](#userdashboardheader)
6. [MarketingHeader](#marketingheader)
7. [MessagesHeader](#messagesheader)
8. [ConditionalHeader](#conditionalheader)
9. [Mobile Considerations](#mobile-considerations)

---

## Overview

The application uses 6 specialized header components + 1 conditional router to provide appropriate navigation for different page types while preserving excellent mobile UX with BottomNav.

### Header Component Matrix

| Page Type | Component | Desktop | Mobile |
|-----------|-----------|---------|--------|
| Homepage | LandingNav3Enhanced | Full navigation | Category pills + BottomNav |
| Agency Dashboard | AgencyDashboardHeader | Full featured | Breadcrumbs + BottomNav |
| Job/Agency Details | DetailPageHeader | Full featured | Simplified |
| Jobs/Companies Listing | ListingHeader | Search + filters | Expandable search + BottomNav |
| User Dashboard | UserDashboardHeader | Nav tabs | Minimal + BottomNav |
| About/Contact/etc | MarketingHeader | Auto via ConditionalHeader | BottomNav |
| Messages | MessagesHeader | Full featured | Custom + No BottomNav |
| Admin | AdminLayout | Sidebar + top | Sidebar + top |
| Auth Pages | None | - | - |

---

## AgencyDashboardHeader

**Purpose:** Professional dashboard header for agency users with search, actions, and breadcrumbs.

**Used On:**
- Agency dashboard (`/agency/dashboard`)
- Post job (`/jobs/post`)
- Edit job (`/jobs/edit/[id]`)
- View applicants (`/jobs/[id]/applicants`)
- Edit agency profile

### Props

```typescript
interface AgencyDashboardHeaderProps {
  breadcrumbs?: Breadcrumb[];          // Navigation breadcrumb trail
  searchPlaceholder?: string;          // Search input placeholder
  onSearch?: (query: string) => void;  // Search submit callback
  showPostJobButton?: boolean;         // Show/hide Post Job button (default: true)
}

interface Breadcrumb {
  label: string;  // Display text
  href?: string;  // Optional link (last crumb is usually not a link)
}
```

### Example Usage

```tsx
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader';

export default function AgencyDashboard() {
  const handleSearch = (query: string) => {
    // Handle search logic
    console.log('Searching for:', query);
  };

  return (
    <>
      <AgencyDashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/agency/dashboard' },
          { label: 'My Jobs' }
        ]}
        searchPlaceholder="Search your jobs..."
        onSearch={handleSearch}
        showPostJobButton={true}
      />
      <div className="pt-20 md:pt-32">
        {/* Page content - Note the padding-top for fixed header */}
      </div>
    </>
  );
}
```

### Features

**Desktop:**
- Company logo
- Search bar (center, 40% width)
- Breadcrumbs (below main header)
- Post Job button (primary CTA)
- Notifications bell
- Agency profile dropdown with logout

**Mobile:**
- Breadcrumbs only
- BottomNav provides main navigation

---

## DetailPageHeader

**Purpose:** Header for detail pages with back button, breadcrumbs, and action buttons.

**Used On:**
- Job details (`/jobs/[id]`)
- Agency profile (`/agencies/[id]`)

### Props

```typescript
interface DetailPageHeaderProps {
  breadcrumbs?: Breadcrumb[];  // Breadcrumb trail
  title?: string;              // Page title (optional)
  actions?: ActionButton[];    // Action buttons array
  onBack?: () => void;         // Custom back handler (default: router.back())
}

interface ActionButton {
  icon: LucideIcon;     // Icon component from lucide-react
  label: string;        // Button label
  onClick: () => void;  // Click handler
  primary?: boolean;    // Primary button styling (default: false)
  variant?: 'default' | 'outline' | 'ghost';  // Button variant
}
```

### Example Usage

```tsx
import DetailPageHeader from '@/components/layout/DetailPageHeader';
import { Heart, Share2, Send } from 'lucide-react';

export default function JobDetail({ job }: { job: Job }) {
  return (
    <>
      <DetailPageHeader
        breadcrumbs={[
          { label: 'Jobs', href: '/jobs' },
          { label: job.category, href: `/jobs?category=${job.category}` },
          { label: job.title }
        ]}
        title={job.title}
        actions={[
          {
            icon: Heart,
            label: 'Save',
            onClick: () => handleSave(job.id),
            variant: 'outline'
          },
          {
            icon: Share2,
            label: 'Share',
            onClick: () => handleShare(job),
            variant: 'ghost'
          },
          {
            icon: Send,
            label: 'Apply',
            onClick: () => handleApply(job.id),
            primary: true
          }
        ]}
        onBack={() => router.push('/jobs')}
      />
      <div className="pt-16 md:pt-20">
        {/* Page content */}
      </div>
    </>
  );
}
```

### Features

**Desktop:**
- Back button
- Full breadcrumb trail
- Page title (optional)
- All action buttons displayed
- Sticky on scroll

**Mobile:**
- Back button
- Current page title (from breadcrumbs)
- Primary actions only (icons)
- Compact layout

---

## ListingHeader

**Purpose:** Header for listing pages with prominent search and filters.

**Used On:**
- Jobs listing (`/jobs`)
- Companies listing (`/companies`)
- Search page (`/search`)

### Props

```typescript
interface ListingHeaderProps {
  breadcrumbs?: Breadcrumb[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
  onFilterClick?: () => void;
  showFilters?: boolean;          // Current filter panel state
  showSearchButton?: boolean;     // Show search button (default: true)
}
```

### Example Usage

```tsx
import ListingHeader from '@/components/layout/ListingHeader';
import { useState } from 'react';

export default function JobsListing() {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <ListingHeader
        breadcrumbs={[
          { label: 'Jobs' }
        ]}
        searchPlaceholder="Search jobs, companies, skills..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={(query) => handleSearch(query)}
        onFilterClick={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        showSearchButton={true}
      />
      <div className="pt-16 md:pt-24">
        {/* Filters panel, job list, etc. */}
      </div>
    </>
  );
}
```

### Features

**Desktop:**
- Logo
- Large search bar (center, 50% width)
- Filter button
- Search button (when search value exists)
- User profile dropdown or Login/Sign Up
- Breadcrumbs (if provided)

**Mobile:**
- Expandable search (tap to expand)
- Filter and Search buttons
- BottomNav for main navigation

---

## UserDashboardHeader

**Purpose:** Navigation header for authenticated job hunter users.

**Used On:**
- Profile (`/profile`)
- Applications (`/profile/applications`)
- Saved Jobs (`/saved-jobs`)
- Notifications (`/notifications`)

### Props

```typescript
interface UserDashboardHeaderProps {
  showNotifications?: boolean;  // Show notification bell (default: true)
}
```

### Example Usage

```tsx
import UserDashboardHeader from '@/components/layout/UserDashboardHeader';

export default function ProfilePage() {
  return (
    <>
      <UserDashboardHeader showNotifications={true} />
      <div className="pt-16 md:pt-20">
        {/* Page content */}
      </div>
    </>
  );
}
```

### Features

**Desktop:**
- Logo
- Navigation tabs (Profile, Applications, Saved Jobs, Messages)
- Active tab highlighting
- Unread message badges
- Notification bell
- User avatar dropdown

**Mobile:**
- Logo
- Notification bell
- User avatar
- BottomNav provides tab navigation

---

## MarketingHeader

**Purpose:** Simple, clean header for marketing/informational pages.

**Used On:**
- About (`/about`)
- Contact (`/contact`)
- Privacy (`/privacy`)
- FAQ (`/faq`)
- Resources (`/resources`)

**Note:** This header is automatically applied by ConditionalHeader. No manual integration needed!

### Props

None - fully automatic.

### Features

**Desktop:**
- Logo
- Navigation links (Jobs, Companies, About, Contact)
- Active link highlighting
- Login button
- Sign Up button (primary CTA)

**Mobile:**
- Hidden (BottomNav provides navigation)

---

## MessagesHeader

**Purpose:** Specialized header for messaging with list and conversation modes.

**Used On:**
- Messages list (`/messages`)
- Conversation (`/messages/[id]`)

### Props

```typescript
interface MessagesHeaderProps {
  mode: 'list' | 'conversation';  // Required: header mode

  // List mode props
  onSearch?: (query: string) => void;
  onNewMessage?: () => void;

  // Conversation mode props
  contactName?: string;
  contactAvatar?: string;
  isOnline?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMore?: () => void;
}
```

### Example Usage

**List Mode:**
```tsx
import MessagesHeader from '@/components/layout/MessagesHeader';

export default function MessagesList() {
  return (
    <>
      <MessagesHeader
        mode="list"
        onSearch={(query) => handleSearch(query)}
        onNewMessage={() => router.push('/messages/new')}
      />
      <div className="pt-14 md:pt-16">
        {/* Conversations list */}
      </div>
    </>
  );
}
```

**Conversation Mode:**
```tsx
export default function Conversation({ contact }: { contact: Contact }) {
  return (
    <>
      <MessagesHeader
        mode="conversation"
        contactName={contact.name}
        contactAvatar={contact.avatar}
        isOnline={contact.isOnline}
        onBack={() => router.push('/messages')}
        onCall={() => handleCall(contact.id)}
        onVideoCall={() => handleVideoCall(contact.id)}
        onMore={() => setShowOptions(true)}
      />
      <div className="pt-14">
        {/* Message thread */}
      </div>
    </>
  );
}
```

### Features

**List Mode:**
- Title: "Messages"
- Search bar
- New Message button
- Mobile: Expandable search

**Conversation Mode:**
- Back button
- Contact avatar + name
- Online status indicator
- Call, Video call, More actions
- Mobile: Simplified actions

---

## ConditionalHeader

**Purpose:** Intelligent router that automatically selects the appropriate header based on page path and user type.

**Location:** `app/layout.tsx` (already integrated)

### Routing Logic

```typescript
// Homepage → No header (uses LandingNav3Enhanced in page)
'/' → null

// Admin pages → No header (uses AdminLayout)
'/admin/*' → null

// Auth pages → No header
'/auth/*' → null

// Marketing pages → MarketingHeader (automatic)
'/about', '/contact', '/privacy', '/faq', '/resources' → MarketingHeader

// Agency pages → Handled in page components
userType === 'agency' && '/agency/*' → null (page handles it)

// User dashboard → Handled in page components
userType === 'job-hunter' && '/profile*', '/saved-jobs', '/messages' → null

// Listing pages → Handled in page components
'/jobs', '/companies', '/search' → null

// Default → Simple Header
* → Header
```

### How It Works

ConditionalHeader is already included in `app/layout.tsx`:

```tsx
<body>
  <AuthProvider>
    <OnboardingProvider>
      <ConditionalHeader />  {/* ← Automatically routes headers */}
      {children}
      <BottomNav />
    </OnboardingProvider>
  </AuthProvider>
</body>
```

For pages that need specific headers (agency, user dashboard, listing), add the header directly in the page component. ConditionalHeader will return `null` to avoid duplication.

---

## Mobile Considerations

### Critical Mobile Rules

✅ **DO:**
- Always add `pt-14` or `pt-16` to page content for fixed header clearance
- Use `pt-20` or `pt-24` if header has breadcrumbs
- Preserve BottomNav functionality (already in layout)
- Use simplified headers on mobile (icons only for actions)
- Keep touch targets minimum 44px

❌ **DON'T:**
- Remove or hide BottomNav (it's the primary mobile navigation)
- Forget padding-top on page content (content will be hidden under header)
- Use complex multi-line headers on mobile
- Add too many action buttons on mobile (max 2-3)

### Responsive Padding Guide

```tsx
// Simple header (no breadcrumbs)
<div className="pt-14 md:pt-16">

// Header with breadcrumbs
<div className="pt-16 md:pt-24">

// Agency dashboard with breadcrumbs
<div className="pt-20 md:pt-32">
```

### BottomNav Integration

BottomNav is controlled in `components/layout/BottomNav.tsx`:

**Visible on:**
- All pages except: auth pages, job detail, conversation pages, homepage desktop

**Position:**
- Mobile: `bottom-0` (bottom of screen)
- Desktop: `md:top-0` (top of screen, below header)

**Special Cases:**
- Homepage: Hidden on desktop (via `isHomepage` check)
- Conversation: Hidden completely
- Job detail: Hidden completely

---

## Best Practices

### 1. Always Read Current Header State

Before adding a header, check ConditionalHeader to see if it's already handled:

```tsx
// ❌ BAD - Will create double header
import Header from '@/components/layout/Header';

export default function Page() {
  return (
    <>
      <Header />  {/* ConditionalHeader may also render a header! */}
      <div>Content</div>
    </>
  );
}

// ✅ GOOD - Check ConditionalHeader first
// If ConditionalHeader returns null for your route, add header in page
import AgencyDashboardHeader from '@/components/layout/AgencyDashboardHeader';

export default function AgencyDashboard() {
  return (
    <>
      <AgencyDashboardHeader {...props} />
      <div className="pt-20 md:pt-32">Content</div>
    </>
  );
}
```

### 2. Use Correct Padding

```tsx
// Match padding to header height + breadcrumbs
<DetailPageHeader breadcrumbs={[...]} />
<div className="pt-16 md:pt-24">  {/* Accounts for breadcrumbs */}
  Content
</div>
```

### 3. Provide All Required Props

```tsx
// ❌ BAD - Missing required callbacks
<ListingHeader searchValue={search} />

// ✅ GOOD - All props provided
<ListingHeader
  searchValue={search}
  onSearchChange={setSearch}
  onSearchSubmit={handleSearch}
  onFilterClick={() => setShowFilters(!showFilters)}
  showFilters={showFilters}
/>
```

### 4. Test Mobile Layout

Always test with:
- Mobile viewport (375px, 414px)
- Tablet viewport (768px, 1024px)
- Desktop viewport (1280px+)
- Touch interactions
- BottomNav visibility and functionality

---

## Troubleshooting

### Double Headers Appearing

**Problem:** Two headers showing on the same page.

**Solution:**
1. Check ConditionalHeader - is it rendering for your route?
2. Remove header from page component if ConditionalHeader handles it
3. Or add route to ConditionalHeader's exclusion list

### Content Hidden Under Header

**Problem:** Page content starts behind fixed header.

**Solution:**
Add padding-top to content container:

```tsx
<div className="pt-14 md:pt-16">  {/* Adjust based on header height */}
  {content}
</div>
```

### BottomNav Not Showing on Mobile

**Problem:** Bottom navigation missing on mobile.

**Solution:**
1. Check BottomNav.tsx - is the route excluded?
2. Ensure body has `pb-14` class (already in layout.tsx)
3. Don't override BottomNav visibility

### Mobile Header Too Tall

**Problem:** Header takes up too much vertical space on mobile.

**Solution:**
- Use minimal mobile headers (h-14 = 56px standard)
- Hide breadcrumbs on mobile for some headers
- Show action icons only (no labels)
- Collapse search bars until tapped

---

## Component Hierarchy

```
app/layout.tsx
├── AuthProvider
│   └── OnboardingProvider
│       ├── ConditionalHeader (Smart router)
│       │   ├── MarketingHeader (auto for about, contact, etc.)
│       │   ├── Header (default fallback)
│       │   └── null (for pages with custom headers)
│       ├── {children} (Page content)
│       │   ├── AgencyDashboardHeader (in agency pages)
│       │   ├── DetailPageHeader (in detail pages)
│       │   ├── ListingHeader (in listing pages)
│       │   ├── UserDashboardHeader (in user pages)
│       │   ├── MessagesHeader (in message pages)
│       │   └── LandingNav3Enhanced (homepage only)
│       └── BottomNav (Always present, conditionally hidden)
```

---

## Quick Reference

| Need | Use Component | Import |
|------|--------------|--------|
| Agency pages | AgencyDashboardHeader | `@/components/layout/AgencyDashboardHeader` |
| Job/Agency details | DetailPageHeader | `@/components/layout/DetailPageHeader` |
| Jobs/Companies list | ListingHeader | `@/components/layout/ListingHeader` |
| User profile/apps | UserDashboardHeader | `@/components/layout/UserDashboardHeader` |
| About/Contact | Auto (MarketingHeader) | - |
| Messages | MessagesHeader | `@/components/layout/MessagesHeader` |
| Default | Auto (Header) | - |

---

## Support

For questions or issues:
1. Check this documentation
2. Review ConditionalHeader.tsx routing logic
3. Inspect BottomNav.tsx for mobile navigation
4. Test in browser DevTools with mobile viewport

**Remember:** Homepage header (LandingNav3Enhanced) and mobile navigation (BottomNav) are perfect and preserved! All new headers work around them.
