import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as MockService from '../../../services/MockService';

vi.mock('../../../services/MockService');

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in unauthenticated state', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loginError).toBeNull();
    expect(result.current.sessionExpired).toBe(false);
  });

  it('successfully logs in with valid credentials', async () => {
    const mockUser = {
      id: 'usr_1',
      name: 'Kofi Mensah',
      email: 'demo@trusta.io',
      avatarInitials: 'KM',
      accountNumber: '•••• 4821',
    };
    vi.mocked(MockService.simulateAuth).mockResolvedValue({
      success: true,
      user: mockUser,
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@trusta.io', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loginError).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles login failure and sets error message', async () => {
    vi.mocked(MockService.simulateAuth).mockResolvedValue({
      success: false,
      error: 'Invalid email or password.',
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('wrong@trusta.io', 'wrongpass');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loginError).toBe('Invalid email or password.');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles logout and clears session', async () => {
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

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@trusta.io', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('sets and clears session expired state', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setSessionExpired();
    });

    expect(result.current.sessionExpired).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      result.current.clearSessionExpired();
    });

    expect(result.current.sessionExpired).toBe(false);
  });
});
