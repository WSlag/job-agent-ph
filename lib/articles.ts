// lib/articles.ts
// Utility functions for reading and parsing blog articles

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  keywords: string[];
  image: string;
  readingTime: string;
  content: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  keywords: string[];
  image: string;
  readingTime: string;
}

// Calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all article slugs for static generation
export function getAllArticleSlugs(): string[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}

// Get article metadata (without full content) for listing pages
export function getAllArticles(): ArticleMeta[] {
  const slugs = getAllArticleSlugs();

  const articles = slugs.map((slug) => {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author || 'Job Agent PH',
      category: data.category || 'Guides',
      keywords: data.keywords || [],
      image: data.image || '/images/blog/default.jpg',
      readingTime: calculateReadingTime(content),
    };
  });

  // Sort by date (newest first)
  return articles.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

// Get single article with full content
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author || 'Job Agent PH',
      category: data.category || 'Guides',
      keywords: data.keywords || [],
      image: data.image || '/images/blog/default.jpg',
      readingTime: calculateReadingTime(content),
      content,
    };
  } catch {
    return null;
  }
}

// Get related articles (same category, excluding current)
export function getRelatedArticles(currentSlug: string, category: string, limit: number = 3): ArticleMeta[] {
  const allArticles = getAllArticles();
  return allArticles
    .filter((article) => article.slug !== currentSlug && article.category === category)
    .slice(0, limit);
}
