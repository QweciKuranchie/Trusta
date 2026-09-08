/**
 * DashboardScreen — Main authenticated landing page.
 *
 * - Balance card with masked account number
 * - "Send Money" CTA
 * - Recent 5 transactions
 * - "View all" link → /transactions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../slices/auth/AuthContext';
import { useAccount } from '../slices/account/AccountContext';
import { Card, Button, TransactionRow } from '../components';
import { formatCurrency, maskAccountNumber } from '../utils/format';

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, recentTransactions, selectTransaction } = useAccount();

  if (!user) return null;

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Good {getGreeting()}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Here's an overview of your account
        </p>
      </div>

      {/* Balance Card */}
      <Card padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full" />
        <div className="relative">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
            Available Balance
          </p>
          <p className="text-4xl font-bold text-surface-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-surface-400 dark:text-surface-500 font-mono mt-2">
            Account {maskAccountNumber(user.accountNumber)}
          </p>

          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/send')}
            >
              <SendIcon className="w-4 h-4" />
              Send Money
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
            Recent Transactions
          </h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            View all →
          </button>
        </div>

        <Card padding="none">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onClick={() => {
                  selectTransaction(tx.id);
                  navigate(`/transactions/${tx.id}`);
                }}
              />
            ))
          ) : (
            <div className="py-12 text-center text-sm text-surface-400 dark:text-surface-500">
              No transactions yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

export default DashboardScreen;
