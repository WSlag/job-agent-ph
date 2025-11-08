'use client';

interface MessageBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MessageBadge({ count, className = '', size = 'md' }: MessageBadgeProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  // Show "9+" for counts greater than 9
  const displayCount = count > 9 ? '9+' : count.toString();

  return (
    <div
      className={`
        ${sizeClasses[size]}
        absolute -top-1 -right-1
        bg-red-500 text-white
        rounded-full
        flex items-center justify-center
        font-semibold
        shadow-md
        ${className}
      `}
      aria-label={`${count} unread message${count !== 1 ? 's' : ''}`}
    >
      {displayCount}
    </div>
  );
}
