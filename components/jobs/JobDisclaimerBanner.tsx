'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function JobDisclaimerBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">About This Job Posting</h3>

          <div className="space-y-2 text-xs text-gray-700">
            <p>
              <strong className="text-gray-900">JobAgentPH.com Role:</strong> We provide advertising space only. We do NOT recruit, hire, or place workers.
            </p>

            <p>
              <strong className="text-gray-900">Agency Responsibility:</strong> The recruitment agency is solely responsible for this recruitment, including screening, hiring, deployment, and worker welfare.
            </p>

            <p>
              <strong className="text-gray-900">Your Responsibility:</strong> Verify this agency's DMW license and credentials before applying.
            </p>

            <p>
              <strong className="text-gray-900">No Placement Fees:</strong> Licensed agencies generally CANNOT charge placement fees. Report any fee requests to DMW.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-800 font-semibold mb-2">Verify Before Applying:</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Check DMW license:{' '}
                <a
                  href="https://dmw.gov.ph/licensed-recruitment-agencies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  dmw.gov.ph <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>• Visit agency only at registered address</li>
              <li>• Confirm job order is DMW-approved</li>
              <li>• Research destination country labor laws</li>
            </ul>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200 text-xs">
            <p className="text-gray-700">
              <strong>Report Concerns:</strong> DMW: +63 2 8721-0619 | JobAgentPH:{' '}
              <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">
                contact@jobagentph.com
              </a>
            </p>
          </div>

          <div className="mt-3 text-xs text-gray-600 italic">
            By applying, you acknowledge you will deal directly with the recruitment agency and have verified their credentials.
          </div>
        </div>
      </div>
    </div>
  );
}
