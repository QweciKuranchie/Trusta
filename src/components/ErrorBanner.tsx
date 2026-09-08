import React, { useState } from 'react';

interface ErrorBannerProps {
  message: string;
  variant?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  error: {
    bg: 'bg-danger-50 dark:bg-danger-900/30 border-danger-200 dark:border-danger-800',
    text: 'text-danger-800 dark:text-danger-200',
    icon: 'text-danger-500',
    dismiss: 'text-danger-500 hover:text-danger-700 dark:hover:text-danger-300',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/30 border-warning-200 dark:border-warning-800',
    text: 'text-warning-800 dark:text-warning-200',
    icon: 'text-warning-500',
    dismiss: 'text-warning-500 hover:text-warning-700 dark:hover:text-warning-300',
  },
  info: {
    bg: 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800',
    text: 'text-brand-800 dark:text-brand-200',
    icon: 'text-brand-500',
    dismiss: 'text-brand-500 hover:text-brand-700 dark:hover:text-brand-300',
  },
};

const variantIcons = {
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
};

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  variant = 'error',
  onDismiss,
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex items-start gap-3
        px-4 py-3 rounded-lg border
        animate-slide-down
        ${styles.bg}
        ${className}
      `.trim()}
      role="alert"
    >
      <span className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
        {variantIcons[variant]}
      </span>

      <p className={`flex-1 text-sm font-medium ${styles.text}`}>
        {message}
      </p>

      {onDismiss && (
        <button
          onClick={() => {
            setDismissed(true);
            onDismiss();
          }}
          className={`flex-shrink-0 ${styles.dismiss} transition-colors`}
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};
