'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, BookOpen, FileText, Users, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function WorkingAbroadGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/resources"
            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Complete Guide to Working Abroad</h1>
          <p className="text-xl text-blue-100">
            Everything you need to know about becoming an Overseas Filipino Worker (OFW)
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Working abroad can be a life-changing opportunity for Filipinos seeking better career prospects
              and financial stability. However, it requires careful preparation, understanding of legal requirements,
              and awareness of potential challenges. This comprehensive guide will walk you through every step
              of the process.
            </p>
          </div>

          {/* Table of Contents */}
          <Card className="p-6 mb-12 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <ol className="space-y-2">
              <li><a href="#preparation" className="text-blue-600 hover:text-blue-700">1. Preparation and Requirements</a></li>
              <li><a href="#legal" className="text-blue-600 hover:text-blue-700">2. Legal Requirements and Documentation</a></li>
              <li><a href="#process" className="text-blue-600 hover:text-blue-700">3. The Deployment Process</a></li>
              <li><a href="#financial" className="text-blue-600 hover:text-blue-700">4. Financial Planning</a></li>
              <li><a href="#rights" className="text-blue-600 hover:text-blue-700">5. Your Rights as an OFW</a></li>
              <li><a href="#challenges" className="text-blue-600 hover:text-blue-700">6. Common Challenges and Solutions</a></li>
            </ol>
          </Card>

          {/* Section 1: Preparation */}
          <div id="preparation" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">1. Preparation and Requirements</h2>
            </div>

            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Requirements</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Age Requirement</p>
                    <p className="text-sm text-gray-600">Must be at least 18 years old (23 for domestic workers)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Valid Passport</p>
                    <p className="text-sm text-gray-600">With at least 6 months validity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Medical Certificate</p>
                    <p className="text-sm text-gray-600">From DMW-accredited medical clinic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Skills Assessment</p>
                    <p className="text-sm text-gray-600">Relevant to your job category</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Departure Preparations</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-gray-700">Research your destination country - culture, climate, cost of living, and work environment</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-gray-700">Improve language skills - especially English or the local language of your destination</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-gray-700">Acquire additional skills or certifications relevant to your profession</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <p className="text-gray-700">Build financial savings for initial expenses and emergencies</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <p className="text-gray-700">Prepare your family for your absence and set up support systems</p>
                </li>
              </ul>
            </Card>
          </div>

          {/* Section 2: Legal Requirements */}
          <div id="legal" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">2. Legal Requirements and Documentation</h2>
            </div>

            <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Important Reminder</h3>
                  <p className="text-gray-700">
                    Only work with DMW-licensed recruitment agencies. Never pay placement fees exceeding
                    one month's salary. Illegal recruiters prey on aspiring OFWs - protect yourself.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Documents</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Valid Philippine Passport (with at least 6 months validity)</li>
                    <li>Birth Certificate (PSA-issued)</li>
                    <li>Marriage Certificate (if applicable, PSA-issued)</li>
                    <li>NBI Clearance</li>
                    <li>Police Clearance</li>
                    <li>Barangay Clearance</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Documents</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Transcript of Records (TOR)</li>
                    <li>Diploma or Certificate of Completion</li>
                    <li>Professional License (if applicable - PRC, TESDA, etc.)</li>
                    <li>Employment Certificates from previous employers</li>
                    <li>Resume/CV</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Medical and Health</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Medical Certificate from DMW-accredited clinic</li>
                    <li>Chest X-ray</li>
                    <li>Blood test results</li>
                    <li>Drug test results</li>
                    <li>Pregnancy test (for female applicants, some countries)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Employment Documents</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Verified employment contract</li>
                    <li>Job offer letter</li>
                    <li>Visa documentation</li>
                    <li>Work permit (if applicable)</li>
                    <li>OWWA membership</li>
                    <li>Pre-Departure Orientation Seminar (PDOS) certificate</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Section 3: Deployment Process */}
          <div id="process" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Users size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">3. The Deployment Process</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Job Application',
                  description: 'Apply through licensed agencies or directly with overseas employers. Verify agency licenses at DMW website.',
                  duration: '1-2 weeks',
                },
                {
                  step: 2,
                  title: 'Interview and Selection',
                  description: 'Participate in interviews (phone, video, or in-person). Prepare documents and references.',
                  duration: '2-4 weeks',
                },
                {
                  step: 3,
                  title: 'Contract Signing',
                  description: 'Review employment contract carefully. Have it verified by DMW. Never sign blank contracts.',
                  duration: '1 week',
                },
                {
                  step: 4,
                  title: 'Medical Examination',
                  description: 'Complete medical tests at DMW-accredited clinics. Ensure all results are within normal ranges.',
                  duration: '1-2 weeks',
                },
                {
                  step: 5,
                  title: 'PDOS Attendance',
                  description: 'Attend mandatory Pre-Departure Orientation Seminar to learn about rights, responsibilities, and destination country.',
                  duration: '1 day',
                },
                {
                  step: 6,
                  title: 'OWWA Membership',
                  description: 'Register and pay OWWA membership fee. This provides access to welfare programs and benefits.',
                  duration: '1 day',
                },
                {
                  step: 7,
                  title: 'Visa Processing',
                  description: 'Submit visa application with complete requirements. Processing time varies by country.',
                  duration: '2-8 weeks',
                },
                {
                  step: 8,
                  title: 'Final Documentation',
                  description: 'Secure OEC (Overseas Employment Certificate) from DMW. This is required for departure.',
                  duration: '1-3 days',
                },
                {
                  step: 9,
                  title: 'Deployment',
                  description: 'Depart Philippines through designated airports. Present OEC and other documents at immigration.',
                  duration: '1 day',
                },
              ].map((item) => (
                <Card key={item.step} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 4: Financial Planning */}
          <div id="financial" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">4. Financial Planning</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Initial Expenses</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-700">Passport</span>
                    <span className="font-medium">₱950 - ₱1,200</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">Medical Examination</span>
                    <span className="font-medium">₱3,000 - ₱8,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">NBI Clearance</span>
                    <span className="font-medium">₱155 - ₱220</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">OWWA Membership</span>
                    <span className="font-medium">USD $25</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">PDOS</span>
                    <span className="font-medium">₱500 - ₱1,000</span>
                  </li>
                  <li className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-blue-600">₱15,000 - ₱30,000</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Financial Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Create a family budget before departure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Set up automatic remittance to family</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Build emergency fund (3-6 months expenses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Invest in insurance (life, health, accident)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Plan for retirement and children's education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Avoid impulsive purchases and loans</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Section 5: Rights */}
          <div id="rights" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">5. Your Rights as an OFW</h2>
            </div>

            <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">You Have the Right To:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Fair and humane treatment',
                  'Receive full salary on time',
                  'Work in safe conditions',
                  'Keep your passport',
                  'Freedom of movement',
                  'Religious freedom',
                  'Privacy and dignity',
                  'File complaints without retaliation',
                  'Emergency assistance from embassy',
                  'Return to Philippines anytime',
                  'Join worker organizations',
                  'Medical care when sick or injured',
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-600" />
                Report These Violations Immediately
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Withholding of passport or documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Non-payment or delayed payment of salary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Physical, verbal, or sexual abuse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Forced labor or working excessive hours without pay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Restriction of movement or communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700">Unsafe or unsanitary living/working conditions</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Emergency Contacts:</p>
                <p className="text-gray-700">DMW Hotline: <a href="tel:1348" className="text-blue-600 font-semibold">1348</a></p>
                <p className="text-gray-700">OWWA Hotline: <a href="tel:+6328903108" className="text-blue-600 font-semibold">+63 2 8903-3108</a></p>
                <p className="text-gray-700">Contact nearest Philippine Embassy or Consulate</p>
              </div>
            </Card>
          </div>

          {/* Section 6: Challenges */}
          <div id="challenges" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Common Challenges and Solutions</h2>

            <div className="space-y-6">
              {[
                {
                  challenge: 'Homesickness and Loneliness',
                  solutions: [
                    'Stay connected with family through video calls and messaging',
                    'Join Filipino community groups in your area',
                    'Engage in hobbies and activities',
                    'Maintain regular schedule and routines',
                    'Seek counseling if needed (OWWA provides mental health services)',
                  ],
                },
                {
                  challenge: 'Culture Shock',
                  solutions: [
                    'Learn about local culture and customs before departure',
                    'Be open-minded and respectful of differences',
                    'Connect with other Filipinos who can guide you',
                    'Give yourself time to adjust (usually 3-6 months)',
                    'Focus on the positive aspects of the experience',
                  ],
                },
                {
                  challenge: 'Language Barriers',
                  solutions: [
                    'Take language classes before and after arrival',
                    'Use translation apps for daily communication',
                    'Practice with colleagues and locals',
                    'Learn work-related vocabulary first',
                    'Don\'t be afraid to ask for clarification',
                  ],
                },
                {
                  challenge: 'Work-Related Stress',
                  solutions: [
                    'Set clear boundaries between work and personal time',
                    'Learn to say no to unreasonable demands',
                    'Document any contract violations',
                    'Seek support from fellow OFWs',
                    'Know your rights and when to report issues',
                  ],
                },
              ].map((item, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.challenge}</h3>
                  <ul className="space-y-2">
                    {item.solutions.map((solution, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your OFW Journey?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Browse verified job opportunities from licensed recruitment agencies and take the first step
              toward your overseas career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                More Resources
              </Link>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              <strong>Disclaimer:</strong> This guide is for informational purposes only. Requirements and processes
              may vary by country and change over time. Always verify current requirements with DMW and your chosen
              recruitment agency.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
