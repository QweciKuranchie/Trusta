import React from 'react';
import { Badge } from './Badge';
import { formatCurrency, formatDate } from '../utils/format';
import type { Transaction } from '../types';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

const statusBadgeVariant = {
  completed: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onClick,
}) => {
  const { counterparty, amount, type, date, status } = transaction;
  const isCredit = type === 'credit';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        flex items-center justify-between gap-4
        px-4 py-3 sm:py-4
        transition-colors duration-150
        ${onClick ? 'cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50' : ''}
        border-b border-surface-100 dark:border-surface-700/50 last:border-b-0
      `.trim()}
    >
      {/* Left side: counterparty + date (mobile stacked) */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">
          {counterparty}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {formatDate(date)}
          </span>
          <Badge variant={statusBadgeVariant[status]}>
            {status}
          </Badge>
        </div>
      </div>

      {/* Right side: amount */}
      <span
        className={`
          text-sm font-semibold tabular-nums whitespace-nowrap
          ${isCredit ? 'text-success-600 dark:text-success-400' : 'text-surface-800 dark:text-surface-200'}
        `.trim()}
      >
        {isCredit ? '+' : '−'} {formatCurrency(amount)}
      </span>
    </div>
  );
};
