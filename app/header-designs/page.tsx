'use client';

import { useState } from 'react';
import HeaderDesign1 from '@/components/layout/HeaderDesign1';
import HeaderDesign2 from '@/components/layout/HeaderDesign2';
import HeaderDesign3 from '@/components/layout/HeaderDesign3';
import HeaderDesign4 from '@/components/layout/HeaderDesign4';
import { Check, Copy } from 'lucide-react';

/**
 * Header Designs Demo Page
 * View and compare all 4 header design variations
 * Copy the design you like and implement it in your app
 */

export default function HeaderDesignsPage() {
  const [selectedDesign, setSelectedDesign] = useState(1);
  const [copied, setCopied] = useState(false);

  const designs = [
    {
      id: 1,
      name: 'Glassmorphism Modern',
      description: 'Frosted glass effect with backdrop blur, floating search bar, perfect for elegant modern apps',
      features: ['Glassmorphism effect', 'Centered search', 'Minimal icons', 'Smooth transitions'],
      component: HeaderDesign1,
      importPath: "import HeaderDesign1 from '@/components/layout/HeaderDesign1';",
    },
    {
      id: 2,
      name: 'Bold Gradient',
      description: 'Vibrant gradient background with icon navigation, dynamic and engaging Material Design inspired',
      features: ['Gradient background', 'Icon navigation', 'Secondary category bar', 'Colorful accents'],
      component: HeaderDesign2,
      importPath: "import HeaderDesign2 from '@/components/layout/HeaderDesign2';",
    },
    {
      id: 3,
      name: 'Minimalist Clean',
      description: 'Ultra-minimal design with rounded edges, soft shadows, perfect for professional clean apps',
      features: ['Minimal design', 'Rounded edges', 'Location badge', 'Subtle animations'],
      component: HeaderDesign3,
      importPath: "import HeaderDesign3 from '@/components/layout/HeaderDesign3';",
    },
    {
      id: 4,
      name: 'Dark Mode Premium',
      description: 'Dark theme with neon accents, floating elements with glow effects, premium modern feel',
      features: ['Dark theme', 'Neon glow effects', 'Premium badges', 'AI-powered search'],
      component: HeaderDesign4,
      importPath: "import HeaderDesign4 from '@/components/layout/HeaderDesign4';",
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Preview Section */}
      <div className="mb-8">
        {SelectedComponent && <SelectedComponent />}
        <div className="pt-20 md:pt-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Header Design Preview
              </h1>
              <p className="text-gray-600 mb-2">
                Currently viewing: <span className="font-semibold text-blue-600">{selectedDesignData?.name}</span>
              </p>
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                {selectedDesignData?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Selector */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Header Design</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedDesign === design.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Selected Indicator */}
                {selectedDesign === design.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Design Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Design {design.id}: {design.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {design.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {design.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Copy Import Code */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCode(design.importPath);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
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

          {/* Implementation Instructions */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              How to Implement
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Choose your preferred header design above</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Click "Copy Import Code" to copy the import statement</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Replace the current Header component in your pages with the selected design</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>All 4 designs are fully responsive and mobile-optimized</span>
              </li>
            </ol>
          </div>

          {/* Current Selection Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <p className="text-sm font-medium mb-2">Currently Selected:</p>
            <p className="text-xl font-bold">{selectedDesignData?.name}</p>
            <code className="block mt-3 p-3 bg-black/20 rounded-lg text-sm font-mono">
              {selectedDesignData?.importPath}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
