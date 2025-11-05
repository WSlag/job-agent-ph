import React from 'react';

interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Optional label to display
   */
  label?: string;
  /**
   * Color variant for the progress bar
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gold';
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Show percentage text inside the bar
   */
  showPercentage?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ProgressBar Component
 *
 * A customizable progress bar for showing completion percentages.
 * Used for profile completion, deployment tracking, and other progress indicators.
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} label="Profile Complete" variant="success" />
 * <ProgressBar value={60} showPercentage size="lg" />
 * ```
 */
export default function ProgressBar({
  value,
  label,
  variant = 'primary',
  size = 'md',
  showPercentage = false,
  className = '',
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantStyles = {
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-error-500',
    gold: 'bg-gold-500',
  };

  const bgStyles = {
    primary: 'bg-primary-100',
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    danger: 'bg-error-100',
    gold: 'bg-gold-100',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`w-full ${bgStyles[variant]} rounded-full overflow-hidden ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${clampedValue}%`}
      >
        {/* Progress Fill */}
        <div
          className={`h-full ${variantStyles[variant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        >
          {/* Optional inner glow effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20" />
        </div>
      </div>

      {/* Optional percentage text below for small sizes */}
      {size === 'sm' && showPercentage && !label && (
        <div className="mt-1 text-right">
          <span className="text-xs font-medium text-gray-600">
            {clampedValue}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * ProgressBarWithSteps Component
 *
 * A progress bar with discrete step indicators
 * Useful for multi-step forms or wizards
 *
 * @example
 * ```tsx
 * <ProgressBarWithSteps totalSteps={5} currentStep={3} />
 * ```
 */
interface ProgressBarWithStepsProps {
  totalSteps: number;
  currentStep: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gold';
  className?: string;
}

export function ProgressBarWithSteps({
  totalSteps,
  currentStep,
  variant = 'primary',
  className = '',
}: ProgressBarWithStepsProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
      <ProgressBar value={percentage} variant={variant} size="md" />
    </div>
  );
}
