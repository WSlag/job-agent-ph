'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

/**
 * Layout for jobs listing page
 * Provides AuthProvider and OnboardingProvider for job browsing
 */
export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </AuthProvider>
  );
}
