import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import SendMoneyScreen from '../SendMoneyScreen';

describe('SendMoneyScreen', () => {
  it('renders form inputs and displays available balance', () => {
    renderWithProviders(<SendMoneyScreen />);

    expect(screen.getByRole('heading', { name: /send money/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText(/available balance:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
  });

  it('validates empty fields on submit and displays inline errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SendMoneyScreen />);

    const submitBtn = screen.getByRole('button', { name: /^continue$/i });
    await user.click(submitBtn);

    expect(screen.getByText(/recipient is required/i)).toBeInTheDocument();
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
  });

  it('shows error when amount exceeds balance', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SendMoneyScreen />);

    const recipientInput = screen.getByLabelText(/recipient/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitBtn = screen.getByRole('button', { name: /^continue$/i });

    await user.type(recipientInput, 'Esi Mensah');
    await user.type(amountInput, '99999999');
    await user.click(submitBtn);

    expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
  });
});
