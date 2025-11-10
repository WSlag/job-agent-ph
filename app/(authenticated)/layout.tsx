import AuthenticatedLayoutClient from "./layout-client";

// Force dynamic rendering for all authenticated routes
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

/**
 * Server layout for authenticated routes
 * Prevents static generation of auth-required pages
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayoutClient>{children}</AuthenticatedLayoutClient>;
}
