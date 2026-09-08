import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TransferProvider, useTransfer } from '../TransferContext';
import * as MockService from '../../../services/MockService';
import type { Transaction } from '../../../types';

vi.mock('../../../services/MockService');

describe('TransferContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TransferProvider>{children}</TransferProvider>
  );

  it('starts with initial empty form and idle status', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    expect(result.current.form.recipient).toBe('');
    expect(result.current.form.amount).toBe('');
    expect(result.current.form.note).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.confirmedTransfer).toBeNull();
    expect(result.current.resultTransaction).toBeNull();
  });

  it('updates form fields correctly', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Kwame Nkrumah');
      result.current.updateForm('amount', '150');
      result.current.updateForm('note', 'Lunch payment');
    });

    expect(result.current.form.recipient).toBe('Kwame Nkrumah');
    expect(result.current.form.amount).toBe('150');
    expect(result.current.form.note).toBe('Lunch payment');
  });

  it('validates empty fields and sets errors on submitForm', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    let success = true;
    act(() => {
      success = result.current.submitForm(1000);
    });

    expect(success).toBe(false);
    expect(result.current.errors.recipient).toBeDefined();
    expect(result.current.errors.amount).toBeDefined();
    expect(result.current.confirmedTransfer).toBeNull();
  });

  it('detects insufficient funds at form submit level (INV-1)', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Kojo Antwi');
      result.current.updateForm('amount', '5000');
    });

    let success = true;
    act(() => {
      success = result.current.submitForm(2000); // balance is only 2000
    });

    expect(success).toBe(false);
    expect(result.current.errors.amount).toContain('Insufficient funds');
    expect(result.current.confirmedTransfer).toBeNull();
  });

  it('successfully transitions to confirmed on valid submitForm', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Abena Boateng');
      result.current.updateForm('amount', '450.50');
      result.current.updateForm('note', 'School books');
    });

    let success = false;
    act(() => {
      success = result.current.submitForm(1000);
    });

    expect(success).toBe(true);
    expect(result.current.confirmedTransfer).toEqual({
      recipient: 'Abena Boateng',
      amount: 450.5,
      note: 'School books',
    });
  });

  it('handles successful confirmTransfer and calls onSuccess callback', async () => {
    const mockTx: Transaction = {
      id: 'tx_succ_999',
      type: 'debit',
      counterparty: 'Abena Boateng',
      amount: 450.5,
      date: new Date().toISOString(),
      status: 'completed',
    };

    vi.mocked(MockService.simulateTransfer).mockResolvedValue({
      success: true,
      transaction: mockTx,
    });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Abena Boateng');
      result.current.updateForm('amount', '450.50');
    });

    act(() => {
      result.current.submitForm(1000);
    });

    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current.confirmTransfer(1000, onSuccessMock);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.resultTransaction).toEqual(mockTx);
    expect(onSuccessMock).toHaveBeenCalledWith(450.5, mockTx);
  });

  it('handles network error in confirmTransfer', async () => {
    vi.mocked(MockService.simulateTransfer).mockResolvedValue({
      success: false,
      error: 'network',
    });

    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Abena Boateng');
      result.current.updateForm('amount', '450.50');
    });

    act(() => {
      result.current.submitForm(1000);
    });

    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current.confirmTransfer(1000, onSuccessMock);
    });

    expect(result.current.status).toBe('network_error');
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('retry allows returning status to idle and reset clears state', () => {
    const { result } = renderHook(() => useTransfer(), { wrapper });

    act(() => {
      result.current.updateForm('recipient', 'Test User');
      result.current.updateForm('amount', '100');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.form.recipient).toBe('');
    expect(result.current.form.amount).toBe('');
    expect(result.current.status).toBe('idle');
  });
});
