/**
 * FailureScreen — Transfer could not be completed.
 *
 * - Red warning/error icon
 * - Informative message distinguishing network failures vs processing errors
 * - Attempted transfer details
 * - "Try Again" → calls retry() and navigates back to confirmation
 * - "Edit Details" → navigates back to /send with form data intact
 * - "Go to Dashboard" fallback CTA
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../slices/transfer/TransferContext';
import { Card, Button } from '../components';
import { formatCurrency } from '../utils/format';

const FailureScreen: React.FC = () => {
  const navigate = useNavigate();
  const { status, confirmedTransfer, retry, reset } = useTransfer();

  // If no confirmed transfer exists, redirect to send page
  if (!confirmedTransfer) {
    navigate('/send', { replace: true });
    return null;
  }

  const isNetwork = status === 'network_error';
  const { recipient, amount } = confirmedTransfer;

  const handleRetry = () => {
    retry();
    navigate('/send/confirm', { replace: true });
  };

  const handleEdit = () => {
    retry();
    navigate('/send', { replace: true });
  };

  const handleGoDashboard = () => {
    reset();
    navigate('/dashboard');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-lg mx-auto py-6 sm:py-10">
        <Card padding="lg" className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-danger-50 dark:bg-danger-950/60 border border-danger-200 dark:border-danger-800/80 flex items-center justify-center mb-6 text-danger-600 dark:text-danger-400 shadow-sm animate-scale-in">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-danger-100 dark:bg-danger-900/60 text-danger-800 dark:text-danger-300 mb-2">
            {isNetwork ? 'Network Connection Lost' : 'Transfer Unsuccessful'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-2">
            {isNetwork ? 'Connection Timed Out' : 'Transfer Could Not Be Completed'}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
            {isNetwork
              ? 'We experienced a temporary connectivity issue while contacting the banking network. No funds were debited from your account.'
              : 'The transaction was declined by the simulated payment processor. Please verify your details and try again.'}
          </p>

          {/* Attempted Details */}
          <div className="py-4 px-5 bg-surface-50 dark:bg-surface-900/70 rounded-xl border border-surface-100 dark:border-surface-700/60 mb-6 text-left space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Attempted Amount:</span>
              <span className="font-semibold text-surface-900 dark:text-white">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Recipient:</span>
              <span className="font-medium text-surface-800 dark:text-surface-200">
                {recipient}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-surface-500 dark:text-surface-400">Account Impact:</span>
              <span className="font-medium text-success-600 dark:text-success-400">
                ₵0.00 debited (Safe)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleRetry}
            >
              Try Again
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="md"
                className="sm:flex-1"
                onClick={handleEdit}
              >
                Edit Transfer
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="sm:flex-1"
                onClick={handleGoDashboard}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FailureScreen;
