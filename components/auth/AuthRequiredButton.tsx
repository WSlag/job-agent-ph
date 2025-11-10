'use client';

import { ReactNode } from 'react';
import { UserType } from '@/types';
import { useRequireAuth, AuthAction } from '@/hooks/useRequireAuth';
import SignupModal from './SignupModal';
import Button from '@/components/ui/Button';

interface AuthRequiredButtonProps {
  /**
   * Button click handler (only called if authenticated and has required role)
   */
  onClick: () => void;
  /**
   * Button content
   */
  children: ReactNode;
  /**
   * Action type for auth prompt
   */
  action: AuthAction;
  /**
   * Title for the auth prompt
   */
  promptTitle: string;
  /**
   * Description for the auth prompt
   */
  promptDescription: string;
  /**
   * Benefit message for the auth prompt
   */
  promptBenefit: string;
  /**
   * Optional job ID (for apply actions)
   */
  jobId?: string;
  /**
   * Return URL after authentication
   */
  returnUrl?: string;
  /**
   * Required user type to perform this action
   */
  requiredUserType?: UserType;
  /**
   * User type for signup (defaults to 'jobhunter')
   */
  signupUserType?: UserType;
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Icon to show before text
   */
  icon?: ReactNode;
}

/**
 * AuthRequiredButton Component
 *
 * Button that automatically handles authentication checks.
 * Shows signup modal if user is not authenticated.
 * Only executes onClick if user is authenticated and has required role.
 *
 * @example
 * ```tsx
 * <AuthRequiredButton
 *   action="apply"
 *   promptTitle="Sign up to apply"
 *   promptDescription="Create a free account to apply to this job"
 *   promptBenefit="Get real-time updates and message agencies"
 *   jobId={job.id}
 *   returnUrl={`/jobs/${job.id}`}
 *   requiredUserType="jobhunter"
 *   onClick={() => setShowApplicationModal(true)}
 *   variant="primary"
 *   size="lg"
 * >
 *   Apply Now
 * </AuthRequiredButton>
 *
 * <AuthRequiredButton
 *   action="save"
 *   promptTitle="Sign up to save jobs"
 *   promptDescription="Create an account to save and organize your job searches"
 *   promptBenefit="Build your personalized job collection"
 *   onClick={handleSaveJob}
 *   variant="outline"
 *   icon={<Bookmark />}
 * >
 *   Save Job
 * </AuthRequiredButton>
 * ```
 */
export default function AuthRequiredButton({
  onClick,
  children,
  action,
  promptTitle,
  promptDescription,
  promptBenefit,
  jobId,
  returnUrl,
  requiredUserType,
  signupUserType,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = '',
  icon,
}: AuthRequiredButtonProps) {
  const {
    handleAction,
    showAuthPrompt,
    setShowAuthPrompt,
    authPromptContext,
  } = useRequireAuth(
    {
      action,
      title: promptTitle,
      description: promptDescription,
      benefit: promptBenefit,
      jobId,
      returnUrl,
      requiredUserType,
      signupUserType,
    },
    onClick
  );

  return (
    <>
      <Button
        onClick={handleAction}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        isLoading={isLoading}
        className={className}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Button>

      <SignupModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        context={authPromptContext}
        onSuccess={() => {
          setShowAuthPrompt(false);
          // After successful auth, execute the original action
          onClick();
        }}
      />
    </>
  );
}
