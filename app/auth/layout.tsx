'use client';

import { AuthProvider } from "@/contexts/AuthContext";

/**
 * Layout for auth routes (login, signup, etc.)
 * Provides AuthProvider for auth-related pages
 */
export default function AuthLayout({
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
