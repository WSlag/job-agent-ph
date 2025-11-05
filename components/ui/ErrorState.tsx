import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Home, HelpCircle } from 'lucide-react';
import Button from './Button';
import Link from 'next/link';

interface ErrorStateProps {
  /**
   * Error icon (defaults to AlertTriangle)
   */
  icon?: React.ReactElement;
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message
   */
  message: string;
  /**
   * Error code (optional)
   */
  errorCode?: string;
  /**
   * Retry callback
   */
  onRetry?: () => void;
  /**
   * Additional action buttons
   */
  actions?: Array<{
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Show support link
   */
  showSupport?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ErrorState Component
 *
 * Display error messages with retry options and helpful actions.
 * Handles network errors, API failures, and general error states.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   message="Couldn't load jobs"
 *   errorCode="NET_001"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export default function ErrorState({
  icon,
  title = 'Oops! Something went wrong',
  message,
  errorCode,
  onRetry,
  actions,
  size = 'md',
  showSupport = true,
  className = '',
}: ErrorStateProps) {
  const sizeStyles = {
    sm: {
      container: 'py-8',
      iconSize: 32,
      title: 'text-lg',
      message: 'text-sm',
      spacing: 'space-y-2',
    },
    md: {
      container: 'py-12',
      iconSize: 48,
      title: 'text-xl',
      message: 'text-base',
      spacing: 'space-y-3',
    },
    lg: {
      container: 'py-16',
      iconSize: 64,
      title: 'text-2xl',
      message: 'text-lg',
      spacing: 'space-y-4',
    },
  };

  const styles = sizeStyles[size];

  const defaultIcon = icon || <AlertTriangle size={styles.iconSize} />;

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
      {/* Error Icon */}
      <div className="text-error-500 mb-4">
        {React.cloneElement(defaultIcon, { size: styles.iconSize })}
      </div>

      {/* Content */}
      <div className={styles.spacing}>
        <h3 className={`${styles.title} font-semibold text-gray-900`}>
          {title}
        </h3>

        <p className={`${styles.message} text-gray-600 max-w-sm`}>
          {message}
        </p>

        {errorCode && (
          <p className="text-xs text-gray-500 font-mono mt-2">
            Error Code: {errorCode}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            icon={RefreshCw}
            iconPosition="left"
          >
            Try Again
          </Button>
        )}

        {actions?.map((action, index) => (
          <React.Fragment key={index}>
            {action.href ? (
              <Link href={action.href}>
                <Button variant={action.variant || 'outline'} size="md">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant={action.variant || 'outline'}
                size="md"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Support Link */}
      {showSupport && (
        <div className="mt-6">
          <Link
            href="/support"
            className="text-sm text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
          >
            <HelpCircle size={14} />
            Contact Support
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured error states for common scenarios
 */

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<WifiOff size={48} />}
      title="No internet connection"
      message="Please check your internet connection and try again."
      errorCode="NET_001"
      onRetry={onRetry}
      actions={[
        {
          label: "Go Home",
          href: "/",
          variant: "outline",
        },
      ]}
    />
  );
}

export function NotFoundErrorState() {
  return (
    <ErrorState
      icon={<AlertTriangle size={48} />}
      title="Page not found"
      message="The page you're looking for doesn't exist or has been moved."
      errorCode="404"
      actions={[
        {
          label: "Go Home",
          href: "/",
          variant: "primary",
        },
        {
          label: "Browse Jobs",
          href: "/jobs",
          variant: "outline",
        },
      ]}
    />
  );
}

export function UnauthorizedErrorState() {
  return (
    <ErrorState
      icon={<AlertTriangle size={48} />}
      title="Access Denied"
      message="You don't have permission to access this page. Please sign in or contact support."
      errorCode="403"
      actions={[
        {
          label: "Sign In",
          href: "/login",
          variant: "primary",
        },
        {
          label: "Go Home",
          href: "/",
          variant: "outline",
        },
      ]}
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<AlertTriangle size={48} />}
      title="Server Error"
      message="Something went wrong on our end. Please try again in a few moments."
      errorCode="500"
      onRetry={onRetry}
      actions={[
        {
          label: "Go Home",
          href: "/",
          variant: "outline",
        },
      ]}
    />
  );
}

export function DataLoadErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Couldn't load data"
      message="We couldn't fetch the data you requested. Please try again."
      errorCode="DATA_001"
      onRetry={onRetry}
      actions={[
        {
          label: "Browse Saved Jobs",
          href: "/saved-jobs",
          variant: "outline",
        },
      ]}
    />
  );
}

export function OfflineErrorState() {
  return (
    <ErrorState
      icon={<WifiOff size={48} />}
      title="You're offline"
      message="Some features may not be available. Check your connection to use all features."
      errorCode="OFFLINE"
      showSupport={false}
      actions={[
        {
          label: "View Saved Jobs",
          href: "/saved-jobs",
          variant: "outline",
        },
      ]}
    />
  );
}
