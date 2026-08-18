<p align="center">
  <img src="banner.png" width="100%" alt="JobAgent PH — Find work. Hire talent.">
</p>

<div align="center">

# 💼 JobAgent PH

**A job marketplace connecting Filipino professionals with opportunities — at home and abroad.**

Designed to digitize recruitment workflows and simplify how applications happen.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-ready-5A67D8?style=flat-square&logo=pwa&logoColor=white)

</div>

---

## 🎯 What It Does

Job hunting in the Philippines is still driven by Messenger threads, agency
bulletin boards, and disconnected follow-ups. JobAgent PH centralizes the whole
loop — post, discover, apply, message, track — in one platform.

### 👨‍💼 For Job Seekers

- 🔍 Browse and search jobs (local & overseas)
- 📄 Apply with a resume
- 📬 Track application status in real time
- 💬 Message employers directly

### 🏢 For Agencies

- 📣 Post and manage job listings
- 🗂 Review and filter applications
- 👥 Communicate with candidates
- ✅ Track hiring through the pipeline

---

## ⭐ Feature Highlights

- **Overseas-ready workflow** — built with DMW compliance UX in mind
- **Real-time application tracking** via Firestore
- **Role-based access control** for seekers, agencies, and admins
- **PWA** — installable and usable on mobile
- **Email notifications** via Resend
- **Interactive job maps** with Leaflet
- **Rich content** — MDX-driven blog & resources
- **Multi-language support** with `next-intl`

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 15 · React 19 · TypeScript |
| **Styling** | Tailwind CSS · framer-motion |
| **Backend** | Firebase — Auth · Firestore · Storage · Functions |
| **Email** | Resend · Nodemailer |
| **Data** | Papaparse · Zod · React Hook Form |
| **Maps** | Leaflet · react-leaflet |
| **PWA** | @ducanh2912/next-pwa |
| **Content** | MDX · gray-matter · next-intl |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase
cp .env.example .env   # Firebase web config + service keys

# 3. Run the dev server
npm run dev            # http://localhost:3000
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the build |
| `npm run lint` | Lint |
| `npm run deploy` | Export + Firebase Hosting deploy |

---

## 📁 Repository Layout

```
job-agent-ph/
├── app/          # Next.js App Router pages & layouts
├── components/   # Shared UI components
├── contexts/     # React contexts (auth, i18n, theme)
├── hooks/ · lib/ · types/ · content/
├── functions/    # Firebase Cloud Functions
├── docs/         # Setup & feature documentation
├── scripts/      # Tooling (icons, tests, reports)
├── public/       # Static & PWA assets
└── firebase.json
```

---

## 📚 Documentation

Deep-dive guides live in `docs/` — Firebase setup, domain configuration,
notifications, PWA installation, security checklists, and deployment runbooks
(e.g. [`QUICK_START.md`](QUICK_START.md), [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md),
[`SECURITY_CHECKLIST.md`](SECURITY_CHECKLIST.md)).

---

## 🗺 Status

🟢 Production platform — under active development with continuous feature
rollouts (messaging, notifications, subscriptions, PWA).

---

<p align="center">
  Built for Filipino job seekers & agencies 🇵🇭
</p>
