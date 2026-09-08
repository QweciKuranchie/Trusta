
# Requirements: Trusta Financial Dashboard

## Overview
Trusta is a fictional digital financial platform frontend. It is a single-page application that lets a user log in, view their balance, browse transactions, and send money — with full coverage of every meaningful UI state.

---

## Functional Requirements

### REQ-1: Authentication
- REQ-1.1 — The user can log in with an email and password.
- REQ-1.2 — Invalid credentials must show an inline error without clearing the password field.
- REQ-1.3 — An expired or missing session must redirect the user to Login and display a session-expired banner.
- REQ-1.4 — The user can log out from any authenticated screen.

### REQ-2: Dashboard
- REQ-2.1 — Authenticated users land on a Dashboard that shows their account balance.
- REQ-2.2 — The Dashboard shows a summary of the most recent 3–5 transactions.
- REQ-2.3 — The Dashboard provides navigation to: Transaction History, Send Money.
- REQ-2.4 — Balance and recent transactions must reflect the latest in-memory state (post-send).

### REQ-3: Transaction History
- REQ-3.1 — The Transaction History screen lists all transactions in reverse-chronological order.
- REQ-3.2 — Each list item shows: counterparty name, amount (+ or −), date, and status.
- REQ-3.3 — An empty state is shown when no transactions exist.
- REQ-3.4 — Tapping/clicking a transaction navigates to Transaction Details.

### REQ-4: Transaction Details
- REQ-4.1 — Shows full detail: counterparty, amount, date, transaction ID, status, notes (if any).
- REQ-4.2 — Provides a back navigation to Transaction History.

### REQ-5: Send Money
- REQ-5.1 — The Send Money form accepts: recipient (name or account number), amount, optional note.
- REQ-5.2 — Amount must be validated: numeric, > 0, ≤ available balance.
- REQ-5.3 — Recipient must be non-empty.
- REQ-5.4 — Submitting a valid form navigates to a Confirmation screen.
- REQ-5.5 — Confirmation screen shows a summary; user can confirm or go back to edit.
- REQ-5.6 — On confirm, a Processing state is displayed while the mock transfer executes.
- REQ-5.7 — On simulated success, a Success screen is shown; balance and history update.
- REQ-5.8 — On simulated failure, a Failure screen is shown with a retry option.
- REQ-5.9 — Insufficient funds shows an inline error on the form (not after confirmation).

### REQ-6: State Coverage
- REQ-6.1 — Loading state: shown whenever async data is being fetched/simulated.
- REQ-6.2 — Empty state: shown on Transaction History when the list is empty.
- REQ-6.3 — Network failure state: shown when a simulated network error occurs; includes retry.
- REQ-6.4 — Invalid input state: inline field-level error messages on forms.
- REQ-6.5 — Expired session state: banner on Login if session has expired.
- REQ-6.6 — Processing state: full-screen or modal overlay during send-money execution.
- REQ-6.7 — Success state: dedicated screen after successful transaction.
- REQ-6.8 — Failure state: dedicated screen after failed transaction with retry.

### REQ-7: Responsive Design
- REQ-7.1 — All screens must be usable and visually correct on mobile (≥ 320px) and desktop (≥ 1024px).
- REQ-7.2 — Navigation must adapt appropriately between mobile and desktop layouts.

---

## Non-Functional Requirements

- NFR-1 — The app is entirely client-side; no real backend. All data is mocked in-memory.
- NFR-2 — The app must be built with React + TypeScript + Tailwind CSS.
- NFR-3 — Routing via React Router v6.
- NFR-4 — No external UI component library (custom components only).
- NFR-5 — Code must be clearly structured so a reviewer can understand it without prior context.
- NFR-6 — README must document approach, decisions, limitations, and the "72 hours" answer.

---

## Acceptance Criteria Summary

| ID | Criterion |
|----|-----------|
| AC-1 | Login form validates fields, shows errors, blocks submission until valid |
| AC-2 | Expired session redirects to Login with visible banner |
| AC-3 | Dashboard shows live balance and recent transactions |
| AC-4 | Transaction history is sortable by date (descending default) |
| AC-5 | Send flow: form → confirmation → processing → success/failure |
| AC-6 | Insufficient funds error appears on form, not after confirmation |
| AC-7 | Network failure state with retry is reachable |
| AC-8 | All screens render correctly at 375px and 1280px widths |
| AC-9 | Empty transaction list shows a purposeful empty state |
| AC-10 | Success transaction updates balance and appears in history |
