import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  helpText?: string;
  currencyPrefix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  currencyPrefix,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-surface-700 dark:text-surface-200"
      >
        {label}
      </label>

      <div className="relative">
        {currencyPrefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 font-medium select-none">
            {currencyPrefix}
          </span>
        )}

        <input
          id={inputId}
          className={`
            w-full rounded-lg border bg-white dark:bg-surface-800
            px-3 py-2.5 text-sm
            text-surface-900 dark:text-surface-100
            placeholder:text-surface-400 dark:placeholder:text-surface-500
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${currencyPrefix ? 'pl-8' : ''}
            ${
              error
                ? 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500'
                : 'border-surface-300 dark:border-surface-600 focus:ring-brand-500/30 focus:border-brand-500'
            }
            ${className}
          `.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger-600 dark:text-danger-400 animate-slide-down" role="alert">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-sm text-surface-500 dark:text-surface-400">
          {helpText}
        </p>
      )}
    </div>
  );
};
