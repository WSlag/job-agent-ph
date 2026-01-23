// app/blog/page.tsx
// Blog listing page - displays all articles

import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OFW Tips & Guides | Job Agent PH Blog',
  description: 'Mga tips, guides, at updates para sa mga Pilipinong gustong magtrabaho abroad. Learn about legal placement fees, how to apply, red flags to avoid, and more.',
  keywords: ['OFW tips', 'work abroad Philippines', 'placement fee', 'Saudi Arabia jobs', 'DMW', 'overseas employment'],
  openGraph: {
    title: 'OFW Tips & Guides | Job Agent PH Blog',
    description: 'Mga tips, guides, at updates para sa mga Pilipinong gustong magtrabaho abroad.',
    url: 'https://www.jobagentph.com/blog',
    siteName: 'Job Agent PH',
    type: 'website',
  },
};

// Category badge colors
const categoryColors: Record<string, string> = {
  'Guides': 'bg-blue-100 text-blue-800',
  'Legal': 'bg-yellow-100 text-yellow-800',
  'Tips': 'bg-green-100 text-green-800',
  'News': 'bg-purple-100 text-purple-800',
  'Warning': 'bg-red-100 text-red-800',
};

export default function BlogPage() {
  const articles = getAllArticles();

  // Featured article (first one)
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            OFW Tips & Guides
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Mga tips, guides, at updates para sa mga Pilipinong gustong magtrabaho abroad.
            Alamin ang tamang proseso at protektahan ang sarili mo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Featured Article
            </h2>
            <Link href={`/blog/${featuredArticle.slug}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-6xl">📋</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[featuredArticle.category] || 'bg-gray-100 text-gray-800'}`}>
                    {featuredArticle.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {featuredArticle.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{featuredArticle.date}</span>
                    <span className="mx-2">&middot;</span>
                    <span>{featuredArticle.readingTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Articles Grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Article Image/Icon */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-5xl">
                      {article.category === 'Warning' ? '🚩' :
                       article.category === 'Tips' ? '💡' :
                       article.category === 'Legal' ? '⚖️' : '📖'}
                    </span>
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-fit ${categoryColors[article.category] || 'bg-gray-100 text-gray-800'}`}>
                      {article.category}
                    </span>

                    <h3 className="text-lg font-bold mt-3 mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t">
                      <span>{article.date}</span>
                      <span>{article.readingTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Job Abroad?
          </h2>
          <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
            Join thousands of Filipinos who found legitimate overseas jobs through Job Agent PH.
            Direct connection to employers, transparent fees, verified agencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
