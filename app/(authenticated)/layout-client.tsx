'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingWizardWrapper from "@/components/onboarding/OnboardingWizardWrapper";
import FeatureTour from "@/components/onboarding/FeatureTour";

/**
 * Client layout for authenticated routes
 * This layout wraps all protected routes with auth providers,
 * preventing unnecessary auth checks on public pages
 */
export default function AuthenticatedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
        <OnboardingWizardWrapper />
        <FeatureTour />
      </OnboardingProvider>
    </AuthProvider>
  );
}
