import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AccountProvider, useAccount } from '../AccountContext';
import { SEED_BALANCE, SEED_TRANSACTIONS } from '../../../services/seedData';
import type { Transaction } from '../../../types';

describe('AccountContext', () => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AccountProvider>{children}</AccountProvider>
  );

  it('initializes with seed balance and transactions', () => {
    const { result } = renderHook(() => useAccount(), { wrapper });

    expect(result.current.balance).toBe(SEED_BALANCE);
    expect(result.current.transactions.length).toBe(SEED_TRANSACTIONS.length);
    expect(result.current.recentTransactions.length).toBe(Math.min(5, SEED_TRANSACTIONS.length));
    expect(result.current.selectedTransactionId).toBeNull();
  });

  it('commitTransfer deducts balance and prepends new transaction', () => {
    const { result } = renderHook(() => useAccount(), { wrapper });

    const newTx: Transaction = {
      id: 'tx_test_123',
      type: 'debit',
      counterparty: 'Ama Osei',
      amount: 250.0,
      date: new Date().toISOString(),
      status: 'completed',
      note: 'Grocery share',
    };

    const initialBalance = result.current.balance;
    const initialCount = result.current.transactions.length;

    act(() => {
      result.current.commitTransfer(250.0, newTx);
    });

    expect(result.current.balance).toBe(initialBalance - 250.0);
    expect(result.current.transactions.length).toBe(initialCount + 1);
    expect(result.current.transactions[0]).toEqual(newTx);
  });

  it('finds transaction by ID with getTransactionById', () => {
    const { result } = renderHook(() => useAccount(), { wrapper });
    const firstTx = SEED_TRANSACTIONS[0];

    const found = result.current.getTransactionById(firstTx.id);
    expect(found).toEqual(firstTx);

    const notFound = result.current.getTransactionById('non_existent_id');
    expect(notFound).toBeUndefined();
  });

  it('updates selectedTransactionId on selectTransaction', () => {
    const { result } = renderHook(() => useAccount(), { wrapper });

    act(() => {
      result.current.selectTransaction('tx_001');
    });

    expect(result.current.selectedTransactionId).toBe('tx_001');

    act(() => {
      result.current.selectTransaction(null);
    });

    expect(result.current.selectedTransactionId).toBeNull();
  });
});
