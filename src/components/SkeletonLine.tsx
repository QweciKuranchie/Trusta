import React from 'react';

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  return (
    <div
      className={`animate-pulse-slow rounded-md bg-surface-200 dark:bg-surface-700 ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
