/**
 * AccountSlice — Account data management.
 *
 * Owns: balance, transaction list, selected transaction.
 * Exposes: commitTransfer(amount, transaction) for TransferSlice to call on success.
 * Invariant: Transactions are append-only (prepend to front, never mutate existing).
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Transaction } from '../../types';
import { SEED_BALANCE, SEED_TRANSACTIONS } from '../../services/seedData';

// ── State ───────────────────────────────────────────────────

interface AccountState {
  balance: number;
  transactions: Transaction[];
  selectedTransactionId: string | null;
  isLoading: boolean;
}

const initialState: AccountState = {
  balance: SEED_BALANCE,
  transactions: [...SEED_TRANSACTIONS],
  selectedTransactionId: null,
  isLoading: false,
};

// ── Actions ─────────────────────────────────────────────────

type AccountAction =
  | { type: 'SELECT_TRANSACTION'; id: string | null }
  | { type: 'COMMIT_TRANSFER'; amount: number; transaction: Transaction }
  | { type: 'SET_LOADING'; isLoading: boolean };

function accountReducer(state: AccountState, action: AccountAction): AccountState {
  switch (action.type) {
    case 'SELECT_TRANSACTION':
      return { ...state, selectedTransactionId: action.id };
    case 'COMMIT_TRANSFER':
      return {
        ...state,
        balance: state.balance - action.amount,
        transactions: [action.transaction, ...state.transactions],
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────

interface AccountContextValue extends AccountState {
  selectTransaction: (id: string | null) => void;
  commitTransfer: (amount: number, transaction: Transaction) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  recentTransactions: Transaction[];
}

const AccountContext = createContext<AccountContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  const selectTransaction = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_TRANSACTION', id });
  }, []);

  const commitTransfer = useCallback((amount: number, transaction: Transaction) => {
    dispatch({ type: 'COMMIT_TRANSFER', amount, transaction });
  }, []);

  const getTransactionById = useCallback(
    (id: string) => state.transactions.find((t) => t.id === id),
    [state.transactions]
  );

  // Most recent 5 transactions for dashboard
  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <AccountContext.Provider
      value={{
        ...state,
        selectTransaction,
        commitTransfer,
        getTransactionById,
        recentTransactions,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// ── Hook ────────────────────────────────────────────────────

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
