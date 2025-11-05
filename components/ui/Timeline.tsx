import React, { useState } from 'react';
import { Check, Clock, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  status: 'completed' | 'scheduled' | 'in_progress' | 'pending';
  date?: Date | string;
  details?: string;
  documents?: {
    name: string;
    url: string;
    uploadedAt?: Date | string;
  }[];
  location?: string;
  notes?: string;
}

interface TimelineProps {
  /**
   * Array of timeline steps
   */
  steps: TimelineStep[];
  /**
   * Current active step (1-indexed)
   */
  currentStep?: number;
  /**
   * Whether steps are expandable
   */
  expandable?: boolean;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Timeline Component
 *
 * Visual timeline for showing progress through multi-step processes.
 * Perfect for deployment tracking, application status, and historical events.
 *
 * @example
 * ```tsx
 * <Timeline
 *   steps={deploymentSteps}
 *   currentStep={3}
 *   expandable
 * />
 * ```
 */
export default function Timeline({
  steps,
  currentStep,
  expandable = false,
  size = 'md',
  className = '',
}: TimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    if (!expandable) return;

    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepIcon = (status: TimelineStep['status']) => {
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

    switch (status) {
      case 'completed':
        return <Check size={iconSize} className="text-white" />;
      case 'scheduled':
        return <Clock size={iconSize} className="text-white" />;
      case 'in_progress':
        return <Clock size={iconSize} className="text-white" />;
      case 'pending':
        return <Circle size={iconSize} className="text-gray-400" />;
      default:
        return <Circle size={iconSize} className="text-gray-400" />;
    }
  };

  const getStepColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'scheduled':
        return 'bg-primary-600';
      case 'in_progress':
        return 'bg-warning-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getLineColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'scheduled':
      case 'in_progress':
        return 'bg-primary-300';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const sizeStyles = {
    sm: { circle: 'w-8 h-8', title: 'text-sm', detail: 'text-xs', line: 'w-0.5' },
    md: { circle: 'w-10 h-10', title: 'text-base', detail: 'text-sm', line: 'w-1' },
    lg: { circle: 'w-12 h-12', title: 'text-lg', detail: 'text-base', line: 'w-1' },
  };

  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, index) => {
        const isExpanded = expandedSteps.has(step.id);
        const isLast = index === steps.length - 1;
        const hasDetails = !!(step.details || step.documents?.length || step.location || step.notes);

        return (
          <div key={step.id} className="relative flex gap-4">
            {/* Left side - Icon and connecting line */}
            <div className="flex flex-col items-center">
              {/* Icon Circle */}
              <div
                className={`
                  ${sizeStyles[size].circle}
                  ${getStepColor(step.status)}
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                  transition-all
                  duration-300
                  ${step.status === 'in_progress' ? 'ring-4 ring-warning-200' : ''}
                `}
              >
                {getStepIcon(step.status)}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`
                    ${sizeStyles[size].line}
                    flex-1
                    min-h-[60px]
                    ${getLineColor(step.status)}
                    transition-all
                    duration-500
                  `}
                />
              )}
            </div>

            {/* Right side - Content */}
            <div className={`flex-1 ${!isLast ? 'pb-8' : 'pb-2'}`}>
              <button
                type="button"
                onClick={() => hasDetails && toggleStep(step.id)}
                disabled={!hasDetails || !expandable}
                className={`
                  w-full
                  text-left
                  ${hasDetails && expandable ? 'cursor-pointer hover:bg-gray-50 -ml-2 pl-2 pr-2 py-1 rounded-lg transition-colors' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4
                      className={`
                        ${sizeStyles[size].title}
                        font-semibold
                        ${
                          step.status === 'completed'
                            ? 'text-gray-900'
                            : step.status === 'in_progress'
                            ? 'text-warning-700'
                            : step.status === 'scheduled'
                            ? 'text-primary-700'
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step.title}
                    </h4>

                    {step.date && (
                      <p className={`${sizeStyles[size].detail} text-gray-600 mt-0.5`}>
                        {typeof step.date === 'string'
                          ? step.date
                          : step.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                      </p>
                    )}

                    {step.location && (
                      <p className={`${sizeStyles[size].detail} text-gray-500 mt-0.5`}>
                        📍 {step.location}
                      </p>
                    )}
                  </div>

                  {hasDetails && expandable && (
                    <div className="mt-1">
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Expandable Details */}
              {hasDetails && isExpanded && (
                <div className="mt-3 space-y-3 pl-2">
                  {step.details && (
                    <p className={`${sizeStyles[size].detail} text-gray-700`}>
                      {step.details}
                    </p>
                  )}

                  {step.notes && (
                    <div className="bg-blue-50 border-l-4 border-primary-500 p-3 rounded">
                      <p className={`${sizeStyles[size].detail} text-gray-700`}>
                        💡 {step.notes}
                      </p>
                    </div>
                  )}

                  {step.documents && step.documents.length > 0 && (
                    <div className="space-y-2">
                      <p className={`${sizeStyles[size].detail} font-medium text-gray-700`}>
                        Documents:
                      </p>
                      {step.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            ${sizeStyles[size].detail}
                            flex
                            items-center
                            gap-2
                            text-primary-600
                            hover:text-primary-700
                            hover:underline
                          `}
                        >
                          📄 {doc.name}
                          {doc.uploadedAt && (
                            <span className="text-gray-500">
                              ({typeof doc.uploadedAt === 'string'
                                ? doc.uploadedAt
                                : doc.uploadedAt.toLocaleDateString()})
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
