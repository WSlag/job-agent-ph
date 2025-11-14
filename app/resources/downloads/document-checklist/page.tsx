'use client';

import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle, FileText, AlertTriangle, Printer } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { useState } from 'react';

export default function DocumentChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const documents = [
    {
      category: 'Personal Documents',
      items: [
        {
          id: 'passport',
          name: 'Passport',
          details: 'Valid for at least 6 months from deployment date',
          copies: '3 photocopies',
          notes: 'Check expiry date. Apply for renewal if needed (45 days processing)',
        },
        {
          id: 'birth-cert',
          name: 'Birth Certificate (PSA)',
          details: 'Original PSA-issued copy',
          copies: '3 certified copies',
          notes: 'Must be PSA copy (not NSO or local civil registry)',
        },
        {
          id: 'nbi-clearance',
          name: 'NBI Clearance',
          details: 'Valid NBI clearance',
          copies: '2 photocopies',
          notes: 'Valid for 6 months. Apply online at nbi-clearance.com',
        },
        {
          id: 'police-clearance',
          name: 'Police Clearance',
          details: 'From local police station',
          copies: '2 photocopies',
          notes: 'Valid for 6 months',
        },
        {
          id: 'valid-id',
          name: 'Valid IDs',
          details: 'At least 2 government-issued IDs',
          copies: '3 photocopies of each',
          notes: 'UMID, Driver\'s License, Postal ID, SSS ID, etc.',
        },
      ],
    },
    {
      category: 'Civil Status Documents',
      items: [
        {
          id: 'marriage-cert',
          name: 'Marriage Certificate (if married)',
          details: 'PSA-issued marriage certificate',
          copies: '3 certified copies',
          notes: 'Required for married applicants',
        },
        {
          id: 'spouse-consent',
          name: 'Spouse Consent (if married)',
          details: 'Notarized spousal consent letter',
          copies: '2 photocopies',
          notes: 'Template provided by agency',
        },
        {
          id: 'birth-cert-children',
          name: 'Children\'s Birth Certificates (if applicable)',
          details: 'PSA copy for each child',
          copies: '2 copies each',
          notes: 'For beneficiary purposes',
        },
      ],
    },
    {
      category: 'Educational Documents',
      items: [
        {
          id: 'diploma',
          name: 'Diploma',
          details: 'Original or certified true copy',
          copies: '3 photocopies',
          notes: 'High school or college diploma',
        },
        {
          id: 'transcript',
          name: 'Transcript of Records',
          details: 'Official transcript',
          copies: '3 photocopies',
          notes: 'For professional positions',
        },
        {
          id: 'certifications',
          name: 'Training Certificates',
          details: 'TESDA, NCII, or other certificates',
          copies: '3 photocopies',
          notes: 'For skilled workers (e.g., caregiver, welder)',
        },
      ],
    },
    {
      category: 'Professional Documents',
      items: [
        {
          id: 'prc-license',
          name: 'PRC License (if applicable)',
          details: 'Valid professional license',
          copies: '3 photocopies',
          notes: 'For nurses, engineers, etc. Must be updated',
        },
        {
          id: 'employment-cert',
          name: 'Employment Certificates',
          details: 'Certificate from previous employers',
          copies: '3 photocopies each',
          notes: 'Include job description and duration',
        },
        {
          id: 'resume',
          name: 'Resume/CV',
          details: 'Updated comprehensive CV',
          copies: '5 copies',
          notes: 'Tailor to job applied for',
        },
      ],
    },
    {
      category: 'Medical Documents',
      items: [
        {
          id: 'medical-cert',
          name: 'Medical Certificate',
          details: 'From DMW/POEA-accredited clinic',
          copies: 'Original + 2 copies',
          notes: 'Valid for 6 months. Schedule after job offer',
        },
        {
          id: 'chest-xray',
          name: 'Chest X-Ray',
          details: 'Digital copy from accredited facility',
          copies: '1 CD + report',
          notes: 'Part of medical exam',
        },
        {
          id: 'vaccination',
          name: 'Vaccination Records (if required)',
          details: 'COVID-19, Yellow Fever, etc.',
          copies: '2 photocopies',
          notes: 'Depends on destination country',
        },
      ],
    },
    {
      category: 'Employment Documents',
      items: [
        {
          id: 'job-offer',
          name: 'Job Offer/Contract',
          details: 'Signed employment contract',
          copies: 'Original + 3 copies',
          notes: 'Review thoroughly before signing',
        },
        {
          id: 'visa',
          name: 'Work Visa',
          details: 'Valid work visa for destination country',
          copies: '2 photocopies',
          notes: 'Processed by agency/employer',
        },
        {
          id: 'oec',
          name: 'OEC (Overseas Employment Certificate)',
          details: 'From DMW/POEA',
          copies: '1 original',
          notes: 'Obtained after contract verification',
        },
        {
          id: 'pdos',
          name: 'PDOS Certificate',
          details: 'Pre-Departure Orientation Seminar certificate',
          copies: '1 original',
          notes: 'Mandatory before OEC',
        },
        {
          id: 'owwa',
          name: 'OWWA Membership',
          details: 'Receipt of payment (USD $25)',
          copies: '2 photocopies',
          notes: 'Valid for 2 years',
        },
      ],
    },
    {
      category: 'Financial Documents',
      items: [
        {
          id: 'sss',
          name: 'SSS E-6 Form',
          details: 'For SSS coverage abroad',
          copies: '1 original',
          notes: 'From SSS office',
        },
        {
          id: 'pag-ibig',
          name: 'Pag-IBIG MDF',
          details: 'Member Data Form',
          copies: '1 original',
          notes: 'Update info before leaving',
        },
        {
          id: 'philhealth',
          name: 'PhilHealth MDR',
          details: 'Member Data Record',
          copies: '1 original',
          notes: 'Ensure active membership',
        },
      ],
    },
    {
      category: 'Travel Documents',
      items: [
        {
          id: 'tickets',
          name: 'Plane Tickets',
          details: 'E-ticket or confirmed booking',
          copies: '2 printed copies',
          notes: 'Usually provided by employer',
        },
        {
          id: 'travel-insurance',
          name: 'Travel Insurance',
          details: 'Coverage for deployment',
          copies: '1 original policy',
          notes: 'Some agencies provide this',
        },
      ],
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const totalItems = documents.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20 mt-16 print:hidden">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">OFW Document Checklist</h1>
          <p className="text-xl text-orange-100">
            Complete downloadable checklist of all documents needed for overseas employment
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <Card className="p-6 mb-8 print:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <span className="text-2xl font-bold text-orange-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-orange-600 to-amber-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {checkedCount} of {totalItems} documents completed
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <Printer size={20} />
              Print Checklist
            </button>
            <button
              onClick={() => setCheckedItems(new Set())}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Reset Progress
            </button>
          </div>

          {/* Important Notes */}
          <Card className="p-6 mb-8 bg-yellow-50 border-yellow-200">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <AlertTriangle className="text-yellow-600" />
              Important Reminders
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                Requirements vary by destination country and job position - confirm with your agency
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                Start gathering documents early - some take weeks to process
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                All PSA documents must be original (red ribbon security features)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                Keep photocopies for yourself before submitting originals
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                Check document validity dates - many expire after 6 months
              </li>
            </ul>
          </Card>

          {/* Document Checklist */}
          <div className="space-y-8">
            {documents.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FileText className="text-orange-600" size={28} />
                  {category.category}
                </h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item) => {
                      const isChecked = checkedItems.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-green-50 border-green-300'
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                          onClick={() => toggleCheck(item.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                  isChecked
                                    ? 'bg-green-600 border-green-600'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isChecked && <CheckCircle className="w-5 h-5 text-white" />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-700 mb-1">{item.details}</p>
                              <p className="text-sm text-orange-600 font-medium mb-2">
                                Required: {item.copies}
                              </p>
                              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                <strong>Note:</strong> {item.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Processing Timeline */}
          <Card className="p-8 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Processing Timeline</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Passport</h3>
                <p className="text-sm text-gray-700">Regular: 12-15 business days</p>
                <p className="text-sm text-gray-700">Expedited: 6 business days</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">NBI Clearance</h3>
                <p className="text-sm text-gray-700">With no hit: Same day</p>
                <p className="text-sm text-gray-700">With hit: 1-3 weeks</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">PSA Documents</h3>
                <p className="text-sm text-gray-700">Online: 3-7 business days</p>
                <p className="text-sm text-gray-700">Walk-in: Same day to 3 days</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Medical Exam</h3>
                <p className="text-sm text-gray-700">Results: 3-5 business days</p>
                <p className="text-sm text-gray-700">Valid for 6 months</p>
              </div>
            </div>
          </Card>

          {/* Where to Get Documents */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to Get Documents</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">PSA Documents (Birth, Marriage)</p>
                  <p className="text-gray-700">Online: psahelpline.ph | Walk-in: Any PSA Serbilis outlet or SM Business Center</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">NBI Clearance</p>
                  <p className="text-gray-700">Online: clearance.nbi.gov.ph | Walk-in: Any NBI branch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Passport</p>
                  <p className="text-gray-700">Online appointment: passport.gov.ph | DFA offices nationwide</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Medical Exam</p>
                  <p className="text-gray-700">DMW-accredited clinics only (list provided by agency)</p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-center print:hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
            <p className="text-gray-700 mb-6">
              Read our comprehensive guides or get in touch with support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resources/guides/poea-processing" className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                POEA Processing Guide
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Contact Support
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">OFW Document Checklist</h1>
        <p className="text-gray-700">Complete checklist of all documents needed for overseas employment</p>
        <p className="text-sm text-gray-600 mt-2">Downloaded from: Job Agent PH (www.jobagentph.com)</p>
      </div>
    </div>
  );
}
