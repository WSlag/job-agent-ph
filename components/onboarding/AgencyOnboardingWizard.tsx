'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, Building2, BriefcaseBusiness, Users, Mail, Sparkles, Star, FileText, TrendingUp } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useState, useEffect } from 'react'
import type { AgencyOnboardingStep } from '@/contexts/OnboardingContext'

const STEPS = [
  {
    id: 'welcome' as AgencyOnboardingStep,
    title: 'Welcome to Job Agent PH',
    icon: Sparkles,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Your platform to connect with talented Filipino professionals seeking international opportunities.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <BriefcaseBusiness className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Post Job Opportunities</h4>
              <p className="text-sm text-gray-600">Create compelling job listings and reach qualified candidates</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Review Applications</h4>
              <p className="text-sm text-gray-600">Efficiently manage and review candidate applications</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Mail className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Connect with Talent</h4>
              <p className="text-sm text-gray-600">Message candidates directly and build relationships</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'agency-profile-setup' as AgencyOnboardingStep,
    title: 'Complete Your Agency Profile',
    icon: Building2,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          A complete profile builds trust with job seekers and increases application rates.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Essential Information:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Company Logo:</strong> Professional branding that job seekers recognize</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Registration Number:</strong> Builds credibility and trust</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Contact Information:</strong> Makes it easy for candidates to reach you</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span><strong>Office Address:</strong> Helps local candidates find you</span>
            </li>
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>💡 Pro Tip:</strong> Verified agencies receive a badge and get 3x more applications!
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'post-job' as AgencyOnboardingStep,
    title: 'Post Your First Job',
    icon: BriefcaseBusiness,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Create attractive job postings to attract the best talent.
        </p>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Job Posting Essentials:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Clear Title:</strong> Be specific (e.g., "Senior React Developer" vs "Developer")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Detailed Description:</strong> Responsibilities, requirements, and benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Transparent Salary:</strong> Jobs with salary ranges get 5x more applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Required Skills:</strong> Help job seekers understand if they're a good fit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Eye-catching Image:</strong> Jobs with images get 2x more views</span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>✨ Tip:</strong> Add a tagline (max 100 chars) for a quick preview on job cards!
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'manage-applicants' as AgencyOnboardingStep,
    title: 'Manage Applicants Effectively',
    icon: Users,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Streamlined tools to review, filter, and manage candidate applications.
        </p>
        <div className="space-y-3">
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Review Applications</h4>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              Access resumes, cover letters, and candidate profiles all in one place.
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• View candidate skills and experience</li>
              <li>• Download resumes directly</li>
              <li>• See application timestamps</li>
            </ul>
          </div>
          <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Update Application Status</h4>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
              <span className="text-gray-400 text-xs">→</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Reviewing</span>
              <span className="text-gray-400 text-xs">→</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Shortlisted</span>
              <span className="text-gray-400 text-xs">→</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hired</span>
            </div>
            <p className="text-xs text-purple-700">Keep candidates informed with real-time status updates</p>
          </div>
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Filter & Organize</h4>
            </div>
            <p className="text-sm text-green-800">
              Filter by status, search by skills, and organize applicants efficiently.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'messaging-engagement' as AgencyOnboardingStep,
    title: 'Engage with Candidates',
    icon: Mail,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Build relationships with candidates through direct messaging.
        </p>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Direct Messaging Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Message applicants directly from application cards</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Schedule interviews and share additional details</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>Build rapport before final hiring decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-purple-600 mt-0.5" />
                <span>All conversations linked to specific job postings</span>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Response Best Practices</h4>
            <p className="text-sm text-gray-600 mb-3">
              Quick responses improve your agency rating and attract more candidates.
            </p>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-blue-800">
                <strong>Average Response Time:</strong> Agencies that respond within 24 hours get 4x more quality applications.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'agency-tips' as AgencyOnboardingStep,
    title: 'Tips for Success',
    icon: Sparkles,
    content: (
      <>
        <p className="text-gray-600 mb-4">
          Best practices to attract top talent and grow your agency.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Be Transparent About Salaries</h4>
              <p className="text-xs text-gray-600">Jobs with salary ranges receive significantly more applications from qualified candidates</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Respond Quickly</h4>
              <p className="text-xs text-gray-600">Fast responses improve your rating and keep candidates engaged</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
            <span className="text-2xl">⭐</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Request Featured Placement</h4>
              <p className="text-xs text-gray-600">Featured jobs appear on the homepage carousel and get 10x more visibility</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg">
            <span className="text-2xl">📸</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Use High-Quality Images</h4>
              <p className="text-xs text-gray-600">Professional job images increase click-through rates by 200%</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Keep Status Updated</h4>
              <p className="text-xs text-gray-600">Regular status updates keep candidates informed and maintain your reputation</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg">
            <span className="text-2xl">🏆</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Build Your Reputation</h4>
              <p className="text-xs text-gray-600">Verified agencies with good ratings attract the best talent</p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center">
          <p className="font-semibold mb-1">You're ready to start recruiting! 🎉</p>
          <p className="text-sm opacity-90">Post your first job and connect with talented professionals today!</p>
        </div>
      </>
    ),
  },
]

export default function AgencyOnboardingWizard() {
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
      await completeStep('agency-tips')
      await dismissWizard()
    } else {
      await completeStep(currentStep.id)
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

  // Early returns after all hooks
  if (!showWizard) return null

  // Safety check: Prevent crash if currentStep is undefined during dismissal
  if (!currentStep) {
    console.warn('[AgencyOnboardingWizard] Invalid step index:', currentStepIndex)
    return null
  }

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
