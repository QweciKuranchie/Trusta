import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import LoginScreen from '../LoginScreen';
import * as MockService from '../../services/MockService';

vi.mock('../../services/MockService');

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form with inputs and demo credentials', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByRole('heading', { name: /welcome to trusta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
  });

  it('submits credentials and calls simulateAuth', async () => {
    const user = userEvent.setup();
    vi.mocked(MockService.simulateAuth).mockResolvedValue({
      success: true,
      user: {
        id: 'usr_1',
        name: 'Kofi Mensah',
        email: 'demo@trusta.io',
        avatarInitials: 'KM',
        accountNumber: '•••• 4821',
      },
    });

    renderWithProviders(<LoginScreen />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'demo@trusta.io');
    await user.type(passwordInput, 'password123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(MockService.simulateAuth).toHaveBeenCalledWith('demo@trusta.io', 'password123');
    });
  });

  it('displays error message when login fails', async () => {
    const user = userEvent.setup();
    vi.mocked(MockService.simulateAuth).mockResolvedValue({
      success: false,
      error: 'Invalid email or password.',
    });

    renderWithProviders(<LoginScreen />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@trusta.io');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
