import Section from '@/components/ui/Section';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Last updated: November 11, 2025
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
              To exercise these rights, please contact us at contact@jobagentph.com.
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
              <p className="text-gray-700"><strong>Email:</strong> contact@jobagentph.com</p>
            </div>

            {/* NEW SECTIONS 12-18 FOR DMW COMPLIANCE */}

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">12. DMW Compliance and Data Sharing</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Recruitment Agency Data Sharing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you apply for jobs through JobAgentPH.com, we share your application information with the specific DMW-licensed recruitment agency posting the job.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <p className="text-gray-800 font-semibold mb-2">What We Share:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Your name, contact information, and profile details</li>
                <li>Your resume and cover letter</li>
                <li>Your application responses</li>
                <li>Your work history and qualifications</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-700 font-semibold">Important:</p>
              <p className="text-gray-700 mt-2">
                Once we share your data with a recruitment agency, that agency becomes an independent data controller responsible for protecting your information per the Data Privacy Act of 2012. We are not responsible for how agencies use, store, or protect your data after it is shared.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Agency Obligations:</strong> All agencies on our Platform agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Protect your personal data</li>
              <li>Use data only for legitimate recruitment purposes</li>
              <li>Comply with the Data Privacy Act</li>
              <li>Not sell or misuse your information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">13. DMW Verification and Compliance</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">License Verification</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may verify recruitment agency credentials with the Department of Migrant Workers (DMW) to ensure platform safety. This may involve sharing agency business information (company name, license number) with DMW for verification purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Regulatory Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We cooperate with DMW and law enforcement investigations involving:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Illegal recruitment activities</li>
              <li>Worker protection violations</li>
              <li>Fraud or criminal activity</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose user information when legally required or to protect public safety.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">14. Platform Role and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Not a Recruitment Agency</h3>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
              <p className="text-gray-700 mb-2">
                JobAgentPH.com is a job marketplace platform, not a recruitment agency. We:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Do NOT make hiring decisions</li>
                <li>Do NOT control how agencies use your data after sharing</li>
                <li>Do NOT guarantee employment outcomes</li>
                <li>Are NOT responsible for agency data practices</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your Responsibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You should:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Research agencies before applying</li>
              <li>Understand how agencies will use your data</li>
              <li>Ask agencies about their privacy practices</li>
              <li>Report any data misuse to contact@jobagentph.com</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">15. Worker Protection Data</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Reporting System</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you report illegal recruitment, fee violations, or suspicious activity:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>We collect evidence you provide (screenshots, documents, etc.)</li>
              <li>We share reports with our compliance team and may share with DMW</li>
              <li>We protect your identity as the reporter (unless legally required to disclose)</li>
              <li>We retain reports for legal compliance and platform safety</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">16. Rights Under Philippine Data Privacy Act</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Erasure:</strong> Request deletion of your data (subject to legal retention requirements)</li>
              <li><strong>Object:</strong> Object to processing for specific purposes</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing (may limit platform use)</li>
            </ul>

            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <p className="text-gray-800 font-semibold mb-2">To exercise your rights, contact:</p>
              <p className="text-gray-700"><strong>Email:</strong> contact@jobagentph.com</p>
              <p className="text-gray-700 mt-1"><strong>Subject:</strong> Data Privacy Request</p>
              <p className="text-gray-700 mt-2 text-sm">We will respond within 15 business days.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">17. How We Protect Your Information</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Technical Measures</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure Firebase infrastructure</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Firewall protection</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Organizational Measures</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Employee training on data protection</li>
              <li>Access limited to authorized personnel only</li>
              <li>Non-disclosure agreements with staff</li>
              <li>Incident response procedures</li>
              <li>Regular policy reviews</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-Party Security</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>We use Firebase (Google Cloud) for data storage</li>
              <li>Firebase is GDPR-compliant and implements industry-standard security</li>
              <li>Third-party processors must meet our security standards</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">18. Data Retention</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How Long We Keep Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Active user accounts:</strong> Retained while account is active</li>
              <li><strong>Job applications:</strong> 2 years after application</li>
              <li><strong>Agency verification documents:</strong> Duration of agency account + 5 years</li>
              <li><strong>Audit logs and compliance records:</strong> 7 years (legal requirement)</li>
              <li><strong>Payment records:</strong> 10 years (tax/financial regulations)</li>
              <li><strong>Deleted accounts:</strong> Personal data erased within 90 days (except legal retention)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why We Retain Data</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
              <li>Legal and regulatory compliance (DMW, tax, labor laws)</li>
              <li>Dispute resolution and legal claims</li>
              <li>Platform security and fraud prevention</li>
              <li>Audit trails for accountability</li>
            </ul>

            <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Questions or Concerns?</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>General Support:</strong> <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">contact@jobagentph.com</a></p>
                <p className="mt-4 pt-4 border-t border-green-200"><strong>National Privacy Commission (Philippines):</strong></p>
                <p>Website: privacy.gov.ph</p>
                <p>Email: info@privacy.gov.ph</p>
                <p>Hotline: (02) 8234-2228</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
              <p className="text-gray-700 text-sm">
                We are committed to protecting your privacy and handling your data responsibly.
                If you have any questions or concerns, please don't hesitate to reach out to us.
              </p>
              <p className="text-gray-600 text-sm mt-4">
                <em>Effective Date: November 11, 2025</em>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                By using JobAgentPH.com, you acknowledge you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
