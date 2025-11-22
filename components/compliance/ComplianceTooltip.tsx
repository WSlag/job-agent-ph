'use client';

import { HelpCircle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export type TooltipType = 'info' | 'help' | 'warning';

interface ComplianceTooltipProps {
  content: string;
  type?: TooltipType;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
}

const TYPE_CONFIG = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-900'
  },
  help: {
    icon: HelpCircle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-900'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-900'
  }
};

const POSITION_CLASSES = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const ARROW_CLASSES = {
  top: 'top-full left-1/2 transform -translate-x-1/2 -mt-px border-t',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-px border-b',
  left: 'left-full top-1/2 transform -translate-y-1/2 -ml-px border-l',
  right: 'right-full top-1/2 transform -translate-y-1/2 -mr-px border-r'
};

export default function ComplianceTooltip({
  content,
  type = 'help',
  position = 'top',
  maxWidth = 'w-56'
}: ComplianceTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        type="button"
        className={`
          inline-flex items-center justify-center rounded-full
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300
          transition-colors p-0.5
        `}
        aria-label="More information"
      >
        <Icon size={14} className={config.color} />
      </button>

      {/* Tooltip */}
      {isVisible && (
        <div className={`absolute z-50 ${POSITION_CLASSES[position]} ${maxWidth} pointer-events-none`}>
          <div className={`${config.bgColor} text-white text-xs rounded-lg px-3 py-2 shadow-lg`}>
            {content}
            {/* Arrow */}
            <div className={`absolute ${ARROW_CLASSES[position]}`}>
              <div className={`border-4 border-transparent ${config.bgColor.replace('bg-', 'border-t-')}`}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
