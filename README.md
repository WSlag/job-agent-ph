# Job Agent PH

A Progressive Web Application (PWA) connecting Filipino job hunters with recruitment agencies for overseas employment opportunities.

## Features

- **Job Hunting**: Browse and search for jobs in Middle East, Singapore, Hong Kong, Taiwan, Europe, and more
- **Direct Messaging**: Chat directly with recruitment agencies
- **Mobile-First PWA**: Install on your phone, works offline
- **User Types**:
  - Job Hunters: Create profile, browse jobs, message agencies
  - Recruitment Agencies: Post jobs, manage applications, communicate with candidates
- **Search & Filters**: Filter by country, job type, salary, and more
- **Real-time Updates**: Powered by Firebase Firestore

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Google Cloud Platform
- **PWA**: Service Workers, Web App Manifest

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd job-agent-ph
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Download service account key (Settings > Service Accounts)

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firestore Security Rules

Add these rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Job hunters can read/write their own profile
    match /jobHunters/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Agencies can read/write their own profile
    match /agencies/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Jobs are readable by all authenticated users
    // Only agencies can create/update/delete their own jobs
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                       request.resource.data.agencyId == request.auth.uid;
      allow update, delete: if request.auth != null &&
                               resource.data.agencyId == request.auth.uid;
    }

    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        (resource.data.jobHunterId == request.auth.uid ||
         resource.data.agencyId == request.auth.uid);

      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    // Applications
    match /applications/{applicationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

## Project Structure

```
job-agent-ph/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── jobs/              # Job browsing pages
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── jobs/             # Job-related components
│   └── auth/             # Auth components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase client config
│   ├── firebase-admin.ts # Firebase admin config
│   ├── collections.ts    # Firestore collection names
│   └── firestore-helpers.ts # Firestore helper functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── icons/           # App icons
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Google Cloud Platform

1. Install Google Cloud CLI
2. Create a new GCP project
3. Build the application:
```bash
npm run build
```

4. Deploy to Google Cloud Run or App Engine

## Features to Implement Next

- [ ] Direct messaging system
- [ ] Language toggle (English/Tagalog)
- [ ] Job posting form for agencies
- [ ] Profile management
- [ ] Push notifications
- [ ] Service worker for offline support
- [ ] Image upload for job postings
- [ ] Resume upload for job hunters

## Contributing

This is a private project. Contact the owner for contribution guidelines.

## License

Proprietary - All rights reserved

## Support

For support, email support@jobagentph.com (placeholder)

---

Made with ❤️ for Filipinos seeking opportunities abroad
