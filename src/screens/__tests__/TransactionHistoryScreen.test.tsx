import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import TransactionHistoryScreen from '../TransactionHistoryScreen';
import { SEED_TRANSACTIONS } from '../../services/seedData';

describe('TransactionHistoryScreen', () => {
  it('renders heading and seeded transaction items', () => {
    renderWithProviders(<TransactionHistoryScreen />);

    expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${SEED_TRANSACTIONS.length} transactions`, 'i'))
    ).toBeInTheDocument();

    // Verify first seed transaction counterparty is visible
    expect(screen.getByText(SEED_TRANSACTIONS[0].counterparty)).toBeInTheDocument();
  });
});
