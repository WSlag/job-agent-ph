import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  /**
   * Icon or illustration (emoji, SVG, or Lucide icon)
   */
  icon?: string | React.ReactElement;
  /**
   * Main heading
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Primary action button
   */
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /**
   * Secondary action link
   */
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
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
 * EmptyState Component
 *
 * Display when there's no data to show. Provides context and actions
 * to help users understand why it's empty and what they can do next.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📭"
 *   title="No applications yet"
 *   description="Start your OFW journey by applying to your first job!"
 *   primaryAction={{
 *     label: "Browse Jobs",
 *     href: "/jobs"
 *   }}
 *   secondaryAction={{
 *     label: "View Tips",
 *     href: "/learning-hub"
 *   }}
 * />
 * ```
 */
export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const sizeStyles = {
    sm: {
      container: 'py-8',
      icon: 'text-4xl mb-3',
      iconSize: 32,
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-2',
    },
    md: {
      container: 'py-12',
      icon: 'text-6xl mb-4',
      iconSize: 48,
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-3',
    },
    lg: {
      container: 'py-16',
      icon: 'text-8xl mb-6',
      iconSize: 64,
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-4',
    },
  };

  const styles = sizeStyles[size];

  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a string (emoji)
    if (typeof icon === 'string') {
      return <div className={styles.icon}>{icon}</div>;
    }

    // If icon is a Lucide icon component
    return (
      <div className="text-gray-400 mb-4">
        {React.cloneElement(icon as React.ReactElement<any>, { size: styles.iconSize, strokeWidth: 1.5 })}
      </div>
    );
  };

  return (
    <div
      className={`
        ${styles.container}
        flex
        flex-col
        items-center
        justify-center
        text-center
        max-w-md
        mx-auto
        ${className}
      `}
    >
      {/* Icon/Illustration */}
      {renderIcon()}

      {/* Content */}
      <div className={styles.spacing}>
        <h3 className={`${styles.title} font-semibold text-gray-900`}>
          {title}
        </h3>

        {description && (
          <p className={`${styles.description} text-gray-600 max-w-sm`}>
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          {primaryAction && (
            <>
              {primaryAction.href ? (
                <Link href={primaryAction.href}>
                  <Button variant="primary" size="md">
                    {primaryAction.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              )}
            </>
          )}

          {secondaryAction && (
            <>
              {secondaryAction.href ? (
                <Link
                  href={secondaryAction.href}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {secondaryAction.label}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty states for common scenarios
 */

export function NoJobsEmptyState() {
  return (
    <EmptyState
      icon="🔍"
      title="No jobs found"
      description="Try adjusting your search filters or check back later for new opportunities."
      primaryAction={{
        label: "Clear Filters",
        href: "/jobs",
      }}
      secondaryAction={{
        label: "Browse All Jobs",
        href: "/jobs",
      }}
    />
  );
}

export function NoApplicationsEmptyState() {
  return (
    <EmptyState
      icon="📭"
      title="No applications yet"
      description="Start your OFW journey by applying to your first job!"
      primaryAction={{
        label: "Browse Jobs",
        href: "/jobs",
      }}
      secondaryAction={{
        label: "View Tips",
        href: "/learning-hub",
      }}
    />
  );
}

export function NoMessagesEmptyState() {
  return (
    <EmptyState
      icon="💬"
      title="No messages"
      description="Your conversations with agencies will appear here."
      primaryAction={{
        label: "Find Jobs",
        href: "/jobs",
      }}
    />
  );
}

export function NoSavedJobsEmptyState() {
  return (
    <EmptyState
      icon="⭐"
      title="No saved jobs"
      description="Save jobs you're interested in to easily find them later."
      primaryAction={{
        label: "Browse Jobs",
        href: "/jobs",
      }}
    />
  );
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon="🔔"
      title="No notifications"
      description="You're all caught up! Notifications will appear here."
      size="sm"
    />
  );
}
