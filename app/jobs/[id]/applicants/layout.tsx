'use client';

/**
 * Layout for job applicants page
 * AuthProvider is now in the root layout for global access
 */
export default function ApplicantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
