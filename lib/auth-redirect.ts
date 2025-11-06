import { UserType } from '@/types';

/**
 * Get the default route for a given user type
 */
export function getDefaultRouteForUserType(userType: UserType | null): string {
  const routes: Record<UserType, string> = {
    admin: '/admin/dashboard',
    agency: '/agency/dashboard',
    jobhunter: '/jobs'
  };

  return userType ? routes[userType] : '/jobs';
}

/**
 * Build a full redirect URL with preserved query parameters
 */
export function buildRedirectUrl(
  baseUrl: string,
  params: Record<string, string | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
