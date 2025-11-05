# Visual Mockups Flow & Screen Diagrams
## Job-Agent-PH Application

**Document Version:** 1.0
**Created:** November 2025
**Related:** VISUAL_MOCKUPS_IMPLEMENTATION_PLAN.md

---

## 📱 Quick Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                            │
└─────────────────────────────────────────────────────────────────┘

GUEST USER PATH:
Splash → Home (Browse) → Job Details → [Auth Prompt] → Signup → Apply

AUTHENTICATED USER PATH:
Splash → Home → Profile Setup → Browse Jobs → Apply → Track Applications

```

---

## 🎨 Phase 1: Theme Enhancement (Days 1-2)

### Visual Color Palette

```
┌─────────────────────────────────────────────┐
│          COLOR SYSTEM OVERVIEW              │
└─────────────────────────────────────────────┘

PRIMARY COLORS:
■ #2563eb  Blue (Main brand - buttons, links)
■ #d946ef  Purple (Accents, gradients)
■ #FCD116  Gold (Featured badges, awards) ⭐ NEW

STATUS COLORS:
■ #28a745  Green (Verified, success)
■ #ff9800  Amber (Warning, pending)
■ #dc3545  Red (Errors, rejected)
■ #17a2b8  Info Blue (Tooltips)

USAGE EXAMPLES:
┌──────────────────────┐
│  [Login Button]      │  ← Blue #2563eb
└──────────────────────┘

┌──────────────────────┐
│ ⭐ Featured Job      │  ← Gold badge
└──────────────────────┘

┌──────────────────────┐
│ ✓ DMW Verified       │  ← Green badge
└──────────────────────┘
```

---

## 📦 Phase 2: Core UI Components (Days 3-5)

### Component Library Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                    8 NEW UI COMPONENTS                          │
└─────────────────────────────────────────────────────────────────┘

1. PROGRESS BAR
   ████████████░░░░░░░░  60%
   Profile Complete

2. STEP INDICATOR (Dots)
   ● ● ○ ○ ○
   (Current: Step 2 of 5)

3. STEP INDICATOR (Numbered)
   ✓ → ✓ → 2 → ○ → ○
   (Current: Step 3 of 5)

4. CHIP/TAG
   ┌─────────────┐
   │ Nursing  ✕  │  ← Removable
   └─────────────┘

5. BOTTOM SHEET MODAL
   ┌─────────────────────────┐
   │         ═══             │  ← Drag handle
   │                         │
   │    Filter Options       │
   │    [Content...]         │
   │                         │
   └─────────────────────────┘
   ↑ Swipe down to close

6. TIMELINE
   ✓ ─── Job Offer Accepted
   ✓ ─── Medical Exam
   ⏳ ─── PDOS Attendance (active)
   ○ ─── OEC Processing
   ○ ─── Flight Booking

7. STAT CARD
   ┌─────────────┐
   │   💼  12    │
   │   Applied   │
   └─────────────┘

8. EMPTY STATE
   ┌─────────────────────┐
   │         📭          │
   │                     │
   │  No applications    │
   │      yet            │
   │                     │
   │  [Browse Jobs]      │
   └─────────────────────┘
```

---

## 🚀 Phase 3: Onboarding Flow (Days 6-8)

### Screen Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              ONBOARDING FLOW (7 SCREENS)                        │
└─────────────────────────────────────────────────────────────────┘

SCREEN 1: SPLASH (1.5s)
┌─────────────────────┐
│                     │
│       ╔═══╗         │
│       ║   ║         │
│       ║ 🌐 ║        │  Job-Agent-PH Logo
│       ║   ║         │
│       ╚═══╝         │
│                     │
│  WorkAbroad PH      │
│                     │
│  Your Gateway to    │
│  Global Jobs        │
│                     │
│      ⟳ Loading      │
│                     │
│      v1.0.0         │
└─────────────────────┘
        ↓
   Auto-advance
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ DECISION: First Visit?                                          │
│  YES → HOME (Guest Mode)                                        │
│  NO  → HOME (Check Auth Silently)                              │
└─────────────────────────────────────────────────────────────────┘


SCREEN 2-4: WELCOME CAROUSEL (Optional - via Settings)
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  SLIDE 1/3          │  │  SLIDE 2/3          │  │  SLIDE 3/3          │
│                     │  │                     │  │                     │
│       🛡️            │  │       💬            │  │       🤖            │
│                     │  │                     │  │                     │
│   Safe & Verified   │  │  Talk Directly to   │  │  AI Matching Jobs   │
│                     │  │      Agencies       │  │                     │
│ Only DMW-licensed   │  │  Get instant        │  │  Our AI finds      │
│ agencies. Zero      │  │  responses. No      │  │  perfect jobs      │
│ scams.              │  │  waiting days.      │  │  for you.          │
│                     │  │                     │  │                     │
│   ● ○ ○             │  │   ○ ● ○             │  │   ○ ○ ●             │
│                     │  │                     │  │                     │
│ [Skip]   [Next →]   │  │ [Skip]   [Next →]   │  │ [Skip][Get Started] │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
    Swipe →                  Swipe →                      ↓
                                                    Goes to HOME


SCREEN 5: LOGIN (Context-Aware)
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Welcome Back! 👋               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email or Phone           │  │
│  │ [juan@email.com       ]  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password                 │  │
│  │ [••••••••••           ]👁 │  │
│  └───────────────────────────┘  │
│                                 │
│  ☐ Remember me                  │
│            Forgot Password?     │
│                                 │
│  ┌───────────────────────────┐  │
│  │      LOGIN              │  │  ← Blue #2563eb
│  └───────────────────────────┘  │
│                                 │
│     ─────── OR ───────          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔵 Continue with Google  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📘 Continue with Facebook│  │
│  └───────────────────────────┘  │
│                                 │
│  Don't have an account?         │
│         Sign Up                 │
└─────────────────────────────────┘


SCREEN 6: SIGNUP (Context-Aware)
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  Create Account 🎉              │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Full Name                │  │
│  │ [Juan Dela Cruz      ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email Address            │  │
│  │ [juan@email.com      ] ✓ │  │ ← Real-time validation
│  └───────────────────────────┘  │
│  ✓ Email is available           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Phone Number             │  │
│  │ [+63 917 123 4567    ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password                 │  │
│  │ [••••••••••           ]👁 │  │
│  └───────────────────────────┘  │
│  ████░░░ Strength: Good         │
│                                 │
│  ☐ I agree to Terms of Service  │
│     and Privacy Policy          │
│                                 │
│  ┌───────────────────────────┐  │
│  │     SIGN UP             │  │
│  └───────────────────────────┘  │
│                                 │
│     ─────── OR ───────          │
│                                 │
│  [🔵 Google]  [📘 Facebook]     │
│                                 │
│  Already have an account?       │
│           Login                 │
└─────────────────────────────────┘


MODAL VARIANT: AUTH PROMPT (NEW)
┌─────────────────────────────────┐
│          ═══                    │  ← Bottom Sheet
│                                 │
│  Sign up to apply to this job   │  ← Context-aware message
│                                 │
│  ┌─────────────────────────┐    │
│  │ 💼 Registered Nurse    │    │  ← Job preview
│  │ Dubai, UAE             │    │
│  │ ₱75,000/month          │    │
│  └─────────────────────────┘    │
│                                 │
│  Quick Signup:                  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [Email              ]    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [Password           ]👁  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      SIGN UP            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔵 Continue with Google │  │
│  └───────────────────────────┘  │
│                                 │
│  Already have account? Log in   │
│                                 │
└─────────────────────────────────┘


SCREEN 7: ACCOUNT TYPE SELECTION
┌─────────────────────────────────┐
│                                 │
│      I am a...                  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                          │  │
│  │    🎯 JOB SEEKER        │  │  ← Selectable cards
│  │                          │  │
│  │  Looking for work abroad │  │
│  │  and new opportunities   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                          │  │
│  │    🏢 AGENCY             │  │
│  │                          │  │
│  │  Recruiting Filipino     │  │
│  │  workers for employers   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                          │  │
│  │    👷 CURRENT OFW       │  │
│  │                          │  │
│  │  Already working abroad, │  │
│  │  seeking new opportunity │  │
│  └───────────────────────────┘  │
│                                 │
│      [CONTINUE →]               │
│                                 │
└─────────────────────────────────┘


SCREENS 8-12: PROFILE SETUP WIZARD (5 Steps)

STEP 1/5: PERSONAL INFO (20%)
┌─────────────────────────────────┐
│  ████░░░░░░░░░░░░░░  20%        │  ← Progress bar
│                                 │
│  Tell us about yourself         │
│                                 │
│      ┌──────────┐               │
│      │          │               │
│      │   📷     │               │  ← Photo upload
│      │  Photo   │               │
│      └──────────┘               │
│    Tap to add photo             │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Full Name *              │  │
│  │ [Juan Dela Cruz      ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Date of Birth * 📅       │  │
│  │ [01/15/1995          ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Gender * ▼               │  │
│  │ [Male                ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Civil Status * ▼         │  │
│  │ [Single              ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  [Skip]              [Next →]   │
│                                 │
└─────────────────────────────────┘


STEP 2/5: CONTACT INFO (40%)
┌─────────────────────────────────┐
│  ████████░░░░░░░░  40%          │
│                                 │
│  How can we reach you?          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email Address            │  │
│  │ juan@email.com        ✓  │  │  ← Pre-filled
│  └───────────────────────────┘  │
│  ✓ Email verified               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Phone Number *           │  │
│  │ [+63 917 123 4567    ]   │  │
│  └───────────────────────────┘  │
│  We'll send verification code   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Province/City * ▼        │  │
│  │ [Metro Manila        ]   │  │  ← Cascading
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Municipality/City * ▼    │  │
│  │ [Quezon City         ]   │  │  ← Dependent
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Barangay (Optional) ▼    │  │
│  │ [                    ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  [← Back]            [Next →]   │
│                                 │
└─────────────────────────────────┘


STEP 3/5: PROFESSIONAL (60%)
┌─────────────────────────────────┐
│  ████████████░░░░  60%          │
│                                 │
│  Your professional background   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Current Job Title *      │  │
│  │ [Registered Nurse    ]   │  │
│  └───────────────────────────┘  │
│  💡 Suggested: Staff Nurse      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Years of Experience * ▼  │  │
│  │ [2-3 years           ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Industry/Field * ▼       │  │
│  │ [Healthcare          ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  Popular Industries:            │
│  [Healthcare][Engineering]      │
│  [IT][Construction][+More]      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Highest Education * ▼    │  │
│  │ [Bachelor's Degree   ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Field of Study           │  │
│  │ [Nursing             ]   │  │
│  └───────────────────────────┘  │
│                                 │
│  [← Back]            [Next →]   │
│                                 │
└─────────────────────────────────┘


STEP 4/5: SKILLS & PREFERENCES (80%)
┌─────────────────────────────────┐
│  ████████████████░░  80%        │
│                                 │
│  Skills & Job Preferences       │
│                                 │
│  Top Skills *                   │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search skills...      │  │
│  └───────────────────────────┘  │
│                                 │
│  Your Skills:                   │
│  ┌────────┬────────┬────────┐   │
│  │Nursing │English │  IV   │   │  ← Removable chips
│  │   ✕    │   ✕    │   ✕   │   │
│  └────────┴────────┴────────┘   │
│  ┌────────────┬──────────────┐  │
│  │Patient Care│ [+ Add More]│  │
│  │     ✕      │              │  │
│  └────────────┴──────────────┘  │
│                                 │
│  Suggested: [+CPR][+BLS][+ACLS] │
│                                 │
│  Preferred Countries * (Max 5)  │
│  [🇦🇪 UAE][🇸🇦 Saudi][🇶🇦 Qatar]  │
│  [🇨🇦 Canada][🇦🇺 Australia]      │
│  [+ View All Countries]         │
│                                 │
│  Salary Expectation             │
│  ┌────────┐  to  ┌────────┐    │
│  │₱50,000 │      │₱80,000 │    │  ← Range sliders
│  └────────┘      └────────┘    │
│                                 │
│  Earliest Start Date            │
│  ⦿ Immediately                  │
│  ○ 1-2 months                   │
│  ○ 3-6 months                   │
│                                 │
│  [← Back]            [Next →]   │
│                                 │
└─────────────────────────────────┘


STEP 5/5: DOCUMENT UPLOAD (100%)
┌─────────────────────────────────┐
│  ████████████████████  100%     │
│                                 │
│  Upload Documents               │
│  (You can do this later)        │
│                                 │
│  ┌───────────────────────────┐  │
│  │    📄 Resume/CV          │  │
│  │                          │  │
│  │    Drag & drop or        │  │  ← Drop zones
│  │    [+ Upload File]       │  │
│  │                          │  │
│  │  PDF, DOC (max 5MB)      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │    📜 Certificates       │  │
│  │                          │  │
│  │    [+ Upload File]       │  │
│  │                          │  │
│  │  PDF, JPG (max 5MB)      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │    🪪 Valid ID           │  │
│  │                          │  │
│  │    [+ Upload File]       │  │
│  │                          │  │
│  │  JPG, PNG (max 5MB)      │  │
│  └───────────────────────────┘  │
│                                 │
│  💡 Tip: Complete documents     │
│     increase your chances by 3x!│
│                                 │
│  [Skip for now]                 │
│  [Complete Profile Setup →]     │
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 Phase 4: Enhanced Job Features (Days 9-12)

### Home & Job Browsing Screens

```
┌─────────────────────────────────────────────────────────────────┐
│                   GUEST vs AUTHENTICATED VIEWS                  │
└─────────────────────────────────────────────────────────────────┘

HOME SCREEN - GUEST USER
┌─────────────────────────────────┐
│  Job-Agent  🔔(0)  [Login]      │  ← Header
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search jobs...     🎤 │  │  ← Search bar
│  └───────────────────────────┘  │
│                                 │
│  Find Your Dream Job Abroad     │  ← Generic greeting
│                                 │
│  ┌───────────────────────────┐  │
│  │ 💡 Sign up for           │  │  ← Guest CTA (dismissible)
│  │    personalized matches   │  │
│  │    [Sign Up]     [×]     │  │
│  └───────────────────────────┘  │
│                                 │
│  Popular Categories             │
│  [Healthcare][IT][Engineering]  │
│  [Construction][Hospitality]    │
│                                 │
│  🔥 FEATURED JOBS               │
│  ┌───────────────────────────┐  │
│  │ 💼 Registered Nurse      │  │
│  │ Dubai, UAE               │  │
│  │ ₱75,000/month            │  │
│  │                          │  │
│  │ [Apply] [💾 Save]        │  │  ← Both trigger auth
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🏗️ Civil Engineer        │  │
│  │ Saudi Arabia             │  │
│  │ ₱95,000/month            │  │
│  │                          │  │
│  │ [Apply] [💾 Save]        │  │
│  └───────────────────────────┘  │
│                                 │
│  📚 LEARNING HUB                │
│  Kuwait Cultural Guide          │
│  5 min read                     │
│                                 │
│  🌟 SUCCESS STORIES             │
│  "From Cebu to Canada..."       │
│                                 │
└─────────────────────────────────┘
│[🏠][🔍][💬][📄][👤]              │  ← Bottom nav (guest)
└─────────────────────────────────┘


HOME SCREEN - AUTHENTICATED USER
┌─────────────────────────────────┐
│  👤 Juan 📸  🔔(3)  ⚙️          │  ← Header with avatar
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search jobs...     🎤 │  │
│  └───────────────────────────┘  │
│                                 │
│  Good morning, Juan! ☀️         │  ← Personalized
│                                 │
│  ┌───────────────────────────┐  │
│  │ Profile: 85% ███████░░░░  │  │  ← Completion bar
│  │ [Complete Now →]         │  │
│  └───────────────────────────┘  │
│                                 │
│  🔥 URGENT HIRING (3)           │
│  ┌───────────────────────────┐  │
│  │ 🔥 Registered Nurse      │  │
│  │ Dubai, UAE               │  │
│  │ ⭐ 94% Match             │  │  ← Match percentage
│  │ ₱75,000/month            │  │
│  │ Posted 2h ago            │  │
│  │                          │  │
│  │ [APPLY]      [MESSAGE]   │  │
│  └───────────────────────────┘  │
│  [View All Urgent Jobs →]       │
│                                 │
│  ✨ RECOMMENDED FOR YOU (12)    │
│  ┌────────┬────────┬────────┐   │
│  │💼 92% ││🏗️ 88% ││💻 85% │   │  ← Carousel
│  │Nurse  ││Civil  ││  IT   │   │
│  │Dubai  ││Saudi  ││Qatar  │   │
│  └────────┴────────┴────────┘   │
│                                 │
│  💬 MESSAGES (2 unread)         │
│  ┌───────────────────────────┐  │
│  │ 🏢 Staffhouse Intl      │  │
│  │ "Interview scheduled..." │  │
│  │ 2 min ago            [2]│  │
│  └───────────────────────────┘  │
│  [View All Messages →]          │
│                                 │
│  📚 LEARNING HUB                │
│  Kuwait Cultural Guide          │
│                                 │
└─────────────────────────────────┘
│[🏠][🔍][💬2][📄][👤]             │  ← Bottom nav (auth)
└─────────────────────────────────┘


JOB SEARCH/BROWSE SCREEN (ALL USERS)
┌─────────────────────────────────┐
│  [← Back]           [Filters]   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔍 Nurse jobs Dubai  🎤  │  │
│  └───────────────────────────┘  │
│                                 │
│  Recent Searches                │
│  • Nurse jobs Dubai          ✕  │
│  • Engineer Saudi Arabia     ✕  │
│  • IT support Qatar          ✕  │
│  [Clear All]                    │
│                                 │
│  QUICK FILTERS                  │
│  [All][Healthcare][IT][Eng...→] │  ← Horizontal scroll
│                                 │
│  🌍 COUNTRY                     │
│  [🇸🇦][🇦🇪][🇶🇦][🇰🇼][+More]     │
│                                 │
│  RESULTS (243 jobs)             │
│  [Sort: Relevance ▼]            │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔥 Registered Nurse      │  │
│  │ Al-Salam Hospital        │  │
│  │ 📍 Dubai, UAE            │  │
│  │                          │  │
│  │ ⭐ 94% Match • ₱75,000/mo│  │  ← Match if auth
│  │ Posted 2h ago • 45 apps  │  │
│  │                          │  │
│  │ [APPLY] [💾] [💬]        │  │  ← Auth prompts
│  └───────────────────────────┘  │
│    ← Swipe: Save | Dismiss →    │  ← Swipe actions
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🏗️ Civil Engineer        │  │
│  │ Saudi Binladin Group     │  │
│  │ 📍 Riyadh, Saudi Arabia  │  │
│  │                          │  │
│  │ ⭐ 88% Match • ₱95,000/mo│  │
│  │ Posted 1d ago • 120 apps │  │
│  │                          │  │
│  │ [APPLY] [💾] [💬]        │  │
│  └───────────────────────────┘  │
│                                 │
│  [Load More (20 jobs)...]       │
│                                 │
└─────────────────────────────────┘


FILTER MODAL (Bottom Sheet)
┌─────────────────────────────────┐
│          ═══                    │  ← Drag handle
│  Filters            [Reset]     │
│                                 │
│  💼 JOB TYPE                    │
│  ☑ Full-time                    │
│  ☐ Part-time                    │
│  ☑ Contract (2 years)           │
│  ☐ Temporary                    │
│                                 │
│  💰 SALARY RANGE                │
│  ₱20,000 ━━━━●━━━━━━━ ₱150,000  │  ← Dual slider
│         (₱50,000/month)         │
│                                 │
│  📅 POSTED DATE                 │
│  ○ Last 24 hours                │
│  ⦿ Last 7 days                  │
│  ○ Last 30 days                 │
│  ○ Anytime                      │
│                                 │
│  ⭐ AGENCY RATING               │
│  3.0 ━━━━━━●━━━ 5.0            │
│         (4.0+ stars)            │
│                                 │
│  🌍 COUNTRY/REGION              │
│  ☑ 🇦🇪 United Arab Emirates     │
│  ☑ 🇸🇦 Saudi Arabia             │
│  ☐ 🇶🇦 Qatar                    │
│  ☐ 🇰🇼 Kuwait                   │
│  [+ Show More Countries]        │
│                                 │
│  ⚙️ MORE OPTIONS                │
│  ☑ Verified agencies only       │
│  ☐ With salary info             │
│  ☐ Remote opportunities         │
│                                 │
│  ┌───────────────────────────┐  │
│  │   APPLY FILTERS (67)     │  │  ← Result count
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Job Details Screen (3-Part Scroll)

```
JOB DETAILS - PART 1 (Header + Overview)
┌─────────────────────────────────┐
│  [← Back]  [💾] [↗️ Share]      │  ← Sticky header
│                                 │
│  💼 Registered Nurse            │
│  Al-Salam Hospital              │
│  📍 Dubai, United Arab Emirates │
│                                 │
│  ⭐ 94% Match for you           │  ← Only if authenticated
│                                 │
│  ┌───────────────────────────┐  │
│  │    [QUICK APPLY]         │  │  ← Auth prompt if guest
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │  [💬 MESSAGE AGENCY]     │  │  ← Auth prompt if guest
│  └───────────────────────────┘  │
│                                 │
│  📋 JOB OVERVIEW               │
│  ┌─────────────────────────┐   │
│  │ 💰 Salary  ₱75,000/month│   │
│  │ 📝 Contract    2 years  │   │
│  │ 👥 Vacancies  5 positions   │
│  │ 📍 Location  Dubai, UAE │   │
│  │ ⏰ Posted    2 hours ago│   │
│  │ 📊 Applications    45   │   │
│  └─────────────────────────┘   │
│                                 │
│  📄 JOB DESCRIPTION            │
│  We are seeking qualified      │
│  Registered Nurses to join our │
│  expanding team at Al-Salam    │
│  Hospital in Dubai...          │
│                                 │
│  [Read More ↓]                  │
│                                 │
│  ✅ REQUIREMENTS                │
│  • Bachelor's Degree in Nursing │
│  • Valid RN license (PRC)       │
│  • 2+ years hospital experience │
│  • IELTS 6.5 or equivalent      │
│  • HAAD/DHA eligible            │
│  • BLS/ACLS certified           │
│                                 │
│     [Scroll for more ↓]         │
│                                 │
└─────────────────────────────────┘


JOB DETAILS - PART 2 (Benefits + Agency)
┌─────────────────────────────────┐
│       [Scrolled content]        │
│                                 │
│  🎁 BENEFITS                    │
│  • Tax-free monthly salary      │
│  • Free shared accommodation    │
│  • Annual flight ticket home    │
│  • Medical insurance coverage   │
│  • 30 days annual leave         │
│  • End of service benefits      │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🏢 ABOUT THE AGENCY      │  │
│  │                          │  │
│  │    [Agency Logo]         │  │
│  │                          │  │
│  │ Staffhouse International │  │
│  │ ⭐ 4.8 (234 reviews)     │  │
│  │ ✓ DMW Verified           │  │  ← Green badge
│  │ ⏱️ Response: 2 hours     │  │
│  │ 👥 1,500+ placements     │  │
│  │ 📅 Est. 1999 (26 years)  │  │
│  │                          │  │
│  │ [VIEW FULL PROFILE]      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📍 JOB LOCATION         │  │
│  │                          │  │
│  │    [🗺️ Map View]         │  │
│  │  Dubai Healthcare City   │  │
│  │                          │  │
│  │  Al-Salam Hospital       │  │
│  │  📍 Pin on map           │  │
│  │                          │  │
│  │  [Get Directions →]      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  💡 COST CALCULATOR      │  │  ← Available to all
│  │                          │  │
│  │  Estimated costs:        │  │
│  │  ₱8,500 - ₱15,000        │  │
│  │                          │  │
│  │  [View Breakdown →]      │  │
│  │                          │  │
│  │  ⚠️ Report if fees exceed│  │
│  └───────────────────────────┘  │
│                                 │
│     [Scroll for more ↓]         │
│                                 │
└─────────────────────────────────┘


JOB DETAILS - PART 3 (Reviews + Similar)
┌─────────────────────────────────┐
│       [Scrolled content]        │
│                                 │
│  💬 REVIEWS FROM OFWs (234)     │
│                                 │
│  ⭐⭐⭐⭐⭐ 4.8 out of 5.0       │
│                                 │
│  [5⭐ 180] ████████████████ 77% │
│  [4⭐  34] ████░░░░░░░░░░░ 15% │
│  [3⭐  15] ███░░░░░░░░░░░░  6% │
│  [2⭐   3] █░░░░░░░░░░░░░░  1% │
│  [1⭐   2] █░░░░░░░░░░░░░░  1% │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⭐⭐⭐⭐⭐ Maria Santos    │  │
│  │ Registered Nurse • Dubai │  │
│  │                          │  │
│  │ "Professional agency,    │  │
│  │ smooth deployment        │  │
│  │ process. Highly          │  │
│  │ recommend!"              │  │
│  │                          │  │
│  │ 🇦🇪 Deployed: Jan 2025   │  │
│  │ ✓ Verified OFW           │  │  ← Green badge
│  │                          │  │
│  │ [👍 Helpful 45]          │  │
│  └───────────────────────────┘  │
│                                 │
│  [Load More Reviews...]         │
│  [Write Your Review]            │  ← Auth prompt if guest
│                                 │
│  ┌───────────────────────────┐  │
│  │  🔎 SIMILAR JOBS (8)     │  │
│  │  ┌──────┬──────┬──────┐  │  │
│  │  │💼92% ││💼90% ││💼88% │  │  │  ← Carousel
│  │  │Nurse ││Nurse ││Nurse │  │  │
│  │  │Dubai ││Qatar ││Saudi │  │  │
│  │  └──────┴──────┴──────┘  │  │
│  │                          │  │
│  │  [View All Similar Jobs→]│  │
│  └───────────────────────────┘  │
│                                 │
│         [↑ Scroll to top]       │
│                                 │
└─────────────────────────────────┘
```

### Quick Apply Flow

```
QUICK APPLY MODAL - CONFIRMATION
┌─────────────────────────────────┐
│          ═══          [× Close] │
│                                 │
│  Apply for this job?            │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 💼 Registered Nurse      │  │  ← Job summary
│  │ Al-Salam Hospital, Dubai │  │
│  │ ₱75,000/month            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Your Profile: 85% ███░░░ │  │  ← Completion status
│  │                          │  │
│  │ ⚠️ Complete these for    │  │
│  │    better chances:       │  │
│  │                          │  │
│  │ • Add IELTS Certificate  │  │
│  │ • Add RN License Photo   │  │
│  │                          │  │
│  │ [Complete Now]           │  │
│  └───────────────────────────┘  │
│                                 │
│  Documents to Submit:           │
│  ✓ Resume/CV          [View]    │
│  ✓ Valid ID           [View]    │
│  ⚠️ Nursing License     [Add]    │
│  ⚠️ IELTS Certificate   [Add]    │
│                                 │
│  Cover Letter (Optional)        │
│  [+ Add Cover Letter]           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Expected Costs:          │  │
│  │ ₱8,500 - ₱15,000         │  │
│  │ No placement fee required│  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  [SUBMIT APPLICATION]    │  │
│  └───────────────────────────┘  │
│                                 │
│      [Maybe Later]              │
│                                 │
└─────────────────────────────────┘


SUCCESS MODAL (with Confetti 🎊)
┌─────────────────────────────────┐
│           ✨ ✨ ✨              │
│        ✨       ✨              │
│             ✓                   │  ← Animated checkmark
│                                 │
│   Application Submitted!        │
│                                 │
│  Your application has been      │
│  sent to Staffhouse             │
│  International                  │
│                                 │
│  What happens next:             │
│                                 │
│  1️⃣ Agency reviews (1-2 days)   │
│                                 │
│  2️⃣ You'll get notified here    │
│                                 │
│  3️⃣ Message them anytime        │
│                                 │
│  💡 Tip: Complete your profile  │
│     to increase chances by 50%! │
│                                 │
│  ┌───────────────────────────┐  │
│  │  [MESSAGE AGENCY NOW]    │  │
│  └───────────────────────────┘  │
│                                 │
│  [View My Applications]         │
│                                 │
│  [Browse More Jobs]             │
│        ✨       ✨              │
│           ✨ ✨ ✨              │
└─────────────────────────────────┘
Auto-dismiss after 5s
```

---

## 🤖 Phase 5: AI Assistant & Advanced Features (Days 13-15)

### GABAY AI Chatbot

```
GABAY AI ASSISTANT - LANDING
┌─────────────────────────────────┐
│  [← Back]  GABAY AI Assistant   │
│                                 │
│           🤖                     │
│                                 │
│   Kumusta! I'm GABAY,           │
│   your OFW guide.               │
│                                 │
│   🔓 Full Access                │  ← For authenticated
│   🔒 Limited (5 free queries)   │  ← For guests
│                                 │
│   How can I help you today?     │
│                                 │
│  QUICK ACTIONS                  │
│  ┌───────────────────────────┐  │
│  │ ✅ Check Requirements    │  │
│  │    for [Country]         │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🛡️ Verify Agency         │  │
│  │    Legitimacy            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📚 Learn About           │  │
│  │    Working in [Country]  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🎤 Interview Prep        │  │
│  │    Tips & Practice       │  │
│  └───────────────────────────┘  │
│                                 │
│  RECENT CONVERSATIONS           │
│  • How to apply for Saudi jobs  │
│  • POEA requirements            │
│  • Cost of working in Dubai     │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🎤  Ask me anything...   │  │  ← Voice + text
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘


GABAY AI - CHAT INTERFACE
┌─────────────────────────────────┐
│  [← Back]  GABAY AI             │
│  💬 5/5 queries left (guest)    │  ← Counter for guests
│                                 │
│  ┌──────────────────────────┐   │
│  │ How do I verify if an   │   │  ← User message
│  │ agency is legitimate?   │   │
│  └──────────────────────────┘   │
│  Just now                       │
│                                 │
│       ┌──────────────────────┐  │
│       │ 🤖 Great question!   │  │  ← AI message
│       │                      │  │
│       │ Here's how to verify:│  │
│       │                      │  │
│       │ ┌──────────────────┐ │  │
│       │ │ ✓ Check DMW     │ │  │  ← Interactive card
│       │ │ License Status   │ │  │
│       │ ├──────────────────┤ │  │
│       │ │ [Check Now]     │ │  │
│       │ └──────────────────┘ │  │
│       │                      │  │
│       │ • View Reviews       │  │
│       │   from OFWs          │  │
│       │                      │  │
│       │ • Verify Stats &     │  │
│       │   Response Time      │  │
│       │                      │  │
│       │ Would you like me to │  │
│       │ check a specific     │  │
│       │ agency?              │  │
│       └──────────────────────┘  │
│       Just now                  │
│                                 │
│       ┌──────────────────────┐  │
│       │ Quick Replies:       │  │  ← Quick actions
│       │ [Yes, check one]     │  │
│       │ [Tell me more]       │  │
│       │ [Show cost calc]     │  │
│       └──────────────────────┘  │
│                                 │
│  GUEST: 4 queries remaining     │  ← Reminder for guests
│  [Sign up for unlimited →]      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🎤  Type message...      │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Deployment Tracker

```
DEPLOYMENT TRACKER (Auth Required)
┌─────────────────────────────────┐
│  [← Back]  Deployment Tracker   │
│                                 │
│  💼 Registered Nurse            │
│  Al-Salam Hospital, Dubai       │
│                                 │
│  🎯 Target Departure:           │
│     June 15, 2025               │
│     (32 days to go)             │
│                                 │
│  ┌───────────────────────────┐  │
│  │ PROGRESS                 │  │
│  │                          │  │
│  │ 6 of 10 steps complete   │  │
│  │ ████████████░░░░░░░  60% │  │
│  └───────────────────────────┘  │
│                                 │
│  STEPS                          │
│                                 │
│  ✓ ─── Job Offer Accepted       │  ← Completed (green)
│  │     Completed May 1, 2025    │
│  │                              │
│  ✓ ─── Medical Examination      │
│  │     DOH Clinic • May 5       │
│  │     [View Results]           │
│  │                              │
│  ✓ ─── NBI Clearance            │
│  │     Valid until 2026         │
│  │     [Download]               │
│  │                              │
│  ✓ ─── Passport Verification    │
│  │     Valid until 2030         │
│  │                              │
│  ✓ ─── POEA Contract Signed     │
│  │     May 10, 2025             │
│  │     [View Contract]          │
│  │                              │
│  ✓ ─── OWWA Membership          │
│  │     ₱1,600 paid              │
│  │     [Receipt]                │
│  │                              │
│  📅 ─── PDOS Attendance          │  ← Scheduled (blue)
│  │     SCHEDULED                │
│  │     May 20, 2025 • 9:00 AM  │
│  │     OWWA Office, EDSA        │
│  │     [View Details][Reschedule]
│  │                              │
│  ⏳ ─── OEC Processing          │  ← Pending (gray)
│  │     PENDING                  │
│  │     Submit after PDOS        │
│  │                              │
│  ⏳ ─── Visa Processing         │  ← In Progress (amber)
│  │     IN PROGRESS              │
│  │     Agency handling          │
│  │                              │
│  ○ ─── Flight Booking           │  ← Not started
│      NOT STARTED                │
│                                 │
└─────────────────────────────────┘
```

### Agency Profile & Cost Calculator

```
ENHANCED AGENCY PROFILE (Public)
┌─────────────────────────────────┐
│  [← Back]          [⋮ Report]   │
│                                 │
│      ┌────────────┐              │
│      │   LOGO     │              │
│      └────────────┘              │
│                                 │
│  Staffhouse International       │
│                                 │
│  ⭐ 4.8 (234 reviews)           │
│  ✓ DMW Verified                 │  ← Large green badge
│                                 │
│  ⏱️ Avg Response: 2 hours       │
│  👥 1,500+ placements           │
│                                 │
│  ┌───────────────────────────┐  │
│  │   [MESSAGE AGENCY]       │  │  ← Auth prompt if guest
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  VERIFICATION            │  │
│  │                          │  │
│  │  ✓ DMW License: #12345-AB│  │
│  │    Valid until: Dec 2026 │  │
│  │    [Verify on DMW Site]  │  │
│  │                          │  │
│  │  ✓ ISO 9001:2015         │  │
│  │  ✓ POEA Top Performer    │  │
│  │  ✓ ILO Fair Recruitment  │  │
│  └───────────────────────────┘  │
│                                 │
│  STATISTICS                     │
│  🌍 Countries: 15               │
│  🏢 Industries: 12              │
│  👥 Deployments: 1,500+         │
│  📅 In Business: 26 years       │
│  ⏱️ Avg Process: 45 days        │
│  💬 Response Rate: 98%          │
│                                 │
│  CURRENT OPENINGS (23)          │
│  ┌────────┬────────┬────────┐   │
│  │💼     ││🏗️     ││💻     │   │  ← Carousel
│  │Nurse  ││Civil  ││  IT   │   │
│  └────────┴────────┴────────┘   │
│  [View All Jobs →]              │
│                                 │
└─────────────────────────────────┘


COST CALCULATOR MODAL (All Users)
┌─────────────────────────────────┐
│  Cost Calculator     [× Close]  │
│                                 │
│  Estimated Total Costs          │
│  ┌───────────────────────────┐  │
│  │  ₱8,500 - ₱15,000        │  │
│  └───────────────────────────┘  │
│                                 │
│  LEGAL REQUIRED FEES            │
│                                 │
│  Medical Examination            │
│  ₱2,500              [✓ Paid]   │
│  DOH-accredited clinic          │
│                                 │
│  NBI Clearance                  │
│  ₱150 - ₱300                    │
│  Valid for 1 year               │
│                                 │
│  Passport (if needed)           │
│  ₱950 - ₱1,200                  │
│  Valid for 10 years             │
│                                 │
│  OWWA Membership                │
│  ₱1,600                         │
│  Mandatory contribution         │
│                                 │
│  PhilHealth                     │
│  ₱500 - ₱1,000                  │
│  Varies by category             │
│                                 │
│  PDOS Seminar                   │
│  ₱300                           │
│  Pre-departure orientation      │
│                                 │
│  Visa Application               │
│  ₱5,000 - ₱8,000                │
│  Varies by country              │
│                                 │
│  OPTIONAL EXPENSES              │
│  Skills Certification           │
│  ₱2,000 - ₱5,000                │
│  TESDA, industry certs          │
│                                 │
│  ⚠️ ILLEGAL FEES                │
│  • Placement Fee (ILLEGAL)      │
│  • Training Fee >₱5,000         │
│  • Direct payments to agency    │
│                                 │
│  [Report Excessive Fees]        │
│                                 │
│  💡 Tip: Get receipts for all   │
│     payments!                   │
│                                 │
│  [Download PDF] [Share]         │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 Phase 6: Polish & Refinements (Days 16-18)

### Dark Mode & States

```
┌─────────────────────────────────────────────────────────────────┐
│                    DARK MODE EXAMPLE                            │
└─────────────────────────────────────────────────────────────────┘

LIGHT MODE                    DARK MODE
┌─────────────────────┐      ┌─────────────────────┐
│ ☀️ Theme Toggle     │      │ 🌙 Theme Toggle     │
│                     │      │                     │
│  Job-Agent [⚙️]     │      │  Job-Agent [⚙️]     │
│                     │      │                     │
│  🔍 Search...       │      │  🔍 Search...       │
│                     │      │                     │
│  💼 Featured Jobs   │      │  💼 Featured Jobs   │
│  ┌───────────────┐  │      │  ┌───────────────┐  │
│  │ Nurse         │  │      │  │ Nurse         │  │
│  │ Dubai, UAE    │  │      │  │ Dubai, UAE    │  │
│  │               │  │      │  │               │  │
│  │ [Apply]       │  │      │  │ [Apply]       │  │
│  └───────────────┘  │      │  └───────────────┘  │
│                     │      │                     │
└─────────────────────┘      └─────────────────────┘
 bg-white                     bg-gray-900
 text-gray-900                text-gray-100
 border-gray-200              border-gray-700


┌─────────────────────────────────────────────────────────────────┐
│                    LOADING STATES                               │
└─────────────────────────────────────────────────────────────────┘

SKELETON LOADING
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░       │  ← Shimmer animation
│                     │
│ ▓▓▓▓░░░░░░          │
│ ▓▓▓░░░░░░░          │
│                     │
│ [▓▓▓▓▓] [▓▓▓▓]      │
└─────────────────────┘


EMPTY STATE
┌─────────────────────┐
│                     │
│        📭           │  ← Friendly icon
│                     │
│  No applications    │
│      yet            │
│                     │
│  Start your OFW     │
│  journey! Browse    │
│  jobs now.          │
│                     │
│  [Browse Jobs]      │
│                     │
│  [View Tips]        │
│                     │
└─────────────────────┘


ERROR STATE
┌─────────────────────┐
│                     │
│        ⚠️           │
│                     │
│  Oops! Something    │
│  went wrong         │
│                     │
│  We couldn't load   │
│  the jobs. Check    │
│  your connection.   │
│                     │
│  Error: NET_001     │
│                     │
│  [Try Again]        │
│                     │
│  [Browse Saved]     │
│  [Contact Support]  │
│                     │
└─────────────────────┘
```

---

## 📊 Complete User Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLETE USER JOURNEY MAP                          │
└─────────────────────────────────────────────────────────────────┘

GUEST USER PATH:
    Splash
      ↓
    Home (Browse Mode)
      ↓
    Search/Filter Jobs ─────→ View Job Details
      ↓                            ↓
    Click Apply              Click Save/Message
      ↓                            ↓
    [AUTH PROMPT]           [AUTH PROMPT]
      ↓                            ↓
    Signup Modal                Signup Modal
      ↓                            ↓
    Account Type Selection
      ↓
    Profile Setup (5 steps) ← Can skip
      ↓
    Return to Job → Apply
      ↓
    Success + Track Application


AUTHENTICATED USER PATH:
    Splash
      ↓
    Home (Personalized)
      ↓
    Browse Jobs (with match %) ─→ Job Details
      ↓                              ↓
    Apply                         Apply
      ↓                              ↓
    Confirmation Modal
      ↓
    Success + Track
      ↓
    My Applications ──→ Deployment Tracker
      ↓
    Track Progress
      ↓
    Get Deployed! 🎉


TOUCHPOINTS:
1. Browse (All users) ✓
2. Search & Filter (All users) ✓
3. Job Details (All users) ✓
4. Auth Prompt (Guests only)
5. Apply (Auth users)
6. Track (Auth users)
7. AI Assistant (5 free for guests, unlimited for auth)
8. Cost Calculator (All users)
9. Agency Profiles (All users)
10. Deployment Tracker (Auth only)
```

---

## 🎯 Key Features Summary by Phase

```
PHASE 1: Theme (Days 1-2)
├─ Modern blue/purple theme maintained
├─ Gold accent added (#FCD116)
├─ Status colors refined
└─ Color constants file created

PHASE 2: UI Components (Days 3-5)
├─ ProgressBar
├─ StepIndicator
├─ Chip/Tag
├─ BottomSheet
├─ Timeline
├─ StatCard
├─ EmptyState
└─ ErrorState

PHASE 3: Onboarding (Days 6-8)
├─ Splash screen (auto-advance to home)
├─ Welcome carousel (optional, accessible via settings)
├─ Login/Signup (enhanced with social auth)
├─ Auth prompt modal (contextual, preserves state)
├─ Account type selection
└─ Profile setup wizard (5 steps, skippable)

PHASE 4: Job Features (Days 9-12)
├─ Home screen (guest vs auth variants)
├─ Job search with filters
├─ Job details (3-part scroll)
├─ Quick apply flow
├─ Success animation (confetti)
├─ My applications (enhanced)
└─ Swipe gestures (save/dismiss)

PHASE 5: Advanced (Days 13-15)
├─ GABAY AI chatbot (tiered access)
├─ Deployment tracker (timeline)
├─ Enhanced agency profiles
├─ Filter modal (bottom sheet)
└─ Cost calculator (public)

PHASE 6: Polish (Days 16-18)
├─ Dark mode implementation
├─ Skeleton loading states
├─ Swipe actions on cards
├─ Animation polish
├─ Empty/error states
└─ Notification center

PHASE 7: Testing (Days 19-20)
├─ Cross-browser testing
├─ Mobile device testing
├─ Performance optimization
├─ Accessibility audit
├─ User acceptance testing
└─ Final QA checklist
```

---

## 📱 Mobile-First Responsive Design

```
BREAKPOINTS:
375px (xs) - iPhone SE, small phones
640px (sm) - Large phones
768px (md) - Tablets
1024px (lg) - Laptops
1280px (xl) - Desktops
1536px (2xl) - Large desktops

MOBILE (375px):
┌──────────┐
│  Header  │
│          │
│ Content  │
│ (Scroll) │
│          │
│          │
│  Bottom  │
│   Nav    │
└──────────┘

TABLET (768px):
┌───────────────┐
│    Header     │
│               │
│    Content    │
│   (2 cols)    │
│               │
│               │
│  Bottom Nav   │
└───────────────┘

DESKTOP (1024px+):
┌─────────────────────────┐
│       Header            │
├──────┬──────────────────┤
│Side  │    Content       │
│ Bar  │   (3 cols)       │
│      │                  │
│      │                  │
└──────┴──────────────────┘
```

---

**End of Visual Mockups Flow Document**

*Related Documents:*
- VISUAL_MOCKUPS_IMPLEMENTATION_PLAN.md
- Complete Visual Screen Mockups.txt

*For Implementation Team:*
- Refer to this document for screen layouts
- Follow the authentication flow patterns
- Maintain consistency across all screens
- Test on multiple devices and screen sizes
