'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingWizard from './OnboardingWizard';
import AgencyOnboardingWizard from './AgencyOnboardingWizard';

export default function OnboardingWizardWrapper() {
  const { userType } = useAuth();
  const { showOnboarding } = useOnboarding();

  // Don't render anything if onboarding shouldn't be shown
  if (!showOnboarding) {
    return null;
  }

  // Render the appropriate wizard based on user type
  if (userType === 'agency') {
    return <AgencyOnboardingWizard />;
  }

  // Default to job hunter wizard
  return <OnboardingWizard />;
}
