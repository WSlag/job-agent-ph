'use client';

import { useState } from 'react';
import { BookOpen, FileText, Video, ExternalLink, Download, Shield, Globe, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'guide' | 'video' | 'download';
  icon: any;
  href: string;
  external?: boolean;
}

const resources: Resource[] = [
  // OFW Guides
  {
    id: '1',
    title: 'Complete Guide to Working Abroad',
    description: 'Everything you need to know about becoming an OFW, from preparation to deployment.',
    category: 'Guides',
    type: 'guide',
    icon: BookOpen,
    href: '/resources/guides/working-abroad',
  },
  {
    id: '2',
    title: 'POEA Processing Guide',
    description: 'Step-by-step guide to POEA processing, requirements, and timelines.',
    category: 'Guides',
    type: 'guide',
    icon: FileText,
    href: '/resources/guides/poea-processing',
  },
  {
    id: '3',
    title: 'OFW Rights and Responsibilities',
    description: 'Know your rights as an OFW and what you need to do to protect yourself.',
    category: 'Guides',
    type: 'article',
    icon: Shield,
    href: '/resources/guides/ofw-rights',
  },

  // Country Guides
  {
    id: '4',
    title: 'Working in Saudi Arabia Guide',
    description: 'Culture, work environment, salary expectations, and tips for working in KSA.',
    category: 'Country Guides',
    type: 'guide',
    icon: Globe,
    href: '/resources/country-guides/saudi-arabia',
  },
  {
    id: '5',
    title: 'Working in UAE Guide',
    description: 'Comprehensive guide about living and working in Dubai, Abu Dhabi, and other Emirates.',
    category: 'Country Guides',
    type: 'guide',
    icon: Globe,
    href: '/resources/country-guides/uae',
  },
  {
    id: '6',
    title: 'Working in Canada Guide',
    description: 'Immigration programs, work permits, and opportunities for Filipino workers in Canada.',
    category: 'Country Guides',
    type: 'guide',
    icon: Globe,
    href: '/resources/country-guides/canada',
  },

  // Documents & Downloads
  {
    id: '7',
    title: 'OFW Document Checklist',
    description: 'Downloadable checklist of all documents needed for overseas employment.',
    category: 'Downloads',
    type: 'download',
    icon: Download,
    href: '/resources/downloads/document-checklist',
  },
  {
    id: '8',
    title: 'Sample Employment Contract',
    description: 'What to look for in your employment contract and sample templates.',
    category: 'Downloads',
    type: 'download',
    icon: FileText,
    href: '/resources/downloads/employment-contract',
  },

  // Career Development
  {
    id: '9',
    title: 'Resume Writing Tips for OFWs',
    description: 'How to create a professional resume that gets noticed by international employers.',
    category: 'Career',
    type: 'article',
    icon: FileText,
    href: '/resources/career/resume-tips',
  },
  {
    id: '10',
    title: 'Interview Preparation Guide',
    description: 'Common interview questions, tips, and how to prepare for video interviews.',
    category: 'Career',
    type: 'article',
    icon: Video,
    href: '/resources/career/interview-prep',
  },
  {
    id: '11',
    title: 'Skills Development Resources',
    description: 'Free and paid courses to improve your skills and increase job opportunities.',
    category: 'Career',
    type: 'article',
    icon: TrendingUp,
    href: '/resources/career/skills-development',
  },

  // External Links
  {
    id: '12',
    title: 'DMW Official Website',
    description: 'Department of Migrant Workers - Verify agencies, check requirements, file complaints.',
    category: 'Government',
    type: 'article',
    icon: ExternalLink,
    href: 'https://dmw.gov.ph',
    external: true,
  },
  {
    id: '13',
    title: 'OWWA Programs and Services',
    description: 'Learn about OWWA benefits, programs, and services for OFWs and their families.',
    category: 'Government',
    type: 'article',
    icon: ExternalLink,
    href: 'https://owwa.gov.ph',
    external: true,
  },
];

const categories = ['All', 'Guides', 'Country Guides', 'Downloads', 'Career', 'Government'];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResources = resources.filter(
    (resource) => activeCategory === 'All' || resource.category === activeCategory
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-100 text-blue-700';
      case 'article':
        return 'bg-green-100 text-green-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'download':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OFW Resources
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Helpful guides, articles, and tools to support your overseas employment journey
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
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

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.id}
                href={resource.href}
                target={resource.external ? '_blank' : '_self'}
                rel={resource.external ? 'noopener noreferrer' : ''}
                className="block"
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(resource.type)}`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {resource.title}
                    {resource.external && (
                      <ExternalLink size={14} className="inline ml-1 mb-1" />
                    )}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="mt-4 text-primary-600 text-sm font-medium group-hover:underline">
                    {resource.type === 'download' ? 'Download' : 'Read More'} →
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Need More Help?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is here to answer your questions and guide you through your OFW journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View FAQs
            </Link>
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> Information provided is for general guidance only.
            Always verify with official government sources and consult with licensed recruitment agencies.
          </p>
        </div>
      </div>
    </div>
  );
}
