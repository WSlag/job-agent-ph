'use client';

import React, { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MessageCircle, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui';

interface WelcomeSlide {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: WelcomeSlide[] = [
  {
    id: 1,
    icon: <Shield size={80} className="text-primary-600" />,
    title: 'Safe & Verified',
    description: 'All agencies are DMW-verified. Your security and safety are our top priorities.',
  },
  {
    id: 2,
    icon: <MessageCircle size={80} className="text-primary-600" />,
    title: 'Talk Directly',
    description: 'Connect directly with agencies. No middlemen, just straight conversations.',
  },
  {
    id: 3,
    icon: <Sparkles size={80} className="text-primary-600" />,
    title: 'Jobs That Match You',
    description: 'AI-powered matching finds jobs that perfectly fit your skills and preferences.',
  },
];

interface WelcomeCarouselProps {
  /**
   * Callback when carousel is dismissed
   */
  onComplete?: () => void;
  /**
   * Callback when skip is clicked
   */
  onSkip?: () => void;
}

/**
 * WelcomeCarousel Component
 *
 * Optional 3-slide introduction to the app.
 * NOT shown automatically - accessible via:
 * - Settings → "App Tour"
 * - Help menu → "How it works"
 * - First-time tooltip (dismissible)
 *
 * Features:
 * - Swipe navigation
 * - Dot indicators
 * - Skip button
 * - Get Started button on last slide
 */
export default function WelcomeCarousel({
  onComplete,
  onSkip,
}: WelcomeCarouselProps) {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Mark as seen and go to home
      localStorage.setItem('hasSeenWelcome', 'true');
      router.push('/');
    }
  };

  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Mark as seen and go to home (NOT signup)
      localStorage.setItem('hasSeenWelcome', 'true');
      router.push('/');
    }
  };

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={handleSkip}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Skip"
        >
          <X size={24} />
        </button>
      </div>

      {/* Carousel */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center px-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md text-center"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="mb-8 flex justify-center"
                  >
                    {slide.icon}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8 pt-4 safe-area-bottom">
        {/* Dot indicators */}
        <div className="mb-6">
          <StepIndicator
            steps={slides.length}
            currentStep={currentSlide + 1}
            type="dots"
            clickable
            onStepClick={(step) => scrollTo(step - 1)}
            size="md"
          />
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          {isLastSlide ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
