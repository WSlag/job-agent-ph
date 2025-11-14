'use client';

import { Download, Check, Loader2 } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { COLORS } from '@/lib/colors';

interface InstallPWAButtonProps {
  /**
   * Show only icon (for mobile/compact views)
   */
  iconOnly?: boolean;

  /**
   * Button size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when install is triggered
   */
  onInstallClick?: () => void;

  /**
   * Callback when install is completed
   */
  onInstallComplete?: () => void;
}

/**
 * InstallPWAButton Component
 *
 * Displays a button to install the PWA. Only shows when installation is available.
 * Follows best practices from Google Web.dev for PWA installation UX.
 *
 * Features:
 * - Auto-detects installability via beforeinstallprompt event
 * - Shows loading state during installation
 * - Displays success state after installation
 * - Responsive (icon-only mode for mobile)
 * - Accessible (ARIA labels, keyboard navigation)
 *
 * @example
 * ```tsx
 * // Desktop header - show full button
 * <InstallPWAButton />
 *
 * // Mobile header - show icon only
 * <InstallPWAButton iconOnly />
 * ```
 */
export default function InstallPWAButton({
  iconOnly = false,
  size = 'md',
  className = '',
  onInstallClick,
  onInstallComplete,
}: InstallPWAButtonProps) {
  const {
    canInstall,
    isInstalled,
    promptInstall,
    isInstalling,
    platform,
  } = useInstallPrompt();

  // Don't render if not installable or already installed
  if (!canInstall && !isInstalled) {
    return null;
  }

  // Don't render on non-supported platforms
  if (platform !== 'chrome') {
    return null;
  }

  const handleClick = async () => {
    // Call custom callback
    onInstallClick?.();

    // Trigger install prompt
    await promptInstall();

    // Call complete callback if installed
    if (isInstalled) {
      onInstallComplete?.();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Icon size
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  // Get appropriate icon
  const Icon = isInstalled ? Check : isInstalling ? Loader2 : Download;

  // Button text
  const buttonText = isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install App';

  // Icon only mode (for mobile)
  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        disabled={isInstalling || isInstalled}
        className={`
          inline-flex items-center justify-center
          rounded-lg font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${sizeClasses[size]}
          ${isInstalled
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
          }
          ${isInstalling ? 'cursor-wait' : ''}
          ${className}
        `}
        style={{
          backgroundColor: isInstalled ? COLORS.STATUS.SUCCESS_LIGHT : COLORS.PRIMARY.BLUE,
          color: isInstalled ? COLORS.STATUS.SUCCESS : '#ffffff',
        }}
        aria-label={buttonText}
        title={buttonText}
      >
        <Icon
          size={iconSizes[size]}
          className={isInstalling ? 'animate-spin' : ''}
        />
      </button>
    );
  }

  // Full button with text
  return (
    <button
      onClick={handleClick}
      disabled={isInstalling || isInstalled}
      className={`
        inline-flex items-center gap-2
        rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses[size]}
        ${isInstalled
          ? 'bg-green-100 text-green-700 cursor-default'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
        }
        ${isInstalling ? 'cursor-wait opacity-75' : ''}
        ${className}
      `}
      style={{
        backgroundColor: isInstalled ? COLORS.STATUS.SUCCESS_LIGHT : COLORS.PRIMARY.BLUE,
        color: isInstalled ? COLORS.STATUS.SUCCESS : '#ffffff',
      }}
      aria-label={buttonText}
      aria-live="polite"
    >
      <Icon
        size={iconSizes[size]}
        className={isInstalling ? 'animate-spin' : ''}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">
        {buttonText}
      </span>
    </button>
  );
}
