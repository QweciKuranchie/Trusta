import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-center justify-center
        rounded-full
        bg-gradient-to-br from-brand-500 to-brand-700
        text-white font-semibold
        select-none
        ${sizeClasses[size]}
        ${className}
      `.trim()}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};
