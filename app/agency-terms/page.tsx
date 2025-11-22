'use client';

import React from 'react';

export default function AgencyTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="bg-indigo-600 text-white px-6 py-8 rounded-t-lg">
          <h1 className="text-3xl font-bold">Agency Terms of Service</h1>
          <p className="text-indigo-100 mt-2">JobAgentPH.com</p>
          <p className="text-sm text-indigo-200 mt-4">Last Updated: November 11, 2025</p>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <p className="text-gray-800 font-semibold">
            By registering as a recruitment agency on JobAgentPH.com, you agree to these Agency-Specific Terms in addition to our general <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 prose prose-indigo max-w-none">

          {/* Section 1 */}
          <section id="licensing" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Licensing Requirements</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 DMW License Mandatory</h3>
            <p className="text-gray-700 mb-2">You represent and warrant that:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>You hold a current, valid Department of Migrant Workers (DMW) license for overseas employment recruitment</li>
              <li>Your DMW license is not expired, suspended, or under investigation</li>
              <li>You have authority to engage in overseas recruitment under Philippine law</li>
              <li>You will maintain your DMW license throughout your use of the Platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Required Documentation</h3>
            <p className="text-gray-700 mb-2">You must provide:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Valid DMW license number</li>
              <li>Copy of DMW license certificate</li>
              <li>Business permit</li>
              <li>SEC registration documents</li>
              <li>Company logo and contact information</li>
              <li>Proof of escrow account (if required by DMW)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Ongoing Obligations</h3>
            <p className="text-gray-700 mb-2">You agree to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Update your DMW license number immediately upon renewal</li>
              <li>Upload new license documentation before expiration</li>
              <li>Notify JobAgentPH.com within 48 hours of any license suspension, revocation, or regulatory action</li>
              <li>Maintain valid business permits and registrations</li>
              <li>Update expiration dates promptly</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="font-semibold text-gray-800">
                Failure to maintain valid licensing will result in immediate suspension of your account and removal of all job postings.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="compliance" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Compliance with Philippine Law</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Legal Compliance</h3>
            <p className="text-gray-700 mb-2">You agree to comply with:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Republic Act 8042 (Migrant Workers and Overseas Filipinos Act)</li>
              <li>Republic Act 10022 (amendments to RA 8042)</li>
              <li>Republic Act 11641 (Department of Migrant Workers Act)</li>
              <li>All DMW rules, regulations, circulars, and department orders</li>
              <li>Labor Code of the Philippines</li>
              <li>Data Privacy Act of 2012</li>
              <li>Anti-Trafficking in Persons Act</li>
              <li>All applicable destination country laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Ethical Recruitment</h3>
            <p className="text-gray-700 mb-2">You commit to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Ethical recruitment practices as defined by DMW</li>
              <li>Transparency in all dealings with workers</li>
              <li>Protection of worker dignity and human rights</li>
              <li>Fair and lawful hiring processes</li>
              <li>Honest representation of job opportunities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Prohibited Practices</h3>
            <p className="text-gray-700 mb-2">You will NOT:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Engage in illegal recruitment activities</li>
              <li>Charge unauthorized placement fees</li>
              <li>Deploy workers without approved job orders</li>
              <li>Substitute or alter employment contracts without consent</li>
              <li>Make false promises or misrepresentations</li>
              <li>Deploy minors (under 18)</li>
              <li>Engage in human trafficking or forced labor</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Violate worker rights</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="job-posting" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Job Posting Requirements</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Approved Job Orders</h3>
            <p className="text-gray-700 mb-2">All overseas job postings must:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Have a valid DMW-approved job order</li>
              <li>Include the job order number</li>
              <li>Be within the job order validity period (2 years)</li>
              <li>Accurately reflect the approved position details</li>
              <li>Include employer/principal accreditation information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Required Information</h3>
            <p className="text-gray-700 mb-2">Each job posting must include:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Your DMW license number</li>
              <li>Employer/principal name and address</li>
              <li>Employer POEA/DMW accreditation number</li>
              <li>Specific worksite location (country and city)</li>
              <li>Accurate job title and description</li>
              <li>Actual salary range and currency</li>
              <li>Contract duration</li>
              <li>Working hours and rest days</li>
              <li>Benefits (insurance, housing, meals, etc.)</li>
              <li>Required qualifications</li>
              <li>Application process</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Prohibited Job Postings</h3>
            <p className="text-gray-700 mb-2">You may NOT post:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Jobs without approved job orders</li>
              <li>Positions for unlicensed or unaccredited employers</li>
              <li>Fraudulent or non-existent opportunities</li>
              <li>Jobs in countries banned by DMW</li>
              <li>Positions below minimum wage standards</li>
              <li>Jobs requiring illegal fees from workers</li>
              <li>Misleading or deceptive listings</li>
              <li>Positions for minors or illegal work</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Accuracy Requirement</h3>
            <p className="text-gray-700 mb-2">You represent that:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>All job posting information is true and accurate</li>
              <li>You have verified employer credentials</li>
              <li>Salary and benefits are guaranteed (not estimates)</li>
              <li>You have authority to recruit for the position</li>
              <li>The job opportunity actually exists</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="fees" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Fee Regulations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 No Placement Fee Policy</h3>
            <p className="text-gray-700 mb-3">You understand and agree to comply with DMW's "no placement fee" policy:</p>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="font-semibold text-gray-800 mb-2">Zero-Fee Countries (NO fees allowed):</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Canada (all provinces)</li>
                <li>United States (including Guam)</li>
                <li>United Kingdom</li>
                <li>Austria</li>
                <li>Netherlands</li>
                <li>Ireland (Republic and Northern)</li>
                <li>Qatar</li>
                <li>UAE (United Arab Emirates)</li>
                <li>[Other countries as designated by DMW]</li>
              </ul>
              <p className="text-gray-700 mt-3 font-semibold">
                For these countries, you CANNOT charge workers any placement fees.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Limited Fee Countries</h3>
            <p className="text-gray-700 mb-2">For countries where fees are permitted:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Maximum fee: One (1) month basic salary</li>
              <li>Fee must be stated in employment contract</li>
              <li>Deductible from salary in installments only</li>
              <li>Must comply with destination country laws</li>
              <li>DMW approval may be required</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Prohibited Fee Practices</h3>
            <p className="text-gray-700 mb-2">You will NOT:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Charge fees in zero-fee countries</li>
              <li>Exceed the one-month salary cap</li>
              <li>Collect fees before deployment (except as authorized)</li>
              <li>Request fees via unofficial channels or electronic transfers</li>
              <li>Charge fees for jobs that don't materialize</li>
              <li>Pass employer costs to workers</li>
              <li>Double-charge (collect from both worker and employer where prohibited)</li>
              <li>Charge fees for DMW clearance, medical exams, or documentation (beyond authorized costs)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Platform Advertising Fees</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>JobAgentPH.com may charge agencies for premium job placement (featured carousel)</li>
              <li>This is an advertising fee for platform services, not a recruitment fee</li>
              <li>Platform fees are separate from worker placement fees</li>
              <li>Payment of platform fees does not authorize you to charge illegal worker fees</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="responsibility" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sole Responsibility for Recruitment</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Agency Responsibility</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-gray-700 mb-2">You acknowledge and agree that:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li><strong>YOU ARE SOLELY RESPONSIBLE</strong> for all recruitment and placement activities</li>
                <li>JobAgentPH.com is NOT your agent, partner, or co-recruiter</li>
                <li>JobAgentPH.com does NOT recruit, hire, or place workers on your behalf</li>
                <li>JobAgentPH.com is a job marketplace platform only</li>
                <li>You conduct all aspects of recruitment independently</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Worker Relations</h3>
            <p className="text-gray-700 mb-2">You are responsible for:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Screening and interviewing applicants</li>
              <li>Making hiring decisions</li>
              <li>Preparing employment contracts</li>
              <li>Obtaining DMW clearances and certifications</li>
              <li>Pre-departure orientations</li>
              <li>Deployment logistics</li>
              <li>Worker welfare and support</li>
              <li>Handling complaints and disputes</li>
              <li>Repatriation if necessary</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Employer Relations</h3>
            <p className="text-gray-700 mb-2">You are responsible for:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Verifying employer credentials and accreditation</li>
              <li>Negotiating terms and conditions</li>
              <li>Ensuring employer compliance with contracts</li>
              <li>Monitoring workplace conditions</li>
              <li>Addressing employer violations</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="worker-protection" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Worker Protection Obligations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Insurance and Welfare</h3>
            <p className="text-gray-700 mb-2">You agree to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Provide comprehensive insurance to all deployed workers</li>
              <li>Maintain a full-time, trained Welfare Desk Officer</li>
              <li>Monitor workers at job sites</li>
              <li>Respond promptly to worker complaints</li>
              <li>Assist workers in distress</li>
              <li>Provide emergency support and repatriation when needed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Contract Compliance</h3>
            <p className="text-gray-700 mb-2">You will:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Ensure employment contracts match approved job orders</li>
              <li>Not substitute or alter contracts without consent</li>
              <li>Provide workers with copies of signed contracts</li>
              <li>Honor all contract terms</li>
              <li>Not deploy workers under different conditions than promised</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Anti-Trafficking</h3>
            <p className="text-gray-700 mb-2">You commit to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Screen employers for trafficking risks</li>
              <li>Monitor for signs of forced labor or abuse</li>
              <li>Report trafficking situations to DMW and law enforcement</li>
              <li>Assist victims of trafficking</li>
              <li>Cooperate with anti-trafficking investigations</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="indemnification" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Indemnification and Liability</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Full Indemnification</h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-gray-700 mb-3">
                You agree to indemnify, defend, and hold harmless JobAgentPH.com, its owners, operators, employees, affiliates, and partners from ANY and ALL claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney's fees) arising from or related to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Your recruitment and placement activities</li>
                <li>Your violation of DMW regulations or Philippine law</li>
                <li>Your violation of these Terms</li>
                <li>False or misleading job postings</li>
                <li>Illegal fee collection or recruitment practices</li>
                <li>Employment disputes with workers</li>
                <li>Worker injuries, deaths, or losses</li>
                <li>Contract breaches with workers or employers</li>
                <li>Intellectual property infringement</li>
                <li>Data breaches or privacy violations</li>
                <li>Any actions or omissions by you, your employees, or agents</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 No Liability of Platform</h3>
            <p className="text-gray-700 mb-2">You acknowledge that JobAgentPH.com:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Is NOT liable for your actions or those of workers/employers</li>
              <li>Does NOT guarantee job placement or worker performance</li>
              <li>Is NOT responsible for employment outcomes</li>
              <li>Cannot control your compliance with laws</li>
              <li>Is NOT a party to employment contracts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 Insurance</h3>
            <p className="text-gray-700 mb-2">You agree to maintain:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Professional liability insurance (errors and omissions)</li>
              <li>General liability insurance</li>
              <li>Workers' compensation or equivalent</li>
              <li>Any insurance required by DMW regulations</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="audit" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Audit and Compliance Monitoring</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Platform Monitoring</h3>
            <p className="text-gray-700 mb-2">JobAgentPH.com reserves the right to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Review all job postings before publication</li>
              <li>Request proof of job orders and employer accreditation</li>
              <li>Verify your DMW license status periodically</li>
              <li>Investigate complaints against you</li>
              <li>Conduct compliance audits</li>
              <li>Request additional documentation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Your Cooperation</h3>
            <p className="text-gray-700 mb-2">You agree to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Respond promptly to information requests</li>
              <li>Provide documentation within 48 hours when requested</li>
              <li>Cooperate with investigations</li>
              <li>Correct violations immediately when notified</li>
              <li>Allow access to necessary records (subject to privacy laws)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Consequences of Non-Compliance</h3>
            <p className="text-gray-700 mb-2">Violations may result in:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Warning notices</li>
              <li>Temporary suspension of job posting privileges</li>
              <li>Removal of specific job postings</li>
              <li>Account suspension or termination</li>
              <li>Reporting to DMW</li>
              <li>Referral to law enforcement</li>
              <li>Legal action for damages</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="data-privacy" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data and Privacy</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Worker Data Protection</h3>
            <p className="text-gray-700 mb-2">You agree to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Protect worker personal data per the Data Privacy Act</li>
              <li>Use data only for legitimate recruitment purposes</li>
              <li>Not sell or share data with unauthorized parties</li>
              <li>Implement appropriate security measures</li>
              <li>Delete data when no longer needed (subject to legal retention)</li>
              <li>Comply with worker data rights (access, correction, deletion)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Data Sharing with JobAgentPH.com</h3>
            <p className="text-gray-700 mb-2">You authorize JobAgentPH.com to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Display your company information publicly</li>
              <li>Share your job postings with users</li>
              <li>Verify your credentials with DMW (if necessary)</li>
              <li>Retain records per legal requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.3 Confidentiality</h3>
            <p className="text-gray-700 mb-2">You will:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Keep user data confidential</li>
              <li>Not use worker information for purposes other than recruitment</li>
              <li>Protect proprietary information</li>
              <li>Comply with non-disclosure obligations</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="account" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Account Management</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Account Security</h3>
            <p className="text-gray-700 mb-2">You are responsible for:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Maintaining confidentiality of login credentials</li>
              <li>All activities under your account</li>
              <li>Notifying us immediately of unauthorized access</li>
              <li>Using strong passwords and security measures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Accurate Information</h3>
            <p className="text-gray-700 mb-2">You must:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Provide truthful and accurate registration information</li>
              <li>Update information promptly when it changes</li>
              <li>Not impersonate others or provide false credentials</li>
              <li>Maintain current contact information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Authorized Users</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Only authorized employees may access your agency account</li>
              <li>You are responsible for all actions by your team members</li>
              <li>Implement internal access controls</li>
              <li>Train staff on platform policies</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 By You</h3>
            <p className="text-gray-700 mb-2">You may terminate your account by:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Providing 30 days written notice</li>
              <li>Fulfilling all outstanding obligations</li>
              <li>Completing pending worker placements</li>
              <li>Paying any outstanding fees</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 By JobAgentPH.com</h3>
            <p className="text-gray-700 mb-2">We may immediately suspend or terminate your account for:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Expired, suspended, or revoked DMW license</li>
              <li>Illegal recruitment activities</li>
              <li>Fee violations</li>
              <li>False or fraudulent job postings</li>
              <li>Violation of these Terms</li>
              <li>Worker complaints or DMW violations</li>
              <li>Non-payment of platform fees</li>
              <li>Engaging in harmful conduct</li>
              <li>At our discretion to protect users or the Platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.3 Effect of Termination</h3>
            <p className="text-gray-700 mb-2">Upon termination:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Your job postings will be removed</li>
              <li>Your access will be revoked</li>
              <li>You remain liable for pre-termination obligations</li>
              <li>You must continue to support already-deployed workers</li>
              <li>Indemnification obligations survive termination</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section id="certification" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Acknowledgment and Certification</h2>

            <div className="bg-indigo-50 border-2 border-indigo-400 p-6 rounded-lg">
              <p className="font-bold text-gray-900 mb-4">BY REGISTERING AS AN AGENCY ON JOBAGENTPH.COM, YOU CERTIFY THAT:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You hold a valid, current DMW license for overseas employment recruitment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You have read, understood, and agree to comply with all Terms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You will comply with all Philippine laws, DMW regulations, and ethical recruitment standards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You will not charge illegal placement fees to workers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You understand JobAgentPH.com is a job marketplace platform only and is not responsible for your recruitment activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You accept full responsibility for all recruitment and placement activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You will indemnify and hold harmless JobAgentPH.com from all claims arising from your activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>All information you provide is true, accurate, and complete</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 flex-shrink-0">☑</span>
                  <span>You have authority to bind your agency to these Terms</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Questions or Concerns</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">contact@jobagentph.com</a>
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-xl font-bold text-gray-900 mb-2">JobAgentPH.com - Committed to Ethical Recruitment and Worker Protection</p>
            <p className="text-sm text-gray-600 italic">
              All recruitment agencies must comply with Philippine DMW regulations and ethical recruitment standards.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}
