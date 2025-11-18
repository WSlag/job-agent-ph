'use client';

import Link from 'next/link';
import { ArrowLeft, Globe, DollarSign, Home, Briefcase, Users, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function UAEGuidePage() {
  const quickFacts = [
    { label: 'Main Cities', value: 'Dubai, Abu Dhabi, Sharjah', icon: MapPin },
    { label: 'Currency', value: 'UAE Dirham (AED)', icon: DollarSign },
    { label: 'Language', value: 'Arabic (English widely used)', icon: Users },
    { label: 'Working Week', value: 'Monday to Friday (most companies)', icon: Briefcase },
  ];

  const salaryRanges = [
    { position: 'Domestic Worker', range: 'AED 1,200 - 1,800', php: '₱18,000 - ₱27,000' },
    { position: 'Retail Sales', range: 'AED 2,000 - 3,500', php: '₱30,000 - ₱52,000' },
    { position: 'Customer Service', range: 'AED 3,000 - 5,000', php: '₱45,000 - ₱75,000' },
    { position: 'Restaurant Staff', range: 'AED 1,800 - 3,000', php: '₱27,000 - ₱45,000' },
    { position: 'Nurse', range: 'AED 5,000 - 10,000', php: '₱75,000 - ₱150,000' },
    { position: 'Engineer', range: 'AED 8,000 - 18,000', php: '₱120,000 - ₱270,000' },
    { position: 'IT Professional', range: 'AED 10,000 - 25,000', php: '₱150,000 - ₱375,000' },
    { position: 'Marketing Manager', range: 'AED 12,000 - 30,000', php: '₱180,000 - ₱450,000' },
  ];

  const livingCosts = [
    { item: 'Studio Apartment (Shared)', cost: 'AED 1,500 - 2,500/month', note: 'Usually provided by employer' },
    { item: 'Meal at Restaurant', cost: 'AED 25 - 50', note: 'Food courts cheaper (AED 15-25)' },
    { item: 'Groceries (Monthly)', cost: 'AED 500 - 800', note: 'Cooking at home saves money' },
    { item: 'Metro/Bus Pass', cost: 'AED 100 - 300/month', note: 'Excellent public transport' },
    { item: 'Mobile Plan', cost: 'AED 50 - 150/month', note: 'Good network coverage' },
    { item: 'Utilities (if not included)', cost: 'AED 300 - 600/month', note: 'AC expensive in summer' },
  ];

  const workingConditions = [
    'Standard work week: 48 hours (8 hours/day, 6 days) or 40 hours (5 days)',
    'Overtime: 1.25x normal rate, 1.5x after 10 PM',
    'Annual leave: 30 days per year (after 1 year)',
    'Sick leave: 90 days per year (full pay for first 15 days)',
    'End-of-service gratuity: 21 days salary per year (first 5 years), 30 days per year (after 5 years)',
    'Public holidays: 10-12 days per year (paid)',
    'Maternity leave: 60 days (45 days full pay)',
  ];

  const culturalTips = [
    {
      title: 'Dress Code',
      description: 'More relaxed than other Gulf countries, but still conservative. Cover shoulders and knees in public. Beach resorts have relaxed dress codes.',
      icon: Users,
    },
    {
      title: 'Ramadan',
      description: 'No eating/drinking/smoking in public during fasting hours. Work hours reduced by 2 hours. Many restaurants remain closed during the day.',
      icon: Globe,
    },
    {
      title: 'Multicultural Society',
      description: 'UAE is very diverse with over 200 nationalities. Tolerance and respect for all cultures is valued.',
      icon: Users,
    },
    {
      title: 'Friday is Holy Day',
      description: 'Many businesses closed or have reduced hours on Friday morning for Jumma prayers.',
      icon: AlertCircle,
    },
  ];

  const prosAndCons = {
    pros: [
      'Tax-free income (no personal income tax)',
      'Modern infrastructure and excellent facilities',
      'Safe and secure environment',
      'Diverse, multicultural society',
      'Excellent public transportation (especially Dubai)',
      'High quality healthcare and education',
      'Strategic location - easy travel to Asia, Europe, Africa',
      'Year-round sunshine and beach lifestyle',
    ],
    cons: [
      'High cost of living, especially rent',
      'Extreme heat in summer (40-50°C)',
      'Competitive job market',
      'Residence tied to employment (lose job = lose visa)',
      'Some jobs require 6-day work weeks',
      'Distance from family in Philippines',
      'Alcohol expensive and restricted',
      'Cultural adjustment needed',
    ],
  };

  const requiredDocuments = [
    'Valid passport (minimum 6 months validity)',
    'UAE work visa (sponsored by employer)',
    'Authenticated employment contract',
    'Medical fitness certificate',
    'Emirates ID (obtained after arrival)',
    'NBI clearance',
    'Birth certificate (PSA)',
    'Marriage certificate (if applicable)',
    'Educational certificates (attested by UAE Embassy)',
    'Professional licenses (if applicable)',
    'OEC (Overseas Employment Certificate)',
  ];

  const importantTips = [
    {
      title: 'Labor Law Protection',
      description: 'UAE has strong labor laws. All employees must have written contracts. Know your rights and don\'t hesitate to file complaints with Ministry of Human Resources.',
      type: 'success',
    },
    {
      title: 'Saving Money',
      description: 'Despite high salaries, cost of living is high. Create a budget, cook at home, use public transport, and send remittances regularly.',
      type: 'info',
    },
    {
      title: 'Visa Rules',
      description: 'Your residence visa is tied to your employer. If you change jobs, you need new visa. Overstaying visa results in fines (AED 25-100 per day).',
      type: 'warning',
    },
  ];

  const emiratesComparison = [
    {
      emirate: 'Dubai',
      description: 'Most international, fast-paced lifestyle, highest salaries but also highest cost of living.',
      bestFor: 'Career growth, hospitality, retail, finance',
    },
    {
      emirate: 'Abu Dhabi',
      description: 'Capital city, more traditional, competitive salaries, slightly lower cost of living than Dubai.',
      bestFor: 'Government jobs, oil & gas, healthcare, education',
    },
    {
      emirate: 'Sharjah',
      description: 'More conservative, significantly cheaper than Dubai (30-40% lower rent), good public services.',
      bestFor: 'Budget-conscious workers, education, manufacturing',
    },
    {
      emirate: 'Ajman',
      description: 'Smallest and most affordable, quieter lifestyle, many workers live here and commute to Dubai.',
      bestFor: 'Low-cost living, small businesses',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Working in UAE</h1>
          <p className="text-xl text-blue-100">
            Comprehensive guide about living and working in Dubai, Abu Dhabi, and other Emirates
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
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">{fact.label}</p>
                  <p className="font-semibold text-gray-900 text-sm">{fact.value}</p>
                </Card>
              );
            })}
          </div>

          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              The United Arab Emirates (UAE) is a premier destination for Filipino workers, offering tax-free salaries,
              modern infrastructure, and diverse opportunities. With over 700,000 OFWs in the UAE, Filipinos are valued
              for their professionalism, English skills, and work ethic. The UAE combines traditional Arabic culture
              with modern cosmopolitan lifestyle.
            </p>
          </div>

          {/* Salary Expectations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="text-blue-600" size={32} />
              Salary Expectations
            </h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                UAE salaries are tax-free and competitive. Housing allowance often included or provided.
                Exchange rate: 1 AED ≈ ₱15 (rates fluctuate)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly Salary (AED)</th>
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
                * Salaries vary by emirate, company, experience, and qualifications. Dubai and Abu Dhabi pay higher than other emirates.
              </p>
            </Card>
          </div>

          {/* Cost of Living */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Home className="text-blue-600" size={32} />
              Cost of Living
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                {livingCosts.map((cost, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cost.item}</p>
                      <p className="text-sm text-gray-600">{cost.note}</p>
                    </div>
                    <p className="font-semibold text-blue-600 ml-4 whitespace-nowrap">{cost.cost}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-6 p-4 bg-blue-50 rounded-lg">
                <strong>Tip:</strong> Most employers provide accommodation or housing allowance. Food and transport are your main expenses.
                Budget wisely and aim to save 30-40% of your salary.
              </p>
            </Card>
          </div>

          {/* Emirates Comparison */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Comparing the Emirates</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {emiratesComparison.map((emirate, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{emirate.emirate}</h3>
                  <p className="text-gray-700 mb-3">{emirate.description}</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">Best For:</p>
                    <p className="text-sm text-gray-700">{emirate.bestFor}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Working Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Briefcase className="text-blue-600" size={32} />
              Working Conditions & Benefits
            </h2>
            <Card className="p-6">
              <ul className="space-y-3">
                {workingConditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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
                    <Icon className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-700">{tip.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pros and Cons of Working in UAE</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" />
                  Advantages
                </h3>
                <ul className="space-y-2">
                  {prosAndCons.pros.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Cons */}
              <Card className="p-6 bg-orange-50 border-orange-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-orange-600" />
                  Challenges
                </h3>
                <ul className="space-y-2">
                  {prosAndCons.cons.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Important Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Tips</h2>
            <div className="space-y-4">
              {importantTips.map((tip, idx) => (
                <Card
                  key={idx}
                  className={`p-6 ${
                    tip.type === 'success' ? 'bg-green-50 border-green-200' :
                    tip.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-700">{tip.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Required Documents</h2>
            <Card className="p-6">
              <ul className="grid md:grid-cols-2 gap-3">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Work in UAE?</h2>
            <p className="text-gray-700 mb-6">
              Browse available jobs from verified agencies or learn more about the deployment process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/resources/guides/poea-processing" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                POEA Processing Guide
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
