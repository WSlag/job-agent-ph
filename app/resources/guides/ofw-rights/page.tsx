'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function OFWRightsPage() {
  const rights = [
    {
      category: 'Employment Rights',
      items: [
        'Right to a verified employment contract approved by DMW',
        'Right to receive salary as stated in the contract',
        'Right to safe and humane working conditions',
        'Right to rest days and paid holidays as per contract',
        'Right to overtime pay for extra hours worked',
        'Right to end-of-service benefits upon contract completion',
      ],
    },
    {
      category: 'Protection Rights',
      items: [
        'Right to retain your passport and important documents',
        'Right to communicate with family and DMW/Philippine Embassy',
        'Right to file complaints against abusive employers',
        'Right to legal assistance from Philippine Embassy/Consulate',
        'Right to repatriation if needed',
        'Protection against illegal recruitment and human trafficking',
      ],
    },
    {
      category: 'OWWA Benefits',
      items: [
        'Workers assistance and welfare services',
        'Reintegration program for returning OFWs',
        'Education and training programs',
        'Livelihood and enterprise development',
        'Scholarship programs for OFW dependents',
        'Emergency assistance and repatriation',
      ],
    },
  ];

  const responsibilities = [
    {
      title: 'Pre-Deployment',
      items: [
        'Verify recruitment agency is DMW-licensed',
        'Read and understand your employment contract thoroughly',
        'Attend Pre-Departure Orientation Seminar (PDOS)',
        'Secure all required documents (passport, medical, contracts)',
        'Register with OWWA and pay membership fee',
        'Inform family of employer details and contact information',
      ],
    },
    {
      title: 'While Abroad',
      items: [
        'Register with Philippine Embassy/Consulate upon arrival',
        'Follow host country laws and respect local customs',
        'Fulfill obligations stated in your employment contract',
        'Maintain communication with family in the Philippines',
        'Keep copies of important documents in a safe place',
        'Report any contract violations to Philippine Embassy immediately',
      ],
    },
    {
      title: 'Financial Management',
      items: [
        'Send remittances through legal channels only',
        'Plan and budget your earnings wisely',
        'Save for emergencies and future goals',
        'Consider investments in the Philippines',
        'Avoid excessive debts and gambling',
        'Keep records of salary payments and remittances',
      ],
    },
  ];

  const warningsSigns = [
    'Employer confiscates your passport or documents',
    'Salary is withheld or significantly less than contract',
    'Working conditions are unsafe or abusive',
    'You are prevented from communicating with family',
    'Contract terms are changed without your consent',
    'You experience physical, sexual, or verbal abuse',
    'You are forced to work excessive hours without proper compensation',
    'Accommodation or food provided is inadequate',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">OFW Rights and Responsibilities</h1>
          <p className="text-xl text-blue-100">
            Know your rights as an OFW and what you need to do to protect yourself
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Every Overseas Filipino Worker (OFW) has fundamental rights that must be respected and responsibilities
              that must be fulfilled. Understanding these will help you have a safe and successful overseas employment experience.
            </p>
          </div>

          {/* Rights Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              Your Rights as an OFW
            </h2>
            <div className="space-y-6">
              {rights.map((section, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.category}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Responsibilities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {responsibilities.map((section, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <Card className="p-8 mb-12 bg-red-50 border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <AlertTriangle className="text-red-600" />
              Warning Signs of Abuse or Exploitation
            </h2>
            <p className="text-gray-700 mb-4">
              Contact the Philippine Embassy immediately if you experience any of the following:
            </p>
            <ul className="space-y-2">
              {warningsSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{sign}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Important Reminders */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Remember</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  The Philippine government is committed to protecting OFWs. Don't hesitate to seek help.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Keep emergency contact numbers saved in your phone and written down separately.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Maintain regular communication with your family and inform them of any problems.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Document everything - keep copies of contracts, salary slips, and communications.
                </span>
              </li>
            </ul>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-green-50 to-teal-50 border-green-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Information?</h2>
            <p className="text-gray-700 mb-6">
              Browse more resources or get in touch with our support team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resources" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                More Resources
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Contact Support
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
