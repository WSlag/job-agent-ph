/**
 * Test contact form API with Reply-To functionality
 * Run with: node test-contact-api.js
 * Make sure the dev server is running on port 3001
 */

require('dotenv').config({ path: '.env.local' });

async function testContactAPI() {
  console.log('🧪 Testing Contact Form API with Reply-To...\n');

  try {
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        subject: 'Test Reply-To Functionality',
        message: 'This is a test message to verify the Reply-To functionality. When you receive this admin notification at contact@jobagentph.com, clicking Reply should automatically address the email to testuser@example.com',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Contact form submitted successfully!\n');
      console.log('📋 Response:', JSON.stringify(data, null, 2));
      console.log('\n📧 Check your inbox at: contact@jobagentph.com');
      console.log('\n🔍 What to verify:');
      console.log('1. You received the admin notification email');
      console.log('2. Click "Reply" in Gmail');
      console.log('3. The "To" field should automatically be: testuser@example.com');
      console.log('4. Your reply will be FROM: contact@jobagentph.com');
      console.log('5. Your reply will go TO: testuser@example.com\n');
    } else {
      console.error('❌ Error:', data);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nMake sure the dev server is running on port 3001:');
    console.error('npm run dev\n');
  }
}

testContactAPI();
