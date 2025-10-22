import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { height: 32, width: 180 },
    md: { height: 40, width: 225 },
    lg: { height: 56, width: 315 },
  };

  const { height, width } = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Job Agent PH"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
