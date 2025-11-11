'use client';

import { OnboardingProvider } from "@/contexts/OnboardingContext";

/**
 * Layout for jobs listing page
 * Provides OnboardingProvider for job browsing
 * AuthProvider is now in the root layout for global access
 */
export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}
