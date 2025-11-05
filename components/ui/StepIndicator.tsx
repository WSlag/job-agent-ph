import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  /**
   * Total number of steps
   */
  steps: number;
  /**
   * Current active step (1-indexed)
   */
  currentStep: number;
  /**
   * Type of step indicator
   * - 'dots': Simple dots for carousel navigation
   * - 'numbered': Numbered steps for wizards
   */
  type?: 'dots' | 'numbered';
  /**
   * Enable click navigation
   */
  clickable?: boolean;
  /**
   * Callback when a step is clicked (only if clickable is true)
   */
  onStepClick?: (step: number) => void;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional step labels (for numbered type)
   */
  labels?: string[];
}

/**
 * StepIndicator Component
 *
 * Visual indicator for multi-step processes like carousels or wizards.
 * Supports both dot-style (for carousels) and numbered-style (for forms/wizards).
 *
 * @example
 * ```tsx
 * // Carousel dots
 * <StepIndicator steps={3} currentStep={2} type="dots" />
 *
 * // Wizard steps
 * <StepIndicator
 *   steps={5}
 *   currentStep={2}
 *   type="numbered"
 *   clickable
 *   onStepClick={(step) => console.log('Navigate to step', step)}
 * />
 * ```
 */
export default function StepIndicator({
  steps,
  currentStep,
  type = 'dots',
  clickable = false,
  onStepClick,
  size = 'md',
  className = '',
  labels,
}: StepIndicatorProps) {
  const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);

  if (type === 'dots') {
    return (
      <DotIndicator
        steps={stepsArray}
        currentStep={currentStep}
        clickable={clickable}
        onStepClick={onStepClick}
        size={size}
        className={className}
      />
    );
  }

  return (
    <NumberedIndicator
      steps={stepsArray}
      currentStep={currentStep}
      clickable={clickable}
      onStepClick={onStepClick}
      size={size}
      className={className}
      labels={labels}
    />
  );
}

/**
 * DotIndicator - Simple dots for carousel navigation
 */
interface DotIndicatorProps {
  steps: number[];
  currentStep: number;
  clickable: boolean;
  onStepClick?: (step: number) => void;
  size: 'sm' | 'md' | 'lg';
  className: string;
}

function DotIndicator({
  steps,
  currentStep,
  clickable,
  onStepClick,
  size,
  className,
}: DotIndicatorProps) {
  const sizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const gapStyles = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div
      className={`flex items-center justify-center ${gapStyles[size]} ${className}`}
      role="tablist"
      aria-label="Step indicator"
    >
      {steps.map((step) => {
        const isActive = step === currentStep;
        const isPast = step < currentStep;

        return (
          <button
            key={step}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Step ${step}`}
            disabled={!clickable}
            onClick={() => clickable && onStepClick?.(step)}
            className={`
              ${sizeStyles[size]}
              rounded-full
              transition-all
              duration-300
              ${isActive ? 'bg-primary-600 scale-125' : isPast ? 'bg-primary-400' : 'bg-gray-300'}
              ${clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${!clickable && 'pointer-events-none'}
            `}
          />
        );
      })}
    </div>
  );
}

/**
 * NumberedIndicator - Numbered steps for wizards
 */
interface NumberedIndicatorProps {
  steps: number[];
  currentStep: number;
  clickable: boolean;
  onStepClick?: (step: number) => void;
  size: 'sm' | 'md' | 'lg';
  className: string;
  labels?: string[];
}

function NumberedIndicator({
  steps,
  currentStep,
  clickable,
  onStepClick,
  size,
  className,
  labels,
}: NumberedIndicatorProps) {
  const sizeStyles = {
    sm: { circle: 'w-8 h-8 text-xs', label: 'text-xs', line: 'h-0.5' },
    md: { circle: 'w-10 h-10 text-sm', label: 'text-sm', line: 'h-1' },
    lg: { circle: 'w-12 h-12 text-base', label: 'text-base', line: 'h-1' },
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isPast = step < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={labels?.[index] || `Step ${step}`}
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick?.(step)}
                  className={`
                    ${sizeStyles[size].circle}
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      isPast
                        ? 'bg-success-500 text-white'
                        : isActive
                        ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                        : 'bg-gray-200 text-gray-500'
                    }
                    ${clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                    ${!clickable && !isActive && !isPast && 'pointer-events-none'}
                  `}
                >
                  {isPast ? (
                    <Check size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
                  ) : (
                    step
                  )}
                </button>

                {/* Optional Label */}
                {labels && labels[index] && (
                  <span
                    className={`
                      ${sizeStyles[size].label}
                      font-medium
                      text-center
                      max-w-[80px]
                      ${isActive ? 'text-primary-600' : isPast ? 'text-gray-700' : 'text-gray-400'}
                    `}
                  >
                    {labels[index]}
                  </span>
                )}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`
                    flex-1
                    ${sizeStyles[size].line}
                    mx-2
                    rounded-full
                    transition-all
                    duration-500
                    ${step < currentStep ? 'bg-success-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * VerticalStepIndicator Component
 *
 * Vertical layout for sidebar navigation or mobile views
 *
 * @example
 * ```tsx
 * <VerticalStepIndicator
 *   steps={5}
 *   currentStep={2}
 *   labels={['Personal Info', 'Contact', 'Professional', 'Skills', 'Documents']}
 * />
 * ```
 */
interface VerticalStepIndicatorProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  clickable?: boolean;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function VerticalStepIndicator({
  steps,
  currentStep,
  labels,
  clickable = false,
  onStepClick,
  className = '',
}: VerticalStepIndicatorProps) {
  const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <div className={`flex flex-col ${className}`}>
      {stepsArray.map((step, index) => {
        const isActive = step === currentStep;
        const isPast = step < currentStep;
        const isLast = index === stepsArray.length - 1;

        return (
          <div key={step} className="flex items-start gap-3">
            {/* Left side - Circle and Line */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={labels?.[index] || `Step ${step}`}
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(step)}
                className={`
                  w-10 h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-semibold
                  text-sm
                  transition-all
                  duration-300
                  ${
                    isPast
                      ? 'bg-success-500 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  ${!clickable && !isActive && !isPast && 'pointer-events-none'}
                `}
              >
                {isPast ? <Check size={16} /> : step}
              </button>

              {!isLast && (
                <div
                  className={`
                    w-1
                    flex-1
                    min-h-[40px]
                    rounded-full
                    transition-all
                    duration-500
                    ${step < currentStep ? 'bg-success-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>

            {/* Right side - Label and Description */}
            <div className="flex-1 pb-8">
              {labels && labels[index] && (
                <h4
                  className={`
                    text-sm
                    font-semibold
                    ${isActive ? 'text-primary-600' : isPast ? 'text-gray-700' : 'text-gray-400'}
                  `}
                >
                  {labels[index]}
                </h4>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
