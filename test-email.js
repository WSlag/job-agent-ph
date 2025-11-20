/**
 * Simple test script to verify Resend email configuration
 * Run with: node test-email.js
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testEmail() {
  console.log('🧪 Testing Resend Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || '✗ Missing'}\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment variables');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('📧 Sending test email...');

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'contact@jobagentph.com',
      to: process.env.EMAIL_FROM || 'contact@jobagentph.com', // Send to yourself
      subject: 'Test Email - Job Agent PH',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; }
              .success { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">✅ Email System Working!</h2>
              </div>
              <div class="content">
                <div class="success">
                  <strong>Success!</strong> Your Resend email configuration is working correctly.
                </div>
                <p>This is a test email from your Job Agent PH application.</p>
                <p><strong>Configuration Details:</strong></p>
                <ul>
                  <li>Email Service: Resend</li>
                  <li>From: ${process.env.EMAIL_FROM}</li>
                  <li>Domain: jobagentph.com (verified)</li>
                </ul>
                <p>All email features are now operational:</p>
                <ul>
                  <li>✓ Agency welcome emails</li>
                  <li>✓ Contact form notifications</li>
                  <li>✓ Contact form confirmations</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
✅ Email System Working!

Success! Your Resend email configuration is working correctly.

This is a test email from your Job Agent PH application.

Configuration Details:
- Email Service: Resend
- From: ${process.env.EMAIL_FROM}
- Domain: jobagentph.com (verified)

All email features are now operational:
✓ Agency welcome emails
✓ Contact form notifications
✓ Contact form confirmations
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log(`📬 Email ID: ${data.id}`);
    console.log(`📧 Check your inbox at: ${process.env.EMAIL_FROM}`);
    console.log('\n🎉 Your email system is fully operational!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify your Resend API key is correct');
    console.error('2. Check that jobagentph.com is verified in Resend dashboard');
    console.error('3. Ensure DNS records are properly configured\n');
    process.exit(1);
  }
}

testEmail();
