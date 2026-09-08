/**
 * AuthSlice — Authentication state management.
 *
 * Owns: user identity, session expiry, login errors, loading state.
 * Calls: MockService.simulateAuth
 * Called by: Screens (login/logout), UIShell (auth guard reads isAuthenticated)
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { User } from '../../types';
import { simulateAuth } from '../../services/MockService';

// ── State ───────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  loginError: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  sessionExpired: false,
  loginError: null,
  isLoading: false,
};

// ── Actions ─────────────────────────────────────────────────

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_SESSION_EXPIRED' }
  | { type: 'CLEAR_SESSION_EXPIRED' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, loginError: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
        loginError: null,
        sessionExpired: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, loginError: action.error };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_SESSION_EXPIRED':
      return { ...initialState, sessionExpired: true };
    case 'CLEAR_SESSION_EXPIRED':
      return { ...state, sessionExpired: false };
    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSessionExpired: () => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    const result = await simulateAuth(email, password);
    if (result.success) {
      dispatch({ type: 'LOGIN_SUCCESS', user: result.user });
    } else {
      dispatch({ type: 'LOGIN_FAILURE', error: result.error });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setSessionExpired = useCallback(() => {
    dispatch({ type: 'SET_SESSION_EXPIRED' });
  }, []);

  const clearSessionExpired = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION_EXPIRED' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        setSessionExpired,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
