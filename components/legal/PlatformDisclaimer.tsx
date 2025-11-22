'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function PlatformDisclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Platform Disclaimer</h3>
          <p className="text-sm text-gray-800 mb-3">
            <strong>JobAgentPH.com is a job marketplace platform, NOT a recruitment agency.</strong> We are not engaged in the recruitment, placement, or referral of workers. All recruitment activities are conducted solely by Department of Migrant Workers (DMW) licensed recruitment agencies.
          </p>
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Important:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Verify all agency credentials at:{' '}
                <a
                  href="https://dmw.gov.ph/licensed-recruitment-agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  dmw.gov.ph
                </a>
              </li>
              <li>• Never pay illegal placement fees</li>
              <li>• Report suspicious activity to DMW: +63 2 8721-0619</li>
              <li>• JobAgentPH.com is not responsible for agency actions or employment outcomes</li>
            </ul>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <strong>Use at your own risk. Always verify agency credentials independently.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
