'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';

interface RoleGuardProps {
  /**
   * Roles that are allowed to see this content
   */
  allowedRoles: UserType[];
  /**
   * Content to show when user has permission
   */
  children: ReactNode;
  /**
   * Optional fallback content to show when user doesn't have permission
   */
  fallback?: ReactNode;
  /**
   * Show loading state while auth is being checked
   */
  showLoading?: boolean;
}

/**
 * RoleGuard Component
 *
 * Shows children only if the user's role is in the allowedRoles array.
 * Useful for conditional rendering based on user role.
 *
 * @example
 * ```tsx
 * <RoleGuard allowedRoles={['agency']}>
 *   <PostJobButton />
 * </RoleGuard>
 *
 * <RoleGuard
 *   allowedRoles={['jobhunter']}
 *   fallback={<p>Only job hunters can apply</p>}
 * >
 *   <ApplyButton />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  showLoading = false,
}: RoleGuardProps) {
  const { userType, loading } = useAuth();

  // Show loading state if requested and auth is loading
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If still loading but showLoading is false, don't render anything yet
  if (loading) {
    return null;
  }

  // Check if user's role is in the allowed roles
  const hasPermission = userType && allowedRoles.includes(userType);

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface RequireAuthProps {
  /**
   * Content to show when user is authenticated
   */
  children: ReactNode;
  /**
   * Content to show when user is not authenticated
   */
  fallback?: ReactNode;
  /**
   * Show loading state while auth is being checked
   */
  showLoading?: boolean;
}

/**
 * RequireAuth Component
 *
 * Shows children only if user is authenticated (any role).
 * Useful for showing content to logged-in users vs guests.
 *
 * @example
 * ```tsx
 * <RequireAuth fallback={<LoginPrompt />}>
 *   <UserDashboard />
 * </RequireAuth>
 *
 * <RequireAuth>
 *   <SaveButton />
 * </RequireAuth>
 * ```
 */
export function RequireAuth({
  children,
  fallback = null,
  showLoading = false,
}: RequireAuthProps) {
  const { user, loading } = useAuth();

  // Show loading state if requested and auth is loading
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If still loading but showLoading is false, don't render anything yet
  if (loading) {
    return null;
  }

  if (user) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface IfGuestProps {
  /**
   * Content to show when user is NOT authenticated (guest)
   */
  children: ReactNode;
}

/**
 * IfGuest Component
 *
 * Shows children only if user is NOT authenticated (opposite of RequireAuth).
 * Useful for showing login/signup prompts to guests only.
 *
 * @example
 * ```tsx
 * <IfGuest>
 *   <div className="banner">
 *     <h3>Sign up to unlock all features!</h3>
 *     <SignupButton />
 *   </div>
 * </IfGuest>
 * ```
 */
export function IfGuest({ children }: IfGuestProps) {
  const { user, loading } = useAuth();

  // Don't show anything while auth is loading
  if (loading) {
    return null;
  }

  if (!user) {
    return <>{children}</>;
  }

  return null;
}

interface IfRoleProps {
  /**
   * Role to check for
   */
  role: UserType;
  /**
   * Content to show when user has this role
   */
  children: ReactNode;
}

/**
 * IfRole Component
 *
 * Shows children only if user has the specific role.
 * Useful for simple role-based conditional rendering.
 *
 * @example
 * ```tsx
 * <IfRole role="agency">
 *   <PostJobButton />
 * </IfRole>
 *
 * <IfRole role="admin">
 *   <AdminPanel />
 * </IfRole>
 * ```
 */
export function IfRole({ role, children }: IfRoleProps) {
  const { userType, loading } = useAuth();

  // Don't show anything while auth is loading
  if (loading) {
    return null;
  }

  if (userType === role) {
    return <>{children}</>;
  }

  return null;
}
