import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shell/ThemeContext';
import { AuthProvider } from './slices/auth/AuthContext';
import { AccountProvider } from './slices/account/AccountContext';
import { TransferProvider } from './slices/transfer/TransferContext';
import { AppRouter } from './shell/AppRouter';
import './index.css';

/**
 * AppProviders — Nests all context providers in one place.
 * Prevents "provider hell" in the render tree.
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <AccountProvider>
        <TransferProvider>
          {children}
        </TransferProvider>
      </AccountProvider>
    </AuthProvider>
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
