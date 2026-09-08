/**
 * SuccessScreen — Transfer completed successfully.
 *
 * - Green checkmark icon with subtle scale animation
 * - "Transfer Successful" heading
 * - Amount sent (formatted in ₵)
 * - Details card: recipient, reference ID, timestamp
 * - "Go to Dashboard" and "Send Another Transfer" CTAs
 * - Resets transfer slice state on navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../slices/transfer/TransferContext';
import { Card, Button } from '../components';
import { formatCurrency, formatDateTime } from '../utils/format';

const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const { resultTransaction, confirmedTransfer, reset } = useTransfer();

  // If no completed transfer is found, redirect to dashboard
  if (!resultTransaction && !confirmedTransfer) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const amount = resultTransaction?.amount ?? confirmedTransfer?.amount ?? 0;
  const recipient = resultTransaction?.counterparty ?? confirmedTransfer?.recipient ?? '';
  const dateStr = resultTransaction?.date ?? new Date().toISOString();
  const reference = resultTransaction?.id ?? 'N/A';

  const handleGoDashboard = () => {
    reset();
    navigate('/dashboard');
  };

  const handleSendAnother = () => {
    reset();
    navigate('/send');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-lg mx-auto py-6 sm:py-10">
        <Card padding="lg" className="text-center">
          {/* Animated Success Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success-50 dark:bg-success-950/60 border border-success-200 dark:border-success-800/80 flex items-center justify-center mb-6 text-success-600 dark:text-success-400 shadow-sm animate-scale-in">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-success-100 dark:bg-success-900/60 text-success-800 dark:text-success-300 mb-2">
            Completed
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-1">
            Transfer Successful!
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
            Your funds have been sent securely
          </p>

          {/* Amount Display */}
          <div className="py-4 px-6 bg-surface-50 dark:bg-surface-900/70 rounded-xl border border-surface-100 dark:border-surface-700/60 mb-6">
            <span className="text-xs font-medium uppercase tracking-wider text-surface-400 dark:text-surface-500 block mb-1">
              Amount Sent
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tabular-nums">
              {formatCurrency(amount)}
            </div>
          </div>

          {/* Detail Breakdown */}
          <div className="space-y-3 text-left border-t border-surface-100 dark:border-surface-700/80 pt-5 pb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Recipient</span>
              <span className="font-medium text-surface-800 dark:text-surface-200">
                {recipient}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Date & Time</span>
              <span className="font-medium text-surface-800 dark:text-surface-200">
                {formatDateTime(dateStr)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Reference ID</span>
              <span className="font-mono text-xs font-medium text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">
                {reference}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Transfer Fee</span>
              <span className="font-medium text-success-600 dark:text-success-400">
                ₵0.00 (Free)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="secondary"
              size="lg"
              className="sm:flex-1"
              onClick={handleSendAnother}
            >
              Send Another
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="sm:flex-1"
              onClick={handleGoDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuccessScreen;
