'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import PersonalInfoStep from './PersonalInfoStep';
import ContactInfoStep from './ContactInfoStep';
import ProfessionalStep from './ProfessionalStep';
import SkillsPreferencesStep from './SkillsPreferencesStep';
import DocumentUploadStep from './DocumentUploadStep';

export interface ProfileSetupData {
  step1?: {
    photoUrl?: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    civilStatus: string;
  };
  step2?: {
    email: string;
    phoneNumber: string;
    province: string;
    city: string;
    barangay?: string;
  };
  step3?: {
    jobTitle: string;
    yearsOfExperience: string;
    industry: string;
    education: string;
    fieldOfStudy: string;
  };
  step4?: {
    skills: string[];
    preferredCountries: string[];
    salaryExpectation: {
      min: number;
      max: number;
    };
    earliestStartDate: string;
  };
  step5?: {
    resume?: File;
    certificates?: File[];
    validId?: File;
  };
}

interface ProfileSetupWizardProps {
  /**
   * Initial data (for draft recovery)
   */
  initialData?: Partial<ProfileSetupData>;
  /**
   * Callback when wizard is completed
   */
  onComplete?: (data: ProfileSetupData) => void;
  /**
   * Callback when wizard is skipped
   */
  onSkip?: () => void;
}

const TOTAL_STEPS = 5;
const STEP_LABELS = [
  'Personal Info',
  'Contact Info',
  'Professional',
  'Skills & Preferences',
  'Documents',
];

/**
 * ProfileSetupWizard Component
 *
 * Multi-step profile setup wizard (5 steps).
 * Users can skip entire wizard or complete it later.
 * Auto-saves to localStorage for draft recovery.
 *
 * Features:
 * - Progress bar at top
 * - Back/Next navigation
 * - Skip button
 * - "Complete Later" option
 * - Form validation per step
 * - Auto-save to localStorage
 *
 * @example
 * ```tsx
 * <ProfileSetupWizard
 *   onComplete={(data) => {
 *     console.log('Profile completed:', data);
 *     // Save to Firebase
 *   }}
 *   onSkip={() => {
 *     router.push('/');
 *   }}
 * />
 * ```
 */
export default function ProfileSetupWizard({
  initialData,
  onComplete,
  onSkip,
}: ProfileSetupWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileSetupData>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('profileSetupDraft', JSON.stringify(formData));
    }
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('profileSetupDraft');
    if (draft && !initialData) {
      try {
        setFormData(JSON.parse(draft));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [initialData]);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Mark profile as incomplete and navigate to home
      localStorage.setItem('profileIncomplete', 'true');
      router.push('/');
    }
  };

  const handleCompleteLater = () => {
    // Save current progress
    localStorage.setItem('profileSetupDraft', JSON.stringify(formData));
    localStorage.setItem('profileIncomplete', 'true');
    router.push('/');
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Save to Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear draft
      localStorage.removeItem('profileSetupDraft');
      localStorage.removeItem('profileIncomplete');

      if (onComplete) {
        onComplete(formData);
      } else {
        // Default: navigate to home
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStepData = (step: number, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [`step${step}`]: data,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.step1}
            onNext={handleNext}
            onUpdate={(data) => updateStepData(1, data)}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            data={formData.step2}
            onNext={handleNext}
            onUpdate={(data) => updateStepData(2, data)}
          />
        );
      case 3:
        return (
          <ProfessionalStep
            data={formData.step3}
            onNext={handleNext}
            onUpdate={(data) => updateStepData(3, data)}
          />
        );
      case 4:
        return (
          <SkillsPreferencesStep
            data={formData.step4}
            onNext={handleNext}
            onUpdate={(data) => updateStepData(4, data)}
          />
        );
      case 5:
        return (
          <DocumentUploadStep
            data={formData.step5}
            onNext={handleNext}
            onUpdate={(data) => updateStepData(5, data)}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleSkip}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h1 className="text-lg font-semibold text-gray-900">
              Complete Your Profile
            </h1>

            <button
              type="button"
              onClick={handleCompleteLater}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Later
            </button>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            value={progress}
            label={`Step ${currentStep} of ${TOTAL_STEPS}: ${STEP_LABELS[currentStep - 1]}`}
            variant="primary"
            size="md"
            showPercentage
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                icon={ChevronLeft}
                iconPosition="left"
              >
                Back
              </Button>
            )}

            {/* Spacer */}
            {currentStep === 1 && <div />}

            {/* Next/Complete Button */}
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              isLoading={isSubmitting}
              className="ml-auto"
            >
              {currentStep === TOTAL_STEPS ? 'Complete Profile' : 'Next'}
            </Button>
          </div>

          {/* Helper text */}
          {currentStep < TOTAL_STEPS && (
            <p className="text-xs text-gray-500 text-center mt-3">
              💡 You can complete this later from your profile settings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
