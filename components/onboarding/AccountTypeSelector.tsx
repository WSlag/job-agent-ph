'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Building2, User, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

export type AccountType = 'job_seeker' | 'agency' | 'current_ofw';

interface AccountTypeOption {
  id: AccountType;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const accountTypes: AccountTypeOption[] = [
  {
    id: 'job_seeker',
    icon: <Target size={48} />,
    title: 'Job Seeker',
    description: 'Looking for overseas opportunities and want to connect with verified agencies',
    badge: 'Most Popular',
  },
  {
    id: 'agency',
    icon: <Building2 size={48} />,
    title: 'Recruitment Agency',
    description: 'Post jobs, find qualified candidates, and manage recruitment process',
  },
  {
    id: 'current_ofw',
    icon: <User size={48} />,
    title: 'Current OFW',
    description: 'Already working abroad and looking for new opportunities or career growth',
  },
];

interface AccountTypeSelectorProps {
  /**
   * Callback when account type is selected and continue is clicked
   */
  onSelect: (type: AccountType) => void;
  /**
   * Optional callback for skip action
   */
  onSkip?: () => void;
  /**
   * Whether to show skip option
   */
  showSkip?: boolean;
  /**
   * Default selected type
   */
  defaultType?: AccountType;
}

/**
 * AccountTypeSelector Component
 *
 * Allows users to choose their account type during signup.
 * Different onboarding paths per role.
 *
 * Flow:
 * - Shown during signup flow, NOT as landing page
 * - Can be embedded in signup modal or full page
 * - Default selection: Job Seeker (most common)
 * - Skip option: "Continue as Job Seeker" (quick path)
 *
 * @example
 * ```tsx
 * <AccountTypeSelector
 *   onSelect={(type) => {
 *     console.log('Selected:', type);
 *     // Proceed to profile setup or redirect
 *   }}
 *   defaultType="job_seeker"
 *   showSkip
 * />
 * ```
 */
export default function AccountTypeSelector({
  onSelect,
  onSkip,
  showSkip = true,
  defaultType = 'job_seeker',
}: AccountTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<AccountType>(defaultType);

  const handleContinue = () => {
    onSelect(selectedType);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Default: continue as job seeker
      onSelect('job_seeker');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Account Type
        </h1>
        <p className="text-lg text-gray-600">
          Select the option that best describes you
        </p>
      </div>

      {/* Account Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {accountTypes.map((type) => {
          const isSelected = selectedType === type.id;

          return (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative
                p-6
                rounded-2xl
                border-2
                text-left
                transition-all
                duration-300
                ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                }
              `}
            >
              {/* Badge */}
              {type.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gold-500 text-white text-xs font-semibold rounded-full shadow-md">
                    {type.badge}
                  </span>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-white" />
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`
                  mb-4
                  ${isSelected ? 'text-primary-600' : 'text-gray-400'}
                  transition-colors
                `}
              >
                {type.icon}
              </div>

              {/* Content */}
              <h3
                className={`
                  text-xl
                  font-semibold
                  mb-2
                  ${isSelected ? 'text-primary-900' : 'text-gray-900'}
                `}
              >
                {type.title}
              </h3>

              <p
                className={`
                  text-sm
                  ${isSelected ? 'text-primary-700' : 'text-gray-600'}
                `}
              >
                {type.description}
              </p>

              {/* Agency Note */}
              {type.id === 'agency' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    ℹ️ Requires agency verification
                  </p>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          className="min-w-[200px]"
        >
          Continue
        </Button>

        {showSkip && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
          >
            Continue as Job Seeker →
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 Don't worry, you can change this later in your settings
        </p>
      </div>
    </div>
  );
}
