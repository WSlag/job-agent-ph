// app/blog/[slug]/page.tsx
// Individual article page with full content

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from '@/lib/articles';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';

// Custom MDX Components
const mdxComponents = {
  h1: (props: React.ComponentProps<'h1'>) => (
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
  ),
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 pb-2 border-b border-gray-200" {...props} />
  ),
  h3: (props: React.ComponentProps<'h3'>) => (
    <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6" {...props} />
  ),
  p: (props: React.ComponentProps<'p'>) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
  ),
  li: (props: React.ComponentProps<'li'>) => (
    <li className="ml-4" {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  em: (props: React.ComponentProps<'em'>) => (
    <em className="italic" {...props} />
  ),
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="border-l-4 border-yellow-400 bg-yellow-50 pl-4 py-3 my-4 italic text-gray-700" {...props} />
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<'th'>) => (
    <th className="bg-blue-900 text-white px-4 py-3 text-left font-semibold" {...props} />
  ),
  td: (props: React.ComponentProps<'td'>) => (
    <td className="border-b border-gray-200 px-4 py-3" {...props} />
  ),
  tr: (props: React.ComponentProps<'tr'>) => (
    <tr className="even:bg-gray-50" {...props} />
  ),
  // Custom components
  CalloutBox: ({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success' | 'danger', title: string, children: React.ReactNode }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-400 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      success: 'bg-green-50 border-green-400 text-green-800',
      danger: 'bg-red-50 border-red-400 text-red-800',
    };
    return (
      <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[type]}`}>
        <p className="font-bold mb-2">{title}</p>
        <div>{children}</div>
      </div>
    );
  },
  CTABox: ({ href, text, description }: { href: string, text: string, description?: string }) => (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl my-8 text-center">
      {description && <p className="text-gray-800 mb-4 font-medium">{description}</p>}
      <Link
        href={href}
        className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
      >
        {text}
      </Link>
    </div>
  ),
};

// Generate static params for all articles
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Job Agent PH',
    };
  }

  return {
    title: `${article.title} | Job Agent PH`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://www.jobagentph.com/blog/${article.slug}`,
      siteName: 'Job Agent PH',
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image],
    },
    alternates: {
      canonical: `https://www.jobagentph.com/blog/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, article.category);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: article.author,
      url: 'https://www.jobagentph.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Job Agent PH',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.jobagentph.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.jobagentph.com/blog/${article.slug}`,
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Article Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
              <Link href="/" className="text-blue-200 hover:text-white">Home</Link>
              <span className="mx-2 text-blue-300">/</span>
              <Link href="/blog" className="text-blue-200 hover:text-white">Blog</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white">{article.category}</span>
            </nav>

            {/* Category Badge */}
            <span className="inline-block bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {article.date}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readingTime}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {article.author}
              </span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <article className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={article.content} components={mdxComponents} />
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-semibold text-gray-800 mb-4">Share this article:</p>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://www.jobagentph.com/blog/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://www.jobagentph.com/blog/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </a>
              </div>
            </div>
          </article>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Find Your Dream Job Abroad?
            </h3>
            <p className="text-gray-800 mb-6">
              Browse verified job opportunities from DMW-licensed agencies.
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

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`}>
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                      <span className="text-sm text-blue-600 font-medium">{related.category}</span>
                      <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 hover:text-blue-600">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">{related.readingTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
