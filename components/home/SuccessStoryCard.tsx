'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessStory {
  id: string;
  userName: string;
  userAvatar?: string;
  jobTitle: string;
  country: string;
  story: string;
  rating: number;
  deploymentDate: string;
}

interface SuccessStoryCardProps {
  story: SuccessStory;
}

/**
 * SuccessStoryCard Component
 *
 * Displays featured success story on home screen
 * Inspires users with real OFW experiences
 */
export default function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-gold-500" fill="#FCD116" />
          <h2 className="text-xl font-bold text-gray-900">Success Stories</h2>
        </div>
        <Link
          href="/success-stories"
          className="text-sm font-medium text-gold-600 hover:text-gold-700 flex items-center gap-1"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Story card */}
      <Link href={`/success-stories/${story.id}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-gold-50 to-yellow-50 border-2 border-gold-200 rounded-xl p-6 hover:shadow-xl transition-all relative overflow-hidden"
        >
          {/* Decorative quote icon */}
          <div className="absolute top-4 right-4 text-gold-200 opacity-30">
            <Quote size={64} fill="currentColor" />
          </div>

          {/* User info */}
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center overflow-hidden">
              {story.userAvatar ? (
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gold-700">
                  {story.userName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{story.userName}</h3>
              <p className="text-sm text-gray-700 font-medium">{story.jobTitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                <span className="text-sm text-gray-600">{story.country}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3 relative z-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < story.rating ? 'text-gold-500' : 'text-gray-300'}
                fill={i < story.rating ? '#FCD116' : 'none'}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              Deployed {story.deploymentDate}
            </span>
          </div>

          {/* Story excerpt */}
          <p className="text-gray-700 leading-relaxed line-clamp-4 mb-4 relative z-10 italic">
            "{story.story}"
          </p>

          {/* Read more link */}
          <div className="flex items-center gap-1 text-sm font-medium text-gold-700 hover:text-gold-800 relative z-10">
            Read Full Story
            <ArrowRight size={16} />
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
