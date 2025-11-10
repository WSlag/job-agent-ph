'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useOnboarding, FeatureTour as TourType } from '@/contexts/OnboardingContext'

interface TourStep {
  target: string // CSS selector
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: string // Action button text
}

const TOUR_CONFIGS: Partial<Record<TourType, TourStep[]>> = {
  'search-filters': [
    {
      target: '[data-tour="search-bar"]',
      title: 'Search for Jobs',
      description: 'Type job titles, companies, or skills to find opportunities that match your profile.',
      position: 'bottom',
    },
    {
      target: '[data-tour="filter-button"]',
      title: 'Refine Your Search',
      description: 'Use filters to narrow down jobs by category, location, job type, and salary range.',
      position: 'bottom',
      action: 'Try Filters',
    },
    {
      target: '[data-tour="job-card"]',
      title: 'Job Cards',
      description: 'Each card shows key details like salary, location, and required skills. Click to view full details.',
      position: 'top',
    },
  ],
  'save-job': [
    {
      target: '[data-tour="save-button"]',
      title: 'Save Jobs for Later',
      description: 'Click the heart icon to bookmark jobs. Saved jobs sync across all your devices and can be viewed anytime from your Saved Jobs page.',
      position: 'bottom',
      action: 'Got it',
    },
  ],
  'quick-apply': [
    {
      target: '[data-tour="quick-apply"]',
      title: 'Quick Apply',
      description: 'Apply instantly with one click using your profile resume. No forms to fill!',
      position: 'left',
    },
    {
      target: '[data-tour="apply-button"]',
      title: 'Full Application',
      description: 'Prefer to add a cover letter? Use the full application form to customize your submission.',
      position: 'left',
      action: 'Understood',
    },
  ],
  'application-status': [
    {
      target: '[data-tour="status-badge"]',
      title: 'Track Application Status',
      description: 'Monitor your application progress with color-coded status badges that update in real-time.',
      position: 'bottom',
    },
    {
      target: '[data-tour="application-actions"]',
      title: 'Take Action',
      description: 'View your resume, message the agency directly, or check the job details from your application card.',
      position: 'top',
      action: 'Perfect!',
    },
  ],
  'message-agency': [
    {
      target: '[data-tour="message-button"]',
      title: 'Message Agencies',
      description: 'Connect directly with recruitment agencies to ask questions, follow up on applications, or express your interest.',
      position: 'bottom',
      action: 'Got it!',
    },
  ],
}

export default function FeatureTour() {
  const { currentTour, completeTour } = useOnboarding()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<MutationObserver | null>(null)

  const steps = currentTour ? (TOUR_CONFIGS[currentTour] || []) : []
  const currentStep = steps[currentStepIndex]
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    if (!currentTour || !currentStep) {
      setIsVisible(false)
      return
    }

    // Wait for DOM to be ready
    const checkAndHighlight = () => {
      const targetElement = document.querySelector(currentStep.target)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        setTargetRect(rect)
        setIsVisible(true)

        // Scroll element into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setIsVisible(false)
      }
    }

    // Check immediately
    checkAndHighlight()

    // Set up MutationObserver to detect when element appears
    observerRef.current = new MutationObserver(checkAndHighlight)
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Also listen for resize
    window.addEventListener('resize', checkAndHighlight)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('resize', checkAndHighlight)
    }
  }, [currentTour, currentStep])

  const handleNext = () => {
    if (isLastStep && currentTour) {
      completeTour(currentTour)
      setCurrentStepIndex(0)
    } else {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    if (currentTour) {
      completeTour(currentTour)
      setCurrentStepIndex(0)
    }
  }

  if (!currentTour || !currentStep || !targetRect || !isVisible) {
    return null
  }

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const position = currentStep.position || 'bottom'
    const spacing = 16
    const tooltipWidth = 320
    const tooltipHeight = 200 // Approximate

    switch (position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - spacing,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        }
      case 'bottom':
        return {
          top: targetRect.bottom + spacing,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
        }
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - spacing,
        }
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + spacing,
        }
    }
  }

  const tooltipPosition = getTooltipPosition()

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Overlay with spotlight cutout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${
              targetRect.top + targetRect.height / 2
            }px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 10}px, rgba(0, 0, 0, 0.7) ${
              Math.max(targetRect.width, targetRect.height) / 2 + 50
            }px)`,
          }}
          onClick={handleSkip}
        />

        {/* Highlighted element border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute border-4 border-blue-500 rounded-lg pointer-events-none shadow-lg shadow-blue-500/50"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        >
          {/* Animated pulse ring */}
          <motion.div
            className="absolute inset-0 border-4 border-blue-400 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bg-white rounded-xl shadow-2xl p-6 w-80 max-w-[90vw]"
          style={{
            top: Math.max(20, Math.min(tooltipPosition.top, window.innerHeight - 220)),
            left: Math.max(20, Math.min(tooltipPosition.left, window.innerWidth - 340)),
          }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close tour"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">{currentStep.title}</h3>
              <span className="text-xs text-gray-500 font-medium">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{currentStep.description}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-500/30"
            >
              {currentStep.action || (isLastStep ? 'Finish' : 'Next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentStepIndex
                    ? 'w-6 bg-blue-600'
                    : index < currentStepIndex
                    ? 'w-1.5 bg-blue-400'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
