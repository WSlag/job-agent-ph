# Cloud Functions for Job Agent PH

Firebase Cloud Functions that handle automated notifications for the Job Agent PH platform.

## Functions

### Application Notifications

**`onApplicationCreated`**
- Triggered when a job hunter applies for a job
- Notifies the agency about the new application
- Sends in-app + email notification

**`onApplicationStatusChanged`**
- Triggered when an agency updates application status
- Notifies the job hunter about status changes (accepted, rejected, interview, etc.)
- Sends in-app + email notification

### Message Notifications

**`onMessageSent`**
- Triggered when a message is sent in a conversation
- Notifies the recipient about the new message
- Sends in-app + email notification

### Admin Notifications

**`onFeaturedRequestCreated`**
- Triggered when an agency requests featured placement
- Notifies all admins about the new request
- Sends in-app + email notification

**`onUserCreated`**
- Triggered when a new user registers (via Firebase Auth)
- Notifies all admins about new registrations
- Sends in-app notification only

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Job Agent PH <notifications@jobagent.ph>
APP_URL=https://job-agent-ph.web.app
```

### Build

```bash
npm run build
```

### Deploy

```bash
# From project root
firebase deploy --only functions

# OR deploy specific function
firebase deploy --only functions:onApplicationCreated
```

## Development

### Local Testing

```bash
# Start Firebase emulators
npm run serve
```

### Watch Mode

```bash
npm run build:watch
```

### View Logs

```bash
# All functions
firebase functions:log

# Specific function
firebase functions:log --only onApplicationCreated
```

## Structure

```
functions/
├── src/
│   ├── index.ts                          # Entry point - exports all functions
│   ├── types/
│   │   └── notification.ts               # TypeScript interfaces
│   ├── notifications/
│   │   ├── helpers.ts                    # Shared helper functions
│   │   ├── application-notifications.ts  # Application-related notifications
│   │   ├── message-notifications.ts      # Message notifications
│   │   └── admin-notifications.ts        # Admin notifications
│   └── email/
│       ├── send-email.ts                 # Email sender using Resend
│       └── templates.ts                  # HTML email templates
├── lib/                                   # Compiled JavaScript (gitignored)
├── package.json
├── tsconfig.json
└── .env                                   # Environment variables (gitignored)
```

## Email Service

Uses [Resend](https://resend.com) for email delivery.

**Setup:**
1. Sign up at https://resend.com
2. Verify your sending domain
3. Get API key from https://resend.com/api-keys
4. Add to `.env` or Firebase config

## Security

- Firestore rules prevent client-side notification creation
- Only Cloud Functions can write to `notifications` collection
- Users can only read/update/delete their own notifications
- Email preferences are respected before sending

## Cost

**Firebase Functions:**
- Free tier: 2M invocations/month
- Estimated usage: ~3,000-10,000/month (well within free tier)

**Resend:**
- Free tier: 100 emails/day (3,000/month)
- Pro plan: $20/month for 50,000 emails

## Troubleshooting

**Notifications not appearing?**
1. Check logs: `firebase functions:log`
2. Verify Firestore rules deployed
3. Ensure indexes created

**Emails not sending?**
1. Check RESEND_API_KEY is set
2. Verify domain in Resend dashboard
3. Check Resend logs at https://resend.com/emails

**Function errors?**
1. Check Firebase Console → Functions
2. View error details in logs
3. Verify environment variables

## Documentation

See [NOTIFICATION_SYSTEM_GUIDE.md](../NOTIFICATION_SYSTEM_GUIDE.md) for complete deployment and testing guide.
