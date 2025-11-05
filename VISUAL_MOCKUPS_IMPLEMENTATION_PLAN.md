# Visual Mockups Implementation Plan
## Job-Agent-PH Application

**Document Version:** 1.0
**Created:** November 2025
**Timeline:** 20 working days
**Risk Level:** Medium

---

## Table of Contents
1. [Architecture Analysis](#architecture-analysis)
2. [Current State Assessment](#current-state-assessment)
3. [Implementation Phases](#implementation-phases)
4. [Component Architecture Changes](#component-architecture-changes)
5. [Dependencies](#dependencies)
6. [Key Decisions](#key-decisions)
7. [Timeline & Resources](#timeline--resources)

---

## Architecture Analysis

### Current Tech Stack
- **Framework:** Next.js 15.0.0 with App Router
- **UI Library:** React 19.0.0
- **Language:** TypeScript 5.0.0 (strict mode)
- **Styling:** Tailwind CSS 3.4.0
- **Animations:** Framer Motion 12.23.24
- **Icons:** Lucide React 0.462.0
- **Forms:** React Hook Form 7.65.0 + Zod 4.1.12
- **Backend:** Firebase 11.0.2 (Firestore, Auth, Storage)
- **State:** React Context API (AuthContext)
- **Notifications:** React Hot Toast 2.6.0

### Current Theme System
**Color Palette (Current):**
- Primary: Blue #2563eb (modern blue) ⭐ KEEPING THIS
- Accent: Purple #d946ef (magenta) ⭐ KEEPING THIS
- Shadows: Soft, glow effects
- Typography: Inter font family

**Design Characteristics:**
- Modern, clean, gradient-heavy
- Glass morphism effects
- Mobile-first responsive design
- Extensive Framer Motion animations

**Note:** The implementation will use the existing modern tech theme colors rather than switching to Philippine patriotic colors. This maintains brand consistency and reduces implementation complexity.

### Authentication Strategy
**Browse-First Approach:**
- Unauthenticated users can freely browse the app
- No forced login on landing
- Auth prompts appear only when attempting protected actions:
  - Applying to jobs
  - Saving jobs
  - Messaging agencies
  - Viewing saved items
  - Accessing profile/applications
  - Using AI assistant (advanced features)
- Guest users see all job listings, details, and public content
- Smooth transition to signup with "Sign up to continue" modals

---

## Current State Assessment

### ✅ What Currently Exists
1. **Component Library**
   - Button, Card, Badge, Modal components
   - JobCard with responsive design
   - Loading skeletons
   - Form components (React Hook Form)

2. **Layout Components**
   - Header with navigation
   - BottomNav for mobile
   - AdminLayout and AdminSidebar

3. **Theme System**
   - Comprehensive color palette
   - Tailwind configuration
   - Custom shadows and animations
   - Responsive breakpoints (xs to 2xl)

4. **Animation System**
   - Framer Motion integrated
   - Reusable animation presets (`lib/animations.ts`)
   - Hover and transition effects

5. **Utilities**
   - `cn()` function for class merging
   - Toast notifications
   - Type-safe routing

### 🔨 What Needs to be Built

#### Theme Enhancements
- ✅ Keep existing modern theme (Blue #2563eb + Purple #d946ef)
- ❌ Dark mode toggle and persistence
- ❌ DMW verification badge styling (using current blue/purple palette)
- ❌ Country flag support
- ❌ Add gold accent (#FCD116) for special highlights only (awards, featured badges)

#### Missing UI Components
- ❌ Progress Bar (for profile completion)
- ❌ Step Indicator (dots/numbered)
- ❌ Chip/Tag component (skills, countries)
- ❌ Bottom Sheet Modal (swipeable)
- ❌ Timeline component (deployment tracker)
- ❌ Stat Card (profile statistics)
- ❌ Empty State component
- ❌ Error State component
- ❌ Dropdown menu
- ❌ Tabs component
- ❌ Select/Combobox (enhanced)
- ❌ Date picker integration

#### New Features from Mockups
- ❌ Splash screen with animation
- ❌ Welcome carousel (3 slides) - shown once, optional
- ❌ Account type selection
- ❌ Multi-step profile wizard (5 steps)
- ❌ Swipe cards (Tinder-style browsing)
- ❌ GABAY AI chatbot interface (basic free for guests, advanced for users)
- ❌ Deployment tracker (authenticated users only)
- ❌ Cost calculator modal (available to all)
- ❌ Enhanced filter system (available to all)
- ❌ Recent searches (localStorage for guests, synced for users)
- ❌ Quick action cards
- ❌ Confetti success animation
- ❌ "Sign up to continue" modal component
- ❌ Auth state detection and routing

---

## Implementation Phases

### Phase 1: Theme System Enhancement (Days 1-2)

#### Objective
Enhance existing modern theme system with additional accent colors and establish design system foundation for mockup implementation.

#### Tasks
1. **Enhance Tailwind Configuration**
   - Keep primary colors: Blue #2563eb (primary-600)
   - Keep accent colors: Purple #d946ef (accent-500)
   - Add gold accent (#FCD116) for special highlights:
     - Featured badges
     - Award icons
     - Premium indicators
   - Refine status colors:
     - Success Green: #28a745 (verified badges, success states)
     - Warning Amber: #ff9800 (pending, attention needed)
     - Error Red: #dc3545 (errors, rejections)
     - Info Blue: #17a2b8 (informational tooltips)

2. **Enhance Global CSS Variables**
   - Keep existing: `--primary-blue: #2563eb`
   - Keep existing: `--accent-color: #8b5cf6`
   - Add: `--gold-accent: #FCD116` (for featured/premium items)
   - Add: `--success-green: #28a745`
   - Add: `--warning-amber: #ff9800`
   - Optimize shadow colors for new components

3. **Create Color Constants File**
   - Create `lib/colors.ts`
   - Export theme color constants
   - Add semantic color mappings (e.g., verified, featured, urgent)
   - Add country flag emoji constants
   - Document color usage guidelines

4. **Audit Existing Components**
   - Review all Button variants (ensure consistency)
   - Review Card hover states
   - Review Badge color variants
   - Ensure focus ring colors meet accessibility standards

#### Files to Modify
- `tailwind.config.ts`
- `app/globals.css`
- `lib/colors.ts` (new)
- `components/ui/Button.tsx`
- `components/ui/Badge.tsx`

#### Success Criteria
- [ ] Enhanced color palette extends existing theme harmoniously
- [ ] Gold accent (#FCD116) added for special highlights
- [ ] No visual regressions in existing screens
- [ ] All components use consistent color system
- [ ] Dark mode color variants defined (for future Phase 6)
- [ ] Color constants exported and documented with usage examples

---

### Phase 2: Core UI Components (Days 3-5)

#### Objective
Build foundational UI components required by mockup designs.

#### Components to Build

##### 1. Progress Bar Component
**File:** `components/ui/ProgressBar.tsx`

**Features:**
- Percentage-based fill
- Color variants (primary, success, warning)
- Size variants (sm, md, lg)
- Optional label display
- Smooth animation

**Usage:**
```tsx
<ProgressBar value={85} label="Profile Complete" />
```

##### 2. Step Indicator Component
**File:** `components/ui/StepIndicator.tsx`

**Features:**
- Dot style (carousel navigation)
- Numbered style (wizard steps)
- Active/complete/incomplete states
- Clickable navigation
- Responsive sizing

**Usage:**
```tsx
<StepIndicator steps={5} currentStep={2} type="numbered" />
```

##### 3. Chip/Tag Component
**File:** `components/ui/Chip.tsx`

**Features:**
- Removable (with X button)
- Icon support (country flags, skill icons)
- Size variants
- Color variants
- Clickable/selectable states

**Usage:**
```tsx
<Chip label="Nursing" icon="💉" onRemove={() => {}} />
```

##### 4. Bottom Sheet Modal
**File:** `components/ui/BottomSheet.tsx`

**Features:**
- Swipe-to-dismiss gesture
- Drag handle at top
- Backdrop overlay
- Snap points (half, full)
- iOS-style rounded corners
- Safe area support

**Usage:**
```tsx
<BottomSheet isOpen={isOpen} onClose={onClose}>
  <FilterContent />
</BottomSheet>
```

##### 5. Timeline Component
**File:** `components/ui/Timeline.tsx`

**Features:**
- Vertical layout
- Step status icons (✓, ⏳, ○)
- Color-coded states
- Expandable details
- Progress line connection

**Usage:**
```tsx
<Timeline steps={deploymentSteps} currentStep={3} />
```

##### 6. Stat Card Component
**File:** `components/ui/StatCard.tsx`

**Features:**
- Icon + number + label
- Color variants
- Hover effects
- Optional action link
- Responsive grid layout

**Usage:**
```tsx
<StatCard icon={<BriefcaseIcon />} value={12} label="Applied" />
```

##### 7. Empty State Component
**File:** `components/ui/EmptyState.tsx`

**Features:**
- Illustration/icon
- Heading + description
- Primary CTA button
- Secondary action link
- Center-aligned layout

**Usage:**
```tsx
<EmptyState
  icon="📭"
  title="No applications yet"
  description="Start your OFW journey!"
  action={{ label: "Browse Jobs", href: "/jobs" }}
/>
```

##### 8. Error State Component
**File:** `components/ui/ErrorState.tsx`

**Features:**
- Error icon
- Error message
- Error code display
- Retry button
- Support link
- Offline fallback

**Usage:**
```tsx
<ErrorState
  message="Couldn't load jobs"
  code="NET_001"
  onRetry={() => refetch()}
/>
```

#### Success Criteria
- [ ] All 8 components built and typed
- [ ] Storybook documentation (optional)
- [ ] Responsive behavior tested
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Animation performance validated

---

### Phase 3: Onboarding Flow (Days 6-8)

#### Objective
Implement complete onboarding experience (Screens 1-7) with optional, non-blocking approach.

#### Authentication Flow Strategy
**Browse-First Approach:**
1. **First Visit:**
   - Splash screen (1.5s) → Home page (NOT welcome carousel)
   - Welcome carousel is optional, accessible via settings or skipped
   - Users land directly on browseable home with jobs

2. **Guest User Capabilities:**
   - Browse all job listings
   - View full job details
   - Use search and filters
   - View agency profiles
   - Use cost calculator
   - Basic AI assistant queries
   - View success stories and learning content

3. **Auth Prompts Triggered By:**
   - "Apply" button on job cards/details → "Sign up to apply"
   - "Save Job" button → "Sign up to save jobs"
   - "Message Agency" button → "Sign up to message"
   - Accessing "My Applications" → "Sign up to track applications"
   - Accessing profile/settings → "Sign up to create profile"
   - Advanced AI features → "Sign up for full AI assistant"

4. **Modal-Based Auth:**
   - Bottom sheet modal: "Sign up to continue"
   - Shows benefit of signing up for specific action
   - Quick signup form or "Continue with Google/Facebook"
   - Option to switch to login if already have account
   - Preserves context (returns to job after signup)

#### Screen 1: Splash Screen
**File:** `app/(onboarding)/splash/page.tsx`

**Features:**
- Full-screen logo display
- App name with modern blue theme
- Tagline animation (fade in)
- Loading spinner
- Version number
- 1.5s auto-advance to home (NOT login, NOT welcome)

**Implementation Notes:**
- Use Framer Motion for entrance animations
- Check auth state and localStorage flags
- Routes:
  - First-time visitor → Home page (guest mode)
  - Returning visitor → Home page (check auth silently)
  - Never force welcome carousel or login
- Preload critical assets during splash
- Set `hasSeenSplash` flag in localStorage

#### Screen 2-4: Welcome Carousel (OPTIONAL)
**File:** `components/onboarding/WelcomeCarousel.tsx`

**Features:**
- 3 slides with swipe navigation
- Slide 1: Shield icon + "Safe & Verified" message
- Slide 2: Chat bubbles + "Talk Directly" message
- Slide 3: AI matching + "Jobs That Match You"
- Dot indicators (current slide)
- Skip button (top right)
- Next/Get Started button (bottom right)

**Implementation Notes:**
- Use `embla-carousel-react` for swipe
- Store "seen welcome" flag in localStorage
- Animate icons on slide change
- **IMPORTANT: NOT shown automatically**
- Accessible via:
  - Settings → "App Tour"
  - Help menu → "How it works"
  - First-time tooltip: "Take a quick tour?" (dismissible)
- "Get Started" button → Home page (NOT signup)

#### Screen 5-6: Login/Signup (Context-Aware)
**Files:**
- `app/(auth)/login/page.tsx` (enhance existing)
- `app/(auth)/signup/page.tsx` (enhance existing)
- `components/auth/SignupModal.tsx` (NEW - bottom sheet modal)
- `components/auth/AuthPrompt.tsx` (NEW - contextual prompts)

**Features to Add:**
- Social auth buttons (Google, Facebook)
- Remember me checkbox
- Real-time field validation with visual feedback
- Password strength indicator (signup)
- Email availability check (debounced)
- Terms checkbox with links
- Loading states on submit
- Context preservation (return to job after signup)

**Design Updates:**
- Match mockup layout exactly
- Add welcome greeting ("Welcome Back! 👋")
- Update button styles to new theme
- Add validation icons (✓ green check, ✗ red error)

**Modal Variant (New):**
- Bottom sheet modal for contextual auth
- Shows benefit: "Sign up to apply to this job"
- Displays job card preview in modal header
- Quick signup form (minimal fields)
- "Already have an account? Log in" link
- Closes with X or swipe down
- On success: return to job, show success toast

#### Screen 7: Account Type Selection
**File:** `components/onboarding/AccountTypeSelector.tsx`

**Features:**
- 3 large cards:
  1. 🎯 Job Seeker
  2. 🏢 Agency (redirects to agency signup flow)
  3. 👷 Current OFW
- Card selection (blue border highlight)
- Continue button (enabled when selected)
- Card descriptions
- Hover/press state animations

**Implementation Notes:**
- Store selection in signup flow state
- Determine user role for database
- Different onboarding paths per role
- **Shown during signup flow, NOT as landing page**
- Can be embedded in signup modal or full page
- Default selection: Job Seeker (most common)
- Skip option: "Continue as Job Seeker" (quick path)

#### Screen 8-12: Profile Setup Wizard
**File:** `components/onboarding/ProfileSetupWizard.tsx`

**5-Step Wizard Structure:**

**Step 1: Personal Info (20% complete)**
- Photo upload (drag-drop or click)
- Full name
- Date of birth (date picker)
- Gender (dropdown)
- Civil status (dropdown)

**Step 2: Contact Info (40% complete)**
- Email (pre-filled, verified)
- Phone number (with +63 prefix)
- Province/City (cascading dropdown)
- Municipality/City (dependent dropdown)
- Barangay (optional, searchable)

**Step 3: Professional Background (60% complete)**
- Current job title (autocomplete suggestions)
- Years of experience (dropdown)
- Industry/field (dropdown with popular chips)
- Highest education (dropdown)
- Field of study

**Step 4: Skills & Preferences (80% complete)**
- Skills (searchable multi-select, removable chips)
- Suggested skills (click to add)
- Preferred countries (max 5, flag icons)
- Salary expectation (range sliders)
- Earliest start date (radio buttons)

**Step 5: Document Upload (100% complete)**
- Resume/CV (PDF, DOC, max 5MB)
- Certificates (PDF, JPG, max 5MB)
- Valid ID (JPG, PNG, max 5MB)
- Drag-and-drop zones
- Skip option with tip about 3x better chances

**Common Features:**
- Progress bar at top (20%, 40%, 60%, 80%, 100%)
- Back/Next navigation
- Skip button (saves draft, navigates to home)
- "Complete Later" option (profile stays incomplete)
- Form validation per step
- Auto-save to localStorage (draft recovery)

**Profile Completion Prompts:**
- NOT blocking - users can skip entire wizard
- Shown on home page: "Complete your profile (20%)" banner
- Benefits highlighted: "3x more likely to get hired"
- Can complete anytime from profile page
- Apps allowed with incomplete profiles (agency's choice)

#### Success Criteria
- [ ] All 7 onboarding screens implemented
- [ ] Browse-first flow working (no forced auth)
- [ ] Auth prompts appear on protected actions
- [ ] Context preserved (return to job after signup)
- [ ] Guest mode fully functional (browsing)
- [ ] Smooth transitions between screens
- [ ] Form validation working correctly
- [ ] Data persists to Firebase
- [ ] Mobile and desktop layouts match mockups
- [ ] Accessibility features working
- [ ] "Sign up to continue" modal implemented

---

### Phase 4: Enhanced Job Features (Days 9-12)

#### Objective
Implement enhanced job browsing, search, and application features (Screens 13-23).

#### Screen 13: Home Screen (Adaptive for Guest/User)
**File:** `app/page.tsx` (enhance existing)

**Guest vs Authenticated User Views:**

**GUEST USER VIEW:**
- Generic greeting: "Find Your Dream Job Abroad"
- Browse all jobs (no personalization)
- Search bar prominent
- Popular job categories chips
- Featured jobs section (no match percentage)
- CTA: "Sign up for personalized job matches"
- No profile completion bar
- No messages preview
- Learning hub and success stories visible

**AUTHENTICATED USER VIEW:**

**New Sections:**
1. **Profile Completion Bar** (if incomplete)
   - Percentage + progress bar
   - "Complete Now" CTA
   - Dismissible (don't show again)

2. **Urgent Hiring Section**
   - 🔥 Icon + count badge
   - Horizontal scrollable cards
   - 94% match badge prominent
   - "View All Urgent Jobs" link

3. **Recommended Jobs Carousel**
   - ✨ Header with count
   - Match percentage on each card
   - Horizontal scroll/swipe

4. **Messages Preview**
   - 💬 Icon + unread count
   - Latest 2 messages
   - "View All Messages" link

5. **Learning Hub Card**
   - 📚 Icon
   - Featured article
   - Read time estimate

6. **Success Stories Card**
   - 🌟 Icon
   - Truncated story preview

**Features:**
- Pull-to-refresh
- FAB for quick actions (auth-aware)
- Personalized greeting with avatar (if authenticated)
- Guest banner: subtle "Sign up for full experience" (dismissible)

**Auth-Aware Elements:**
- Save buttons → Show auth prompt if guest
- Apply buttons → Show auth prompt if guest
- Message buttons → Show auth prompt if guest
- Profile/Applications links → Show auth prompt if guest
- Match percentages → Only for authenticated users
- Recommendations → Generic for guests, personalized for users

#### Screen 14: Search/Browse Screen (Public + Auth-Enhanced)
**File:** `app/jobs/page.tsx` (enhance existing)

**Available to ALL (Guest + User):**
- Full job search and filtering
- All job listings visible
- Sort options
- Quick filters
- Full job details

**New Features:**
1. **Search Bar Enhancements**
   - Voice search icon (🎤)
   - Recent searches dropdown (localStorage for guests, synced for users)
   - Clear all button

2. **Quick Filters**
   - Horizontal scroll chips
   - Industry, country, job type
   - Active state highlighting

3. **Filter Modal** (Bottom Sheet)
   - Job type checkboxes
   - Salary range sliders
   - Posted date radio buttons
   - Agency rating slider
   - Country multi-select with flags
   - More options checkboxes
   - Apply button with result count

4. **Sort Dropdown**
   - Relevance (default)
   - Most recent
   - Highest salary
   - Best match

5. **Job Card Actions (Auth-Aware)**
   - Swipe right: Save (prompts auth if guest)
   - Swipe left: Not interested (works for all, stored in localStorage)
   - Save icon (bookmark) → Auth prompt if guest
   - Message icon (direct chat) → Auth prompt if guest
   - "Apply" button → Auth prompt if guest
   - View details → Available to all (no auth required)

**Infinite Scroll:**
- Load 20 jobs per page
- Skeleton loaders while loading
- "Load More" button as fallback

#### Screen 15-17: Job Details (Public + Auth-Enhanced)
**File:** `app/jobs/[id]/page.tsx` (enhance existing)

**Available to ALL Users (Guest + Authenticated):**
- Full job details
- Company information
- Requirements and benefits
- Agency profile
- Cost calculator
- Reviews (if public)
- Similar jobs

**Part 1: Header + Overview (Auth-Aware)**
- Large job title
- Company name + location
- Match percentage badge (authenticated only, hidden for guests)
- Quick Apply button (primary) → **Auth prompt if guest**
- Message Agency button (secondary) → **Auth prompt if guest**
- Save icon → **Auth prompt if guest**
- Share icon → Available to all (native share)
- Job overview cards (salary, contract, vacancies, etc.)
- Job description (expandable)
- Requirements list with checkboxes

**Part 2: Benefits + Agency Info**
- Benefits list with icons
- Agency card:
  - Logo
  - Name
  - Star rating + review count
  - DMW verified badge
  - Response time
  - Placements count
  - Years established
  - "View Full Profile" button
- Job location map (interactive)
- Cost calculator card

**Part 3: Reviews + Similar Jobs**
- Star rating breakdown (horizontal bars)
- Review filters (most helpful, recent)
- Review cards:
  - Avatar + name
  - Job title + location
  - Star rating + date
  - Review text
  - Deployed date + verified badge
  - Helpful button with count
- "Load More Reviews" button
- "Write Your Review" button
- Similar jobs carousel
- "View All Similar Jobs" link

**UX Enhancements:**
- Sticky header with actions
- Scroll progress indicator
- Long-press to share sections
- Scroll-to-top FAB

#### Screen 18-19: Quick Apply Flow (Auth Required)
**File:** `components/jobs/QuickApplyModal.tsx`

**Auth Gate:**
- If guest clicks "Apply":
  1. Show `SignupModal` with context:
     - "Sign up to apply to this job"
     - Job card preview at top
     - Quick signup form
     - "Continue with Google" for speed
  2. After signup: redirect back to apply modal
  3. If profile incomplete: warn but allow application

**Confirmation Modal (Authenticated Users):**
- Job summary card
- Profile completion percentage (if incomplete, show warning)
- Missing document warnings
- Document checklist (attached/missing)
- Add cover letter option (expandable)
- Cost estimate display
- No placement fee notice
- Submit button
- "Maybe Later" link

**Success Modal:**
- ✓ Checkmark animation
- Confetti effect
- "Application Submitted!" heading
- Agency name confirmation
- "What happens next" numbered list
- Profile completion tip
- "Message Agency Now" button
- "View My Applications" link
- "Browse More Jobs" link
- Auto-dismiss after 5s

#### Screen 22: My Applications (Auth Required)
**File:** `app/profile/applications/page.tsx` (enhance existing)

**Auth Gate:**
- If guest tries to access: redirect to signup with message
- "Sign up to track your applications"
- Show preview of what they'll get (screenshot/mockup)
- Benefit: "Never lose track of your job search"

**New Features (Authenticated Users Only):**
1. **Tabs:** Active (5) | History | Saved
2. **Filter Dropdown:** Status, Country, Date
3. **Application Cards with Status:**
   - 📅 Interview Scheduled (green)
   - 🔍 Under Review (blue)
   - 👁️ Viewed (gray)
   - ✅ Accepted (green)
   - ❌ Rejected (red)
4. **Timeline Progress Bar** (for active apps)
5. **Next Steps Section** (checklist)
6. **Message + Details buttons**
7. **Withdraw option** (swipe or button)

**Pull-to-refresh** for status updates

#### Success Criteria
- [ ] Home screen matches mockup layout
- [ ] Search with filters working
- [ ] Job details 3-part scroll implemented
- [ ] Quick apply flow with validation
- [ ] Success animation playing
- [ ] Applications tracking enhanced
- [ ] All swipe gestures working

---

### Phase 5: AI Assistant & Advanced Features (Days 13-15)

#### Objective
Implement GABAY AI chatbot with free Gemini API, deployment tracker, enhanced agency features, and advanced filtering capabilities.

**Note:** Using Google Gemini Pro FREE tier (1,500 requests/day, $0 cost) for AI chat implementation.

#### Screen 24-25: GABAY AI Assistant (FREE with Gemini)
**File:** `components/ai/GabayChat.tsx`

**Free Tier Specifications:**
- **API:** Google Gemini Pro (completely FREE)
- **Limits:** 15 requests/minute, 1,500 requests/day, 1M tokens/month
- **Cost:** $0/month (no credit card required)
- **Capacity:** 4,500-9,000 conversations/month FREE
- **Quality:** Production-ready, GPT-3.5 level performance

**Guest User Access (Limited):**
- Welcome message: "Try GABAY AI Assistant - 3 Free Queries"
- Free queries limit: 3 per session (prevents abuse)
- Quick action cards available:
  - ✅ Check Requirements for [Country]
  - ✅ Basic job search help
  - ✅ Verify Agency Legitimacy
  - ✅ Cost calculator info
- After 3 queries: "Sign up for unlimited access"
- No conversation history saved
- Uses cached responses when possible

**Authenticated User Access (Full):**
- Unlimited queries (within 1,500/day global limit)
- Conversation history saved in Firestore
- Advanced features unlocked
- Personalized recommendations based on profile
- Priority access during high demand

**Landing Screen:**
- 🤖 Robot mascot icon
- Welcome message: "Kumusta! I'm GABAY, your FREE OFW AI guide"
- Badge: "🆓 Powered by Google Gemini - Always Free"
- Auth status indicator:
  - Guest: "🔓 3 Free Queries Remaining"
  - Authenticated: "🔓 Unlimited Access"
- Quick action cards:
  1. ✅ Check Requirements for [Country]
  2. 🛡️ Verify Agency Legitimacy
  3. 📚 Learn About Working in [Country]
  4. 🎤 Interview Prep Tips & Practice
  5. 💰 Calculate Deployment Costs
  6. 📋 POEA Process Guide
- Recent conversations list (authenticated only)
- Voice + text input

**Chat Interface:**
- User messages (right-aligned, blue bubble)
- AI messages (left-aligned, gray bubble with GABAY icon)
- Typing indicator animation ("GABAY is thinking...")
- Interactive cards in responses:
  - "Check Now" action buttons
  - Quick reply chips
  - Embedded links to resources
  - Job recommendations
- Context-aware suggestions
- Message timestamps
- Scroll to bottom button
- "Was this helpful?" feedback buttons

**AI Implementation - Gemini Pro FREE:**

```typescript
// lib/ai/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are GABAY, a helpful AI assistant for Overseas Filipino Workers (OFW).

Your role:
- Help job seekers understand OFW requirements for different countries
- Verify agency legitimacy (check DMW verification)
- Provide country-specific work information (culture, laws, salary)
- Offer interview preparation tips and practice questions
- Explain deployment process step-by-step
- Calculate and explain deployment costs
- Warn about common scams and illegal fees
- Provide emotional support and encouragement

Guidelines:
- Respond in friendly Taglish (Filipino-English mix)
- Be empathetic and supportive
- Cite official sources (DMW, POEA, OWWA)
- Warn about scams and illegal practices
- Keep responses concise but informative
- Use emojis appropriately for warmth
- If unsure, direct to official resources or live support`;

export async function chatWithGABAY(
  message: string,
  userId?: string,
  conversationHistory?: ChatMessage[]
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      maxOutputTokens: 500, // Keep responses concise
      temperature: 0.7,     // Balanced creativity
    }
  });

  // Build context from conversation history
  const context = conversationHistory
    ?.map(msg => `${msg.role}: ${msg.content}`)
    .join('\n') || '';

  const fullPrompt = `${SYSTEM_PROMPT}

Previous conversation:
${context}

User: ${message}

GABAY:`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;

  return {
    text: response.text(),
    tokensUsed: await countTokens(fullPrompt + response.text())
  };
}
```

**Smart Caching Strategy (Reduces API calls by 60-70%):**

```typescript
// lib/ai/cache.ts
const COMMON_QUESTIONS_CACHE = {
  // Saudi Arabia
  "requirements for saudi": `Here are the requirements for Saudi Arabia:

✅ Valid passport (at least 6 months)
✅ Medical certificate (GAMCA)
✅ NBI clearance
✅ POEA employment contract
✅ OWWA membership
✅ PDOS certificate

Average processing time: 45-60 days
Estimated cost: ₱8,000-₱12,000

Need details on any specific requirement?`,

  // Agency verification
  "how to verify agency": `To verify if an agency is legitimate:

1️⃣ Check DMW License: Visit dmw.gov.ph/licensed-agencies
2️⃣ Verify POEA accreditation
3️⃣ Check online reviews and complaints
4️⃣ Visit physical office
5️⃣ Never pay placement fees (ILLEGAL!)

🚨 Red flags:
- Asking for placement fees
- No physical office
- Too-good-to-be-true offers
- Rushing you to decide

Would you like me to check a specific agency?`,

  // Add more cached responses for common queries
};

export function getCachedResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();

  for (const [key, response] of Object.entries(COMMON_QUESTIONS_CACHE)) {
    if (normalizedQuery.includes(key)) {
      return response;
    }
  }

  return null;
}
```

**Cost Controls & Monitoring:**

```typescript
// lib/ai/rateLimiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Guest rate limits
export const guestRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 requests per hour
  analytics: true,
});

// Authenticated user limits
export const userRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 per hour per user
  analytics: true,
});

// Global limit (stay within free tier)
export const globalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1400, "1 d"), // Buffer under 1,500/day
  analytics: true,
});

// Usage tracking
export async function trackUsage(userId: string | null, tokensUsed: number) {
  const date = new Date().toISOString().split('T')[0];
  const key = `ai:usage:${date}`;

  await redis.hincrby(key, 'totalRequests', 1);
  await redis.hincrby(key, 'totalTokens', tokensUsed);
  await redis.hincrby(key, userId ? 'authenticatedRequests' : 'guestRequests', 1);
  await redis.expire(key, 60 * 60 * 24 * 30); // Keep 30 days
}

// Check if approaching limits
export async function checkLimits(): Promise<{
  withinLimits: boolean;
  dailyUsage: number;
  percentUsed: number;
}> {
  const date = new Date().toISOString().split('T')[0];
  const key = `ai:usage:${date}`;

  const totalRequests = await redis.hget(key, 'totalRequests') || 0;
  const percentUsed = (totalRequests / 1500) * 100;

  return {
    withinLimits: totalRequests < 1400, // 93% threshold
    dailyUsage: totalRequests,
    percentUsed,
  };
}
```

**Fallback Strategy:**

```typescript
// When limits reached or API unavailable
export async function getFallbackResponse(query: string): Promise<string> {
  // Check cache first
  const cached = getCachedResponse(query);
  if (cached) return cached;

  // Rule-based fallback responses
  if (query.includes('requirement')) {
    return `I'm experiencing high demand right now. For requirements information, please visit our Requirements Guide or contact live support.`;
  }

  if (query.includes('agency')) {
    return `To verify agencies, visit dmw.gov.ph/licensed-agencies or our Agency Directory. Live support is also available!`;
  }

  return `I'm currently at capacity. Please try again in a few hours, check our Help Center, or contact live support for immediate assistance.`;
}
```

**Usage Dashboard (Admin):**

```typescript
// components/admin/AIUsageDashboard.tsx
export function AIUsageDashboard() {
  const [stats, setStats] = useState({
    today: 0,
    thisMonth: 0,
    cacheHitRate: 0,
    avgResponseTime: 0,
  });

  return (
    <div className="space-y-4">
      <h2>AI Usage Dashboard (FREE Tier)</h2>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Today's Requests"
          value={stats.today}
          max={1500}
          color={stats.today > 1400 ? 'red' : 'green'}
        />
        <StatCard
          label="Monthly Requests"
          value={stats.thisMonth}
          subtitle="Unlimited"
        />
        <StatCard
          label="Cache Hit Rate"
          value={`${stats.cacheHitRate}%`}
          subtitle="Saves API calls"
        />
        <StatCard
          label="Avg Response Time"
          value={`${stats.avgResponseTime}ms`}
        />
      </div>

      {stats.today > 1200 && (
        <Alert variant="warning">
          ⚠️ Approaching daily limit (80%). Cache will be prioritized.
        </Alert>
      )}
    </div>
  );
}
```

**Implementation Notes:**
- Store chat history in Firestore (`aiChatHistory` collection)
- Track usage in Firestore (`aiUsageTracking` collection)
- Implement smart caching for common queries (60-70% cache hit rate expected)
- Rate limiting: 3/session (guest), 20/hour (authenticated), 1,400/day (global)
- Automatic fallback to cached/rule-based responses if limits reached
- Admin dashboard to monitor usage and ensure staying within free tier
- Add "Was this helpful?" feedback to improve cached responses
- Link to live support for complex issues
- Environment variable: `GEMINI_API_KEY` (get free at ai.google.dev)

**Cost Projection:**
- **MVP Phase (Month 1-6):** $0/month (within free tier)
- **Expected usage:** 500-2,000 requests/day
- **Well below limit:** 1,500/day
- **If growth exceeds free tier:** Gemini Pro paid tier is $0.00025/1K tokens
  - ~$0.001 per conversation (extremely cheap)
  - 10,000 conversations = ~$10/month
  - Still 20x cheaper than OpenAI GPT-4

#### Screen 26: Deployment Tracker (Auth Required)
**File:** `components/deployment/DeploymentTracker.tsx`

**Auth Gate:**
- Authenticated users only
- Linked from application details
- If guest tries to access: show auth modal
- "Sign up to track your deployment progress"

**Features (Authenticated Users):**
- Job summary header
- Target departure date countdown
- Progress bar (X of 10 steps complete)
- Timeline with steps:
  1. ✅ Job Offer Accepted (completed)
  2. ✅ Medical Examination (completed, with result link)
  3. ✅ NBI Clearance (completed, with download)
  4. ✅ Passport Verification (completed)
  5. ✅ POEA Contract Signed (completed, with view link)
  6. ✅ OWWA Membership (completed, receipt)
  7. 📅 PDOS Attendance (scheduled, with details)
  8. ⏳ OEC Processing (pending, disabled)
  9. ⏳ Visa Processing (in progress, agency handling)
  10. ⏳ Flight Booking (not started, disabled)

**Step States:**
- ✅ Completed (green, expandable for details)
- 📅 Scheduled (blue, with date/time/location)
- ⏳ In Progress (amber, with status text)
- ○ Not Started (gray, disabled)

**Interactions:**
- Tap step to expand details
- Download/view documents
- Reschedule appointments
- Get reminders
- Share progress with family

**Data Source:**
- Firestore collection: `deploymentProgress`
- Real-time updates
- Push notifications for changes

#### Screen 27: Enhanced Agency Profile (Public)
**File:** `app/agency/[id]/page.tsx`

**Available to ALL (Guest + User):**
- Full agency information
- Verification badges
- Statistics and reviews
- Current job openings
- Contact information (limited for guests)

**Auth-Aware Actions:**
- "Message Agency" button → Auth prompt if guest
- "Follow Agency" button → Auth prompt if guest (if implemented)
- View contact details → Full for users, limited for guests

**Enhanced Features:**

1. **Verification Section** (prominent, public)
   - ✓ DMW Verified badge (large)
   - License number + expiry date
   - "Verify on DMW Site" external link
   - ISO certification badges
   - POEA awards
   - ILO Fair Recruitment logo

2. **Statistics Dashboard**
   - 🌍 Countries served: 15
   - 🏢 Industries: 12
   - 👥 Deployments: 1,500+
   - 📅 In business: 26 years
   - ⏱️ Avg process time: 45 days
   - 💬 Response rate: 98%

3. **Review Analytics**
   - Star rating breakdown (bars)
   - Review trend chart (optional)
   - Verified OFW badge on reviews
   - Country flags on reviews
   - Deployment dates shown

4. **Current Openings Section**
   - Horizontal carousel
   - Match percentage on cards
   - "View All Jobs" link

**Report Button:**
- Top-right menu (⋮)
- Report reasons:
  - Excessive fees
  - False information
  - Poor communication
  - Contract violation
- Sends report to admin

#### Screen 29: Filter Modal (Public)
**File:** `components/jobs/JobFilterSheet.tsx`

**Available to ALL Users:**
- All filters work for guests and authenticated users
- Filter preferences saved to localStorage for guests
- Filter preferences synced to cloud for authenticated users

**Filter Categories:**
1. **Job Type** (checkboxes)
   - Full-time
   - Part-time
   - Contract (2 years)
   - Temporary

2. **Salary Range** (dual slider)
   - Min: ₱20,000
   - Max: ₱150,000
   - Display selected range

3. **Posted Date** (radio buttons)
   - Last 24 hours
   - Last 7 days
   - Last 30 days
   - Anytime

4. **Agency Rating** (slider)
   - Range: 3.0 to 5.0 stars
   - Display: "4.0+ stars"

5. **Country/Region** (multi-select)
   - Checkboxes with flag icons
   - "Show More Countries" expandable

6. **More Options** (checkboxes)
   - Verified agencies only
   - With salary info
   - Remote opportunities

**Features:**
- Reset button (top right)
- Apply button with result count preview
- Swipe down to dismiss
- State persists until applied

#### Screen 30: Cost Calculator Modal (Public)
**File:** `components/jobs/CostCalculatorModal.tsx`

**Available to ALL Users:**
- Full cost breakdown visible to everyone
- Educational tool to prevent scams
- No auth required
- Share and download options for all

**Auth Enhancement:**
- Authenticated users can save calculations
- Track paid items in deployment tracker

**Breakdown Sections:**

**Legal Required Fees:**
- Medical Examination: ₱2,500 [✓ Paid]
- NBI Clearance: ₱150-₱300
- Passport: ₱950-₱1,200 (if needed)
- OWWA Membership: ₱1,600 (mandatory)
- PhilHealth: ₱500-₱1,000
- PDOS Seminar: ₱300
- Visa Application: ₱5,000-₱8,000 (country-dependent)

**Optional Expenses:**
- Skills Certification: ₱2,000-₱5,000 (TESDA)

**Illegal Fees Warning:**
- ⚠️ Placement Fee (ILLEGAL)
- ⚠️ Training Fee >₱5,000
- ⚠️ Direct payments to agency
- "Report Excessive Fees" button

**Features:**
- Total estimate: ₱8,500 - ₱15,000
- Country-specific calculations
- Paid items marked with checkmarks
- Download PDF button
- Share button
- 💡 Tip: "Get receipts for all payments!"

#### Success Criteria
- [ ] GABAY AI with free Gemini API functional
- [ ] Smart caching working (60%+ cache hit rate)
- [ ] Rate limiting enforced (3 guest, 20/hr authenticated, 1400/day global)
- [ ] Usage dashboard showing real-time stats
- [ ] Automatic fallback when approaching limits
- [ ] Chat history saved for authenticated users
- [ ] Deployment tracker with timeline
- [ ] Enhanced agency profiles with verification
- [ ] Filter modal with all options
- [ ] Cost calculator with accurate data
- [ ] Report mechanisms working
- [ ] All features staying within FREE tiers ($0 cost)

---

### Phase 6: Polish & Refinements (Days 16-18)

#### Objective
Implement dark mode, animations, and edge case handling.

#### Task 1: Dark Mode Implementation
**Dependencies:**
```bash
npm install next-themes
```

**Files to Create/Modify:**
1. `app/providers.tsx` - Add ThemeProvider
2. `components/ui/ThemeToggle.tsx` - New component
3. Update all components with dark mode classes

**Color Mappings:**
- Background: `bg-white dark:bg-gray-900`
- Cards: `bg-gray-50 dark:bg-gray-800`
- Text: `text-gray-900 dark:text-gray-100`
- Borders: `border-gray-200 dark:border-gray-700`
- Primary: `bg-primary-600 dark:bg-primary-500`

**Toggle Locations:**
- Settings page
- Profile dropdown
- Header (sun/moon icon)

**Persistence:**
- localStorage: `theme` key
- Respects system preference initially

#### Task 2: Skeleton Loading States
**Create Skeleton Components:**
1. `JobCardSkeleton.tsx` (existing - enhance)
2. `ProfileCardSkeleton.tsx`
3. `TimelineSkeleton.tsx`
4. `ChatMessageSkeleton.tsx`
5. `ApplicationCardSkeleton.tsx`

**Features:**
- Shimmer animation (gradient sweep)
- Match component dimensions exactly
- Use Tailwind animate-pulse
- Show 3-5 skeletons per list

**Implementation:**
```tsx
{isLoading ? (
  <JobCardSkeleton count={5} />
) : (
  jobs.map(job => <JobCard key={job.id} job={job} />)
)}
```

#### Task 3: Swipe Actions
**Dependencies:**
```bash
npm install react-swipeable
```

**Implement On:**
1. **Job Cards** (search/browse)
   - Swipe right: Save job (bookmark icon revealed)
   - Swipe left: Not interested (× icon revealed)
   - Haptic feedback on mobile
   - Undo toast notification

2. **Message List**
   - Swipe right: Pin conversation
   - Swipe left: Archive/delete
   - Confirmation for delete

3. **Application Cards**
   - Swipe left: Withdraw application
   - Confirmation modal required

**Visual Feedback:**
- Background color change (green/red)
- Icon reveal during swipe
- Snap threshold: 50% width
- Animate card removal

#### Task 4: Animation Polish
**Micro-interactions:**
1. **Button Hover Effects**
   - Scale: 1.02
   - Shadow increase
   - Smooth transition

2. **Card Hover Effects**
   - Lift (translateY: -4px)
   - Shadow: soft → lg
   - Border color change

3. **Page Transitions**
   - Fade in content
   - Slide from right (mobile)
   - Duration: 300ms

4. **Success States**
   - Checkmark draw animation
   - Confetti burst
   - Scale bounce effect

5. **Loading States**
   - Spinner rotation
   - Progress bar pulse
   - Skeleton shimmer

**Implementation Notes:**
- Use Framer Motion variants
- Create reusable animation presets
- Keep animations under 500ms
- Respect prefers-reduced-motion

#### Task 5: Empty & Error States
**Implement For:**
1. **No Jobs Found** (search)
2. **No Applications** (applications page)
3. **No Messages** (messages page)
4. **No Saved Jobs** (saved jobs page)
5. **Network Error** (all data fetches)
6. **404 Not Found** (invalid routes)
7. **403 Forbidden** (unauthorized access)
8. **500 Server Error** (API failures)

**Component Template:**
```tsx
<EmptyState
  illustration="📭" // or custom SVG
  title="No applications yet"
  description="Start your OFW journey! Browse jobs..."
  primaryAction={{
    label: "Browse Jobs",
    href: "/jobs"
  }}
  secondaryAction={{
    label: "View Tips",
    href: "/learning-hub"
  }}
/>
```

**Error State Template:**
```tsx
<ErrorState
  icon="⚠️"
  title="Oops! Something went wrong"
  message="We couldn't load the jobs."
  errorCode="NET_001"
  actions={[
    { label: "Try Again", onClick: retry, variant: "primary" },
    { label: "Browse Saved Jobs", href: "/saved-jobs" },
    { label: "Contact Support", href: "/support" }
  ]}
/>
```

#### Task 6: Notification Center
**File:** `app/notifications/page.tsx`

**Features:**
1. **Tabs:** All | Jobs | Messages | Applications
2. **Mark All Read** button
3. **Grouped by Date:** Today | Yesterday | This Week
4. **Notification Types:**
   - 💼 New job matches (with job count badge)
   - 💬 New messages (from agency/OFW)
   - 👁️ Application viewed
   - 📅 Interview scheduled/reminder
   - 📄 Document expiring
   - 🎯 Shortlisted
   - ✅ Application accepted
   - ❌ Application rejected

5. **Notification Actions:**
   - Tap to open related content
   - Swipe to delete
   - Quick reply (for messages)

6. **Badge System:**
   - Header icon shows unread count
   - Update in real-time (Firebase listener)
   - Clear count on page visit

#### Success Criteria
- [ ] Dark mode toggle working with persistence
- [ ] All loading states use skeletons
- [ ] Swipe actions on job cards, messages, applications
- [ ] Smooth animations on all interactions
- [ ] Empty states on all data-dependent pages
- [ ] Error states with retry mechanisms
- [ ] Notification center functional

---

### Phase 7: Testing & Optimization (Days 19-20)

#### Objective
Ensure quality, performance, and accessibility standards.

#### Task 1: Cross-Browser Testing
**Test On:**
- ✅ Chrome/Edge (Chromium) - Desktop + Mobile
- ✅ Safari - macOS + iOS
- ✅ Firefox - Desktop + Mobile
- ⚠️ Samsung Internet (if available)

**Test Cases:**
1. Onboarding flow (all 7 screens)
2. Job search and filters
3. Quick apply flow
4. Chat interface
5. Dark mode switching
6. Form validation
7. File uploads
8. Swipe gestures
9. Animations

**Common Issues to Check:**
- Safari: Date picker rendering
- Safari: Swipe gesture conflicts
- Firefox: Flexbox rendering
- Chrome: Animation performance

#### Task 2: Mobile Device Testing
**Test On:**
- iPhone (iOS 16+)
- Android (Samsung, Pixel)
- Different screen sizes (375px to 428px width)

**Test Cases:**
1. **Touch Targets**
   - Minimum 44x44px
   - Adequate spacing (8-16px)
   - No accidental taps

2. **Viewport Issues**
   - No horizontal scroll
   - Safe area support (iOS notch)
   - Keyboard overlap handling

3. **Performance**
   - Smooth 60fps animations
   - Fast page transitions
   - Quick tap response

4. **Mobile-Specific Features**
   - Bottom sheet swipe
   - Pull-to-refresh
   - Haptic feedback (if implemented)
   - Camera access (profile photo)

5. **Offline Behavior**
   - Service worker caching
   - Offline error states
   - Form draft saving

#### Task 3: Performance Optimization
**Metrics to Achieve:**
- Lighthouse Score: 90+ (all categories)
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

**Optimization Tasks:**

1. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based splitting (already done by Next.js)
   - Lazy load below-the-fold content

2. **Image Optimization**
   - Use Next.js Image component everywhere
   - Proper sizes attribute
   - WebP format with PNG fallback
   - Lazy loading images

3. **Font Optimization**
   - Preload Inter font
   - Font-display: swap
   - Subset fonts if possible

4. **Bundle Size**
   - Analyze with `next build` output
   - Remove unused dependencies
   - Tree-shake properly
   - Consider replacing heavy libraries

5. **Database Optimization**
   - Add Firestore indexes
   - Implement pagination (10-20 items)
   - Cache frequent queries
   - Use optimistic updates

6. **Animation Performance**
   - Use transform and opacity only
   - Avoid animating width/height
   - Use will-change sparingly
   - GPU acceleration for heavy animations

**Tools:**
- Chrome DevTools (Performance tab)
- Lighthouse CI
- Next.js Bundle Analyzer
- React DevTools Profiler

#### Task 4: Accessibility Audit
**WCAG 2.1 Level AA Compliance:**

1. **Keyboard Navigation**
   - All interactive elements reachable via Tab
   - Visible focus indicators
   - Skip to content link
   - Escape closes modals
   - Arrow keys for carousels/lists

2. **Screen Reader Support**
   - Semantic HTML (header, nav, main, footer)
   - ARIA labels on icon buttons
   - ARIA live regions for dynamic content
   - Alt text on all images
   - Form labels associated correctly

3. **Color Contrast**
   - Text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Interactive elements: 3:1 minimum
   - Check dark mode contrast too

4. **Form Accessibility**
   - Labels for all inputs
   - Error messages linked (aria-describedby)
   - Required fields marked
   - Validation error announcements

5. **Motion Sensitivity**
   - Respect prefers-reduced-motion
   - Provide animation toggle in settings
   - Avoid auto-playing videos

**Testing Tools:**
- WAVE browser extension
- axe DevTools
- Lighthouse accessibility audit
- NVDA/JAWS screen reader (Windows)
- VoiceOver (macOS/iOS)

#### Task 5: User Acceptance Testing
**Test Scenarios:**

1. **New User Journey**
   - Sign up → Account type selection → Profile setup → Browse jobs → Apply
   - Expected time: 10-15 minutes
   - Success: Complete application submitted

2. **Job Seeker Daily Use**
   - Login → Check notifications → Browse new jobs → Message agency → Track application
   - Expected time: 5 minutes
   - Success: Productive session

3. **Agency Workflow**
   - Login → View applicants → Message candidate → Schedule interview → Update status
   - Expected time: 10 minutes
   - Success: Interview scheduled

4. **Edge Cases**
   - Slow network (throttle to 3G)
   - Form submission errors
   - File upload failures
   - Session expiration
   - Concurrent edits

**Feedback Collection:**
- User testing with 5-10 real users
- Record sessions (with permission)
- Note pain points and confusion
- Measure task completion rate
- Gather satisfaction ratings (1-5)

#### Task 6: Final QA Checklist
**Functional Testing:**
- [ ] All forms submit successfully
- [ ] All links navigate correctly
- [ ] All images load with proper fallbacks
- [ ] All animations run smoothly
- [ ] All modals open and close properly
- [ ] All filters apply correctly
- [ ] All search queries return results
- [ ] All file uploads work (within size limits)
- [ ] All authentication flows work
- [ ] All role-based permissions enforced

**Visual Testing:**
- [ ] All pages match mockup designs
- [ ] Consistent spacing throughout
- [ ] Proper alignment on all elements
- [ ] No text overflow/truncation issues
- [ ] Proper responsive behavior (375px to 1920px)
- [ ] Dark mode colors consistent
- [ ] No UI jank or flashing

**Data Integrity:**
- [ ] User data persists correctly
- [ ] Application status updates in real-time
- [ ] Message threads maintain order
- [ ] Deployment tracker syncs
- [ ] Profile edits save properly

**Security:**
- [ ] Authentication required for protected routes
- [ ] Role-based access control working
- [ ] No sensitive data in client logs
- [ ] File uploads validated server-side
- [ ] XSS protection (React handles this mostly)
- [ ] CSRF tokens (Firebase handles this)

#### Success Criteria
- [ ] 90+ Lighthouse scores
- [ ] Zero console errors/warnings
- [ ] All browsers tested
- [ ] Mobile devices tested
- [ ] Accessibility audit passed
- [ ] UAT feedback positive (>4/5 avg)
- [ ] All QA checklist items passed

---

## Component Architecture Changes

### New Folder Structure
```
components/
├── onboarding/
│   ├── SplashScreen.tsx
│   ├── WelcomeCarousel.tsx
│   ├── AccountTypeSelector.tsx
│   └── ProfileSetupWizard/
│       ├── index.tsx
│       ├── PersonalInfoStep.tsx
│       ├── ContactInfoStep.tsx
│       ├── ProfessionalStep.tsx
│       ├── SkillsPreferencesStep.tsx
│       └── DocumentUploadStep.tsx
├── ai/ (Phase 5 - FREE Gemini implementation)
│   ├── GabayChat.tsx              # Main chat interface
│   ├── ChatMessage.tsx            # Message bubble component
│   ├── QuickActionCard.tsx        # Quick action buttons
│   ├── ChatInput.tsx              # Text/voice input
│   ├── TypingIndicator.tsx        # "GABAY is thinking..."
│   ├── UsageBadge.tsx             # Shows remaining queries
│   └── FeedbackButtons.tsx        # "Was this helpful?"
├── deployment/
│   ├── DeploymentTracker.tsx
│   ├── TimelineStep.tsx
│   └── DocumentLink.tsx
├── jobs/
│   ├── JobFilterSheet.tsx
│   ├── CostCalculatorModal.tsx
│   ├── JobCardSwipeable.tsx
│   ├── QuickApplyModal.tsx
│   └── SuccessConfetti.tsx
├── ui/ (enhanced)
│   ├── ProgressBar.tsx
│   ├── StepIndicator.tsx
│   ├── Chip.tsx
│   ├── BottomSheet.tsx
│   ├── Timeline.tsx
│   ├── StatCard.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── ThemeToggle.tsx
│   └── Skeleton.tsx (enhance)
├── layout/
│   └── NotificationBadge.tsx
└── forms/
    ├── PhilippineAddressSelect.tsx
    ├── CountryMultiSelect.tsx
    ├── SkillsInput.tsx
    └── FileUploadZone.tsx
```

### New Pages
```
app/
├── (onboarding)/
│   ├── splash/page.tsx
│   └── welcome/page.tsx (optional, not auto-shown)
├── (auth)/
│   ├── account-type/page.tsx (part of signup flow)
│   └── profile-setup/page.tsx (optional, can skip)
├── notifications/page.tsx (auth required)
├── ai-assistant/page.tsx (tiered: 3 free for guests, unlimited for users)
├── admin/
│   └── ai-usage/page.tsx (admin only - usage dashboard)
└── deployment-tracker/[id]/page.tsx (auth required)
```

### New Components
```
components/
├── auth/
│   ├── SignupModal.tsx (NEW - contextual auth prompt)
│   ├── AuthPrompt.tsx (NEW - reusable auth gate)
│   └── GuestBanner.tsx (NEW - subtle signup CTA)
├── guards/
│   ├── AuthGuard.tsx (NEW - route protection)
│   └── useAuthPrompt.tsx (NEW - hook for auth checks)
└── ...existing components
```

### Shared Types
**File:** `types/index.ts` (additions)

```typescript
// Onboarding
export type AccountType = 'job_seeker' | 'agency' | 'current_ofw';

export interface ProfileSetupData {
  step1: PersonalInfo;
  step2: ContactInfo;
  step3: ProfessionalBackground;
  step4: SkillsPreferences;
  step5: Documents;
}

// AI Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: QuickAction[];
}

export interface QuickAction {
  label: string;
  action: string;
  icon?: string;
}

// Deployment
export interface DeploymentStep {
  id: string;
  title: string;
  status: 'completed' | 'scheduled' | 'in_progress' | 'pending';
  date?: Date;
  details?: string;
  documents?: Document[];
}

// Filter
export interface JobFilters {
  jobType: string[];
  salaryRange: [number, number];
  postedDate: string;
  agencyRating: number;
  countries: string[];
  verifiedOnly: boolean;
  withSalary: boolean;
  remote: boolean;
}

// Auth Prompts
export interface AuthPromptContext {
  action: 'apply' | 'save' | 'message' | 'view_applications' | 'ai_advanced';
  title: string;
  description: string;
  benefit: string;
  jobId?: string;
  returnUrl?: string;
}

export interface AuthPromptConfig {
  requireAuth: boolean;
  promptModal: boolean;
  allowGuest: boolean;
  guestLimit?: number;
}
```

---

## Dependencies

### New NPM Packages to Install

```bash
# Carousel/Swipe
npm install embla-carousel-react react-swipeable

# Theme
npm install next-themes

# Animations
npm install react-confetti canvas-confetti

# Form Enhancements
npm install react-dropzone

# Date Picker (if not using native)
npm install react-datepicker
npm install -D @types/react-datepicker

# Country/Flag Support
npm install country-flag-icons

# AI Integration (FREE - Google Gemini)
npm install @google/generative-ai

# Rate Limiting for AI (FREE tier from Upstash)
npm install @upstash/ratelimit @upstash/redis

# Philippines Data
npm install psgc-philippine-standard-geographic-code
```

### Environment Variables Required

```env
# Google Gemini AI (FREE tier)
GEMINI_API_KEY=your_free_api_key_from_ai_google_dev

# Upstash Redis (FREE tier for rate limiting)
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_redis_token
```

### Total Dependencies After Implementation
- **Before:** 40 packages
- **After:** ~53 packages
- **Bundle Size Increase:** ~350KB (estimated)
- **Monthly Cost:** $0 (using free tiers for Gemini AI and Upstash Redis)

---

## Firestore Database Requirements

### Overview
The implementation plan requires significant Firestore database enhancements to support new features like AI chat, deployment tracking, notifications, and profile completion.

### New Collections

#### 1. `aiChatHistory`
**Purpose:** Store AI chat conversations for authenticated users

**Schema:**
```typescript
interface AIChatHistory {
  id: string;
  userId: string;
  conversationId: string;
  messages: ChatMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tokensUsed: number;
  cacheHit: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  tokensUsed?: number;
  helpful?: boolean; // User feedback
}
```

**Indexes Required:**
```json
{
  "collectionGroup": "aiChatHistory",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

**Security Rules:**
```javascript
match /aiChatHistory/{chatId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
}
```

#### 2. `aiUsageTracking`
**Purpose:** Monitor daily AI API usage to stay within free tier

**Schema:**
```typescript
interface AIUsageTracking {
  id: string; // Format: YYYY-MM-DD
  date: string;
  totalRequests: number;
  guestRequests: number;
  authenticatedRequests: number;
  totalTokens: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  avgResponseTime: number;
  errors: number;
}
```

**Security Rules:**
```javascript
match /aiUsageTracking/{date} {
  allow read: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  allow write: if false; // Only backend can write
}
```

#### 3. `profileCompletion`
**Purpose:** Track user profile setup progress

**Schema:**
```typescript
interface ProfileCompletion {
  userId: string;
  percentage: number; // 0-100
  completedSteps: string[]; // ['personal', 'contact', 'professional', 'skills', 'documents']
  lastUpdated: Timestamp;
  reminders: {
    dismissed: boolean;
    dismissedAt?: Timestamp;
  };
}
```

**Indexes Required:**
```json
{
  "collectionGroup": "profileCompletion",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "percentage", "order": "ASCENDING" },
    { "fieldPath": "lastUpdated", "order": "DESCENDING" }
  ]
}
```

**Security Rules:**
```javascript
match /profileCompletion/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

#### 4. `deploymentProgress`
**Purpose:** Track deployment timeline and document status

**Schema:**
```typescript
interface DeploymentProgress {
  id: string;
  userId: string;
  applicationId: string;
  jobId: string;
  agencyId: string;
  steps: DeploymentStep[];
  currentStep: number;
  targetDepartureDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface DeploymentStep {
  id: string;
  title: string;
  status: 'completed' | 'scheduled' | 'in_progress' | 'pending';
  completedAt?: Timestamp;
  scheduledAt?: Timestamp;
  location?: string;
  notes?: string;
  documents?: {
    name: string;
    url: string;
    uploadedAt: Timestamp;
  }[];
}
```

**Indexes Required:**
```json
{
  "collectionGroup": "deploymentProgress",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "updatedAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "deploymentProgress",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "currentStep", "order": "ASCENDING" }
  ]
}
```

**Security Rules:**
```javascript
match /deploymentProgress/{progressId} {
  allow read: if request.auth != null &&
    (request.auth.uid == resource.data.userId ||
     request.auth.uid == resource.data.agencyId);
  allow write: if request.auth != null && request.auth.uid == resource.data.agencyId;
}
```

#### 5. `notifications`
**Purpose:** Store user notifications

**Schema:**
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'job_match' | 'message' | 'application_update' | 'interview' | 'document' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    agencyId?: string;
  };
  createdAt: Timestamp;
}
```

**Indexes Required:**
```json
{
  "collectionGroup": "notifications",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "read", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "notifications",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "type", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

**Security Rules:**
```javascript
match /notifications/{notificationId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow update: if request.auth != null &&
    request.auth.uid == resource.data.userId &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

#### 6. `userPreferences`
**Purpose:** Store user settings and preferences

**Schema:**
```typescript
interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    jobMatches: boolean;
    messages: boolean;
    applicationUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'agencies_only' | 'private';
    showOnlineStatus: boolean;
  };
  recentSearches: string[];
  savedFilters: JobFilters[];
  language: 'en' | 'fil' | 'ceb';
  updatedAt: Timestamp;
}
```

**Security Rules:**
```javascript
match /userPreferences/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

#### 7. `costCalculations`
**Purpose:** Save user cost calculations (authenticated users only)

**Schema:**
```typescript
interface CostCalculation {
  id: string;
  userId: string;
  country: string;
  jobType: string;
  breakdown: {
    item: string;
    amount: number;
    paid: boolean;
    paidAt?: Timestamp;
  }[];
  totalEstimate: number;
  createdAt: Timestamp;
}
```

**Indexes Required:**
```json
{
  "collectionGroup": "costCalculations",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

**Security Rules:**
```javascript
match /costCalculations/{calcId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

#### 8. `notInterestedJobs`
**Purpose:** Track jobs user dismissed (guest: localStorage, auth: Firestore)

**Schema:**
```typescript
interface NotInterestedJobs {
  userId: string;
  jobIds: string[];
  updatedAt: Timestamp;
}
```

**Security Rules:**
```javascript
match /notInterestedJobs/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Composite Indexes Summary

Total new composite indexes needed: **8 indexes**

1. `aiChatHistory`: userId + createdAt (DESC)
2. `profileCompletion`: percentage + lastUpdated (DESC)
3. `deploymentProgress`: userId + updatedAt (DESC)
4. `deploymentProgress`: userId + currentStep
5. `notifications`: userId + read + createdAt (DESC)
6. `notifications`: userId + type + createdAt (DESC)
7. `costCalculations`: userId + createdAt (DESC)

### Migration Steps

#### Step 1: Create Collections
```bash
# Collections are auto-created on first write
# No manual creation needed
```

#### Step 2: Deploy Firestore Indexes
```bash
# Update firestore.indexes.json with new composite indexes
firebase deploy --only firestore:indexes
```

#### Step 3: Deploy Security Rules
```bash
# Update firestore.rules with new collection rules
firebase deploy --only firestore:rules
```

#### Step 4: Seed Initial Data (Optional)
```typescript
// scripts/seedFirestore.ts
async function seedAIUsageTracking() {
  const today = new Date().toISOString().split('T')[0];
  await db.collection('aiUsageTracking').doc(today).set({
    date: today,
    totalRequests: 0,
    guestRequests: 0,
    authenticatedRequests: 0,
    totalTokens: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheHitRate: 0,
    avgResponseTime: 0,
    errors: 0,
  });
}
```

### Data Retention Policies

1. **AI Chat History:** Keep for 90 days, then archive/delete
2. **AI Usage Tracking:** Keep for 12 months for analytics
3. **Notifications:** Auto-delete read notifications after 30 days
4. **Recent Searches:** Keep last 10 searches only
5. **Cost Calculations:** Keep indefinitely (user benefit)

### Cost Estimate (Firestore)

**Free Tier:**
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage

**Expected Usage (MVP with 500 users):**
- Reads: ~10,000/day (well within free tier)
- Writes: ~3,000/day (well within free tier)
- Storage: ~500 MB (well within free tier)

**Cost:** $0/month (within free tier)

**If exceeding free tier:**
- Reads: $0.06 per 100,000 reads
- Writes: $0.18 per 100,000 writes
- Storage: $0.18/GB/month

---

## Key Decisions

### 1. AI Integration Approach
**Decision:** Use Google Gemini Pro with FREE tier

**Final Choice:** ✅ **Google Gemini Pro (FREE tier) with Smart Caching**

**Why Gemini Pro:**
- **Cost:** $0/month (completely FREE)
- **Limits:** 1,500 requests/day, 1M tokens/month (more than enough for MVP)
- **Quality:** GPT-3.5 level performance (production-ready)
- **No Credit Card:** Can start immediately without payment setup
- **Capacity:** Supports 4,500-9,000 conversations/month FREE
- **Scalability:** Easy upgrade to paid tier if growth exceeds free limits

**Implementation Strategy:**
1. **Smart Caching** (60-70% cache hit rate expected)
   - Cache common questions about requirements, agency verification
   - Reduces API calls significantly
   - Instant responses for cached queries

2. **Rate Limiting**
   - Guest users: 3 queries per session (prevents abuse)
   - Authenticated users: 20 queries per hour (generous)
   - Global limit: 1,400 requests/day (buffer under 1,500 limit)

3. **Monitoring Dashboard**
   - Track daily usage in real-time
   - Alert at 80% of free tier (1,200 requests/day)
   - Admin can see cache hit rate, response times

4. **Automatic Fallback**
   - If limits reached: Switch to cached responses
   - Show users: "High demand today, using saved responses"
   - Resets automatically next day

**Cost Projection:**
- **Month 1-6:** $0/month (within free tier)
- **Month 7-12:** $0-10/month (if exceeding free tier)
- **Year 2+:** ~$20-50/month (estimated for 5,000+ active users)

**Alternatives Considered:**
- ❌ OpenAI GPT-4: $200-300/month (too expensive for MVP)
- ❌ OpenAI GPT-3.5 Turbo: $20-40/month (unnecessary cost)
- ❌ Rule-based only: Free but poor UX
- ✅ Gemini Pro: Perfect balance of FREE + quality

---

### 2. Philippine Address Data
**Decision Required:** How to handle Philippine provinces/cities/barangays?

**Options:**
- **A. Static JSON File**
  - Pros: Fast, no API calls, works offline
  - Cons: Needs updates when PSA releases new data
  - Size: ~500KB JSON file
  - Best for: Simple implementation

- **B. PSGC API Integration**
  - Pros: Always up-to-date, official source
  - Cons: Requires internet, API may have downtime
  - Best for: Government compliance

- **C. Hybrid: JSON + Annual Updates** ⭐ RECOMMENDED
  - Pros: Fast, reliable, maintainable
  - Cons: Need to remember to update annually
  - Implementation: Bundle JSON file, update from PSA website yearly

**Recommendation:** Use static JSON (Option A or C) for better UX, update annually.

---

### 3. Country Selection Component
**Decision Required:** How to implement country multi-select with flags?

**Options:**
- **A. Custom Component**
  - Pros: Full control, exact mockup match
  - Cons: More development time, need to maintain
  - Best for: Unique UX requirements

- **B. React-Select + Country-Flag-Icons** ⭐ RECOMMENDED
  - Pros: Battle-tested, accessible, customizable
  - Cons: Need to style to match theme
  - Best for: Production apps

- **C. Radix UI + Custom Options**
  - Pros: Headless, accessible, flexible
  - Cons: More setup required
  - Best for: Design system consistency

**Recommendation:** Use React-Select (Option B) with custom styling.

---

### 4. Image Optimization Strategy
**Decision Required:** How to handle mockup images and user uploads?

**Options:**
- **A. Next.js Image Component**
  - Pros: Automatic optimization, lazy loading, WebP conversion
  - Cons: Requires image optimization API (Vercel or self-hosted)
  - Best for: All images

- **B. Cloudinary/ImgIX**
  - Pros: Advanced transformations, CDN, face detection
  - Cons: Additional cost, external dependency
  - Best for: User-generated content

- **C. Firebase Storage + Next.js Image** ⭐ RECOMMENDED
  - Pros: Integrated with current backend, cost-effective
  - Cons: Manual optimization for some features
  - Best for: Current architecture

**Recommendation:** Use Next.js Image for all static assets, Firebase Storage for user uploads.

---

### 5. Animation Intensity
**Decision Required:** How much animation to implement from mockups?

**Options:**
- **A. Full Mockup Animations**
  - Pros: Delightful UX, matches design vision
  - Cons: Performance impact, longer development
  - Best for: High-end devices, marketing pages

- **B. Essential Animations Only** ⭐ RECOMMENDED
  - Pros: Good UX, performant, faster to build
  - Cons: Less "wow" factor
  - Best for: Production MVP
  - Include: Page transitions, button hovers, modal enters/exits, success states

- **C. Progressive Enhancement**
  - Pros: Works everywhere, animates on capable devices
  - Cons: Complex implementation
  - Best for: Large user base with varied devices

**Recommendation:** Option B (Essential Animations), add more in future iterations based on performance metrics.

---

### 6. Dark Mode Implementation
**Decision Required:** Should dark mode be a priority for initial launch?

**Options:**
- **A. Launch with Dark Mode**
  - Pros: Modern UX, better for low-light usage
  - Cons: Doubles design/testing work
  - Timeline: +2-3 days

- **B. Launch Light Mode Only, Add Dark Mode Later** ⭐ RECOMMENDED
  - Pros: Faster launch, focus on core features
  - Cons: Users expect dark mode nowadays
  - Timeline: Launch on time, add in Phase 2

- **C. Dark Mode with Auto-Detect**
  - Pros: Respects user preference
  - Cons: Need to handle both from start
  - Timeline: +3 days

**Recommendation:** Option B (Add Dark Mode Later) - focus on core features for launch, add dark mode in Phase 2 based on user feedback.

---

### 7. File Upload Approach
**Decision Required:** How to handle document uploads (resume, certificates, IDs)?

**Options:**
- **A. Direct Firebase Storage Upload**
  - Pros: Simple, integrated
  - Cons: No virus scanning, limited validation
  - Best for: MVP

- **B. Firebase Storage + Cloud Functions Validation** ⭐ RECOMMENDED
  - Pros: Server-side validation, virus scanning, image optimization
  - Cons: More complex setup, additional cost
  - Best for: Production app with security concerns

- **C. Third-Party Service (Uploadcare, Filestack)**
  - Pros: Full-featured, CDN, transformations
  - Cons: Additional cost, vendor lock-in
  - Best for: Enterprise apps

**Recommendation:** Option B (Firebase + Cloud Functions) for security and compliance.

---

### 8. Testing Strategy
**Decision Required:** What level of testing to implement?

**Options:**
- **A. Manual Testing Only**
  - Pros: Fast to implement, flexible
  - Cons: Error-prone, time-consuming for regressions
  - Best for: Prototype/demo

- **B. Manual + E2E Tests (Playwright)** ⭐ RECOMMENDED
  - Pros: Critical paths automated, catches regressions
  - Cons: Setup time, maintenance
  - Best for: Production apps
  - Cover: Authentication, onboarding, job search, apply flow

- **C. Full Test Suite (Unit + Integration + E2E)**
  - Pros: High confidence, refactor-safe
  - Cons: Significant time investment
  - Best for: Large teams, mature products

**Recommendation:** Option B (Manual + E2E) - automate critical user journeys.

---

## Timeline & Resources

### 20-Day Implementation Timeline

| Phase | Days | Deliverables | Dependencies |
|-------|------|-------------|--------------|
| **Phase 1: Theme Enhancement** | 1-2 | Enhanced theme config, gold accent added | None |
| **Phase 2: UI Components** | 3-5 | 8 new base components | Phase 1 complete |
| **Phase 3: Onboarding** | 6-8 | 7 onboarding screens | Phase 2 complete |
| **Phase 4: Job Features** | 9-12 | Enhanced job browsing/apply | Phase 2 complete |
| **Phase 5: AI & Advanced** | 13-15 | Chatbot, tracker, filters | Phase 2 complete |
| **Phase 6: Polish** | 16-18 | Dark mode, animations, states | All features complete |
| **Phase 7: Testing** | 19-20 | QA, performance, accessibility | All development complete |

### Critical Path
1. Theme Enhancement (Day 1-2) - **BLOCKING** (Minor updates to existing theme)
2. Core UI Components (Day 3-5) - **BLOCKING**
3. Onboarding Flow (Day 6-8) - Independent
4. Job Features (Day 9-12) - Independent
5. AI & Advanced (Day 13-15) - Independent
6. Polish (Day 16-18) - Depends on all features
7. Testing (Day 19-20) - Final gate

### Resource Requirements

**Development:**
- 1 Full-Stack Developer (primary)
- 1 UI/UX Designer (part-time for review/adjustments)
- 1 QA Tester (Days 16-20)

**Tools Needed:**
- Figma (for mockup reference)
- Firebase Console (database, storage, auth)
- Chrome DevTools
- VS Code + extensions
- Browser testing tools (BrowserStack or similar)

**Budget Considerations:**
- Firebase usage: ~$20-50/month (development)
- OpenAI API (if used): ~$50/month (estimated)
- Testing tools: Free tier sufficient
- Domain/hosting: Existing (Vercel)

---

## Risk Assessment

### High Risk Items 🔴
1. **AI Chatbot Integration**
   - Risk: Complex implementation, potential cost overruns
   - Mitigation: Start with rule-based, upgrade to AI later

2. **Performance with Animations**
   - Risk: Janky animations on low-end devices
   - Mitigation: Use CSS transforms only, test on real devices early

3. **File Upload Security**
   - Risk: Malicious file uploads, oversized files
   - Mitigation: Strict validation, virus scanning, size limits

### Medium Risk Items 🟡
1. **Cross-Browser Compatibility**
   - Risk: Safari-specific bugs (date pickers, gestures)
   - Mitigation: Test on Safari early and often

2. **Dark Mode Consistency**
   - Risk: Color contrast issues, missed components
   - Mitigation: Use Tailwind dark: utilities consistently

3. **Philippine Address Data**
   - Risk: Outdated or incorrect data
   - Mitigation: Use official PSGC source, update annually

### Low Risk Items 🟢
1. **Theme Enhancements**
   - Risk: Minimal - only adding gold accent to existing palette
   - Mitigation: Keep existing theme intact, add new accent color sparingly

2. **New UI Components**
   - Risk: Accessibility issues
   - Mitigation: Follow ARIA best practices, use semantic HTML

3. **Deployment Tracker**
   - Risk: Complex state management
   - Mitigation: Well-defined data model, use Firestore listeners

---

## Success Metrics

### Launch Criteria (Must-Have)
- [ ] All 35 mockup screens implemented (adapted to current theme)
- [ ] Theme enhanced with gold accent for special highlights
- [ ] Existing brand colors maintained (blue #2563eb + purple #d946ef)
- [ ] Onboarding flow functional (all 7 screens)
- [ ] Job search, filter, and apply working
- [ ] Mobile responsive (375px to 768px)
- [ ] Desktop responsive (1024px+)
- [ ] Core user journeys tested
- [ ] No critical bugs
- [ ] Lighthouse score >80 (all categories)

### Quality Metrics (Target)
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Lighthouse Best Practices: >90
- Lighthouse SEO: >90
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

### User Experience Metrics (Post-Launch)
- User sign-up completion rate: >70%
- Profile setup completion rate: >80%
- Job application submission rate: >50%
- Average session duration: >5 minutes
- Return user rate (7-day): >40%
- User satisfaction rating: >4/5

---

## Rollout Plan

### Week 1: Soft Launch (Internal Testing)
- Deploy to staging environment
- Internal team testing
- Fix critical bugs
- Gather feedback

### Week 2: Beta Launch (Limited Users)
- Invite 50-100 beta users
- Monitor analytics closely
- Collect user feedback surveys
- Fix bugs and UX issues

### Week 3: Public Launch
- Deploy to production
- Announce on social media
- Monitor server load
- 24/7 support for first week

### Week 4+: Iteration
- Analyze user behavior
- Prioritize feature requests
- Plan Phase 2 enhancements
- Continuous improvements

---

## Phase 2 Enhancements (Future)

### Short-Term (1-2 months)
1. Dark mode (if not in Phase 1)
2. Push notifications (mobile)
3. Offline mode (PWA)
4. Advanced search filters
5. Job recommendations algorithm

### Medium-Term (3-6 months)
1. Video interview integration
2. In-app chat with video call
3. Document verification automation
4. Payment integration (OWWA, fees)
5. Multi-language support (Filipino, Ilocano, Cebuano)

### Long-Term (6-12 months)
1. Mobile app (React Native)
2. Employer direct hiring portal
3. OFW community forum
4. Remittance tracking
5. Pre-departure training courses
6. Marketplace for services (packing, shipping, etc.)

---

## Appendix

### A. Color Reference

**Modern Tech Theme Colors (Current & Enhanced):**
```css
/* Primary Colors (Existing) */
--primary-blue: #2563eb;        /* Blue-600 - Main brand color */
--primary-blue-dark: #1e40af;   /* Blue-700 - Hover states */
--primary-blue-light: #3b82f6;  /* Blue-500 - Lighter variant */
--purple-gradient: #9333ea;     /* Purple-600 - Gradients */
--accent-color: #8b5cf6;        /* Purple-500 - Accent highlights */

/* Special Accent (New) */
--gold-accent: #FCD116;         /* Gold - Featured/Premium items only */

/* Status Colors */
--success-green: #28a745;       /* Verified badges, success states */
--warning-amber: #ff9800;       /* Pending, attention needed */
--error-red: #dc3545;           /* Errors, rejections */
--info-blue: #17a2b8;           /* Information, tips */

/* Neutral Colors */
--white: #FFFFFF;
--gray-50: #f8f9fa;
--gray-100: #e9ecef;
--gray-200: #dee2e6;
--gray-300: #ced4da;
--gray-500: #6c757d;
--gray-700: #495057;
--gray-900: #212529;

/* Dark Mode Colors (Phase 6) */
--dark-bg: #1a1a1a;
--dark-surface: #2d2d2d;
--dark-text: #ffffff;
--dark-text-secondary: #b0b0b0;
```

**Color Usage Guidelines:**
- **Primary Blue (#2563eb):** Buttons, links, main actions, brand elements
- **Purple (#d946ef):** Accents, gradients, secondary highlights
- **Gold (#FCD116):** ONLY for featured badges, awards, premium indicators
- **Success Green:** Verified badges (DMW), completed states, success messages
- **Warning Amber:** Pending statuses, important notices
- **Error Red:** Errors, rejections, critical warnings
- **Info Blue:** Tooltips, informational messages

### B. Typography Scale
```css
/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 28px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### C. Spacing System (8px Base)
```css
--space-1: 4px;   /* 0.5 unit */
--space-2: 8px;   /* 1 unit */
--space-3: 12px;  /* 1.5 units */
--space-4: 16px;  /* 2 units */
--space-6: 24px;  /* 3 units */
--space-8: 32px;  /* 4 units */
--space-12: 48px; /* 6 units */
--space-16: 64px; /* 8 units */
```

### D. Breakpoints
```css
--screen-xs: 375px;
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

### E. Animation Presets
```typescript
// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2 }
};
```

### F. Useful Resources
- **Mockup Document:** `Complete Visual Screen Mockups.txt`
- **Figma Design:** (Link to be added)
- **PSGC Data:** https://psa.gov.ph/classification/psgc
- **DMW OFW Guide:** https://dmw.gov.ph
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion
- **Firebase Docs:** https://firebase.google.com/docs

---

## Document Control

**Version History:**
- v1.0 (November 2025) - Initial plan created

**Approval:**
- [ ] Development Team Lead
- [ ] Product Manager
- [ ] UI/UX Designer

**Next Review Date:** After Phase 3 completion (Day 8)

---

**End of Implementation Plan**

*This is a living document. Update as implementation progresses and requirements change.*
