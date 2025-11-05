'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  // Job Seekers
  {
    id: '1',
    category: 'Job Seekers',
    question: 'How do I create an account?',
    answer: 'Click on the "Sign Up" button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google or Facebook account for faster registration.',
  },
  {
    id: '2',
    category: 'Job Seekers',
    question: 'How do I apply for a job?',
    answer: 'Browse or search for jobs, click on a job listing to view details, and click the "Apply" button. You\'ll need to complete your profile and upload required documents before applying.',
  },
  {
    id: '3',
    category: 'Job Seekers',
    question: 'Can I save jobs to apply later?',
    answer: 'Yes! Click the bookmark icon on any job card to save it to your "Saved Jobs" list. You can access your saved jobs from your profile menu.',
  },
  {
    id: '4',
    category: 'Job Seekers',
    question: 'How do I track my applications?',
    answer: 'Go to your profile and select "My Applications" to see all your job applications, their status (pending, reviewing, shortlisted, accepted, or rejected), and any updates from employers.',
  },
  {
    id: '5',
    category: 'Job Seekers',
    question: 'What documents do I need to apply?',
    answer: 'Typically, you need: Updated Resume/CV, Valid ID, NBI Clearance, Medical Certificate, and any relevant certifications or licenses for your profession. Requirements may vary by job and country.',
  },

  // Agencies/Employers
  {
    id: '6',
    category: 'Agencies',
    question: 'How do I post a job?',
    answer: 'After creating an agency account and completing verification, go to your dashboard and click "Post a Job". Fill in the job details, requirements, and benefits, then submit for review.',
  },
  {
    id: '7',
    category: 'Agencies',
    question: 'How long does agency verification take?',
    answer: 'Agency verification typically takes 1-3 business days. We verify your POEA/DMW license, business registration, and contact details to ensure legitimacy and protect job seekers.',
  },
  {
    id: '8',
    category: 'Agencies',
    question: 'How do I review applications?',
    answer: 'Go to "My Jobs" in your dashboard, select a job listing, and click "View Applicants". You can review profiles, download resumes, message applicants, and update application statuses.',
  },
  {
    id: '9',
    category: 'Agencies',
    question: 'Can I feature my jobs?',
    answer: 'Yes! Featured jobs appear at the top of search results with a special badge. Contact our support team or check your dashboard for featuring options and pricing.',
  },

  // Platform Usage
  {
    id: '10',
    category: 'Platform',
    question: 'Is Job Agent PH free to use?',
    answer: 'Yes! Job Agent PH is completely free for job seekers. You can browse jobs, apply, save jobs, and message agencies at no cost. Agencies pay a fee to post jobs and access applicant profiles.',
  },
  {
    id: '11',
    category: 'Platform',
    question: 'How do I search for specific jobs?',
    answer: 'Use the search bar to enter job titles, skills, or keywords. Apply filters for location, salary range, job type, and more. You can also browse by category from the homepage.',
  },
  {
    id: '12',
    category: 'Platform',
    question: 'Can I use Job Agent PH on my phone?',
    answer: 'Absolutely! Job Agent PH is fully responsive and works on all devices - desktop, tablet, and mobile. You can also install it as a mobile app for quick access.',
  },
  {
    id: '13',
    category: 'Platform',
    question: 'How do messages work?',
    answer: 'Once you apply to a job, you can message the agency directly through our platform. All conversations are saved in your Messages section. You\'ll receive notifications for new messages.',
  },

  // Safety & Security
  {
    id: '14',
    category: 'Safety',
    question: 'How do I know if an agency is legitimate?',
    answer: 'Look for the "DMW Verified" badge on agency profiles. We verify all agencies against the Department of Migrant Workers (DMW) database. Always check the agency\'s license number on the official DMW website.',
  },
  {
    id: '15',
    category: 'Safety',
    question: 'Are there any fees I need to pay?',
    answer: 'IMPORTANT: Legitimate agencies CANNOT charge placement fees to OFWs. This is illegal under Philippine law. Be wary of agencies asking for money. You only pay for government-required documents and processing fees.',
  },
  {
    id: '16',
    category: 'Safety',
    question: 'What should I do if I encounter a scam?',
    answer: 'Report suspicious agencies or job posts immediately using the "Report" button on their profile or contact our support team. We take fraud very seriously and will investigate promptly.',
  },
  {
    id: '17',
    category: 'Safety',
    question: 'Is my personal information secure?',
    answer: 'Yes! We use industry-standard encryption to protect your data. Your documents and personal details are only shared with agencies you apply to. We never sell your information to third parties.',
  },
];

const categories = ['All', 'Job Seekers', 'Agencies', 'Platform', 'Safety'];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Find answers to common questions about using Job Agent PH
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {filteredFAQs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No FAQs found matching your search.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Card
                key={faq.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedFAQ === faq.id ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Still Need Help */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
