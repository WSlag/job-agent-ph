'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useFacebookBrowser } from '@/hooks/useFacebookBrowser';
import { useAuth } from '@/contexts/AuthContext';
import {
  getOpenInBrowserUrl,
  copyToClipboard,
  getCurrentUrl,
  getDevicePlatform,
} from '@/lib/browser-detection';

/**
 * Pending action data for Apply/Message interception
 */
interface PendingActionData {
  jobId?: string;
  jobTitle?: string;
  agencyId?: string;
}

/**
 * Action types that can be intercepted
 */
type InterceptableAction = 'apply' | 'message' | 'signup' | 'signin';

/**
 * Install Flow Context type
 */
interface InstallFlowContextType {
  // State
  isInAppBrowser: boolean;
  browserName: 'facebook' | 'instagram' | 'tiktok' | 'other' | null;
  platform: 'ios' | 'android' | 'desktop';
  isPWAInstalled: boolean;
  isAuthenticated: boolean;
  showWelcomeModal: boolean;
  showApplyModal: boolean;
  showBanner: boolean;
  pendingAction: InterceptableAction | null;
  pendingActionData: PendingActionData | null;
  hasContinuedAnyway: boolean;

  // Actions
  dismissWelcome: () => void;
  dismissBanner: () => void;
  /**
   * Intercept an action and show modal
   * @param action - The action type being attempted
   * @param data - Additional data about the action
   * @param forceIntercept - If true, always show modal even if user previously chose "continue anyway"
   * @returns true if action should proceed, false if intercepted
   */
  interceptAction: (action: InterceptableAction, data?: PendingActionData, forceIntercept?: boolean) => boolean;
  proceedWithAction: () => void;
  cancelAction: () => void;
  openInExternalBrowser: () => void;
  continueAnyway: () => void;
}

const InstallFlowContext = createContext<InstallFlowContextType | undefined>(undefined);

interface InstallFlowProviderProps {
  children: ReactNode;
}

/**
 * InstallFlowProvider
 *
 * Provides global state for managing the Facebook browser detection flow.
 * Shows modals and banners to guide users to open the app in Chrome/Safari.
 */
export function InstallFlowProvider({ children }: InstallFlowProviderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const {
    isInAppBrowser,
    browserName,
    platform,
    isPWAInstalled,
    isDismissed,
    dismissPrompt,
    continueAnyway: hookContinueAnyway,
    hasContinuedAnyway,
  } = useFacebookBrowser();

  // Check if user is authenticated (logged in or registered)
  const isAuthenticated = !!user;

  // Modal states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Pending action state
  const [pendingAction, setPendingAction] = useState<InterceptableAction | null>(null);
  const [pendingActionData, setPendingActionData] = useState<PendingActionData | null>(null);

  // Check if we should show the welcome modal on homepage
  useEffect(() => {
    // Only show on homepage
    const isHomepage = pathname === '/';

    // Show welcome modal conditions:
    // - User is in an in-app browser
    // - Not dismissed
    // - PWA not installed
    // - User hasn't chosen to continue anyway
    // - On homepage
    if (
      isInAppBrowser &&
      !isDismissed &&
      !isPWAInstalled &&
      !hasContinuedAnyway &&
      isHomepage
    ) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowWelcomeModal(false);
    }
  }, [isInAppBrowser, isDismissed, isPWAInstalled, hasContinuedAnyway, pathname]);

  // Show banner after welcome modal is dismissed
  useEffect(() => {
    if (
      isInAppBrowser &&
      isDismissed &&
      !isPWAInstalled &&
      !hasContinuedAnyway &&
      !showWelcomeModal &&
      !bannerDismissed
    ) {
      setShowBanner(true);
    } else if (hasContinuedAnyway || isPWAInstalled) {
      setShowBanner(false);
    }
  }, [isInAppBrowser, isDismissed, isPWAInstalled, hasContinuedAnyway, showWelcomeModal, bannerDismissed]);

  /**
   * Dismiss the welcome modal
   */
  const dismissWelcome = useCallback(() => {
    dismissPrompt();
    setShowWelcomeModal(false);
  }, [dismissPrompt]);

  /**
   * Dismiss the banner
   */
  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    setShowBanner(false);
  }, []);

  /**
   * Intercept an action (Apply/Message/SignUp/SignIn)
   * Returns true if action should proceed, false if intercepted
   *
   * @param action - The action type being attempted
   * @param data - Additional data about the action
   * @param forceIntercept - If true, always show modal (for auth CTAs like signup/signin)
   */
  const interceptAction = useCallback((
    action: InterceptableAction,
    data?: PendingActionData,
    forceIntercept: boolean = false
  ): boolean => {
    // If not in-app browser or PWA is installed, allow action
    if (!isInAppBrowser || isPWAInstalled) {
      return true; // Proceed with action
    }

    // For auth-related CTAs (signup/signin), always intercept when forceIntercept is true
    // For apply/message, respect hasContinuedAnyway unless forceIntercept is true
    if (!forceIntercept && hasContinuedAnyway) {
      return true; // User previously chose to continue anyway
    }

    // Intercept the action
    setPendingAction(action);
    setPendingActionData(data || null);
    setShowApplyModal(true);

    return false; // Action intercepted
  }, [isInAppBrowser, hasContinuedAnyway, isPWAInstalled]);

  /**
   * User chose to proceed with the action in the modal
   */
  const proceedWithAction = useCallback(() => {
    setShowApplyModal(false);
    // Note: The actual action will be triggered by the calling component
    // after this function is called
  }, []);

  /**
   * Cancel the pending action
   */
  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setPendingActionData(null);
    setShowApplyModal(false);
  }, []);

  /**
   * Open the current page in an external browser
   */
  const openInExternalBrowser = useCallback(async () => {
    const currentPlatform = getDevicePlatform();

    if (currentPlatform === 'android') {
      // Try Chrome intent for Android
      const intentUrl = getOpenInBrowserUrl(pathname);
      window.location.href = intentUrl;
    } else if (currentPlatform === 'ios') {
      // For iOS, copy URL and show instructions
      const url = getCurrentUrl();
      const success = await copyToClipboard(url);
      if (success) {
        alert('Link copied! Open Safari and paste the URL to continue.');
      } else {
        alert(`Please open this URL in Safari:\n${url}`);
      }
    } else {
      // Desktop - just copy URL
      const url = getCurrentUrl();
      await copyToClipboard(url);
    }
  }, [pathname]);

  /**
   * User chose to continue using the in-app browser
   */
  const continueAnyway = useCallback(() => {
    hookContinueAnyway();
    setShowWelcomeModal(false);
    setShowApplyModal(false);
    setShowBanner(false);
    setPendingAction(null);
    setPendingActionData(null);
  }, [hookContinueAnyway]);

  return (
    <InstallFlowContext.Provider
      value={{
        isInAppBrowser,
        browserName,
        platform,
        isPWAInstalled,
        isAuthenticated,
        showWelcomeModal,
        showApplyModal,
        showBanner,
        pendingAction,
        pendingActionData,
        hasContinuedAnyway,
        dismissWelcome,
        dismissBanner,
        interceptAction,
        proceedWithAction,
        cancelAction,
        openInExternalBrowser,
        continueAnyway,
      }}
    >
      {children}
    </InstallFlowContext.Provider>
  );
}

/**
 * Hook to access the Install Flow context
 */
export function useInstallFlow() {
  const context = useContext(InstallFlowContext);
  if (context === undefined) {
    throw new Error('useInstallFlow must be used within an InstallFlowProvider');
  }
  return context;
}
