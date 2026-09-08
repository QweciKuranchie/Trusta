import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  success: 'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-400 ring-success-600/20',
  warning: 'bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-400 ring-warning-600/20',
  error:   'bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-400 ring-danger-600/20',
  neutral: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300 ring-surface-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        text-xs font-medium
        rounded-full
        ring-1 ring-inset
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
};
