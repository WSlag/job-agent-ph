'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Sparkles, CreditCard, ArrowRight, ArrowLeft, Gift } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'
import { getDbInstance } from '@/lib/firebase'

interface PricingExplainerModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

const steps = [
  {
    title: 'Welcome to Job Agency Pricing',
    subtitle: 'Simple, transparent pricing for your recruitment needs',
    icon: Sparkles,
  },
  {
    title: 'Start Free',
    subtitle: 'Post your first jobs at no cost',
    icon: Gift,
  },
  {
    title: 'Grow with Premium',
    subtitle: 'Unlock unlimited job postings',
    icon: Sparkles,
  },
  {
    title: 'How Billing Works',
    subtitle: 'Simple payment process',
    icon: CreditCard,
  },
  {
    title: 'Ready to Get Started',
    subtitle: 'Your journey begins here',
    icon: CheckCircle2,
  },
]

export default function PricingExplainerModal({
  isOpen,
  onClose,
  onComplete,
}: PricingExplainerModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuth()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    // Track that user has seen the pricing explainer
    if (user?.uid) {
      try {
        const db = getDbInstance();
        const agencyRef = doc(db, 'agencies', user.uid)
        await updateDoc(agencyRef, {
          pricingExplainerSeen: true,
          pricingExplainerSeenAt: Timestamp.now(),
        })
      } catch (error) {
        console.error('Error tracking pricing explainer view:', error)
        // Don't block the user if tracking fails
      }
    }

    if (onComplete) {
      onComplete()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 border-b border-gray-100">
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-6">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Step Indicator */}
                <div className="text-sm text-gray-500 mb-2">
                  Step {currentStep + 1} of {steps.length}
                </div>

                {/* Title */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const Icon = steps[currentStep].icon
                        return <Icon className="w-8 h-8 text-blue-600" />
                      })()}
                      <h2 className="text-2xl font-bold text-gray-900">
                        {steps[currentStep].title}
                      </h2>
                    </div>
                    <p className="text-gray-600">{steps[currentStep].subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-300px)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 0: Welcome */}
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Why we created this pricing model
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            We believe every agency should have the opportunity to find great talent.
                            That's why we offer a generous free tier to get you started, with affordable
                            premium plans as your business grows.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
                            <div className="text-sm text-gray-600">Free lifetime posts</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-1">₱5,000</div>
                            <div className="text-sm text-gray-600">Premium per month</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 text-center">
                          Let's walk through how our pricing works →
                        </p>
                      </div>
                    )}

                    {/* Step 1: Free Tier */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              FREE TIER
                            </div>
                            <div className="text-2xl font-bold text-gray-900">2 Lifetime Posts</div>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-4">
                            Every agency gets <strong>2 free job posts</strong> that never expire.
                            Perfect for testing our platform or if you only hire occasionally.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">What's included:</h4>
                          <ul className="space-y-2">
                            {[
                              'Post up to 2 jobs (lifetime)',
                              'Full access to applicant tracking',
                              'Direct messaging with candidates',
                              'Job post editing and management',
                              'No credit card required',
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-sm text-amber-800">
                            <strong>Important:</strong> Once you've used your 2 free posts, you'll need
                            to upgrade to Premium to post more jobs.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Premium Tier */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              PREMIUM
                            </div>
                            <div className="text-2xl font-bold text-gray-900">₱5,000 / month</div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Upgrade to Premium for <strong>unlimited job postings</strong> and
                            exclusive features to help you hire faster.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Premium benefits:</h4>
                          <ul className="space-y-2">
                            {[
                              'Unlimited job posts per month',
                              'All Free tier features included',
                              'Priority support',
                              'Access to featured job placement (additional fee)',
                              'Advanced analytics (coming soon)',
                              'Bulk job posting tools (coming soon)',
                            ].map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="font-semibold text-blue-900 mb-1">Featured Jobs</h5>
                              <p className="text-sm text-blue-800">
                                Premium subscribers can boost specific jobs to the top of search results
                                for ₱10,000 per job. Get 3x more visibility!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: How Billing Works */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Simple 3-step payment process
                          </h3>
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Submit Payment</h4>
                                <p className="text-sm text-gray-600">
                                  Pay ₱5,000 via GCash, Bank Transfer, or PayMaya
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                2
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Upload Proof</h4>
                                <p className="text-sm text-gray-600">
                                  Submit a screenshot or photo of your payment receipt
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                3
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Get Verified</h4>
                                <p className="text-sm text-gray-600">
                                  Our team verifies your payment (usually within 24 hours)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Accepted payment methods:</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="border border-gray-200 rounded-lg p-3 text-center">
                              <CreditCard className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                              <div className="text-sm font-medium text-gray-900">GCash</div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 text-center">
                              <CreditCard className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                              <div className="text-sm font-medium text-gray-900">Bank Transfer</div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 text-center">
                              <CreditCard className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                              <div className="text-sm font-medium text-gray-900">PayMaya</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-800">
                            <strong>Monthly subscription:</strong> Your premium access lasts for 30 days
                            from verification. You'll be notified before it expires.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Get Started */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            You're all set!
                          </h3>
                          <p className="text-gray-600">
                            Now you understand how our pricing works
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-3">Quick summary:</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>✓ Start with 2 free lifetime job posts</li>
                            <li>✓ Upgrade to Premium for ₱5,000/month (unlimited posts)</li>
                            <li>✓ Add featured placement for ₱10,000 per job (premium only)</li>
                            <li>✓ Simple payment verification process</li>
                            <li>✓ Cancel anytime, no long-term commitments</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Ready to start hiring?</h4>
                          <p className="text-gray-600 text-sm">
                            You can post your first job for free right now. When you're ready to grow,
                            upgrading to Premium takes just a few minutes.
                          </p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-sm text-amber-800">
                            <strong>Need help?</strong> Our support team is always ready to assist you
                            with any questions about pricing, billing, or upgrading your account.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Skip for now
                </button>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        Got it!
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
