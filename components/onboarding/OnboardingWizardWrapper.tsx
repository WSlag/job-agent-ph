'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingWizard from './OnboardingWizard';
import AgencyOnboardingWizard from './AgencyOnboardingWizard';

export default function OnboardingWizardWrapper() {
  // This component is now only rendered in the authenticated layout
  // so we can safely use the regular hooks
  const { userType } = useAuth();
  const onboardingData = useOnboarding();

  // Don't render anything if wizard shouldn't be shown
  if (!onboardingData.showWizard) {
    return null;
  }

  // Render the appropriate wizard based on user type
  if (userType === 'agency') {
    return <AgencyOnboardingWizard />;
  }

  // Default to job hunter wizard
  return <OnboardingWizard />;
}
