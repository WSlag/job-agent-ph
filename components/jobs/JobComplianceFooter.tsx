'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import ComplianceTooltip from '@/components/compliance/ComplianceTooltip';

export default function JobComplianceFooter() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 pt-4 mt-6">
      {/* Minimal Default State */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-gray-400" />
          <span>
            JobAgentPH is a job marketplace platform.{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Learn more
            </Link>
          </span>
          <ComplianceTooltip
            content="We connect job seekers with DMW-licensed agencies. Always verify the agency's DMW license at dmw.gov.ph"
            type="info"
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          <span className="text-xs font-medium">Safety Tips</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="font-medium text-gray-700 mb-1">Before Applying:</p>
              <ul className="space-y-1">
                <li>• Verify DMW license at{' '}
                  <a
                    href="https://dmw.gov.ph/licensed-recruitment-agencies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    dmw.gov.ph <ExternalLink size={10} className="ml-0.5" />
                  </a>
                </li>
                <li>• Never pay illegal placement fees</li>
                <li>• Visit agency at registered address only</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Need Help?</p>
              <ul className="space-y-1">
                <li>• DMW Hotline: +63 2 8721-0619</li>
                <li>• Email us:{' '}
                  <a href="mailto:contact@jobagentph.com" className="text-blue-600 hover:underline">
                    contact@jobagentph.com
                  </a>
                </li>
                <li>• <Link href="/legal/zero-fee-policy" className="text-blue-600 hover:underline">Zero-Fee Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
