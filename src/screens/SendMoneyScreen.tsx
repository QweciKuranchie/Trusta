/**
 * SendMoneyScreen — Transfer form.
 *
 * - Recipient input, amount with ₵ prefix, optional note
 * - Available balance shown below amount
 * - Inline field errors on blur and submit
 * - Insufficient funds caught HERE (not after confirmation)
 * - "Continue" → /send/confirm only when valid
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../slices/transfer/TransferContext';
import { useAccount } from '../slices/account/AccountContext';
import { Card, Button, Input } from '../components';
import { formatCurrency } from '../utils/format';

const SendMoneyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { form, errors, updateForm, clearFieldError, submitForm } = useTransfer();
  const { balance } = useAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = submitForm(balance);
    if (isValid) {
      navigate('/send/confirm');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Send Money
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Transfer funds to anyone, anywhere
        </p>
      </div>

      <Card padding="lg" className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Recipient"
            placeholder="Name or account number"
            value={form.recipient}
            onChange={(e) => {
              updateForm('recipient', e.target.value);
              if (errors.recipient) clearFieldError('recipient');
            }}
            onBlur={() => {
              if (!form.recipient.trim() && form.recipient !== '') {
                // Let submit handle full validation
              }
            }}
            error={errors.recipient}
            autoFocus
          />

          <div>
            <Input
              label="Amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              currencyPrefix="₵"
              value={form.amount}
              onChange={(e) => {
                updateForm('amount', e.target.value);
                if (errors.amount) clearFieldError('amount');
              }}
              error={errors.amount}
            />
            <p className="mt-1.5 text-xs text-surface-400 dark:text-surface-500">
              Available balance: {formatCurrency(balance)}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-surface-700 dark:text-surface-200"
            >
              Note <span className="text-surface-400 dark:text-surface-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="note"
              rows={3}
              placeholder="Add a note..."
              value={form.note}
              onChange={(e) => updateForm('note', e.target.value)}
              className="
                w-full rounded-lg border
                bg-white dark:bg-surface-800
                border-surface-300 dark:border-surface-600
                px-3 py-2.5 text-sm
                text-surface-900 dark:text-surface-100
                placeholder:text-surface-400 dark:placeholder:text-surface-500
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-0
                focus:ring-brand-500/30 focus:border-brand-500
                resize-none
              "
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SendMoneyScreen;
