'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import ComplianceTooltip from '@/components/compliance/ComplianceTooltip';

interface AgencyComplianceFooterProps {
  verified?: boolean;
}

export default function AgencyComplianceFooter({ verified = false }: AgencyComplianceFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 pt-4 mt-6">
      {/* Minimal Default State */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield size={14} className={verified ? 'text-blue-500' : 'text-gray-400'} />
          <span>
            {verified ? 'DMW license verified by JobAgentPH' : 'Always verify DMW license independently'}.{' '}
            <a
              href="https://dmw.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              dmw.gov.ph <ExternalLink size={10} className="ml-0.5" />
            </a>
          </span>
          <ComplianceTooltip
            content={
              verified
                ? 'We verified this agency\'s DMW license. However, you should still do your own verification.'
                : 'Verification means we checked their license. It does NOT guarantee job quality or safety.'
            }
            type="info"
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          <span className="text-xs font-medium">Know Your Rights</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="font-medium text-gray-700 mb-1">Red Flags:</p>
              <ul className="space-y-1">
                <li>• Requests for illegal placement fees</li>
                <li>• Unregistered office address</li>
                <li>• Pressure to sign without reading</li>
                <li>• Withholding of passports or documents</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Your Rights:</p>
              <ul className="space-y-1">
                <li>• Free access to your employment contract</li>
                <li>• Zero placement fees (for most countries)</li>
                <li>• DMW-approved job orders only</li>
                <li>• Right to report violations: +63 2 8721-0619</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-500 italic mt-2">
            JobAgentPH is a job marketplace platform only. We do NOT recruit, hire, or place workers.
          </p>
        </div>
      )}
    </div>
  );
}
