'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Eye, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function EmploymentContractPage() {
  const keyComponents = [
    {
      title: 'Employer Information',
      mustInclude: [
        'Full legal name of employer/company',
        'Complete business address',
        'Contact details (phone, email)',
        'Business registration number',
      ],
    },
    {
      title: 'Employee Information',
      mustInclude: [
        'Your full name (as in passport)',
        'Passport number and validity',
        'Complete home address in Philippines',
        'Emergency contact information',
      ],
    },
    {
      title: 'Job Details',
      mustInclude: [
        'Exact job title and position',
        'Detailed job description and duties',
        'Work location/site address',
        'Reporting structure (supervisor)',
      ],
    },
    {
      title: 'Contract Duration',
      mustInclude: [
        'Start date of employment',
        'Contract period (e.g., 2 years)',
        'Probation period (if any)',
        'Renewal conditions',
      ],
    },
    {
      title: 'Salary & Compensation',
      mustInclude: [
        'Monthly basic salary (amount and currency)',
        'Overtime rate and conditions',
        'Allowances (food, transportation, etc.)',
        'Payment schedule (e.g., monthly on 15th)',
        'Payment method (bank transfer, cash)',
      ],
    },
    {
      title: 'Working Hours',
      mustInclude: [
        'Regular working hours per day',
        'Total hours per week',
        'Rest days per week',
        'Shift schedule (if applicable)',
      ],
    },
    {
      title: 'Leave Benefits',
      mustInclude: [
        'Annual vacation leave (number of days)',
        'Sick leave (number of days)',
        'Public holidays (list or number)',
        'Emergency/compassionate leave',
      ],
    },
    {
      title: 'Accommodation & Living',
      mustInclude: [
        'Housing provision (free, shared, allowance)',
        'Food provision (meals provided or allowance)',
        'Utilities coverage',
        'Living conditions details',
      ],
    },
    {
      title: 'Other Benefits',
      mustInclude: [
        'Medical/health insurance coverage',
        'Life insurance (if provided)',
        'Transportation to/from work',
        'Airfare (to destination and return)',
        'End-of-service gratuity/bonus',
      ],
    },
    {
      title: 'Termination Conditions',
      mustInclude: [
        'Notice period for resignation',
        'Grounds for termination',
        'Early termination conditions',
        'Repatriation arrangements',
      ],
    },
  ];

  const redFlags = [
    {
      flag: 'Salary lower than contract states',
      description: 'Contract says SAR 1,500 but verbal agreement is SAR 1,200',
      severity: 'critical',
    },
    {
      flag: 'Vague job description',
      description: '"General work" or "as assigned" without specific duties',
      severity: 'critical',
    },
    {
      flag: 'No clear working hours',
      description: 'Missing daily/weekly hours or says "flexible" for domestic work',
      severity: 'high',
    },
    {
      flag: 'Excessive placement fee',
      description: 'Fee exceeding one month\'s salary (illegal in Philippines)',
      severity: 'critical',
    },
    {
      flag: 'Passport retention clause',
      description: 'Contract states employer will keep your passport',
      severity: 'critical',
    },
    {
      flag: 'No rest days specified',
      description: 'Missing weekly rest day or says "as needed"',
      severity: 'high',
    },
    {
      flag: 'Missing leave benefits',
      description: 'No sick leave or vacation leave mentioned',
      severity: 'high',
    },
    {
      flag: 'No termination clause',
      description: 'No clear process for ending employment',
      severity: 'medium',
    },
    {
      flag: 'Contract in foreign language only',
      description: 'No Filipino or English translation provided',
      severity: 'critical',
    },
    {
      flag: 'Different from job order',
      description: 'Contract details don\'t match original job posting',
      severity: 'critical',
    },
  ];

  const beforeSigning = [
    {
      step: 1,
      action: 'Read the Entire Contract',
      description: 'Read every single clause carefully. Don\'t skip sections even if they seem boring or technical.',
      tip: 'Take your time - this is your legal protection abroad.',
    },
    {
      step: 2,
      action: 'Verify It Matches Job Offer',
      description: 'Compare contract with original job posting, interview discussions, and agency job order.',
      tip: 'All details (salary, position, duties) must match what was promised.',
    },
    {
      step: 3,
      action: 'Check Language',
      description: 'Contract must be in English or Filipino. If in Arabic/other language, demand translation.',
      tip: 'Never sign a contract you cannot fully understand.',
    },
    {
      step: 4,
      action: 'Verify DMW Authentication',
      description: 'Contract must be verified and stamped by DMW (Department of Migrant Workers).',
      tip: 'DMW verification is mandatory - no exceptions.',
    },
    {
      step: 5,
      action: 'Ask Questions',
      description: 'Clarify anything unclear with agency. Ask about vague terms, missing benefits, or confusing clauses.',
      tip: 'Better to ask now than regret later abroad.',
    },
    {
      step: 6,
      action: 'Get Legal Advice (if needed)',
      description: 'For professional contracts or if unsure, consult DOLE, DMW, or a lawyer (many offer free OFW consultation).',
      tip: 'Free legal aid available at DMW offices and OWWA.',
    },
    {
      step: 7,
      action: 'Keep Multiple Copies',
      description: 'Before signing, photocopy the complete contract. Keep originals + copies safe.',
      tip: 'Store digital copy (scan/photo) in cloud or email to yourself.',
    },
  ];

  const commonClauses = [
    {
      clause: 'Probationary Period',
      whatItMeans: 'Usually 3-6 months where employer can terminate without full benefits. Check conditions clearly.',
      watchFor: 'Excessive probation (over 6 months) or unclear evaluation criteria.',
    },
    {
      clause: 'Force Majeure',
      whatItMeans: 'Contract void if uncontrollable events (war, natural disaster) prevent work. Covers repatriation.',
      watchFor: 'Should specify who pays for repatriation costs.',
    },
    {
      clause: 'Confidentiality',
      whatItMeans: 'You must not share company secrets/information. Reasonable for most jobs.',
      watchFor: 'Overly broad clauses preventing you from reporting abuse.',
    },
    {
      clause: 'Non-Compete',
      whatItMeans: 'Cannot work for competitors for period after leaving. Check if reasonable.',
      watchFor: 'Excessive restrictions preventing you from finding new work.',
    },
    {
      clause: 'Arbitration',
      whatItMeans: 'Disputes resolved through arbitration instead of court. Location and language matter.',
      watchFor: 'Must allow Philippine labor law to apply and DMW involvement.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Employment Contract Guide</h1>
          <p className="text-xl text-purple-100">
            What to look for in your employment contract and how to protect yourself
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Your employment contract is the most important document in your OFW journey. It is your legal protection
              abroad and defines your rights, responsibilities, and what your employer must provide. Never sign a contract
              you don't understand or that doesn't match what was promised.
            </p>
          </div>

          {/* Critical Warning */}
          <Card className="p-8 mb-12 bg-red-50 border-red-300 border-2">
            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={32} />
              CRITICAL: Never Sign Without DMW Verification
            </h2>
            <div className="space-y-3 text-gray-800">
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>All employment contracts MUST be verified by DMW (Department of Migrant Workers) before deployment</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Contract substitution (signing different contract abroad) is ILLEGAL and means you have no protection</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>If employer changes contract terms after arrival, contact Philippine Embassy immediately</span>
              </p>
            </div>
          </Card>

          {/* What Must Be In Contract */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="text-purple-600" size={32} />
              What Must Be In Your Contract
            </h2>
            <div className="space-y-4">
              {keyComponents.map((component, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{component.title}</h3>
                  <ul className="space-y-2">
                    {component.mustInclude.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={32} />
              Red Flags - Warning Signs
            </h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-6">
                If you see any of these red flags, DO NOT SIGN. Report to DMW or your recruitment agency immediately.
              </p>
              <div className="space-y-4">
                {redFlags.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      item.severity === 'critical'
                        ? 'bg-red-50 border-red-300'
                        : item.severity === 'high'
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`flex-shrink-0 mt-0.5 ${
                          item.severity === 'critical'
                            ? 'text-red-600'
                            : item.severity === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                        size={20}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.flag}</h4>
                        <p className="text-sm text-gray-700">{item.description}</p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                            item.severity === 'critical'
                              ? 'bg-red-200 text-red-800'
                              : item.severity === 'high'
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {item.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Before Signing Checklist */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Eye className="text-purple-600" size={32} />
              Before Signing: Essential Steps
            </h2>
            <div className="space-y-6">
              {beforeSigning.map((item) => (
                <Card key={item.step} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.action}</h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong className="text-purple-700">Tip:</strong> {item.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Clauses Explained */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Common Contract Clauses</h2>
            <div className="space-y-4">
              {commonClauses.map((item, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.clause}</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">What it means:</p>
                      <p className="text-sm text-gray-600">{item.whatItMeans}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Watch for:</p>
                      <p className="text-sm text-gray-600">{item.watchFor}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sample Contract Note */}
          <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Download className="text-blue-600" />
              Sample Contract Templates
            </h2>
            <p className="text-gray-700 mb-4">
              DMW provides standard employment contract templates for different countries and positions.
              These ensure minimum labor standards are met.
            </p>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Domestic Worker (Middle East)</h3>
                <p className="text-sm text-gray-700 mb-2">Standard contract template with minimum protections</p>
                <a
                  href="https://dmw.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Download from DMW Website →
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Professional Workers</h3>
                <p className="text-sm text-gray-700 mb-2">Template for skilled workers (nurses, engineers, IT)</p>
                <a
                  href="https://dmw.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Download from DMW Website →
                </a>
              </div>
            </div>
          </Card>

          {/* Help Resources */}
          <Card className="p-8 mb-8 bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to Get Help</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">DMW Helpline</p>
                  <p className="text-sm text-gray-700">Call 1348 (Philippines) for contract verification and complaints</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">OWWA</p>
                  <p className="text-sm text-gray-700">Free legal assistance for OFWs: +63-2-8722-1348</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">DOLE</p>
                  <p className="text-sm text-gray-700">Labor rights information and legal aid: +63-2-8527-8000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">IBP (Integrated Bar of the Philippines)</p>
                  <p className="text-sm text-gray-700">Free legal consultation for OFWs at IBP offices nationwide</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Final Reminder */}
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Remember</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Your contract is your shield. Don't sign if anything feels wrong or unclear.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  No legitimate employer will rush you to sign. Take time to read and understand.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Always keep copies of your signed contract. Store digital backup in email/cloud.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  If in doubt, seek help from DMW, OWWA, or legal aid before signing.
                </span>
              </li>
            </ul>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Information?</h2>
            <p className="text-gray-700 mb-6">
              Read our other guides or contact support for personalized help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resources" className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                More Resources
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Contact Support
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
