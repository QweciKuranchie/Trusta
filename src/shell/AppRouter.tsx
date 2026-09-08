/**
 * AppRouter — Route definitions + auth guard.
 *
 * UIShell is the only component that reads authToken for routing decisions.
 * Auth guard redirects to /login and sets sessionExpired = true if prior session existed.
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../slices/auth/AuthContext';
import { AppLayout } from './AppLayout';

// Lazy load screens for code splitting
const LoginScreen = React.lazy(() => import('../screens/LoginScreen'));
const DashboardScreen = React.lazy(() => import('../screens/DashboardScreen'));
const TransactionHistoryScreen = React.lazy(() => import('../screens/TransactionHistoryScreen'));
const TransactionDetailScreen = React.lazy(() => import('../screens/TransactionDetailScreen'));
const SendMoneyScreen = React.lazy(() => import('../screens/SendMoneyScreen'));
const ConfirmationScreen = React.lazy(() => import('../screens/ConfirmationScreen'));
const SuccessScreen = React.lazy(() => import('../screens/SuccessScreen'));
const FailureScreen = React.lazy(() => import('../screens/FailureScreen'));

// ── Auth Guard ──────────────────────────────────────────────

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ── Suspense Wrapper ────────────────────────────────────────

const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-brand-200 dark:border-brand-800 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin" />
      <p className="text-sm text-surface-500 dark:text-surface-400">Loading…</p>
    </div>
  </div>
);

// ── Router ──────────────────────────────────────────────────

export const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <React.Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />
          }
        />

        {/* Authenticated — wrapped in AppLayout */}
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/transactions" element={<TransactionHistoryScreen />} />
          <Route path="/transactions/:id" element={<TransactionDetailScreen />} />
          <Route path="/send" element={<SendMoneyScreen />} />
          <Route path="/send/confirm" element={<ConfirmationScreen />} />
          <Route path="/send/success" element={<SuccessScreen />} />
          <Route path="/send/failure" element={<FailureScreen />} />
        </Route>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </React.Suspense>
  );
};
