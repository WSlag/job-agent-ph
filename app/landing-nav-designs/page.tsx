'use client';

import { useState } from 'react';
import LandingNav1 from '@/components/layout/LandingNav1';
import LandingNav2 from '@/components/layout/LandingNav2';
import LandingNav3 from '@/components/layout/LandingNav3';
import LandingNav4 from '@/components/layout/LandingNav4';
import { Check, Copy, Sparkles } from 'lucide-react';

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

/**
 * Landing Page Navigation Designs Demo Page
 * View and compare all 4 landing page navigation designs
 * Choose the best one for your landing page
 */

export default function LandingNavDesignsPage() {
  const [selectedDesign, setSelectedDesign] = useState(1);
  const [copied, setCopied] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Transparent Overlay Hero',
      description: 'Transparent navigation that overlays hero section, becomes solid on scroll. Perfect for hero-focused landing pages.',
      features: ['Transparent to solid transition', 'Dual CTAs', 'Scroll-aware', 'Hero-integrated'],
      bestFor: 'Hero-focused landing pages with stunning visuals',
      component: LandingNav1,
      importPath: "import LandingNav1 from '@/components/layout/LandingNav1';",
    },
    {
      id: 2,
      name: 'Split CTA with Banner',
      description: 'Promotional banner at top, dual prominent CTAs for job seekers vs employers. Perfect for conversion-focused pages.',
      features: ['Top promo banner', 'Contact info visible', 'Secondary nav bar', 'Social proof badges'],
      bestFor: 'Conversion-focused landing pages with clear user paths',
      component: LandingNav2,
      importPath: "import LandingNav2 from '@/components/layout/LandingNav2';",
    },
    {
      id: 3,
      name: 'App-Style with Quick Actions',
      description: 'App-like interface with icon quick actions and inline search. Perfect for PWA app-like experience.',
      features: ['App-like interface', 'Inline search', 'Category pills', 'Notification bells'],
      bestFor: 'PWA app-like experience with interactive elements',
      component: LandingNav3,
      importPath: "import LandingNav3 from '@/components/layout/LandingNav3';",
    },
    {
      id: 4,
      name: 'Premium Dashboard-Style',
      description: 'Stats dashboard integrated into header with trust indicators. Perfect for data-driven, premium landing pages.',
      features: ['Live stats dashboard', 'Trust badges', 'Mega menu', 'Premium feel'],
      bestFor: 'Data-driven, premium landing pages with credibility focus',
      component: LandingNav4,
      importPath: "import LandingNav4 from '@/components/layout/LandingNav4';",
    },
  ];

  const handleCopyCode = (importPath: string) => {
    navigator.clipboard.writeText(importPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedDesignData = designs.find(d => d.id === selectedDesign);
  const SelectedComponent = selectedDesignData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Preview Section */}
      <div className="mb-8">
        {SelectedComponent && <SelectedComponent />}

        {/* Hero Preview Section */}
        <div className="pt-24 md:pt-32 pb-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Landing Page Navigation Preview
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Find Your Dream Job Abroad
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Currently previewing: <span className="font-bold text-white">{selectedDesignData?.name}</span>
            </p>
            <p className="text-sm text-blue-200 max-w-2xl mx-auto">
              {selectedDesignData?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Design Selector */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Landing Page Navigation
            </h2>
            <p className="text-gray-600">
              Select the design that best fits your landing page strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-xl ${
                  selectedDesign === design.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Selected Indicator */}
                {selectedDesign === design.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Design Info */}
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">
                    DESIGN {design.id}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {design.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {design.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-4">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Key Features:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {design.features.map((feature, index) => (
                      <div
                        key={index}
                        className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 text-center"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                  <p className="text-xs font-semibold text-purple-900 mb-1">
                    BEST FOR:
                  </p>
                  <p className="text-xs text-purple-700">
                    {design.bestFor}
                  </p>
                </div>

                {/* Copy Import Code */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(design.importPath);
                  }}
                  className="w-full mt-4 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Import Code
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Implementation Guide */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {/* How to Implement */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How to Implement
              </h3>
              <ol className="space-y-3 text-sm text-blue-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Select your preferred landing page navigation design above</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click "Copy Import Code" button to copy the import statement</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Replace the navigation in your landing page (app/page.tsx)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>All designs are fully responsive and mobile-optimized for PWA</span>
                </li>
              </ol>
            </div>

            {/* Design Recommendations */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-2xl">
              <h3 className="text-lg font-bold text-purple-900 mb-4">
                💡 Design Recommendations
              </h3>
              <div className="space-y-3 text-sm text-purple-800">
                <div className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span><strong>Design 1</strong> - Best for image/video hero sections</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span><strong>Design 2</strong> - Best for high-conversion campaigns</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span><strong>Design 3</strong> - Best for app-like experiences</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span><strong>Design 4</strong> - Best for trust & credibility focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Selection Display */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-200 font-medium">Currently Selected:</p>
                <p className="text-2xl font-bold">{selectedDesignData?.name}</p>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Import code:</p>
              <code className="block text-sm font-mono text-blue-300">
                {selectedDesignData?.importPath}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
