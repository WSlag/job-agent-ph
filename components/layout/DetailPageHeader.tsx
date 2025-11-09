'use client';

import { ArrowLeft, Home, ChevronRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ActionButton {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

interface DetailPageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title?: string;
  actions?: ActionButton[];
  onBack?: () => void;
}

export default function DetailPageHeader({
  breadcrumbs = [],
  title,
  actions = [],
  onBack,
}: DetailPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back Button + Breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-sm">
                  <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Home className="w-4 h-4" />
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="text-gray-600 hover:text-gray-900 transition-colors max-w-[200px] truncate"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-gray-900 font-medium max-w-[200px] truncate">
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
              )}

              {title && (
                <h1 className="text-lg font-semibold text-gray-900 ml-4">{title}</h1>
              )}
            </div>

            {/* Right: Action Buttons */}
            {actions.length > 0 && (
              <div className="flex items-center gap-2">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  const isPrimary = action.primary;
                  const variant = action.variant || 'default';

                  let buttonClass = 'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium';

                  if (isPrimary) {
                    buttonClass += ' bg-blue-600 text-white hover:bg-blue-700';
                  } else if (variant === 'outline') {
                    buttonClass += ' border border-gray-300 text-gray-700 hover:bg-gray-50';
                  } else if (variant === 'ghost') {
                    buttonClass += ' text-gray-700 hover:bg-gray-100';
                  } else {
                    buttonClass += ' bg-gray-100 text-gray-700 hover:bg-gray-200';
                  }

                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={buttonClass}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
            )}
            {!title && breadcrumbs.length > 0 && (
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {breadcrumbs[breadcrumbs.length - 1].label}
              </h1>
            )}
          </div>

          {/* Right: Primary Action Only (Mobile) */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions
                .filter((action) => action.primary)
                .slice(0, 2)
                .map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label={action.label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
