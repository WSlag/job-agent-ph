# Firebase Setup Guide for Job Agent PH

Follow these steps to set up Firebase for your Job Agent PH application.

## Step 1: Create a Firebase Project

1. **Open Firebase Console**
   - Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click **"Add project"** or **"Create a project"**
   - Enter project name: `job-agent-ph` (or your preferred name)
   - Click **"Continue"**

3. **Google Analytics** (Optional)
   - Choose whether to enable Google Analytics (recommended: Yes)
   - Select or create an Analytics account
   - Click **"Create project"**
   - Wait for the project to be created (30-60 seconds)

---

## Step 2: Set Up Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click **"Build"** > **"Authentication"**
   - Click **"Get started"**

2. **Enable Email/Password Authentication**
   - Click on **"Sign-in method"** tab
   - Click on **"Email/Password"**
   - Toggle **"Enable"** to ON
   - Click **"Save"**

3. **Optional: Configure Authorized Domains**
   - Go to **"Settings"** tab in Authentication
   - Under **"Authorized domains"**, add your production domain later
   - `localhost` is already authorized for development

---

## Step 3: Set Up Firestore Database

1. **Navigate to Firestore**
   - In the left sidebar, click **"Build"** > **"Firestore Database"**
   - Click **"Create database"**

2. **Choose Location**
   - Select **"Start in production mode"** (we'll add rules next)
   - Click **"Next"**

3. **Select Firestore Location**
   - Choose a location close to your target users
   - **Recommended for Philippines**: `asia-southeast1` (Singapore)
   - Click **"Enable"**
   - Wait for database creation (30-60 seconds)

4. **Set Up Security Rules**
   - Click on **"Rules"** tab
   - Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Job hunters profiles
    match /jobHunters/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Recruitment agencies profiles
    match /agencies/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Jobs - readable by all authenticated users
    match /jobs/{jobId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() &&
                       request.resource.data.agencyId == request.auth.uid;
      allow update, delete: if isAuthenticated() &&
                               resource.data.agencyId == request.auth.uid;
    }

    // Conversations - only participants can access
    match /conversations/{conversationId} {
      allow read: if isAuthenticated() &&
        (resource.data.jobHunterId == request.auth.uid ||
         resource.data.agencyId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
        (resource.data.jobHunterId == request.auth.uid ||
         resource.data.agencyId == request.auth.uid);

      // Messages subcollection
      match /messages/{messageId} {
        allow read, create: if isAuthenticated();
        allow update, delete: if isAuthenticated() &&
                                 resource.data.senderId == request.auth.uid;
      }
    }

    // Job applications
    match /applications/{applicationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() &&
                      request.resource.data.jobHunterId == request.auth.uid;
      allow update: if isAuthenticated() &&
        (resource.data.jobHunterId == request.auth.uid ||
         resource.data.agencyId == request.auth.uid);
    }

    // Saved jobs
    match /users/{userId}/savedJobs/{jobId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

   - Click **"Publish"**

5. **Create Indexes** (Optional - Firebase will suggest these as needed)
   - Go to **"Indexes"** tab
   - Firebase will automatically suggest indexes when you run queries that need them
   - You can add them manually or wait for Firebase to suggest them

---

## Step 4: Set Up Cloud Storage

1. **Navigate to Storage**
   - In the left sidebar, click **"Build"** > **"Storage"**
   - Click **"Get started"**

2. **Security Rules**
   - Select **"Start in production mode"**
   - Click **"Next"**

3. **Storage Location**
   - Use the same location as Firestore: `asia-southeast1`
   - Click **"Done"**

4. **Set Up Storage Rules**
   - Click on **"Rules"** tab
   - Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Job images uploaded by agencies
    match /jobs/{jobId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // User profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Resumes uploaded by job hunters
    match /resumes/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Message attachments
    match /messages/{conversationId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

   - Click **"Publish"**

---

## Step 5: Get Your Firebase Configuration

1. **Go to Project Settings**
   - Click the **gear icon** ⚙️ next to "Project Overview"
   - Click **"Project settings"**

2. **Get Web App Config**
   - Scroll down to **"Your apps"** section
   - If you don't see a web app, click **"Add app"** and select the **web icon** `</>`
   - Enter app nickname: `Job Agent PH Web`
   - **Don't check** "Also set up Firebase Hosting"
   - Click **"Register app"**

3. **Copy Configuration**
   - You'll see a code snippet with your Firebase config
   - Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "job-agent-ph.firebaseapp.com",
  projectId: "job-agent-ph",
  storageBucket: "job-agent-ph.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

4. **Create .env.local File**
   - In your project root, create `.env.local`
   - Add your configuration:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=job-agent-ph.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=job-agent-ph
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=job-agent-ph.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

---

## Step 6: Get Service Account Key (For Server-Side Operations)

1. **Go to Service Accounts**
   - Still in **"Project settings"**
   - Click on **"Service accounts"** tab

2. **Generate Private Key**
   - You'll see "Firebase Admin SDK" section
   - Click **"Generate new private key"**
   - Click **"Generate key"** in the confirmation dialog
   - A JSON file will download: `job-agent-ph-firebase-adminsdk-xxxxx.json`

3. **Add to .env.local**
   - Open the downloaded JSON file
   - Copy the entire content
   - Minify it (remove line breaks) using: [https://www.jsonformatter.io/json-minify](https://www.jsonformatter.io/json-minify)
   - Add to `.env.local`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"job-agent-ph",...}'
```

**⚠️ SECURITY WARNING**: Never commit this file to Git!

---

## Step 7: Verify Setup

Your complete `.env.local` should look like this:

```env
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=job-agent-ph.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=job-agent-ph
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=job-agent-ph.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin Configuration (Server-side - KEEP SECRET!)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"job-agent-ph","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 8: Test Your Setup

1. **Install Dependencies**
```bash
cd job-agent-ph
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Try signing up as a Job Hunter or Agency
   - If you can create an account, Firebase is working! 🎉

---

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Double-check your `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`

### Issue: "Missing or insufficient permissions"
**Solution**: Verify your Firestore security rules are published

### Issue: "Firebase: Error (auth/network-request-failed)"
**Solution**: Check your internet connection and Firebase project status

### Issue: Environment variables not loading
**Solution**:
- Make sure file is named exactly `.env.local` (not `.env.local.txt`)
- Restart your development server after creating/editing `.env.local`
- Verify the file is in the project root (same folder as `package.json`)

---

## Next Steps

After Firebase is set up:

1. ✅ Create test accounts (Job Hunter and Agency)
2. ✅ Test authentication flow
3. ✅ Install dependencies and run the app
4. 📝 Add sample job data to Firestore
5. 💬 Implement messaging system
6. 🌐 Add language toggle (English/Tagalog)
7. 📱 Configure PWA features

---

## Useful Firebase Console Links

- **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Firestore Data Viewer**: Project > Firestore Database > Data
- **Authentication Users**: Project > Authentication > Users
- **Storage Browser**: Project > Storage > Files
- **Usage & Billing**: Project > Usage and billing

---

Need help? Check the README.md or create an issue.
