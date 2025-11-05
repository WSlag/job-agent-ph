'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  readTime: number; // in minutes
  category: string;
}

interface LearningHubCardProps {
  featuredArticle: Article;
}

/**
 * LearningHubCard Component
 *
 * Displays featured learning article on home screen
 * Helps users prepare for OFW journey with educational content
 */
export default function LearningHubCard({ featuredArticle }: LearningHubCardProps) {
  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-info-600" />
          <h2 className="text-xl font-bold text-gray-900">Learning Hub</h2>
        </div>
        <Link
          href="/learning"
          className="text-sm font-medium text-info-600 hover:text-info-700 flex items-center gap-1"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Featured article card */}
      <Link href={`/learning/${featuredArticle.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-info-50 to-info-100 border-2 border-info-200 rounded-xl overflow-hidden hover:shadow-xl transition-all"
        >
          <div className="grid md:grid-cols-5 gap-0">
            {/* Image */}
            <div className="md:col-span-2 h-48 md:h-auto bg-gradient-to-br from-info-100 to-info-200 overflow-hidden">
              {featuredArticle.imageUrl ? (
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-info-300" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="md:col-span-3 p-6">
              {/* Category badge */}
              <div className="inline-block bg-info-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                {featuredArticle.category}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {featuredArticle.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-info-700">
                  <Clock size={16} />
                  <span>{featuredArticle.readTime} min read</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-info-700">
                  Read Article
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
