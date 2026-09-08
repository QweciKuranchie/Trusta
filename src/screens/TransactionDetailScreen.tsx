/**
 * TransactionDetailScreen — Full transaction detail view.
 *
 * - Back button → /transactions
 * - Transaction ID (monospace)
 * - Counterparty, amount, date/time, status badge, note, reference
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from '../slices/account/AccountContext';
import { Card, Badge, Button } from '../components';
import { formatCurrency, formatDateTime } from '../utils/format';

const statusBadgeVariant = {
  completed: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
};

const TransactionDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransactionById } = useAccount();

  const transaction = id ? getTransactionById(id) : undefined;

  if (!transaction) {
    return (
      <div className="page-container animate-fade-in">
        <div className="text-center py-20">
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            Transaction not found.
          </p>
          <Button variant="secondary" onClick={() => navigate('/transactions')}>
            ← Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  const isCredit = transaction.type === 'credit';

  return (
    <div className="page-container animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/transactions')}
        className="flex items-center gap-1.5 text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Transactions
      </button>

      <Card padding="lg" className="max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">
            {isCredit ? 'Received from' : 'Sent to'}
          </p>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-3">
            {transaction.counterparty}
          </h1>
          <p
            className={`text-3xl font-bold tabular-nums ${
              isCredit
                ? 'text-success-600 dark:text-success-400'
                : 'text-surface-900 dark:text-white'
            }`}
          >
            {isCredit ? '+' : '−'} {formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-4 border-t border-surface-100 dark:border-surface-700 pt-6">
          <DetailRow label="Status">
            <Badge variant={statusBadgeVariant[transaction.status]}>
              {transaction.status}
            </Badge>
          </DetailRow>

          <DetailRow label="Date & Time">
            {formatDateTime(transaction.date)}
          </DetailRow>

          <DetailRow label="Transaction ID">
            <span className="font-mono text-xs">
              {transaction.id}
            </span>
          </DetailRow>

          <DetailRow label="Type">
            {isCredit ? 'Credit (Incoming)' : 'Debit (Outgoing)'}
          </DetailRow>

          {transaction.note && (
            <DetailRow label="Note">
              {transaction.note}
            </DetailRow>
          )}
        </div>
      </Card>
    </div>
  );
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-surface-500 dark:text-surface-400 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-surface-800 dark:text-surface-100 text-right">
        {children}
      </span>
    </div>
  );
}

export default TransactionDetailScreen;
