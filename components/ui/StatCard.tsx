import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  /**
   * Icon to display
   */
  icon: React.ReactElement;
  /**
   * Main value/number to display
   */
  value: string | number;
  /**
   * Label/description
   */
  label: string;
  /**
   * Color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'default';
  /**
   * Optional trend information
   */
  trend?: {
    value: number;
    label?: string;
  };
  /**
   * Optional action link
   */
  action?: {
    label: string;
    href: string;
  };
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * StatCard Component
 *
 * Display key statistics and metrics with icons, trends, and optional actions.
 * Perfect for dashboards, profile pages, and analytics displays.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={<BriefcaseIcon />}
 *   value={12}
 *   label="Applications"
 *   variant="primary"
 *   trend={{ value: 20, label: "vs last month" }}
 *   action={{ label: "View All", href: "/applications" }}
 * />
 * ```
 */
export default function StatCard({
  icon,
  value,
  label,
  variant = 'default',
  trend,
  action,
  size = 'md',
  className = '',
}: StatCardProps) {
  const variantStyles = {
    default: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      value: 'text-gray-900',
      label: 'text-gray-600',
    },
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      value: 'text-primary-900',
      label: 'text-primary-700',
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success-600',
      value: 'text-success-900',
      label: 'text-success-700',
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-600',
      value: 'text-warning-900',
      label: 'text-warning-700',
    },
    danger: {
      bg: 'bg-error-50',
      icon: 'text-error-600',
      value: 'text-error-900',
      label: 'text-error-700',
    },
    info: {
      bg: 'bg-info-50',
      icon: 'text-info-600',
      value: 'text-info-900',
      label: 'text-info-700',
    },
    gold: {
      bg: 'bg-gold-50',
      icon: 'text-gold-600',
      value: 'text-gold-900',
      label: 'text-gold-700',
    },
  };

  const sizeStyles = {
    sm: {
      padding: 'p-4',
      iconSize: 20,
      value: 'text-2xl',
      label: 'text-xs',
      trend: 'text-xs',
    },
    md: {
      padding: 'p-6',
      iconSize: 24,
      value: 'text-3xl',
      label: 'text-sm',
      trend: 'text-sm',
    },
    lg: {
      padding: 'p-8',
      iconSize: 28,
      value: 'text-4xl',
      label: 'text-base',
      trend: 'text-base',
    },
  };

  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  return (
    <div
      className={`
        ${styles.bg}
        ${sizes.padding}
        rounded-xl
        border
        border-gray-200
        transition-all
        duration-300
        hover:shadow-lg
        hover:-translate-y-1
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`${styles.icon} mb-3`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: sizes.iconSize })}
      </div>

      {/* Value */}
      <div className={`${sizes.value} ${styles.value} font-bold mb-1`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Label */}
      <div className={`${sizes.label} ${styles.label} font-medium mb-2`}>
        {label}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 mb-2">
          {trend.value > 0 ? (
            <TrendingUp size={14} className="text-success-600" />
          ) : trend.value < 0 ? (
            <TrendingDown size={14} className="text-error-600" />
          ) : null}
          <span
            className={`
              ${sizes.trend}
              font-medium
              ${trend.value > 0 ? 'text-success-600' : trend.value < 0 ? 'text-error-600' : 'text-gray-600'}
            `}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
            {trend.label && <span className="text-gray-500 ml-1">{trend.label}</span>}
          </span>
        </div>
      )}

      {/* Action Link */}
      {action && (
        <Link
          href={action.href}
          className={`
            ${sizes.label}
            text-primary-600
            hover:text-primary-700
            font-medium
            hover:underline
            inline-flex
            items-center
            gap-1
            mt-2
          `}
        >
          {action.label}
          <span>→</span>
        </Link>
      )}
    </div>
  );
}

/**
 * StatCardGrid Component
 *
 * Responsive grid layout for multiple stat cards
 *
 * @example
 * ```tsx
 * <StatCardGrid>
 *   <StatCard icon={<BriefcaseIcon />} value={12} label="Applications" />
 *   <StatCard icon={<CheckIcon />} value={5} label="Interviews" />
 *   <StatCard icon={<StarIcon />} value={2} label="Offers" />
 * </StatCardGrid>
 * ```
 */
interface StatCardGridProps {
  children: React.ReactNode;
  /**
   * Number of columns (responsive)
   */
  cols?: 2 | 3 | 4;
  /**
   * Gap between cards
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function StatCardGrid({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}: StatCardGridProps) {
  const colStyles = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapStyles = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={`grid ${colStyles[cols]} ${gapStyles[gap]} ${className}`}>
      {children}
    </div>
  );
}
