/**
 * Currency, date, and text formatting utilities for the Trusta dashboard.
 * All currency values use the Ghanaian Cedi (₵).
 */

const CEDI_FORMATTER = new Intl.NumberFormat('en-GH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a number as Ghanaian Cedi — e.g. ₵ 12,450.00 */
export function formatCurrency(amount: number): string {
  return `₵ ${CEDI_FORMATTER.format(amount)}`;
}

/** Format an ISO 8601 date string — e.g. "Sep 8, 2026" */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format an ISO 8601 date string with time — e.g. "Sep 8, 2026 at 2:30 PM" */
export function formatDateTime(isoDate: string): string {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date} at ${time}`;
}

/** Extract initials from a name — e.g. "John Doe" → "JD" */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/** Generate a pseudo-random transaction ID — e.g. "TXN-A3F8B2C1" */
export function generateTransactionId(): string {
  const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
  return `TXN-${hex}`;
}

/** Mask an account number — e.g. "1234567890" → "••••••7890" */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const visible = accountNumber.slice(-4);
  const masked = '••••••';
  return `${masked}${visible}`;
}
