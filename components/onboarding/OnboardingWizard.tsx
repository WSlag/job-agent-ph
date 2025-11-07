'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, Briefcase, Search, FileText, MessageCircle, Sparkles, Target } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Job Agent PH',
    icon: Sparkles,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Your gateway to international career opportunities for Filipino professionals.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Search & Discover</h4>
              <p className="text-sm text-gray-600">Browse thousands of verified international jobs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Get Matched</h4>
              <p className="text-sm text-gray-600">AI-powered job matching based on your skills</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Connect Directly</h4>
              <p className="text-sm text-gray-600">Message agencies and track your applications</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'profile-setup',
    title: 'Complete Your Profile',
    icon: Briefcase,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          A complete profile helps you stand out and enables Quick Apply for faster applications.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Essential Information:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Resume:</strong> Upload your latest CV (required for Quick Apply)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Skills:</strong> Add your key skills for better job matching</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Location:</strong> Help agencies find candidates in your area</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Bio:</strong> Share your experience and career goals</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-500 italic">
          You can complete your profile anytime from the Profile page.
        </p>
      </>
    ),
  },
  {
    id: 'job-search',
    title: 'Find Your Perfect Job',
    icon: Search,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Discover opportunities with powerful search and filtering tools.
        </p>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Search Features:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Text Search:</strong> Search by job title, company, or skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Filters:</strong> Category, country, job type, and salary range</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Match Percentage:</strong> See how well you match each job</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Save Jobs:</strong> Bookmark jobs to review later (synced across devices)</span>
              </li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>💡 Pro Tip:</strong> Use filters to narrow down jobs and save the best matches for later!
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'application-system',
    title: 'Apply with Confidence',
    icon: FileText,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Two easy ways to apply for jobs on Job Agent PH.
        </p>
        <div className="space-y-3">
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="font-semibold text-green-900">Quick Apply</h4>
              <span className="ml-auto bg-green-600 text-white text-xs px-2 py-1 rounded">Fastest</span>
            </div>
            <p className="text-sm text-green-800">
              One-click application using your profile resume. No forms to fill!
            </p>
          </div>
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="font-semibold text-blue-900">Full Application</h4>
            </div>
            <p className="text-sm text-blue-800">
              Add a custom cover letter and choose which resume to send.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm">Track Your Applications:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Reviewing</span>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Shortlisted</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hired</span>
          </div>
          <p className="text-xs text-gray-600">Real-time status updates on your Applications page</p>
        </div>
      </>
    ),
  },
  {
    id: 'messaging-tracking',
    title: 'Connect & Track',
    icon: MessageCircle,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Stay connected with agencies and monitor your job search progress.
        </p>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Direct Messaging
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Message agencies directly from job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Ask questions before applying</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Get real-time responses from recruiters</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>All conversations linked to specific jobs</span>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Application Tracking</h4>
            <p className="text-sm text-gray-600">
              Monitor all your applications in one place with real-time status updates,
              view your resume, and message agencies directly from your Applications dashboard.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'quick-tips',
    title: 'Quick Tips for Success',
    icon: Sparkles,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Make the most of Job Agent PH with these helpful tips:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
            <span className="text-2xl">📝</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Keep Your Resume Updated</h4>
              <p className="text-xs text-gray-600">Upload your latest CV to enable Quick Apply and increase your chances</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
            <span className="text-2xl">💬</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Engage with Agencies</h4>
              <p className="text-xs text-gray-600">Don't hesitate to message agencies - it shows initiative and interest</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Set Up Job Alerts</h4>
              <p className="text-xs text-gray-600">Save jobs you're interested in to get notified of similar opportunities</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Apply Quickly</h4>
              <p className="text-xs text-gray-600">Early applicants get more attention - use Quick Apply for speed</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Stay Safe</h4>
              <p className="text-xs text-gray-600">Only apply through our platform and verify agency credentials</p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center">
          <p className="font-semibold mb-1">You're all set! 🎉</p>
          <p className="text-sm opacity-90">Start exploring opportunities and land your dream job abroad!</p>
        </div>
      </>
    ),
  },
]

export default function OnboardingWizard() {
  const { onboardingData, showWizard, completeStep, dismissWizard } = useOnboarding()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const currentStep = STEPS[currentStepIndex]
  const isLastStep = currentStepIndex === STEPS.length - 1
  const isFirstStep = currentStepIndex === 0

  useEffect(() => {
    if (onboardingData?.currentStep) {
      const stepIndex = STEPS.findIndex(s => s.id === onboardingData.currentStep)
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex)
      }
    }
  }, [onboardingData?.currentStep])

  const handleNext = async () => {
    if (isLastStep) {
      await completeStep('quick-tips')
      await dismissWizard()
    } else {
      await completeStep(currentStep.id as any)
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const handleSkip = async () => {
    await dismissWizard()
  }

  if (!showWizard) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <currentStep.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Step {currentStepIndex + 1} of {STEPS.length}</p>
              <h2 className="text-2xl font-bold">{currentStep.title}</h2>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Skip Tutorial
            </button>
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
              >
                {isLastStep ? (
                  <>
                    Get Started
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
