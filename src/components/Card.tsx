import React from 'react';

interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-surface-800
        rounded-xl
        border border-surface-200 dark:border-surface-700
        shadow-card
        ${paddingClasses[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};
