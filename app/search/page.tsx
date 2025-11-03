'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.append('q', jobTitle.trim());
    if (location.trim()) params.append('location', location.trim());
    if (experience) params.append('experience', experience);

    // Navigate to jobs page with search parameters
    router.push(`/jobs${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </Link>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search Jobs
          </h1>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Search Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Job Title Input */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-semibold text-purple-600 mb-2">
              Job title, skills
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer, Nurse, Chef"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dubai, Singapore, Remote"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Experience Input */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition-all shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Any experience level</option>
                <option value="0">Entry Level (0-1 years)</option>
                <option value="1">Junior (1-3 years)</option>
                <option value="3">Mid-Level (3-5 years)</option>
                <option value="5">Senior (5-10 years)</option>
                <option value="10">Expert (10+ years)</option>
              </select>
            </div>
          </div>

          {/* Advanced Search Link */}
          <div className="text-right">
            <Link
              href="/jobs"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center gap-1 transition-colors"
            >
              Advanced Search
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Search jobs
          </button>
        </form>

        {/* Quick Search Suggestions */}
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Remote Jobs',
              'Dubai Jobs',
              'Singapore Jobs',
              'Software Engineer',
              'Nurse',
              'Accountant',
              'Teacher',
              'Chef',
            ].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setJobTitle(term);
                }}
                className="px-4 py-2 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full text-sm text-gray-700 hover:text-purple-700 transition-all shadow-sm hover:shadow-md"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
