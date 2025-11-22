'use client';

import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export type TrustLevel = 'verified' | 'basic' | 'unverified';

interface TrustBadgeProps {
  level: TrustLevel;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const TRUST_CONFIG = {
  verified: {
    icon: ShieldCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'DMW Verified',
    description: 'This agency has a verified DMW license'
  },
  basic: {
    icon: Shield,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Basic Verification',
    description: 'Email verified only'
  },
  unverified: {
    icon: ShieldAlert,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Not Verified',
    description: 'DMW license not yet verified'
  }
};

const SIZE_CONFIG = {
  sm: { icon: 14, padding: 'px-1.5 py-0.5', text: 'text-xs' },
  md: { icon: 16, padding: 'px-2 py-1', text: 'text-sm' },
  lg: { icon: 20, padding: 'px-3 py-1.5', text: 'text-base' }
};

export default function TrustBadge({
  level,
  label,
  showLabel = false,
  size = 'sm',
  onClick
}: TrustBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = TRUST_CONFIG[level];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 rounded-full border transition-all
          ${config.bgColor} ${config.borderColor} ${sizeConfig.padding}
          hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${level === 'verified' ? 'blue' : level === 'basic' ? 'gray' : 'yellow'}-500
        `}
        aria-label={label || config.label}
      >
        <Icon size={sizeConfig.icon} className={config.color} />
        {showLabel && (
          <span className={`font-medium ${config.color} ${sizeConfig.text}`}>
            {label || config.label}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="font-semibold mb-1">{config.label}</div>
            <div className="text-gray-300">{config.description}</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
