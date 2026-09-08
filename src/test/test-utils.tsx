import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../shell/ThemeContext';
import { AuthProvider } from '../slices/auth/AuthContext';
import { AccountProvider } from '../slices/account/AccountContext';
import { TransferProvider } from '../slices/transfer/TransferContext';

type InitialEntry = string | { pathname: string; search?: string; hash?: string; state?: unknown; key?: string };

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: InitialEntry[];
}

export function renderWithProviders(
  ui: React.ReactElement,
  { initialEntries = ['/'], ...renderOptions }: ExtendedRenderOptions = {}
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialEntries as string[]}>
        <ThemeProvider>
          <AuthProvider>
            <AccountProvider>
              <TransferProvider>{children}</TransferProvider>
            </AccountProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
