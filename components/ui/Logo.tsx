import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { height: 28, width: 112 },   // Smaller for header - better mobile fit
    md: { height: 50, width: 200 },   // Medium for footer
    lg: { height: 60, width: 240 },   // Large for hero sections
  };

  const { height, width } = sizes[size];

  // Responsive classes based on size
  const responsiveClasses = {
    sm: 'h-5 w-auto md:h-7',     // Mobile: 20px, Desktop: 28px
    md: 'h-10 w-auto md:h-12',   // Mobile: 40px, Desktop: 48px
    lg: 'h-12 w-auto md:h-14',   // Mobile: 48px, Desktop: 56px
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/job.agent.ph2.png"
        alt="Job Agent PH"
        width={width}
        height={height}
        className={`object-contain ${responsiveClasses[size]}`}
        priority
      />
    </div>
  );
}
