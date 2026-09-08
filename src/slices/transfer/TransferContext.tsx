/**
 * TransferSlice — Send-money flow state management.
 *
 * Owns: form values, form errors, transfer status, confirmed transfer, result transaction.
 * Calls: MockService.simulateTransfer, AccountSlice.commitTransfer (on success)
 * Invariants:
 *   - Insufficient funds is caught at form level (before confirmation)
 *   - pendingTransfer is cleared on both success and failure
 *   - TransferSlice → AccountSlice is the only cross-slice coupling
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Transaction, TransferStatus, SendFormValues, SendFormErrors } from '../../types';
import { simulateTransfer } from '../../services/MockService';

// ── State ───────────────────────────────────────────────────

interface TransferState {
  form: SendFormValues;
  errors: SendFormErrors;
  status: TransferStatus;
  confirmedTransfer: { recipient: string; amount: number; note: string } | null;
  resultTransaction: Transaction | null;
}

const initialForm: SendFormValues = {
  recipient: '',
  amount: '',
  note: '',
};

const initialState: TransferState = {
  form: { ...initialForm },
  errors: {},
  status: 'idle',
  confirmedTransfer: null,
  resultTransaction: null,
};

// ── Actions ─────────────────────────────────────────────────

type TransferAction =
  | { type: 'UPDATE_FORM'; field: keyof SendFormValues; value: string }
  | { type: 'SET_ERRORS'; errors: SendFormErrors }
  | { type: 'CLEAR_FIELD_ERROR'; field: keyof SendFormErrors }
  | { type: 'SET_STATUS'; status: TransferStatus }
  | { type: 'SET_CONFIRMED'; transfer: { recipient: string; amount: number; note: string } }
  | { type: 'SET_RESULT'; transaction: Transaction }
  | { type: 'RESET' };

function transferReducer(state: TransferState, action: TransferAction): TransferState {
  switch (action.type) {
    case 'UPDATE_FORM':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, status: 'idle' };
    case 'CLEAR_FIELD_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_CONFIRMED':
      return { ...state, confirmedTransfer: action.transfer, status: 'idle' };
    case 'SET_RESULT':
      return { ...state, resultTransaction: action.transaction };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

// ── Validation ──────────────────────────────────────────────

function validateForm(form: SendFormValues, balance: number): SendFormErrors {
  const errors: SendFormErrors = {};

  if (!form.recipient.trim()) {
    errors.recipient = 'Recipient is required.';
  }

  const amount = parseFloat(form.amount);
  if (!form.amount.trim()) {
    errors.amount = 'Amount is required.';
  } else if (isNaN(amount)) {
    errors.amount = 'Amount must be a number.';
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  } else if (amount > balance) {
    errors.amount = 'Insufficient funds.';
  }

  return errors;
}

// ── Context ─────────────────────────────────────────────────

interface TransferContextValue extends TransferState {
  updateForm: (field: keyof SendFormValues, value: string) => void;
  clearFieldError: (field: keyof SendFormErrors) => void;
  submitForm: (balance: number) => boolean;
  confirmTransfer: (
    balance: number,
    onSuccess: (amount: number, transaction: Transaction) => void
  ) => Promise<void>;
  retry: () => void;
  reset: () => void;
}

const TransferContext = createContext<TransferContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

export const TransferProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(transferReducer, initialState);

  const updateForm = useCallback((field: keyof SendFormValues, value: string) => {
    dispatch({ type: 'UPDATE_FORM', field, value });
  }, []);

  const clearFieldError = useCallback((field: keyof SendFormErrors) => {
    dispatch({ type: 'CLEAR_FIELD_ERROR', field });
  }, []);

  /** Validate and move to confirmation. Returns true if valid. */
  const submitForm = useCallback(
    (balance: number): boolean => {
      const errors = validateForm(state.form, balance);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors });
        return false;
      }
      dispatch({
        type: 'SET_CONFIRMED',
        transfer: {
          recipient: state.form.recipient.trim(),
          amount: parseFloat(state.form.amount),
          note: state.form.note.trim(),
        },
      });
      return true;
    },
    [state.form]
  );

  /** Execute the transfer. Calls AccountSlice.commitTransfer on success via callback. */
  const confirmTransfer = useCallback(
    async (
      balance: number,
      onSuccess: (amount: number, transaction: Transaction) => void
    ) => {
      if (!state.confirmedTransfer) return;

      const { recipient, amount, note } = state.confirmedTransfer;
      dispatch({ type: 'SET_STATUS', status: 'processing' });

      const result = await simulateTransfer(amount, recipient, note, balance);

      if (result.success) {
        dispatch({ type: 'SET_RESULT', transaction: result.transaction });
        dispatch({ type: 'SET_STATUS', status: 'success' });
        onSuccess(amount, result.transaction);
      } else if (result.error === 'network') {
        dispatch({ type: 'SET_STATUS', status: 'network_error' });
      } else {
        dispatch({ type: 'SET_STATUS', status: 'failure' });
      }
    },
    [state.confirmedTransfer]
  );

  const retry = useCallback(() => {
    dispatch({ type: 'SET_STATUS', status: 'idle' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <TransferContext.Provider
      value={{
        ...state,
        updateForm,
        clearFieldError,
        submitForm,
        confirmTransfer,
        retry,
        reset,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

// ── Hook ────────────────────────────────────────────────────

export function useTransfer(): TransferContextValue {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer must be used within a TransferProvider');
  }
  return context;
}
