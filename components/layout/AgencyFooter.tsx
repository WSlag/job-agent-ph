'use client';

import React from 'react';
import { Mail } from 'lucide-react';

export default function AgencyFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* About Section - Single Column */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-bold text-lg mb-4">About JobAgentPH</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed max-w-2xl">
            A job marketplace platform connecting Filipino job seekers with DMW-licensed recruitment agencies for overseas employment opportunities.
          </p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0 text-blue-600" />
            <a
              href="mailto:contact@jobagentph.com"
              className="text-sm hover:text-gray-900 transition-colors"
            >
              contact@jobagentph.com
            </a>
          </div>
        </div>

        {/* Platform Disclaimer */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="text-center">
            <h4 className="text-gray-900 font-semibold mb-2 text-sm">Platform Disclaimer</h4>
            <p className="text-gray-600 text-xs max-w-4xl mx-auto leading-relaxed">
              JobAgentPH is a job marketplace platform, NOT a recruitment agency. We are not engaged in the recruitment, placement, or referral of workers. All recruitment activities are conducted solely by Department of Migrant Workers (DMW) licensed recruitment agencies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
