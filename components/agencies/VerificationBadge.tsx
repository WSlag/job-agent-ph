'use client';

import { Shield, ShieldCheck, ShieldAlert, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

interface VerificationBadgeProps {
  status: VerificationStatus;
  dmwLicense?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
  verified: {
    icon: ShieldCheck,
    label: 'DMW Verified',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'This agency has a verified DMW license for overseas employment recruitment'
  },
  pending: {
    icon: Shield,
    label: 'Verification Pending',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'DMW license verification is in progress'
  },
  unverified: {
    icon: ShieldAlert,
    label: 'Not Verified',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'DMW license not yet verified by JobAgentPH'
  }
};

const SIZE_CONFIG = {
  sm: { icon: 14, text: 'text-xs', padding: 'px-2 py-1' },
  md: { icon: 16, text: 'text-sm', padding: 'px-3 py-1.5' },
  lg: { icon: 18, text: 'text-base', padding: 'px-4 py-2' }
};

export default function VerificationBadge({
  status,
  dmwLicense,
  showDetails = false,
  size = 'md'
}: VerificationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          inline-flex items-center gap-2 rounded-full border
          ${config.bgColor} ${config.borderColor} ${sizeConfig.padding}
        `}
      >
        <Icon size={sizeConfig.icon} className={config.color} />
        <span className={`font-medium ${config.color} ${sizeConfig.text}`}>
          {config.label}
        </span>
      </div>

      {/* Detailed Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl">
            <div className="flex items-start gap-2 mb-2">
              <Icon size={18} className="text-white flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">{config.label}</div>
                <div className="text-gray-300 text-xs leading-relaxed">
                  {config.description}
                </div>
              </div>
            </div>

            {dmwLicense && status === 'verified' && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-400">DMW License No.</div>
                <div className="font-mono text-xs font-medium">{dmwLicense}</div>
              </div>
            )}

            {showDetails && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                <Link
                  href="https://dmw.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors pointer-events-auto"
                >
                  Verify independently at dmw.gov.ph
                  <ExternalLink size={12} />
                </Link>
              </div>
            )}

            {/* Arrow */}
            <div className="absolute top-full left-4 transform -mt-px">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
