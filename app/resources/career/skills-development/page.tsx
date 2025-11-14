'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, Award, Globe, DollarSign, CheckCircle, ExternalLink, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function SkillsDevelopmentPage() {
  const freeOnlineCourses = [
    {
      platform: 'Coursera',
      description: 'University-level courses from top institutions. Many courses are free to audit.',
      courses: ['Data Science', 'Business English', 'Digital Marketing', 'IT Support'],
      link: 'https://www.coursera.org',
      cost: 'Free to audit, certificate costs $30-$50',
    },
    {
      platform: 'edX',
      description: 'Courses from Harvard, MIT, and other top universities.',
      courses: ['Computer Science', 'Healthcare', 'Business Management', 'Language Learning'],
      link: 'https://www.edx.org',
      cost: 'Free to audit, verified certificate $50-$300',
    },
    {
      platform: 'Khan Academy',
      description: 'Completely free courses on various subjects.',
      courses: ['Mathematics', 'Economics', 'Computing', 'Test Prep (SAT, GMAT)'],
      link: 'https://www.khanacademy.org',
      cost: 'Completely free',
    },
    {
      platform: 'Google Digital Garage',
      description: 'Free training from Google on digital skills.',
      courses: ['Digital Marketing', 'Career Development', 'Data & Tech'],
      link: 'https://learndigital.withgoogle.com',
      cost: 'Completely free with certificate',
    },
    {
      platform: 'Microsoft Learn',
      description: 'Free Microsoft technology training.',
      courses: ['Azure', 'Office 365', 'Power BI', 'AI & Machine Learning'],
      link: 'https://learn.microsoft.com',
      cost: 'Completely free, certification exam separate',
    },
  ];

  const tesdaCourses = [
    {
      category: 'Healthcare',
      courses: [
        'Caregiving NC II',
        'Massage Therapy NC II',
        'First Aid',
        'Health Care Services NC II',
      ],
      jobsAvailable: 'Caregiver, Healthcare Aide, Massage Therapist',
      avgSalary: '₱15,000-₱25,000 (PH) | $400-$800 (abroad)',
    },
    {
      category: 'Construction & Trades',
      courses: [
        'Plumbing NC II',
        'Electrical Installation & Maintenance NC II',
        'Carpentry NC II',
        'Welding NC I & II',
        'Masonry NC II',
      ],
      jobsAvailable: 'Skilled Worker in Middle East, Construction Projects',
      avgSalary: '₱20,000-₱35,000 (PH) | $600-$1,200 (abroad)',
    },
    {
      category: 'Hospitality & Tourism',
      courses: [
        'Housekeeping NC II',
        'Food & Beverage Service NC II',
        'Commercial Cooking NC II',
        'Front Office Service NC II',
      ],
      jobsAvailable: 'Hotel Staff, Restaurant Worker, Cruise Ship',
      avgSalary: '₱15,000-₱25,000 (PH) | $500-$1,000 (abroad)',
    },
    {
      category: 'IT & Technology',
      courses: [
        'Computer Systems Servicing NC II',
        'Contact Center Services NC II',
        'Animation NC II',
        'Programming NC IV',
      ],
      jobsAvailable: 'IT Support, BPO, Software Developer',
      avgSalary: '₱18,000-₱40,000 (PH) | $800-$2,000 (abroad)',
    },
    {
      category: 'Automotive',
      courses: [
        'Automotive Servicing NC I & II',
        'Driving NC II',
        'Heavy Equipment Operation NC II',
      ],
      jobsAvailable: 'Mechanic, Driver, Heavy Equipment Operator',
      avgSalary: '₱18,000-₱30,000 (PH) | $500-$1,000 (abroad)',
    },
  ];

  const languageLearning = [
    {
      language: 'English',
      importance: 'Essential for most international jobs',
      resources: [
        'Duolingo (free app)',
        'BBC Learning English (free)',
        'IELTS preparation courses (Coursera, edX)',
        'English Central (video-based learning)',
      ],
      certifications: 'IELTS, TOEFL, Cambridge English',
    },
    {
      language: 'Arabic',
      importance: 'Valuable for Middle East positions',
      resources: [
        'Duolingo Arabic',
        'ArabicPod101',
        'Mango Languages (check if library offers free access)',
        'YouTube channels (Learn Arabic with Maha)',
      ],
      certifications: 'ALPT (Arabic Language Proficiency Test)',
    },
    {
      language: 'Mandarin Chinese',
      importance: 'Growing demand in Asia, business',
      resources: [
        'HelloChinese (app)',
        'Coursera Chinese courses',
        'ChinesePod',
        'Confucius Institute (may offer free classes)',
      ],
      certifications: 'HSK (Chinese Proficiency Test)',
    },
    {
      language: 'Japanese',
      importance: 'Useful for Japan, high-paying opportunities',
      resources: [
        'Duolingo Japanese',
        'NHK World Easy Japanese',
        'JapanesePod101',
        'JLPT (Japanese Language Proficiency Test) prep',
      ],
      certifications: 'JLPT N5-N1',
    },
  ];

  const professionalCertifications = [
    {
      field: 'Nursing & Healthcare',
      certs: [
        { name: 'BLS (Basic Life Support)', provider: 'American Heart Association', cost: '₱2,000-₱3,000' },
        { name: 'ACLS (Advanced Cardiac Life Support)', provider: 'American Heart Association', cost: '₱8,000-₱12,000' },
        { name: 'PALS (Pediatric Advanced Life Support)', provider: 'American Heart Association', cost: '₱8,000-₱12,000' },
        { name: 'Critical Care Nursing Course', provider: 'Various', cost: '₱15,000-₱30,000' },
      ],
    },
    {
      field: 'IT & Technology',
      certs: [
        { name: 'CompTIA A+', provider: 'CompTIA', cost: '$239 (₱13,000)' },
        { name: 'Google IT Support Certificate', provider: 'Coursera/Google', cost: '$49/month (₱2,700)' },
        { name: 'AWS Certified Cloud Practitioner', provider: 'Amazon', cost: '$100 (₱5,500)' },
        { name: 'Microsoft Azure Fundamentals', provider: 'Microsoft', cost: '$99 (₱5,400)' },
      ],
    },
    {
      field: 'Project Management',
      certs: [
        { name: 'CAPM (Certified Associate in Project Management)', provider: 'PMI', cost: '$225 (₱12,000)' },
        { name: 'PMP (Project Management Professional)', provider: 'PMI', cost: '$405 (₱22,000)' },
        { name: 'Google Project Management Certificate', provider: 'Coursera/Google', cost: '$49/month (₱2,700)' },
      ],
    },
    {
      field: 'Business & Finance',
      certs: [
        { name: 'QuickBooks Certified User', provider: 'Certiport', cost: '$95 (₱5,200)' },
        { name: 'Google Digital Marketing Certificate', provider: 'Google', cost: 'Free' },
        { name: 'CPA (Certified Public Accountant)', provider: 'PRC', cost: '₱15,000-₱30,000' },
      ],
    },
  ];

  const skillsByDemand = [
    {
      skill: 'Digital Marketing',
      demand: 'Very High',
      whyValuable: 'Every business needs online presence. Remote work friendly.',
      howToLearn: 'Google Digital Garage (free), HubSpot Academy (free), Coursera',
      salary: '₱25,000-₱60,000 (PH) | $1,500-$4,000 (abroad)',
    },
    {
      skill: 'Data Analysis',
      demand: 'Very High',
      whyValuable: 'Data-driven decisions critical for businesses. High-paying.',
      howToLearn: 'Google Data Analytics Certificate (Coursera), Excel mastery, SQL',
      salary: '₱30,000-₱80,000 (PH) | $2,000-$6,000 (abroad)',
    },
    {
      skill: 'Software Development',
      demand: 'Extremely High',
      whyValuable: 'Tech industry growing globally. Remote work common.',
      howToLearn: 'FreeCodeCamp, Codecademy, CS50 (Harvard), The Odin Project',
      salary: '₱40,000-₱120,000 (PH) | $3,000-$10,000 (abroad)',
    },
    {
      skill: 'Nursing (Critical Care)',
      demand: 'Very High',
      whyValuable: 'Global nurse shortage. High demand in developed countries.',
      howToLearn: 'Critical care courses, ACLS, PALS certifications',
      salary: '₱25,000-₱45,000 (PH) | $3,000-$7,000 (abroad)',
    },
    {
      skill: 'Cybersecurity',
      demand: 'Very High',
      whyValuable: 'Rising cyber threats. Shortage of professionals.',
      howToLearn: 'CompTIA Security+, Cybrary (free), Google Cybersecurity Certificate',
      salary: '₱40,000-₱100,000 (PH) | $3,000-$8,000 (abroad)',
    },
    {
      skill: 'Caregiving (Elderly Care)',
      demand: 'High',
      whyValuable: 'Aging populations in developed countries. Stable demand.',
      howToLearn: 'TESDA Caregiving NC II, First Aid, Dementia care training',
      salary: '₱15,000-₱25,000 (PH) | $1,500-$3,000 (abroad)',
    },
  ];

  const governmentPrograms = [
    {
      program: 'TESDA Scholarships',
      description: 'Free technical-vocational training for qualified Filipinos',
      benefits: ['Free training and certification', 'Monthly allowance (selected programs)', 'Tool kits'],
      howToApply: 'Visit nearest TESDA office or tesda.gov.ph',
    },
    {
      program: 'DOLE TUPAD',
      description: 'Training for Work Scholarship Program',
      benefits: ['Skills training', 'Emergency employment', 'Livelihood assistance'],
      howToApply: 'DOLE regional offices',
    },
    {
      program: 'OWWA Scholarship Programs',
      description: 'Education and training assistance for OFW dependents',
      benefits: ['Education scholarship', 'Skills training', 'Livelihood programs'],
      howToApply: 'OWWA offices or owwa.gov.ph',
    },
    {
      program: 'PhilHealth OFW Program',
      description: 'Healthcare coverage for OFWs and dependents',
      benefits: ['Hospital coverage', 'Outpatient benefits', 'Maternity care'],
      howToApply: 'PhilHealth offices or online',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Skills Development Resources</h1>
          <p className="text-xl text-emerald-100">
            Free and paid courses to improve your skills and increase job opportunities
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Continuous learning is essential for career growth and securing better opportunities abroad. Whether you're
              looking to upskill in your current field or learn something completely new, there are countless free and
              affordable resources available. This guide covers the best options for Filipino workers.
            </p>
          </div>

          {/* Why Skills Matter */}
          <Card className="p-8 mb-12 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <TrendingUp className="text-emerald-600" />
              Why Skills Development Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: DollarSign, text: 'Higher salaries - skilled workers earn 30-50% more' },
                { icon: Globe, text: 'More job opportunities globally' },
                { icon: Award, text: 'Career advancement and promotions' },
                { icon: CheckCircle, text: 'Better job security and employability' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                    <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* High-Demand Skills */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">High-Demand Skills for 2025</h2>
            <div className="space-y-4">
              {skillsByDemand.map((skill, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{skill.skill}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      skill.demand === 'Extremely High' ? 'bg-red-100 text-red-700' :
                      skill.demand === 'Very High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {skill.demand} Demand
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Why Valuable:</p>
                      <p className="text-sm text-gray-600 mb-3">{skill.whyValuable}</p>
                      <p className="text-sm font-medium text-gray-700 mb-1">How to Learn:</p>
                      <p className="text-sm text-gray-600">{skill.howToLearn}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">Potential Salary:</p>
                      <p className="text-lg font-bold text-emerald-600">{skill.salary}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Free Online Courses */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BookOpen className="text-emerald-600" size={32} />
              Free Online Learning Platforms
            </h2>
            <div className="space-y-4">
              {freeOnlineCourses.map((platform, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{platform.platform}</h3>
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      Visit <ExternalLink size={16} />
                    </a>
                  </div>
                  <p className="text-gray-700 mb-3">{platform.description}</p>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-2">Popular Courses:</p>
                    <div className="flex flex-wrap gap-2">
                      {platform.courses.map((course, cIdx) => (
                        <span key={cIdx} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Cost:</strong> {platform.cost}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* TESDA Courses */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Award className="text-emerald-600" size={32} />
              TESDA Courses & Certifications
            </h2>
            <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
              <p className="text-gray-700">
                <strong>TESDA (Technical Education and Skills Development Authority)</strong> offers FREE or low-cost
                technical-vocational training. TESDA NC (National Certificate) II is highly valued by employers,
                especially for overseas work.
              </p>
            </Card>
            <div className="space-y-4">
              {tesdaCourses.map((category, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Available Courses:</p>
                      <ul className="space-y-1">
                        {category.courses.map((course, cIdx) => (
                          <li key={cIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Jobs Available:</p>
                      <p className="text-sm text-gray-700 mb-3">{category.jobsAvailable}</p>
                      <p className="text-sm font-medium text-gray-900 mb-1">Average Salary:</p>
                      <p className="text-sm font-semibold text-emerald-600">{category.avgSalary}</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">
                    <strong>How to Enroll:</strong> Visit nearest TESDA office or check tesda.gov.ph for schedules
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Language Learning */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Language Skills</h2>
            <Card className="p-6 mb-6 bg-purple-50 border-purple-200">
              <p className="text-gray-700">
                Language proficiency opens doors to international opportunities. English is essential, but additional
                languages can significantly increase your salary and job options.
              </p>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              {languageLearning.map((lang, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{lang.language}</h3>
                  <p className="text-sm text-gray-700 mb-3 bg-blue-50 p-2 rounded">
                    <strong>Importance:</strong> {lang.importance}
                  </p>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">Free Resources:</p>
                    <ul className="space-y-1">
                      {lang.resources.map((resource, rIdx) => (
                        <li key={rIdx} className="text-sm text-gray-700 flex items-start gap-2">
                          <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Certifications:</strong> {lang.certifications}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Professional Certifications */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Certifications</h2>
            <div className="space-y-6">
              {professionalCertifications.map((field, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{field.field}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Certification</th>
                          <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Provider</th>
                          <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Approx. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {field.certs.map((cert, cIdx) => (
                          <tr key={cIdx} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-700">{cert.name}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{cert.provider}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{cert.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Government Programs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Government Scholarship & Training Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {governmentPrograms.map((program, idx) => (
                <Card key={idx} className="p-6 bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.program}</h3>
                  <p className="text-sm text-gray-700 mb-3">{program.description}</p>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">Benefits:</p>
                    <ul className="space-y-1">
                      {program.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded">
                    <strong>How to Apply:</strong> {program.howToApply}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Skills Development Action Plan</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Assess Current Skills</p>
                  <p className="text-sm text-gray-700">
                    List your current skills and identify gaps in your target job requirements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Set Learning Goals</p>
                  <p className="text-sm text-gray-700">
                    Choose 1-2 skills to focus on. Don't try to learn everything at once
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Choose Learning Path</p>
                  <p className="text-sm text-gray-700">
                    Select appropriate courses (TESDA for technical, online for soft skills)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Create Study Schedule</p>
                  <p className="text-sm text-gray-700">
                    Dedicate 30-60 minutes daily. Consistency is more important than intensity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Get Certified</p>
                  <p className="text-sm text-gray-700">
                    Complete courses and earn certificates to add to your resume
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Apply New Skills</p>
                  <p className="text-sm text-gray-700">
                    Update resume, apply for better positions, showcase your new qualifications
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Learning Journey Today</h2>
            <p className="text-gray-700 mb-6">
              Browse jobs requiring new skills or explore more career resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/resources" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                More Resources
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
