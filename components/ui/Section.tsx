import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'white' | 'gray' | 'gradient' | 'primary';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Section({
  children,
  className = '',
  containerClassName = '',
  background = 'white',
  padding = 'lg',
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
  };

  const paddingStyles = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  };

  return (
    <section className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
