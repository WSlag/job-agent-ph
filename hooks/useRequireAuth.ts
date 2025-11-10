'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { AuthPromptContext } from '@/components/auth/AuthPrompt';

export type AuthAction = 'apply' | 'save' | 'message' | 'view_applications' | 'view_profile' | 'ai_advanced' | 'post_job' | 'edit_job';

interface UseRequireAuthOptions {
  /**
   * Action that requires authentication
   */
  action: AuthAction;
  /**
   * Title for the auth prompt modal
   */
  title: string;
  /**
   * Description of what the user will get
   */
  description: string;
  /**
   * Main benefit message
   */
  benefit: string;
  /**
   * Optional job ID (for apply action)
   */
  jobId?: string;
  /**
   * Return URL after authentication
   */
  returnUrl?: string;
  /**
   * Required user type for this action
   */
  requiredUserType?: UserType;
  /**
   * User type for signup (defaults to 'jobhunter')
   */
  signupUserType?: UserType;
}

interface UseRequireAuthReturn {
  /**
   * Wrapped handler function that checks auth before executing
   */
  handleAction: () => void;
  /**
   * Whether the auth prompt modal is showing
   */
  showAuthPrompt: boolean;
  /**
   * Function to manually set auth prompt visibility
   */
  setShowAuthPrompt: (show: boolean) => void;
  /**
   * Auth prompt context for SignupModal
   */
  authPromptContext: AuthPromptContext;
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * Whether the user has the required role (if requiredUserType is specified)
   */
  hasRequiredRole: boolean;
}

/**
 * Hook to wrap actions that require authentication
 *
 * Checks if user is authenticated and optionally if they have the required role.
 * Shows SignupModal if not authenticated.
 *
 * @example
 * ```tsx
 * const { handleAction, showAuthPrompt, setShowAuthPrompt, authPromptContext } = useRequireAuth({
 *   action: 'apply',
 *   title: 'Sign up to apply',
 *   description: 'Create a free account to apply to this job',
 *   benefit: 'Get real-time updates and directly message agencies',
 *   jobId: job.id,
 *   returnUrl: `/jobs/${job.id}`,
 *   requiredUserType: 'jobhunter'
 * }, () => {
 *   // This callback only runs if user is authenticated and has correct role
 *   setShowApplicationModal(true);
 * });
 *
 * return (
 *   <>
 *     <button onClick={handleAction}>Apply Now</button>
 *     <SignupModal
 *       isOpen={showAuthPrompt}
 *       onClose={() => setShowAuthPrompt(false)}
 *       context={authPromptContext}
 *     />
 *   </>
 * );
 * ```
 */
export function useRequireAuth(
  options: UseRequireAuthOptions,
  onAuthenticated: () => void
): UseRequireAuthReturn {
  const { user, userType } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const isAuthenticated = !!user;
  const hasRequiredRole = !options.requiredUserType || userType === options.requiredUserType;

  const authPromptContext: AuthPromptContext = {
    action: options.action,
    title: options.title,
    description: options.description,
    benefit: options.benefit,
    jobId: options.jobId,
    returnUrl: options.returnUrl,
    userType: options.signupUserType,
  };

  const handleAction = useCallback(() => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    // Check if user has required role (if specified)
    if (options.requiredUserType && userType !== options.requiredUserType) {
      // User is authenticated but doesn't have the required role
      alert(`This action is only available to ${options.requiredUserType}s.`);
      return;
    }

    // User is authenticated and has correct role, execute the action
    onAuthenticated();
  }, [user, userType, options.requiredUserType, onAuthenticated]);

  return {
    handleAction,
    showAuthPrompt,
    setShowAuthPrompt,
    authPromptContext,
    isAuthenticated,
    hasRequiredRole,
  };
}
