import { Resend } from 'resend';

// Email configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (should be verified in Resend)
const DEFAULT_FROM = process.env.EMAIL_FROM || 'contact@jobagentph.com';

// Email templates
export const emailTemplates = {
  // Admin notification when someone submits contact form
  adminNotification: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    referenceNumber: string;
    timestamp: string;
  }) => ({
    from: DEFAULT_FROM,
    to: DEFAULT_FROM, // Sends to contact@jobagentph.com, which routes to your Gmail
    replyTo: data.email, // Reply directly to the user
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4b5563; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .reference { display: inline-block; background: #dbeafe; color: #1e40af; padding: 5px 10px; border-radius: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Reference: <span class="reference">${data.referenceNumber}</span></p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${data.message}</div>
              </div>
              <div class="field">
                <div class="label">Submitted:</div>
                <div class="value">${data.timestamp}</div>
              </div>
            </div>
            <div class="footer">
              <p><strong>💡 Quick Reply:</strong> Just click "Reply" to respond directly to ${data.name}</p>
              <p>View all contact submissions in your <a href="https://www.jobagentph.com/agency/dashboard/contacts">admin dashboard</a></p>
              <p>Job Agent PH - Contact Form System</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission

Reference Number: ${data.referenceNumber}

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Submitted: ${data.timestamp}

---
💡 Quick Reply: Just click "Reply" to respond directly to ${data.name}

View all contact submissions in your admin dashboard:
https://www.jobagentph.com/agency/dashboard/contacts
    `,
  }),

  // User confirmation email
  userConfirmation: (data: {
    name: string;
    email: string;
    referenceNumber: string;
  }) => ({
    from: DEFAULT_FROM,
    to: data.email,
    subject: 'We received your message - Job Agent PH',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .icon { font-size: 48px; margin-bottom: 10px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .reference { display: inline-block; background: #dbeafe; color: #1e40af; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 14px; margin: 15px 0; }
            .info-box { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">✓</div>
              <h2 style="margin: 0;">Message Received!</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for contacting Job Agent PH</p>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>We've successfully received your message and appreciate you reaching out to us!</p>

              <div class="info-box">
                <strong>What happens next?</strong><br>
                Our team typically responds within <strong>24 hours</strong>. We'll review your inquiry and get back to you at <strong>${data.email}</strong>.
              </div>

              <p>Your reference number:</p>
              <div style="text-align: center;">
                <span class="reference">${data.referenceNumber}</span>
              </div>
              <p style="font-size: 12px; color: #6b7280; text-align: center;">Keep this for your records</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://www.jobagentph.com/jobs" class="button">Browse Available Jobs</a>
              </div>

              <p style="margin-top: 30px;">If you have any urgent concerns, please don't hesitate to reach out to us directly at <a href="mailto:contact@jobagentph.com">contact@jobagentph.com</a>.</p>

              <p>Best regards,<br>
              <strong>Job Agent PH Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>Job Agent PH</strong> - Find Your Dream Job</p>
              <p>
                <a href="https://www.jobagentph.com" style="color: #2563eb; text-decoration: none;">Website</a> |
                <a href="https://www.jobagentph.com/jobs" style="color: #2563eb; text-decoration: none;">Browse Jobs</a> |
                <a href="https://www.jobagentph.com/contact" style="color: #2563eb; text-decoration: none;">Contact Us</a>
              </p>
              <p style="margin-top: 15px; color: #9ca3af;">
                You're receiving this email because you submitted a contact form at jobagentph.com
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.name},

We've successfully received your message and appreciate you reaching out to Job Agent PH!

WHAT HAPPENS NEXT?
Our team typically responds within 24 hours. We'll review your inquiry and get back to you at ${data.email}.

Your reference number: ${data.referenceNumber}
(Keep this for your records)

If you have any urgent concerns, please don't hesitate to reach out to us directly at contact@jobagentph.com.

Best regards,
Job Agent PH Team

---
Job Agent PH - Find Your Dream Job
Website: https://www.jobagentph.com
Browse Jobs: https://www.jobagentph.com/jobs

You're receiving this email because you submitted a contact form at jobagentph.com
    `,
  }),

  // Agency welcome email
  agencyWelcome: (data: {
    companyName: string;
    email: string;
    contactPerson: string;
  }) => ({
    from: DEFAULT_FROM,
    to: data.email,
    subject: 'Welcome to Job Agent PH - Start Hiring Today!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .icon { font-size: 48px; margin-bottom: 10px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .checklist { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .checklist li { margin: 8px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .strength { background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px 15px; margin: 10px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🎉</div>
              <h2 style="margin: 0;">Welcome to Job Agent PH!</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Philippines' Fastest-Growing Job Placement Platform</p>
            </div>
            <div class="content">
              <p>Hi ${data.contactPerson},</p>
              <p>Thank you for joining <strong>${data.companyName}</strong> to Job Agent PH!</p>

              <h3 style="color: #1e40af; margin-top: 25px;">Why Agencies Choose Us:</h3>
              <div class="strength">✓ Direct access to <strong>thousands of qualified job seekers</strong></div>
              <div class="strength">✓ Verified candidates actively searching for opportunities</div>
              <div class="strength">✓ Your jobs promoted across our <strong>social media channels</strong> (Facebook, Instagram, TikTok)</div>
              <div class="strength">✓ Reach applicants you won't find anywhere else</div>

              <div class="checklist">
                <h4 style="margin-top: 0; color: #1e40af;">Next Steps:</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Complete your agency profile</strong> with certifications (DMW License & Business Permit)</li>
                  <li><strong>Post your first job listing</strong></li>
                  <li><strong>Watch applications flow in</strong> from our social media audience</li>
                </ol>
              </div>

              <p>Our team actively shares job postings to <strong>maximize your reach</strong> and connect you with the best talent in the market.</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://www.jobagentph.com/agency/profile/edit?reason=certifications" class="button">Complete Your Profile</a>
              </div>

              <p style="margin-top: 30px;"><strong>Let's find your next hire together! 💼</strong></p>

              <p>Best regards,<br>
              <strong>The Job Agent PH Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>Job Agent PH</strong> - Connecting Talent with Opportunity</p>
              <p>
                <a href="https://www.jobagentph.com/agency/dashboard" style="color: #2563eb; text-decoration: none;">Dashboard</a> |
                <a href="https://www.jobagentph.com/jobs/post" style="color: #2563eb; text-decoration: none;">Post a Job</a> |
                <a href="https://www.jobagentph.com/contact" style="color: #2563eb; text-decoration: none;">Contact Us</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Job Agent PH! 🎉

Hi ${data.contactPerson},

Thank you for joining ${data.companyName} to Job Agent PH - the Philippines' fastest-growing job placement platform!

WHY AGENCIES CHOOSE US:
✓ Direct access to thousands of qualified job seekers
✓ Verified candidates actively searching for opportunities
✓ Your jobs promoted across our social media channels (Facebook, Instagram, TikTok)
✓ Reach applicants you won't find anywhere else

NEXT STEPS:
1. Complete your agency profile with certifications (DMW License & Business Permit)
2. Post your first job listing
3. Watch applications flow in from our social media audience

Our team actively shares job postings to maximize your reach and connect you with the best talent in the market.

Let's find your next hire together! 💼

Best regards,
The Job Agent PH Team

---
Complete Your Profile: https://www.jobagentph.com/agency/profile/edit?reason=certifications
Dashboard: https://www.jobagentph.com/agency/dashboard
Post a Job: https://www.jobagentph.com/jobs/post
    `,
  }),

  // Job hunter welcome email
  jobHunterWelcome: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => ({
    from: DEFAULT_FROM,
    to: data.email,
    subject: 'Welcome to Job Agent PH - Find Your Dream Job!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .icon { font-size: 48px; margin-bottom: 10px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .checklist { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .checklist li { margin: 8px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .feature { background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px 15px; margin: 10px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🎉</div>
              <h2 style="margin: 0;">Welcome to Job Agent PH!</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Journey to Your Dream Job Starts Here</p>
            </div>
            <div class="content">
              <p>Hi ${data.firstName},</p>
              <p>Welcome to <strong>Job Agent PH</strong> - the Philippines' fastest-growing job placement platform!</p>
              <p>You've just joined thousands of Filipinos who are finding their dream jobs through our platform.</p>

              <h3 style="color: #1e40af; margin-top: 25px;">What You Can Do:</h3>
              <div class="feature">✓ Browse <strong>thousands of verified job opportunities</strong></div>
              <div class="feature">✓ Apply with one click - no need to upload resume multiple times</div>
              <div class="feature">✓ Get matched with top recruitment agencies</div>
              <div class="feature">✓ Track all your applications in one place</div>

              <div class="checklist">
                <h4 style="margin-top: 0; color: #1e40af;">Get Started:</h4>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Complete your profile</strong> to stand out to employers</li>
                  <li><strong>Upload your resume</strong> for quick applications</li>
                  <li><strong>Browse featured jobs</strong> and start applying</li>
                  <li><strong>Save jobs</strong> you're interested in for later</li>
                </ol>
              </div>

              <p>Our platform connects you directly with verified recruitment agencies who are actively looking for talented professionals like you.</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://www.jobagentph.com/profile/edit" class="button">Complete Your Profile</a>
              </div>

              <p style="margin-top: 30px;"><strong>Your next career move starts here! 💼</strong></p>

              <p>Best regards,<br>
              <strong>The Job Agent PH Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>Job Agent PH</strong> - Find Your Dream Job</p>
              <p>
                <a href="https://www.jobagentph.com/jobs" style="color: #2563eb; text-decoration: none;">Browse Jobs</a> |
                <a href="https://www.jobagentph.com/profile" style="color: #2563eb; text-decoration: none;">My Profile</a> |
                <a href="https://www.jobagentph.com/contact" style="color: #2563eb; text-decoration: none;">Contact Us</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Job Agent PH! 🎉

Hi ${data.firstName},

Welcome to Job Agent PH - the Philippines' fastest-growing job placement platform!

You've just joined thousands of Filipinos who are finding their dream jobs through our platform.

WHAT YOU CAN DO:
✓ Browse thousands of verified job opportunities
✓ Apply with one click - no need to upload resume multiple times
✓ Get matched with top recruitment agencies
✓ Track all your applications in one place

GET STARTED:
1. Complete your profile to stand out to employers
2. Upload your resume for quick applications
3. Browse featured jobs and start applying
4. Save jobs you're interested in for later

Our platform connects you directly with verified recruitment agencies who are actively looking for talented professionals like you.

Your next career move starts here! 💼

Best regards,
The Job Agent PH Team

---
Complete Your Profile: https://www.jobagentph.com/profile/edit
Browse Jobs: https://www.jobagentph.com/jobs
My Profile: https://www.jobagentph.com/profile
    `,
  }),
};

// Send email function
export async function sendEmail(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Send contact form emails (both admin notification and user confirmation)
export async function sendContactFormEmails(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  referenceNumber: string;
}) {
  const timestamp = new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  try {
    // Send admin notification
    const adminEmail = emailTemplates.adminNotification({
      ...data,
      timestamp,
    });
    await sendEmail(adminEmail);

    // Send user confirmation
    const userEmail = emailTemplates.userConfirmation({
      name: data.name,
      email: data.email,
      referenceNumber: data.referenceNumber,
    });
    await sendEmail(userEmail);

    return { success: true };
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    throw error;
  }
}
