'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-8 rounded-t-lg">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-blue-100 mt-2">JobAgentPH.com</p>
          <p className="text-sm text-blue-200 mt-4">Last Updated: November 11, 2025</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 prose prose-blue max-w-none">

          {/* Section 1 */}
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction and Platform Nature</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 About JobAgentPH.com</h3>
            <p className="text-gray-700 mb-4">
              JobAgentPH.com ("we," "us," "our," or "the Platform") is an <strong>online job marketplace platform</strong> that connects Filipino job seekers with Department of Migrant Workers (DMW) licensed recruitment agencies for overseas employment opportunities.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 What We Are NOT</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-gray-800 font-semibold">
                IMPORTANT: JobAgentPH.com is NOT a recruitment agency.
              </p>
              <p className="text-gray-700 mt-2">
                We are not engaged in the recruitment, placement, referral, contracting, hiring, or procuring of workers for overseas or local employment. We do not deploy workers, process employment contracts, or conduct recruitment activities as defined under Philippine law.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Our Role</h3>
            <p className="text-gray-700 mb-2">We provide a job marketplace platform where:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>DMW-licensed recruitment agencies can post job opportunities</li>
              <li>Job seekers can browse job listings and connect with licensed agencies</li>
              <li>Users can verify agency credentials and make informed decisions</li>
            </ul>
            <p className="text-gray-700 mt-4">
              All recruitment and placement activities are conducted solely by DMW-licensed recruitment agencies, not by JobAgentPH.com.
            </p>
          </section>

          {/* Section 2 */}
          <section id="acceptance" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using JobAgentPH.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use our Platform.
            </p>
          </section>

          {/* Section 3 */}
          <section id="eligibility" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Categories and Eligibility</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Job Seekers</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Must be at least 18 years of age</li>
              <li>Must provide accurate personal information</li>
              <li>Must verify agency credentials independently before applying for jobs</li>
              <li>Responsible for all interactions with recruitment agencies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Recruitment Agencies</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Must hold a valid, current DMW (formerly POEA) license for overseas recruitment</li>
              <li>Must provide proof of DMW license and business permits</li>
              <li>Must comply with all Philippine laws and DMW regulations</li>
              <li>Must not engage in illegal recruitment practices</li>
              <li>Must accept full responsibility for all recruitment activities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Prohibited Users</h3>
            <p className="text-gray-700 mb-2">The following may not use our Platform:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Individuals under 18 years of age</li>
              <li>Unlicensed recruitment agencies or individuals</li>
              <li>Entities engaged in illegal recruitment activities</li>
              <li>Users previously banned from the Platform for violations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="agency-responsibilities" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Agency Responsibilities and Obligations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Licensing and Compliance</h3>
            <p className="text-gray-700 mb-3">Recruitment agencies using JobAgentPH.com agree to:</p>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">1. Maintain Valid DMW License</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Hold a current, valid DMW license for overseas employment recruitment</li>
                <li>Provide DMW license number and documentation</li>
                <li>Update license information immediately upon renewal</li>
                <li>Notify us immediately if license is suspended, revoked, or expires</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">2. Comply with Philippine Law</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Follow all provisions of Republic Act 8042 (Migrant Workers Act), RA 10022, RA 11641 (DMW Act), and related laws</li>
                <li>Adhere to all DMW rules, regulations, and circulars</li>
                <li>Comply with ethical recruitment standards</li>
                <li>Follow "no placement fee" policies where applicable</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">3. Accurate Job Postings</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Post only legitimate job opportunities with valid DMW-approved job orders</li>
                <li>Provide accurate information about positions, salaries, benefits, and working conditions</li>
                <li>Include required information: employer name, accreditation number, worksite location</li>
                <li>Not post fraudulent, misleading, or deceptive job listings</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">4. Fee Compliance</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Not charge illegal placement fees to workers</li>
                <li>Comply with zero-fee policies for designated countries (Canada, US, UK, UAE, etc.)</li>
                <li>Not exceed the one-month salary cap where fees are permitted</li>
                <li>Not request fees through unofficial channels or electronic transfers</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">5. Worker Protection</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Provide comprehensive insurance to deployed workers</li>
                <li>Maintain a Welfare Desk Officer</li>
                <li>Not deploy minors or engage in human trafficking</li>
                <li>Respond to worker complaints promptly and professionally</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Agency Indemnification</h3>
            <p className="text-gray-700 mb-2">
              Agencies agree to indemnify, defend, and hold harmless JobAgentPH.com, its owners, operators, employees, and affiliates from any claims, damages, losses, liabilities, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Agency's recruitment activities</li>
              <li>Violations of DMW regulations or Philippine law</li>
              <li>False or misleading job postings</li>
              <li>Illegal fee collection or recruitment practices</li>
              <li>Employment disputes with workers</li>
              <li>Any breach of these Terms of Service</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="jobseeker-responsibilities" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Job Seeker Responsibilities</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Verification Obligations</h3>
            <p className="text-gray-700 mb-3">Job seekers are responsible for:</p>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">1. Verifying Agency Credentials</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Check agency DMW license status at: <a href="https://dmw.gov.ph/licensed-recruitment-agencies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://dmw.gov.ph/licensed-recruitment-agencies</a></li>
                <li>Verify job postings are legitimate</li>
                <li>Confirm job orders are DMW-approved</li>
                <li>Research agency reputation and reviews</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">2. Protecting Yourself</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Never pay illegal placement fees</li>
                <li>Only transact at agency's registered business address</li>
                <li>Report suspicious activities to DMW: +63 2 8721-0619</li>
                <li>Keep copies of all documents and receipts</li>
                <li>Read and understand employment contracts before signing</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">3. Due Diligence</h4>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Research destination country labor laws</li>
                <li>Understand your rights as an Overseas Filipino Worker (OFW)</li>
                <li>Verify employer credentials</li>
                <li>Attend Pre-Departure Orientation Seminars (PDOS)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Application Process</h3>
            <p className="text-gray-700 mb-2">When applying for jobs through our Platform:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>You will be connected with the recruitment agency directly</li>
              <li>The agency, not JobAgentPH.com, processes your application</li>
              <li>You are responsible for providing accurate information to agencies</li>
              <li>JobAgentPH.com is not involved in hiring decisions</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="platform-services" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Platform Services and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 What We Provide</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Advertising space for DMW-licensed agencies</li>
              <li>Job search and browsing functionality</li>
              <li>Agency verification indicators</li>
              <li>Links to DMW verification resources</li>
              <li>User messaging system (for communication only)</li>
              <li>Educational resources about overseas employment</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 What We DO NOT Provide</h3>
            <p className="text-gray-700 mb-2">JobAgentPH.com explicitly does NOT:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Recruit, hire, or place workers</li>
              <li>Process job applications on behalf of agencies</li>
              <li>Make employment decisions or recommendations</li>
              <li>Guarantee job placement or employment outcomes</li>
              <li>Collect placement fees from workers</li>
              <li>Deploy workers overseas</li>
              <li>Act as an employer or recruitment agent</li>
              <li>Provide legal or immigration advice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Verification Services</h3>
            <p className="text-gray-700 mb-2">Our "Verified" badge indicates:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-3">
              <li>We have reviewed the agency's DMW license documentation</li>
              <li>The agency provided required business permits</li>
              <li>The agency completed our registration process</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="font-semibold text-gray-800 mb-2">This does NOT mean:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>We guarantee the agency's performance or legitimacy</li>
                <li>We endorse or recommend the agency</li>
                <li>We are responsible for the agency's actions</li>
                <li>The agency is immune from violations or complaints</li>
              </ul>
            </div>

            <p className="text-gray-700 font-semibold">
              Job seekers must still independently verify all agency credentials with DMW.
            </p>
          </section>

          {/* Section 7 */}
          <section id="prohibited-activities" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 General Prohibitions</h3>
            <p className="text-gray-700 mb-2">Users may not:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Engage in illegal recruitment activities</li>
              <li>Post fraudulent or deceptive job listings</li>
              <li>Collect illegal fees from workers</li>
              <li>Impersonate others or provide false information</li>
              <li>Violate any Philippine laws or regulations</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Use the Platform for unlawful purposes</li>
              <li>Attempt to circumvent security measures</li>
              <li>Scrape or copy Platform content without permission</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Consequences</h3>
            <p className="text-gray-700 mb-2">Violations may result in:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Account suspension or termination</li>
              <li>Removal of job postings</li>
              <li>Reporting to DMW and law enforcement</li>
              <li>Legal action for damages</li>
              <li>Permanent ban from the Platform</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="fees-payments" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Fees and Payments</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Platform Fees (Agencies)</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Featured Job Placement:</strong> Agencies may pay for premium job placement in our featured carousel. This is an advertising fee only, not a recruitment fee.</li>
              <li><strong>Payment Methods:</strong> GCash, PayMaya, Bank Transfer, PayPal</li>
              <li><strong>Refund Policy:</strong> Fees are non-refundable unless service is not provided due to Platform error</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 No Fees for Job Seekers</h3>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="font-semibold text-gray-800">
                Job seekers NEVER pay fees to JobAgentPH.com.
              </p>
              <p className="text-gray-700 mt-2">
                Our services for job seekers are completely free. If anyone asks you to pay to use JobAgentPH.com, report it immediately to contact@jobagentph.com.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Placement Fee Policy</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="font-semibold text-gray-800 mb-2">IMPORTANT:</p>
              <p className="text-gray-700 mb-3">
                Recruitment agencies are generally prohibited from charging placement fees to workers under Philippine law. Exceptions apply only in limited circumstances and specific countries. Agencies must comply with all DMW fee regulations.
              </p>
              <p className="text-gray-700 mb-2">Job seekers should never pay fees for:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-3">
                <li>Job placement or processing</li>
                <li>Documentation or paperwork</li>
                <li>DMW clearance or certification</li>
                <li>Medical exams beyond authorized costs</li>
                <li>Any fees in zero-fee countries (Canada, US, UK, etc.)</li>
              </ul>
              <p className="text-gray-700">
                <strong>Report illegal fee requests to DMW:</strong> +63 2 8721-0619 or email@dmw.gov.ph
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="intellectual-property" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Platform Ownership</h3>
            <p className="text-gray-700 mb-4">
              All content, design, logos, trademarks, and intellectual property on JobAgentPH.com are owned by or licensed to us. You may not copy, reproduce, distribute, or create derivative works without written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 User Content</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Agencies retain ownership of job postings and company information</li>
              <li>By posting content, you grant us a license to display, distribute, and promote it on the Platform</li>
              <li>You represent that you have the right to post all content you submit</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="disclaimers-liability" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers and Limitation of Liability</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Platform "AS IS"</h3>
            <p className="text-gray-700 mb-2">
              JobAgentPH.com is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied, including but not limited to:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Accuracy, completeness, or reliability of job postings</li>
              <li>Availability or uninterrupted access to the Platform</li>
              <li>Fitness for a particular purpose</li>
              <li>Security or freedom from viruses or errors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 No Responsibility for Agency Actions</h3>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
              <p className="font-semibold text-gray-800 mb-2">JobAgentPH.com is NOT responsible for:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Recruitment agency actions, omissions, or violations</li>
                <li>Employment outcomes or job placement success</li>
                <li>Contract disputes between workers and agencies/employers</li>
                <li>False or misleading job postings</li>
                <li>Illegal fee collection by agencies</li>
                <li>Worker injuries, damages, or losses during employment</li>
                <li>Agency failure to comply with DMW regulations</li>
                <li>Quality or legitimacy of job opportunities</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Limitation of Liability</h3>
            <p className="text-gray-700 mb-2">
              To the maximum extent permitted by law, JobAgentPH.com and its affiliates shall not be liable for:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use or inability to use the Platform</li>
              <li>Third-party actions or content</li>
              <li>Any damages exceeding the amount you paid to us (if any) in the past 12 months</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.4 User Assumes Risk</h3>
            <p className="text-gray-700 mb-2">You acknowledge and agree that:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>You use JobAgentPH.com at your own risk</li>
              <li>You are solely responsible for verifying agency credentials</li>
              <li>You should conduct independent due diligence before applying for jobs</li>
              <li>JobAgentPH.com cannot guarantee employment or prevent illegal activities by third parties</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="privacy" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your use of JobAgentPH.com is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="font-semibold text-gray-800 mb-2">Key Points:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>We collect only necessary information</li>
                <li>We share data with agencies only when you apply for jobs</li>
                <li>We comply with the Data Privacy Act of 2012</li>
                <li>You have rights to access, correct, and delete your data</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="reporting" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Reporting and Complaints</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 How to Report Violations</h3>
            <p className="text-gray-700 mb-2">If you encounter:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Illegal recruitment activities</li>
              <li>Unlicensed agencies</li>
              <li>Fee violations</li>
              <li>Fraudulent job postings</li>
              <li>Harassment or abuse</li>
              <li>Any suspicious activity</li>
            </ul>

            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="text-gray-700"><strong>Report to us:</strong> <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">contact@jobagentph.com</a></p>
              <p className="text-gray-700"><strong>Report to DMW:</strong> +63 2 8721-0619 or email@dmw.gov.ph</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 Our Response</h3>
            <p className="text-gray-700 mb-2">We will:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Investigate all reports promptly</li>
              <li>Take appropriate action (warnings, suspension, termination)</li>
              <li>Cooperate with DMW and law enforcement</li>
              <li>Notify you of resolution (where applicable)</li>
            </ul>
          </section>

          {/* Section 13 */}
          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Account Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 By You</h3>
            <p className="text-gray-700 mb-2">
              You may close your account at any time by contacting contact@jobagentph.com. Upon closure:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Your profile will be deleted</li>
              <li>Your job postings (if agency) will be removed</li>
              <li>Your personal data will be deleted per our Privacy Policy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 By Us</h3>
            <p className="text-gray-700 mb-2">We reserve the right to suspend or terminate accounts for:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Violation of these Terms of Service</li>
              <li>Illegal recruitment activities</li>
              <li>Expired or invalid DMW licenses (agencies)</li>
              <li>Fraudulent activity</li>
              <li>Harassment or abuse</li>
              <li>Non-payment of fees (agencies)</li>
              <li>At our sole discretion to protect the Platform or users</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 Effect of Termination</h3>
            <p className="text-gray-700 mb-2">Upon termination:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Your access to the Platform will be revoked</li>
              <li>We may retain certain information as required by law</li>
              <li>You remain liable for any outstanding obligations</li>
              <li>These Terms survive termination where applicable</li>
            </ul>
          </section>

          {/* Section 14 */}
          <section id="dispute-resolution" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">14.1 Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in the courts of Metro Manila, Philippines.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">14.2 Agency-Worker Disputes</h3>
            <p className="text-gray-700 mb-2">
              Disputes between agencies and workers are NOT the responsibility of JobAgentPH.com. Such disputes should be resolved:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Through the agency's internal processes</li>
              <li>Via DMW dispute resolution mechanisms</li>
              <li>Through Philippine labor arbitration</li>
              <li>In appropriate courts of law</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">14.3 Platform Disputes</h3>
            <p className="text-gray-700 mb-2">For disputes with JobAgentPH.com:</p>
            <ol className="list-decimal ml-6 text-gray-700 space-y-1">
              <li>Contact us first to attempt informal resolution</li>
              <li>If unresolved, submit to mediation</li>
              <li>If still unresolved, proceed to Philippine courts</li>
            </ol>
          </section>

          {/* Section 15 */}
          <section id="amendments" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Amendments and Updates</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">15.1 Right to Modify</h3>
            <p className="text-gray-700 mb-2">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to the Platform. Material changes will be notified via:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
              <li>Email to registered users</li>
              <li>Prominent notice on the Platform</li>
              <li>Updated "Last Updated" date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">15.2 Continued Use</h3>
            <p className="text-gray-700">
              Your continued use of JobAgentPH.com after changes constitutes acceptance of the updated Terms. If you do not agree to changes, you must stop using the Platform.
            </p>
          </section>

          {/* Section 16 */}
          <section id="miscellaneous" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Miscellaneous</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">16.1 Entire Agreement</h3>
            <p className="text-gray-700 mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and JobAgentPH.com.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">16.2 Severability</h3>
            <p className="text-gray-700 mb-4">
              If any provision is found unenforceable, the remaining provisions remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">16.3 Waiver</h3>
            <p className="text-gray-700 mb-4">
              Our failure to enforce any right or provision does not constitute a waiver of that right.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">16.4 Assignment</h3>
            <p className="text-gray-700 mb-4">
              You may not assign these Terms. We may assign our rights to any affiliate or successor.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">16.5 Contact Information</h3>
            <p className="text-gray-700 mb-2">For questions about these Terms:</p>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">contact@jobagentph.com</a></p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="acknowledgment" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Acknowledgment and Agreement</h2>

            <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-lg">
              <p className="font-bold text-gray-900 mb-4">BY USING JOBAGENTPH.COM, YOU ACKNOWLEDGE THAT:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You have read and understood these Terms of Service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You understand that JobAgentPH.com is NOT a recruitment agency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Recruitment agencies are solely responsible for recruitment and placement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You will verify all agency credentials independently with DMW</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You will report violations to DMW and JobAgentPH.com</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You use the Platform at your own risk</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>You agree to comply with all applicable laws and regulations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-xl font-bold text-gray-900 mb-2">JobAgentPH.com - Connecting Filipino Talent with DMW-Licensed Opportunities</p>
            <p className="text-sm text-gray-600 italic">
              This Platform is an advertising service only. All recruitment activities are conducted by licensed agencies in compliance with Philippine DMW regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}
