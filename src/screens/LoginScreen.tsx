/**
 * LoginScreen — Email + password login form.
 *
 * - Inline validation
 * - Submit button with loading spinner
 * - Error state (red inline message below password)
 * - Expired session banner (amber)
 * - Demo credential hint
 */

import React, { useState } from 'react';
import { Card, Button, Input, ErrorBanner } from '../components';
import { useAuth } from '../slices/auth/AuthContext';

const LoginScreen: React.FC = () => {
  const { login, isLoading, loginError, sessionExpired, clearSessionExpired } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Welcome to Trusta
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Session expired banner */}
        {sessionExpired && (
          <div className="mb-4">
            <ErrorBanner
              variant="warning"
              message="Your session has expired. Please log in again."
              onDismiss={clearSessionExpired}
            />
          </div>
        )}

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="demo@trusta.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={loginError || undefined}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={!isFormValid}
              className="w-full"
            >
              Sign in
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-surface-100 dark:border-surface-700">
            <p className="text-xs text-surface-400 dark:text-surface-500 text-center mb-2">
              Demo credentials
            </p>
            <div className="bg-surface-50 dark:bg-surface-900 rounded-lg p-3 font-mono text-xs text-surface-600 dark:text-surface-300 space-y-1">
              <p>
                <span className="text-surface-400 dark:text-surface-500">Email:</span>{' '}
                demo@trusta.io
              </p>
              <p>
                <span className="text-surface-400 dark:text-surface-500">Password:</span>{' '}
                password123
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
