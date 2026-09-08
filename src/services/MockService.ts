/**
 * MockService — Simulated async network layer.
 *
 * Provides fake authentication and transfer operations with:
 * - Configurable network failure rate (15% by default)
 * - Random delays between 800ms–2000ms to make loading states visible
 * - Stateless across calls (each call is independent)
 */

import type { User, Transaction } from '../types';
import { SEED_USER, SEED_PASSWORD } from './seedData';
import { generateTransactionId } from '../utils/format';

const NETWORK_FAILURE_RATE = 0.15;
const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 2000;

/** Simulate network latency with a random delay */
function randomDelay(): Promise<void> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true with the configured probability */
function shouldSimulateFailure(): boolean {
  return Math.random() < NETWORK_FAILURE_RATE;
}

// ── Authentication ──────────────────────────────────────────

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

export async function simulateAuth(
  email: string,
  password: string
): Promise<AuthResult> {
  await randomDelay();

  if (shouldSimulateFailure()) {
    return { success: false, error: 'Network error. Please try again.' };
  }

  if (email === SEED_USER.email && password === SEED_PASSWORD) {
    return { success: true, user: SEED_USER };
  }

  return { success: false, error: 'Invalid email or password.' };
}

// ── Transfer ────────────────────────────────────────────────

export type TransferResult =
  | { success: true; transaction: Transaction }
  | { success: false; error: 'network' | 'insufficient_funds' | 'unknown' };

export async function simulateTransfer(
  amount: number,
  recipient: string,
  note: string,
  currentBalance: number
): Promise<TransferResult> {
  await randomDelay();

  // Check balance (this is a server-side re-validation)
  if (amount > currentBalance) {
    return { success: false, error: 'insufficient_funds' };
  }

  if (shouldSimulateFailure()) {
    return { success: false, error: 'network' };
  }

  const transaction: Transaction = {
    id: generateTransactionId(),
    type: 'debit',
    counterparty: recipient,
    amount,
    date: new Date().toISOString(),
    status: 'completed',
    note: note || undefined,
  };

  return { success: true, transaction };
}
