import AuthenticatedLayoutClient from "./layout-client";

// Force dynamic rendering for all authenticated routes
export const dynamic = 'force-dynamic';

/**
 * Server layout for authenticated routes
 * Enables dynamic rendering for auth-required pages
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayoutClient>{children}</AuthenticatedLayoutClient>;
}
