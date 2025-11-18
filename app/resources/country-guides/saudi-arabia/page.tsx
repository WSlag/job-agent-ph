'use client';

import Link from 'next/link';
import { ArrowLeft, Globe, DollarSign, Home, Briefcase, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function SaudiArabiaGuidePage() {
  const quickFacts = [
    { label: 'Capital', value: 'Riyadh', icon: Globe },
    { label: 'Currency', value: 'Saudi Riyal (SAR)', icon: DollarSign },
    { label: 'Language', value: 'Arabic (English widely used)', icon: Users },
    { label: 'Working Week', value: 'Sunday to Thursday', icon: Briefcase },
  ];

  const salaryRanges = [
    { position: 'Domestic Worker', range: 'SAR 1,200 - 1,500', php: '₱17,000 - ₱21,000' },
    { position: 'Factory Worker', range: 'SAR 1,500 - 2,000', php: '₱21,000 - ₱28,000' },
    { position: 'Sales Staff', range: 'SAR 2,000 - 3,000', php: '₱28,000 - ₱42,000' },
    { position: 'Driver', range: 'SAR 1,800 - 2,500', php: '₱25,000 - ₱35,000' },
    { position: 'Nurse', range: 'SAR 4,000 - 7,000', php: '₱56,000 - ₱98,000' },
    { position: 'Engineer', range: 'SAR 6,000 - 12,000', php: '₱84,000 - ₱168,000' },
    { position: 'IT Professional', range: 'SAR 8,000 - 15,000', php: '₱112,000 - ₱210,000' },
  ];

  const culturalTips = [
    {
      title: 'Dress Code',
      description: 'Conservative dress is mandatory. Women must wear abaya in public. Men should wear long pants and avoid sleeveless shirts.',
      icon: Users,
    },
    {
      title: 'Prayer Times',
      description: 'All businesses close during the five daily prayer times (15-30 minutes each). Plan your activities accordingly.',
      icon: AlertCircle,
    },
    {
      title: 'Ramadan',
      description: 'No eating, drinking, or smoking in public during fasting hours (sunrise to sunset). Work hours are reduced.',
      icon: Globe,
    },
    {
      title: 'Gender Segregation',
      description: 'Separate facilities for men and women in many public places. Respect local customs regarding gender interaction.',
      icon: Users,
    },
  ];

  const workingConditions = [
    'Standard work week: 48 hours (8 hours/day)',
    'Overtime: 1.5x normal rate for extra hours',
    'Annual leave: 21-30 days depending on contract',
    'Sick leave: 30 days full pay, 60 days half pay annually',
    'End-of-service benefit: Half month salary per year (first 5 years), 1 month salary per year (after 5 years)',
    'Housing usually provided by employer',
    'Medical insurance required by law',
  ];

  const importantDos = [
    'Carry your Iqama (residence permit) at all times',
    'Respect Islamic customs and traditions',
    'Learn basic Arabic phrases',
    'Save a portion of your salary regularly',
    'Keep copies of all important documents',
    'Register with Philippine Embassy upon arrival',
    'Understand your contract before signing',
    'Use official channels for remittances',
  ];

  const importantDonts = [
    'Don\'t consume alcohol (strictly prohibited)',
    'Don\'t bring prohibited items (pork, alcohol, religious materials)',
    'Don\'t take photos of government buildings or military installations',
    'Don\'t engage in public displays of affection',
    'Don\'t criticize the government or royal family',
    'Don\'t enter mosques unless permitted',
    'Don\'t eat/drink/smoke in public during Ramadan fasting hours',
    'Don\'t use left hand for eating or greeting',
  ];

  const requiredDocuments = [
    'Valid passport (minimum 6 months validity)',
    'Saudi work visa',
    'Authenticated employment contract',
    'Medical certificate from GAMCA-accredited clinic',
    'NBI clearance',
    'Birth certificate (PSA)',
    'Marriage certificate (if applicable)',
    'Educational certificates (authenticated)',
    'Professional licenses (if applicable)',
    'OEC (Overseas Employment Certificate)',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Working in Saudi Arabia</h1>
          <p className="text-xl text-green-100">
            Comprehensive guide about culture, work environment, salary expectations, and tips for working in KSA
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Facts */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {quickFacts.map((fact, idx) => {
              const Icon = fact.icon;
              return (
                <Card key={idx} className="p-4 text-center">
                  <Icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">{fact.label}</p>
                  <p className="font-semibold text-gray-900">{fact.value}</p>
                </Card>
              );
            })}
          </div>

          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Saudi Arabia is one of the top destinations for Filipino workers, with over 1 million OFWs currently
              employed in various sectors. The Kingdom offers competitive salaries, tax-free income, and opportunities
              for career growth. Understanding the culture, laws, and working conditions is essential for a successful
              experience.
            </p>
          </div>

          {/* Salary Expectations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="text-green-600" size={32} />
              Salary Expectations
            </h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                Salaries in Saudi Arabia are tax-free and usually include housing, transportation, and medical benefits.
                Exchange rate: 1 SAR ≈ ₱14-15 (rates fluctuate)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly Salary (SAR)</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Approx. PHP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRanges.map((job, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">{job.position}</td>
                        <td className="py-3 px-4 text-gray-700">{job.range}</td>
                        <td className="py-3 px-4 text-gray-700">{job.php}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Salaries vary based on company, experience, qualifications, and negotiation. These are approximate ranges.
              </p>
            </Card>
          </div>

          {/* Working Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Briefcase className="text-green-600" size={32} />
              Working Conditions & Benefits
            </h2>
            <Card className="p-6">
              <ul className="space-y-3">
                {workingConditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{condition}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Cultural Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cultural Tips & Customs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {culturalTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <Card key={idx} className="p-6">
                    <Icon className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-700">{tip.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Do's and Don'ts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" />
                  Do's
                </h3>
                <ul className="space-y-2">
                  {importantDos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Don'ts */}
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-600" />
                  Don'ts
                </h3>
                <ul className="space-y-2">
                  {importantDonts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Required Documents */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Required Documents</h2>
            <Card className="p-6">
              <ul className="grid md:grid-cols-2 gap-3">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Work in Saudi Arabia?</h2>
            <p className="text-gray-700 mb-6">
              Browse available jobs from verified agencies or learn more about the deployment process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/resources/guides/poea-processing" className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                POEA Processing Guide
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
