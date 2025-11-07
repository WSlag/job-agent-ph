'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, FileText, MapPin, Lightbulb, User, CheckCircle2 } from 'lucide-react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useState } from 'react'
import Link from 'next/link'

interface ChecklistItem {
  id: keyof typeof import('@/contexts/OnboardingContext').OnboardingData.prototype.profileChecklist
  title: string
  description: string
  icon: any
  link?: string
  linkText?: string
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'resumeUploaded' as any,
    title: 'Upload Your Resume',
    description: 'Add your CV to enable Quick Apply and increase application speed',
    icon: FileText,
    link: '#resume-section',
    linkText: 'Upload Resume',
  },
  {
    id: 'skillsAdded' as any,
    title: 'Add Your Skills',
    description: 'List your key skills to improve job matching and visibility',
    icon: Lightbulb,
    link: '#skills-section',
    linkText: 'Add Skills',
  },
  {
    id: 'locationSet' as any,
    title: 'Set Your Location',
    description: 'Help agencies find candidates in your area',
    icon: MapPin,
    link: '#location-section',
    linkText: 'Set Location',
  },
  {
    id: 'bioAdded' as any,
    title: 'Write a Bio',
    description: 'Share your experience and career goals with potential employers',
    icon: User,
    link: '#bio-section',
    linkText: 'Write Bio',
  },
]

export default function ProfileChecklist() {
  const { onboardingData, getProfileCompletionPercentage } = useOnboarding()
  const [isExpanded, setIsExpanded] = useState(true)

  const completionPercentage = getProfileCompletionPercentage()
  const isComplete = completionPercentage === 100

  // Don't show if already dismissed and complete
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed && isComplete) {
    return null
  }

  const handleDismiss = () => {
    if (isComplete) {
      setIsDismissed(true)
    }
  }

  const scrollToSection = (link: string) => {
    if (link.startsWith('#')) {
      // Try to find and scroll to the element with retries
      const attemptScroll = (retriesLeft: number = 5) => {
        const element = document.querySelector(link) as HTMLElement

        if (element) {
          // Scroll to element with smooth behavior
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })

          // Add a brief highlight effect
          element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2')

          // Remove highlight after 2 seconds
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2')
          }, 2000)

          console.log(`Scrolled to section: ${link}`)
        } else if (retriesLeft > 0) {
          // Element not found yet, retry after a short delay
          setTimeout(() => attemptScroll(retriesLeft - 1), 200)
        } else {
          console.error(`Element not found for selector: ${link} after multiple attempts`)
        }
      }

      attemptScroll()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-lg overflow-hidden mb-6"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-blue-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {completionPercentage}%
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                Complete Your Profile
                {isComplete && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {isComplete
                  ? 'Excellent! Your profile is complete.'
                  : `${4 - Object.values(onboardingData?.profileChecklist || {}).filter(Boolean).length} items remaining`}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-blue-200 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-blue-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full flex items-center justify-end pr-1"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {completionPercentage > 10 && (
              <span className="text-[10px] text-white font-bold">
                {completionPercentage}%
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Checklist Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-blue-200 bg-white"
          >
            <div className="p-4 space-y-3">
              {CHECKLIST_ITEMS.map((item, index) => {
                const isCompleted = onboardingData?.profileChecklist?.[item.id as keyof typeof onboardingData.profileChecklist]
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm mb-0.5 ${
                          isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {!isCompleted && item.link && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          scrollToSection(item.link!)
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        {item.linkText || 'Complete'}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Footer */}
            {isComplete && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold text-sm">
                      Profile Complete! You're ready to apply.
                    </span>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
