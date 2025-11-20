/**
 * Test contact form email with Reply-To functionality
 * Run with: node test-contact-email.js
 */

require('dotenv').config({ path: '.env.local' });
const { sendContactFormEmails } = require('./lib/email');

async function testContactEmail() {
  console.log('🧪 Testing Contact Form Email with Reply-To...\n');

  try {
    const result = await sendContactFormEmails({
      name: 'Test User',
      email: 'testuser@example.com',
      subject: 'Test Contact Form Submission',
      message: 'This is a test message to verify the Reply-To functionality. When you receive this admin notification, clicking Reply should automatically address the email to testuser@example.com',
      referenceNumber: 'CNT-20251120-TEST01',
    });

    console.log('\n✅ SUCCESS! Contact form emails sent!');
    console.log('\n📧 Check your inbox at: contact@jobagentph.com');
    console.log('\n🔍 What to verify:');
    console.log('1. You received the admin notification email');
    console.log('2. Click "Reply" in Gmail');
    console.log('3. The "To" field should automatically be: testuser@example.com');
    console.log('4. Your reply will be FROM: contact@jobagentph.com');
    console.log('5. Your reply will go TO: testuser@example.com\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testContactEmail();
