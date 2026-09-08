/**
 * TransactionHistoryScreen — Full transaction list.
 *
 * - Reverse-chronological order
 * - Status badges (completed/pending/failed)
 * - Empty state when no transactions
 * - Click row → /transactions/:id
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../slices/account/AccountContext';
import { Card, TransactionRow, EmptyState } from '../components';

const TransactionHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, selectTransaction } = useAccount();

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Transaction History
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Card padding="none">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
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
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            }
            title="No transactions yet"
            description="Your transaction history will appear here once you start sending or receiving money."
            actionLabel="Send Money"
            onAction={() => navigate('/send')}
          />
        )}
      </Card>
    </div>
  );
};

export default TransactionHistoryScreen;
