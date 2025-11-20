'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getDbInstance } from '@/lib/firebase'

// Job Hunter onboarding steps
export type JobHunterOnboardingStep =
  | 'welcome'
  | 'profile-setup'
  | 'job-search'
  | 'application-system'
  | 'messaging-tracking'
  | 'quick-tips'
  | 'completed'

// Agency onboarding steps
export type AgencyOnboardingStep =
  | 'welcome'
  | 'agency-profile-setup'
  | 'post-job'
  | 'manage-applicants'
  | 'messaging-engagement'
  | 'agency-tips'
  | 'completed'

export type OnboardingStep = JobHunterOnboardingStep | AgencyOnboardingStep

// Job Hunter feature tours
export type JobHunterFeatureTour =
  | 'search-filters'
  | 'save-job'
  | 'quick-apply'
  | 'application-status'
  | 'message-agency'

// Agency feature tours
export type AgencyFeatureTour =
  | 'post-job'
  | 'review-applicants'
  | 'update-status'
  | 'featured-request'
  | 'message-candidate'

export type FeatureTour = JobHunterFeatureTour | AgencyFeatureTour

// Job Hunter profile checklist
interface JobHunterChecklist {
  resumeUploaded: boolean
  skillsAdded: boolean
  locationSet: boolean
  bioAdded: boolean
}

// Agency profile checklist
interface AgencyChecklist {
  logoUploaded: boolean
  registrationAdded: boolean
  contactInfoComplete: boolean
  dmwLicenseUploaded: boolean
  businessPermitUploaded: boolean
  firstJobPosted: boolean
}

interface OnboardingData {
  isCompleted: boolean
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]
  featuresTours: {
    [key in FeatureTour]?: boolean
  }
  profileChecklist: JobHunterChecklist | AgencyChecklist
  lastUpdated: Date
  wizardDismissed: boolean
}

interface OnboardingContextType {
  onboardingData: OnboardingData | null
  isNewUser: boolean
  loading: boolean
  showWizard: boolean
  currentTour: FeatureTour | null

  // Wizard controls
  startOnboarding: () => void
  completeStep: (step: OnboardingStep) => Promise<void>
  skipStep: (step: OnboardingStep) => Promise<void>
  goToStep: (step: OnboardingStep) => Promise<void>
  dismissWizard: () => Promise<void>
  restartOnboarding: () => Promise<void>

  // Feature tour controls
  startTour: (tour: FeatureTour) => void
  completeTour: (tour: FeatureTour) => Promise<void>

  // Profile checklist
  updateProfileChecklist: (updates: Partial<OnboardingData['profileChecklist']>) => Promise<void>
  getProfileCompletionPercentage: () => number
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const getDefaultOnboardingData = (userType: string | null): OnboardingData => {
  const isAgency = userType === 'agency'

  return {
    isCompleted: false,
    currentStep: 'welcome',
    completedSteps: [],
    skippedSteps: [],
    featuresTours: isAgency
      ? {
          'post-job': false,
          'review-applicants': false,
          'update-status': false,
          'featured-request': false,
          'message-candidate': false,
        }
      : {
          'search-filters': false,
          'save-job': false,
          'quick-apply': false,
          'application-status': false,
          'message-agency': false,
        },
    profileChecklist: isAgency
      ? {
          logoUploaded: false,
          registrationAdded: false,
          contactInfoComplete: false,
          dmwLicenseUploaded: false,
          businessPermitUploaded: false,
          firstJobPosted: false,
        }
      : {
          resumeUploaded: false,
          skillsAdded: false,
          locationSet: false,
          bioAdded: false,
        },
    lastUpdated: new Date(),
    wizardDismissed: false,
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, userType } = useAuth()
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [currentTour, setCurrentTour] = useState<FeatureTour | null>(null)

  // Check if user is new (account created within last 24 hours)
  const isNewUser = user?.metadata?.creationTime
    ? Date.now() - new Date(user.metadata.creationTime).getTime() < 24 * 60 * 60 * 1000
    : false

  // Load onboarding data from Firestore
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user || (userType !== 'jobhunter' && userType !== 'agency')) {
        setLoading(false)
        return
      }

      try {
        const db = getDbInstance()
        const collectionName = userType === 'jobhunter' ? 'jobHunters' : 'agencies'
        const docRef = doc(db, collectionName, user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          const onboarding = data.onboarding || getDefaultOnboardingData(userType)

          // Convert Firestore timestamp to Date
          if (onboarding.lastUpdated?.toDate) {
            onboarding.lastUpdated = onboarding.lastUpdated.toDate()
          }

          setOnboardingData(onboarding)

          // Show wizard if new user and onboarding not completed/dismissed
          if (isNewUser && !onboarding.isCompleted && !onboarding.wizardDismissed) {
            setShowWizard(true)
          }
        } else {
          // Initialize with default data
          const defaultData = getDefaultOnboardingData(userType)
          setOnboardingData(defaultData)
          if (isNewUser) {
            setShowWizard(true)
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error)
        setOnboardingData(getDefaultOnboardingData(userType))
      } finally {
        setLoading(false)
      }
    }

    loadOnboardingData()
  }, [user, userType, isNewUser])

  // Save onboarding data to Firestore
  const saveOnboardingData = async (updates: Partial<OnboardingData>) => {
    if (!user || (userType !== 'jobhunter' && userType !== 'agency')) return

    const newData = {
      ...onboardingData,
      ...updates,
      lastUpdated: new Date(),
    }

    setOnboardingData(newData as OnboardingData)

    try {
      const db = getDbInstance()
      const collectionName = userType === 'jobhunter' ? 'jobHunters' : 'agencies'
      const docRef = doc(db, collectionName, user.uid)
      await updateDoc(docRef, {
        onboarding: newData,
      })
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    }
  }

  const startOnboarding = () => {
    setShowWizard(true)
    saveOnboardingData({
      currentStep: 'welcome',
      wizardDismissed: false,
    })
  }

  const completeStep = async (step: OnboardingStep) => {
    if (!onboardingData) return

    const jobHunterSteps: OnboardingStep[] = [
      'welcome',
      'profile-setup',
      'job-search',
      'application-system',
      'messaging-tracking',
      'quick-tips',
      'completed',
    ]

    const agencySteps: OnboardingStep[] = [
      'welcome',
      'agency-profile-setup',
      'post-job',
      'manage-applicants',
      'messaging-engagement',
      'agency-tips',
      'completed',
    ]

    const steps = userType === 'agency' ? agencySteps : jobHunterSteps
    const currentIndex = steps.indexOf(step)
    const nextStep = steps[currentIndex + 1] || 'completed'

    const updates: Partial<OnboardingData> = {
      completedSteps: [...onboardingData.completedSteps, step],
      currentStep: nextStep,
    }

    if (nextStep === 'completed') {
      updates.isCompleted = true
      setShowWizard(false)
    }

    await saveOnboardingData(updates)
  }

  const skipStep = async (step: OnboardingStep) => {
    if (!onboardingData) return

    const jobHunterSteps: OnboardingStep[] = [
      'welcome',
      'profile-setup',
      'job-search',
      'application-system',
      'messaging-tracking',
      'quick-tips',
      'completed',
    ]

    const agencySteps: OnboardingStep[] = [
      'welcome',
      'agency-profile-setup',
      'post-job',
      'manage-applicants',
      'messaging-engagement',
      'agency-tips',
      'completed',
    ]

    const steps = userType === 'agency' ? agencySteps : jobHunterSteps
    const currentIndex = steps.indexOf(step)
    const nextStep = steps[currentIndex + 1] || 'completed'

    await saveOnboardingData({
      skippedSteps: [...onboardingData.skippedSteps, step],
      currentStep: nextStep,
    })
  }

  const goToStep = async (step: OnboardingStep) => {
    await saveOnboardingData({ currentStep: step })
  }

  const dismissWizard = async () => {
    setShowWizard(false)
    await saveOnboardingData({
      wizardDismissed: true,
    })
  }

  const restartOnboarding = async () => {
    const defaultData = getDefaultOnboardingData(userType)
    const resetData = {
      ...defaultData,
      profileChecklist: onboardingData?.profileChecklist || defaultData.profileChecklist,
    }
    setOnboardingData(resetData)
    setShowWizard(true)

    if (!user || (userType !== 'jobhunter' && userType !== 'agency')) return

    try {
      const db = getDbInstance()
      const collectionName = userType === 'jobhunter' ? 'jobHunters' : 'agencies'
      const docRef = doc(db, collectionName, user.uid)
      await updateDoc(docRef, {
        onboarding: resetData,
      })
    } catch (error) {
      console.error('Error restarting onboarding:', error)
    }
  }

  const startTour = (tour: FeatureTour) => {
    setCurrentTour(tour)
  }

  const completeTour = async (tour: FeatureTour) => {
    if (!onboardingData) return

    setCurrentTour(null)
    await saveOnboardingData({
      featuresTours: {
        ...onboardingData.featuresTours,
        [tour]: true,
      },
    })
  }

  const updateProfileChecklist = async (updates: Partial<OnboardingData['profileChecklist']>) => {
    if (!onboardingData) return

    await saveOnboardingData({
      profileChecklist: {
        ...onboardingData.profileChecklist,
        ...updates,
      },
    })
  }

  const getProfileCompletionPercentage = () => {
    if (!onboardingData) return 0

    const checklist = onboardingData.profileChecklist
    const total = Object.keys(checklist).length
    const completed = Object.values(checklist).filter(Boolean).length

    return Math.round((completed / total) * 100)
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        isNewUser,
        loading,
        showWizard,
        currentTour,
        startOnboarding,
        completeStep,
        skipStep,
        goToStep,
        dismissWizard,
        restartOnboarding,
        startTour,
        completeTour,
        updateProfileChecklist,
        getProfileCompletionPercentage,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
