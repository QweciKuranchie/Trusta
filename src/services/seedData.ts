/**
 * Seed data for the mock service.
 * Provides the demo user, starting balance, and pre-loaded transactions.
 */

import type { User, Transaction } from '../types';

export const SEED_USER: User = {
  id: 'usr_001',
  name: 'Richard Nuhu',
  email: 'demo@trusta.io',
  avatarInitials: 'RN',
  accountNumber: '0241234567',
};

export const SEED_PASSWORD = 'password123';

export const SEED_BALANCE = 12_450.0;

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-8A3F1B2C',
    type: 'debit',
    counterparty: 'Accra Mall Shopping',
    amount: 245.5,
    date: '2026-09-07T14:30:00Z',
    status: 'completed',
    note: 'Groceries and supplies',
  },
  {
    id: 'TXN-7B2E4D9A',
    type: 'credit',
    counterparty: 'Monthly Salary',
    amount: 5_200.0,
    date: '2026-09-05T09:00:00Z',
    status: 'completed',
    note: 'September salary deposit',
  },
  {
    id: 'TXN-6C1D3E8F',
    type: 'debit',
    counterparty: 'ECG Electricity',
    amount: 180.0,
    date: '2026-09-04T11:15:00Z',
    status: 'completed',
    note: 'Monthly electricity bill',
  },
  {
    id: 'TXN-5D9F2A7B',
    type: 'debit',
    counterparty: 'Bolt Rides',
    amount: 35.0,
    date: '2026-09-03T18:45:00Z',
    status: 'completed',
  },
  {
    id: 'TXN-4E8A1C6D',
    type: 'credit',
    counterparty: 'Kwame Asante',
    amount: 500.0,
    date: '2026-09-02T13:20:00Z',
    status: 'completed',
    note: 'Repayment for weekend trip',
  },
  {
    id: 'TXN-3F7B9D5E',
    type: 'debit',
    counterparty: 'Vodafone Broadband',
    amount: 120.0,
    date: '2026-09-01T08:00:00Z',
    status: 'pending',
    note: 'Monthly internet subscription',
  },
  {
    id: 'TXN-2A6C8E4F',
    type: 'debit',
    counterparty: 'Melcom Online',
    amount: 890.0,
    date: '2026-08-30T16:30:00Z',
    status: 'completed',
    note: 'Home electronics',
  },
  {
    id: 'TXN-1B5D7F3A',
    type: 'credit',
    counterparty: 'Freelance Payment',
    amount: 1_200.0,
    date: '2026-08-28T10:00:00Z',
    status: 'completed',
    note: 'Website design project',
  },
];
