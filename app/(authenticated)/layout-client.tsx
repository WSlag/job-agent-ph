'use client';

import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingWizardWrapper from "@/components/onboarding/OnboardingWizardWrapper";
import FeatureTour from "@/components/onboarding/FeatureTour";

/**
 * Client layout for authenticated routes
 * This layout wraps all protected routes with onboarding features
 * AuthProvider is now in the root layout for global access
 */
export default function AuthenticatedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      {children}
      <OnboardingWizardWrapper />
      <FeatureTour />
    </OnboardingProvider>
  );
}
