import Section from '@/components/ui/Section';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Last updated: October 23, 2025
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Job Agency PH ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our job platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Information You Provide</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Create an account (name, email, password, user type)</li>
              <li>Complete your profile (skills, experience, location, resume, company details)</li>
              <li>Post a job listing (job details, requirements, salary information)</li>
              <li>Submit a job application (cover letter, resume, contact information)</li>
              <li>Communicate with other users through our messaging system</li>
              <li>Contact our support team</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you access our platform, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Device information (browser type, operating system, IP address)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide and maintain our job platform services</li>
              <li>Create and manage your account</li>
              <li>Match job seekers with suitable job opportunities</li>
              <li>Facilitate communication between job seekers and employers</li>
              <li>Process job applications and manage recruitment workflows</li>
              <li>Send important notifications about your account and applications</li>
              <li>Improve our platform and develop new features</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 With Other Users</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you apply for a job, your application information (including resume and cover letter)
              is shared with the employer who posted the job. Employers can view basic profile information
              of applicants.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with third-party service providers who perform services on our behalf,
              such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Cloud hosting and storage providers (Firebase/Google Cloud)</li>
              <li>Email delivery services</li>
              <li>Analytics providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to valid requests by public
              authorities (e.g., court orders, subpoenas).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred
              to the acquiring entity.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your information,
              including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Firestore security rules to prevent unauthorized access</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct your information through your profile settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails (account-related emails cannot be opted out)</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              To exercise these rights, please contact us at privacy@jobagencyph.com.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized job recommendations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control cookies through your browser settings, but disabling cookies may limit
              certain features of our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you delete your account, we will delete or anonymize your personal information,
              except where retention is required by law.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform is not intended for users under the age of 18. We do not knowingly collect
              information from children. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than the Philippines,
              including the United States where our service providers (Google Cloud/Firebase) operate.
              These countries may have different data protection laws than your country.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              by posting the new policy on this page and updating the "Last updated" date. We encourage you
              to review this policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> privacy@jobagencyph.com</p>
              <p className="text-gray-700 mt-2"><strong>Address:</strong> 123 Business Avenue, Makati City, Metro Manila, Philippines 1200</p>
              <p className="text-gray-700 mt-2"><strong>Phone:</strong> +63 2 1234 5678</p>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
              <p className="text-gray-700 text-sm">
                We are committed to protecting your privacy and handling your data responsibly.
                If you have any questions or concerns, please don't hesitate to reach out to us.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
