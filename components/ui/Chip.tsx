import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  /**
   * Label text to display
   */
  label: string;
  /**
   * Optional icon or emoji
   */
  icon?: string | React.ReactElement;
  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Make the chip removable with X button
   */
  removable?: boolean;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Make the chip clickable/selectable
   */
  clickable?: boolean;
  /**
   * Selected state (for selectable chips)
   */
  selected?: boolean;
  /**
   * Callback when chip is clicked
   */
  onClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Chip/Tag Component
 *
 * Compact elements for displaying categories, skills, countries, or any labeled items.
 * Supports icons, removability, and selection states.
 *
 * @example
 * ```tsx
 * // Basic chip
 * <Chip label="Nursing" />
 *
 * // With emoji icon
 * <Chip label="Nursing" icon="💉" />
 *
 * // Removable chip
 * <Chip label="Healthcare" removable onRemove={() => console.log('Removed')} />
 *
 * // Selectable chip
 * <Chip label="Singapore" icon="🇸🇬" clickable selected={true} onClick={handleClick} />
 * ```
 */
export default function Chip({
  label,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  clickable = false,
  selected = false,
  onClick,
  className = '',
}: ChipProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200';

  const variantStyles = {
    default: selected
      ? 'bg-gray-700 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: selected
      ? 'bg-primary-600 text-white'
      : 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    success: selected
      ? 'bg-success-600 text-white'
      : 'bg-success-100 text-success-700 hover:bg-success-200',
    warning: selected
      ? 'bg-warning-600 text-white'
      : 'bg-warning-100 text-warning-700 hover:bg-warning-200',
    danger: selected
      ? 'bg-error-600 text-white'
      : 'bg-error-100 text-error-700 hover:bg-error-200',
    info: selected
      ? 'bg-info-600 text-white'
      : 'bg-info-100 text-info-700 hover:bg-info-200',
    gold: selected
      ? 'bg-gold-600 text-white'
      : 'bg-gold-100 text-gold-800 hover:bg-gold-200 border border-gold-400',
  };

  const sizeStyles = {
    sm: {
      padding: removable ? 'pl-2 pr-1 py-0.5' : 'px-2 py-0.5',
      text: 'text-xs',
      icon: 'text-xs',
      removeButton: 'w-4 h-4',
    },
    md: {
      padding: removable ? 'pl-3 pr-1.5 py-1' : 'px-3 py-1',
      text: 'text-sm',
      icon: 'text-sm',
      removeButton: 'w-5 h-5',
    },
    lg: {
      padding: removable ? 'pl-4 pr-2 py-1.5' : 'px-4 py-1.5',
      text: 'text-base',
      icon: 'text-base',
      removeButton: 'w-6 h-6',
    },
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick when clicking remove
    if (onRemove) {
      onRemove();
    }
  };

  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a string (emoji or text)
    if (typeof icon === 'string') {
      return <span className={sizeStyles[size].icon}>{icon}</span>;
    }

    // If icon is a React element (Lucide icon component)
    return React.cloneElement(icon as React.ReactElement<any>, {
      size: size === 'sm' ? 12 : size === 'md' ? 14 : 16,
    });
  };

  const ChipContent = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      <span className={`${sizeStyles[size].text} leading-none`}>{label}</span>
      {icon && iconPosition === 'right' && !removable && renderIcon()}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={`
            ${sizeStyles[size].removeButton}
            flex
            items-center
            justify-center
            rounded-full
            hover:bg-black/10
            transition-colors
            ml-1
          `}
          aria-label={`Remove ${label}`}
        >
          <X size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />
        </button>
      )}
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size].padding}
          ${className}
          cursor-pointer
          hover:scale-105
          ${selected ? 'ring-2 ring-offset-1 ring-current' : ''}
        `}
      >
        {ChipContent}
      </button>
    );
  }

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size].padding}
        ${className}
      `}
    >
      {ChipContent}
    </span>
  );
}

/**
 * ChipGroup Component
 *
 * Container for multiple chips with consistent spacing
 *
 * @example
 * ```tsx
 * <ChipGroup>
 *   <Chip label="JavaScript" />
 *   <Chip label="React" />
 *   <Chip label="Node.js" />
 * </ChipGroup>
 * ```
 */
interface ChipGroupProps {
  children: React.ReactNode;
  /**
   * Gap between chips
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Whether to wrap chips to multiple lines
   */
  wrap?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ChipGroup({
  children,
  gap = 'md',
  wrap = true,
  className = '',
}: ChipGroupProps) {
  const gapStyles = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  return (
    <div
      className={`
        flex
        items-center
        ${wrap ? 'flex-wrap' : 'flex-nowrap overflow-x-auto'}
        ${gapStyles[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
