import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import DashboardScreen from '../DashboardScreen';

vi.mock('../../slices/auth/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../../slices/auth/AuthContext')>(
    '../../slices/auth/AuthContext'
  );
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 'usr_1',
        name: 'Kofi Mensah',
        email: 'demo@trusta.io',
        avatarInitials: 'KM',
        accountNumber: '•••• 4821',
      },
      isAuthenticated: true,
      isLoading: false,
      loginError: null,
      sessionExpired: false,
      login: vi.fn(),
      logout: vi.fn(),
      setSessionExpired: vi.fn(),
      clearSessionExpired: vi.fn(),
    }),
  };
});

describe('DashboardScreen', () => {
  it('renders user greeting, available balance, and Send Money CTA', () => {
    renderWithProviders(<DashboardScreen />);

    expect(screen.getByText(/good .*, kofi/i)).toBeInTheDocument();
    expect(screen.getByText(/available balance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send money/i })).toBeInTheDocument();
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
  });

  it('renders recent transactions from account seed', () => {
    renderWithProviders(<DashboardScreen />);

    // Should render the "View all" link/button
    expect(screen.getByRole('button', { name: /view all/i })).toBeInTheDocument();
  });
});
