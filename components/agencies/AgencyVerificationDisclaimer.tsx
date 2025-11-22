'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

export default function AgencyVerificationDisclaimer() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-start mb-4">
        <ShieldCheck className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">Agency Verification Status</h3>
          <p className="text-sm text-gray-600">
            JobAgentPH.com has reviewed this agency's DMW license and business permit documentation.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-800 font-semibold mb-2">What "Verified" Means:</p>
        <ul className="text-xs text-gray-700 space-y-1 ml-4">
          <li>• We have reviewed the agency's DMW license documentation</li>
          <li>• The agency provided required business permits</li>
          <li>• The agency completed our registration process</li>
        </ul>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-semibold mb-2">What "Verified" Does NOT Mean:</p>
            <ul className="text-xs text-gray-700 space-y-1 ml-4">
              <li>• We do not guarantee the agency's performance, legitimacy, or reputation</li>
              <li>• We do not endorse or recommend this agency</li>
              <li>• We are not responsible for the agency's recruitment practices</li>
              <li>• Verification does not prevent violations or ensure compliance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-gray-800 font-semibold mb-2">Your Responsibility:</p>
        <p className="text-xs text-gray-700 mb-3">
          You must independently verify this agency's credentials with the Department of Migrant Workers before engaging their services.
        </p>

        <a
          href="https://dmw.gov.ph/licensed-recruitment-agencies"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Verify at dmw.gov.ph
        </a>

        <p className="text-xs text-gray-600 mt-3 italic">
          <strong>Important:</strong> Always verify license status directly with DMW, as situations can change.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
        <p className="italic">
          <strong>About JobAgentPH.com:</strong> JobAgentPH.com is an advertising platform connecting job seekers with DMW-licensed recruitment agencies. We are NOT a recruitment agency and do not conduct recruitment activities.
        </p>
      </div>
    </div>
  );
}
