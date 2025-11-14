'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, FileText, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function POEAProcessingGuidePage() {
  const processingSteps = [
    {
      step: 1,
      title: 'Secure Employment Contract',
      details: 'Get job offer from licensed recruitment agency. Contract must be in English and Filipino.',
      timeline: '1-2 weeks',
      requirements: ['Valid job offer', 'Agency license verification', 'Contract review'],
    },
    {
      step: 2,
      title: 'Document Preparation',
      details: 'Gather all required documents for submission to DMW.',
      timeline: '1-2 weeks',
      requirements: ['Passport (6 months validity)', 'NBI Clearance', 'Medical certificate', 'Birth certificate', 'Employment certificates'],
    },
    {
      step: 3,
      title: 'Medical Examination',
      details: 'Complete medical exam at DMW-accredited clinic.',
      timeline: '3-5 days',
      requirements: ['Medical forms from agency', 'Recent photos', 'Payment (₱3,000-8,000)'],
    },
    {
      step: 4,
      title: 'Contract Verification',
      details: 'Submit employment contract to DMW for verification and approval.',
      timeline: '3-5 days',
      requirements: ['Original contract', 'Passport copy', 'Medical results', 'Verification fee'],
    },
    {
      step: 5,
      title: 'OWWA Membership',
      details: 'Register and pay OWWA membership fee (USD $25).',
      timeline: '1 day',
      requirements: ['Verified contract', 'Payment', 'Personal information'],
    },
    {
      step: 6,
      title: 'Pre-Departure Orientation Seminar (PDOS)',
      details: 'Attend mandatory seminar about rights, culture, and destination country.',
      timeline: '1 day',
      requirements: ['Verified contract', 'OWWA membership', 'Registration fee (₱500-1,000)'],
    },
    {
      step: 7,
      title: 'Secure OEC (Overseas Employment Certificate)',
      details: 'Final document needed before departure. Can be obtained online or at airport.',
      timeline: '1-3 days',
      requirements: ['Verified contract', 'OWWA membership', 'PDOS certificate', 'Plane ticket'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">POEA Processing Guide</h1>
          <p className="text-xl text-green-100">
            Step-by-step guide to DMW (formerly POEA) processing, requirements, and timelines
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              The Department of Migrant Workers (DMW), formerly known as POEA, handles the processing and
              deployment of Filipino workers abroad. This guide outlines the complete process from contract
              signing to deployment.
            </p>
          </div>

          <Card className="p-6 mb-12 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Clock className="text-blue-600" />
              Total Processing Time: 4-8 Weeks
            </h2>
            <p className="text-gray-700">
              Processing time varies depending on country requirements, medical results, and document completeness.
              Delays may occur if documents are incomplete or require additional verification.
            </p>
          </Card>

          <div className="space-y-8">
            {processingSteps.map((item) => (
              <Card key={item.step} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                        {item.timeline}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{item.details}</p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Requirements:</p>
                      <ul className="space-y-1">
                        {item.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 mt-12 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Reminders</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Only transact with DMW-licensed recruitment agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Never pay placement fees exceeding one month's salary</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Keep copies of all documents submitted</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Verify your contract before signing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Attend PDOS to learn about your rights and responsibilities</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your Application?</h2>
            <p className="text-gray-700 mb-6">
              Browse jobs from verified agencies or contact us for guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Browse Jobs
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
