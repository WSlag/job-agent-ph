'use client';

import { useState } from 'react';
import LandingNav3Enhanced from '@/components/layout/LandingNav3Enhanced';
import { Monitor, Smartphone, Check, Copy } from 'lucide-react';

/**
 * Landing Nav Preview Page
 * Shows both desktop and mobile views of the enhanced landing navigation
 */

export default function LandingNavPreviewPage() {
  const [viewMode, setViewMode] = useState<'both' | 'mobile' | 'desktop'>('both');
  const [copied, setCopied] = useState(false);

  const importCode = "import LandingNav3Enhanced from '@/components/layout/LandingNav3Enhanced';";

  const handleCopy = () => {
    navigator.clipboard.writeText(importCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              App-Style Landing Navigation Preview
            </h1>
            <p className="text-gray-600 mb-4">
              Beautiful mobile-first design optimized for PWA
            </p>

            {/* View Mode Toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setViewMode('both')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'both'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Both Views
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile Only
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop Only
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-bold text-blue-900 mb-1">🎨 Beautiful Design</p>
              <p className="text-xs text-blue-700">Gradient accents & smooth animations</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-sm font-bold text-purple-900 mb-1">📱 Mobile-First</p>
              <p className="text-xs text-purple-700">Optimized for touch & small screens</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
              <p className="text-sm font-bold text-pink-900 mb-1">⚡ Quick Actions</p>
              <p className="text-xs text-pink-700">Search, save, notifications at fingertips</p>
            </div>
          </div>

          {/* Copy Code Section */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Import Code:</p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <code className="block text-sm font-mono text-blue-300 bg-black/30 p-3 rounded-lg">
              {importCode}
            </code>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid gap-8 ${
            viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* Mobile View */}
          {(viewMode === 'both' || viewMode === 'mobile') && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Mobile View</h2>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  375x812px
                </span>
              </div>

              {/* Mobile Frame */}
              <div className="mx-auto" style={{ width: '375px', maxWidth: '100%' }}>
                <div className="relative bg-white rounded-[3rem] border-[14px] border-gray-900 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-10"></div>

                  {/* Screen Content */}
                  <div className="relative h-[812px] overflow-y-auto bg-white">
                    <div className="relative">
                      <LandingNav3Enhanced />

                      {/* Demo Content */}
                      <div className="pt-28 pb-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="px-4 py-12 text-center text-white">
                          <h2 className="text-3xl font-bold mb-3">Find Your Dream Job</h2>
                          <p className="text-blue-100 text-sm mb-6">
                            300,000+ opportunities worldwide
                          </p>
                          <div className="flex gap-3 justify-center">
                            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-lg">
                              Get Started
                            </button>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border border-white/30">
                              Learn More
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Jobs</h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                  J{i}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900 text-sm mb-1">
                                    Software Engineer
                                  </p>
                                  <p className="text-xs text-gray-600">Tech Company • Dubai</p>
                                  <p className="text-xs text-green-600 font-semibold mt-1">
                                    $80,000 - $120,000
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop View */}
          {(viewMode === 'both' || viewMode === 'desktop') && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Desktop View</h2>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  1920x1080px
                </span>
              </div>

              {/* Desktop Frame */}
              <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
                <div className="bg-white rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <div className="relative h-full overflow-y-auto">
                    <LandingNav3Enhanced />

                    {/* Demo Content */}
                    <div className="pt-32 pb-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                      <div className="max-w-7xl mx-auto px-8 py-16 text-center text-white">
                        <h2 className="text-5xl font-bold mb-4">Find Your Dream Job Abroad</h2>
                        <p className="text-xl text-blue-100 mb-8">
                          300,000+ opportunities from top companies worldwide
                        </p>
                        <div className="flex gap-4 justify-center">
                          <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg">
                            Get Started Free
                          </button>
                          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/30 transition-all text-lg">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-8 py-12 bg-white">
                      <h3 className="text-3xl font-bold text-gray-900 mb-8">Featured Jobs</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                J{i}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 text-lg mb-1">
                                  Software Engineer
                                </p>
                                <p className="text-sm text-gray-600">Tech Company</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">📍 Dubai, UAE</p>
                              <p className="text-sm text-green-600 font-bold">
                                💰 $80,000 - $120,000/year
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Implementation Notes */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Key Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Mobile Features:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Expandable search bar</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Quick action icons with badges</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Beautiful slide-in menu with gradients</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Category pills with emojis</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Touch-optimized spacing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Backdrop blur overlay</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Desktop Features:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Centered search bar</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Hover effects on all interactive elements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Gradient login button</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Category pills navigation bar</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Smooth transitions throughout</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Stats dashboard in menu</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <p className="text-center font-semibold">
              🎯 This design is production-ready and optimized for PWA landing pages!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
