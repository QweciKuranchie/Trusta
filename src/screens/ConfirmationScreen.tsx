/**
 * ConfirmationScreen — Transfer summary before execution.
 *
 * - Summary card: recipient, amount, note, fee (₵0.00)
 * - "Confirm & Send" → triggers transfer
 * - "Edit" → back to /send (form preserved)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../slices/transfer/TransferContext';
import { useAccount } from '../slices/account/AccountContext';
import { GlobalOverlay } from '../shell/GlobalOverlay';
import { Card, Button } from '../components';
import { formatCurrency } from '../utils/format';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { confirmedTransfer, status, confirmTransfer } = useTransfer();
  const { balance, commitTransfer } = useAccount();

  // If no confirmed transfer, redirect back to form
  if (!confirmedTransfer) {
    navigate('/send', { replace: true });
    return null;
  }

  const { recipient, amount, note } = confirmedTransfer;

  const handleConfirm = async () => {
    await confirmTransfer(balance, (amt, tx) => {
      commitTransfer(amt, tx);
    });
  };

  // Navigate on status change
  React.useEffect(() => {
    if (status === 'success') {
      navigate('/send/success', { replace: true });
    } else if (status === 'failure' || status === 'network_error') {
      navigate('/send/failure', { replace: true });
    }
  }, [status, navigate]);

  return (
    <>
      <GlobalOverlay isVisible={status === 'processing'} />

      <div className="page-container animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Confirm Transfer
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Please review the details below
          </p>
        </div>

        <Card padding="lg" className="max-w-lg">
          <div className="space-y-4">
            <SummaryRow label="Recipient" value={recipient} />
            <SummaryRow label="Amount" value={formatCurrency(amount)} highlight />
            {note && <SummaryRow label="Note" value={note} />}
            <SummaryRow label="Fee" value="₵ 0.00" />

            <div className="border-t border-surface-100 dark:border-surface-700 pt-4">
              <SummaryRow
                label="Total"
                value={formatCurrency(amount)}
                highlight
                bold
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="secondary"
              size="lg"
              className="sm:flex-1"
              onClick={() => navigate('/send')}
            >
              ← Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="sm:flex-1"
              onClick={handleConfirm}
              disabled={status === 'processing'}
            >
              Confirm & Send
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

function SummaryRow({
  label,
  value,
  highlight = false,
  bold = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${bold ? 'font-semibold text-surface-800 dark:text-surface-100' : 'text-surface-500 dark:text-surface-400'}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${
          highlight
            ? 'font-semibold text-surface-900 dark:text-white'
            : 'font-medium text-surface-700 dark:text-surface-200'
        } ${bold ? 'text-base' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

export default ConfirmationScreen;
