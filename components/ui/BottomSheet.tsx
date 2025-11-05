'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface BottomSheetProps {
  /**
   * Whether the bottom sheet is open
   */
  isOpen: boolean;
  /**
   * Callback when bottom sheet should close
   */
  onClose: () => void;
  /**
   * Bottom sheet content
   */
  children: React.ReactNode;
  /**
   * Title to display in header
   */
  title?: string;
  /**
   * Whether to show the drag handle
   */
  showDragHandle?: boolean;
  /**
   * Whether swipe-to-dismiss is enabled
   */
  dismissible?: boolean;
  /**
   * Snap point (percentage of viewport height)
   * - 'half': 50% of viewport
   * - 'full': 90% of viewport
   * - number: custom percentage
   */
  snapPoint?: 'half' | 'full' | number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * BottomSheet Component
 *
 * iOS-style bottom sheet modal with swipe-to-dismiss gesture.
 * Perfect for mobile filters, forms, and contextual actions.
 *
 * @example
 * ```tsx
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Filter Jobs"
 *   dismissible
 * >
 *   <FilterContent />
 * </BottomSheet>
 * ```
 */
export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showDragHandle = true,
  dismissible = true,
  snapPoint = 'full',
  className = '',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Calculate height based on snap point
  const getHeight = () => {
    if (snapPoint === 'half') return '50vh';
    if (snapPoint === 'full') return '90vh';
    return `${snapPoint}vh`;
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && dismissible) {
      onClose();
    }
  };

  // Handle drag to dismiss
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (dismissible && info.offset.y > 100) {
      onClose();
    }
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && dismissible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, dismissible, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal-backdrop)]"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag={dismissible ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className={`
              fixed
              bottom-0
              left-0
              right-0
              bg-white
              rounded-t-3xl
              shadow-2xl
              z-[var(--z-modal)]
              flex
              flex-col
              ${className}
            `}
            style={{
              maxHeight: getHeight(),
              touchAction: 'none',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Drag Handle */}
            {showDragHandle && (
              <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2
                  id="bottom-sheet-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
                {dismissible && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              {children}
            </div>

            {/* Safe area padding for iOS */}
            <div className="safe-area-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * BottomSheetTrigger Component
 *
 * Convenient wrapper for triggering a bottom sheet
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <BottomSheetTrigger onClick={() => setIsOpen(true)}>
 *   Open Filters
 * </BottomSheetTrigger>
 *
 * <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   Content
 * </BottomSheet>
 * ```
 */
interface BottomSheetTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function BottomSheetTrigger({
  children,
  onClick,
  className = '',
}: BottomSheetTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
