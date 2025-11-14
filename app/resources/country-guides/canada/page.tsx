'use client';

import Link from 'next/link';
import { ArrowLeft, Globe, DollarSign, Home, Briefcase, Users, AlertCircle, CheckCircle, Phone, Snowflake, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function CanadaGuidePage() {
  const quickFacts = [
    { label: 'Capital', value: 'Ottawa', icon: Globe },
    { label: 'Currency', value: 'Canadian Dollar (CAD)', icon: DollarSign },
    { label: 'Languages', value: 'English & French', icon: Users },
    { label: 'Working Week', value: '40 hours (Monday to Friday)', icon: Briefcase },
  ];

  const immigrationPrograms = [
    {
      title: 'Express Entry',
      description: 'Points-based system for skilled workers. Fastest route to permanent residence.',
      duration: '6-12 months',
      requirements: ['Work experience', 'Language proficiency (IELTS)', 'Education credentials', 'Age under 45 preferred'],
      targetOccupations: 'IT, Engineering, Healthcare, Trades',
    },
    {
      title: 'Provincial Nominee Program (PNP)',
      description: 'Each province nominates candidates based on local labor needs.',
      duration: '12-18 months',
      requirements: ['Job offer from province (usually)', 'Work experience', 'Language skills', 'Connection to province'],
      targetOccupations: 'Varies by province - check provincial websites',
    },
    {
      title: 'Temporary Foreign Worker Program (TFWP)',
      description: 'Work permit for specific job with specific employer. Not permanent residence.',
      duration: '3-6 months processing',
      requirements: ['Valid job offer', 'LMIA (Labor Market Impact Assessment)', 'Work permit', 'No criminal record'],
      targetOccupations: 'Caregivers, Farm workers, Food services, Hospitality',
    },
    {
      title: 'Caregiver Programs',
      description: 'Dedicated programs for home childcare and healthcare support workers.',
      duration: '2-3 years, pathway to PR',
      requirements: ['1 year Canadian work experience', 'Language proficiency', 'Post-secondary education', 'Canadian work permit'],
      targetOccupations: 'Nannies, Home support workers, Healthcare aides',
    },
  ];

  const salaryRanges = [
    { position: 'Caregiver/Nanny', range: 'CAD 25,000 - 35,000/year', php: '₱91,000 - ₱128,000/month' },
    { position: 'Food Service Worker', range: 'CAD 28,000 - 35,000/year', php: '₱102,000 - ₱128,000/month' },
    { position: 'Retail Sales', range: 'CAD 30,000 - 40,000/year', php: '₱110,000 - ₱146,000/month' },
    { position: 'Administrative Assistant', range: 'CAD 35,000 - 50,000/year', php: '₱128,000 - ₱182,000/month' },
    { position: 'Registered Nurse', range: 'CAD 60,000 - 90,000/year', php: '₱219,000 - ₱328,000/month' },
    { position: 'Software Developer', range: 'CAD 65,000 - 110,000/year', php: '₱237,000 - ₱401,000/month' },
    { position: 'Engineer', range: 'CAD 70,000 - 100,000/year', php: '₱255,000 - ₱365,000/month' },
    { position: 'Accountant', range: 'CAD 50,000 - 75,000/year', php: '₱182,000 - ₱274,000/month' },
  ];

  const livingCosts = [
    { item: '1-Bedroom Apartment', cost: 'CAD 1,200 - 2,000/month', note: 'Toronto/Vancouver more expensive' },
    { item: 'Groceries (Monthly)', cost: 'CAD 300 - 500', note: 'Cooking at home essential' },
    { item: 'Public Transport Pass', cost: 'CAD 100 - 150/month', note: 'Excellent transit in major cities' },
    { item: 'Mobile Plan', cost: 'CAD 50 - 80/month', note: 'Plans more expensive than PH' },
    { item: 'Utilities', cost: 'CAD 100 - 200/month', note: 'Heating in winter adds cost' },
    { item: 'Healthcare', cost: 'Free/Subsidized', note: 'Provincial health insurance' },
  ];

  const benefitsAndRights = [
    'Universal healthcare (provincial health insurance)',
    'Minimum wage: CAD 15-17/hour (varies by province)',
    'Overtime pay: 1.5x after 40 hours/week',
    'Paid vacation: 2 weeks minimum per year',
    'Sick leave and personal days',
    'Employment Insurance (EI) for job loss',
    'Canada Pension Plan (CPP) for retirement',
    'Maternity/Parental leave: Up to 18 months',
    'Safe workplace standards and labor laws',
    'Right to unionize and collective bargaining',
  ];

  const culturalAdaptation = [
    {
      title: 'Weather',
      description: 'Harsh winters (-20°C to -40°C in some areas). Summer is mild (20-30°C). Invest in good winter clothing.',
      icon: Snowflake,
    },
    {
      title: 'Multiculturalism',
      description: 'Canada celebrates diversity. Filipino community is strong (850,000+ Filipinos in Canada).',
      icon: Users,
    },
    {
      title: 'Work Culture',
      description: 'Punctuality valued. Work-life balance respected. Direct communication style. Collaborative environment.',
      icon: Briefcase,
    },
    {
      title: 'Social Etiquette',
      description: 'Polite "please" and "thank you" always. Respect personal space. Tipping expected (15-20%) in restaurants.',
      icon: Heart,
    },
  ];

  const pathwayToPR = [
    {
      step: 1,
      title: 'Secure Work Permit',
      description: 'Get valid job offer and work permit through TFWP, PNP, or other programs.',
    },
    {
      step: 2,
      title: 'Gain Canadian Experience',
      description: 'Work in Canada for 1-2 years. Improve language skills. Build network.',
    },
    {
      step: 3,
      title: 'Apply for Permanent Residence',
      description: 'Through Express Entry, PNP, or Caregiver programs. Canadian experience adds points.',
    },
    {
      step: 4,
      title: 'Obtain PR Status',
      description: 'Receive Permanent Resident Card. Access to healthcare, education, most jobs.',
    },
    {
      step: 5,
      title: 'Apply for Citizenship',
      description: 'After 3 years as PR, apply for Canadian citizenship. Dual citizenship allowed.',
    },
  ];

  const importantTips = [
    'Start IELTS preparation early - language scores crucial for immigration',
    'Get Educational Credential Assessment (ECA) for foreign degrees',
    'Research provinces - each has different labor needs and costs',
    'Save emergency fund (CAD 5,000-10,000) before arrival',
    'Join Filipino-Canadian community groups for support',
    'Be patient - immigration process takes time but worth it',
    'Consider starting with temporary work permit, then apply for PR',
    'Winter preparation: Invest in good coat, boots, and winter gear',
  ];

  const provinces = [
    {
      name: 'Ontario (Toronto)',
      pros: 'Most opportunities, large Filipino community, diverse economy',
      cons: 'Expensive housing, competitive job market',
    },
    {
      name: 'British Columbia (Vancouver)',
      pros: 'Mild weather, beautiful nature, growing economy',
      cons: 'Very expensive housing, high cost of living',
    },
    {
      name: 'Alberta (Calgary, Edmonton)',
      pros: 'Strong economy, lower taxes, lower cost of living',
      cons: 'Cold winters, oil-dependent economy',
    },
    {
      name: 'Manitoba (Winnipeg)',
      pros: 'Affordable, active PNP, growing Filipino community',
      cons: 'Extremely cold winters, smaller job market',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Working in Canada</h1>
          <p className="text-xl text-red-100">
            Immigration programs, work permits, and opportunities for Filipino workers in Canada
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
                  <Icon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">{fact.label}</p>
                  <p className="font-semibold text-gray-900 text-sm">{fact.value}</p>
                </Card>
              );
            })}
          </div>

          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Canada is a top destination for Filipinos seeking permanent residence and quality of life. Unlike temporary
              work in the Middle East, Canada offers pathways to permanent residence, citizenship, and family reunification.
              With over 850,000 Filipinos already in Canada and strong immigration programs, opportunities are abundant for
              skilled workers, caregivers, and professionals.
            </p>
          </div>

          {/* Immigration Programs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Immigration Programs for Filipinos</h2>
            <div className="space-y-6">
              {immigrationPrograms.map((program, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {program.duration}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{program.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Requirements:</p>
                      <ul className="space-y-1">
                        {program.requirements.map((req, reqIdx) => (
                          <li key={reqIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Target Occupations:</p>
                      <p className="text-sm text-gray-700">{program.targetOccupations}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Pathway to PR */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pathway to Permanent Residence & Citizenship</h2>
            <div className="space-y-4">
              {pathwayToPR.map((item) => (
                <Card key={item.step} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Salary Expectations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="text-red-600" size={32} />
              Salary Expectations
            </h2>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">
                Canadian salaries are subject to income tax (15-30% depending on income). However, benefits like healthcare,
                pension, and employment insurance are included. Exchange rate: 1 CAD ≈ ₱36.5 (rates fluctuate)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Annual Salary (CAD)</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Monthly (PHP)</th>
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
                * After tax deductions (20-25%), take-home pay is lower but includes healthcare and pension benefits.
              </p>
            </Card>
          </div>

          {/* Cost of Living */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Home className="text-red-600" size={32} />
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
                    <p className="font-semibold text-red-600 ml-4 whitespace-nowrap">{cost.cost}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-6 p-4 bg-red-50 rounded-lg">
                <strong>Note:</strong> Living costs vary significantly by province. Toronto and Vancouver are most expensive.
                Smaller cities and Prairie provinces (Manitoba, Saskatchewan) are more affordable.
              </p>
            </Card>
          </div>

          {/* Comparing Provinces */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Comparing Popular Provinces</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {provinces.map((province, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{province.name}</h3>
                  <div className="space-y-2">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">Pros:</p>
                      <p className="text-sm text-gray-700">{province.pros}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">Cons:</p>
                      <p className="text-sm text-gray-700">{province.cons}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits and Rights */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Employee Benefits & Rights</h2>
            <Card className="p-6 bg-green-50 border-green-200">
              <p className="text-gray-700 mb-4">
                Canada has strong labor laws and worker protections. All employees, including temporary foreign workers, are entitled to:
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                {benefitsAndRights.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Cultural Adaptation */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cultural Adaptation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {culturalAdaptation.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <Card key={idx} className="p-6">
                    <Icon className="w-8 h-8 text-red-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-700">{tip.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Important Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Tips for Success</h2>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <ul className="space-y-3">
                {importantTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Resources */}
          <Card className="p-8 mb-8 bg-red-50 border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Phone className="text-red-600" />
              Helpful Resources
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">Immigration, Refugees and Citizenship Canada (IRCC)</h3>
                <p className="text-sm text-gray-700">Website: www.canada.ca/en/immigration-refugees-citizenship.html</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Philippine Embassy in Canada</h3>
                <p className="text-sm text-gray-700">Ottawa: +1-613-233-1121 | Email: ottawapc@gmail.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Job Bank Canada</h3>
                <p className="text-sm text-gray-700">Website: www.jobbank.gc.ca</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Settlement Services</h3>
                <p className="text-sm text-gray-700">Free settlement support for newcomers in all provinces</p>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Canadian Dream</h2>
            <p className="text-gray-700 mb-6">
              Browse jobs with Canadian employers or get guidance on immigration pathways
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                Contact Support
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
