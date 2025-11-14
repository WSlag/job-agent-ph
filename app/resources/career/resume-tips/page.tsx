'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, XCircle, Star, Download, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';

export default function ResumeTipsPage() {
  const resumeSections = [
    {
      section: 'Personal Information',
      mustHave: [
        'Full name (as in passport)',
        'Professional email address',
        'Active phone number (+63 format)',
        'Current address in Philippines',
        'LinkedIn profile (if applicable)',
      ],
      avoid: [
        'Photo (unless required by country)',
        'Age, birthday, or gender',
        'Marital status or number of children',
        'Religion or political affiliation',
        'Unprofessional email (e.g., cutiepie@email.com)',
      ],
      tip: 'Use a professional email: firstname.lastname@gmail.com format works best.',
    },
    {
      section: 'Professional Summary/Objective',
      mustHave: [
        '2-3 sentences about your qualifications',
        'Key skills relevant to the job',
        'Years of experience',
        'Career goal matching the position',
      ],
      avoid: [
        'Generic statements ("seeking opportunity")',
        'Copying from templates word-for-word',
        'Long paragraphs (keep it brief)',
        'Salary expectations',
      ],
      tip: 'Tailor this section for each job application. Mention the specific position you\'re applying for.',
    },
    {
      section: 'Work Experience',
      mustHave: [
        'Job title and company name',
        'Employment dates (month/year format)',
        'Specific responsibilities and achievements',
        'Quantified results (e.g., "Managed team of 5")',
        'Most recent job first (reverse chronological)',
      ],
      avoid: [
        'Duties without achievements',
        'Every job since age 16 (last 10 years is enough)',
        'Unexplained gaps in employment',
        'Lies or exaggerations',
      ],
      tip: 'Use action verbs: Managed, Coordinated, Achieved, Implemented, Improved.',
    },
    {
      section: 'Education',
      mustHave: [
        'Degree/diploma title',
        'School/university name',
        'Graduation year',
        'Honors or distinctions (if any)',
      ],
      avoid: [
        'Elementary/high school (if you have college degree)',
        'GPA below 3.0 (better to omit)',
        'Incomplete degrees (unless relevant)',
        'Too much detail on coursework',
      ],
      tip: 'List most recent education first. Include relevant certifications here.',
    },
    {
      section: 'Skills',
      mustHave: [
        'Technical skills relevant to job',
        'Language proficiency (English, Arabic, etc.)',
        'Software/tools you can use',
        'Certifications (TESDA, NCII, etc.)',
      ],
      avoid: [
        'Obvious skills ("Microsoft Word")',
        'Skills you don\'t actually have',
        'Rating yourself (e.g., "Expert")',
        'Soft skills ("hard-working, team player")',
      ],
      tip: 'Match skills to job posting keywords. Be specific: "Excel (Pivot Tables, VLOOKUP)" not just "Excel".',
    },
  ];

  const formatTips = [
    {
      rule: 'Length',
      guideline: '1-2 pages maximum',
      why: 'Recruiters spend 6-10 seconds scanning resumes. Keep it concise.',
    },
    {
      rule: 'Font',
      guideline: 'Arial, Calibri, or Times New Roman, size 10-12',
      why: 'Professional, easy to read, ATS-friendly.',
    },
    {
      rule: 'Margins',
      guideline: '0.5-1 inch on all sides',
      why: 'Clean look, easy to print, space for notes.',
    },
    {
      rule: 'File Format',
      guideline: 'PDF preferred (unless employer asks for Word)',
      why: 'Preserves formatting, looks professional.',
    },
    {
      rule: 'Filename',
      guideline: 'YourName_Resume.pdf',
      why: 'Easy for recruiters to find and organize.',
    },
  ];

  const commonMistakes = [
    {
      mistake: 'Typos and Grammar Errors',
      impact: 'Instant rejection - shows carelessness',
      fix: 'Proofread 3+ times. Use Grammarly. Ask friend to review.',
    },
    {
      mistake: 'Using Same Resume for All Jobs',
      impact: 'Doesn\'t match job requirements',
      fix: 'Customize for each application. Match keywords from job posting.',
    },
    {
      mistake: 'Including References on Resume',
      impact: 'Wastes valuable space',
      fix: 'Write "References available upon request" or omit entirely.',
    },
    {
      mistake: 'Listing Job Duties Instead of Achievements',
      impact: 'Doesn\'t show your value or impact',
      fix: 'Use numbers: "Increased sales 20%" not "Responsible for sales".',
    },
    {
      mistake: 'Unprofessional Email Address',
      impact: 'Looks immature and unprofessional',
      fix: 'Create professional email: firstname.lastname@gmail.com',
    },
    {
      mistake: 'Missing Contact Information',
      impact: 'Employer can\'t reach you',
      fix: 'Double-check phone number and email work correctly.',
    },
    {
      mistake: 'Too Much or Too Little Information',
      impact: '5-page resume = ignored. Half-page = not enough info',
      fix: '1-2 pages. Include relevant experience from last 10 years.',
    },
  ];

  const ofwSpecificTips = [
    {
      title: 'Highlight International Experience',
      description: 'If you\'ve worked abroad before, emphasize countries, cultural adaptability, and successful contract completion.',
    },
    {
      title: 'Language Skills',
      description: 'List all languages and proficiency level (Basic, Intermediate, Fluent). English proficiency is crucial.',
    },
    {
      title: 'Include Relevant Certifications',
      description: 'TESDA certifications, NCII, caregiver training, medical licenses - all very important for OFWs.',
    },
    {
      title: 'Address Employment Gaps',
      description: 'If gap was for family care or health, briefly mention it positively (e.g., "Family care responsibilities").',
    },
    {
      title: 'Use International Date Format',
      description: 'Use Month/Year format (e.g., "Jan 2020 - Dec 2022") which is understood globally.',
    },
    {
      title: 'Adapt to Country Norms',
      description: 'Some Middle Eastern countries expect photo + personal details. Research destination country expectations.',
    },
  ];

  const actionVerbs = {
    Management: ['Led', 'Supervised', 'Coordinated', 'Directed', 'Managed', 'Oversaw'],
    Achievement: ['Achieved', 'Exceeded', 'Improved', 'Increased', 'Reduced', 'Streamlined'],
    Communication: ['Presented', 'Negotiated', 'Collaborated', 'Liaised', 'Facilitated'],
    Technical: ['Developed', 'Implemented', 'Programmed', 'Designed', 'Engineered', 'Configured'],
    Creative: ['Created', 'Designed', 'Conceptualized', 'Produced', 'Illustrated'],
    Helping: ['Assisted', 'Supported', 'Cared for', 'Counseled', 'Mentored', 'Guided'],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/resources" className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-5xl font-bold mb-6">Resume Writing Tips for OFWs</h1>
          <p className="text-xl text-teal-100">
            How to create a professional resume that gets noticed by international employers
          </p>
        </div>
      </Section>

      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              Your resume is your first impression to employers. A well-crafted resume can open doors to international
              opportunities, while a poorly written one will be discarded in seconds. This guide will help you create
              a professional, ATS-friendly resume that showcases your skills and experience effectively.
            </p>
          </div>

          {/* Important Note */}
          <Card className="p-6 mb-12 bg-blue-50 border-blue-200">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <Star className="text-blue-600" />
              ATS (Applicant Tracking System) Friendly
            </h3>
            <p className="text-gray-700">
              Many employers use ATS software to scan resumes before humans see them. Keep formatting simple,
              use standard section headings, include keywords from job posting, and avoid tables/graphics that
              confuse ATS systems.
            </p>
          </Card>

          {/* Resume Sections */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="text-teal-600" size={32} />
              Essential Resume Sections
            </h2>
            <div className="space-y-6">
              {resumeSections.map((item, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.section}</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    {/* Must Have */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={18} />
                        Must Have
                      </h4>
                      <ul className="space-y-2">
                        {item.mustHave.map((point, pIdx) => (
                          <li key={pIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Avoid */}
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <XCircle className="text-red-600" size={18} />
                        Avoid
                      </h4>
                      <ul className="space-y-2">
                        {item.avoid.map((point, pIdx) => (
                          <li key={pIdx} className="text-sm text-gray-700 flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong className="text-teal-700">Pro Tip:</strong> {item.tip}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Formatting Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Formatting Guidelines</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {formatTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 w-32">
                      <p className="font-semibold text-gray-900">{tip.rule}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 mb-1">{tip.guideline}</p>
                      <p className="text-sm text-gray-600">{tip.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* OFW-Specific Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">OFW-Specific Resume Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ofwSpecificTips.map((tip, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-700 text-sm">{tip.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Verbs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Powerful Action Verbs</h2>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <p className="text-gray-700 mb-6">
                Start bullet points with strong action verbs to make your achievements stand out:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(actionVerbs).map(([category, verbs]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {verbs.map((verb, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white px-2 py-1 rounded text-gray-700 border border-purple-200"
                        >
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Common Mistakes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-orange-600" size={32} />
              Common Mistakes to Avoid
            </h2>
            <div className="space-y-4">
              {commonMistakes.map((item, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.mistake}</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong className="text-red-600">Impact:</strong> {item.impact}
                      </p>
                      <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                        <strong className="text-green-700">Fix:</strong> {item.fix}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Resume Template Example */}
          <Card className="p-8 mb-8 bg-gray-50 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FileText className="text-teal-600" />
              Sample Resume Structure
            </h2>
            <div className="bg-white p-6 rounded-lg border border-gray-300 font-mono text-sm space-y-4">
              <div>
                <p className="font-bold">JUAN DELA CRUZ</p>
                <p>Manila, Philippines | +63-917-123-4567 | juan.delacruz@email.com</p>
                <p>LinkedIn: linkedin.com/in/juandelacruz</p>
              </div>

              <div>
                <p className="font-bold mb-1">PROFESSIONAL SUMMARY</p>
                <p className="text-gray-700">
                  Experienced Registered Nurse with 5+ years in critical care. Skilled in patient assessment,
                  emergency response, and multidisciplinary collaboration. Seeking nursing position in UAE.
                </p>
              </div>

              <div>
                <p className="font-bold mb-1">WORK EXPERIENCE</p>
                <p className="font-semibold">Staff Nurse - ICU | Manila General Hospital | Jan 2019 - Present</p>
                <ul className="list-disc ml-5 text-gray-700">
                  <li>Provided critical care to 10-15 patients daily in 20-bed ICU</li>
                  <li>Achieved 98% patient satisfaction score (hospital average: 92%)</li>
                  <li>Trained 12 new nurses in ICU protocols and procedures</li>
                </ul>
              </div>

              <div>
                <p className="font-bold mb-1">EDUCATION</p>
                <p>Bachelor of Science in Nursing | University of Santo Tomas | 2018</p>
                <p className="text-gray-700">Cum Laude, Dean's List (2016-2018)</p>
              </div>

              <div>
                <p className="font-bold mb-1">SKILLS</p>
                <p className="text-gray-700">
                  Critical Care | Patient Assessment | BLS, ACLS Certified | Electronic Medical Records |
                  English (Fluent) | Arabic (Basic)
                </p>
              </div>

              <div>
                <p className="font-bold mb-1">CERTIFICATIONS</p>
                <p className="text-gray-700">
                  • Philippine Registered Nurse License (PRC) - Valid<br />
                  • Basic Life Support (BLS) - Expires Dec 2025<br />
                  • Advanced Cardiac Life Support (ACLS) - Expires Jun 2025
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              This is a simplified example. Actual resume should be properly formatted in Word/PDF.
            </p>
          </Card>

          {/* Final Checklist */}
          <Card className="p-8 mb-8 bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Resume Checklist</h2>
            <div className="space-y-2">
              {[
                'Contact information is accurate and professional',
                'No typos or grammatical errors',
                'Tailored to specific job posting',
                '1-2 pages in length',
                'Uses action verbs and quantified achievements',
                'Includes relevant keywords from job description',
                'Saved as PDF with proper filename (YourName_Resume.pdf)',
                'Reviewed by at least one other person',
                'ATS-friendly formatting (no tables, images, or unusual fonts)',
                'Matches your LinkedIn profile',
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-green-100 p-2 rounded transition-colors">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
            <p className="text-gray-700 mb-6">
              Browse available jobs and submit your polished resume
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/resources/career/interview-prep" className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
                Interview Preparation
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
