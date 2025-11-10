'use client';

import { AuthProvider } from "@/contexts/AuthContext";

/**
 * Layout for job applicants page
 * Provides AuthProvider for viewing and managing applicants
 */
export default function ApplicantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
