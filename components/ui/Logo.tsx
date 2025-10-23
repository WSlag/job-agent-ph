import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { height: 32, width: 240 },   // 7.5:1 ratio (32 * 7.5 = 240)
    md: { height: 40, width: 300 },   // 7.5:1 ratio (40 * 7.5 = 300)
    lg: { height: 56, width: 420 },   // 7.5:1 ratio (56 * 7.5 = 420)
  };

  const { height, width } = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.gradient.png"
        alt="Job Agent PH"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
