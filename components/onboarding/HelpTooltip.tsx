'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'
import { useState, useRef, useEffect, ReactNode } from 'react'

interface HelpTooltipProps {
  content: string | ReactNode
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  triggerMode?: 'hover' | 'click'
  iconClassName?: string
  maxWidth?: number
  children?: ReactNode
}

export default function HelpTooltip({
  content,
  title,
  position = 'top',
  triggerMode = 'hover',
  iconClassName = '',
  maxWidth = 280,
  children,
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const spacing = 12

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - spacing
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + spacing
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - spacing
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + spacing
          break
      }

      // Keep tooltip within viewport
      const viewportPadding = 16
      top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipRect.height - viewportPadding))
      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding))

      setTooltipPosition({ top, left })
    }
  }, [isVisible, position])

  const handleMouseEnter = () => {
    if (triggerMode === 'hover') {
      setIsVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (triggerMode === 'hover') {
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (triggerMode === 'click') {
      setIsVisible(!isVisible)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }

    if (triggerMode === 'click') {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, triggerMode])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerMode === 'click' &&
        isVisible &&
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    if (triggerMode === 'click') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, triggerMode])

  // Get arrow position for visual pointer
  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent'
      case 'bottom':
        return 'top-[-6px] left-1/2 -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent'
      case 'left':
        return 'right-[-6px] top-1/2 -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent'
      case 'right':
        return 'left-[-6px] top-1/2 -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent'
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`inline-flex items-center justify-center ${children ? '' : 'p-1 hover:bg-gray-100 rounded-full'} transition-colors group ${iconClassName}`}
        aria-label="Help information"
        type="button"
      >
        {children || <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />}
      </button>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Portal-like tooltip */}
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[200] bg-white rounded-lg shadow-2xl border border-gray-200"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                maxWidth,
              }}
            >
              <div className="p-4">
                {title && (
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                    {triggerMode === 'click' && (
                      <button
                        onClick={handleClose}
                        className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                )}
                <div className="text-sm text-gray-600 leading-relaxed">{content}</div>
              </div>

              {/* Arrow pointer */}
              <div
                className={`absolute w-3 h-3 border-[6px] ${getArrowStyles()}`}
              />
            </motion.div>

            {/* Backdrop for click mode */}
            {triggerMode === 'click' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[199]"
                onClick={handleClose}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Preset tooltips for common features
export function SaveJobTooltip() {
  return (
    <HelpTooltip
      title="Save for Later"
      content="Bookmark jobs to review later. Your saved jobs are synced across all devices and accessible from the Saved Jobs page."
      position="bottom"
    />
  )
}

export function QuickApplyTooltip() {
  return (
    <HelpTooltip
      title="Quick Apply"
      content="Apply instantly with one click using your profile resume. No forms to fill! Make sure you've uploaded your resume in your profile to use this feature."
      position="left"
    />
  )
}

export function ApplicationStatusTooltip() {
  return (
    <HelpTooltip
      title="Application Status"
      content="Track your application progress: Pending (yellow) → Reviewing (blue) → Shortlisted (purple) → Hired (green). Status updates appear in real-time."
      position="bottom"
      maxWidth={320}
    />
  )
}

export function JobMatchTooltip() {
  return (
    <HelpTooltip
      title="Match Percentage"
      content="Shows how well your skills and experience match this job's requirements. Higher percentages mean you're a stronger candidate."
      position="bottom"
    />
  )
}

export function MessageAgencyTooltip() {
  return (
    <HelpTooltip
      title="Message Agency"
      content="Connect directly with recruitment agencies to ask questions, follow up on applications, or express interest. All conversations are linked to specific job postings."
      position="bottom"
      maxWidth={300}
    />
  )
}
