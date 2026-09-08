/**
 * Shared type definitions used across slices and services.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  counterparty: string;
  amount: number;          // always positive; type determines sign
  date: string;            // ISO 8601
  status: 'completed' | 'pending' | 'failed';
  note?: string;
}

export type TransferStatus =
  | 'idle'
  | 'validating'
  | 'processing'
  | 'success'
  | 'failure'
  | 'network_error';

export interface SendFormValues {
  recipient: string;
  amount: string;          // string during input; parsed to number on submit
  note: string;
}

export interface SendFormErrors {
  recipient?: string;
  amount?: string;
}
