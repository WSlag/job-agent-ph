import { NotificationType } from '../types/notification';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generates email template based on notification type
 */
export function generateEmailTemplate(
  recipientName: string,
  title: string,
  message: string,
  type: NotificationType,
  actionUrl?: string
): EmailTemplate {
  const baseUrl = process.env.APP_URL || 'https://job-agent-ph.web.app';
  const fullActionUrl = actionUrl ? `${baseUrl}${actionUrl}` : baseUrl;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .notification-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .badge-message { background-color: #dbeafe; color: #1e40af; }
    .badge-application { background-color: #dcfce7; color: #166534; }
    .badge-interview { background-color: #fef3c7; color: #92400e; }
    .badge-system { background-color: #f3e8ff; color: #6b21a8; }
    .badge-job { background-color: #dbeafe; color: #1e40af; }
    .badge-document { background-color: #fed7aa; color: #9a3412; }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 15px;
    }
    .message {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 25px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🇵🇭 Job Agent PH</div>
    </div>

    <div class="notification-badge badge-${type.replace('_', '')}">
      ${getTypeName(type)}
    </div>

    <div class="title">${title}</div>

    <div class="message">
      Hi ${recipientName},<br><br>
      ${message}
    </div>

    ${actionUrl ? `
    <div style="text-align: center; margin: 25px 0;">
      <a href="${fullActionUrl}" class="button">
        View Details
      </a>
    </div>
    ` : ''}

    <div class="footer">
      <p>This is an automated notification from Job Agent PH.</p>
      <p>To manage your notification preferences, visit your account settings.</p>
      <p style="margin-top: 15px;">
        <a href="${baseUrl}" style="color: #2563eb; text-decoration: none;">Job Agent PH</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Job Agent PH - ${title}

Hi ${recipientName},

${message}

${actionUrl ? `View details: ${fullActionUrl}\n` : ''}

---
This is an automated notification from Job Agent PH.
To manage your notification preferences, visit your account settings.

Job Agent PH: ${baseUrl}
  `;

  return {
    subject: `Job Agent PH: ${title}`,
    html: html.trim(),
    text: text.trim(),
  };
}

function getTypeName(type: NotificationType): string {
  switch (type) {
    case 'message':
      return 'New Message';
    case 'application_update':
      return 'Application Update';
    case 'interview':
      return 'Interview';
    case 'job_match':
      return 'Job Match';
    case 'document':
      return 'Document';
    case 'system':
      return 'System';
    default:
      return 'Notification';
  }
}
