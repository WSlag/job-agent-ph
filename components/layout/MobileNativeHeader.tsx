'use client';

import { useEffect, useState, ReactNode } from 'react';
import { ChevronLeft, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface MobileNativeHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: ReactNode;
  variant?: 'ios' | 'android' | 'auto';
  hideOnScroll?: boolean;
  showShadowOnScroll?: boolean;
  className?: string;
}

export default function MobileNativeHeader({
  title,
  onBack,
  actions,
  variant = 'auto',
  hideOnScroll = false,
  showShadowOnScroll = true,
  className = '',
}: MobileNativeHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVariant, setHeaderVariant] = useState<'ios' | 'android'>('ios');

  // Detect platform
  useEffect(() => {
    if (variant === 'auto') {
      const isAndroid = /Android/.test(navigator.userAgent);
      setHeaderVariant(isAndroid ? 'android' : 'ios');
    } else {
      setHeaderVariant(variant);
    }
  }, [variant]);

  // Handle scroll behavior
  useEffect(() => {
    let ticking = false;
    const scrollThreshold = 5;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Show shadow when scrolled
      if (showShadowOnScroll) {
        setIsScrolled(currentScrollY > 0);
      }

      // Hide on scroll down, show on scroll up
      if (hideOnScroll && Math.abs(currentScrollY - lastScrollY) >= scrollThreshold) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hideOnScroll, showShadowOnScroll, lastScrollY]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // iOS-style header
  if (headerVariant === 'ios') {
    return (
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-white/80 backdrop-blur-lg
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'border-b border-gray-200/50 shadow-sm' : 'border-b border-transparent'}
          ${isHidden ? '-translate-y-full' : 'translate-y-0'}
          ${className}
        `}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0)',
          paddingLeft: 'env(safe-area-inset-left, 0)',
          paddingRight: 'env(safe-area-inset-right, 0)',
          willChange: 'transform',
        }}
      >
        <nav
          className="h-11 flex items-center justify-between px-2 relative"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Left: Back button */}
          <div className="flex z-10">
            {onBack !== undefined && (
              <button
                onClick={handleBack}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center gap-1 px-2 rounded-lg transition-colors hover:bg-black/5 active:bg-black/10 text-blue-600"
                aria-label="Navigate back"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
                <span className="text-[17px] font-normal">Back</span>
              </button>
            )}
          </div>

          {/* Center: Title */}
          <h1
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-semibold text-gray-900 max-w-[50%] truncate z-0"
            id="page-title"
          >
            {title}
          </h1>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 z-10">
            {actions}
          </div>
        </nav>
      </header>
    );
  }

  // Android Material Design-style header
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white transition-shadow duration-200
        ${isScrolled ? 'shadow-md' : 'shadow-none'}
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        transition-transform duration-300 ease-in-out
        ${className}
      `}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        willChange: 'transform',
      }}
    >
      <div
        className="h-14 flex items-center px-1"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left: Back arrow */}
        {onBack !== undefined && (
          <button
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 active:bg-black/12 text-gray-900"
            aria-label="Navigate up"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Left-aligned title (Android style) */}
        <h1
          className="flex-1 text-[20px] font-medium text-gray-900 px-4 truncate"
          id="page-title"
        >
          {title}
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 mr-1">
          {actions}
        </div>
      </div>
    </header>
  );
}

// Action button component for consistent styling
export function HeaderAction({
  onClick,
  icon,
  label,
  variant = 'auto',
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: 'ios' | 'android' | 'auto';
}) {
  const [buttonVariant, setButtonVariant] = useState<'ios' | 'android'>('ios');

  useEffect(() => {
    if (variant === 'auto') {
      const isAndroid = /Android/.test(navigator.userAgent);
      setButtonVariant(isAndroid ? 'android' : 'ios');
    } else {
      setButtonVariant(variant);
    }
  }, [variant]);

  if (buttonVariant === 'ios') {
    return (
      <button
        onClick={onClick}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center px-2 rounded-lg transition-colors hover:bg-black/5 active:bg-black/10 text-blue-600"
        aria-label={label}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 active:bg-black/12 text-gray-900"
      aria-label={label}
    >
      {icon}
    </button>
  );
}
