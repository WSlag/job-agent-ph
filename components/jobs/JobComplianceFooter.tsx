'use client';

import React from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import ComplianceTooltip from '@/components/compliance/ComplianceTooltip';

export default function JobComplianceFooter() {
  return (
    <div className="border-t border-gray-100 pt-4 mt-6">
      {/* Minimal Default State */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
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
    </div>
  );
}
